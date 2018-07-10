package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.HashMap;

import javax.annotation.Resource; 
import javax.xml.ws.WebServiceContext;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONObject;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor; 
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IParamWinBaseDao;
import com.opensymphony.xwork2.ActionSupport;
 
public class ParamWinService  extends NcpActionSupport implements IParamWinService {

	@Resource    
    private WebServiceContext wsContext;   	 

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
		
	private IParamWinBaseDao getParamWinDao(JSONObject requestObj){
		//如果没有定义名为dataName的bean，那么使用其基类 
		IParamWinBaseDao paramWinDao = null;
		if(requestObj.containsKey("paramWinName")){
			String paramWinName = requestObj.getString("paramWinName");
			paramWinDao = ContextUtil.containsBean(paramWinName) ? (IParamWinBaseDao)ContextUtil.getBean(paramWinName) :  (IParamWinBaseDao)ContextUtil.getBean("paramWinBaseDao");
		}
		else{
			paramWinDao = (IParamWinBaseDao)ContextUtil.getBean("paramWinBaseDao");
		}  
		return paramWinDao;
	} 

	 
	@Override
	public String getList() { 
		Session dbSession = null;
		try
		{
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IParamWinBaseDao paramWinBaseDao = this.getParamWinDao(requestObj); 
			dbSession = this.openDBSession();
			paramWinBaseDao.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpSession(), true);
			HashMap<String, Object> resultHash = paramWinBaseDao.getList(session, requestObj); 
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
	public String doOtherAction(){ 
		Session dbSession = null;
		try
		{
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IParamWinBaseDao paramWinBaseDao = this.getParamWinDao(requestObj); 
			dbSession = this.openDBSession();
			paramWinBaseDao.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpSession(), true);
			HashMap<String, Object> resultHash = paramWinBaseDao.doOtherAction(session, requestObj); 
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
