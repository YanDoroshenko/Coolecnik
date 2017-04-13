package controllers

import models.Queries._
import models.{GameType, StrikeType}
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
      gameTypes ++= Seq(
        GameType(1, "8pool", Some("8pool is a kind of pools. This game is playerd by 2 players with 15 balls. One of the players has 1-7 solid-coloured balls, the second player has 9-15 balls with striped, ball 8 is neutral. The winner of this game is a player who shot all of his balls to the pocket and ball 8 as well. For more information see rules!")),
        GameType(2, "Carambole", Some("Carabole is a game played by 2 players with 3 balls. One of the players has red the second one yellow(white with yellow dot), white ball is neutral. Goal of this game is to make as much as possible caramboles. For more information see rules!"))
      )
    )
  }

  private def createStrikeTypes = {
    db.run(
      strikeTypes ++= Seq(
        StrikeType(1, true, 1, "correct_8pool", Some("player shot the correct ball, same player continues"), false),
        StrikeType(2, false, 1, "wront_shot_8pool", Some("'player shot, but ball did not go to pocket, other players turn"), false),
        StrikeType(3, false, 1, "foul_with_white", Some("cue(white) ball scratch or off the table"), false),
        StrikeType(4, false, 1, "foul_with_others_ball", Some("foul_with_others_ball', 'in those games which require the first object ball struck to be a particular ball or one of a group of balls, it is a foul for the cue ball to first contact any other ball"), false),
        StrikeType(5, false, 1, "foul_other", Some("other kind of foul"), false),
        StrikeType(6, true, 1, "game_end_correctly", Some("direct end of the game, win of a player who shot all of his balls to the correct pocket and ball 8 too, PLAYER WON"), true),
        StrikeType(7, false, 1, "8ball_foul_at_racking", Some("direct end of the game, player who pockets the eight ball and fouls, PLAYER LOST"), true),
        StrikeType(8, false, 1, "8ball_racked_too_early", Some("direct end of the game, player pockets the eight ball before his group is cleared, PLAYER LOST"), true),
        StrikeType(9, false, 1, "8ball_to_wrong_hole", Some("direct end of the game, player pockets the eight ball in an uncalled pocket, PLAYER LOST"), true),
        StrikeType(10, false, 1, "8ball_out_of_table", Some("direct end of the game, player drives the eight ball off the table, PLAYER LOST"), true),

        StrikeType(11, true, 2, "correct_carambole", Some("correct carambole, player continues"), false),
        StrikeType(12, false, 2, "foul_carambole", Some("foul at shot, other players turn"), false)
      )
    )
  }
}