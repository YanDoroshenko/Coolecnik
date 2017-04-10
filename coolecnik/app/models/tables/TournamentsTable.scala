package models.tables

import models.{Queries, Tournament}
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.03.2017.
  */
class TournamentsTable(tag: Tag) extends Table[Tournament](tag, "t_tournament") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def tournamentType: Rep[Int] = column[Int]("type")

  def title: Rep[Option[String]] =
    column[Option[String]]("title", O.SqlType("VARCHAR(100)"))

  override def * : ProvenShape[Tournament] =
    (id, tournamentType, title) <>
      (Tournament.tupled, Tournament.unapply)

  private def ttFk =
    foreignKey("tournament_type_fk", tournamentType, Queries.tournamentTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def titleIdx = index("tournament_title_idx", title, unique = true)
}
