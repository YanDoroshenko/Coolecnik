package controllers

import models.{NewStrikeType, Queries}
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
class StrikeTypeController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[StrikeTypeController])

  private val db = Database.forConfig("prod")

  def newStrikeType: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New strike type:\n" + rq.body)
      Json.fromJson[NewStrikeType](rq.body).asOpt match {
        case Some(st) =>
          db.run(
            Queries.strikeTypes.map(
              st_ => (st_.gameType, st_.title, st_.description, st_.endsGame)) +=
              (st.gameType, st.title, st.description, st.endsGame))
            .recover {
              case e: PSQLException => Future(NotAcceptable(e.getMessage))
            }
            .flatMap(_ =>
              db.run(Queries.strikeTypes.filter(
                st_ => st_.title === st.title)
                .result)
                .map(st_ => Created(Json.toJson(st_))))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}