package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.excelGrid.egInstance.ExcelGridInstanceProcessor;
import com.novacloud.novaone.excelGrid.egInstance.StepOperateType;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ExcelGridInstanceService extends NcpActionSupport implements IExcelGridInstanceService {

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
	private ExcelGridInstanceProcessor excelGridInstanceProcessor = null;
	public void setExcelGridInstanceProcessor(ExcelGridInstanceProcessor excelGridInstanceProcessor){
		this.excelGridInstanceProcessor = excelGridInstanceProcessor;
	}
	public ExcelGridInstanceProcessor getExcelGridInstanceProcessor(){
		return this.excelGridInstanceProcessor;
	}
	
 	@Override
	public String getWaitingProcessInstanceStepCount(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			int waitingProcessStepCount = this.excelGridInstanceProcessor.getWaitingProcessInstanceStepCount(userId);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("waitingProcessStepCount", waitingProcessStepCount);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getWaitingProcessInstanceStepCount", "获取待办任务失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

 	@Override
	public String driveToNext(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 			 
			String instanceId = requestObj.getString("instanceId");
			String note = CommonFunction.decode(requestObj.getString("note"));			
			JSONArray nextStepArray = requestObj.getJSONArray("nextStepArray");
			List<String> nextUserIds = new ArrayList<String>();
			List<String> titles = new ArrayList<String>();
			for(int i = 0; i < nextStepArray.size(); i++){
				JSONObject nextStepObj = nextStepArray.getJSONObject(i);
				nextUserIds.add(nextStepObj.getString("nextUserId"));
				titles.add(CommonFunction.decode(nextStepObj.getString("title")));
			}			
			JSONArray fromStepArray = requestObj.getJSONArray("fromStepArray");
			List<String> fromStepIds = new ArrayList<String>();
			for(int i = 0; i < fromStepArray.size(); i++){
				JSONObject fromStepObj = fromStepArray.getJSONObject(i);
				fromStepIds.add(fromStepObj.getString("fromStepId"));
			}

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			this.excelGridInstanceProcessor.driveToNextWithTx(userId, nextUserIds, titles, instanceId, fromStepIds, note);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("driveToNext", "执行发送失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

 	@Override
	public String converge(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 			 
			String instanceId = requestObj.getString("instanceId");
			String note = CommonFunction.decode(requestObj.getString("note"));
			String title = CommonFunction.decode(requestObj.getString("title"));	 
			JSONArray fromStepArray = requestObj.getJSONArray("fromStepArray");
			List<String> fromStepIds = new ArrayList<String>();
			for(int i = 0; i < fromStepArray.size(); i++){
				JSONObject fromStepObj = fromStepArray.getJSONObject(i);
				fromStepIds.add(fromStepObj.getString("fromStepId"));
			}

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			String toStepId = this.excelGridInstanceProcessor.convergeWithTx(userId, instanceId, fromStepIds, title, note);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("toStepId", toStepId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("converge", "执行汇总失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
 	
 	@Override
	public String end(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			String userId = session.getUserId();
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 			 
			String instanceId = requestObj.getString("instanceId");
			String note = CommonFunction.decode(requestObj.getString("note")); 
			JSONArray fromStepArray = requestObj.getJSONArray("fromStepArray");
			List<String> fromStepIds = new ArrayList<String>(); 
			for(int i = 0; i < fromStepArray.size(); i++){
				JSONObject fromStepObj = fromStepArray.getJSONObject(i);
				fromStepIds.add(fromStepObj.getString("fromStepId")); 
			}

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession);  
			this.excelGridInstanceProcessor.endWithTx(userId, instanceId, fromStepIds, note);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("end", "执行结束失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
 	
 	@Override
	public String bringBack(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 			 
			String instanceId = requestObj.getString("instanceId");
			String note = CommonFunction.decode(requestObj.getString("note"));
			String backToStepId = CommonFunction.decode(requestObj.getString("backToStepId"));	 
			JSONArray fromStepArray = requestObj.getJSONArray("fromStepArray");
			List<String> fromStepIds = new ArrayList<String>();
			List<String> fromUserIds = new ArrayList<String>();
			for(int i = 0; i < fromStepArray.size(); i++){
				JSONObject fromStepObj = fromStepArray.getJSONObject(i);
				fromStepIds.add(fromStepObj.getString("fromStepId"));
				fromUserIds.add(fromStepObj.getString("fromUserId"));
			}

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			List<String> toStepIds = this.excelGridInstanceProcessor.bringBackWithTx(userId, instanceId, backToStepId, fromUserIds, fromStepIds, note);
			JSONArray toStepIdArray = new JSONArray();
			for(int i = 0; i < toStepIds.size(); i++){
				toStepIdArray.add(toStepIds.get(i));
			}
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("toStepIds", toStepIdArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("bringBack", "执行取回失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
 	
 	@Override
	public String sendBack(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 			 
			String instanceId = requestObj.getString("instanceId");
			String note = CommonFunction.decode(requestObj.getString("note"));  
			JSONArray fromStepIdToBackToUserIdsArray= requestObj.getJSONArray("fromStepIdToBackToUserIds");
			HashMap<String, List<String>> fromStepIdToBackToUserIds = new HashMap<String, List<String>>();
			List<String> fromUserIds = new ArrayList<String>();
			for(int i = 0; i < fromStepIdToBackToUserIdsArray.size(); i++){
				JSONObject fromStepIdToBackToUserIdsObj = fromStepIdToBackToUserIdsArray.getJSONObject(i);
				String fromStepId = fromStepIdToBackToUserIdsObj.getString("fromStepId");
				JSONArray backToUserIdsArray = fromStepIdToBackToUserIdsObj.getJSONArray("backToUserIds");
				List<String> backToUserIds = new ArrayList<String>();
				for(int j = 0; j < backToUserIds.size(); j++){
					backToUserIds.add(backToUserIdsArray.getString(j));
				} 
				fromStepIdToBackToUserIds.put(fromStepId, backToUserIds);
			}

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			this.excelGridInstanceProcessor.sendBackWithTx(fromStepIdToBackToUserIds, userId, instanceId, note);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("sendBack", "执行退回失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

 	@Override
	public String createInstance(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 		 
			String definitionId = requestObj.getString("definitionId");  
			String versionId = requestObj.getString("versionId");  
			String teamId = requestObj.getString("teamId");  
			String title = CommonFunction.decode(requestObj.getString("title"));   

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();		
			
			//生成eg_instance.id
			String newInstanceId = UUID.randomUUID().toString(); 
			
			//生成eg_instanceStep.id
			String newStepId = UUID.randomUUID().toString();  
			
			this.excelGridInstanceProcessor.createInstanceWithTx(newInstanceId, newStepId, userId, definitionId, versionId, teamId, title);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("instanceId", newInstanceId);
			resultHash.put("stepId", newStepId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createInstance", "执行创建失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

 	@Override
 	public String getInstanceStepsAndLinks(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 		 
			String instanceId = requestObj.getString("instanceId");  

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			JSONObject instanceObj = this.excelGridInstanceProcessor.getInstanceStepsAndLinks(userId, instanceId);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("instance", instanceObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getInstanceStepsAndLinks", "获取流转过程出错.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
 	}
 	
 	@Override
	public String deleteInstance(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 		 
			String instanceId = requestObj.getString("instanceId");  

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			this.excelGridInstanceProcessor.deleteInstance(userId, instanceId);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("deleteInstance", "执行删除失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	@Override
	public String readStep(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String instanceId = requestObj.getString("instanceId");
			String stepId = requestObj.getString("stepId");    

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession);

			DataRow instanceRow = this.excelGridInstanceProcessor.getInstance(instanceId);
			DataRow stepRow = this.excelGridInstanceProcessor.getStep(stepId);
				
			Date fileLastModifyTime = stepRow.getDateTimeValue("filelastmodifytime");
			
			String fileStr = this.excelGridInstanceProcessor.readInstanceFile(instanceId, fileLastModifyTime); 

			
			JSONObject instanceJson = new JSONObject(); 
			instanceJson.put("instanceId", instanceRow.getStringValue("instanceid"));  
			instanceJson.put("createStepId", instanceRow.getStringValue("createstepid")); 
			instanceJson.put("definitionId", instanceRow.getStringValue("definitionid"));
			instanceJson.put("definitionName", CommonFunction.encode(instanceRow.getStringValue("definitionname")));
			instanceJson.put("createUserId", instanceRow.getStringValue("createuserid"));
			instanceJson.put("createTime", ValueConverter.convertToString(instanceRow.getValue("createtime"), ValueType.Time));
			instanceJson.put("lastModifyTime", ValueConverter.convertToString(instanceRow.getValue("lastmodifytime"), ValueType.Time));
			instanceJson.put("statusNote", CommonFunction.encode(instanceRow.getStringValue("statusnote")));
			
			JSONObject stepJson = new JSONObject(); 
			stepJson.put("stepId", stepRow.getStringValue("id"));
			stepJson.put("instanceId", stepRow.getStringValue("instanceid")); 
			stepJson.put("createTime", ValueConverter.convertToString(stepRow.getValue("createtime"), ValueType.Time)); 
			stepJson.put("processTime", ValueConverter.convertToString(stepRow.getValue("processtime"), ValueType.Time));
			stepJson.put("userId", stepRow.getStringValue("userid"));
			stepJson.put("operateType", stepRow.getStringValue("operatetype"));
			stepJson.put("resultType", stepRow.getStringValue("resulttype"));
			stepJson.put("title", CommonFunction.encode(stepRow.getStringValue("title"))); 
			stepJson.put("fileLastModifyTime", ValueConverter.convertToString(stepRow.getValue("filelastmodifytime"), ValueType.Time));
			
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("instanceFile", fileStr);
			resultHash.put("instance", instanceJson);
			resultHash.put("step", stepJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
       	ex.printStackTrace();
			NcpException ncpEx = new NcpException("readStep", "读取实例失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	 
	@Override
	public String updateStep(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String instanceId = requestObj.getString("instanceId");
			String stepId = requestObj.getString("stepId");    
			String fileStr = requestObj.getString("fileStr");    
			String title = CommonFunction.decode(requestObj.getString("title"));    

			dbSession = this.openDBSession(); 
			this.excelGridInstanceProcessor.setDBSession(dbSession); 
			
			this.excelGridInstanceProcessor.updateStepWithTx(session.getUserId(), instanceId, stepId, fileStr, title);
 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
       	ex.printStackTrace();
			NcpException ncpEx = new NcpException("readStep", "读取实例失败.", ex);
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
