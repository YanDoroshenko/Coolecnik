package controllers

import java.sql.Timestamp
import java.text.SimpleDateFormat

import models.Queries._
import models._
import org.slf4j.LoggerFactory
import play.api.mvc.{Action, AnyContent, Controller}
import slick.driver.PostgresDriver.api._
import util.Database
import util.HttpWriters._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success, Try}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 12.04.2017.
  */
class StatisticsController extends Controller {

  private val log = LoggerFactory.getLogger(classOf[StatisticsController])

  private val db = Database

  def basicGameStats(id: Int): Action[AnyContent] = Action.async { _ =>
    db.run(
      games.filter(g =>
        (g.player1 === id || g.player2 === id) && g.end.nonEmpty)
        .result)
      .map {
        case gs: Seq[Game] if gs.nonEmpty =>
          val total = gs.size
          val won = gs.count(_.winner.contains(id))
          val draws = gs.count(_.winner == null)
          val lost = total - won - draws
          val totalSecs = gs.map(g => g.end.get.toInstant.getEpochSecond - g.beginning.get.toInstant.getEpochSecond).sum
          Ok(BasicGameStats(total, won, draws, lost, totalSecs))
        case _ => NotFound
      }
  }

  def basicStrikeStats(id: Int): Action[AnyContent] = Action.async {
    db.run(
      (for ((s, t) <- strikes
        .filter(_.player === id)
        .groupBy(_.strikeType)
        .map { case (strikeType, ss) => strikeType -> ss.length }
        joinRight strikeTypes on (_._1 === _.id)) yield (
        t.id,
        t.title,
        s.map { case (_, c) => c }))
        .result)
      .map {
        case s: Seq[(Int, String, Option[Int])] if s.nonEmpty => Ok(s.map(u => "\"" + u._2 + "\":" + u._3.getOrElse(0)).mkString("{\n", ",\n", "\n}"))
        case _ => NotFound("Basic 8-pool statistics for the player with id " + id + " not found")
      }
  }


  def opponents(id: Int): Action[AnyContent] = Action.async {
    db.run((for ((g, p) <- games.filter(_.player2 === id) join players on (_.player1 === _.id)) yield p.id -> p.login).result)
      .zip(db.run((for ((g, p) <- games.filter(_.player1 === id) join players on (_.player2 === _.id)) yield p.id -> p.login).result))
      .map(z => (z._1 ++ z._2).distinct.map((Opponent.apply _).tupled(_)))
      .map {
        case os: Seq[Opponent] if os.nonEmpty =>
          Ok(os)
        case _: Iterable[Any] =>
          NotFound
      }
  }

