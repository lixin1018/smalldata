package com.novacloud.novaone.importExport;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;

import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.SysConfig; 
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.importExport.commonFunction.BigCsvReader;
import com.novacloud.novaone.importExport.commonFunction.BigExcelReader; 
import com.novacloud.novaone.importExport.commonFunction.IFileReader; 
import com.novacloud.novaone.importExport.definition.ExcelParser;
import com.novacloud.novaone.importExport.definition.Field;
import com.novacloud.novaone.importExport.definition.FileParser;
import com.novacloud.novaone.importExport.definition.ImportExportDefinition;
import com.novacloud.novaone.importExport.definition.ImportExportProcessor;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

public class ImportCoreProcess{
	private Session dbSession = null;
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}
	private Session getDBSession( ){
		return this.dbSession;
	}
	
	private String fileName = null;
	public void setFileName(String fileName){
		this.fileName = fileName;
	}

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}
	private IDBParserAccess getDBParserAccess() { 
		return this.dBParserAccess;
	}
	
	//待导入文件存储目录
	private static String fileFolder = null;
	private String getFileRootFolder(){
		if(ImportCoreProcess.fileFolder == null){
			String definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY);
			ImportCoreProcess.fileFolder = definitionFileDirectory + "\\import";
		}
		return ImportCoreProcess.fileFolder;
	} 

	private String definitionId = null;
	private String getDefinitionId() {
		return definitionId;
	}
	private void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}
	
	private String definitionVersionId = null;
	private String getDefinitionVersionId() {
		return definitionVersionId;
	}
	private void setDefinitionVersionId(String definitionVersionId) {
		this.definitionVersionId = definitionVersionId;
	}	
	
	private String destTableName = "";
	private String getDestTableName() {
		return destTableName;
	}
	private void setDestTableName(String destTableName) {
		this.destTableName = destTableName;
	}
	
	private IFileReader fileReader = null;
	private IFileReader getFileReader() {
		return fileReader;
	}
	private void setFileReader(IFileReader fileReader) {
		this.fileReader = fileReader;
	}
	
	private List<String[]> fileRows = null;
	private List<String[]> getFileRows() {
		return fileRows;
	}
	private void setFileRows(List<String[]> fileRows) {
		this.fileRows = fileRows;
	}

	private String importInstanceId = null;
	private String getImportInstanceId() {
		return importInstanceId;
	}
	private void setImportInstanceId(String importInstanceId) {
		this.importInstanceId = importInstanceId;
	}

	private ImportExportDefinition ieDefinition = null;
	private ImportExportDefinition getIEDefinition() {
		return ieDefinition;
	}
	private void setIEDefinition(ImportExportDefinition ieDefinition) {
		this.ieDefinition = ieDefinition;
	}
	
	private BigDecimal getRowCount(){
		if(this.fileRows == null){
			return null;
		}
		else{
			return new BigDecimal(this.fileRows.size());
		}
	}
	 
	private String getFilePath(){
		return this.getFileRootFolder() + "\\" + fileName;
	}
	
	
	private void createImportInstanceObj(Session dbSession, boolean hasError, String logInfo) {
		Data importInstData = DataCollection.getData("dm_ImportInstance");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("filename", fileName); 
		fieldValues.put("succeednum", new BigDecimal(0));
		fieldValues.put("desttablename", this.getDestTableName()); 
		fieldValues.put("statustype", hasError ? ImportStatusType.Error.toString() : ImportStatusType.Importing.toString());
		fieldValues.put("definitionid", this.getDefinitionId());
		fieldValues.put("definitionversionid", this.getDefinitionVersionId());
		fieldValues.put("loginfo", logInfo); 
		fieldValues.put("createtime", new Date());
		String idValue = this.dBParserAccess.insertByData(dbSession, importInstData, fieldValues);
		this.setImportInstanceId(idValue);
	} 
	
	private boolean init() throws Exception{
		try{
			this.initImportFileInfo(this.fileName);
			this.createImportInstanceObj(this.getDBSession(), false, null);	  
		}
		catch(Exception ex){
			ex.printStackTrace(); 
			this.createImportInstanceObj(this.getDBSession(), true,  NcpException.getFullErrorInfo(ex));	 
			throw ex;
		}
		try{  
			this.initImportRowInfo();
			this.updateImportTotalNum(this.getRowCount());
			return true;
		}
		catch(Exception ex){
			ex.printStackTrace(); 
			this.updateImportStatus(ImportStatusType.Error, 0, NcpException.getFullErrorInfo(ex));
			throw ex;
		}
	}
	
	private void initImportRowInfo() throws Exception{ 
		this.getFileReader(this.getDefinitionId(), this.getDefinitionVersionId(), this.getFilePath());
		this.checkValueLength();
	}
	
	private void initImportFileInfo(String fileName) throws Exception{
		String[] names = fileName.split("\\.");
		if(names.length > 2){			
			String definitionCode = names[0];
			String definitionVersionCode = names[1];
			this.getDefinitionIdByCode(definitionCode);
			this.getDefinitionVersionIdByCode(this.getDefinitionId(), definitionVersionCode);
			this.getDestTableNameByDefinitionId(this.getDefinitionId()); 
		}
		else{
			throw new Exception("导入文件的文件名错误, fileName = " + fileName);
		}
	} 
	
	private void getFileReader(String definitionId, String definitionVersionId, String filePath) throws Exception{
		ImportExportProcessor ieProcessor = new ImportExportProcessor();
		ieProcessor.setDBParserAccess(this.dBParserAccess);
		ieProcessor.setDBSession(this.getDBSession());
		String versionXml = ieProcessor.readVersion(definitionId, definitionVersionId);
		ImportExportDefinition ieDef = new ImportExportDefinition(versionXml);
		IFileReader er = null;
		switch(ieDef.getFileType()){
			case EXCEL:
				er = new BigExcelReader();
				break;
			case CSV:
				er = new BigCsvReader();
				break;
			case XML:
				//er = new BigExcelReader();
				break;
		}
	
		//ExcelReader er = new ExcelReader();
		//List<HashMap<String, Object>> rows = er.getSourceData(filePath, "List", (ExcelParser)ieDef.getFileParser());
 
		List<String[]> rows = er.getSourceData(filePath,  (FileParser)ieDef.getFileParser());
		
		this.setFileReader(er);
		this.setFileRows(rows);
		this.setIEDefinition(ieDef);
	}
	
	private void getDefinitionIdByCode(String code) throws Exception{
		Session dbSession = this.getDBSession();
		String getCodeSql = "select d.id from dm_importexportdefinition d where d.code = " + SysConfig.getParamPrefix() +"code";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", code);
		String id = (String)this.dBParserAccess.selectOne(dbSession, getCodeSql, p2vs);
		if(id == null){
			throw new Exception("Can not get importExportDefinition by code, code = " + code);
		}
		this.setDefinitionId(id);
	}
	
	private void getDefinitionVersionIdByCode(String definitionId, String code) throws Exception{
		Session dbSession = this.getDBSession();
		String getCodeSql = "select v.id as id from dm_importexportversion v where v.code = " + SysConfig.getParamPrefix() +"code and v.definitionid = " + SysConfig.getParamPrefix() + "definitionid";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", code);
		p2vs.put("definitionid", definitionId);
		String id = (String)this.dBParserAccess.selectOne(dbSession, getCodeSql, p2vs);
		if(id == null){
			throw new Exception("Can not get importExportDefinitionVersion by code, code = " + code + ", definitionId = " + definitionId);
		}
		this.setDefinitionVersionId(id);
	}

	
	private void getDestTableNameByDefinitionId(String definitionId) throws SQLException{
		Session dbSession = this.getDBSession();
		String getCodeSql = "select d.dbtablename from dm_importexportdefinition d where d.id = " + SysConfig.getParamPrefix() +"id";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", definitionId);
		String tableName = (String)this.dBParserAccess.selectOne(dbSession, getCodeSql, p2vs);
		this.setDestTableName("ie_" + tableName);
	}
	
	

	public void run() throws Exception{
		if(this.init()){
			Session dbSession = this.getDBSession();
			try {  
				List<String[]> fileRows = this.getFileRows();
				insertToDB(dbSession, fileRows);
			}
			catch(Exception ex){
				this.updateImportStatus(ImportStatusType.Error, 0, NcpException.getFullErrorInfo(ex));
				throw ex;
			}	
			finally{
				if(dbSession != null){
					dbSession.close();
				}
			}
		}
	}

	public void insertToDB(Session dbSession, List<String[]> allMemoRows) throws Exception{
		String dataName = this.getDestTableName();
		Data dataModel = DataCollection.getData(dataName);
		ImportExportDefinition ieDef = this.getIEDefinition();
		List<Field> allFields = ieDef.getFieldList();
		HashMap<String, String> itemName2DbName = new HashMap<String, String>();
		for(int i=0;i<allFields.size();i++){
			Field f = allFields.get(i);
			itemName2DbName.put(f.getItemName(), f.getDbFieldName());
		}
		
		HashMap<String, ValueType> dbFieldNameToValueType = new HashMap<String, ValueType>();
		for(int i=0;i<allFields.size();i++){
			Field f = allFields.get(i);
			ValueType valueType = ValueType.valueOf(f.getFieldType().toString());
			dbFieldNameToValueType.put(f.getDbFieldName(), valueType);
		}

		String importInstanceId = this.getImportInstanceId();
		int rowCount = allMemoRows.size(); 
		IDBParserAccess dbParserAccess =  this.getDBParserAccess();  
		IFileReader fileReader = this.getFileReader();

		List<String[]> batchRows = new ArrayList<String[]>();
		int batchNum = 1000;
		//每batchNum个为一个事务
		for(int i = 0; i < rowCount; i++){ 
			if( i % batchNum == 0){ 
				if(i != 0){
					fileReader.batchInsertToDB(dbSession, dbParserAccess, dataModel, batchRows, itemName2DbName, importInstanceId);
					this.updateImportStatus(ImportStatusType.Importing, batchNum, null);
				}
				batchRows = new ArrayList<String[]>();
			}
			batchRows.add(allMemoRows.get(i));  
		}
		if(batchRows.size() > 0){
			fileReader.batchInsertToDB(dbSession, dbParserAccess, dataModel, batchRows, itemName2DbName, importInstanceId);
			this.updateImportStatus(ImportStatusType.Importing, batchRows.size(), null);
		}
		this.updateImportStatus(ImportStatusType.Succeed, 0, null);
	}
	
	public void checkValueLength() throws Exception{
		List<String[]> allMemoRows = this.getFileRows();
		String dataName = this.getDestTableName();
		Data dataModel = DataCollection.getData(dataName);
		ImportExportDefinition ieDef = this.getIEDefinition();
		List<Field> allFields = ieDef.getFieldList();
		HashMap<String, String> itemName2DbName = new HashMap<String, String>();
		for(int i=0;i<allFields.size();i++){
			Field f = allFields.get(i);
			itemName2DbName.put(f.getItemName(), f.getDbFieldName());
		}
		
		HashMap<String, Integer> dbFieldNameToLength = new HashMap<String, Integer>();
		for(int i=0;i<allFields.size();i++){
			Field f = allFields.get(i); 
			dbFieldNameToLength.put(f.getDbFieldName(), f.getWidth());
		} 
		fileReader.checkValueLength(allMemoRows, itemName2DbName, dbFieldNameToLength); 
	}
	
	private void updateImportStatus(ImportStatusType statusType, int addSucceedNum, String logInfo){
		String importInstanceId = this.getImportInstanceId();
		String updateSql = "update dm_ImportInstance set statustype = " + SysConfig.getParamPrefix() + "statustype, "
				+ "loginfo = " + SysConfig.getParamPrefix() + "loginfo, "
				+ "modifytime = " + SysConfig.getParamPrefix() + "modifytime, "
				+ "succeednum = succeednum + " + SysConfig.getParamPrefix() + "succeednum "
				+ "where id =" + SysConfig.getParamPrefix() + "id"; 
		HashMap<String, Object> fieldValues = new HashMap<String, Object>(); 
		fieldValues.put("succeednum", new BigDecimal(addSucceedNum));
		fieldValues.put("statustype", statusType.toString());
		fieldValues.put("loginfo", logInfo); 
		fieldValues.put("id", importInstanceId); 
		fieldValues.put("modifytime", new Date());
		this.dBParserAccess.update(this.getDBSession(), updateSql, fieldValues);
	}
	
	private void updateImportTotalNum(BigDecimal totalNum){
		String importInstanceId = this.getImportInstanceId();
		String updateSql = "update dm_ImportInstance set totalnum = " + SysConfig.getParamPrefix() + "totalnum "
				+ "where id =" + SysConfig.getParamPrefix() + "id"; 
		HashMap<String, Object> fieldValues = new HashMap<String, Object>(); 
		fieldValues.put("totalnum", totalNum); 
		fieldValues.put("id", importInstanceId); 
		this.dBParserAccess.update(this.getDBSession(), updateSql, fieldValues);
	}
}
