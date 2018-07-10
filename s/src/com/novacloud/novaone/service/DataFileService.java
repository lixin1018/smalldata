package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
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
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.IFileBaseProcessor;
import com.novacloud.novaone.dataFile.RootDirType;
import com.opensymphony.xwork2.ActionSupport;
  
 //数据文件服务
public class DataFileService extends NcpActionSupport implements IDataFileService {

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理DataFile各种操作
	private DataFileProcessor dataFileProcessor = null;
	public void setDataFileProcessor(DataFileProcessor dataFileProcessor){
		this.dataFileProcessor = dataFileProcessor;
	}
	public DataFileProcessor getDataFileProcessor(){
		return this.dataFileProcessor;
	}

	//新建目录
	@Override
	public String createDir(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String name = CommonFunction.decode(requestObj.getString("name"));   
			String parentId = requestObj.containsKey("parentId") && requestObj.get("parentId") != null  ? requestObj.getString("parentId") : null;

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			String dirId = this.dataFileProcessor.createDir(session, name, parentId, false, false, FileUseType.user);

			JSONObject dirJson = this.dataFileProcessor.getDirFromDBToJSONObject(session, dirId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("dirJson", dirJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createDir", "无法创建文件夹.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//新建数据文件
	@Override
	public String createFile(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String name = CommonFunction.decode(requestObj.getString("name"));  
			String fileType = requestObj.getString("fileType");  
			String parentId = requestObj.containsKey("parentId") && requestObj.get("parentId") != null  ? requestObj.getString("parentId") : null;

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);			
			
			IFileBaseProcessor fileProcessor = (IFileBaseProcessor) ContextUtil.getBean(fileType + "FileProcessor");
			fileProcessor.setDBSession(dbSession);
			String fileId = fileProcessor.createNewFile(session, name, fileType, parentId, false, false, FileUseType.user);

			JSONObject fileJson = this.dataFileProcessor.getFileFromDBToJSONObject(session, fileId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("fileJson", fileJson);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createFile", "无法创建数据文件.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//移动文件夹或文件到某个位置
	@Override
	public String moveTo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			  
			String fromParentId = requestObj.containsKey("fromParentId") && requestObj.get("fromParentId") != null  ? requestObj.getString("fromParentId") : null; 
			String toParentId = requestObj.containsKey("toParentId")  && requestObj.get("toParentId") != null ? requestObj.getString("toParentId") : null;

			JSONArray fileAndDirIdArray = requestObj.getJSONArray("fileAndDirIdArray");
			List<String> fileAndDirIds = new ArrayList<String>();
			for(int i = 0; i < fileAndDirIdArray.size(); i++){
				fileAndDirIds.add(fileAndDirIdArray.getString(i));
			}
			
			boolean autoRename = requestObj.containsKey("autoRename") && requestObj.get("autoRename").equals("Y") ? true : false;

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			List<HashMap<String, String>> allMovedDirAndFiles =	this.dataFileProcessor.moveTo(session, fromParentId, toParentId, fileAndDirIds, autoRename); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("allMovedDirAndFiles", allMovedDirAndFiles);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("moveTo", "无法移动文件.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//将文件复制到
	@Override
	public String copyTo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			  
			String toParentId = requestObj.containsKey("toParentId") && requestObj.get("toParentId") != null ? requestObj.getString("toParentId") : null;

			JSONArray fileIdArray = requestObj.getJSONArray("fileIdArray");
			List<String> fileIds = new ArrayList<String>();
			for(int i = 0; i < fileIdArray.size(); i++){
				fileIds.add(fileIdArray.getString(i));
			}
			
			boolean autoRename = requestObj.containsKey("autoRename") && requestObj.get("autoRename").equals("Y") ? true : false;

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);

			List<HashMap<String, String>> allNewFiles = this.dataFileProcessor.copyTo(session, toParentId, fileIds, false, false, FileUseType.user, autoRename);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("allNewFiles", allNewFiles);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("copyTo", "无法复制文件.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//将文件另存为
	@Override
	public String saveAs(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			  
			String toParentId = requestObj.containsKey("toParentId") && requestObj.get("toParentId") != null ? requestObj.getString("toParentId") : null;

			String fileId = requestObj.getString("fileId"); 

			String fileName = CommonFunction.decode(requestObj.getString("fileName"));

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);

			HashMap<String, String> newFile = this.dataFileProcessor.saveAs(session, toParentId, fileId, fileName, false, false, FileUseType.user);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("newFile", newFile);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("copyTo", "无法复制文件.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//删除文件或文件夹
	@Override
	public String delete(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			  
			String parentId = requestObj.containsKey("parentId") && requestObj.get("parentId") != null ? requestObj.getString("parentId") : null;  

			JSONArray fileAndDirIdArray = requestObj.getJSONArray("fileAndDirIdArray");
			List<String> fileAndDirIds = new ArrayList<String>();
			for(int i = 0; i < fileAndDirIdArray.size(); i++){
				fileAndDirIds.add(fileAndDirIdArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			this.dataFileProcessor.delete(session, parentId, fileAndDirIds); 	
			
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
			NcpException ncpEx = new NcpException("delete", "无法删除.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//重命名文件或文件夹
	@Override
	public String rename(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String parentId = requestObj.containsKey("parentId") && requestObj.get("parentId") != null ? requestObj.getString("parentId") : null;  
			String id = requestObj.getString("id");
			String newName = CommonFunction.decode(requestObj.getString("newName"));  

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			this.dataFileProcessor.rename(session, parentId, id, newName); 	
			
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
			NcpException ncpEx = new NcpException("rename", "无法重命名.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//获取目录内的文件夹和文件
	@Override
	public String getChildren(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String parentId = requestObj.containsKey("parentId") && requestObj.get("parentId") != null ? requestObj.getString("parentId") : null;
			boolean doesShowDir = requestObj.getString("doesShowDir").equals("Y") ? true : false;
			boolean doesShowFile = requestObj.getString("doesShowFile").equals("Y") ? true : false;

			dbSession = this.openDBSession();
			this.dataFileProcessor.setDBSession(dbSession);
			
			//如果parentId为空，那么获取存放文件的根目录文件夹user，如果user文件夹不存在，那么创建之
			if(parentId == null || parentId.length() == 0){
				parentId = this.dataFileProcessor.createRootDir(session, RootDirType.myDocument);
			}
			
			JSONArray childrenArray = this.dataFileProcessor.getChildren(session, parentId, doesShowDir, doesShowFile, false); 
			JSONArray pathPartArray = this.dataFileProcessor.getPath(session, parentId); 		
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();   
			resultHash.put("childrenArray", childrenArray);
			resultHash.put("pathPartArray", pathPartArray);
			
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getChildren", "无法获取此文件夹里的内容.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//获取路径信息
	@Override
	public String getPath(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String id = requestObj.getString("id");

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);			
			
			JSONArray pathPartArray = this.dataFileProcessor.getPath(session, id); 	
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("pathPartArray", pathPartArray);  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getPath", "无法获取此路径信息.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//获取文件或文件夹信息
	@Override
	public String getDirAndFileInfo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray dirAndFileIdArray = requestObj.getJSONArray("dirAndFileIdArray");
			List<String> dirAndFileIds = new ArrayList<String>();
			for(int i = 0; i < dirAndFileIdArray.size(); i++){
				dirAndFileIds.add(dirAndFileIdArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);			
			
			JSONArray dirAndFileInfoArray = this.dataFileProcessor.getDirAndFileInfo(session, dirAndFileIds); 	
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("dirAndFileInfoArray", dirAndFileInfoArray);  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getDirAndFileInfo", "无法获取文件夹或文件信息.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 

	//将文件发送给某人（可以是多人）
	@Override
	public String sendTo(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray fileIdArray = requestObj.getJSONArray("fileIdArray");
			List<String> fileIds = new ArrayList<String>();
			for(int i = 0; i < fileIdArray.size(); i++){
				fileIds.add(fileIdArray.getString(i));
			}
			
			boolean needSendEmail = "Y".equals(requestObj.getString("needSendEmail")) ? true : false;  
			String message = CommonFunction.decode(requestObj.getString("message"));  

			JSONArray toUserEmailArray = requestObj.getJSONArray("toUserEmailArray");
			List<String> toUserEmails = new ArrayList<String>();
			for(int i = 0; i < toUserEmailArray.size(); i++){
				toUserEmails.add(toUserEmailArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			this.dataFileProcessor.sendTo(session, fileIds, toUserEmails, needSendEmail, message); 
			
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
			NcpException ncpEx = new NcpException("sendTo", "无法发送文件给他人.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

	//根据邮箱地址，获取用户信息
	@Override
	public String getUserInfoByEmail(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray emailArray = requestObj.getJSONArray("emailArray");
			List<String> emails = new ArrayList<String>();
			for(int i = 0; i < emailArray.size(); i++){
				emails.add(emailArray.getString(i));
			} 

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			JSONArray userInfoArray = this.dataFileProcessor.getUserInfoByEmail(session, emails); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("userInfoArray", userInfoArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getUserInfoByEmail", "无法获取人员信息.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	
	//取回已发送的文件
	public String bringBack(){		 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String sentInfoId = requestObj.getString("sentInfoId");   

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
		 	this.dataFileProcessor.bringBack(session, sentInfoId); 
			
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
			NcpException ncpEx = new NcpException("bringBack", "无法取回.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

	//邀请自动创建用户，并发送邀请函
	@Override
	public String inviteAndCreateUser(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray emailArray = requestObj.getJSONArray("emailArray");
			List<String> emails = new ArrayList<String>();
			for(int i = 0; i < emailArray.size(); i++){
				emails.add(emailArray.getString(i));
			} 

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);

		 	HashMap<String, String> emailToUserIds = this.dataFileProcessor.inviteAndCreateUser(session, emails);  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("emailToUserIds", emailToUserIds);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("inviteAndCreateUser", "无法自动创建用户，或发送邀请函.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}

	//标记为已读
	@Override
	public String markRead(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			JSONArray receiveInfoIdArray = requestObj.getJSONArray("receiveInfoIdArray");
			List<String> receiveInfoIds = new ArrayList<String>();
			for(int i = 0; i < receiveInfoIdArray.size(); i++){
				receiveInfoIds.add(receiveInfoIdArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			this.dataFileProcessor.markRead(session, receiveInfoIds); 
			
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
			NcpException ncpEx = new NcpException("markRead", "无法标记文件为已读.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}  

	//获取已发送文件信息
	@Override
	public String getSendInfos(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String toUserId = requestObj.containsKey("toUserId") ? requestObj.getString("toUserId") : null; 
			String toUser = requestObj.containsKey("toUser") ? CommonFunction.decode(requestObj.getString("toUser")) : null;  
			Date sendDate = requestObj.containsKey("sendDate") ? (Date)ValueConverter.convertToObject(requestObj.getString("sendDate"), ValueType.Time) : null; 
			String fileName = requestObj.containsKey("fileName") ? CommonFunction.decode(requestObj.getString("fileName")) : null; 
			String message = requestObj.containsKey("message") ? CommonFunction.decode(requestObj.getString("message")) : null;
			int pageIndex = requestObj.getInt("pageIndex"); 
			
			
			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			int sendInfoCount = this.dataFileProcessor.getSendInfoCount(session, toUserId, toUser, sendDate, fileName, message);
			JSONArray sendInfoArray = this.dataFileProcessor.getSendInfos(session, toUserId, toUser, sendDate, fileName, message, pageIndex);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("sendInfoCount", sendInfoCount);
			resultHash.put("sendInfoArray", sendInfoArray);			
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getSendInfos", "无法获取已发送文件信息.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}  

	//获取已接收文件信息
	@Override
	public String getReceiveInfos(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String fromUser = requestObj.containsKey("fromUser") ? requestObj.getString("fromUser") : null;  
			String toUser = requestObj.containsKey("toUser") ? CommonFunction.decode(requestObj.getString("toUser")) : null;
			Date receiveDate = requestObj.containsKey("receiveDate") ? (Date)ValueConverter.convertToObject(requestObj.getString("receiveDate"), ValueType.Time) : null; 
			String fileName = requestObj.containsKey("fileName") ? CommonFunction.decode(requestObj.getString("fileName")) : null; 
			String message = requestObj.containsKey("message") ? CommonFunction.decode(requestObj.getString("message")) : null;
			int pageIndex = requestObj.getInt("pageIndex"); 
			
			
			dbSession = this.openDBSession(); 
			this.dataFileProcessor.setDBSession(dbSession);
			
			int receiveInfoCount = this.dataFileProcessor.getReceiveInfoCount(session, fromUser, toUser, receiveDate, fileName, message);
			JSONArray receiveInfoArray = this.dataFileProcessor.getReceiveInfos(session, fromUser, toUser, receiveDate, fileName, message, pageIndex);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("receiveInfoCount", receiveInfoCount);
			resultHash.put("receiveInfoArray", receiveInfoArray);			
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getReceiveInfos", "无法获取已接收文件信息.", ex);
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
