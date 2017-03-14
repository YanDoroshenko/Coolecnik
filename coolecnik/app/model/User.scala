package model

import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 24.02.2017.
  */

class UserTable(tag: Tag) extends Table[(Long, String)](tag, "T_USER") {

  def id = column[Long]("ID", O.PrimaryKey, O.AutoInc)

  def name = column[String]("NAME")

  override def * : ProvenShape[(Long, String)] = (id, name)

  lazy val games = TableQuery[GameTable]
}

class GameTable(tag: Tag) extends Table[(Long, Long, String, Int)](tag, "T_GAME") {
  def id = column[Long]("ID", O.AutoInc)
  def userId = column[Long]("USER_ID")
  def name = column[String]("NAME")
  def score = column[Int]("SCORE")

  def pk = primaryKey("pk", (id, userId))

  override def * : ProvenShape[(Long, Long, String, Int)] = (id, userId, name, score)
}