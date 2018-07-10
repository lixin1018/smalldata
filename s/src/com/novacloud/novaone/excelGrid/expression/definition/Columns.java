package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Columns {
	private HashMap<String, Integer> columnNameToIndex = new HashMap<String, Integer>();
	private HashMap<String, Integer> columnIdToIndex = new HashMap<String, Integer>();
	private List<String> allColumnNames = new ArrayList<String>();
	private List<String> allColumnIds = new ArrayList<String>();

	public int size(){
		return this.allColumnIds.size();
	}
	
	public Integer getColumnIndexByName(String name){
		if(this.columnNameToIndex.containsKey(name)){
			return this.columnNameToIndex.get(name);
		}
		else{
			return null;
		}
	}
	public String getColumnNameById(String colId){
		if(this.columnIdToIndex.containsKey(colId)){
			int colIndex = this.columnIdToIndex.get(colId);
			return this.allColumnNames.get(colIndex);
		}
		else{
			return null;
		}
	}
	
	public String getColumnId(int colIndex){
		if(this.allColumnIds.size() > colIndex){
			return this.allColumnIds.get(colIndex);
		}
		else{
			return null;
		}
	}
	
	public Integer getColumnIndex(String colId){
		if(this.columnIdToIndex.containsKey(colId)){
			return this.columnIdToIndex.get(colId);
		}
		else{
			return null;
		}
	}
	
	public Columns(List<String> columnIds){
		this.allColumnIds = columnIds;
		int columnCount = columnIds.size();
		int columnIndex =  0;
		for(int i = -1; i < 26; i++){
			String chr1 = (i == -1) ? "" : String.valueOf((char)(i + 65));
			for(int j = 0; j < 26; j++){
				String chr2 = String.valueOf((char)(j + 65));
				String columnName = chr1 + chr2;
				String columnId = columnIds.get(columnIndex);
				this.columnNameToIndex.put(columnName, columnIndex);
				this.columnIdToIndex.put(columnId, columnIndex);
				this.allColumnNames.add(columnName);
				columnIndex++;
				if(columnCount <= columnIndex){
					break;
				}
			}	
			if(columnCount <= columnIndex){
				break;
			}	
		}		
	}	
}
