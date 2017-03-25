package models.tables

import models.Player
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class PlayersTable(tag: Tag) extends Table[Player](tag, "t_player") {
  def id: Rep[Int] =
    column[Int]("id", O.PrimaryKey, O.AutoInc)

  def login: Rep[String] =
    column[String]("login")

  def email: Rep[String] =
    column[String]("email")

  def passwordHash: Rep[String] =
    column[String]("password_hash")

  def firstName: Rep[Option[String]] =
    column[Option[String]]("first_name")

  def lastName: Rep[Option[String]] =
    column[Option[String]]("last_name")

  def * : ProvenShape[Player] =
    (id, login, email, passwordHash, firstName, lastName) <>
      (Player.tupled, Player.unapply)

  private def loginIdx =
    index("players_login_idx", login, unique = true)

  private def emailIdx =
    index("players_email_idx", email, unique = true)
}