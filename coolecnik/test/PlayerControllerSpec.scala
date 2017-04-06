import java.util.UUID

import models._
import org.scalatest.mockito.MockitoSugar
import play.api.libs.json.Json
import play.api.test._
import slick.driver.PostgresDriver.api._
import slick.driver.PostgresDriver.backend.Database
import util.JsonSerializers._

import scala.concurrent.Await
import scala.concurrent.duration._

/**
  * Add your spec here.
  * You can mock out a whole application including requests, plugins etc.
  * For more information, consult the wiki.
  */
class PlayerControllerSpec extends PlaySpecification with MockitoSugar {

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
      ), 5.seconds)
      contentAsJson(a) shouldEqual Json.toJson(p.head)
      Await.result(db.run(
        Queries.players.filter(_.id === p.head.id).delete
      ), 5.seconds)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds) must be empty
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
      ), 5.seconds)

      contentAsJson(a) shouldEqual Json.toJson(p.head)

      val b = route(rq).get
      status(b) shouldEqual NOT_ACCEPTABLE
      contentAsString(b) must contain("ERROR: duplicate key value violates unique constraint")

      Await.result(db.run(
        Queries.players.filter(_.id === p.head.id).delete
      ), 5.seconds)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds) must be empty
    }

    "clean up after test" in new WithApplication {
      val db = Database.forConfig("dev")
      Await.result(db.run(
        sql"""SELECT setval('t_player_id_seq', (
          SELECT MAX(id)
          FROM t_player))"""
          .as[String]
      ), 5.seconds)
    }
  }

  "login" should {
    "return ACCEPTED if login successful" in new WithApplication {

      val login = UUID.randomUUID().toString

      val p = Player(-1, login, login + "email@e.com", "password", None, None)

      val db = Database.forConfig("dev")
      Await.result(db.run(
        Queries.players += p
      ), 5.seconds)

      val rq = FakeRequest(
        POST,
        "/api/login",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"login" : "$login",
             |"passwordHash" : "password"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual ACCEPTED

      contentAsJson(a) shouldEqual Json.toJson(Await.result(
        db.run(
          Queries.players.filter(p => p.login === login && p.email === (login + "email@e.com"))
            .result), 5.seconds).head)

      Await.result(db.run(
        Queries.players.filter(_.login === p.login).delete
      ), 5.seconds)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds) must be empty
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

    "return UNAUTHORIZED for wrong password" in new WithApplication() {
      val login = UUID.randomUUID().toString

      val p = Player(-1, login, login + "email@e.com", "password", None, None)

      val db = Database.forConfig("dev")
      Await.result(db.run(
        Queries.players += p
      ), 5.seconds)

      val rq = FakeRequest(
        POST,
        "/api/login",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"login" : "$login",
             |"passwordHash" : "wrong_password"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual UNAUTHORIZED

      contentAsString(a) shouldEqual "Bad credentials"

      Await.result(db.run(
        Queries.players.filter(_.login === p.login).delete
      ), 5.seconds)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds) must be empty
    }

    "return UNAUTHORIZED for non-existent login" in new WithApplication() {
      val login = UUID.randomUUID().toString

      val rq = FakeRequest(
        POST,
        "/api/login",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body =
          s"""
             |{
             |"login" : "$login",
             |"passwordHash" : "wrong_password"
             |}
          """.stripMargin)
      val a = route(rq).get
      status(a) shouldEqual UNAUTHORIZED

      contentAsString(a) shouldEqual "Bad credentials"


    }

    "clean up after test" in new WithApplication {
      val db = Database.forConfig("dev")
      Await.result(db.run(
        sql"""SELECT setval('t_player_id_seq', (
          SELECT MAX(id)
          FROM t_player))"""
          .as[String]
      ), 5.seconds)
    }
  }
}