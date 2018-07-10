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
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.dao.sys.ISheetBaseDao;
import com.novacloud.novaone.dao.sys.IUserDefinedFeatureDao;
import com.opensymphony.xwork2.ActionSupport;
 
public class ViewGridService extends NcpActionSupport implements IViewGridService {
 
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 

	private IUserDefinedFeatureDao userDefinedFeatureDao; 
	public void setUserDefinedFeatureDao(IUserDefinedFeatureDao userDefinedFeatureDao) {
		this.userDefinedFeatureDao = userDefinedFeatureDao;
	}   
	
	
	@Override
	public String saveComplexQuery(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			
			String userId = session.getUserId();
			String featureName = CommonFunction.decode(requestObj.getString("featureName"));   
			String modelName = CommonFunction.decode(requestObj.getString("modelName"));   
			String description = CommonFunction.decode(requestObj.getString("description"));   
			String content = requestObj.getString("content");   

			dbSession = this.openDBSession(); 
			this.userDefinedFeatureDao.setDBSession(dbSession);
			this.userDefinedFeatureDao.saveFeature(userId, featureName, modelName, description, content);
			//在此处实现保存复杂查询条件及值

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("saveComplexQuery", "保存复杂查询条件", ex);
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
	public String getComplexQuery(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String userId = session.getUserId();
			String featureName = CommonFunction.decode(requestObj.getString("featureName"));   
			String modelName = CommonFunction.decode(requestObj.getString("modelName"));    

			dbSession = this.openDBSession(); 
			this.userDefinedFeatureDao.setDBSession(dbSession);
			String content = this.userDefinedFeatureDao.getFeatureContent(userId, featureName, modelName);
			
			if(content == null){
				content = this.userDefinedFeatureDao.getGlobalDefaultFeatureContent(featureName, modelName);
			} 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("complexQueryContent", content);
			
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("saveComplexQuery", "保存复杂查询条件", ex);
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
