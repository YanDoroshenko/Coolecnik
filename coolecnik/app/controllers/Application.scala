package controllers

import models._
import org.slf4j.LoggerFactory
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api.{Database, _}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class Application extends Controller {

  val log = LoggerFactory.getLogger(classOf[Application])

  implicit var w = new Writes[Player] {
    override def writes(p: Player): JsValue = JsObject(Seq(
      "id" -> JsNumber(BigDecimal(p.id)),
      "login" -> JsString(p.login),
      "email" -> JsString(p.login)
    )
    )
  }

  def getData = Action.async {
    log.info("Info")
    val db = Database.forConfig("prod")
    log.debug("Debug")
    //new DBUtils(db).createSchema.createTestData(10)

    log.warn("Warning")
    log.error("Error")
    log.trace("Trace")
    db.run(Queries.players.result) map (s => Ok(Json.toJson(s map (u => Json.toJson(u)))))
  }
}

class DBUtils(db: Database) {
  def createSchema = {
    Await.result(
      db.run(DBIO.seq(
        Queries.players.schema.create,
        Queries.friendList.schema.create,
        Queries.gameTypes.schema.create,
        Queries.games.schema.create,
        Queries.caramboleStrikes.schema.create,
        Queries.poolStrikeTypes.schema.create,
        Queries.poolStrikes.schema.create
      )), 500.millis)
    this
  }

  def createTestData(count: Int) = {
    Await.result(
      db.run(DBIO.seq(
        (for (i <- 0 until count) yield
          Queries.players += Player(login = "user" + i, email = "email" + i + "@user.com", passwordHash = "password" + i, firstName = None, lastName = None)
          ): _ *
      )), 500.millis)
  }


}
