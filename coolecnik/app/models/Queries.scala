package models

import models.tables._
import slick.lifted.TableQuery

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
object Queries {
  val players: TableQuery[PlayersTable] = TableQuery[PlayersTable]
  val friendList: TableQuery[FriendListTable] = TableQuery[FriendListTable]
  val gameTypes: TableQuery[GameTypeTable] = TableQuery[GameTypeTable]
  val games: TableQuery[GamesTable] = TableQuery[GamesTable]
  val caramboleStrikes: TableQuery[CaramboleStrikesTable] = TableQuery[CaramboleStrikesTable]
  val poolStrikeTypes: TableQuery[PoolStrikeTypesTable] = TableQuery[PoolStrikeTypesTable]
  val poolStrikes: TableQuery[PoolStrikesTable] = TableQuery[PoolStrikesTable]
}
