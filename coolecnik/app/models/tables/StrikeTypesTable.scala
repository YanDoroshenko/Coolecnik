package models.tables

import models.{Queries, StrikeType}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class StrikeTypesTable(tag: Tag) extends Table[StrikeType](tag, "t_strike_type") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def gameType = column[Int]("game_type")

  def title = column[String]("title")

  def description = column[Option[String]]("description")

  def endsGame = column[Option[Boolean]]("ends_game")

  override def * = (id, gameType, title, description, endsGame) <> (StrikeType.tupled, StrikeType.unapply)

  def stFk = foreignKey("strike_type_game_fk", gameType, Queries.gameTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def titleIdx = index("pool_strike_type_title_idx", title, unique = true)
}