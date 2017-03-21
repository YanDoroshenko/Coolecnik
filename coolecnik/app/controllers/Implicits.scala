package controllers

import models.Player
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object Implicits {

  implicit val pf = Json.format[Player]

}
