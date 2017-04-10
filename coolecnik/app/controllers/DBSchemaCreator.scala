package controllers

import models.Queries
import play.api.mvc.{Action, _}
import slick.driver.PostgresDriver.api._
import util.Database

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
class DBSchemaCreator extends Controller {

  private val db = Database

  def createSchema: Action[AnyContent] = Action.async {
    createTables
      .flatMap(_ => createConstraints)
      .map(_ => Ok)
  }

  private def createTables = db.run(DBIO.seq(
    Queries.tournamentTypes.schema.create,
    Queries.tournaments.schema.create,
    Queries.players.schema.create,
    Queries.friendList.schema.create,
    Queries.gameTypes.schema.create,
    Queries.games.schema.create,
    Queries.strikeTypes.schema.create,
    Queries.strikes.schema.create)
  )

  private def createConstraints = db.run(DBIO.seq(
    sqlu"""ALTER TABLE t_player ADD CONSTRAINT player_login UNIQUE (login);""",
    sqlu"""ALTER TABLE t_player ADD CONSTRAINT player_email UNIQUE (email);""",
    sqlu"""ALTER TABLE t_game_type ADD CONSTRAINT game_type_title UNIQUE (title);""",
    sqlu"""ALTER TABLE t_strike_type ADD CONSTRAINT strike_type_title UNIQUE (title);""",
    sqlu"""ALTER TABLE t_tournament_type ADD CONSTRAINT tournament_type_title UNIQUE (title);""",
    sqlu"""ALTER TABLE t_tournament ADD CONSTRAINT tournament_title UNIQUE (title);""",
    sqlu"""ALTER TABLE t_game ADD CONSTRAINT game_players UNIQUE (player1, player2, beginning);"""
  )
  )
}
