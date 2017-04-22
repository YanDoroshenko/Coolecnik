import controllers.DBController
import models.Queries._
import org.scalatest.Matchers._
import org.scalatestplus.play._
import play.api.mvc.{Results, _}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import slick.driver.H2Driver.api._
import slick.jdbc.meta.MTable
import util.Database

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 22.04.2017.
  */
class DBControllerSpec extends PlaySpec with Results {

  private def dropSchema = {
    Database.run(DBIO.seq(
      strikes.schema.drop,
      strikeTypes.schema.drop,
      games.schema.drop,
      gameTypes.schema.drop,
      tournaments.schema.drop,
      tournamentTypes.schema.drop,
      friendList.schema.drop,
      players.schema.drop))
      .map(_ => NO_CONTENT)
  }

  "DBController" should {
    "create schema" in {
      val controller = new DBController()
      val result: Future[Result] = controller.createSchema.apply(FakeRequest())
      status(result) mustBe CREATED

      Database.run(MTable.getTables)
        .map(_ should not be empty)

      dropSchema.map(_ shouldEqual NO_CONTENT)
      Database.run(MTable.getTables).map(_ shouldBe empty)
    }

    "create test users" in {
      val controller = new DBController()
      val schema: Future[Result] = controller.createSchema.apply(FakeRequest())
      status(schema) mustBe CREATED

      val testUsers: Future[Result] = controller.createTestUsers.apply(FakeRequest())
      status(testUsers) mustBe CREATED

      Database.run(players.filter(p => p.login === "login1" || p.login === "login2").result)
        .map(_.size shouldEqual 2)

      dropSchema.map(_ shouldEqual NO_CONTENT)
      Database.run(MTable.getTables).map(_ shouldBe empty)
    }
  }
}