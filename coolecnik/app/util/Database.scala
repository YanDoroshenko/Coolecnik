package util

import scala.language.implicitConversions

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 06.04.2017.
  */
class Database {
  private val db = slick.driver.PostgresDriver.api.Database.forConfig("prod")

  implicit def db2slick(d: Database): slick.driver.PostgresDriver.api.Database = d.db
}

object Database extends Database