package controllers

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

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 30.03.2017.
  */
class GameController extends Controller {
  private val log = LoggerFactory.getLogger(classOf[GameController])

  private val db = Database

  def newGameType: Action[JsValue] = Action.async(parse.json) {
    rq => {
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
              case e: PSQLException => Future(NotAcceptable(e.getMessage))
            }
            .flatMap(_ =>
              db.run(gameTypes.filter(
                g_ => g_.title === g.title)
                .result)
                .map(gs => Created(gs.head)))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def newGame: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New game:\n" + rq.body)
      Json.fromJson[NewGame](rq.body).asOpt match {
        case Some(g) =>
          db.run(
            games.map(
              g_ => {
                (g_.gameType, g_.player1, g_.player2, g_.beginning, g_.tournament, g_.rounds, g_.carambolesToWin)
              }) +=
              (g.gameType, g.player1, g.player2, Some(g.beginning), g.tournament, g.rounds, g.carambolesToWin)
          ).recover {
            case e: PSQLException => Future(NotAcceptable(e.getMessage))
          }
            .flatMap(_ =>
              db.run(games.filter(
                g_ => g_.player1 === g.player1 && g_.player2 === g.player2 && g_.beginning === g.beginning)
                .result)
                .map(gs => Created(gs.head)))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }

  def endGame(id: Int): Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("End game:\n" + rq.body)
      Json.fromJson[EndGame](rq.body).asOpt match {
        case Some(e) =>
          db.run(
            games.filter(r => r.id === id && r.end.isEmpty).result.map {
              case rs: Iterable[Game] if rs.nonEmpty =>
                db.run(
                  games.filter(r => r.id === id).map(_.end)
                    .update(Some(e.end)))
              case _ =>
                new IllegalStateException("Game has already been ended")
            })
            .flatMap {
              case e: IllegalStateException => Future(Conflict(e.getMessage))
              case e: PSQLException => Future(NotAcceptable(e.getMessage))
              case _ =>
                db.run(games.filter(_.id === id).result)
                  .map(gs => Ok(gs.head))
            }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}