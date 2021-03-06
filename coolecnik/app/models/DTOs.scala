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

case class StartGame(startTime: Timestamp)

case class EndGame(winner: Option[Int], end: Timestamp)

case class NewGameType(title: String, description: Option[String])

case class NewStrikeType(gameType: Int, correct: Boolean, title: String, description: Option[String], endsGame: Boolean)

case class NewStrike(strikeType: Int, game: Int, player: Int, round: Int)

case class BasicGameStats(total: Int, won: Int, draws: Int, lost: Int, totalSecs: Long)

case class GameStats(
                      gameNumber: Int,
                      gameId: Int,
                      typeId: Int,
                      typeTitle: String,
                      opponentId: Int,
                      opponentLogin: String,
                      winnerId: Option[Int],
                      winnerLogin: Option[String],
                      beginning: Timestamp,
                      end: Timestamp)

case class Pool8Stats(
                       gameNumber: Option[Int],
                       gameId: Int,
                       typeId: Int,
                       typeTitle: String,
                       opponentId: Int,
                       opponentLogin: String,
                       winnerId: Option[Int],
                       winnerLogin: Option[String],
                       beginning: Timestamp,
                       end: Timestamp,
                       correctStrikes: Int,
                       wrongStrikes: Int,
                       faulsWithWhite: Int,
                       faulsWithOthers: Int,
                       faulsOther: Int
                     )

case class CaramboleStats(
                           gameNumber: Option[Int],
                           gameId: Int,
                           typeId: Int,
                           typeTitle: String,
                           opponentId: Int,
                           opponentLogin: String,
                           winnerId: Option[Int],
                           winnerLogin: Option[String],
                           rounds: Int,
                           beginning: Timestamp,
                           end: Timestamp,
                           myCaramboles: Int,
                           opponentsCaramboles: Int,
                           myFouls: Int,
                           opponentsFouls: Int)

case class StrikeDetail(
                         id: Int,
                         strikeTypeId: Int,
                         strikeTypeTitle: String,
                         game: Int,
                         playerId: Int,
                         playerLogin: String,
                         round: Int)

case class Friend(id: Int, login: String, firstName: Option[String], lastName: Option[String])


case class Opponent(id: Int, login: String)

case class NameUpdate(firstName: Option[String], lastName: Option[String])

case class NewTournament(gameType: Int, tournamentType: Int, title: Option[String], players: Seq[Int], rounds: Option[Int], caramboles: Option[Int])

case class TournamentStats(id: Int, title: Option[String], gameType: Int, gameTypeTitle: String, playerCount: Int, finished: Int, unfinished: Int, rounds: Option[Int], caramboles: Option[Int])

case class TournamentDetails(id: Int, title: Option[String], tournamentType: Int, gameType: Int, gameTypeTitle: String, beginning: Timestamp, end: Option[Timestamp], games: Seq[Game])

case class PlayerTournamentStats(id: Int, login: String, won: Int, lost: Int, draws: Int, points: Int)

case class TournamentTable(id: Int, title: Option[String], table: Seq[PlayerTournamentStats])