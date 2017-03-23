package models.tables

import models.{Queries, Tournament}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.03.2017.
  */
class TournamentsTable(tag: Tag) extends Table[Tournament](tag, "t_tournament") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def tournamentType = column[Int]("type")

  override def * = (id, tournamentType) <> (Tournament.tupled, Tournament.unapply)

  def ttFk = foreignKey("tournament_type_fk", tournamentType, Queries.tournamentTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)
}
