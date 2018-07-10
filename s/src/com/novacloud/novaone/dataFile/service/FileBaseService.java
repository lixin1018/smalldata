package com.novacloud.novaone.dataFile.service;

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
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.IFileBaseProcessor;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.dataFile.webExcel.WebExcelFileProcessor;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.opensymphony.xwork2.ActionSupport;
  
 //数据文件服务
public class FileBaseService extends NcpActionSupport{

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 
	
	//实际处理文件的对象
	private IFileBaseProcessor fileBaseProcessor = null;
	public void setFileBaseProcessor(IFileBaseProcessor fileBaseProcessor){
		this.fileBaseProcessor = fileBaseProcessor;
	}
	public IFileBaseProcessor getFileBaseProcessor(){
		return this.fileBaseProcessor;
	}

	//保存 
	public String saveFile(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String fileId = requestObj.getString("fileId");   
			String fileContent = requestObj.getString("fileContent");
			String title = CommonFunction.decode(requestObj.getString("title")); 
			String applicationName = requestObj.getString("applicationName");
			String applicationVersion = requestObj.getString("applicationVersion");
			String property = requestObj.getString("property");

			dbSession = this.openDBSession();
			this.getFileBaseProcessor().setDBSession(dbSession);			
 
			this.getFileBaseProcessor().saveFile(session, fileId, fileContent, title, applicationName, applicationVersion, property); 
			
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
			NcpException ncpEx = new NcpException("saveFile", "保存失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	  
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}  

	//读取 
	public String readFile(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String fileId = requestObj.getString("fileId");

			dbSession = this.openDBSession(); 
			this.getFileBaseProcessor().setDBSession(dbSession);			

			String fileContent = this.getFileBaseProcessor().readFile(session, fileId); 
			JSONObject fileInfo = this.getFileBaseProcessor().getFileInfo(session, fileId); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("fileContent", fileContent); 
			resultHash.put("fileInfo", fileInfo);			
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("readFile", "读取失败.", ex);
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
