package models.tables

import models.PoolStrikeType
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class PoolStrikeTypesTable(tag: Tag) extends Table[PoolStrikeType](tag, "t_8_strike_type") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def title = column[String]("title")

  def description = column[Option[String]]("description")

  def endsGame = column[Boolean]("ends_game")

  override def * = (id, title, description, endsGame) <> (PoolStrikeType.tupled, PoolStrikeType.unapply)

  def titleIdx = index("pool_strike_type_title_idx", title, unique = true)
}