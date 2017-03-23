package models.tables

import models._
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class StrikesTable(tag: Tag) extends Table[Strike](tag, "t_strike") {
  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def strikeType: Rep[Int] =
    column[Int]("type")

  def game: Rep[Int] =
    column[Int]("game")

  def player: Rep[Int] =
    column[Int]("player")

  def round: Rep[Int] =
    column[Int]("round")

  override def * : ProvenShape[Strike] =
    (id, strikeType, game, player, round) <>
      (Strike.tupled, Strike.unapply)

  private def typeFk =
    foreignKey("strike_type_fk", strikeType, Queries.strikeTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def playerFk =
    foreignKey("strike_player_fk", player, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def gameFk =
    foreignKey("strike_game_fk", game, Queries.games)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}