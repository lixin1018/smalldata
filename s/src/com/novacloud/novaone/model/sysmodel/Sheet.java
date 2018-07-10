package com.novacloud.novaone.model.sysmodel;

import java.util.ArrayList;
import java.util.HashMap; 
import java.util.List;

public class Sheet {
	private String id;
	private String name; 
	private HashMap<String, SheetPart> sheetParts= new HashMap<String, SheetPart>(); 
	
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
	public HashMap<String, SheetPart> getSheetParts() {
		return sheetParts;
	} 
	public void setSheetPart(String name,SheetPart sheetPart) {
		this.sheetParts.put(name, sheetPart);
	}		
	
	public SheetPart getSheetPart(String name){
		return this.sheetParts.get(name);
	}
	
	public void init(){ 
		//初始化找到表头部分
		for(String partName : this.sheetParts.keySet()){
			SheetPart part = this.sheetParts.get(partName);
			String parentPartName = part.getParentPartName();
			if(parentPartName == null || parentPartName.isEmpty()){
				this.mainPart = part;
				break;
			}
		}

		//初始化各部分的子表
		for(String partName : this.sheetParts.keySet()){
			SheetPart part = this.sheetParts.get(partName);
			List<SheetPart> childParts = new ArrayList<SheetPart>();
			for(String pn : this.sheetParts.keySet()){
				SheetPart p = this.sheetParts.get(pn);
				if(part.getName().equals(p.getParentPartName())){
					childParts.add(p);
				}
			}
			part.setChildParts(childParts);
		}
	}
	
	private SheetPart mainPart = null;
	public SheetPart getMainPart(){
		return mainPart;
	}
}
