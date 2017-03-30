package models

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
case class Registration(login: String, email: String, passwordHash: String, firstName: Option[String], lastName: Option[String])

case class Login(login: String, passwordHash: String)

case class PasswordReset(email: String, restorePassword: Option[String])

case class PasswordUpdate(email: String, oldPassword: String, newPassword: String)

case class NewGame(
                    gameType: Int,
                    player1: Int,
                    player2: Int,
                    tournament: Option[Int],
                    rounds: Option[Int],
                    carambolesToWin: Option[Int])

case class NewGameType(title: String, description: Option[String])