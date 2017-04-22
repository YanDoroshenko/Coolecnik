package util

import scala.language.implicitConversions

/**
  * Database configuration object
  *
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 06.04.2017.
  */
class Database {
  private val db = slick.driver.PostgresDriver.api.Database.forConfig("prod")
  //slick.driver.H2Driver.api.Database.forConfig("test")

  implicit def db2slick(d: Database): slick.driver.PostgresDriver.api.Database = d.db

  //slick.driver.H2Driver.api.Database = d.db
}

object Database extends Database