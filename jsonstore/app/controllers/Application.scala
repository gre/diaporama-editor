package controllers

import play.api._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.mvc._
import scala.concurrent.Future

import models._

object Application extends Controller {

  def store = Action.async(parse.json) { implicit req =>
    asJsObjectOrFail(req.body) { json =>
      Document.store(json) map { doc =>
        Ok(Json.toJson(doc))
      }
    }
  }

  def update(id: String) = Action.async(parse.json) { implicit req =>
    asJsObjectOrFail(req.body) { json =>
      Document.update(Document.ID(id), json) map {
        case Some(doc) => Ok(Json.toJson(doc))
        case None => NotFound(Json.obj("error" -> s"id '$id' not found"))
      }
    }

  }

  def get(id: String) = Action.async { implicit req =>
    Document.get(Document.ID(id)) map {
      case Some(doc) => Ok(Json.toJson(doc))
      case None => NotFound(Json.obj("error" -> s"id '$id' not found"))
    }
  }


  def asJsObject: JsValue => Option[JsObject] = {
    case o: JsObject => Some(o)
    case _ => None
  }
  def asJsObjectOrFail(json: JsValue)(f: JsObject => Future[Result]): Future[Result] = {
    asJsObject(json) match {
      case Some(jsObj) => f(jsObj)
      case None => Future successful { BadRequest(Json.obj("error" -> "bad content")) }
    }
  }

  implicit val documentWrites = Writes[Document] { doc =>
    doc.json ++ Json.obj("id" -> doc.id.intern)
  }

}
