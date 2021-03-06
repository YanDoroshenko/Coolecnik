package models.tables

import models.TournamentType
import slick.driver.PostgresDriver.api._
import slick.lifted.{Index, ProvenShape}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.03.2017.
  */
class TournamentTypesTable(tag: Tag) extends Table[TournamentType](tag, "t_tournament_type") {
  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def title: Rep[String] =
    column[String]("title", O.SqlType("VARCHAR(55)"))

  def description: Rep[Option[String]] =
    column[Option[String]]("description", O.SqlType("VARCHAR(1000)"))

  override def * : ProvenShape[TournamentType] =
    (id, title, description) <>
      (TournamentType.tupled, TournamentType.unapply)

  def titleIdx: Index = index("tournament_type_title_idx", title, unique = true)
}