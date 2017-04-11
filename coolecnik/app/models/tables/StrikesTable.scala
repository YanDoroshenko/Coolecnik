package models.tables

import models._
import slick.driver.PostgresDriver.api._
import slick.lifted.{ForeignKeyQuery, ProvenShape}

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

  def typeFk: ForeignKeyQuery[StrikeTypesTable, StrikeType] =
    foreignKey("strike_type_fk", strikeType, Queries.strikeTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def playerFk: ForeignKeyQuery[PlayersTable, Player] =
    foreignKey("strike_player_fk", player, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def gameFk: ForeignKeyQuery[GamesTable, Game] =
    foreignKey("strike_game_fk", game, Queries.games)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}