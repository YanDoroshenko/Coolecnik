package controllers

import models.{NewGameType, Queries}
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{Action, Controller}
import slick.driver.PostgresDriver.api.{Database, _}
import util.Implicits._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 30.03.2017.
  */
class GameTypeController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[GameTypeController])

  private val db = Database.forConfig("prod")

  def newGameType: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New game type:\n" + rq.body)
      Json.fromJson[NewGameType](rq.body).asOpt match {
        case Some(g) =>
          db.run(
            Queries.gameTypes.map(
              g_ => {
                (g_.title, g_.description)
              }) +=
              (g.title, g.description)
          )
            .recover {
              case e: PSQLException => Future(NotAcceptable(e.getMessage))
            }
            .flatMap(_ =>
              db.run(Queries.gameTypes.filter(
                g_ => g_.title === g.title)
                .result)
                .map(g_ => Created(Json.toJson(g_))))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}