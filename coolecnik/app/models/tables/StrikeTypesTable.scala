package models.tables

import models.{GameType, Queries, StrikeType}
import slick.driver.PostgresDriver.api._
import slick.lifted.{ForeignKeyQuery, Index, ProvenShape}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class StrikeTypesTable(tag: Tag) extends Table[StrikeType](tag, "t_strike_type") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def gameType: Rep[Int] =
    column[Int]("gameType")

  def correct: Rep[Boolean] =
    column[Boolean]("correct")

  def title: Rep[String] =
    column[String]("title", O.SqlType("VARCHAR(55)"))

  def description: Rep[Option[String]] =
    column[Option[String]]("description", O.SqlType("VARCHAR(1000)"))

  def endsGame: Rep[Boolean] =
    column[Boolean]("ends_game")

  override def * : ProvenShape[StrikeType] =
    (id, correct, gameType, title, description, endsGame) <>
      (StrikeType.tupled, StrikeType.unapply)

  def stFk: ForeignKeyQuery[GameTypesTable, GameType] =
    foreignKey("strike_type_game_fk", gameType, Queries.gameTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def titleIdx: Index =
    index("pool_strike_type_title_idx", title, unique = true)
}