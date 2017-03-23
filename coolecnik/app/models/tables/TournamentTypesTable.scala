package models.tables

import models.TournamentType
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.03.2017.
  */
class TournamentTypesTable(tag: Tag) extends Table[TournamentType](tag, "t_tournament_type") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def title = column[String]("title")

  def description = column[Option[String]]("description")

  override def * = (id, title, description) <> (TournamentType.tupled, TournamentType.unapply)

  def titleIdx = index("tournament_type_title_idx", title, unique = true)
}