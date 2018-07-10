package com.novacloud.dataHelper.service;
 
import java.sql.SQLException;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
 
import net.sf.json.JSONObject; 
import com.novacloud.dataHelper.user.UserProcessor;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.opensymphony.xwork2.ActionSupport;
 
public class UserService extends NcpActionSupport implements IUserService {

  	private static Logger logger=Logger.getLogger(UserService.class); 

	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private UserProcessor userProcessor;
	public void setUserProcessor(UserProcessor userProcessor){
		this.userProcessor = userProcessor;
	}
	private UserProcessor getUserProcessor(){
		return this.userProcessor;
	}
	
	@Override
	public String regUser() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String code = CommonFunction.decode(requestObj.getString("code"));
			String password = CommonFunction.decode(requestObj.getString("password"));
			String imgCode = CommonFunction.decode(requestObj.getString("imgCode"));
			String email = CommonFunction.decode(requestObj.getString("email"));
			
			NcpSession session = new NcpSession(this.getHttpSession(), false); 
			UserProcessor userProcessor =  this.getUserProcessor();
			dbSession = this.openDBSession();
			userProcessor.setDBSession(dbSession);
			userProcessor.regUserWithTx(session, code, password, imgCode, email);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("reg100", "注册用户失败", ex);
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
	public String forgetPwd() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String email = CommonFunction.decode(requestObj.getString("email"));
			
			NcpSession session = new NcpSession(this.getHttpSession(), false); 
			UserProcessor userProcessor =  this.getUserProcessor();
			dbSession = this.openDBSession();
			userProcessor.setDBSession(dbSession);
			String userId = userProcessor.forgetPwd(session, email);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("id", userId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("forgetpwd100", "找回密码失败", ex);
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
	public String forgetChangePwd() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String userId = CommonFunction.decode(requestObj.getString("userId"));
			String validateCode = CommonFunction.decode(requestObj.getString("validateCode"));
			String newPwd = CommonFunction.decode(requestObj.getString("newPwd")); 
			
			NcpSession session = new NcpSession(this.getHttpSession(), false); 
			UserProcessor userProcessor =  this.getUserProcessor();
			dbSession = this.openDBSession();
			userProcessor.setDBSession(dbSession);
			userProcessor.forgetChangePwd(session, userId, validateCode, newPwd);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("forgetchangepwd100", "修改密码失败", ex);
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
	public String changePwd() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String oldPwd = CommonFunction.decode(requestObj.getString("oldPwd")); 
			String newPwd = CommonFunction.decode(requestObj.getString("newPwd")); 
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			UserProcessor userProcessor =  this.getUserProcessor();
			dbSession = this.openDBSession();
			userProcessor.setDBSession(dbSession);
			userProcessor.changePwd(session, oldPwd, newPwd);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("changepwd100", "修改密码失败", ex);
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