import java.util.UUID

import controllers.DBController
import models._
import org.scalatest.mockito.MockitoSugar
import play.api.libs.json.Json
import play.api.mvc.Result
import play.api.test._
import slick.driver.H2Driver.api._
import util.JsonSerializers._

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 22.04.2017.
  */
class LoginSpec extends PlaySpecification with MockitoSugar {
  val db = util.Database
  "login" should {
    "return ACCEPTED if login successful" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      val login = UUID.randomUUID().toString
      val p = Player(-1, login, login + "email@e.com", "password", None, None)
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

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
    "return BAD_REQUEST for bad request" in new WithApplication() {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

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

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
    "return UNAUTHORIZED for wrong password" in new WithApplication() {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      val login = UUID.randomUUID().toString
      val p = Player(-1, login, login + "email@e.com", "password", None, None)
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

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
    "return UNAUTHORIZED for non-existent login" in new WithApplication() {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

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

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
  }
}