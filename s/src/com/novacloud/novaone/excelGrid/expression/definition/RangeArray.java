package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.HashMap;
import java.util.Map;

public class RangeArray {
	private Object[][] values = null;
	private Map<String, Integer> colNameToIndex;
	private Map<String, Integer> rowNameToIndex;
	
	public RangeArray(String sheetId, Sheets sheets, String fromColId, String fromRowId, String toColId, String toRowId, Map<String, Object> cellValues){
		Columns columns = sheets.getColumns(sheetId);
		Rows rows = sheets.getRows(sheetId);
		int fromColIndex = fromColId.length() == 0 ? 0 : columns.getColumnIndex(fromColId);
		int fromRowIndex = fromRowId.length() == 0 ? 0 : rows.getRowIndex(fromRowId);
		int toColIndex = toColId.length() == 0 ? columns.size() -1 : columns.getColumnIndex(toColId);
		int toRowIndex = toRowId.length() == 0 ? rows.size() - 1 : rows.getRowIndex(toRowId);

		if(fromColIndex > toColIndex){
			int tempColIndex = toColIndex;
			toColIndex = fromColIndex;
			fromColIndex = tempColIndex;
		}
		if(fromRowIndex > toRowIndex){
			int tempRowIndex = toRowIndex;
			toRowIndex = fromRowIndex;
			fromRowIndex = tempRowIndex;
		}
		this.colNameToIndex = new HashMap<String, Integer>();
		for(int colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
			String colId = columns.getColumnId(colIndex);
			String colName = columns.getColumnNameById(colId);
			this.colNameToIndex.put(colName, colIndex - fromColIndex);
		}

		this.rowNameToIndex = new HashMap<String, Integer>();
		for(int rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			String rowId = rows.getRowId(rowIndex);
			String rowName = rows.getRowNameById(rowId);
			this.rowNameToIndex.put(rowName, rowIndex - fromRowIndex);
		}
		
		values = new Object[toRowIndex - fromRowIndex + 1][toColIndex - fromColIndex + 1];
		for(int rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			
			String rowId = rows.getRowId(rowIndex);
			for(int colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
				String colId = columns.getColumnId(colIndex); 
				String cellId = sheetId + "_" + colId + "_" + rowId;
				Object value = cellValues.get(cellId);
				values[rowIndex - fromRowIndex][colIndex - fromColIndex] = value;
			} 
		}		 
	}
	
	public Object getValue(String colName, String rowName) throws Exception{
		if(!this.colNameToIndex.containsKey(colName)){
			throw new Exception("Can not get value from cell range, colName = " + colName);
		}
		if(!this.rowNameToIndex.containsKey(rowName)){
			throw new Exception("Can not get value from cell range, rowName = " + rowName);
		}
		int colIndex = this.colNameToIndex.get(colName);
		int rowIndex = this.rowNameToIndex.get(rowName);
		return this.values[rowIndex][colIndex];
	}
	
	public Object[][] getValues(){
		return this.values;
	}
	
	public Object[] getRowValue(String rowName){
		int rowIndex = this.rowNameToIndex.get(rowName);
		return this.values[rowIndex];
	}
}
