package controllers

import java.sql.Timestamp
import java.text.{ParseException, SimpleDateFormat}

import models.Queries._
import models._
import play.api.mvc.{Action, AnyContent, Controller}
import slick.driver.PostgresDriver.api._
import util.Database
import util.HttpWriters._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 12.04.2017.
  */
class StatisticsController extends Controller {

  private val db = Database

  def basicGameStats(id: Int): Action[AnyContent] = Action.async { _ =>
    db.run(
      games.filter(g =>
        (g.player1 === id || g.player2 === id) && g.end.nonEmpty)
        .result)
      .map {
        case gs: Seq[Game] if gs.nonEmpty =>
          val total = gs.size
          val won = gs.count(_.winner == id)
          val draws = gs.count(_.winner == null)
          val lost = total - won - draws
          val totalSecs = gs.map(g => g.end.get.toInstant.getEpochSecond - g.beginning.get.toInstant.getEpochSecond).sum
          Ok(BasicGameStats(total, won, draws, lost, totalSecs))
        case _ => NotFound
      }
  }

  def basicStrike8Stats(id: Int): Action[AnyContent] = Action.async {
    val s = for ((s, st) <- strikes.filter(_.player === id) join strikeTypes on (_.strikeType === _.id) if st.gameType === 1) yield st.correct
    val correct = s.filter(_ === true).size.result
    db.run(s.size.result)
      .flatMap {
        case 0 => Future(NotFound)
        case _s =>
          db.run(correct).map(s_ => Ok(s_.toDouble / _s))
      }
  }

  def basicStrikeCaramboleStats(id: Int): Action[AnyContent] = Action.async {
    val s = for ((s, st) <- strikes.filter(_.player === id) join strikeTypes on (_.strikeType === _.id) if st.gameType === 2) yield st.correct
    val correct = s.filter(_ === true).size.result
    db.run(s.size.result)
      .flatMap {
        case 0 => Future(NotFound)
        case _s =>
          db.run(correct).map(s_ => Ok(s_.toDouble / _s))
      }
  }

  def stats(
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
      Future(BadRequest)
    else if (opponent.nonEmpty && opponent.get == id)
      Future(BadRequest)
    else if (page.isEmpty && pageSize.nonEmpty || page.nonEmpty && pageSize.isEmpty)
      Future(BadRequest)
    else {
      try {
        db.run(games
          .filter(_.end.nonEmpty)
          .filter(g => g.player1 === id || g.player2 === id)
          .filter(g => gameType match {
            case Some("pool8") => g.gameType === 1
            case Some("carambole") => g.gameType === 2
            case None => g.id === g.id
          })
          .filter(g => opponent match {
            case Some(i) => g.player1 === i || g.player2 === i
            case None => g.id === g.id
          })
          .result)
          .map {
            case gs: Seq[Game] if gs.nonEmpty =>
              val format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'Z")
              try {
                val filtered = gs
                  .filter(g => result match {
                    case Some("win") => g.winner.nonEmpty && g.winner.get == id
                    case Some("lose") => g.winner.nonEmpty && g.winner.get != id
                    case Some("draw") => g.winner.isEmpty
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
                val paged =
                  if (page.nonEmpty) sorted.slice((page.get - 1) * pageSize.get, (page.get - 1) * pageSize.get + pageSize.get)
                  else sorted
                Ok(paged)
              }
              catch {
                case _: ParseException => BadRequest
                case _: MatchError => BadRequest
              }
            case _ => NotFound
          }
      }
      catch {
        case _: MatchError => Future(BadRequest)
      }
    }
  }
}