  def statistics(
                  id: Int,
                  gameType: Option[String],
                  opponent: Option[Int],
                  result: Option[String],
                  from: Option[String],
                  to: Option[String],
                  pageSize: Option[Int],
                  page: Option[Int]
                ): Action[AnyContent] = Action.async {
    if (gameType.nonEmpty && gameType.get == "pool8" && result.nonEmpty && result.get == "draw")
      Future(BadRequest("There are no draws in 8-pool"))
    else if (opponent.nonEmpty && opponent.get == id)
      Future(BadRequest("One can't play with oneself"))
    else if (page.isEmpty && pageSize.nonEmpty || page.nonEmpty && pageSize.isEmpty)
      Future(BadRequest("Page number and page size could be only used together"))
    else {

      def process(gs: Seq[Game]) = {
        val format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'Z")
        val filtered = gs
          .filter(g => (result: @unchecked) match {
            case Some("win") => g.winner.nonEmpty && g.winner.get == id
            case Some("lose") => g.winner.nonEmpty && g.winner.get != id
            case Some("draw") => g.winner.isEmpty
            case Some("all") => g.id == g.id
            case None => g.id == g.id
          })
          .filter(g => from match {
            case Some(t) => g.beginning.nonEmpty && g.beginning.get.after(new Timestamp(format.parse(t).getTime))
            case _ => true
          })
          .filter(g => to match {
            case Some(t) => g.beginning.nonEmpty && g.beginning.get.before(new Timestamp(format.parse(t).getTime))
            case _ => true
          })
        val sorted = filtered.sortWith((l, r) => l.beginning.get.after(r.beginning.get))
        val numbered = (sorted.size to 1 by -1).zip(sorted)
        val paged =
          if (page.nonEmpty) numbered.slice((page.get - 1) * pageSize.get, (page.get - 1) * pageSize.get + pageSize.get)
          else numbered
        paged
      }

      Try(
        db.run(games
          .filter(_.end.nonEmpty)
          .filter(g => g.player1 === id || g.player2 === id)
          .filter(g => (gameType: @unchecked) match {
            case Some("pool8") => g.gameType === 1
            case Some("carambole") => g.gameType === 2
            case Some("all") => g.id === g.id
            case None => g.id === g.id
          })
          .filter(g => opponent match {
            case Some(i) => g.player1 === i || g.player2 === i
            case None => g.id === g.id
          })
          .result)
          .flatMap {
            case gs: Seq[Game] if gs.nonEmpty && gameType.isEmpty || gameType.contains("all") =>
              db.run(
                (for ((p, t) <- players joinFull gameTypes) yield (p, t)
                  ).result
              )
                .map(s =>
                  Try(process(gs).map(g => {
                    val number = g._1
                    val game = g._2
                    val opp = if (game.player1 == id) game.player2 else game.player1
                    GameStats(
                      number,
                      game.id,
                      game.gameType,
                      s.map(_._2).filter(_.nonEmpty).map(_.get).find(_.id == game.gameType).get.title,
                      opp,
                      s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == opp).get.login,
                      game.winner,
                      if (game.winner.nonEmpty)
                        Some(s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == game.winner.get).get.login)
                      else
                        None,
                      game.beginning.get,
                      game.end.get)
                  })) match {
                    case Success(stats) => Ok(stats)
                    case Failure(e) => BadRequest(e.getMessage)
                  }
                )
            case gs: Seq[Game] if gs.nonEmpty && gameType.contains("pool8") =>
              val shots = db.run(
                strikes.filter(_.strikeType <= 5).result
              )

              shots.flatMap(ss =>
                db.run(
                  (for ((p, t) <- players joinFull gameTypes) yield (p, t)
                    ).result
                )
                  .map(s =>
                    Try(process(gs).map(g => {
                      val number = g._1
                      val game = g._2
                      val gameShots = ss.filter(_.game == game.id)
                      val opp = if (game.player1 == id) game.player2 else game.player1
                      Pool8Stats(
                        Some(number),
                        game.id,
                        game.gameType,
                        s.map(_._2).filter(_.nonEmpty).map(_.get).find(_.id == game.gameType).get.title,
                        opp,
                        s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == opp).get.login,
                        game.winner,
                        if (game.winner.nonEmpty)
                          Some(s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == game.winner.get).get.login)
                        else
                          None,
                        game.beginning.get,
                        game.end.get,
                        gameShots.count(_.strikeType == 1),
                        gameShots.count(_.strikeType == 2),
                        gameShots.count(_.strikeType == 3),
                        gameShots.count(_.strikeType == 4),
                        gameShots.count(_.strikeType == 5))
                    }
                    )) match {
                      case Success(s_) => Ok(s_)
                      case Failure(e) => BadRequest(e.getMessage)
                    })
              )
            case gs: Seq[Game] if gs.nonEmpty && gameType.contains("carambole") =>
              val shots = db.run(
                strikes.filter(s => s.strikeType === 11 || s.strikeType === 12).result
              )

