package util

import akka.util.ByteString
import models._
import play.api.http.Writeable
import play.api.libs.json.Json
import util.JsonSerializers._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 06.04.2017.
  */
object HttpWriters {
  implicit val pw: Writeable[Player] = new Writeable[Player](
    p => ByteString.apply(Json.toJson(p).toString()), Some("application/json"))

  implicit val gw: Writeable[Game] = new Writeable[Game](
    g => ByteString.apply(Json.toJson(g).toString()), Some("application/json"))

  implicit val gtw: Writeable[GameType] = new Writeable[GameType](
    gt => ByteString.apply(Json.toJson(gt).toString()), Some("application/json"))

  implicit val sw: Writeable[Strike] = new Writeable[Strike](
    s => ByteString.apply(Json.toJson(s).toString()), Some("application/json"))

  implicit val stw: Writeable[StrikeType] = new Writeable[StrikeType](
    st => ByteString.apply(Json.toJson(st).toString()), Some("application/json"))
}
