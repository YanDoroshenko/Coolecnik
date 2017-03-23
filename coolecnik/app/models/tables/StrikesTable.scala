package models.tables

import models.{Queries, Strike}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class StrikesTable(tag: Tag) extends Table[Strike](tag, "t_strike") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def strikeType = column[Int]("type")

  def game = column[Int]("game")

  def player = column[Int]("player")

  def round = column[Int]("round")

  override def * = (id, strikeType, game, player, round) <> (Strike.tupled, Strike.unapply)

  def typeFk = foreignKey("strike_type_fk", strikeType, Queries.strikeTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def playerFk = foreignKey("strike_player_fk", player, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def gameFk = foreignKey("strike_game_fk", game, Queries.games)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}