package com.novacloud.novaone.excelGrid.definition;
 
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import java.util.UUID; 

public class ExcelGridSheet {
	
	public ExcelGridSheet(String id, String name, int index){
		this.setId(id);
		this.setName(name);
		this.setIndex(index);
	}
	
	//所有列
	private List<ExcelGridColumn> allColumns = null;
	public List<ExcelGridColumn> getAllColumns() {
		return allColumns;
	}
	public void setAllColumns(List<ExcelGridColumn> allColumns) {
		this.allColumns = allColumns;
	}
	
	//所有行
	private List<ExcelGridRow> allRows = null; 
	public List<ExcelGridRow> getAllRows() {
		return allRows;
	}
	public void setAllRows(List<ExcelGridRow> allRows) {
		this.allRows = allRows;
	} 

	private String id = null;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}	

	private String name = null;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}	

	private int index = 0;
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
}
