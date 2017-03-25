package controllers

import models.Queries
import slick.driver.PostgresDriver.api.{Database, _}

import scala.concurrent.Await
import scala.concurrent.duration._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
class DBUtils(db: Database) {
  def createSchema = {
    Await.result(
      db.run(DBIO.seq(
        Queries.tournamentTypes.schema.create,
        Queries.tournaments.schema.create,
        Queries.players.schema.create,
        Queries.friendList.schema.create,
        Queries.gameTypes.schema.create,
        Queries.games.schema.create,
        Queries.strikeTypes.schema.create,
        Queries.strikes.schema.create)
      ), 5000.millis)
    this
  }
}
