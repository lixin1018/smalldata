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
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IDataBaseDao;
import com.opensymphony.xwork2.ActionSupport;
  
public class DataService extends NcpActionSupport implements IDataService {
 
	protected IDataBaseDao getDataDao(JSONObject requestObj){
		//如果没有定义名为dataName的bean，那么使用其基类 
		IDataBaseDao dataDao = null;
		if(requestObj.containsKey("dataName")){
			String dataName = requestObj.getString("dataName");
			dataDao = ContextUtil.containsBean(dataName) 
					? (IDataBaseDao)ContextUtil.getBean(dataName) 
					:  this.getDeaultDao(dataName);//(IDataBaseDao)ContextUtil.getBean("dataBaseDao");
		}
		else{
			//dataDao = (IDataBaseDao)ContextUtil.getBean("dataBaseDao");
			dataDao = this.getDeaultDao(null);
		}  
		return dataDao;
	}
	
	private IDataBaseDao getDeaultDao(String dataName){
		IDataBaseDao dataDao = (IDataBaseDao)ContextUtil.getBean("dataBaseDao"); 
		return dataDao;
	}

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
		
	@Override
	public String getInputStatus(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			IDataBaseDao dataDao = this.getDataDao(requestObj);  
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession);
			HashMap<String, Object> resultHash = dataDao.getInputStatus(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getInputStatus", "更新录入框状态未成功", ex);
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
	public String getList() { 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession);
			HashMap<String, Object> resultHash = dataDao.getList(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getList", "获取下拉数据未成功", ex);
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
	public String add(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.add(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("add", "创建新纪录未成功", ex);
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
	public String select(){ 
		Session dbSession = null;
		try
		{ 
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.select(session, requestObj);  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("select", "查询数据未成功", ex);
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
	public String save(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.saveWithTx(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("save", "保存记录未成功", ex);
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
	public String delete(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.deleteWithTx(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("delete", "删除记录未成功", ex);
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
	public String doOtherAction(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.doOtherAction(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("doOtherAction", "调用服务", ex);
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
