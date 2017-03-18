package models.tables

import models.{PoolStrike, Queries}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class PoolStrikesTable(tag: Tag) extends Table[PoolStrike](tag, "t_8_strike") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def strikeType = column[Int]("type")

  def game = column[Int]("game")

  def player = column[Int]("player")

  def seqNumber = column[Int]("seq_number")

  override def * = (id, strikeType, game, player, seqNumber) <> (PoolStrike.tupled, PoolStrike.unapply)

  def typeFk = foreignKey("pool_strike_type_fk", strikeType, Queries.poolStrikeTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def playerFk = foreignKey("pool_strike_player_fk", player, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def gameFk = foreignKey("pool_strike_game_fk", game, Queries.games)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}
