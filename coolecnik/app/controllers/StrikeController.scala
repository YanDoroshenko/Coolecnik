package controllers

import models.{NewStrike, Queries}
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, Controller}
import slick.driver.PostgresDriver.api.{Database, _}
import util.Implicits._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 31.03.2017.
  */
class StrikeController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[GameTypeController])

  private val db = Database.forConfig("prod")

  def addStrikes: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New game:\n" + rq.body)
      Json.fromJson[Iterable[NewStrike]](rq.body).asOpt match {
        case Some(l) if l.isInstanceOf[Iterable[NewStrike]] =>
          l.map(s =>
            db.run(
              Queries.strikes.map(s_ => (s_.strikeType, s_.game, s_.player, s_.round)) +=
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