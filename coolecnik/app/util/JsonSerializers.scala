package util

import java.sql.Timestamp
import java.text.SimpleDateFormat

import models._
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object JsonSerializers {

  implicit object timestampFormat extends Format[Timestamp] {
    val format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'Z")

    def reads(json: JsValue): JsSuccess[Timestamp] = {
      val str = json.as[String]
      JsSuccess(new Timestamp(format.parse(str).getTime))
    }

    def writes(ts: Timestamp) = JsString(format.format(ts))
  }

  implicit val pf: OFormat[Player] = Json.format[Player]
  implicit val gf: OFormat[Game] = Json.format[Game]
  implicit val gtf: OFormat[GameType] = Json.format[GameType]
  implicit val stf: OFormat[StrikeType] = Json.format[StrikeType]
  implicit val sf: OFormat[Strike] = Json.format[Strike]


  implicit val pjf: OFormat[Registration] = Json.format[Registration]
  implicit val lf: OFormat[Login] = Json.format[Login]
  implicit val prf: OFormat[PasswordReset] = Json.format[PasswordReset]
  implicit val puf: OFormat[PasswordUpdate] = Json.format[PasswordUpdate]
  implicit val ngf: OFormat[NewGame] = Json.format[NewGame]
  implicit val ngtf: OFormat[NewGameType] = Json.format[NewGameType]
  implicit val nstf: OFormat[NewStrikeType] = Json.format[NewStrikeType]
  implicit val nsf: OFormat[NewStrike] = Json.format[NewStrike]
}