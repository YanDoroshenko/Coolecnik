package models.tables

import models.Player
import slick.driver.PostgresDriver.api._
import slick.lifted.{Index, ProvenShape}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class PlayersTable(tag: Tag) extends Table[Player](tag, "t_player") {
  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def login: Rep[String] =
    column[String]("login", O.SqlType("VARCHAR(55)"))

  def email: Rep[String] =
    column[String]("email", O.SqlType("VARCHAR(55)"))

  def passwordHash: Rep[String] =
    column[String]("password_hash", O.SqlType("VARCHAR(55)"))

  def firstName: Rep[Option[String]] =
    column[Option[String]]("first_name", O.SqlType("VARCHAR(55)"))

  def lastName: Rep[Option[String]] =
    column[Option[String]]("last_name", O.SqlType("VARCHAR(55)"))

  def * : ProvenShape[Player] =
    (id, login, email, passwordHash, firstName, lastName) <>
      (Player.tupled, Player.unapply)

  def loginIdx: Index =
    index("players_login_idx", login, unique = true)

  def emailIdx: Index =
    index("players_email_idx", email, unique = true)
}