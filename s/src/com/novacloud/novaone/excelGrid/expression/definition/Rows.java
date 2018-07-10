package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Rows {
	private HashMap<String, Integer> rowNameToIndex = new HashMap<String, Integer>();
	private HashMap<String, Integer> rowIdToIndex = new HashMap<String, Integer>();
	private List<String> allRowNames = new ArrayList<String>();
	private List<String> allRowIds = new ArrayList<String>();

	public int size(){
		return this.allRowIds.size();
	}
	
	public Integer getRowIndexByName(String name){
		if(this.rowNameToIndex.containsKey(name)){
			return this.rowNameToIndex.get(name);
		}
		else{
			return null;
		}
	}
	
	public String getRowId(int rowIndex){
		if(this.allRowIds.size() > rowIndex && rowIndex >= 0){
			return this.allRowIds.get(rowIndex);
		}
		else{
			return null;
		}
	}
	
	public Integer getRowIndex(String rowId){
		if(this.rowIdToIndex.containsKey(rowId)){
			return this.rowIdToIndex.get(rowId);
		}
		else{
			return null;
		}
	}
	
	public String getRowNameById(String rowId){
		if(this.rowIdToIndex.containsKey(rowId)){
			int rowIndex = this.rowIdToIndex.get(rowId);
			return String.valueOf(rowIndex + 1);
		}
		else{
			return null;
		}
	}
	
	public Rows(List<String> rowIds){
		this.allRowIds = rowIds;
		int rowCount = rowIds.size(); 
		for(int i = 0; i < rowCount; i++){  
			String rowName = String.valueOf(i + 1);
			String rowId = rowIds.get(i);
			this.rowNameToIndex.put(rowName, i);
			this.rowIdToIndex.put(rowId, i);
			this.allRowNames.add(rowName); 
		}		
	}	
}
