package controllers

import java.util.UUID
import javax.inject.Inject

import models.Queries._
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
            players.map(
              p_ => (p_.login, p_.email, p_.passwordHash, p_.firstName, p_.lastName)) +=
              Registration.unapply(p).get
          ).recover {
            case e: PSQLException => e
          }
            .flatMap {
              case e: PSQLException => Future(Conflict(e.getMessage))
              case _ =>
                db.run(players.filter(_.login === p.login).result).map(
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
            players.filter(p_ => p_.login === p.login && p_.passwordHash === p.passwordHash).result
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
            players.filter(_.email === p.email).result
          ).flatMap {
            case l: Iterable[Player@unchecked] if l.nonEmpty =>
              val newPasswd = UUID.randomUUID().toString.split("-").head
              new MailSender(configuration).send(p.email, newPasswd)
              val q = for {p_ <- players if p_.email === p.email} yield p_.passwordHash
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
            players.filter(p_ => p_.email === p.email).result
          ).flatMap {
            case l: Iterable[Player@unchecked] if l.nonEmpty && l.head.passwordHash == p.oldPassword =>

              val q = for {p_ <- players if p_.email === p.email} yield p_.passwordHash
              val updateAction = q.update(p.newPassword)

              db.run(updateAction)
                .flatMap(_ =>
                  db.run(players.filter(_.id === l.head.id).result).map {
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

  def befriend(playerId: Int, friendId: Int): Action[AnyContent] = Action.async {
    db.run(
      players.filter(p => p.id === playerId || p.id === friendId).size.result
    ).flatMap {
      case 2 =>
        db.run(
          friendList += Friendship(playerId, friendId))
          .recover {
            case e: PSQLException => e
          }
          .flatMap {
            case e: PSQLException => Future(Conflict(e.getMessage))
            case _ =>
              db.run(friendList.filter(_.playerId === playerId).result)
                .map(fl => Ok(fl))
          }
      case _ => Future(NotFound)
    }
  }

  def unfriend(playerId: Int, friendId: Int): Action[AnyContent] = Action.async {
    db.run(
      friendList.filter(f => f.playerId === playerId && f.friendId === friendId).exists.result
    ).flatMap {
      case true =>
        db.run(
          friendList.filter(f => f.playerId === playerId && f.friendId === friendId).delete)
          .flatMap(_ =>
            db.run(friendList.filter(_.playerId === playerId).result)
              .map(_ => NoContent))
      case _ => Future(NotFound)
    }
  }

  def getFriends(id: Int): Action[AnyContent] = Action.async {
    db.run(
      (for {(fl, p) <- friendList.filter(_.playerId === id) join players on (_.friendId === _.id)} yield (fl.friendId, p.login)).result
    )
      .map {
        case fs: Iterable[(Int, String)] if fs.nonEmpty =>
          Ok(fs.map(p => Friend(p._1, p._2)))
        case _ => NotFound
      }
  }
}