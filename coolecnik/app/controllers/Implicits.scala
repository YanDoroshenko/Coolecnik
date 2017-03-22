package controllers

import models.{Login, Player, Registration}
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object Implicits {
  implicit val pjf = Json.format[Registration]
  implicit val pf = Json.format[Player]
  implicit val lf = Json.format[Login]
}