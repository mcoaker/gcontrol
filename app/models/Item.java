package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class Item extends Model {

	@Id
	public int id;
	
	public String category;
	
	public String name;
	
	public long quantity;
	
	public String unit;	
	
}
