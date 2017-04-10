package models.tables

import models.{Friendship, Queries}
import slick.driver.PostgresDriver.api._
import slick.lifted.ProvenShape

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 18.03.2017.
  */
class FriendListTable(tag: Tag) extends Table[Friendship](tag, "t_friendlist") {

  def playerId: Rep[Int] =
    column[Int]("player_id")

  def friendId: Rep[Int] =
    column[Int]("friend_id")

  override def * : ProvenShape[Friendship] =
    (playerId, friendId) <>
      (Friendship.tupled, Friendship.unapply)

  private def playerFk =
    foreignKey("fl_player_fk", playerId, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def friendFk =
    foreignKey("fl_friend_fk", friendId, Queries.players)(_.id, onUpdate = ForeignKeyAction.Restrict, onDelete = ForeignKeyAction.Cascade)

  private def pk =
    primaryKey("fl_pk", (playerId, friendId))
}