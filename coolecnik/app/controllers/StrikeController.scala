package controllers

import models.Queries._
import models._
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, AnyContent, Controller}
import slick.driver.PostgresDriver.api._
import util.Database
import util.HttpWriters._
import util.JsonSerializers._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 31.03.2017.
  */
class StrikeController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[StrikeController])

  private val db = Database

  def newStrikeType: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New strike type:\n" + rq.body)
      Json.fromJson[NewStrikeType](rq.body).asOpt match {
        case Some(st) =>
          db.run(
            strikeTypes.map(
              st_ => (st_.gameType, st_.correct, st_.title, st_.description, st_.endsGame)) +=
              (st.gameType, st.correct, st.title, st.description, st.endsGame))
            .recover {
              case e: PSQLException => e
            }
            .flatMap {
              case e: PSQLException => Future(Conflict(e.getMessage))
              case _ =>
                db.run(strikeTypes.filter(
                  st_ => st_.title === st.title)
                  .result)
                  .map(sts => Created(sts.head))
            }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def addStrikes: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Strikes:\n" + rq.body)
      Json.fromJson[Iterable[NewStrike]](rq.body).asOpt match {
        case Some(l) if l.isInstanceOf[Iterable[NewStrike]] =>
          db.run(
            strikes.map(s_ => (s_.strikeType, s_.game, s_.player, s_.round)) ++=
              l.map(s => NewStrike.unapply(s).get))
            .recover {
              case e: PSQLException => e
            }
            .flatMap {
              case e: PSQLException => Future(Conflict(e.getMessage))
              case _ => Future(Created)
            }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def getStrikes(id: Int): Action[AnyContent] = Action.async {
    log.info("Strikes for the game " + id)
    db.run(
      games.filter(_.id === id).result
    )
      .flatMap {
        case gs: Seq[Game] if gs.nonEmpty =>
          db.run(((for ((s, p) <- strikes.filter(_.game === id) join players on (_.player === _.id)) yield
            Tuple6(s.id, s.strikeType, s.game, s.player, p.login, s.round)) joinFull strikeTypes.map(t => t.id -> t.title)).result)
            .map {
              case ss: Seq[(Option[(Int, Int, Int, Int, String, Int)], Option[(Int, String)])] if ss.nonEmpty =>
                val strikes = ss.map(_._1).filter(_.nonEmpty).map(_.get).distinct
                val types = ss.map(_._2).filter(_.nonEmpty).map(_.get).distinct
                Ok(strikes.map(s =>
                  StrikeDetail(s._1, s._2, types.find(_._1 == s._2).get._2, s._3, s._4, s._5, s._6)))
              case _ => NotFound("Game has no strikes")
            }
        case _ => Future(NotFound("Game with id " + id + " not found"))
      }
  }
}