package models.tables

import models.{GameType, Queries, Tournament, TournamentType}
import slick.driver.PostgresDriver.api._
import slick.lifted.{ForeignKeyQuery, Index, ProvenShape}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.03.2017.
  */
class TournamentsTable(tag: Tag) extends Table[Tournament](tag, "t_tournament") {

  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def tournamentType: Rep[Int] = column[Int]("tournament_type")

  def gameType: Rep[Int] = column[Int]("game_type")

  def title: Rep[Option[String]] =
    column[Option[String]]("title", O.SqlType("VARCHAR(100)"))

  override def * : ProvenShape[Tournament] =
    (id, tournamentType, gameType, title) <>
      (Tournament.tupled, Tournament.unapply)

  def ttFk: ForeignKeyQuery[TournamentTypesTable, TournamentType] =
    foreignKey("tournament_tournament_type_fk", tournamentType, Queries.tournamentTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def gtFk: ForeignKeyQuery[GameTypesTable, GameType] =
    foreignKey("tournament_game_type_fk", gameType, Queries.gameTypes)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def titleIdx: Index = index("tournament_title_idx", title, unique = true)
}
