package com.novacloud.novaone.excelGrid.definition;

public class ExcelGridRow {
	private int height = 80;
	public int getHeight(){
		return this.height;
	}
	public void setHeight(int height){
		this.height = height;
	}
	
	private boolean isFrozen = false;
	public boolean getIsFrozen(){
		return this.isFrozen;
	}
	public void setIsFrozen(boolean isFrozen){
		this.isFrozen = isFrozen;
	}
	
	private String sheetId = null;
	public String getSheetId(){
		return this.sheetId;
	}
	public void setSheetId(String sheetId){
		this.sheetId = sheetId;
	} 
	
	private String id = null;
	public String getId(){
		return this.id;
	}
	public void setId(String id){
		this.id = id;
	} 
}