              shots.flatMap(ss =>
                db.run(
                  (for ((p, t) <- players joinFull gameTypes) yield (p, t)
                    ).result
                )
                  .map(s =>
                    Try(process(gs).map(g => {
                      val number = g._1
                      val game = g._2
                      val gameShots = ss.filter(_.game == game.id)
                      val opp = if (game.player1 == id) game.player2 else game.player1
                      CaramboleStats(
                        Some(number),
                        game.id,
                        game.gameType,
                        s.map(_._2).filter(_.nonEmpty).map(_.get).find(_.id == game.gameType).get.title,
                        opp,
                        s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == opp).get.login,
                        game.winner,
                        if (game.winner.nonEmpty)
                          Some(s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == game.winner.get).get.login)
                        else
                          None,
                        if (gameShots.isEmpty) 0
                        else gameShots.maxBy(_.round).round,
                        game.beginning.get,
                        game.end.get,
                        gameShots.count(s => s.player == id && s.strikeType == 11),
                        gameShots.count(s => s.player == opp && s.strikeType == 11),
                        gameShots.count(s => s.player == id && s.strikeType == 12),
                        gameShots.count(s => s.player == opp && s.strikeType == 12))
                    }
                    )) match {
                      case Success(s_) => Ok(s_)
                      case Failure(e) => BadRequest(e.getMessage)
                    })
              )
            case _: Iterable[Any] => Future(NotFound)
          }) match {
        case Success(r) => r
        case Failure(e) => Future(BadRequest(e.getMessage))
      }
    }
  }

  def pages(
             id: Int,
             gameType: Option[String],
             opponent: Option[Int],
             result: Option[String],
             from: Option[String],
             to: Option[String],
             pageSize: Int
           ): Action[AnyContent] = Action.async {
    if (gameType.nonEmpty && gameType.get == "pool8" && result.nonEmpty && result.get == "draw")
      Future(BadRequest("There are no draws in 8-pool"))
    else if (opponent.nonEmpty && opponent.get == id)
      Future(BadRequest("One can't play with oneself"))
    else {

      def process(gs: Seq[Game]) = {
        val format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'Z")
        val filtered = gs
          .filter(g => (result: @unchecked) match {
            case Some("win") => g.winner.nonEmpty && g.winner.get == id
            case Some("lose") => g.winner.nonEmpty && g.winner.get != id
            case Some("draw") => g.winner.isEmpty
            case Some("all") => g.id == g.id
            case None => g.id == g.id
          })
          .filter(g => from match {
            case Some(t) => g.beginning.nonEmpty && g.beginning.get.after(new Timestamp(format.parse(t).getTime))
            case _ => true
          })
          .filter(g => to match {
            case Some(t) => g.beginning.nonEmpty && g.beginning.get.before(new Timestamp(format.parse(t).getTime))
            case _ => true
          })
        val sorted = filtered.sortWith((l, r) => l.beginning.get.after(r.beginning.get))
        val numbered = (sorted.size to 1 by -1).zip(sorted)
        numbered
      }

      Try(
        db.run(games
          .filter(_.end.nonEmpty)
          .filter(g => g.player1 === id || g.player2 === id)
          .filter(g => (gameType: @unchecked) match {
            case Some("pool8") => g.gameType === 1
            case Some("carambole") => g.gameType === 2
            case Some("all") => g.id === g.id
            case None => g.id === g.id
          })
          .filter(g => opponent match {
            case Some(i) => g.player1 === i || g.player2 === i
            case None => g.id === g.id
          })
          .result)
          .flatMap {
            case gs: Seq[Game] if gs.nonEmpty =>
              Future(Ok(Math.ceil(process(gs).size.toDouble / pageSize)))
            case _: Iterable[Any] => Future(NotFound)
          }) match {
        case Success(r) => r
        case Failure(e) => Future(BadRequest(e.getMessage))
      }
    }
  }

  def details(playerId: Int, gameId: Int): Action[AnyContent] = Action.async {
    db.run(
      players.filter(_.id === playerId).exists.result
    )
      .flatMap {
        case true =>
          db.run(
            games.filter(g => g.id === gameId && (g.player1 === playerId || g.player2 === playerId)).result
          )
            .flatMap {
              case gs: Seq[Game] if gs.size == 1 && gs.head.gameType == 1 =>
                val g = gs.head
                val opp = if (g.player1 == playerId) g.player2 else g.player1
                db.run(
                  (for ((p, t) <- players.filter(
                    if (g.winner.nonEmpty)
                      p => p.id === opp || p.id === g.winner.get
                    else
                      p => p.id === opp
                  ).joinFull(gameTypes.filter(_.id === g.gameType))
                  ) yield
                    p -> t
                    ).result
                )
                  .flatMap(pts => {
                    val ps = pts.map(_._1).filter(_.nonEmpty).map(_.get)
                    val t = pts.map(_._2).map(_.get).head
                    val shots = db.run(
                      strikes.filter(s => s.strikeType <= 5 && s.game === g.id).result
                    )

                    shots.flatMap(ss =>
                      db.run(
                        (for ((p, t) <- players joinFull gameTypes) yield (p, t)
                          ).result
                      )
                        .map(s => {
                          Ok(Pool8Stats(
                            None,
                            g.id,
                            g.gameType,
                            s.map(_._2).filter(_.nonEmpty).map(_.get).find(_.id == g.gameType).get.title,
                            opp,
                            s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == opp).get.login,
                            g.winner,
                            if (g.winner.nonEmpty)
                              Some(s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == g.winner.get).get.login)
                            else
                              None,
                            g.beginning.get,
                            g.end.get,
                            ss.count(_.strikeType == 1),
                            ss.count(_.strikeType == 2),
                            ss.count(_.strikeType == 3),
                            ss.count(_.strikeType == 4),
                            ss.count(_.strikeType == 5)))
                        }))
                  })
              case gs: Seq[Game] if gs.size == 1 && gs.head.gameType == 2 =>
                val g = gs.head
                val opp = if (g.player1 == playerId) g.player2 else g.player1
                db.run(
                  (for ((p, t) <- players.filter(
                    if (g.winner.nonEmpty)
                      p => p.id === opp || p.id === g.winner.get
                    else
                      p => p.id === opp
                  ).joinFull(gameTypes.filter(_.id === g.gameType))
                  ) yield
                    p -> t
                    ).result
                )
                  .flatMap(pts => {
                    val ps = pts.map(_._1).filter(_.nonEmpty).map(_.get)
                    val t = pts.map(_._2).map(_.get).head
                    val shots = db.run(
                      strikes.filter(s => (s.strikeType === 11 || s.strikeType === 12) && s.game === g.id).result
                    )

                    shots.flatMap(ss =>
                      db.run(
                        (for ((p, t) <- players joinFull gameTypes) yield (p, t)
                          ).result)
                        .map(s => {
                          Ok(CaramboleStats(
                            None,
                            g.id,
                            g.gameType,
                            s.map(_._2).filter(_.nonEmpty).map(_.get).find(_.id == g.gameType).get.title,
                            opp,
                            s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == opp).get.login,
                            g.winner,
                            if (g.winner.nonEmpty)
                              Some(s.map(_._1).filter(_.nonEmpty).map(_.get).find(_.id == g.winner.get).get.login)
                            else
                              None,
                            if (ss.isEmpty) 0
                            else ss.maxBy(_.round).round,
                            g.beginning.get,
                            g.end.get,
                            ss.count(s => s.player == playerId && s.strikeType == 11),
                            ss.count(s => s.player == opp && s.strikeType == 11),
                            ss.count(s => s.player == playerId && s.strikeType == 12),
                            ss.count(s => s.player == opp && s.strikeType == 12)))
                        }))
                  })
              case _ => Future(NotFound("Game with id " + gameId + " not found for player " + playerId))
            }
        case false => Future(NotFound("Player with id " + playerId + " not found"))
      }
  }
}