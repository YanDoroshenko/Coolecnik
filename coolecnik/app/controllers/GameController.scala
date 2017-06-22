package controllers

import java.sql.Timestamp
import java.time.LocalDateTime

import models.Queries._
import models._
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
import scala.util.{Failure, Success, Try}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 30.03.2017.
  */
class GameController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[GameController])

  private val db = Database

  def newGameType: Action[JsValue] = Action.async(parse.json) {
    rq => {
      Try {
        log.info("New game type:\n" + rq.body)
        Json.fromJson[NewGameType](rq.body).asOpt match {
          case Some(g) =>
            db.run(
              gameTypes.map(
                g_ => {
                  (g_.title, g_.description)
                }) +=
                (g.title, g.description)
            )
              .recover {
                case e: PSQLException => e
              }
              .flatMap {
                case e: PSQLException => Future(Conflict(e.getMessage))
                case _ =>
                  db.run(gameTypes.filter(
                    g_ => g_.title === g.title)
                    .result)
                    .map(gs => Created(gs.head))
              }
          case None => Future(BadRequest("Request can't be deserialized"))
        }
      } match {
        case Success(v) => v
        case Failure(e) => Future(BadRequest(e.getMessage))
      }
    }
  }

  def newGame: Action[JsValue] = Action.async(parse.json) {
    rq => {
      Try {
        log.info("New game:\n" + rq.body)
        Json.fromJson[NewGame](rq.body).asOpt match {
          case Some(g) =>
            db.run(
              (games.map(
                g_ => (
                  g_.gameType,
                  g_.player1,
                  g_.player2,
                  g_.beginning,
                  g_.tournament,
                  g_.rounds,
                  g_.carambolesToWin))
                returning games.map(_.id)) +=
                (g.gameType, g.player1, g.player2, Some(g.beginning), g.tournament, g.rounds, g.carambolesToWin)
            )
              .recover {
                case e: PSQLException => e
              }
              .flatMap {
                case e: PSQLException => Future(Conflict(e.getMessage))
                case id: Int =>
                  db.run(games.filter(_.id === id).result)
                    .map(gs => Created(gs.head))
              }
          case None => Future(BadRequest("Request can't be deserialized"))
        }
      } match {
        case Success(v) => v
        case Failure(e) => Future(BadRequest(e.getMessage))
      }
    }
  }

  def endGame(id: Int): Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("End game:\n" + rq.body)
      Json.fromJson[EndGame](rq.body).asOpt match {
        case Some(e) =>
          db.run(
            games.filter(r => r.id === id && r.beginning.nonEmpty && r.end.isEmpty).result.map {
              case Seq(g) =>
                db.run(
                  games.filter(r => r.id === id).map(g => g.end -> g.winner)
                    .update(Some(e.end) -> e.winner))
                  .flatMap(_ =>
                    g match {
                      case Game(_, _, _, _, _, Some(t), _, None, _, _) =>
                        db.run(
                          ((games.filter(g => g.tournament === t && g.end.isEmpty).exists === false) &&
                            (tournaments.filter(t_ => t_.id === t && t_.end.isEmpty).exists === true))
                            .result
                        )
                          .flatMap {
                            case true =>
                              db.run(
                                tournaments.filter(_.id === t).map(_.end).update(Some(Timestamp.valueOf(LocalDateTime.now())))
                              )
                            case _ => Future(None)
                          }
                      case _ => Future(None)
                    })
              case _ =>
                new IllegalStateException("Game has already been ended")
            })
            .flatMap {
              case e: IllegalStateException => Future(Conflict(e.getMessage))
              case e: PSQLException => Future(Conflict(e.getMessage))
              case _ =>
                db.run(games.filter(_.id === id).result)
                  .map(gs => Ok(gs.head))
            }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}