package models.tables

import java.sql.Timestamp

import models.{Game, Queries}
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class GamesTable(tag: Tag) extends Table[Game](tag, "t_game") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def game_type: Rep[Int] =
    column[Int]("type")

  def player1: Rep[Int] =
    column[Int]("player1")

  def player2: Rep[Int] =
    column[Int]("player2")

  def winner: Rep[Option[Int]] =
    column[Option[Int]]("winner")

  def tournament: Rep[Option[Int]] =
    column[Option[Int]]("tournament")

  def beginning: Rep[Option[Timestamp]] =
    column[Option[Timestamp]]("beginning")

  def end: Rep[Option[Timestamp]] =
    column[Option[Timestamp]]("end")

  def rounds: Rep[Option[Int]] =
    column[Option[Int]]("rounds")

  def carambolesToWin: Rep[Option[Int]] =
    column[Option[Int]]("caramboles_to_win")

  override def * : ProvenShape[Game] =
    (id, game_type, player1, player2, winner, tournament, beginning, end, rounds, carambolesToWin) <>
      (Game.tupled, Game.unapply)

  private def player1Fk =
    foreignKey("game_player1_fk", player1, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def player2Fk =
    foreignKey("game_player2_fk", player2, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def winnerFk =
    foreignKey("game_winner_fk", winner, Queries.players)(_.id.?, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def tournamentFk =
    foreignKey("game_tournament_fk", tournament, Queries.tournaments)(_.id.?, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}