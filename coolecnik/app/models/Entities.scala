package models

import java.sql.Timestamp

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
case class Player(id: Int, login: String, email: String, passwordHash: String, firstName: Option[String], lastName: Option[String])

case class FriendList(playerId: Int, friendId: Int)

case class GameType(id: Int, title: String, description: Option[String])

case class Game(
                 id: Int,
                 game_type: Int,
                 player1: Int,
                 player2: Int,
                 winner: Option[Int],
                 beginning: Timestamp,
                 end: Option[Timestamp],
                 rounds: Option[Int],
                 carambolesToWin: Option[Int])

case class CaramboleStrike(id: Int, game: Int, player: Int, correct: Boolean, round: Int)

case class PoolStrikeType(id: Int, title: String, description: Option[String], endsGame: Boolean)

case class PoolStrike(id: Int, strikeType: Int, game: Int, player: Int, seqNumber: Int)