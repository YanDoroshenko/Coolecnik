package models.tables

import models.GameType
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class GameTypeTable(tag: Tag) extends Table[GameType](tag, "t_game_type") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def title = column[String]("title")

  def description = column[Option[String]]("description")


  override def * = (id, title, description) <> (GameType.tupled, GameType.unapply)

  def titleIdx = index("game_type_title_idx", title, unique = true)
}