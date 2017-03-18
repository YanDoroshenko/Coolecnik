package models.tables

import models.{FriendList, Queries}
import slick.driver.PostgresDriver.api._

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class FriendListTable(tag: Tag) extends Table[FriendList](tag, "t_friendlist") {
  def playerId = column[Int]("player_id")

  def friendId = column[Int]("friend_id")

  override def * = (playerId, friendId) <> (FriendList.tupled, FriendList.unapply)

  def playerFk = foreignKey("fl_player_fk", playerId, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def friendFk = foreignKey("fl_friend_fk", friendId, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  def pk = primaryKey("fl_pk", (playerId, friendId))
}