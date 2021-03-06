package com.novacloud.novaone.importExport.commonFunction;

import java.io.FileInputStream;
import java.io.InputStream; 
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List; 

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row; 
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.importExport.definition.CsvColumn;
import com.novacloud.novaone.importExport.definition.DataType;
import com.novacloud.novaone.importExport.definition.ExcelColumn;
import com.novacloud.novaone.importExport.definition.ExcelParser;
import com.novacloud.novaone.importExport.definition.Field;
import com.novacloud.novaone.importExport.definition.FileParser;
import com.novacloud.novaone.importExport.definition.ImportExportDefinition;
import com.novacloud.novaone.model.sysmodel.Data; 

public class ExcelReader implements IFileReader{	

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	} 	
	
	private HashMap<Integer, ExcelColumn> index2ExcelColumns = null;
	public HashMap<Integer, ExcelColumn> getIndex2ExcelColumns() {
		return index2ExcelColumns;
	}
	private void setIndex2ExcelColumns(HashMap<Integer, ExcelColumn> index2ExcelColumns) {
		this.index2ExcelColumns = index2ExcelColumns;
	}
	
	private HashMap<String, Integer> excelColName2Index = null;
	public HashMap<String, Integer> getExcelColName2Index() {
		return excelColName2Index;
	}
	private void setExcelColName2Index(HashMap<String, Integer> excelColName2Index) {
		this.excelColName2Index = excelColName2Index;
	}
	
	private XSSFWorkbook getWorkbook(String filePath) throws Exception{		
		InputStream fs= null;
		try {
			fs = new FileInputStream(filePath); 
			XSSFWorkbook wb = new XSSFWorkbook(fs);
			return wb;
		}
		catch(Exception ex){
			throw new Exception("读取Excel文件出错。 File Path = " + filePath);
		}
	}

	private XSSFSheet getSheet(XSSFWorkbook wb){
		XSSFSheet sheet = null; 
		sheet = wb.getSheetAt(0); 
		return sheet;
	}
	private List<Row> getAllRows(XSSFSheet sheet){
		int rowCount = sheet.getLastRowNum();
		List<Row> allRows = new ArrayList<Row>();
        for( int i=0; i<=rowCount; i++){
        	Row row = sheet.getRow(i);
        	allRows.add(row);
        }
        return allRows;
	}
	
	private HashMap<String, Integer> getDefaultColName2Index(){
		String[] lts = new String[]{"", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
		HashMap<String, Integer> excelColName2Index = new HashMap<String, Integer>();
		int colIndex = 0;
		for(int i=0;i<lts.length;i++){
			for(int j=1;j<lts.length;j++){
				excelColName2Index.put(lts[i] + lts[j], colIndex);
				colIndex++;
			}	
		}
		return excelColName2Index;
	}
	
	private HashMap<String, Integer> getColName2Index(Row headerRow) throws Exception{
		HashMap<String, Integer> excelColName2Index = new HashMap<String, Integer>(); 
		for(int i=0; i<headerRow.getLastCellNum(); i++){
			Cell cell = headerRow.getCell(i);
			if(cell != null){
				String cellStr = cell.getStringCellValue();
				if(cellStr.length() != 0){
					cellStr = cellStr.trim();
					if(excelColName2Index.containsKey(cellStr)){
						throw new Exception("Excel中不在两列（或更多）的名称为'" + cellStr + "'.");
					}
					else{
						excelColName2Index.put(cellStr, i);
					}
				}
			}
		}
		return excelColName2Index;
	}
	
	public List<String[]> getSourceData(String filePath, FileParser fileParser) throws Exception{
		XSSFWorkbook wb = this.getWorkbook(filePath);
		XSSFSheet sheet = this.getSheet(wb); 
	    Iterator<Row> rowIterator = sheet.iterator();  

		HashMap<Integer, ExcelColumn> index2ExcelColumns = new HashMap<Integer, ExcelColumn>();  
		ExcelParser excelParser = (ExcelParser)fileParser;
		List<ExcelColumn> allColumns = excelParser.getColumns();
		
		boolean hasHeaderRow = excelParser.getHasHeaderRow();
		HashMap<String, Integer> excelColName2Index = null;
		if(hasHeaderRow){
			if(rowIterator.hasNext()){
				Row headerRow = rowIterator.next();
				excelColName2Index =this.getColName2Index(headerRow); 
			}
			else{
				throw new Exception("Excel的Sheet页为空，所以无法获取表头行.");
			}
		}
		else{
			excelColName2Index = this.getDefaultColName2Index();
		}
		for(int i=0;i<allColumns.size();i++){
			ExcelColumn ec = allColumns.get(i);
			String excelColName = ec.getExcelColumnName();
			if(excelColName2Index.containsKey(excelColName))	{
				int index = excelColName2Index.get(excelColName);
				index2ExcelColumns.put(index, ec);
			}
			else{
				throw new Exception("Excel中不存在列'" + excelColName + "'.");
			}					
		}			
		this.setExcelColName2Index(excelColName2Index);
		this.setIndex2ExcelColumns(index2ExcelColumns);
		
		List<String[]> allMemoRows = new ArrayList<String[]>();
 
	    while (rowIterator.hasNext()) {
	        Row row = rowIterator.next();  
	        int colIndex = 0;
			List<String> rowStrs  = new ArrayList<String>();

	        Iterator<Cell> cellIterator = row.cellIterator();
	        while (cellIterator.hasNext()) {
	            Cell cell = cellIterator.next(); 
				if(!index2ExcelColumns.containsKey(colIndex)){
					colIndex++;
					continue;
				}
				else{
					colIndex++;
					if(cell != null){ 
					    String sourceValue = cell.toString(); 
					    rowStrs.add(sourceValue);						    	
					}
				} 
			}
			allMemoRows.add(rowStrs.toArray(new String[rowStrs.size()]));
	    }
		return allMemoRows;
	} 
	
	public void batchInsertToDB(Session dbSession, IDBParserAccess dbParserAccess, Data dataModel, List<String[]> batchRows, HashMap<String, String> itemName2DbName, String importInstanceId) throws Exception{
		
		int rowCount = batchRows.size();
		List<HashMap<String, Object>> batchRowObjects = new ArrayList<HashMap<String, Object>>();
		for(int i = 0; i < rowCount; i++){ 
			HashMap<String, Object> f2vs  = new HashMap<String, Object>(); 
			String[] row = batchRows.get(i);
			for(int colIndex = 0; colIndex < row.length; colIndex++){ 
				String sourceValue = row[colIndex]; 
				if(sourceValue != null && sourceValue.length() != 0){  
				    ExcelColumn ec = index2ExcelColumns.get(colIndex);
					String itemName = ec.getItemName();
					if(itemName2DbName.containsKey(itemName)){		
					    DataType dType = ec.getDataType();
					    Object destValue = null;
					    switch(dType){
						    case String:
						    	destValue = sourceValue;
						    	break;
						    case Decimal:
						    	destValue = ValueConverter.convertToDecimal(sourceValue, ec.getFormatPattern());
						    	break;
						    case Date:
						    	destValue = ValueConverter.convertToDate(sourceValue, ec.getFormatPattern());
						    	break;
						    case Time:
						    	destValue = ValueConverter.convertToTime(sourceValue, ec.getFormatPattern());
						    	break;
						    case Boolean:
						    	destValue = ValueConverter.convertToBoolean(sourceValue, "是","否");
						    	break; 
					    }
					    //f2vs.put(ec.getItemName().toLowerCase() + "_source", sourceValue);	 
					    f2vs.put(itemName2DbName.get(itemName).toLowerCase(), destValue);
					}						    	
				}
			}
			f2vs.put("parentid", importInstanceId);
			f2vs.put("createtime", new Date());
			batchRowObjects.add(f2vs);  
	    } 
		
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			dbParserAccess.insertByData(dbSession, dataModel, batchRowObjects);
			tx.commit();
		}
		catch(RuntimeException ex){
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}
	}
	
	public void checkValueLength(List<String[]> allRows, HashMap<String, String> itemName2DbName, HashMap<String, Integer> dbFieldNameToLength, HashMap<String, DataType> dbFieldNameToType) throws Exception{ 
		
		int rowCount = allRows.size(); 
		for(int i = 0; i < rowCount; i++){  
			String[] row = allRows.get(i);
			for(int colIndex = 0; colIndex < row.length; colIndex++){ 
				String sourceValue = row[colIndex]; 
				if(sourceValue != null && sourceValue.length() != 0){  
				    ExcelColumn ec = index2ExcelColumns.get(colIndex); 
					String itemName = ec.getItemName();
					if(dbFieldNameToLength.containsKey(itemName) && dbFieldNameToType.get(itemName) == DataType.String){		
						int dbFieldWidth = dbFieldNameToLength.get(itemName);
						if(sourceValue.length() > dbFieldWidth){ 
							throw new Exception("字段值过长, rowIndex = " + i + ", itemName = " + itemName + ", dataLength = " + sourceValue.length() + ", dbFieldWidth = " + dbFieldWidth);
						}
					}
				}
			} 
	    }  
	}
}
