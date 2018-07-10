package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.HashMap; 

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager; 

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.IAccessoryDao;
import com.opensymphony.xwork2.ActionSupport;
 
public class AccessoryService extends NcpActionSupport implements IAccessoryService {
 
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//附件处理
	private IAccessoryDao accessoryDao; 
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}   
	
	@Override
	public String getFileCountByFilter(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);   
			String filterType = requestObj.getString("filterType");   
			String filterValue = requestObj.getString("filterValue");  
			dbSession = this.openDBSession();
			this.accessoryDao.setDBSession(dbSession);
			int fileCount = this.accessoryDao.getFileCountByFilter(filterType, filterValue);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("fileCount", fileCount);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getFileCountByFilter", "获取附件个数未成功", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			dbSession.close();
		}
		return ActionSupport.SUCCESS;	
	}
	
	@Override
	public String getAccessoryIds(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);   
			String filterType = requestObj.getString("filterType");   
			String filterValue = requestObj.getString("filterValue");  
			dbSession = this.openDBSession();
			this.accessoryDao.setDBSession(dbSession);
			String[] ids = this.accessoryDao.getAccessoryIds(filterType, filterValue);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("ids", ids);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getFileCountByFilter", "获取附件个数未成功", ex);
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
	public String deleteAccessory(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);   
			String id = (String)ValueConverter.convertToObject(requestObj.getString("id"), ValueType.String);  
			dbSession = this.openDBSession();
			this.accessoryDao.setDBSession(dbSession);
			this.accessoryDao.deleteAccessory(id);
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("deleteAccessory", "删除附件失败", ex);
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
