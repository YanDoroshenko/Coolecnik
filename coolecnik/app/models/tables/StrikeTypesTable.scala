package models.tables

import models.{Queries, StrikeType}
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class StrikeTypesTable(tag: Tag) extends Table[StrikeType](tag, "t_strike_type") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def gameType: Rep[Int] =
    column[Int]("gameType")

  def title: Rep[String] =
    column[String]("title", O.SqlType("VARCHAR(55)"))

  def description: Rep[Option[String]] =
    column[Option[String]]("description", O.SqlType("VARCHAR(1000)"))

  def endsGame: Rep[Option[Boolean]] =
    column[Option[Boolean]]("ends_game")

  override def * : ProvenShape[StrikeType] =
    (id, gameType, title, description, endsGame) <>
      (StrikeType.tupled, StrikeType.unapply)

  private def stFk =
    foreignKey("strike_type_game_fk", gameType, Queries.gameTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def titleIdx =
    index("pool_strike_type_title_idx", title, unique = true)
}