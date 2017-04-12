package controllers

import models.Queries._
import play.api.mvc.{Action, _}
import slick.driver.PostgresDriver.api._
import util.Database

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
class DBController extends Controller {

  private val db = Database

  def createSchema: Action[AnyContent] = Action.async {
    createTables
      .map(_ => Ok)
  }

  def createData: Action[AnyContent] = Action.async {
    createGameTypes
      .flatMap(_ => createStrikeTypes)
      .map(_ => Ok)
  }

  private def createTables = db.run(DBIO.seq(
    tournamentTypes.schema.create,
    tournaments.schema.create,
    players.schema.create,
    friendList.schema.create,
    gameTypes.schema.create,
    games.schema.create,
    strikeTypes.schema.create,
    strikes.schema.create)
  )

  private def createGameTypes = {
    db.run(
      gameTypes.map(gt => gt.title) ++= Seq(
        "8 Pool", "carambole"
      )
    )
  }

  private def createStrikeTypes = {
    db.run(
      strikeTypes.map(st => (st.correct, st.gameType, st.title, st.endsGame)) ++= Seq(
        (true, 1, "Correct 8 Pool", Some(false)),
        (false, 1, "Faul1 8 Pool", Some(false)),
        (false, 1, "Faul2 8 Pool", Some(false)),
        (false, 1, "Faul3 8 Pool", Some(false)),
        (false, 1, "Faul4 8 Pool", Some(false)),
        (false, 1, "Faul5 8 Pool", Some(false)),
        (false, 1, "Faul6 8 Pool", Some(false)),
        (false, 1, "Faul7 8 Pool", Some(false)),
        (false, 1, "Faul8 8 Pool", Some(false)),

        (true, 2, "Carambole", Some(false)),
        (false, 2, "Non-carambole", Some(false))
      )
    )
  }
}