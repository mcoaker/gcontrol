package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class Item extends Model {

	@Id
	public int id;
	
	public String name;
	
	public String description;
	
	public long quantity;
	
	public String unit;	
	
}
