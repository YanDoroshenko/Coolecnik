package controllers

import java.sql.Timestamp
import java.time.LocalDateTime

import models._
import org.slf4j.LoggerFactory
import play.api.libs.json._
import play.api.mvc._
import slick.driver.PostgresDriver.api.{Database, TableQuery, _}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class Application extends Controller {

  val log = LoggerFactory.getLogger(classOf[Application])

  implicit var w = new Writes[User] {
    override def writes(u: User): JsValue = JsObject(Seq(
      "id" -> JsNumber(u.id),
      "login" -> JsString(u.login),
      "email" -> JsString(u.login),
      "created" -> Json.toJson(u.created.toLocalDateTime)
    )
    )
  }

  implicit var cw = new Writes[Comment] {
    override def writes(c: Comment): JsValue = JsObject(Seq(
      "id" -> JsNumber(c.id)
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
    db.run(T.users.result) map (s => Ok(Json.toJson(s map (u => Json.toJson(u)))))
  }

  def gamesForUser(id: Long) = Action.async {
    val db = Database.forConfig("dev")

    db.run(T.comments.result map (s => Ok(Json.toJson(s map (g => Json.toJson(g))))))
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
        /*TableQuery[CommentsTable].schema.drop,
        TableQuery[TopicsTable].schema.drop,
        TableQuery[UsersTable].schema.drop,*/
        TableQuery[UsersTable].schema.create,
        TableQuery[TopicsTable].schema.create,
        TableQuery[CommentsTable].schema.create
      )), 500.millis)
    this
  }

  def createTestData(count: Int) = {
    Await.result(
      db.run(DBIO.seq(
        (for (i <- 0 until count) yield
          T.users += User(login = "user" + i, email = "email" + i + "@user.com", password = "password" + i, salt = i.toString, created = Timestamp.valueOf(LocalDateTime.now()))
          ): _ *
      )), 500.millis)
  }


}
