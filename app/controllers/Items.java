package controllers;

import java.util.List;

import models.Item;
import models.Wrapper;
import play.data.Form;
import play.db.ebean.Model;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.index;

public class Items extends Controller {
  
    public static Result getItems() {
    	List<Item> items = new Model.Finder(Integer.class, Item.class).all();
    	Wrapper wrapper = new Wrapper();
    	wrapper.aaData = items;
    	return ok(Json.toJson(wrapper));
    }
    
    public static Result createItem() {
    	Item item = Form.form(Item.class).bindFromRequest().get();
    	item.save();
    	return ok("{}");
    }
    
    public static Result updateItem() {
    	Item item = Form.form(Item.class).bindFromRequest().get();
    	item.update();
    	return ok("{}");
    }
    
    public static Result deleteItem(int id) {
    	Item item = (Item)new Model.Finder(Integer.class, Item.class).byId(id);
    	item.delete();
    	return ok("{}");
    }
}
