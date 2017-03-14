name := "coolecnik"

version := "0.0.1"

enablePlugins(JavaAppPackaging)
lazy val `coolecnik` = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

libraryDependencies ++= Seq(jdbc, cache, ws, specs2 % Test,
  "com.typesafe.slick" %% "slick" % "3.1.1",
  "com.h2database" % "h2" % "1.4.191",
  "org.postgresql" % "postgresql" % "9.4.1212",
  "com.typesafe.play" %% "play-slick" % "2.0.0")

unmanagedResourceDirectories in Test += baseDirectory(_ / "target/web/public/test").value

fork in run := true

addCommandAlias("package", "universal:packageBin")