package models.tables

import java.sql.Timestamp

import models.{Game, Queries}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class GamesTable(tag: Tag) extends Table[Game](tag, "t_game") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def game_type = column[Int]("type")

  def player1 = column[Int]("player1")

  def player2 = column[Int]("player2")

  def winner = column[Option[Int]]("winner")

  def beginning = column[Timestamp]("beginning")

  def end = column[Option[Timestamp]]("end")

  def rounds = column[Option[Int]]("rounds")

  def carambolesToWin = column[Option[Int]]("caramboles_to_win")

  override def * = (id, game_type, player1, player2, winner, beginning, end, rounds, carambolesToWin) <> (Game.tupled, Game.unapply)

  def player1Fk = foreignKey("game_player1_fk", player1, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def player2Fk = foreignKey("game_player2_fk", player2, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def winnerFk = foreignKey("game_winner_fk", winner, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}