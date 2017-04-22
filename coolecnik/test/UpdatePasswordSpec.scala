import controllers.DBController
import models.Queries._
import models._
import org.scalatest.mockito.MockitoSugar
import play.api.libs.json.Json
import play.api.mvc.Result
import play.api.test.{FakeHeaders, FakeRequest, WithApplication, _}
import slick.driver.H2Driver.api._
import util.JsonSerializers._

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 22.04.2017.
  */
class UpdatePasswordSpec extends PlaySpecification with MockitoSugar {
  val db = util.Database
  "update password" should {
    "update password on correct login" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      val player = Player(1, "login", "a@b.cz", "pass", None, None)

      Await.result(db.run(
        players += player
      ), 5.seconds)

      Await.result(db.run(
        players.filter(_.login === player.login).result
      ), 5.seconds) shouldEqual Seq(player)

      val l = PasswordUpdate(player.email, player.passwordHash, "newPassword")
      val rq = FakeRequest(
        PUT,
        "/api/passwdupdate",
        headers = FakeHeaders(
          Seq("Content-type" -> "application/json")
        ),
        body = Json.toJson(l).toString)

      val updated = Player(player.id, player.login, player.email, "newPassword", None, None)

      val a = route(rq).get
      status(a) shouldEqual CREATED
      contentAsJson(a) shouldEqual Json.toJson(updated)

      Await.result(db.run(
        players.filter(_.login === updated.login).result
      ), 5 seconds) shouldEqual Seq(updated)

      new DBControllerSpec().dropSchema
    }
  }

  "return BAD_REQUEST on malformed JSON" in new WithApplication {

    val controller = new DBController()
    val result: Future[Result] = controller.createSchema.apply(FakeRequest())
    Await.result(result, 5 seconds)

    val player = Player(1, "login", "a@b.cz", "pass", None, None)

    Await.result(db.run(
      players += player
    ), 5.seconds)

    Await.result(db.run(
      players.filter(_.login === player.login).result
    ), 5.seconds) shouldEqual Seq(player)

    val l = PasswordUpdate(player.email, player.passwordHash, "newPassword")
    val rq = FakeRequest(
      PUT,
      "/api/passwdupdate",
      headers = FakeHeaders(
        Seq("Content-type" -> "application/json")
      ),
      body = Json.toJson(l).toString.replace('l', '1'))

    val a = route(rq).get
    status(a) shouldEqual BAD_REQUEST
    contentAsString(a) shouldEqual "Request can't be deserialized"

    Await.result(new DBControllerSpec().dropSchema, 5 seconds)
  }

  "return NOT_FOUND on wrong email" in new WithApplication {

    val controller = new DBController()
    val result: Future[Result] = controller.createSchema.apply(FakeRequest())
    Await.result(result, 5 seconds)

    val rq = FakeRequest(
      PUT,
      "/api/passwdupdate",
      headers = FakeHeaders(
        Seq("Content-type" -> "application/json")
      ),
      body =
        """
          |{
          |"email" :"abc",
          |"oldPassword": "old",
          |"newPassword" : "new"
          |}
        """.stripMargin)

    val a = route(rq).get
    status(a) shouldEqual NOT_FOUND
    contentAsString(a) shouldEqual "Email abc not found"

    Await.result(new DBControllerSpec().dropSchema, 5 seconds)
  }

  "return UNAUTHORIZED on wrong recovery password" in new WithApplication {

    val controller = new DBController()
    val result: Future[Result] = controller.createSchema.apply(FakeRequest())
    Await.result(result, 5 seconds)

    val player = Player(1, "login", "a@b.cz", "///", None, None)

    Await.result(db.run(
      players += player
    ), 5.seconds)

    Await.result(db.run(
      players.filter(_.login === player.login).result
    ), 5.seconds) shouldEqual Seq(player)

    val l = PasswordUpdate(player.email, player.passwordHash, "newPassword")
    val rq = FakeRequest(
      PUT,
      "/api/passwdupdate",
      headers = FakeHeaders(
        Seq("Content-type" -> "application/json")
      ),
      body = Json.toJson(l).toString.replace('/', '1'))

    val a = route(rq).get
    status(a) shouldEqual UNAUTHORIZED
    contentAsString(a) shouldEqual "Wrong recovery password"

    Await.result(new DBControllerSpec().dropSchema, 5 seconds)
  }
}