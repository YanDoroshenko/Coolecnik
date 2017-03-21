package controllers

import models.{Player, PlayerJson}
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object Implicits {

  implicit val pjf = Json.format[PlayerJson]
  implicit val pf = Json.format[Player]

}
