package util

import java.util.Properties
import javax.mail.internet.{InternetAddress, MimeMessage}
import javax.mail.{Message, Session, Transport}

import play.api.Configuration

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
  * Created by Yan Doroshenko (yandoroshenko@protonmail.com) on 27.03.2017.
  */
class MailSender(configuration: Configuration) {

  def send(recipients: String, newPwd: String): Unit = {
    message.addRecipients(Message.RecipientType.TO, recipients)
    message.setSubject(PASSWORD_RESET_SUBJECT)
    message.setContent(new ResetPassword(newPwd).text, HTML)

    Future(Transport.send(message, username, password))
  }

  private case class HtmlBody(text: String)

  private class ResetPassword(newPwd: String) extends HtmlBody(
    s"""
       |<center>
       |<h3>Váš přístupový kód pro obnovení hesla je</h3>
       |<h1>$newPwd</h1>
       |</center>
       |""".stripMargin
  )

  private val HTML = "text/html; charset=utf-8"
  private val PLAIN = "text/plain; charset=utf-8"

  private val PASSWORD_RESET_SUBJECT = "Coolečník obnovení hesla"

  private val username = conf("mail.username")
  private val password = conf("mail.password")

  private val p = new Properties()
  p.put("mail.smtp.host", conf("mail.smtp.host"))
  p.put("mail.smtp.socketFactory.port", conf("mail.smtp.socketFactory.port"))
  p.put("mail.smtp.socketFactory.class", conf("mail.smtp.socketFactory.class"))
  p.put("mail.smtp.auth", conf("mail.smtp.auth"))
  p.put("mail.smtp.port", conf("mail.smtp.port"))
  p.put("mail.smtp.connectiontimeout", conf("mail.smtp.connectiontimeout"))

  private val session = Session.getDefaultInstance(p)
  private val message = new MimeMessage(session)
  message.setFrom(new InternetAddress(username, "Coolečnik", "utf-8"))

  private def conf(k: String) = configuration.getString(k) match {
    case Some(v) => v
    case None => throw new IllegalArgumentException("Configuration value not found for key: " + k)
  }
}