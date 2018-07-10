package com.novacloud.novaone.importExport;
 
import java.io.File;
import java.math.BigDecimal; 
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List; 
import org.apache.log4j.Logger;
import org.hibernate.Session;

import com.novacloud.novaone.asynService.InvokeStatusType;
import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.expression.run.ExternalBase;
import com.novacloud.novaone.expression.run.IDatabaseAccess;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 

//异步调用处理
public class ImportFolderMonitor extends ExternalBase{ 
	private static Logger logger=Logger.getLogger(ImportFolderMonitor.class);


	private String serviceId = null;
	private String getServiceId() {
		return serviceId;
	}
	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}
	
	//待导入文件存储目录
	private static String destFolder = null;
	private String getDestFolder(){
		if(ImportFolderMonitor.destFolder == null){
			String definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY);
			ImportFolderMonitor.destFolder = definitionFileDirectory + "\\import";
		}
		return ImportFolderMonitor.destFolder;
	}
	
	private String getDestFilePath(String fileName){
		return this.getDestFolder() + "\\" + fileName;
	}
	
	public void monitorImportFolder(String folder) throws Exception{
		FileOperate fo = new FileOperate();
		File[] allFiles = fo.getFileList(folder);
		if(allFiles.length > 0){
			File oldestFile = null;
			long lastmodifyTime = 0;
			for(File f : allFiles){
				if(oldestFile == null || f.lastModified() < lastmodifyTime){
					oldestFile = f;
					lastmodifyTime = f.lastModified();
				}
			}
			
			Date date = new Date();
			//date.setTime(lastmodifyTime); 
	        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmssSSS");    
			String lastmodifyTimeStr = formatter.format(date);
			String fileName = oldestFile.getName();
			String sourceFilePath = oldestFile.getAbsolutePath();
			String destFileName = fileName + "." + lastmodifyTimeStr;
			String destFilePath = this.getDestFilePath(destFileName);
			fo.copyFile(sourceFilePath, destFilePath);
			fo.delFile(sourceFilePath);
			
			HashMap<String, ValueType> parameterValueTypes = new HashMap<String, ValueType>();
			parameterValueTypes.put("fileName", ValueType.String);
			HashMap<String, Object> parameterValues = new HashMap<String, Object>();
			parameterValues.put("fileName", destFileName);
			
			this.createAsynInvoke(parameterValueTypes, parameterValues);
		}
	}  
	 
	//创建异步调用
	private String createAsynInvoke(HashMap<String, ValueType> parameterValueTypes, HashMap<String, Object> parameterValues) throws Exception{

		IDatabaseAccess databaseAccess = this.getDatabaseAccess();
		Session dbSession = databaseAccess.getSession();
		IDBParserAccess dBParserAccess = databaseAccess.getDBParserAccess();
		
		Data invokeData = DataCollection.getData("ais_Invoke");
		Data invokeParameterData = DataCollection.getData("ais_InvokeParameter");
		
		HashMap<String, Object> invokeValues = new HashMap<String, Object>();
		invokeValues.put("serviceid", this.getServiceId());
		invokeValues.put("userid", "");
		invokeValues.put("fromname", "import");
		invokeValues.put("fromid", "");
		invokeValues.put("createtime", new Date());
		invokeValues.put("statustype", InvokeStatusType.waiting.toString());
		
		String invokeId = dBParserAccess.insertByData(dbSession, invokeData, invokeValues);
		
		List<HashMap<String, Object>> allInvokeParameterValues = new ArrayList<HashMap<String, Object>>();
		for(String pName : parameterValueTypes.keySet()){
			ValueType valueType = parameterValueTypes.get(pName);
			Object valueObj = parameterValues.get(pName);
			String valueStr = ValueConverter.convertToString(valueObj, valueType);
			HashMap<String, Object> invokeParameterValues = new HashMap<String, Object>();
			invokeParameterValues.put("name", pName);
			invokeParameterValues.put("valuetype", valueType.toString());
			invokeParameterValues.put("value", valueStr);
			invokeParameterValues.put("invokeid", invokeId);
			allInvokeParameterValues.add(invokeParameterValues);
		}
		dBParserAccess.insertByData(dbSession, invokeParameterData, allInvokeParameterValues);
		
		return invokeId;
	}

	
	//初始化异步调用参数值
	private HashMap<String, Object> getInvokeParameters(String invokeId) throws Exception{
		String pSql = "select aisip.id as pid,"
					+ " aisip.name as name,"
					+ " aisip.valuetype as valuetype,"
					+ " aisip.value as value" 
					+ " from ais_invokeparameter aisip"
					+ " where aisip.invokeid = " + SysConfig.getParamPrefix() + "invokeid"; 
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("invokeid", invokeId);
		List<String> alias = new ArrayList<String>();
		alias.add("pid");
		alias.add("name");
		alias.add("valuetype");  
		alias.add("value");   
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("pid", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("valuetype", ValueType.String); 
		fieldValueTypes.put("value", ValueType.String); 
		IDatabaseAccess databaseAccess = this.getDatabaseAccess();
		Session dbSession = databaseAccess.getSession();
		IDBParserAccess dBParserAccess = databaseAccess.getDBParserAccess();
		DataTable pTable = dBParserAccess.selectList(dbSession, pSql, p2vs, alias, fieldValueTypes);
		List<DataRow> pRows = pTable.getRows();
		HashMap<String, Object> pValues = new HashMap<String, Object>();
		for(DataRow pRow : pRows){
			String name = pRow.getStringValue("name");
			String valueStr = pRow.getStringValue("value");
			String valueTypeStr = pRow.getStringValue("valuetype");
			Object value = ValueConverter.convertToString(valueStr, valueTypeStr);
			pValues.put(name, value);
		}
		
		return pValues;		
	} 
}
