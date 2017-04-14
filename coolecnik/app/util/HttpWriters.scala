package util

import akka.util.ByteString
import models._
import play.api.http.Writeable
import play.api.libs.json.Json
import util.JsonSerializers._

/**
  * Implicit converters from domain objects to [[play.api.http.HttpEntity]]
  *
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 06.04.2017.
  */
object HttpWriters {
  implicit val pw: Writeable[Player] = new Writeable[Player](
    p => ByteString(Json.toJson(p).toString()), Some("application/json"))

  implicit val gw: Writeable[Game] = new Writeable[Game](
    g => ByteString(Json.toJson(g).toString()), Some("application/json"))

  implicit val gtw: Writeable[GameType] = new Writeable[GameType](
    gt => ByteString(Json.toJson(gt).toString()), Some("application/json"))

  implicit val sw: Writeable[Strike] = new Writeable[Strike](
    s => ByteString(Json.toJson(s).toString()), Some("application/json"))

  implicit val stw: Writeable[StrikeType] = new Writeable[StrikeType](
    st => ByteString(Json.toJson(st).toString()), Some("application/json"))

  implicit val flw: Writeable[Seq[Friendship]] = new Writeable[Seq[Friendship]](
    fl => ByteString(Json.toJson(fl).toString()), Some("application/json")
  )

  implicit val bgsw: Writeable[BasicGameStats] = new Writeable[BasicGameStats](
    bgs => ByteString(Json.toJson(bgs).toString()), Some("application/json")
  )

  implicit val dw = new Writeable[Double](
    d => ByteString(Json.toJson(d).toString()), Some("application/json")
  )
}
