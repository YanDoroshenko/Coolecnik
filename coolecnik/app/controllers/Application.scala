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

  private val log = LoggerFactory.getLogger(classOf[Application])

  private val db = Database.forConfig("dev")

  def register = Action.async(parse.json) { rq => {
    log.info("Registration")
    log.info("Recieved request: \n" + rq.body)
    Json.fromJson[Registration](rq.body).asOpt match {
      case Some(p) =>
        db.run(
          Queries.players.map(
            p0 =>
              (p0.login, p0.email, p0.passwordHash, p0.firstName, p0.lastName)) +=
            Registration.unapply(p).get
        ).recover {
          case e: PSQLException => Future(NotAcceptable(e.getMessage))
        }.flatMap {
          case r: Future[Status@unchecked] => r
          case _ =>
            db.run(Queries.players.filter(_.login === p.login).result).map(
              p_ => Created(Json.toJson(p_))
            )
        }
      case None => Future(BadRequest("Request can't be deserialized"))
    }
  }
  }

  def login = Action.async(parse.json) { rq => {
    log.info("Login")
    log.info("Recieved request: \n" + rq.body)
    Json.fromJson[Login](rq.body).asOpt match {
      case Some(p) =>
        db.run(
          Queries.players.filter(p0 => p0.login === p.login && p0.passwordHash === p.passwordHash).result
        ).map {
          case l: Iterable[Player@unchecked] if l.nonEmpty => Accepted
          case _ => Unauthorized("Bad credentials")
        }
      case None => Future(BadRequest("Request can't be deserialized"))
    }
  }
  }

  def createSchema = Action {
    new DBUtils(db).createSchema
    Ok
  }
}