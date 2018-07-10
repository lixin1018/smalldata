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
import com.novacloud.novaone.importExport.definition.ImportExportProcessor;
import com.novacloud.novaone.importExport.definition.ValidateResult;
import com.opensymphony.xwork2.ActionSupport;
 
/*
 * ExcelGrid服务
 */
public class ImportExportService extends NcpActionSupport implements IImportExportService {

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理ImportExport各种操作
	private ImportExportProcessor importExportProcessor = null;
	public void setImportExportProcessor(ImportExportProcessor importExportProcessor){
		this.importExportProcessor = importExportProcessor;
	}
	public ImportExportProcessor getImportExportProcessor(){
		return this.importExportProcessor;
	}

	//激活模板版本：先验证此版本是否逻辑正确，如果验证通过，那么在数据库中将此版本对应记录的状态设置为"已启用"
	@Override
	public String activateVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String definitionId = requestObj.getString("definitionId");   
			String versionId = requestObj.getString("versionId");
			boolean isActive = requestObj.getBoolean("isActive"); 

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			ValidateResult vr = this.importExportProcessor.activateVersion(session, definitionId, versionId, isActive);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("validateResult", vr == null ? null : vr.toJson());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("activateVersion", "启用ImportExportVersion失败.", ex);
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
			 
			String definitionId = requestObj.getString("definitionId");   
			String versionXml = CommonFunction.decode(requestObj.getString("versionXml")); 
			String name = CommonFunction.decode(requestObj.getString("name"));  

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			String versionId = this.importExportProcessor.createVersion(session, definitionId, versionXml, session.getUserId(), name);

			JSONObject versionJson = this.importExportProcessor.getVersionFromDBToJSONObject(versionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("versionId", versionId);
			resultHash.put("versionJson", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createVersion", "保存ImportExportVersion失败.", ex);
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

			String definitionId = requestObj.getString("definitionId");   
			String versionId = requestObj.getString("versionId");   
			String name = CommonFunction.decode(requestObj.getString("name"));   

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			String newVersionId = this.importExportProcessor.copyVersion(session, definitionId, versionId, session.getUserId(), name);
			
			JSONObject versionJson = this.importExportProcessor.getVersionFromDBToJSONObject(newVersionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("versionJson", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("copyVersion", "复制ImportExportVersion失败.", ex);
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

			JSONArray versionIdArray = requestObj.getJSONArray("versions"); 
			List<String> versionIds = new ArrayList<String>();
			for(int i = 0; i < versionIdArray.size(); i++){
				String versionId =versionIdArray.getJSONObject(i).getString("versionId");
				versionIds.add(versionId);				
			}

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			this.importExportProcessor.deleteVersion(session, versionIds);  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("versions", versionIdArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("deleteVersion", "删除ImportExportVersion失败.", ex);
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

			String definitionId = requestObj.getString("definitionId");   
			String versionId = requestObj.getString("versionId");   
			String versionXml = CommonFunction.decode(requestObj.getString("versionXml")); 
			String name = CommonFunction.decode(requestObj.getString("name")); 
			String code = CommonFunction.decode(requestObj.getString("code")); 

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			ValidateResult vr = this.importExportProcessor.validateAndUpdateVersion(session, definitionId, versionId, session.getUserId(), versionXml, name, code);
 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("validateResult", vr == null ? null : vr.toJson());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("updateVersion", "更新ImportExportVersion失败.", ex);
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
			 
			String definitionId = requestObj.getString("definitionId");   
			String versionId = requestObj.getString("versionId"); 

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
			String versionXml = this.importExportProcessor.readVersion(definitionId, versionId);

			JSONObject versionJson = this.importExportProcessor.getVersionFromDBToJSONObject(versionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("versionXml", CommonFunction.encode(versionXml));
			resultHash.put("versionJson", versionJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("readVersion", "读取ImportExportVersion失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//验证并更新模板版本
	@Override
	public String validateVersion(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String definitionId = requestObj.getString("definitionId");   
			String versionId = requestObj.getString("versionId");   
			String versionXml = CommonFunction.decode(requestObj.getString("versionXml")); 

			dbSession = this.openDBSession(); 
			this.importExportProcessor.setDBSession(dbSession);
			
 
			ValidateResult vr = this.importExportProcessor.validateVersion(session, definitionId, versionXml);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("validateResult", vr.toJson());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
         	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validateVersion", "验证ImportExportVersion失败.", ex);
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
