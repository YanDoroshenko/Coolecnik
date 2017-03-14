package controllers

import model.{GameTable, UserTable}
import org.slf4j.LoggerFactory
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api.{Database, TableQuery, _}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class Application extends Controller {

  val log = LoggerFactory.getLogger(classOf[Application])

  implicit val uw = new Writes[(Long, String)] {
    ((a: Int) => 34) (5)

    override def writes(o: (Long, String)): JsValue = JsObject(Seq(
      "id" -> JsNumber(o._1),
      "name" -> JsString(o._2)
    ))
  }

  implicit var gw = new Writes[(Long, Long, String, Int)] {
    override def writes(o: (Long, Long, String, Int)): JsValue = JsObject(Seq(
      "id" -> JsNumber(o._1),
      "name" -> JsString(o._3),
      "score" -> JsNumber(o._4)
    ))
  }

  def getData = Action.async {
    log.info("Info")
    val db = Database.forConfig("postgres")
    log.debug("Debug")
    //new DBUtils(db).createSchema.createTetsData(5)

    log.warn("Warning")
    log.error("Error")
    log.trace("Trace")
    db.run(TableQuery[UserTable].result) map (s => Ok(Json.toJson(s map (u => Json.toJson(u)))))
  }

  def gamesForUser(id: Long) = Action.async {
    val db = Database.forConfig("postgres")

    db.run(TableQuery[GameTable].filter(_.userId === id).result) map (s => Ok(Json.toJson(s map (g => Json.toJson(g)))))
  }

  def saveUser(id: Long) = Action(parse.json) {
    request =>
      //val body = request.body.validate

      Ok
  }
}

class DBUtils(db: Database) {
  def createSchema = {
    Await.result(
      db.run(DBIO.seq(
        TableQuery[GameTable].schema.create,
        TableQuery[UserTable].schema.create
      )), 500.millis)
    this
  }

  def createTetsData(count: Int) = {
    val uq = TableQuery[UserTable]
    val gq = TableQuery[GameTable]
    Await.result(
      db.run(DBIO.seq(
        (for (i <- 0 until count) yield
          gq += (i, i, "Game" + i, i)) ++
          (for (i <- 0 until count) yield
            uq += (i, "User" + i)): _*
      )), 500.millis)
  }


}
