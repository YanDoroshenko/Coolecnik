package util

import java.sql.Timestamp
import java.time.{LocalDateTime, ZoneId}

import models._
import play.api.libs.json.Json._
import play.api.libs.json._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 21.03.2017.
  */
object Implicits {

  private def timestampToDateTime(t: Timestamp): LocalDateTime = LocalDateTime.ofInstant(t.toInstant, ZoneId.systemDefault())

  private def dateTimeToTimestamp(dt: LocalDateTime): Timestamp = new Timestamp(dt.toInstant(ZoneId.systemDefault().getRules().getOffset(dt)).toEpochMilli)

  implicit val timestampFormat = new Format[Timestamp] {
    def writes(t: Timestamp): JsValue = toJson(timestampToDateTime(t))

    def reads(json: JsValue): JsResult[Timestamp] = fromJson[LocalDateTime](json).map(dateTimeToTimestamp)
  }


  implicit val pf: OFormat[Player] = Json.format[Player]
  implicit val gf: OFormat[Game] = Json.format[Game]
  implicit val gtf: OFormat[GameType] = Json.format[GameType]


  implicit val pjf: OFormat[Registration] = Json.format[Registration]
  implicit val lf: OFormat[Login] = Json.format[Login]
  implicit val prf: OFormat[PasswordReset] = Json.format[PasswordReset]
  implicit val puf: OFormat[PasswordUpdate] = Json.format[PasswordUpdate]
  implicit val ngf: OFormat[NewGame] = Json.format[NewGame]
  implicit val ngtf: OFormat[NewGameType] = Json.format[NewGameType]
}