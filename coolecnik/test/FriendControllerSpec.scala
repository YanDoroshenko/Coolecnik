import controllers.DBController
import org.scalatest.mockito.MockitoSugar
import play.api.mvc.Result
import play.api.test._

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 23.04.2017.
  */
class FriendControllerSpec extends PlaySpecification with MockitoSugar {
  val db = util.Database
  "friend controller" should {
    "return NOT_FOUND if adding a friend to non-existent user" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      val rq1 = FakeRequest("POST", "/api/players/1/befriend/2")
      val a = route(rq1).get
      status(a) shouldEqual NOT_FOUND

      val rq2 = FakeRequest("POST", "/api/players/1/unfriend/2")
      val b = route(rq2).get
      status(b) shouldEqual NOT_FOUND

      val rq3 = FakeRequest("GET", "/api/players/1/unfriend/2")
      val c = route(rq3).get
      status(c) shouldEqual NOT_FOUND

      Await.result(route(FakeRequest(
        POST,
        "/api/register",
        FakeHeaders(Seq("Content-Type" -> "application/json")),
        """
          |{
          |"login": "abc",
          |"email": "abc",
          |"passwordHash" : "abc"
          |}
        """.stripMargin
      )).get, 5 seconds)

      val rq4 = FakeRequest("POST", "/api/players/1/befriend/2")
      val d = route(rq4).get
      status(d) shouldEqual NOT_FOUND

      val rq5 = FakeRequest("POST", "/api/players/1/unfriend/2")
      val e = route(rq5).get
      status(e) shouldEqual NOT_FOUND

      val rq6 = FakeRequest("GET", "/api/players/1/friends")
      val f = route(rq6).get
      status(f) shouldEqual NOT_FOUND

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }

    "return BAD_REQUEST if adding oneself" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      Await.result(route(FakeRequest(
        POST,
        "/api/register",
        FakeHeaders(Seq("Content-Type" -> "application/json")),
        """
          |{
          |"login": "abc",
          |"email": "abc",
          |"passwordHash" : "abc"
          |}
        """.stripMargin
      )).get, 5 seconds)

      val rq4 = FakeRequest("POST", "/api/players/1/befriend/1")
      val d = route(rq4).get
      status(d) shouldEqual BAD_REQUEST

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }

    "work correctly for corect input" in new WithApplication {

      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      Await.result(result, 5 seconds)

      Await.result(route(FakeRequest(
        POST,
        "/api/register",
        FakeHeaders(Seq("Content-Type" -> "application/json")),
        """
          |{
          |"login": "abc",
          |"email": "abc",
          |"passwordHash" : "abc"
          |}
        """.stripMargin
      )).get, 5 seconds)

      Await.result(route(FakeRequest(
        POST,
        "/api/register",
        FakeHeaders(Seq("Content-Type" -> "application/json")),
        """
          |{
          |"login": "abc1",
          |"email": "abc1",
          |"passwordHash" : "abc"
          |}
        """.stripMargin
      )).get, 5 seconds)

      val rq4 = FakeRequest("POST", "/api/players/1/befriend/2")
      val d = route(rq4).get
      status(d) shouldEqual CREATED
      contentAsString(d) shouldEqual "[{\"id\":2,\"login\":\"abc1\"}]"

      val rq5 = FakeRequest("POST", "/api/players/2/befriend/1")
      val e = route(rq5).get
      status(e) shouldEqual CREATED
      contentAsString(e) shouldEqual "[{\"id\":1,\"login\":\"abc\"}]"

      Await.result(new DBControllerSpec().dropSchema, 5 seconds)
    }
  }
}