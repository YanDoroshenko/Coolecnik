package models

import java.sql.Timestamp

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
                    beginning: Timestamp,
                    tournament: Option[Int],
                    rounds: Option[Int],
                    carambolesToWin: Option[Int])

case class EndGame(winner: Option[Int], end: Timestamp)

case class NewGameType(title: String, description: Option[String])

case class NewStrikeType(gameType: Int, correct: Boolean, title: String, description: Option[String], endsGame: Boolean)

case class NewStrike(strikeType: Int, game: Int, player: Int, round: Int)

case class BasicGameStats(total: Int, won: Int, draws: Int, lost: Int, totalSecs: Long)

case class GameStats(gameNumber: Int, gameId: Int, gameType: Int, opponent: Int, winner: Option[Int], beginning: Timestamp, end: Timestamp)

case class Pool8Stats(
                       gameNumber: Int,
                       gameId: Int,
                       gameType: Int,
                       opponent: Int,
                       winner: Int,
                       beginning: Timestamp,
                       end: Timestamp,
                       correctStrikes: Int,
                       wrongStrikes: Int,
                       faulsWithWhite: Int,
                       faulsWithOthers: Int,
                       faulsOther: Int
                     )

case class CaramboleStats(
                           gameNumber: Int,
                           gameId: Int,
                           gameType: Int,
                           opponent: Int,
                           winner: Option[Int],
                           rounds: Int,
                           beginning: Timestamp,
                           end: Timestamp,
                           myCaramboles: Int,
                           opponentsCaramboles: Int,
                           myFouls: Int,
                           opponentsFouls: Int
                         )

case class Friend(id: Int, login: String, firstName: Option[String], lastName: Option[String])


case class Opponent(id: Int, login: String)