package com.novacloud.novaone.ocr.service;
 
import java.sql.SQLException;
import java.util.HashMap;

import org.hibernate.Session; 
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.ocr.OcrProcessor;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor; 
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

public class OcrService extends NcpActionSupport implements IOcrService  {
 
	private HibernateTransactionManager transactionManager;
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}
	
	private OcrProcessor OcrProcessor;
	public void setOcrProcessor(OcrProcessor OcrProcessor){
		this.OcrProcessor = OcrProcessor;
	}
	private OcrProcessor getOcrProcessor(){
		return this.OcrProcessor;
	}
	
	protected Session openDBSession() throws SQLException {
		return this.transactionManager.getSessionFactory().openSession();
	}  
	
	@Override
	public String getStringFromImage(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			
			String filePath = requestObj.getString("filePath"); 
			
			OcrProcessor OcrProcessor = this.getOcrProcessor(); 
			dbSession = this.openDBSession();
			OcrProcessor.setDBSession(dbSession); 
			String str = OcrProcessor.getStringFromImage(filePath);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("value", str);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getStringFromImage", "从图片中读取文字", ex);
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
