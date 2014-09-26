package controllers

import play.api._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc._
import scala.concurrent.Future

import models._

object Application extends Controller {

  val jsonObjectParser = parse.json(__.read[JsObject])

  def store = Action.async(jsonObjectParser) { implicit req =>
    Document.store(req.body) map { doc =>
      Ok(Json.obj("id" -> doc.id))
    }
  }

  def update(id: String) = Action.async(jsonObjectParser) { implicit req =>
    Document.update(Document.ID(id), req.body) map {
      case Some(doc) => Ok(Json.obj("id" -> doc.id))
      case None => NotFound(Json.obj("error" -> s"id '$id' not found"))
    }
  }

  def get(id: String) = Action.async { implicit req =>
    Document.get(Document.ID(id)) map {
      case Some(doc) => Ok(Json.toJson(doc))
      case None => NotFound(Json.obj("error" -> s"id '$id' not found"))
    }
  }


  implicit val documentIdWrites = Writes[Document.ID] { id => JsString(id.intern) }
  implicit val documentWrites = Writes[Document] { doc =>
    doc.json ++ Json.obj("id" -> doc.id)
  }

}
