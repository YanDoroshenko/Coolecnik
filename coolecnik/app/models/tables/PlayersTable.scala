package models.tables

import models.Player
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class PlayersTable(tag: Tag) extends Table[Player](tag, "t_players") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

  def login = column[String]("login")

  def email = column[String]("email")

  def passwordHash = column[String]("password_hash")

  def firstName = column[Option[String]]("first_name")

  def lastName = column[Option[String]]("last_name")

  def * = (id, login, email, passwordHash, firstName, lastName) <>
    (Player.tupled, Player.unapply)

  def loginIdx = index("players_login_idx", login, unique = true)

  def emailIdx = index("players_email_idx", email, unique = true)
}