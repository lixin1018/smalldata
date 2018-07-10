package com.novacloud.novaone.ocr.control;
 
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.novaone.ocr.OcrProcessor;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.dao.db.DataRow; 
 
public class OcrControl{

  	private static Logger logger=Logger.getLogger(OcrControl.class); 

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 
	
	private OcrProcessor ocrProcessor;
	public void setOcrProcessor(OcrProcessor ocrProcessor){
		this.ocrProcessor = ocrProcessor;
	}
	private OcrProcessor getOcrProcessor(){
		return this.ocrProcessor;
	}
/*
	public String getUserOcrCode(INcpSession session) throws Exception{
		logger.info("getRoleOcrCode");
		Session dbSession = null;
		try{
			OcrProcessor OcrProcessor =  this.getOcrProcessor();
			dbSession = this.openDBSession();
			OcrProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			String OcrCode = OcrProcessor.getUserOcrCode(userId);  
			return OcrCode;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}*/
}