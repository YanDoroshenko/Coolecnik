package util

import models.Queries
import play.api.mvc.{Action, _}
import slick.driver.PostgresDriver.api.{Database, _}

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
class DBUtils extends Controller {

  private val db = Database.forConfig("prod")

  def createSchema: Action[AnyContent] = Action.async {
    db.run(DBIO.seq(
      Queries.tournamentTypes.schema.create,
      Queries.tournaments.schema.create,
      Queries.players.schema.create,
      Queries.friendList.schema.create,
      Queries.gameTypes.schema.create,
      Queries.games.schema.create,
      Queries.strikeTypes.schema.create,
      Queries.strikes.schema.create)
    ).map(_ => Ok)
  }
}
