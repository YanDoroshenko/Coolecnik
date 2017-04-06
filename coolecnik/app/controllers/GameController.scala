package controllers

import models.{NewGame, NewGameType, Queries}
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
            Queries.games.map(
              g_ => {
                (g_.gameType, g_.player1, g_.player2, g_.beginning, g_.tournament, g_.rounds, g_.carambolesToWin)
              }) +=
              (g.gameType, g.player1, g.player2, Some(g.beginning), g.tournament, g.rounds, g.carambolesToWin)
          ).recover {
            case e: PSQLException => Future(NotAcceptable(e.getMessage))
          }
            .flatMap(_ =>
              db.run(Queries.games.filter(
                g_ => g_.player1 === g.player1 && g_.player2 === g.player2 && g_.beginning === g.beginning)
                .result)
                .map(gs => Created(gs.head)))
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}