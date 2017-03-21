package models

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
case class PlayerJson(login: String, email: String, passwordHash: String, firstName: Option[String], lastName: Option[String])
