package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.HashMap;
import java.util.Map;

public class CellObject {
	private Object value = null;
	private String colName;
	private String rowName;
	
	public CellObject(String colName, String rowName, Object value){ 
		 this.setColName(colName);
		 this.setRowName(rowName);
		 this.setValue(value);
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getColName() {
		return colName;
	}

	public void setColName(String colName) {
		this.colName = colName;
	}

	public String getRowName() {
		return rowName;
	}

	public void setRowName(String rowName) {
		this.rowName = rowName;
	} 
	
}
