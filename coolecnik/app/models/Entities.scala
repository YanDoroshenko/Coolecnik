package models

import java.sql.Timestamp

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
case class Player(id: Int, login: String, email: String, passwordHash: String, firstName: Option[String], lastName: Option[String])

case class Friendship(playerId: Int, friendId: Int)

case class GameType(id: Int, title: String, description: Option[String])

case class Game(
                 id: Int,
                 gameType: Int,
                 player1: Int,
                 player2: Int,
                 winner: Option[Int],
                 tournament: Option[Int],
                 beginning: Option[Timestamp],
                 end: Option[Timestamp],
                 rounds: Option[Int],
                 carambolesToWin: Option[Int])

case class StrikeType(id: Int, correct: Boolean, gameType: Int, title: String, description: Option[String], endsGame: Boolean)

case class Strike(id: Int, strikeType: Int, game: Int, player: Int, round: Int)

case class Tournament(id: Int, tournamentType: Int, gameType: Int, title: Option[String])

case class TournamentType(id: Int, title: String, description: Option[String])