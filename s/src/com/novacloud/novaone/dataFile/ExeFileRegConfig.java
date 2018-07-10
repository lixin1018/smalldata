package com.novacloud.novaone.dataFile;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType; 

public class ExeFileRegConfig implements InitializingBean {
	private static Logger logger=Logger.getLogger(ExeFileRegConfig.class);
	
	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess; 
	}

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}    
	
	public void init() throws SQLException{
		
		Session dbSession = this.transactionManager.getSessionFactory().openSession();	
		
		String queryExeTypeSql = "select et.id as id, et.code as code, et.name as name, et.isfileeditor as isfileeditor, et.description as description from fl_exetype et where et.isactive = 'Y' order by et.code asc";
		
		List<String> etAlias = new ArrayList<String>();
		etAlias.add("id");
		etAlias.add("code");
		etAlias.add("name");
		etAlias.add("isfileeditor");
		etAlias.add("description");
		
		HashMap<String, ValueType> etValueTypes = new HashMap<String, ValueType>();
		etValueTypes.put("id", ValueType.String);
		etValueTypes.put("code", ValueType.String);
		etValueTypes.put("name", ValueType.String);
		etValueTypes.put("isfileeditor", ValueType.Boolean);
		etValueTypes.put("description", ValueType.String);
		
		DataTable etTable = this.getDBParserAccess().selectList(dbSession, queryExeTypeSql, null, etAlias, etValueTypes);
		List<DataRow> etRows = etTable.getRows();
		HashMap<String, HashMap<String, Object>> activeExeTypeHash = new HashMap<String, HashMap<String, Object>>();
		List<HashMap<String, Object>> activeExeTypes = new ArrayList<HashMap<String, Object>>();
		for(int i = 0; i < etRows.size(); i++){
			DataRow etRow = etRows.get(i);
			HashMap<String, Object> et = new HashMap<String, Object>();
			String exeTypeCode = etRow.getStringValue("code");
			et.put("code", exeTypeCode);
			et.put("id", etRow.getStringValue("id"));
			et.put("name", etRow.getStringValue("name"));
			et.put("isFileEditor", etRow.getBooleanValue("isfileeditor"));
			et.put("description", etRow.getStringValue("description"));
			activeExeTypeHash.put(exeTypeCode, et);		
			activeExeTypes.add(et);
		}

		String queryFileTypeSql = "select ft.id as id, ft.code as code, ft.name as name, ft.allowcreateindir as allowcreateindir, ft.canpreview as canpreview, ft.description as description from fl_filetype ft where ft.isactive = 'Y' order by ft.code asc";
		
		List<String> ftAlias = new ArrayList<String>();
		ftAlias.add("id");
		ftAlias.add("code");
		ftAlias.add("name");
		ftAlias.add("allowcreateindir");
		ftAlias.add("canpreview");
		ftAlias.add("description");
		
		HashMap<String, ValueType> ftValueTypes = new HashMap<String, ValueType>();
		ftValueTypes.put("id", ValueType.String);
		ftValueTypes.put("code", ValueType.String);
		ftValueTypes.put("name", ValueType.String);
		ftValueTypes.put("allowcreateindir", ValueType.Boolean);
		ftValueTypes.put("canpreview", ValueType.Boolean);
		ftValueTypes.put("description", ValueType.String);
		
		DataTable ftTable = this.getDBParserAccess().selectList(dbSession, queryFileTypeSql, null, ftAlias, ftValueTypes);
		List<DataRow> ftRows = ftTable.getRows();
		HashMap<String, HashMap<String, Object>> activeFileTypeHash = new HashMap<String, HashMap<String, Object>>();
		List<HashMap<String, Object>> activeFileTypes = new ArrayList<HashMap<String, Object>>();
		for(int i = 0; i < ftRows.size(); i++){
			DataRow ftRow = ftRows.get(i);
			HashMap<String, Object> et = new HashMap<String, Object>();
			String exeTypeCode = ftRow.getStringValue("code");
			et.put("code", exeTypeCode);
			et.put("id", ftRow.getStringValue("id"));
			et.put("name", ftRow.getStringValue("name"));
			et.put("allowCreateInDir", ftRow.getBooleanValue("allowcreateindir"));
			et.put("canPreview", ftRow.getBooleanValue("canpreview"));
			et.put("description", ftRow.getStringValue("description"));
			activeFileTypeHash.put(exeTypeCode, et);
			activeFileTypes.add(et);
		}

		String queryExeAndFileTypeSql = "select ef.id as id, e.code as exetypecode, f.code as filetypecode, ef.isdefault as isdefault from fl_exeandfiletype ef left outer join fl_exetype e on e.id = ef.exeid left outer join fl_filetype f on f.id = ef.filetypeid where ef.isactive = 'Y' order by e.code asc, f.code asc";
		
		List<String> efAlias = new ArrayList<String>();
		efAlias.add("id");
		efAlias.add("exetypecode");
		efAlias.add("filetypecode"); 
		efAlias.add("isdefault"); 
		
		HashMap<String, ValueType> efValueTypes = new HashMap<String, ValueType>();
		efValueTypes.put("id", ValueType.String);
		efValueTypes.put("exetypecode", ValueType.String);
		efValueTypes.put("filetypecode", ValueType.String);
		efValueTypes.put("isdefault", ValueType.Boolean);
		
		DataTable efTable = this.getDBParserAccess().selectList(dbSession, queryExeAndFileTypeSql, null, efAlias, efValueTypes);
		List<DataRow> efRows = efTable.getRows();
		HashMap<String, List<String>> activeExeToFileTypeHash = new HashMap<String, List<String>>();
		HashMap<String, List<String>> activeFileToExeTypeHash = new HashMap<String, List<String>>();
		HashMap<String, String> defaultFileTypeToExeTypes = new HashMap<String, String>(); 
		for(int i = 0; i < efRows.size(); i++){
			DataRow efRow = efRows.get(i); 
			String exeTypeCode = efRow.getStringValue("exetypecode");
			String fileTypeCode = efRow.getStringValue("filetypecode");
			boolean isDefault = efRow.getBooleanValue("isdefault"); 

			List<String> fileTypes = null;
			if(activeExeToFileTypeHash.containsKey(exeTypeCode)){
				fileTypes = activeExeToFileTypeHash.get(exeTypeCode);
			}
			else{
				fileTypes = new ArrayList<String>();
			}
			if(!fileTypes.contains(fileTypeCode)){
				fileTypes.add(fileTypeCode);
			}

			List<String> exeTypes = null;
			if(activeFileToExeTypeHash.containsKey(fileTypeCode)){
				exeTypes = activeFileToExeTypeHash.get(fileTypeCode);
			}
			else{
				exeTypes = new ArrayList<String>();
			}
			if(!exeTypes.contains(exeTypeCode)){
				exeTypes.add(exeTypeCode);
			}
			
			if(isDefault && !defaultFileTypeToExeTypes.containsKey(fileTypeCode)){
				defaultFileTypeToExeTypes.put(fileTypeCode, exeTypeCode);
			}
		}
		
		ExeFileRegConfig.activeExeToFileTypeHash = activeExeToFileTypeHash;
		ExeFileRegConfig.activeFileToExeTypeHash = activeFileToExeTypeHash;
		ExeFileRegConfig.activeExeTypeHash = activeExeTypeHash;
		ExeFileRegConfig.activeFileTypeHash = activeFileTypeHash;
		ExeFileRegConfig.activeExeTypes = activeExeTypes;
		ExeFileRegConfig.activeFileTypes = activeFileTypes;
		ExeFileRegConfig.defaultFileTypeToExeTypes = defaultFileTypeToExeTypes; 
	}
 
	private static List<HashMap<String, Object>> activeExeTypes = null;
	public List<HashMap<String, Object>> getActiveExeTypes(){
		return activeExeTypes;
	}
		
	private static HashMap<String, HashMap<String, Object>> activeExeTypeHash = null;	
	public HashMap<String, Object> getExeType(String exeType){
		if(activeExeTypeHash.containsKey(exeType)){
			return activeExeTypeHash.get(exeType);
		}
		else{
			return null;
		}
	}

	private static List<HashMap<String, Object>> activeFileTypes = null;
	public List<HashMap<String, Object>> getActiveFileTypes(){
		return activeFileTypes;
	}
	
	private static HashMap<String, HashMap<String, Object>> activeFileTypeHash = null;
	public HashMap<String, Object> getFileType(String fileType){
		if(activeFileTypeHash.containsKey(fileType)){
			return activeFileTypeHash.get(fileType);
		}
		else{
			return null;
		}
	}

	private static HashMap<String, List<String>> activeExeToFileTypeHash = new HashMap<String, List<String>>();
	public List<String> getFileTypeByExeType(String exeType){
		if(activeExeToFileTypeHash.containsKey(exeType)){
			return activeExeToFileTypeHash.get(exeType);
		}
		else{
			return null;
		}
	}
	
	private static HashMap<String, List<String>> activeFileToExeTypeHash = new HashMap<String, List<String>>();
	public List<String> getExeTypeByFileType(String fileType){
		if(activeFileToExeTypeHash.containsKey(fileType)){
			return activeFileToExeTypeHash.get(fileType);
		}
		else{
			return null;
		}
	}
	
	private static HashMap<String, String> defaultFileTypeToExeTypes = null;
	public HashMap<String, String> getDefaultFileTypeToExeTypes(){
		return defaultFileTypeToExeTypes;
	}
	public String getDefaultExeType(String fileType){
		if(defaultFileTypeToExeTypes.containsKey(fileType)){
			return defaultFileTypeToExeTypes.get(fileType);
		}
		else{
			return null;
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception { 
		this.init();
	}
}
