package com.novacloud.novaone.model.sysmodel;

import java.util.HashMap; 

//视图描述
public class View {
	private String id;
	private String name;
	private String dataName; 
	private HashMap<String, ViewDispunit> dispunits = new HashMap<String, ViewDispunit>(); 
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	} 	
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	public HashMap<String, ViewDispunit> getDispunits() {
		return dispunits;
	} 
	public void setViewDispunit(String name,ViewDispunit viewDispunit) {
		this.dispunits.put(name, viewDispunit);
	}		
	
	public ViewDispunit getViewDispunit(String name){
		return this.dispunits.get(name);
	}
}
