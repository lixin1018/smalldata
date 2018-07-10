package com.novacloud.dataHelper.control;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.share.ShareViewProcessor;  
 
public class DataShareControl{

  	private static Logger logger=Logger.getLogger(DataShareControl.class); 

	
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
	
	public JSONObject getCategory(String code) throws Exception{
		logger.info("getCategoryList");
		Session dbSession = null;
		try{
			ShareViewProcessor viewProcessor =  this.getViewProcessor();
			dbSession = this.openDBSession();
			viewProcessor.setDBSession(dbSession);
			JSONObject categoryObj = viewProcessor.getCategory(code);  
			return categoryObj;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}
	 
	public JSONArray getCategoryList() throws Exception{
		logger.info("getCategoryList");
		Session dbSession = null;
		try{
			ShareViewProcessor viewProcessor =  this.getViewProcessor();
			dbSession = this.openDBSession();
			viewProcessor.setDBSession(dbSession);
			JSONArray categoryArray = viewProcessor.getCategoryList();  
			return categoryArray;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	 
}