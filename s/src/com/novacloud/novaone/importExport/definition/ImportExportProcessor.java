package com.novacloud.novaone.importExport.definition;

import java.io.File;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List; 
import java.util.UUID;

import org.apache.commons.lang.StringEscapeUtils;
import org.hibernate.Session;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.system.impl.Sys_DataImpl;
import com.novacloud.novaone.dao.system.impl.Sys_ViewImpl;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField;
import com.novacloud.novaone.model.sysmodel.DataFieldMap;
import com.novacloud.novaone.model.sysmodel.DownList;
import com.novacloud.novaone.model.sysmodel.DownListCollection;
import com.novacloud.novaone.model.sysmodel.DownListField;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;
import com.novacloud.novaone.model.sysmodel.ViewDispunit;
import com.novacloud.novaone.model.sysmodel.dbStructure.DataModelToDBTableCompare;
import com.novacloud.novaone.model.sysmodel.dbStructure.ImportExportDefinitionToModelCompare;

import net.sf.json.JSONObject;

public class ImportExportProcessor {

	private DataCollection dataCollection = null;
	public void setDataCollection(DataCollection dataCollection){
		this.dataCollection = dataCollection;
	} 

	private ViewCollection viewCollection = null;
	public void setViewCollection(ViewCollection viewCollection){
		this.viewCollection = viewCollection;
	} 
	
	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	//数据库Session（需要Service类里的方法把dbSession传递过来）
	private Session dbSession = null;
	protected Session getDBSession(){
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	} 
	
