package com.novacloud.novaone.service;
  
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.Org;
import com.novacloud.novaone.dao.sys.Role;
import com.novacloud.novaone.user.SystemUserProcessor;
import com.opensymphony.xwork2.ActionSupport; 

//@WebService  
//@SOAPBinding(style = Style.RPC)
public class UserService extends NcpActionSupport implements IUserService {
  	private static Logger logger=Logger.getLogger(UserService.class); 
	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}	  
	
	private SystemUserProcessor systemUserProcessor = null;
	public SystemUserProcessor getSystemUserProcessor(){
		return this.systemUserProcessor;
	}
	public void setSystemUserProcessor(SystemUserProcessor systemUserProcessor){
		this.systemUserProcessor = systemUserProcessor;
	}
	

	@Override
	public String logout() { 
		try
		{ 
			NcpSession session = new NcpSession(this.getHttpSession(), false);
			this.getSystemUserProcessor().logout(session);
		}
		catch(Exception ex){
        	ex.printStackTrace();
		} 
		return ActionSupport.SUCCESS;	
	}	
	
	@Override
	public String getSysParam(){ 
		try{	 
			logger.info(requestParam);		
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("userid", session.getUserId());
			resultHash.put("usercode", CommonFunction.encode(session.getUserCode()));
			resultHash.put("username", CommonFunction.encode(session.getUserName())); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getSysParam", "获取系统参数失败", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		return ActionSupport.SUCCESS;		
	}	 
	
	@Override
	public String getUserInfo(){ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);
			DataRow userRow = this.getSystemUserProcessor().getUserInfo(session);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();  
			resultHash.put("code", CommonFunction.encode(userRow.getStringValue("code")));
			resultHash.put("name", CommonFunction.encode(userRow.getStringValue("name")));
			resultHash.put("email", CommonFunction.encode(userRow.getStringValue("email")));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getUserInfo", "获取用户信息失败", ex); 
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
	public String changeUserInfo(){ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String name = CommonFunction.decode(requestObj.getString("name"));	 
			String email = CommonFunction.decode(requestObj.getString("email"));	
			String password = SecurityUtils.novaEnCryption(CommonFunction.decode(requestObj.getString("password"))); 		
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);
			this.getSystemUserProcessor().changeUserInfo(session, password, name, email);
			
			session.setUserName(name);
			
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
			NcpException ncpEx = new NcpException("changeUserInfo", "修改用户信息失败", ex); 
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
	public String getMenu(){  
		Session dbSession = null;
		try{ 
			logger.info(requestParam);		
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);
			
			JSONArray menuItems = this.getSystemUserProcessor().getMenu(session);	
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("menuItems", menuItems);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getMenu", "获取菜单失败", ex); 
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
	public String login() {  
		Session dbSession = null;
		try{ 
			logger.info(requestParam);	
			NcpSession session = new NcpSession(this.getHttpSession(), false);

			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String code = CommonFunction.decode(requestObj.getString("code"));
			//密码加密
			String password = SecurityUtils.novaEnCryption(CommonFunction.decode(requestObj.getString("password"))); 
			
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);
			
			this.getSystemUserProcessor().login(session, code, password); 
			String resultString = ServiceResultProcessor.createJsonResultStr(session.toHashMap());
			this.addResponse(resultString);  
		}
		catch(NcpException ex){
        	ex.printStackTrace();
			this.addResponse(ex.toJsonString());
		}
		catch(Exception ex){
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("005", "登录错误", ex);
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
	public String changePassword(){

		Session dbSession = null;
		try{ 
			logger.info(requestParam);
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			NcpSession session = new NcpSession(this.getHttpSession(), true);
			String userid = session.getUserId(); 
			String oldpassword = SecurityUtils.novaEnCryption(requestObj.getString("oldpassword")); 
			String newpassword = SecurityUtils.novaEnCryption(requestObj.getString("newpassword"));  
			
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);

			this.getSystemUserProcessor().changePassword(session, oldpassword, newpassword);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("info", "密码修改成功.");
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);			 
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString());
		} 	
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("ChangePassword", "修改密码失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
	
	//标记为已读
	@Override
	public String markUserMessage(){  
		Session dbSession = null;
		try{
			logger.info(requestParam);		
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			JSONArray messageIdArray = requestObj.getJSONArray("messageIds"); 
			List<String> messageIdList = new ArrayList<String>();
			for(int i = 0; i < messageIdArray.size(); i++){
				String messageId = messageIdArray.getString(i);
				messageIdList.add(messageId);
			}
 	
			dbSession = this.openDBSession();
			this.getSystemUserProcessor().setDBSession(dbSession);
			this.getSystemUserProcessor().markUserMessage(session, messageIdList);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("markUserMessage", "标记为已读失败", ex); 
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
