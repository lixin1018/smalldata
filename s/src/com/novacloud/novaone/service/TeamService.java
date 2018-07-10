package com.novacloud.novaone.service;

import java.sql.SQLException; 
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
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow; 
import com.novacloud.novaone.excelGrid.team.TeamProcessor;
import com.opensymphony.xwork2.ActionSupport;
 
/*
 * TeamService服务
 */
public class TeamService extends NcpActionSupport implements ITeamService {

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理Team各种操作
	private TeamProcessor teamProcessor = null;
	public void setTeamProcessor(TeamProcessor teamProcessor){
		this.teamProcessor = teamProcessor;
	}
	public TeamProcessor getTeamProcessor(){
		return this.teamProcessor;
	}
	 
	@Override
	public String addTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String name = requestObj.getString("name");   
			String description = requestObj.getString("description");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			String teamId = teamProcessor.addTeam(session, name, description); 
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("teamId", teamId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
       	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
       	ex.printStackTrace();
			NcpException ncpEx = new NcpException("addTeam", "添加团队失败.", ex);
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
	public String getTeamInfo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), false);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String teamId = requestObj.getString("teamId");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			DataRow teamRow = teamProcessor.getTeamInfo(teamId);

			String name = teamRow.getStringValue("name");
			String description = teamRow.getStringValue("description");
			String createUserName = teamRow.getStringValue("createusername");
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("name", name);
			resultHash.put("description", description);
			resultHash.put("createUserName", createUserName);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
      	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
      	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getTeamInfo", "获取团队基本信息失败.", ex);
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
	public String deleteTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String teamId = requestObj.getString("teamId");    

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.deleteTeam(session, teamId); 
			 
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
			NcpException ncpEx = new NcpException("deleteTeam", "删除团队失败.", ex);
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
	public String updateTeamInfo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String teamId = requestObj.getString("teamId");   		 
			String name = requestObj.getString("name");   
			String description = requestObj.getString("description");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.updateTeamInfo(session, teamId, name, description); 
			 
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
			NcpException ncpEx = new NcpException("updateTeamInfo", "更新团队信息失败.", ex);
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
	public String requestJoinTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String teamId = requestObj.getString("teamId");   
			String message = requestObj.getString("message");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.requestJoinTeam(session, teamId, message); 
			 
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
			NcpException ncpEx = new NcpException("requestJoinTeam", "申请加入团队失败.", ex);
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
	public String processJoinTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String joinUserId = requestObj.getString("joinUserId");   
			String teamId = requestObj.getString("teamId"); 
			boolean applyOrReject = requestObj.getBoolean("applyOrReject");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.processJoinTeam(session, joinUserId, teamId, applyOrReject); 
			 
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
			NcpException ncpEx = new NcpException("processJoinTeam", "处理申请失败.", ex);
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
	public String deleteFromTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);			 
			String memberId = requestObj.getString("memberId");   
			String teamId = requestObj.getString("teamId");  

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.deleteFromTeam(session, memberId, teamId); 
			 
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
			NcpException ncpEx = new NcpException("deleteFromTeam", "从团队中移除失败.", ex);
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
	public String leaveFromTeam(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);	
			String teamId = requestObj.getString("teamId");  

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			teamProcessor.leaveFromTeam(session, teamId); 
			 
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
			NcpException ncpEx = new NcpException("leaveFromTeam", "退出团队失败.", ex);
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
	public String getMemberTeams(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			List<DataRow> teamRows = teamProcessor.getMemberTeams(session.getUserId());
			JSONArray teamArray = new JSONArray();
			for(DataRow teamRow : teamRows){
				JSONObject teamObj = new JSONObject();
				teamObj.put("teamId", teamRow.getStringValue("teamid"));
				teamObj.put("memberId", teamRow.getStringValue("memberid"));
				teamObj.put("teamName", teamRow.getStringValue("teamname"));
				teamObj.put("isManager", teamRow.getBooleanValue("ismanager"));
			}
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("teams", teamArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
     	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("getMemberTeams", "获取团队信息失败.", ex);
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
	public String getTeamDefinitions(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);	 
			String teamId = requestObj.getString("teamId");

			dbSession = this.openDBSession(); 
			TeamProcessor teamProcessor = this.getTeamProcessor();
			teamProcessor.setDBSession(dbSession);
			List<DataRow> defRows = teamProcessor.getTeamDefinitions(teamId);
			JSONArray defArray = new JSONArray();
			for(DataRow defRow : defRows){
				JSONObject teamObj = new JSONObject();
				teamObj.put("defintionId", defRow.getStringValue("definitionid"));
				teamObj.put("definitionName", CommonFunction.encode(defRow.getStringValue("definitionname")));
				teamObj.put("versionId", defRow.getStringValue("versionid")); 
			}
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("definitions", defArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
     	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
			ex.printStackTrace();
			NcpException ncpEx = new NcpException("getTeamDefinitions", "获取团队表格类型失败.", ex);
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
