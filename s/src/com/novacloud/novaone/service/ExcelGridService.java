package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.dao.sys.ISheetBaseDao;
import com.novacloud.novaone.dao.sys.IUserDefinedFeatureDao;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.novacloud.novaone.excelGrid.definition.ValidateException;
import com.novacloud.novaone.excelGrid.definition.ValidateResult;
import com.opensymphony.xwork2.ActionSupport;
 
/*
 * ExcelGrid服务
 */
public class ExcelGridService extends NcpActionSupport implements IExcelGridService {

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理ExcelGrid各种操作
	private ExcelGridProcessor excelGridProcessor = null;
	public void setExcelGridProcessor(ExcelGridProcessor excelGridProcessor){
		this.excelGridProcessor = excelGridProcessor;
	}
	public ExcelGridProcessor getExcelGridProcessor(){
		return this.excelGridProcessor;
	}

	//激活模板版本：先验证此版本是否逻辑正确，如果验证通过，那么在数据库中将此版本对应记录的状态设置为"已启用"
	@Override
	public String activateVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId");

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			this.excelGridProcessor.activateVersion(session, excelGridId, excelGridVersionId);

			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(excelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("excelGridVersion", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("activateVersion", "启用ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	
	//停用模板版本
	@Override
	public String inactivateVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId");

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			this.excelGridProcessor.inactivateVersion(session, excelGridId, excelGridVersionId);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("activateVersion", "启用ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	//创建某个ExcelGrid的版本
	@Override
	public String createVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridJsonStr = requestObj.getString("excelGridJsonStr"); 
			String description = requestObj.getString("description"); 

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			String excelGridVersionId = this.excelGridProcessor.createVersion(session, excelGridId, excelGridJsonStr, session.getUserId(), description);

			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(excelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("excelGridVersionId", excelGridVersionId);
			resultHash.put("excelGridVersion", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createVersion", "保存ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//复制模板版本
	@Override
	public String copyVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId");   

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			String newExcelGridVersionId = this.excelGridProcessor.copyVersion(session, excelGridId, excelGridVersionId, session.getUserId());
			
			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(newExcelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("excelGridVersion", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("copyVersion", "复制ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 
	 
	//删除版本（其实只是在数据库中打上isdeleted标识）
	@Override
	public String deleteVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String excelGridId = requestObj.getString("excelGridId");   
			JSONArray excelGridVersionIdArray = requestObj.getJSONArray("versions"); 
			List<String> excelGridVersionIds = new ArrayList<String>();
			for(int i = 0; i < excelGridVersionIdArray.size(); i++){
				String versionId = excelGridVersionIdArray.getJSONObject(i).getString("versionId");
				excelGridVersionIds.add(versionId);				
			}

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			this.excelGridProcessor.deleteVersion(session, excelGridId, excelGridVersionIds);  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("versions", excelGridVersionIdArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex){
			ex.printStackTrace();
			this.addResponse(ex.toJsonString());
		}
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("deleteVersion", "删除ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString());
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	//删除模板（其实只是在数据库中打上isdeleted标识）
	@Override
	public String deleteDefinition(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray excelGridIdArray = requestObj.getJSONArray("definitions"); 
			List<String> excelGridIds = new ArrayList<String>();
			for(int i = 0; i < excelGridIdArray.size(); i++){
				String excelGridId = excelGridIdArray.getJSONObject(i).getString("excelGridId");
				excelGridIds.add(excelGridId);				
			}

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			this.excelGridProcessor.deleteDefinition(session, excelGridIds);  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("definitions", excelGridIdArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
       	ex.printStackTrace();
			NcpException ncpEx = new NcpException("deleteDefinition", "删除ExcelGridDefinition失败.", ex);
			this.addResponse(ncpEx.toJsonString());
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	//更新模板版本
	@Override
	public String updateVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId");   
			String excelGridJsonStr = requestObj.getString("excelGridJsonStr");
			String description = CommonFunction.decode(requestObj.getString("description"));
			boolean needCreateNewVersion = requestObj.getBoolean("needCreateNewVersion");

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);			
 
			JSONObject resultJson = this.excelGridProcessor.validateAndUpdateVersion(session, excelGridId, excelGridVersionId, session.getUserId(), excelGridJsonStr, description, needCreateNewVersion);
			excelGridVersionId = resultJson.getString("excelGridVersionId");
			 
			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(excelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("saveResult", resultJson);
			resultHash.put("excelGridVersion", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("updateVersion", "更新ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	  
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	//判断是否为启用的版本
	@Override
	public String getIsEnableVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId");

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);			
 
			boolean isEnable = this.excelGridProcessor.getIsEnableVersion(session, excelGridId, excelGridVersionId);
			 
			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(excelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("isEnable", isEnable);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getIsEnableVersion", "获取是否启用了此版本失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	  
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
 
	//读取模板版本
	@Override
	public String readVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String excelGridId = requestObj.getString("excelGridId");   
			String excelGridVersionId = requestObj.getString("excelGridVersionId"); 

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			String excelGridJsonStr = this.excelGridProcessor.readVersion(session, excelGridId, excelGridVersionId);

			JSONObject versionJson = this.excelGridProcessor.getVersionFromDBToJSONObject(excelGridVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("excelGridVersionFile", excelGridJsonStr);
			resultHash.put("excelGridVersion", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("readVersion", "读取ExcelGridVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	
	//获取当前用户的模板个数
	public String getDefinitionCount(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			int definitionCount = this.excelGridProcessor.getDefinitionCount(session); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("definitionCount", definitionCount); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getDefinitionCount", "获取模板个数失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
	
	//获取Excel文件的所有sheet页名称
	public String getExcelSheetNames(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String accessoryId = requestObj.getString("accessoryId");   

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			List<String> allSheetNames = this.excelGridProcessor.getExcelSheetNames(session, accessoryId); 
			
			JSONArray sheetNameArray = new JSONArray(); 
			for(String sheetName : allSheetNames){
				sheetName = CommonFunction.encode(sheetName);
				sheetNameArray.add(sheetName); 
			}
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("sheetNames", sheetNameArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getExcelSheetNames", "获取Excel文件的所有sheet页名称失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}

	//验证上传的excel文件的sheet页内容是否合法
	public String validateAndGenerateByUploadExcel(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String accessoryId = requestObj.getString("accessoryId"); 
			JSONArray sheetNameArray = requestObj.getJSONArray("sheetNames");
			List<String> sheetNames = new ArrayList<String>();
			for(int i = 0; i < sheetNameArray.size(); i++){
				sheetNames.add(sheetNameArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			JSONObject excelGridVersionObj = this.excelGridProcessor.validateAndGenerateByUploadExcel(session, accessoryId, sheetNames); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("excelGridVersionJson", excelGridVersionObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
             	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validateUploadExcel", "验证上传的excel文件的sheet页内容失败", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
	
	//创建新的空白模板
	public String createNewBlankExcelGrid(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			int defaultRowCount = requestObj.getInt("defaultRowCount"); 
			int defaultColumnCount = requestObj.getInt("defaultColumnCount"); 
			int defaultRowHeight = requestObj.getInt("defaultRowHeight"); 
			int defaultColumnWidth = requestObj.getInt("defaultColumnWidth"); 
			
			dbSession = this.openDBSession(); 
			this.excelGridProcessor.setDBSession(dbSession);
			
			JSONObject excelGridVersionObj = this.excelGridProcessor.createNewBlankExcelGrid(session, defaultRowCount, defaultColumnCount, defaultRowHeight, defaultColumnWidth); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("excelGridVersionJson", excelGridVersionObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createNewBlankExcelGrid", "创建新的空白模板出错", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
}
