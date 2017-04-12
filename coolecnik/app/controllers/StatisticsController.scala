package controllers

import models.Queries._
import models._
import play.api.mvc.{Action, AnyContent, Controller}
import slick.driver.PostgresDriver.api._
import util.Database
import util.HttpWriters._

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 12.04.2017.
  */
class StatisticsController extends Controller {

  private val db = Database

  def basicGameStats(id: Int): Action[AnyContent] = Action.async { _ =>
    db.run(
      games.filter(g =>
        (g.player1 === id || g.player2 === id) && g.end.nonEmpty)
        .result)
      .map {
        case gs: Seq[Game] if gs.nonEmpty =>
          val total = gs.size
          val won = gs.count(_.winner == id)
          val draws = gs.count(_.winner == null)
          val lost = total - won - draws
          val totalSecs = gs.map(g => g.end.get.toInstant.getEpochSecond - g.beginning.get.toInstant.getEpochSecond).sum
          Ok(BasicGameStats(total, won, draws, lost, totalSecs))
        case _ => NotFound
      }
  }

  def basicStrike8Stats(id: Int): Action[AnyContent] = Action.async {
    val s = for ((s, st) <- strikes.filter(_.player === id) join strikeTypes on (_.strikeType === _.id) if st.gameType === 1) yield st.correct
    val correct = s.filter(_ === true).size.result
    val incorrect = s.filter(_ === false).size.result
    db.run(correct)
      .flatMap(c => db.run(incorrect)
        .map {
          case 0 => 0
          case i => c.toDouble / i
        })
      .map(Ok(_))
  }

  def basicStrikeCaramboleStats(id: Int): Action[AnyContent] = Action.async {
    val s = for ((s, st) <- strikes.filter(_.player === id) join strikeTypes on (_.strikeType === _.id) if st.gameType === 2) yield st.correct
    val correct = s.filter(_ === true).size.result
    val incorrect = s.filter(_ === false).size.result
    db.run(correct)
      .flatMap(c => db.run(incorrect)
        .map {
          case 0 => 0
          case i => c.toDouble / i
        })
      .map(Ok(_))
  }
}
