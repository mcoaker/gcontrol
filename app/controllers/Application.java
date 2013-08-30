package controllers;

import java.util.List;

import models.Item;
import play.data.Form;
import play.db.ebean.Model;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;
import views.html.edit;

public class Application extends Controller {
  
    public static Result index() {
        return ok(index.render("Hello World"));
    }
  
    public static Result add() {
        return ok(edit.render("Hello World"));
    }
    
    public static Result addItem() {
    	Item item = Form.form(Item.class).bindFromRequest().get();
    	item.save();
    	return redirect(routes.Application.index());
    }
    
    public static Result getItems() {
    	List<Item> items = new Model.Finder(Integer.class, Item.class).all();
    	return ok(Json.toJson(items));
    }
}
