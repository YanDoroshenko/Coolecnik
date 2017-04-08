package controllers

import java.util.UUID
import javax.inject.Inject

import models._
import org.postgresql.util.PSQLException
import org.slf4j.LoggerFactory
import play.api.Configuration
import util.HttpWriters._
import util.JsonSerializers._
import util.{Database, MailSender}
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


class PlayerController @Inject()(configuration: Configuration) extends Controller {

  private val log = LoggerFactory.getLogger(classOf[PlayerController])

  private val db = Database

  def register: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Registration:\n" + rq.body)
      Json.fromJson[Registration](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.map(
              p_ => (p_.login, p_.email, p_.passwordHash, p_.firstName, p_.lastName)) +=
              Registration.unapply(p).get
          ).recover {
            case e: PSQLException => Future(NotAcceptable(e.getMessage))
          }.flatMap {
            case r: Future[Status@unchecked] => r
            case _ =>
              db.run(Queries.players.filter(_.login === p.login).result).map(
                ps => Created(ps.head)
              )
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def login: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("Login:\n" + rq.body)
      Json.fromJson[Login](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.filter(p_ => p_.login === p.login && p_.passwordHash === p.passwordHash).result
          ).map {
            case l: Iterable[Player@unchecked] if l.nonEmpty => Accepted(l.head)
            case _ => Unauthorized("Bad credentials")
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def resetPassword: Action[JsValue] = Action.async(parse.json) {
    rq =>
      log.info("Password reset:\n" + rq.body)
      Json.fromJson[PasswordReset](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.filter(_.email === p.email).result
          ).flatMap {
            case l: Iterable[Player@unchecked] if l.nonEmpty =>
              val newPasswd = UUID.randomUUID().toString.split("-").head
              new MailSender(configuration).send(p.email, newPasswd)
              val q = for {p_ <- Queries.players if p_.email === p.email} yield p_.passwordHash
              val updateAction = q.update(newPasswd)

              db.run(updateAction).map(_ => Accepted(Json.toJson(PasswordReset(p.email, Some(newPasswd)))))
            case _ => Future(NotFound("Email " + p.email + " not found"))
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
  }

  def updatePassword: Action[JsValue] = Action.async(parse.json) {
    rq =>
      log.info("Password update:\n" + rq.body)
      Json.fromJson[PasswordUpdate](rq.body).asOpt match {
        case Some(p) =>
          db.run(
            Queries.players.filter(p_ => p_.email === p.email).result
          ).flatMap {
            case l: Iterable[Player@unchecked] if l.nonEmpty && l.head.passwordHash == p.oldPassword =>

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
            case l: Iterable[Player@unchecked] if l.nonEmpty => Future(Unauthorized("Wrong recovery password"))
            case _ => Future(NotFound("Email " + p.email + " not found"))
          }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
  }
}