package controllers

import models.Queries._
import models.{NewStrike, NewStrikeType}
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, Controller}
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
              case e: PSQLException => Future(NotAcceptable(e.getMessage))
            }
            .flatMap(_ =>
              db.run(strikeTypes.filter(
                st_ => st_.title === st.title)
                .result)
                .map(sts => Created(sts.head)))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def addStrikes: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Strikes:\n" + rq.body)
      Json.fromJson[Iterable[NewStrike]](rq.body).asOpt match {
        case Some(l) if l.isInstanceOf[Iterable[NewStrike]] =>
          l.map(s =>
            db.run(
              strikes.map(s_ => (s_.strikeType, s_.game, s_.player, s_.round)) +=
                NewStrike.unapply(s).get
            )
              .recover {
                case e: PSQLException => Future(NotAcceptable(e.getMessage))
              }
              .map(_ => ())
          )
            .fold(Future(()))((l, r) => l.flatMap(_ => r))
            .map(_ => Created)
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}