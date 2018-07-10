package com.novacloud.shuShuo.control;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.share.ShareViewProcessor;
import com.novacloud.shuShuo.ShuShuoProcessor;  
 
public class ShuShuoControl{

  	private static Logger logger=Logger.getLogger(ShuShuoControl.class); 

	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private ShuShuoProcessor shuShuoProcessor;
	public void setShuShuoProcessor(ShuShuoProcessor shuShuoProcessor){
		this.shuShuoProcessor = shuShuoProcessor;
	}
	private ShuShuoProcessor getShuShuoProcessor(){
		return this.shuShuoProcessor;
	}
	
	public JSONArray getSSPlayList() throws Exception{
		logger.info("getSSPlayList");
		Session dbSession = null;
		try{
			ShuShuoProcessor shuShuoProcessor =  this.getShuShuoProcessor();
			dbSession = this.openDBSession();
			shuShuoProcessor.setDBSession(dbSession);
			JSONArray playArray = shuShuoProcessor.getSSPlayList();  
			return playArray;
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