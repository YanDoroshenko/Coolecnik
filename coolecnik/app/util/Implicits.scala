package util

import models._
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object Implicits {
  implicit val pjf: OFormat[Registration] = Json.format[Registration]
  implicit val pf: OFormat[Player] = Json.format[Player]
  implicit val lf: OFormat[Login] = Json.format[Login]
  implicit val prf: OFormat[PasswordReset] = Json.format[PasswordReset]
  implicit val puf: OFormat[PasswordUpdate] = Json.format[PasswordUpdate]
}