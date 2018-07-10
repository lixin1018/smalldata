package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.novacloud.novaone.excelGrid.definition.ExcelGridColumn;
import com.novacloud.novaone.excelGrid.definition.ExcelGridRow;
import com.novacloud.novaone.excelGrid.definition.ExcelGridSheet;

public class Sheets {
	private HashMap<String, String> sheetNameToId = new HashMap<String, String>();
	private HashMap<String, String> sheetIdToName= new HashMap<String, String>();
	private List<String> allSheetNames = new ArrayList<String>();
	private List<String> allSheetIds = new ArrayList<String>();


	public Sheets(HashMap<String, ExcelGridSheet> egSheets){ 
		int sheetCount = egSheets.size(); 
		for(String sheetId : egSheets.keySet()){ 
			ExcelGridSheet egSheet = egSheets.get(sheetId); 
			this.sheetIdToName.put(egSheet.getId(),egSheet.getName());
			this.sheetNameToId.put(egSheet.getName(),egSheet.getId());
			this.allSheetNames.add(egSheet.getName());
			this.allSheetIds.add(egSheet.getId()); 

			List<String> allColumnIds = new ArrayList<String>();  
			for(int i = 0; i < egSheet.getAllColumns().size(); i++){	
				ExcelGridColumn column = egSheet.getAllColumns().get(i); 
				allColumnIds.add(column.getId());
			} 		
			Columns columns = new Columns(allColumnIds);
			this.sheetIdToColumns.put(egSheet.getId(), columns);
			
			List<String> allRowIds = new ArrayList<String>();
			for(int i = 0; i < egSheet.getAllRows().size(); i++){ 
				ExcelGridRow row = egSheet.getAllRows().get(i); 
				allRowIds.add(row.getId());
			} 
			Rows rows = new Rows(allRowIds);
			this.sheetIdToRows.put(egSheet.getId(), rows);
		}		
	}	

	public Sheets(List<String> sheetIds, List<String> sheetNames, List<Columns> columnsList, List<Rows> rowsList){ 
		int sheetCount = sheetIds.size(); 
		for(int j = 0; j < sheetCount; j++){  
			String sheetId = sheetIds.get(j);
			String sheetName = sheetNames.get(j);
			Columns columns = columnsList.get(j);
			Rows rows = rowsList.get(j);
			this.sheetIdToName.put(sheetId, sheetName);
			this.sheetNameToId.put(sheetName, sheetId);
			this.allSheetNames.add(sheetName);
			this.allSheetIds.add(sheetId); 
 
			this.sheetIdToColumns.put(sheetId, columns); 
			this.sheetIdToRows.put(sheetId, rows);
		}		
	}	
	
	public int size(){
		return this.allSheetIds.size();
	}
	
	public String getSheetIdByName(String name) throws Exception{
		if(this.sheetNameToId.containsKey(name)){
			return this.sheetNameToId.get(name);
		}
		else{
			//return null;
			throw new Exception("不存在的sheet页名称: " + name);
		}
	}  
	public String getSheetNameById(String sheetId){
		if(this.sheetIdToName.containsKey(sheetId)){
			String name = this.sheetIdToName.get(sheetId);
			return name;
		}
		else{
			return null;
		}
	}

	private HashMap<String, Rows> sheetIdToRows = new HashMap<String, Rows>();; 
	public HashMap<String, Rows> getSheetIdToRows() {
		return sheetIdToRows;
	}
	public void setSheetIdToRows(HashMap<String, Rows> sheetIdToRows) {
		this.sheetIdToRows = sheetIdToRows;
	}
	public Rows getRows(String sheetId){
		return this.sheetIdToRows.get(sheetId);
	}

	private HashMap<String, Columns> sheetIdToColumns = new HashMap<String, Columns>();  
	public HashMap<String, Columns> getSheetIdToColumns() {
		return sheetIdToColumns;
	}
	public void setSheetIdToColumns(HashMap<String, Columns> sheetIdToColumns) {
		this.sheetIdToColumns = sheetIdToColumns;
	}	
	public Columns getColumns(String sheetId){
		return this.sheetIdToColumns.get(sheetId);
	}
	
}