	//文件的保存文件位置（包括模板文件、填报实例文件和计算结果文件）
	private String definitionFileDirectory = null;
	public String getDefinitionFileDirectory(){
		if(definitionFileDirectory == null){
			definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY);
		}
		return definitionFileDirectory;
	}
	
	//启用模板版本
	public ValidateResult activateVersion(INcpSession session, String definitionId, String versionId, boolean enable) throws Exception{
		if(enable){
			 
			String versionXml = this.getVersionXmlByDB(definitionId, versionId);
			ValidateResult vr = this.validateVersion(session, definitionId, versionXml);
			if(vr.getSucceed() && enable){
				String alertInfo = vr.getAlert();
				String tableName = this.getTableNameByDefinitionId(definitionId);
				
				boolean autoUpdateModel = this.getNeedAutoUpdateModel(definitionId);
				if(autoUpdateModel){
					//更改对应的data、view模型
					ImportExportDefinitionToModelCompare ieDef2ModelCompare = new ImportExportDefinitionToModelCompare();
					ieDef2ModelCompare.setDBSession(this.getDBSession());
					ieDef2ModelCompare.setDBParserAccess(this.getDBParserAccess());
					ieDef2ModelCompare.init(tableName, versionXml);
					if(ieDef2ModelCompare.updateModel()){
						alertInfo += "模型发生变化，已自动更新模型\r\n";
					}
					
					//更改对应的数据库表结构
					DataModelToDBTableCompare model2TableCompare = new DataModelToDBTableCompare();
					model2TableCompare.setDBSession(this.getDBSession());
					model2TableCompare.setDBParserAccess(this.getDBParserAccess());
					model2TableCompare.init(tableName); 
					if(model2TableCompare.updateDbTableStructure()){
						alertInfo += "表结构发生变化，已自动更新模型\r\n";
					}
					
					//重新将模型加载到内存
					Data dataModel = dataCollection.reloadDataFromDB(ieDef2ModelCompare.getDataId());
					View viewModel = viewCollection.reloadViewFromDB(ieDef2ModelCompare.getViewId());
					
					Sys_DataImpl.generateJsByData(dataModel);
					Sys_ViewImpl.generateJsByView(viewModel);
				}
				
				//生成查询页面
				this.generateQueryPage(definitionId);
				
				//将当前version设置为启用状态
				this.activateVersionInDB(definitionId, versionId, enable);
				
				vr.setAlert(alertInfo);
			}
			return vr;
		}
		else{
			//将当前version设置为停用状态
			this.activateVersionInDB(definitionId, versionId, enable);
			return null;
		}
		
	}
	
	//验证模板版本（模板内容为字符串形式）
	public ValidateResult validateVersion(INcpSession session, String definitionId, String importExportXml) throws Exception{  
		ValidateResult vr = ImportExportDefinition.validate(importExportXml);
		return vr;
	} 
	
	//验证并更新模板版本（模板内容为字符串形式）
	public ValidateResult validateAndUpdateVersion(INcpSession session, String definitionId, String versionId, String userId, String importExportXml, String name, String code) throws Exception{
		HashMap<String, Object> versionObj = this.getVersionFromDB(versionId);
		if("Y".equals(versionObj.get("isActive"))){
			ValidateResult vr = this.validateVersion(session, definitionId, importExportXml);
			if(vr.getSucceed()){
				this.updateVersion(session, definitionId, versionId, importExportXml, userId, name, code);
				return null;
			}
			else{
				return vr;
			}
		}
		else{
			this.updateVersion(session, definitionId, versionId, importExportXml, userId, name, code);
		}
		return null;
	}
	
	//创建模板版本
	public String createVersion(INcpSession session, String definitionId, String importExportXml, String userId, String name) throws Exception{ 
    	UUID uuid = UUID.randomUUID();
		String excelGridVersionId = uuid.toString();
		String filePath = this.saveToVersionFile(definitionId, excelGridVersionId, importExportXml);
		this.createVersionInDB(definitionId, excelGridVersionId, userId, filePath, name, name + excelGridVersionId);
		return excelGridVersionId;
	}
	 
	//删除模板版本（打标记）
	public void deleteVersion(INcpSession session, List<String> versionIds) throws Exception{ 
		this.deleteVersionFromDB(versionIds);
	} 
	
	//更新模板版本（模板内容为ExcelGrid对象形式）
	public String updateVersion(INcpSession session, String importExportId, String versionId, ImportExportDefinition importExport, String userId, String name, String code) throws Exception{
		String importExportXml =  importExport.toXml(); 
		return this.updateVersion(session, importExportId, versionId, importExportXml, userId, name, code);
	} 

	//更新模板版本（模板内容为字符串形式）
	public String updateVersion(INcpSession session, String definitionId, String versionId, String excelGridJsonStr, String userId, String name, String code) throws Exception{ 
		String filePath = this.saveToVersionFile(definitionId, versionId, excelGridJsonStr);
		this.updateVersionInDB(definitionId, versionId, userId, filePath, name, code);
		return versionId;
	} 
	
	//创建模板版本
	public String createVersion(INcpSession session, String definitionId, ImportExportDefinition importExport, String userId, String name) throws Exception{
		String importExportXml =  importExport.toXml(); 
		return this.createVersion(session, definitionId, importExportXml, userId, name);
	}

	//复制模板版本（即将源版本复制一个新文件，并在数据表eg_definitionVersion插入新行）
	public String copyVersion(INcpSession session, String sourceDefinitionId, String sourceVersionId, String userId, String name) throws Exception{
		String importExportXml = this.readVersion(sourceDefinitionId, sourceVersionId);
		return this.createVersion(session, sourceDefinitionId, importExportXml, userId, name);
	} 
	
	//保存模板版本文件
	public String saveToVersionFile(String definitionId, String versionId, String importExportXml) throws Exception{
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String saveTimeStr = sdf.format(new Date()); 

		//判断excelGrid存储文件夹是否存在  
		String ieDirPath = this.getVersionFolderPath(definitionId);
		File ieDir =new File(ieDirPath);   
		if(!ieDir.exists() && !ieDir.isDirectory()) {        
			ieDir.mkdir();    
		}
		
		String filePath = definitionId + "\\" + versionId + "_" + saveTimeStr + ".xml";
		String fullPath = this.getVersionFilePath(filePath);
		FileOperate fo = new FileOperate();
		fo.createFile(fullPath, importExportXml);
		return filePath;
	}
	
	//获取模板版本文件夹路径
	private String getVersionFolderPath(String partPath){
		String filePath = this.getDefinitionFileDirectory() + "\\definitions\\" + partPath;
		return filePath;
	}
	
	//获取模板版本文件路径
	private String getVersionFilePath(String partPath){
		String filePath = this.getDefinitionFileDirectory() + "\\definitions\\"+ partPath;
		return filePath;
	} 
	
	//读取模板版本文件
	public String readVersion(String definitionId, String versionId) throws Exception{  
		String filePath = this.getVersionFilePathById(versionId);
		FileOperate fo = new FileOperate();
		String txt = fo.readTxt(filePath);
		return txt;
	} 
	
	//从数据库中构造versionxml，并存储在文件里
	public String getVersionXmlByDB(String definitionId, String versionId) throws Exception{
		DataRow versionRow = this.getVersionRow(versionId);
		List<DataRow> fieldRows = this.getVersionFieldRows(versionId);	
		String filePath = versionRow.getStringValue("filepath");
		String orderby = versionRow.getStringValue("orderby");
		String sourceDataFileType = versionRow.getStringValue("sourcedatafiletype");
		FileType fileType = FileType.valueOf(sourceDataFileType);
		boolean hasHeaderRow = versionRow.getBooleanValue("sourcedatahasheaderrow");

		ImportExportDefinition ied = new ImportExportDefinition();
		ied.setOrderby(orderby);
		ied.setFileType(fileType);
		ied.setUpdateType(UpdateType.UpdateExistRow);
		 
		switch(fileType){
			case EXCEL:{
				ExcelParser excelParser = new ExcelParser();
				excelParser.setHasHeaderRow(hasHeaderRow);
				List<ExcelColumn> columns = new ArrayList<ExcelColumn>();
				for(int i = 0; i < fieldRows.size(); i++){
					DataRow fieldRow = fieldRows.get(i);
					String dbFieldName = fieldRow.getStringValue("dbfieldname");
					String sourceColumnName = fieldRow.getStringValue("sourcecolumnname");
					String sourceFormatPattern = fieldRow.getStringValue("sourceformatpattern");
					String sourceDataType = fieldRow.getStringValue("sourcedatatype");
					DataType dataType = DataType.valueOf(sourceDataType);
					if(sourceColumnName != null && sourceColumnName.length() != 0){
						ExcelColumn column = new ExcelColumn();
						column.setExcelColumnName(sourceColumnName);
						column.setItemName(dbFieldName);
						column.setDataType(dataType);
						column.setFormatPattern(sourceFormatPattern);
						columns.add(column);
					}
				}
				excelParser.setColumns(columns);
				ied.setFileParser(excelParser);
			}
			break;
			case CSV:{
				CsvParser csvParser = new CsvParser();
				csvParser.setHasHeaderRow(hasHeaderRow);
				List<CsvColumn> columns = new ArrayList<CsvColumn>();
				for(int i = 0; i < fieldRows.size(); i++){
					DataRow fieldRow = fieldRows.get(i);
					String dbFieldName = fieldRow.getStringValue("dbfieldname");
					String sourceColumnName = fieldRow.getStringValue("sourcecolumnname");
					String sourceFormatPattern = fieldRow.getStringValue("sourceformatpattern");
					String sourceDataType = fieldRow.getStringValue("sourcedatatype");
					DataType dataType = DataType.valueOf(sourceDataType);
					if(sourceColumnName != null && sourceColumnName.length() != 0){
						CsvColumn column = new CsvColumn();
						column.setCsvColumnName(sourceColumnName);
						column.setItemName(dbFieldName);
						column.setDataType(dataType);
						column.setFormatPattern(sourceFormatPattern);
						columns.add(column);
					}
				}
				csvParser.setColumns(columns);
				ied.setFileParser(csvParser);
			}
			break;
			case XML:
			default:
				throw new Exception("尚未支持此导入文件类型. FileType = " + fileType.toString()); 
		} 

		List<Field> fieldList = new ArrayList<Field>();
		for(int i = 0; i < fieldRows.size(); i++){
			DataRow fieldRow = fieldRows.get(i);
			String showName = fieldRow.getStringValue("showname");
			boolean dbCanQuery = fieldRow.getBooleanValue("dbcanquery");
			String dbFieldName = fieldRow.getStringValue("dbfieldname");
			int dbWidth = fieldRow.getIntegerValue("dbwidth");
			int dbFractionLength = fieldRow.getIntegerValue("dbfractionlength");
			int displayWidth = fieldRow.getIntegerValue("displaywidth");
			boolean dbIsUnique = fieldRow.getBooleanValue("dbisunique");
			String dbDataType = fieldRow.getStringValue("dbfieldtype");
			DataType dataType = DataType.valueOf(dbDataType); 
			
			Field f = new Field();
			f.setCanQuery(dbCanQuery);
			f.setDbFieldName(dbFieldName);
			f.setWidth(dbWidth);
			f.setFieldType(dataType);
			//f.setFormatPattern(formatPattern);
			f.setFractionLength(dbFractionLength);
			//f.setIsMultiValue(isMultiValue);
			f.setIsUnique(dbIsUnique);
			f.setItemName(dbFieldName);
			//f.setListOptions(listOptions);
			//f.setMultiSplitter(multiSplitter);
			f.setShowName(showName);
			f.setDisplayWidth(displayWidth);
			fieldList.add(f);
			 
		}
		ied.setFieldList(fieldList);
		
		String importExportXml = ied.toXml();

		//判断excelGrid存储文件夹是否存在  
		String ieDirPath = this.getVersionFolderPath(definitionId);
		File ieDir =new File(ieDirPath);   
		if(!ieDir.exists() && !ieDir.isDirectory()) {        
			ieDir.mkdir();    
		}
		 
		String fullPath = this.getVersionFilePath(filePath);
		FileOperate fo = new FileOperate();
		fo.createFile(fullPath, importExportXml); 
	 
		return importExportXml;
	} 
	
	private DataRow getVersionRow(String versionId) throws Exception{
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.getDtById(dbSession, ieVersionData, versionId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 1){
			DataRow row = rows.get(0);
			return row;
		}
		else{
			throw new Exception("Can not get version info from db, version id = " + versionId);
		}
	}
	
	private List<DataRow> getVersionFieldRows(String versionId){
		Data ieFieldData = DataCollection.getData("dm_ImportExportField");
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.getDtByFieldValue(dbSession, ieFieldData, "versionid", "=", versionId);
		List<DataRow> rows = dt.getRows();
		return rows;
	}
 	
	//读取文件，生成ImportExport对象
	public ImportExportDefinition readToExcelGrid(INcpSession session, String definitionId, String versionId) throws Exception{  
		String importExportXml = this.readVersion(definitionId, versionId); 
		ImportExportDefinition importExport = new ImportExportDefinition(importExportXml);
		return importExport;
	}  

	//插入dm_ImportExportVersion表记录
	public void createVersionInDB(String excelGridId, String versionId, String userId, String filePath, String name, String code){
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("name", name);
		fieldValues.put("code", code);
		fieldValues.put("definitionid", excelGridId);
		fieldValues.put("createuserid", userId);
		fieldValues.put("filepath", filePath);
		fieldValues.put("createtime", new Date());
		fieldValues.put("isactive", "N");
		fieldValues.put("isdeleted", "N");
		
		this.dBParserAccess.insertByData(dbSession, ieVersionData, fieldValues, versionId); 
	} 
	
	//删除版本记录（实际上是打标记）
	public void deleteVersionFromDB(List<String> versionIds){
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession(); 
		this.dBParserAccess.deleteByData(dbSession, ieVersionData, versionIds); 
	}
 
	//更新dm_ImportExportVersion记录
	public void updateVersionInDB(String excelGridId, String versionId, String userId, String filePath, String name, String code){
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("name", name);
		fieldValues.put("code", code);
		fieldValues.put("definitionid", excelGridId);
		fieldValues.put("modifyuserid", userId);
		fieldValues.put("filepath", filePath);
		fieldValues.put("modifytime", new Date());
		
		this.dBParserAccess.updateByData(dbSession, ieVersionData, fieldValues, versionId); 
	}
	
	//启用版本后，在数据库中打标记
	public void activateVersionInDB(String excelGridId, String versionId, boolean isActive){
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("isactive", isActive ? "Y" : "N");
		
		this.dBParserAccess.updateByData(dbSession, ieVersionData, fieldValues, versionId); 
	}
	
	//从数据库中获取dm_ImportExportVersion表记录
	public HashMap<String, Object> getVersionFromDB(String versionId) throws Exception{
		Data egDefinitionVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.getDtById(dbSession, egDefinitionVersionData, versionId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() != 0){
			DataRow row = rows.get(0);
			HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
			fieldValues.put("id", row.getValue("id"));
			fieldValues.put("name", row.getValue("name"));
			fieldValues.put("definitionId", row.getValue("definitionid"));
			fieldValues.put("modifyUserId", row.getValue("modifyuserid"));
			fieldValues.put("modifyUserName", row.getValue("modifyusername"));
			fieldValues.put("modifyTime",row.getValue("modifytime"));
			fieldValues.put("createUserId", row.getValue("createuserid"));
			fieldValues.put("createUserName", row.getValue("createusername"));
			fieldValues.put("createTime",row.getValue("createtime"));
			fieldValues.put("filePath", row.getValue("filepath"));
			fieldValues.put("isActive", row.getValue("isactive"));
			
			return fieldValues;
		}
		else{
			throw new Exception("Can not get version info from db, version id = " + versionId);
		}
	} 
	
	//获取配置中设置的是否需要自动更新模型
	public boolean getNeedAutoUpdateModel(String definitionId) throws SQLException{
		String getAutoSql = "select d.autoupdatemodel as autoupdatemodel from dm_importexportdefinition d where id = " + SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", definitionId);
		Session dbSession = this.getDBSession();
		boolean autoUpdateModel = "Y".equals(this.dBParserAccess.selectOne(dbSession, getAutoSql, p2vs));
		return autoUpdateModel;
	}
	
	//从数据库中读取dm_ImportExportVersion表记录，并转换为json对象
	public JSONObject getVersionFromDBToJSONObject(String versionId) throws Exception{
		Data ieVersionData = DataCollection.getData("dm_ImportExportVersion");
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.getDtById(dbSession, ieVersionData, versionId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 1){
			DataRow row = rows.get(0);
			JSONObject fieldValues =  new JSONObject(); 
			fieldValues.put("id", row.getValue("id"));
			fieldValues.put("name", row.getValue("name"));
			fieldValues.put("code", row.getValue("code"));
			fieldValues.put("definitionId", row.getValue("definitionid"));
			fieldValues.put("modifyUserId", row.getValue("modifyuserid"));
			fieldValues.put("modifyUserName", row.getValue("modifyusername"));
			fieldValues.put("modifyTime", ValueConverter.convertToString(row.getValue("modifytime"), ValueType.Time));
			fieldValues.put("createUserId", row.getValue("createuserid"));
			fieldValues.put("createUserName", row.getValue("createusername"));
			fieldValues.put("createTime", ValueConverter.convertToString(row.getValue("createtime"), ValueType.Time));
			fieldValues.put("filePath", row.getValue("filepath"));
			
			return fieldValues;
		}
		else{
			throw new Exception("Can not get version info from db, version id = " + versionId);
		}
	}

	//根据模板版本id获取版本文件路径（相对路径，数据表dm_ImportExportVersion表记录中存储了路径）
	public String getVersionFilePathById(String versionId) throws SQLException{
		String sql = "select v.filepath from dm_ImportExportVersion v where v.id = " + SysConfig.getParamPrefix() + "versionId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("versionId", versionId); 
		Session dbSession = this.getDBSession();
		String filePath = this.getVersionFilePath((String)this.dBParserAccess.selectOne(dbSession, sql, p2vs));
		return filePath;
	}   
	
	//根据模板definitionId获取对应的table名称
	public String getTableNameByDefinitionId(String definitionId) throws SQLException{
		String sql = "select d.dbtablename from dm_importexportdefinition d where d.id = " + SysConfig.getParamPrefix() + "definitionId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("definitionId", definitionId); 
		Session dbSession = this.getDBSession();
		String tableName = "ie_" + (String)this.dBParserAccess.selectOne(dbSession, sql, p2vs);
		return tableName;
	}   
	
	//根据模板definitionId获取对应的definition名称
	public String getNameByDefinitionId(String definitionId) throws SQLException{
		String sql = "select d.name from dm_importexportdefinition d where d.id = " + SysConfig.getParamPrefix() + "definitionId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("definitionId", definitionId); 
		Session dbSession = this.getDBSession();
		String name = (String)this.dBParserAccess.selectOne(dbSession, sql, p2vs);
		return name;
	}   
 	
	public void generateQueryPage(String definitionId) throws Exception{		
		String importExportName = this.getNameByDefinitionId(definitionId);
		String dataName = this.getTableNameByDefinitionId(definitionId);
		String viewName = dataName;

		Data dataModel = DataCollection.getData(dataName);
		View viewModel = ViewCollection.getView(viewName);
		
		List<ViewDispunit> dispunitList = new ArrayList<ViewDispunit>();
		for(ViewDispunit dispunit : viewModel.getDispunits().values()){ 
			for(int j=0;j<=dispunitList.size();j++){
				if(j==dispunitList.size()){
					dispunitList.add(dispunit);
					break;
				}
				else if(dispunitList.get(j).getColIndex() > dispunit.getColIndex()){
					dispunitList.add(j, dispunit);
					break;
				}
			}
		} 
		
		List<String> paramWinModelStrings = new ArrayList<String>();
		for(ViewDispunit dispUnit : dispunitList){
			String dispUnitName = dispUnit.getName();
			DataField field = dataModel.getDataField(dispUnitName);
			if(dispUnit.getColSearch()){
				StringBuilder dispUnitParamString = new StringBuilder();
				dispUnitParamString.append(dispUnit.getName() +": {\r\n");
				dispUnitParamString.append("id: \"" + dispUnit.getId() + "\",\r\n");
				dispUnitParamString.append("name: \"" + dispUnitName + "\",\r\n");
				dispUnitParamString.append("label: \"" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + "\",\r\n");
				dispUnitParamString.append("valueType: valueType." + field.getValueType().toString().toLowerCase() + ",\r\n");
				dispUnitParamString.append("decimalNum: " + field.getDecimalNum() + ",\r\n");
				dispUnitParamString.append("valueLength: " + field.getValueLength() + ",\r\n");
				dispUnitParamString.append("isMultiValue: false,\r\n");
				dispUnitParamString.append("isNullable: true,\r\n");
				dispUnitParamString.append("isEditable: true,\r\n");

				String inputHelpType = field.getInputHelpType();
				String inputHelpName = field.getInputHelpName();
				dispUnitParamString.append("inputHelpType: \"" + (inputHelpType == null ? "" : inputHelpType) + "\",\r\n");
				dispUnitParamString.append("inputHelpName: \"" + (inputHelpName == null ? "" : inputHelpName) + "\",\r\n");
				String unitTypeString = "";
				if(inputHelpType != null && (inputHelpType.equals("pop") || inputHelpType.equals("list")) ){
					unitTypeString = inputHelpType;
					List<DataFieldMap> fieldMaps = field.getDataFieldMap();
					List<String> mapStrings = new ArrayList<String>();
					for(DataFieldMap fMap : fieldMaps){
						mapStrings.add("\"" + fMap.getDestField() + "\": \"" + fMap.getSourceField() + "\"");
					}
					dispUnitParamString.append("maps: {" + CommonFunction.listToString(mapStrings, ",") + "},\r\n");
					if(inputHelpType.equals("list")) { 
						dispUnitParamString.append("maps: {" + CommonFunction.listToString(mapStrings, ",") + "},\r\n");
						List<String> columnStrings = new ArrayList<String>();
						DownList dl = DownListCollection.getDownList(inputHelpName);
						
						List<DownListField> dlfs = dl.getDownListFields();
						for(DownListField dlf : dlfs){
							columnStrings.add("{field: \"" + dlf.getName() + "\", valueType: valueType." + dlf.getValueType().toString().toLowerCase() + ", title: \"" + dlf.getDisplayName() + "\", width: " + dlf.getShowWidth() + ", hidden: " + (dlf.getIsShow() ? "false" : "true") + " }");
						}
						dispUnitParamString.append("list:{name: \"" + inputHelpName + "\",\r\ncolumns: [" + CommonFunction.listToString(columnStrings, ",") + "]},\r\n");
					}
				}
				else{
					switch(field.getValueType()){
						case Decimal:{
								unitTypeString = "decimal";
							}
							break;
						case String:{
								unitTypeString = "text";
							}
							break;
						case Time:{
								unitTypeString = "time";
							}
							break;
						case Date:{
								unitTypeString = "date";
							}
							break;
						case Boolean:{
								unitTypeString = "checkbox";
							}
							break;
						default:
							break;
					}
				}
				dispUnitParamString.append("unitType:\"" + unitTypeString + "\",\r\n");
				dispUnitParamString.append("defaultValue: null\r\n}");
				
				paramWinModelStrings.add(dispUnitParamString.toString());
			}
		}
		String paramWinModel = ValueConverter.arrayToString(paramWinModelStrings, ",\r\n");
				
		List<String> queryParamValueStrings = new ArrayList<String>();
		for(ViewDispunit dispUnit : dispunitList){
			String dispUnitName = dispUnit.getName();
			DataField field = dataModel.getDataField(dispUnitName);
			String inputHelpType = field.getInputHelpType();
			if(dispUnit.getColSearch()){
				StringBuilder queryParamValueString = new StringBuilder(); 
				switch(field.getValueType()){
					case Decimal:
					case Time:
					case Boolean:
					case Date:{
						queryParamValueString.append("if(result.values." + dispUnitName + " != null){\r\n");
							queryParamValueString.append("gridWin.sysWhere.push({parttype:\"field\", field:\"" + dispUnitName + "\", title:\"" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + "\", operator:\"=\", value:  cmnPcr.objectToStr(result.values." + dispUnitName + ", valueType." + field.getValueType().toString().toLowerCase() + ") });\r\n");
							queryParamValueString.append("}\r\n");
						}
						break;
					case String:{
							if(inputHelpType != null && (inputHelpType.equals("list") || inputHelpType.equals("pop"))){
								queryParamValueString.append("if(result.values." + dispUnitName + " != null && result.values." + dispUnitName + ".length != 0){\r\n");
								queryParamValueString.append("gridWin.sysWhere.push({parttype:\"field\", field:\"" + dispUnitName + "\", title:\"" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + "\", operator:\"=\", value: result.values." + dispUnitName + " });\r\n");
								queryParamValueString.append("}\r\n");
							}
							else{
								queryParamValueString.append("if(result.values." + dispUnitName + " != null && result.values." + dispUnitName + ".length != 0){\r\n");
								queryParamValueString.append("gridWin.sysWhere.push({parttype:\"field\", field:\"" + dispUnitName + "\", title:\"" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + "\", operator:\"like\", value: result.values." + dispUnitName + " });\r\n");
								queryParamValueString.append("}\r\n");
							}
						}
						break;
					default:
						break;
				}
				queryParamValueStrings.add(queryParamValueString.toString());
			}
		}
		String queryParamValues = ValueConverter.arrayToString(queryParamValueStrings, "");
		 
		List<String> queryControlHtmlStrings = new ArrayList<String>();
		for(ViewDispunit dispUnit : dispunitList){
			String dispUnitName = dispUnit.getName();
			DataField field = dataModel.getDataField(dispUnitName);
			if(dispUnit.getColSearch()){
				StringBuilder queryControlHtmlString = new StringBuilder(); 
				switch(field.getValueType()){
					case Decimal:
					case Time:
					case Date:
					case String:{
							queryControlHtmlString.append("<div class=\"tableQueryNameLine\"><div class=\"tableQueryItemName\">" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + ":&nbsp;</div></div>\r\n");
							queryControlHtmlString.append("<div class=\"tableQueryValueLine\"><div class=\"tableQueryItemInputContainer\"><input class=\"tableQueryItemInput\" type=\"text\" name=\"" + dispUnitName + "\" paramCtrl=\"true\"/></div></div>\r\n");
						}
						break;
					case Boolean:{
							queryControlHtmlString.append("<div class=\"tableQueryNameLine\"><div class=\"tableQueryItemInputContainer\"><input class=\"tableQueryItemInputCheck\" type=\"checkbox\" name=\"" + dispUnitName + "\" paramCtrl=\"true\"/></div>\r\n");
							queryControlHtmlString.append("<div class=\"tableQueryItemInputContainer tableQueryItemCheckTitleContainer\"><div class=\"tableQueryItemName tableQueryCheckItemName\">" + StringEscapeUtils.escapeHtml(dispUnit.getLabel()) + ":&nbsp;</div></div></div>\r\n");
						}
						break;
					default:
						break;
				}
				queryControlHtmlStrings.add( queryControlHtmlString.toString() );
			}
		}
		String queryControlHtml  = ValueConverter.arrayToString(queryControlHtmlStrings, "");

		HashMap<String, String> replaceValues = new HashMap<String, String>();
		replaceValues.put("<%importExportName%>", importExportName);
		replaceValues.put("<%dataName%>", dataName);
		replaceValues.put("<%viewName%>", viewName);
		replaceValues.put("<%paramWinModel%>", paramWinModel);
		replaceValues.put("<%queryParamValues%>", queryParamValues);
		replaceValues.put("<%queryControlHtml%>", queryControlHtml);
		replaceValues.put("<%definitionId%>", definitionId);

		this.generateQueryPageHtml(viewName, replaceValues);		
	}

	private void generateQueryPageHtml(String viewName, HashMap<String, String> replaceValues) throws Exception{
		FileOperate fo = new FileOperate();
		String templateText = fo.readTxt(this.getTemplateFilePath());
		String queryPageText = this.generateQueryPageHtml(replaceValues, templateText);
		fo.createFile(this.getQueryPageFilePath(viewName), queryPageText);
	}
	private String generateQueryPageHtml(HashMap<String, String> replaceValues, String templateText){
		for(String name : replaceValues.keySet()){
			String value = replaceValues.get(name);
			templateText = templateText.replaceAll(name, value);
		}
		return templateText;
	}
	
	private String getQueryPageFilePath(String viewName){ 
		String jspFilePath = ContextUtil.getAbsolutePath() + NovaCloudState.IMPORTEXPORT_QUERYPAGES_DIR + viewName + ".jsp";
		return jspFilePath;
	}
	
	private String getTemplateFilePath(){ 
		String filePath = this.getDefinitionFileDirectory() + "\\templates\\queryPage.template";
		return filePath;	
	}
}
