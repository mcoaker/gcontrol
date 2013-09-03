package models;

import java.util.ArrayList;
import java.util.List;

public class Wrapper {

	public int id = -1;
	public String error = "";
	public List<String> fieldErrors = new ArrayList<String>();
	public List<String> data = new ArrayList<String>();
	public List<Item> aaData;
	
}
