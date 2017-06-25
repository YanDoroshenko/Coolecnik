package controllers

import java.sql.Timestamp
import java.time.LocalDateTime

import models.NewTournament
import models.Queries._
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
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 22.05.2017.
  */
class TournamentController extends Controller {

  private val log = LoggerFactory.getLogger(getClass)

  private val db = Database

  def newTournament: Action[JsValue] = Action.async(parse.json) {
    rq => {
      log.info("New tournament:\n" + rq.body)
      Json.fromJson[NewTournament](rq.body).asOpt match {
        case Some(t) =>
            t.gameType match {
              case 1 if !(t.rounds.isEmpty && t.caramboles.isEmpty) =>
                Future(BadRequest("Rounds and caramboles can be specified for carambole game only"))
              case 2 if t.rounds.nonEmpty && t.caramboles.nonEmpty =>
                Future(BadRequest("Either rounds or caramboles must be specified"))
              case 2 if t.rounds.isEmpty && t.caramboles.isEmpty =>
                Future(BadRequest("Either rounds or caramboles must be specified"))
              case _ =>
                db.run(players.map(_.id).result)
                  .flatMap(ps =>
                    if (t.players.exists(p => !ps.contains(p)))
                      Future(BadRequest("Some players do not exist"))
                    else {
                      db.run(
                        (tournaments.map(t_ => (t_.tournamentType, t_.gameType, t_.title, t_.beginning))
                          returning tournaments.map(_.id)) +=
                          (t.tournamentType, t.gameType, t.title, Timestamp.valueOf(LocalDateTime.now()))
                      )
                        .flatMap(id =>
                          db.run(
                            games.map(g => (
                              g.gameType,
                              g.player1,
                              g.player2,
                              g.tournament,
                              g.rounds,
                              g.carambolesToWin)) ++=
                              (for (i <- t.players; j <- t.players if i < j)
                                yield (t.gameType, i, j, Some(id), t.rounds, t.caramboles))
                          ).map(_ => id)
                        )
                        .flatMap(id =>
                      db.run(
                        tournaments.filter(_.id === id).result
                      )
                        .map(ts => Created(ts.head))
                        )
                    }
                  )
            }
        case None => Future(BadRequest("Request can't be deserialized"))
      }
    }
  }
}
