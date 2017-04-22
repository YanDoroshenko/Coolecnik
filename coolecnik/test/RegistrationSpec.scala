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
class RegistrationSpec extends PlaySpecification with MockitoSugar {
  val db = util.Database
  "registration" should {
    "return user if successfully registered" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

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
      val p = Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds)
      contentAsJson(a) shouldEqual Json.toJson(p.head)
      Await.result(db.run(
        Queries.players.filter(_.id === p.head.id).delete
      ), 5.seconds)
      Await.result(db.run(
        Queries.players.filter(_.login === login).result
      ), 5.seconds) should be empty

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
    "return BAD_REQUEST for bad request" in new WithApplication {

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
  }
}