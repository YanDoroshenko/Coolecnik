import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

name := "coolecnik"

version := "0.0.3." + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd.HH.mm"))

enablePlugins(JavaAppPackaging)
lazy val `coolecnik` = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

libraryDependencies ++= Seq(jdbc, cache, ws, specs2 % Test,
  "com.typesafe.slick" %% "slick" % "3.1.1",
  "com.h2database" % "h2" % "1.4.191",
  "org.postgresql" % "postgresql" % "9.4.1212",
  "com.typesafe.play" %% "play-slick" % "2.0.0",
  "org.scalatestplus.play" %% "scalatestplus-play" % "2.0.0" % "test")

fork in run := true

addCommandAlias("package", "universal:packageBin")