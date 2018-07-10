package com.novacloud.shuShuo;

import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.excelGrid.team.TeamProcessor;
import com.novacloud.science.words.ParseSogo;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONObject; 

public class ShuShuoService  extends NcpActionSupport implements IShuShuoService{

	//事务管理器
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	
	//数据库Session
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	//实际处理Team各种操作
	private ShuShuoProcessor shuShuoProcessor = null;
	public void setShuShuoProcessor(ShuShuoProcessor shuShuoProcessor){
		this.shuShuoProcessor = shuShuoProcessor;
	}
	public ShuShuoProcessor getShuShuoProcessor(){
		return this.shuShuoProcessor;
	}

	
	@Override
	public String getData(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), false);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String code = CommonFunction.decode(requestObj.getString("code")); 
			  
			ShuShuoProcessor shuShuoProcessor = this.getShuShuoProcessor();	
			dbSession = this.openDBSession();
			shuShuoProcessor.setDBSession(dbSession);			
			DataTable resultTable = shuShuoProcessor.getData(code); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("table", resultTable.toHashMap());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getData", "获取数据失败.", ex);
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
	public String getSSPlayInfo(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), false);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String code = CommonFunction.decode(requestObj.getString("code")); 
			  
			ShuShuoProcessor shuShuoProcessor = this.getShuShuoProcessor();	
			dbSession = this.openDBSession();
			shuShuoProcessor.setDBSession(dbSession);			
			HashMap<String, Object> resultHash = shuShuoProcessor.getSSPlayInfo(code);   
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString); 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getSSPlayInfo", "获取数据失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}	 
	
	//更新数据动画的列表信息，这样编辑好的动画信息，就会更新到数据动画首页里 added by lixin 20180703
	@Override
	public String refreshPlayList(){ 
		Session dbSession = null;
		try
		{
			dbSession = this.openDBSession();
			ShuShuoProcessor shuShuoProcessor = this.getShuShuoProcessor();	
			shuShuoProcessor.setDBSession(dbSession); 
			shuShuoProcessor.refreshPlayList();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		} 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("refreshPlayList", "refreshPlayList Error", ex);
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
