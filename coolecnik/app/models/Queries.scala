package models

import models.tables._
import slick.lifted.TableQuery

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
object Queries {
  val players: TableQuery[PlayersTable] = TableQuery[PlayersTable]
  val friendList: TableQuery[FriendListTable] = TableQuery[FriendListTable]
  val gameTypes: TableQuery[GameTypesTable] = TableQuery[GameTypesTable]
  val games: TableQuery[GamesTable] = TableQuery[GamesTable]
  val strikeTypes: TableQuery[StrikeTypesTable] = TableQuery[StrikeTypesTable]
  val strikes: TableQuery[StrikesTable] = TableQuery[StrikesTable]
  val tournaments: TableQuery[TournamentsTable] = TableQuery[TournamentsTable]
  val tournamentTypes: TableQuery[TournamentTypesTable] = TableQuery[TournamentTypesTable]
}
