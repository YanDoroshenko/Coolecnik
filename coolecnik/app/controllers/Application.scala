package controllers

import java.util.UUID
import javax.inject.Inject

import controllers.Implicits._
import models._
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.Configuration
import util.MailSender
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api.{Database, _}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Application @Inject()(configuration: Configuration) extends Controller {

  private val log = LoggerFactory.getLogger(classOf[Application])

  private val db = Database.forConfig("prod")

  def register: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Registration")
      log.info("Received request: \n" + rq.body)
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

  def login: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Login")
      log.info("Received request: \n" + rq.body)
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

  def resetPassword: Action[JsValue] = Action.async(parse.json) {
    rq =>
      log.info("Password reset")
      log.info("Received request: \n" + rq.body)
      Json.fromJson[PasswordReset](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.filter(_.email === p.email).result
          ).map {
            case l: Iterable[Player@unchecked] if l.nonEmpty =>
              val newPasswd = UUID.randomUUID().toString.split("-").head
              new MailSender(configuration).send(p.email, newPasswd)
              Created(Json.toJson(PasswordReset(p.email, Some(newPasswd))))
            case _ => NotFound("Email " + p.email + " not found")
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
  }

  def updatePassword: Action[JsValue] = Action.async(parse.json) {
    rq =>
      log.info("Password reset")
      log.info("Received request: \n" + rq.body)
      Json.fromJson[PasswordUpdate](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.filter(_.email === p.email).result
          ).flatMap {
            case l: Iterable[Player@unchecked] if l.nonEmpty =>

              val q = for {p_ <- Queries.players if p_.email === p.email} yield p_.passwordHash
              val updateAction = q.update(p.newPassword)

              db.run(updateAction)
                .flatMap(_ =>
                  db.run(Queries.players.filter(_.id === l.head.id).result).map {
                    case ps: Iterable[Player@unchecked] if ps.nonEmpty =>
                      Created(Json.toJson(ps.head))
                    case _ =>
                      NotFound("Email " + p.email + " not found")
                  })
            case _ => Future(NotFound("Email " + p.email + " not found"))
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
  }
}