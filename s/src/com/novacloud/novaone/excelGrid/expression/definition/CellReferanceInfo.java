package com.novacloud.novaone.excelGrid.expression.definition;

public class CellReferanceInfo {
	
	public CellReferanceInfo(String colName, String colId, boolean colAbsolute, String rowName, String rowId, boolean rowAbsolute){
		this.setColName(colName);
		this.setColId(colId);
		this.setColAbsolute(colAbsolute);
		this.setRowName(rowName);
		this.setRowId(rowId);
		this.setRowAbsolute(rowAbsolute);
	}
 
	private String colName = "";
	private String colId = "";
	private boolean colAbsolute = false;
	private String rowName = "";
	private String rowId = "";
	private boolean rowAbsolute = false;
	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		this.colName = colName;
	}
	public String getColId() {
		return colId;
	}
	public void setColId(String colId) {
		this.colId = colId;
	}
	public boolean isColAbsolute() {
		return colAbsolute;
	}
	public void setColAbsolute(boolean colAbsolute) {
		this.colAbsolute = colAbsolute;
	}
	public String getRowName() {
		return rowName;
	}
	public void setRowName(String rowName) {
		this.rowName = rowName;
	}
	public String getRowId() {
		return rowId;
	}
	public void setRowId(String rowId) {
		this.rowId = rowId;
	}
	public boolean isRowAbsolute() {
		return rowAbsolute;
	}
	public void setRowAbsolute(boolean rowAbsolute) {
		this.rowAbsolute = rowAbsolute;
	} 
}
