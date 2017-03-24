import java.util.UUID

import controllers.Implicits._
import models._
import org.scalatest.mockito.MockitoSugar
import play.api.libs.json.Json
import play.api.test._
import slick.driver.PostgresDriver.api._
import slick.driver.PostgresDriver.backend.Database

import scala.concurrent.Await
import scala.concurrent.duration._

/**
  * Add your spec here.
  * You can mock out a whole application including requests, plugins etc.
  * For more information, consult the wiki.
  */
class ApplicationSpec extends PlaySpecification with MockitoSugar {

  "registration" should {
    "return user if successfully registered" in new WithApplication {

      val login = UUID.randomUUID().toString

      val l = Registration(login, "email@e.com", "password", None, None)

      val rq = FakeRequest(
        POST,
        "/api/register",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"login" : "$login",
             |"passwordHash" : "password",
             |"email": "email@e.com"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual CREATED

      val db = Database.forConfig("dev")
      val p = Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5000.millis)
      contentAsJson(a) shouldEqual Json.toJson(p)
      Await.result(db.run(
        Queries.players.filter(_.id === p.head.id).delete
      ), 5000.millis)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5000.millis) must be empty
    }

    "return BAD_REQUEST for bad request" in new WithApplication() {
      val rq = FakeRequest(
        POST,
        "/api/register",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"passwordHash" : "password",
             |"email": "email@e.com"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual BAD_REQUEST

      contentAsString(a) shouldEqual "Request can't be deserialized"
    }

    "return NOT_ACCEPTABLE for existing user" in new WithApplication {

      val login = UUID.randomUUID().toString

      val l = Registration(login, "email@e.com", "password", None, None)

      val rq = FakeRequest(
        POST,
        "/api/register",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"login" : "$login",
             |"passwordHash" : "password",
             |"email": "email@e.com"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual CREATED

      val db = Database.forConfig("dev")
      val p = Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5000.millis)

      contentAsJson(a) shouldEqual Json.toJson(p)

      val b = route(rq).get
      status(b) shouldEqual NOT_ACCEPTABLE
      contentAsString(b) must contain("ERROR: duplicate key value violates unique constraint")

      Await.result(db.run(
        Queries.players.filter(_.id === p.head.id).delete
      ), 5000.millis)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5000.millis) must be empty
    }

    "clean up after test" in new WithApplication {
      val db = Database.forConfig("dev")
      Await.result(db.run(
        sql"""SELECT setval('t_player_id_seq', (
          SELECT MAX(id)
          FROM t_player))"""
          .as[String]
      ), 5000.millis)
    }
  }
}