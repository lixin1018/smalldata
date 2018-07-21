package com.novacloud.dataHelper.service;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.share.ShareViewProcessor; 
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.model.sysmodel.DataField;
import com.novacloud.novaone.workflow.definition.IWorkflowDefineDao;
import com.novacloud.novaone.workflow.definition.Wf_Workflow;
import com.opensymphony.xwork2.ActionSupport;
 
public class DataShareService extends NcpActionSupport implements IDataShareService {

  	private static Logger logger=Logger.getLogger(DataShareService.class); 

	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private ShareViewProcessor viewProcessor;
	public void setViewProcessor(ShareViewProcessor viewProcessor){
		this.viewProcessor = viewProcessor;
	}
	private ShareViewProcessor getViewProcessor(){
		return this.viewProcessor;
	}
	
	@Override
	public String getCategoryTypeList(){ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		
			NcpSession session = new NcpSession(this.getHttpSession(), false);

			ShareViewProcessor viewProcessor =  this.getViewProcessor();
			dbSession = this.openDBSession();
			viewProcessor.setDBSession(dbSession);
			JSONArray typeArray = viewProcessor.getCategoryTypeList();  
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("categoryTypes", typeArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getCategoryTypeList", "获取数据共享分类失败", ex);
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