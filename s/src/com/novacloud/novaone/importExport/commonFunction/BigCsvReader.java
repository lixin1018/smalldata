package com.novacloud.novaone.importExport.commonFunction;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PushbackInputStream;
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
import com.novacloud.novaone.importExport.definition.CsvParser;
import com.novacloud.novaone.importExport.definition.DataType; 
import com.novacloud.novaone.importExport.definition.Field;
import com.novacloud.novaone.importExport.definition.FileParser;
import com.novacloud.novaone.importExport.definition.ImportExportDefinition;
import com.novacloud.novaone.model.sysmodel.Data;
import com.opencsv.CSVReader; 

public class BigCsvReader implements IFileReader{	

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	} 	 
	
	private HashMap<Integer, CsvColumn> index2CsvColumns = null;
	public HashMap<Integer, CsvColumn> getIndex2CsvColumns() {
		return index2CsvColumns;
	}
	private void setIndex2CsvColumns(HashMap<Integer, CsvColumn> index2CsvColumns) {
		this.index2CsvColumns = index2CsvColumns;
	}
	
	private HashMap<String, Integer> csvColName2Index = null;
	public HashMap<String, Integer> getCsvColName2Index() {
		return csvColName2Index;
	}
	private void setCsvColName2Index(HashMap<String, Integer> csvColName2Index) {
		this.csvColName2Index = csvColName2Index;
	}
	
	private HashMap<String, Integer> getDefaultColName2Index(){
		String[] lts = new String[]{"", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
		HashMap<String, Integer> csvColName2Index = new HashMap<String, Integer>();
		int colIndex = 0;
		for(int i=0;i<lts.length;i++){
			for(int j=1;j<lts.length;j++){
				csvColName2Index.put(lts[i] + lts[j], colIndex);
				colIndex++;
			}	
		}
		return csvColName2Index;
	}
	
	private HashMap<String, Integer> getColName2Index(String[] headerRow) throws Exception{
		HashMap<String, Integer> csvColName2Index = new HashMap<String, Integer>(); 
		for(int i=0; i<headerRow.length; i++){ 
			String cellStr = headerRow[i];
			if(cellStr.length() != 0){
				cellStr = cellStr.trim();
				if(csvColName2Index.containsKey(cellStr)){
					throw new Exception("CSV中不在两列（或更多）的名称为'" + cellStr + "'.");
				}
				else{
					csvColName2Index.put(cellStr, i);
				}
			}
		}
		return csvColName2Index;
	} 
	
    //读取流中前面的字符，看是否有bom，如果有bom，将bom头先读掉丢弃  
    private static InputStream getInputStream(InputStream in) throws IOException {  
  
        PushbackInputStream testin = new PushbackInputStream(in);  
        int ch = testin.read();  
        if (ch != 0xEF) {  
            testin.unread(ch);  
        } else if ((ch = testin.read()) != 0xBB) {  
            testin.unread(ch);  
            testin.unread(0xef);  
        } else if ((ch = testin.read()) != 0xBF) {  
            throw new IOException("错误的UTF-8格式文件");  
        } else {  
        // 不需要做，这里是bom头被读完了  
        // System.out.println("still exist bom");  
        }  
        return testin;  
  
    } 
	
    //根据一个文件名，读取完文件，干掉bom头
    private static void trimBom(String fileName) throws IOException {  
  
        FileInputStream fin = null;
        InputStream in = null;
        ByteArrayOutputStream bos = null;
        FileOutputStream out = null;
		try{
			fin = new FileInputStream(fileName);  
	        // 开始写临时文件  
	        in = getInputStream(fin);  
	        bos = new ByteArrayOutputStream();  
	        byte b[] = new byte[4096];  
	  
	        int len = 0;  
	        while (in.available() > 0) {  
	            len = in.read(b, 0, 4096);  
	            //out.write(b, 0, len);  
	            bos.write(b, 0, len);  
	        }   
	  
	        //临时文件写完，开始将临时文件写回本文件。  
	        out = new FileOutputStream(fileName);  
	        out.write(bos.toByteArray());  
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(bos != null){
		        bos.close(); 
			}
			if(in != null){
				in.close(); 
			}
			if(fin != null){
				fin.close(); 
			}
			if(out != null){
				out.close(); 
			}
		}
    }  
	
	public List<String[]> getSourceData(String filePath, FileParser fileParser) throws Exception{
		CsvParser csvParser = (CsvParser)fileParser;
		
		this.trimBom(filePath);
		
		File file = new File(filePath);
		CSVReader csvReader = null;
		InputStreamReader isr = null;
		try{ 
			isr = new InputStreamReader(new FileInputStream(file), "utf-8"); 
			csvReader = new CSVReader(isr);
			 
			HashMap<Integer, CsvColumn> index2CsvColumns = new HashMap<Integer, CsvColumn>();  
			List<CsvColumn> allColumns = csvParser.getColumns();
			
			boolean hasHeaderRow = csvParser.getHasHeaderRow();
			HashMap<String, Integer> csvColName2Index = null;
			if(hasHeaderRow){
				String[] headerRow = csvReader.readNext();  
				if(headerRow != null && headerRow.length > 0){ 
					csvColName2Index =this.getColName2Index(headerRow); 
				}
				else{
					throw new Exception("无法获取表头行.");
				}
			}
			else{
				csvColName2Index = this.getDefaultColName2Index();
			} 
			for(int i = 0; i < allColumns.size(); i++){
				CsvColumn ec = allColumns.get(i);
				String csvColName = ec.getCsvColumnName();
				if(csvColName2Index.containsKey(csvColName))	{
					int index = csvColName2Index.get(csvColName);
					index2CsvColumns.put(index, ec);
				}
				else{
					throw new Exception("CSV中不存在列'" + csvColName + "'.");
				}					
			}	 
			
			this.setCsvColName2Index(csvColName2Index);
			this.setIndex2CsvColumns(index2CsvColumns);
			
	
	        List<String[]> allRows = new ArrayList<String[]>();
	        String[] row = csvReader.readNext(); 
	        int rowIndex = 0;
	        while(row != null && row.length != 0){			 
	        	allRows.add(row);
				row = csvReader.readNext();
		        rowIndex++;
		    }
	        return allRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(isr != null){
				isr.close();
			}
			if(csvReader != null){
				csvReader.close();
			}
		}
        /*
		List<HashMap<String, Object>> allMemoRows = new ArrayList<HashMap<String, Object>>();
        String[] row = csvReader.readNext();
        int rowIndex = 0;
        while(row != null && row.length != 0){ 
			HashMap<String, Object> f2vs  = new HashMap<String, Object>(); 
			for(int colIndex = 0; colIndex < row.length; colIndex++){ 
				String sourceValue = row[colIndex]; 
				if(sourceValue != null && sourceValue.length() != 0){  
				    ExcelColumn ec = index2ExcelColumns.get(colIndex);
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
				    f2vs.put(ec.getItemName() + "_source", sourceValue);		
				    f2vs.put(ec.getItemName(), destValue);						    	
				}
			}
			allMemoRows.add(f2vs);
			row = csvReader.readNext();
	        rowIndex++;
	    }
		return allMemoRows;
	    */
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
				    CsvColumn ec = index2CsvColumns.get(colIndex);
					
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
			f2vs.put("isdeleted", "N");
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
	
	public void checkValueLength(List<String[]> allRows, HashMap<String, String> itemName2DbName, HashMap<String, Integer> dbFieldNameToLength) throws Exception{ 
		
		int rowCount = allRows.size(); 
		for(int i = 0; i < rowCount; i++){  
			String[] row = allRows.get(i);
			for(int colIndex = 0; colIndex < row.length; colIndex++){ 
				String sourceValue = row[colIndex]; 
				if(sourceValue != null && sourceValue.length() != 0){  
				    CsvColumn ec = index2CsvColumns.get(colIndex); 
					String itemName = ec.getItemName();
					if(dbFieldNameToLength.containsKey(itemName)){		
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
