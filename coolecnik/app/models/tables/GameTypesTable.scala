package models.tables

import models.GameType
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class GameTypesTable(tag: Tag) extends Table[GameType](tag, "t_game_type") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def title: Rep[String] =
    column[String]("title")

  def description: Rep[Option[String]] =
    column[Option[String]]("description")

  override def * : ProvenShape[GameType] =
    (id, title, description) <>
      (GameType.tupled, GameType.unapply)

  private def titleIdx =
    index("game_type_title_idx", title, unique = true)
}