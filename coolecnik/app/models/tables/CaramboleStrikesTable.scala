package models.tables

import models.{CaramboleStrike, Queries}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class CaramboleStrikesTable(tag: Tag) extends Table[CaramboleStrike](tag, "t_c_strike") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def game = column[Int]("game")

  def player = column[Int]("player")

  def correct = column[Boolean]("correct")

  def round = column[Int]("round")

  override def * = (id, game, player, correct, round) <> (CaramboleStrike.tupled, CaramboleStrike.unapply)

  def playerFk = foreignKey("c_strike_player_fk", player, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def gameFk = foreignKey("c_strike_game_fk", game, Queries.games)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}