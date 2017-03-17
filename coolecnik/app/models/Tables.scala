package models


import java.sql.Timestamp

import slick.driver.PostgresDriver.api._


/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 17.03.2017.
  */
object T {
  val users = TableQuery[UsersTable]
  val topics = TableQuery[TopicsTable]
  val comments = TableQuery[CommentsTable]
}

case class User(id: Long = 0, login: String, email: String,
                password: String, salt: String, created: Timestamp)

case class Topic(id: Long = 0, author: Long, title: String,
                 text: String, created: Timestamp)

case class Comment(id: Long = 0, theme: Long, author: Long,
                   text: String, created: Timestamp)

class UsersTable(tag: Tag) extends Table[User](tag, "users") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def login = column[String]("login")

  def email = column[String]("email")

  def password = column[String]("password")

  def salt = column[String]("salt")

  def created = column[Timestamp]("created")

  def * = (id, login, email, password, salt, created) <>
    (User.tupled, User.unapply)

  def login_idx = index("users_login_idx", login, unique = true)

  def email_idx = index("users_email_idx", email, unique = true)
}

class TopicsTable(tag: Tag) extends Table[Topic](tag, "topics") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def author = column[Long]("author")

  def title = column[String]("title")

  def text = column[String]("text")

  def created = column[Timestamp]("created")

  def * = (id, author, title, text, created) <>
    (Topic.tupled, Topic.unapply)

  def author_fk = foreignKey("topics_author_fk", author, T.users)(_.id,
    onUpdate = ForeignKeyAction.Restrict,
    onDelete = ForeignKeyAction.Cascade)

  def created_idx = index("topics_created_idx", created)
}

class CommentsTable(tag: Tag) extends Table[Comment](tag, "comments") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

  def topic = column[Long]("topic")

  def author = column[Long]("author")

  def text = column[String]("text")

  def created = column[Timestamp]("created")

  def * = (id, topic, author, text, created) <>
    (Comment.tupled, Comment.unapply)

  def author_fk = foreignKey("comments_author_fk", author, T.users)(_.id,
    onUpdate = ForeignKeyAction.Restrict,
    onDelete = ForeignKeyAction.Cascade)

  def theme_fk = foreignKey("comments_topic_fk", topic, T.topics)(_.id,
    onUpdate = ForeignKeyAction.Restrict,
    onDelete = ForeignKeyAction.Cascade)

  def created_idx = index("comments_topic_created_idx", (topic, created))
}