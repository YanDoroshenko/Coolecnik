package controllers

import controllers.Implicits._
import models._
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api.{Database, _}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application extends Controller {

  val log = LoggerFactory.getLogger(classOf[Application])

  def register = Action.async(parse.json) { rq => {
    log.warn("Recieved request: \n" + rq.body)
    val db = Database.forConfig("prod")
    Json.fromJson[PlayerJson](rq.body).asOpt match {
      case Some(p) =>
        db.run(
          Queries.players.map(
            p0 =>
              (p0.login, p0.email, p0.passwordHash, p0.firstName, p0.lastName)) +=
            PlayerJson.unapply(p).get
        ).recover {
          case _: PSQLException => Future(Conflict("409"))
        }.flatMap {
          case r: Future[Status @unchecked] => r
          case _ =>
            db.run(Queries.players.filter(_.login === p.login).result).map(
              id => Created(Json.toJson(id))
            )
        }
      case None => Future(BadRequest("400"))
    }
  }
  }
}