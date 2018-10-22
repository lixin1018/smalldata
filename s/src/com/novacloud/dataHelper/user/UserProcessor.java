package com.novacloud.dataHelper.user;

import java.io.UnsupportedEncodingException; 
import java.math.BigInteger;
import java.sql.SQLException;
import java.text.ParseException; 
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.nova.frame.utils.SecurityUtils;
import com.novacloud.dataHelper.util.EmailUtils;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession; 
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.Role;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 

public class UserProcessor {

	//DBParserAccess
	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
	}

	private long passwordMaxLength = 50;
	private long codeMaxLength = 50;
	
	//一般用户Id
	private String commonRoleId = "3";
	
	//验证码的源
	private String randomCharSource = "abcdefghijklmnopqrstuvwxyz123456789";
	
	//修改密码的验证码超时时长(分钟)
	private int changePwdValidateCodeTimeout = 30;
	
	//发送邮件功能
	private EmailUtils emailUtils;
	public EmailUtils getEmailUtils() {
		return emailUtils;
	}
	public void setEmailUtils(EmailUtils emailUtils) {
		this.emailUtils = emailUtils;
	}
	
	
	//数据库Session（需要Service类里的方法把dbSession传递过来）
	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	} 
	
	public void regUser(INcpSession session, String code, String password, String email) throws UnsupportedEncodingException, SQLException, ParseException, NcpException{

		Session dbSession = this.getDBSession(); 
		
		String checkExistUserSql = "select count(1) as num from d_user where code = " + SysConfig.getParamPrefix() + "code";
		HashMap<String, Object> uP2vs = new HashMap<String, Object>();
		uP2vs.put("code", code);
		BigInteger uCount = (BigInteger)this.dBParserAccess.selectOne(dbSession, checkExistUserSql, uP2vs);
		if(uCount.intValue() > 0){
			NcpException ncpEx = new NcpException("reg_code", "已存在同名账号");
			throw ncpEx;
		}
		else{
			String checkExistEmailSql = "select count(1) as num from d_user where email = " + SysConfig.getParamPrefix() + "email";
			HashMap<String, Object> eP2vs = new HashMap<String, Object>();
			eP2vs.put("email", email);
			BigInteger eCount = (BigInteger)this.dBParserAccess.selectOne(dbSession, checkExistEmailSql, eP2vs);

			if(eCount.intValue() > 0){
				NcpException ncpEx = new NcpException("reg_email", "此邮箱已被绑定");
				throw ncpEx;
			}
			else{
				Data userData = DataCollection.getData("d_User");
				HashMap<String, Object> uFieldValues = new HashMap<String, Object>();
				uFieldValues.put("code", code);
				uFieldValues.put("name", code);
				uFieldValues.put("password", SecurityUtils.novaEnCryption(password));
				uFieldValues.put("isusing", "Y");
				uFieldValues.put("email", email);
				uFieldValues.put("regtime", new Date());
				String userId = this.dBParserAccess.insertByData(dbSession, userData, uFieldValues);
				

				Data userRoleData = DataCollection.getData("d_UserRole");
				HashMap<String, Object> urFieldValues = new HashMap<String, Object>();
				urFieldValues.put("roleid", this.commonRoleId);
				urFieldValues.put("userid", userId);
				String userRoleId = this.dBParserAccess.insertByData(dbSession, userRoleData, urFieldValues);
				
				 
				SelectSqlParser getRoleSqlParser = dBParserAccess.getSqlParser("sys.login.getrole");
				HashMap<String, Object> roleParams = new HashMap<String, Object>();
				roleParams.put("userid", userId);
				DataTable roleDt = dBParserAccess.getDtBySqlParser(dbSession, getRoleSqlParser, -1, -1, roleParams, "", "");
				List<DataRow> roleRows = roleDt.getRows();
				if(roleRows.size()==0){
					NcpException ncpEx = new NcpException("reg_001", "没有给此用户指定角色."); 
					throw ncpEx;
				}
				else{ 					
					List<Role> roleList=new ArrayList<Role>();
					for(DataRow roleRow : roleRows){
						Role r = new Role();
						r.setId(roleRow.getStringValue("roleid"));
						r.setCode(roleRow.getStringValue("rolecode"));
						r.setName(roleRow.getStringValue("rolename"));
						roleList.add(r);
					}
					
					NcpSession ncpSession  = (NcpSession)session;
					ncpSession.setUserId(userId);
					ncpSession.setUserCode(code);
					ncpSession.setUserName(code); 
					ncpSession.setRoleList(roleList);				
				}
			}				
		}
	} 
	
	public void regUserWithTx(INcpSession session, String code, String password, String imgCode, String email) throws UnsupportedEncodingException, SQLException, ParseException, NcpException{

		if(code.length() > codeMaxLength){
			NcpException ncpEx = new NcpException("reg_code", "用户名过长, 长度不要超过" + codeMaxLength);
			throw ncpEx;
		}
		if(password.length() > passwordMaxLength){
			NcpException ncpEx = new NcpException("reg_password", "密码过长, 长度不要超过" + passwordMaxLength);
			throw ncpEx;
		}
		if(!this.checkEmail(email)){
			NcpException ncpEx = new NcpException("reg_email", "Email地址错误");
			throw ncpEx;
		}

		String rCode = (String)session.getSessionValue("rCode");
		if(!imgCode.equals(rCode)){
			NcpException ncpEx = new NcpException("reg_imgcode", "验证码填写错误");
			throw ncpEx;
		}
		
		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			this.regUser(session, code, password, email);
			tx.commit(); 
		}
		catch(Exception ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 
	} 
	
    /**
     * 验证邮箱
     * @param email
     * @return
     */
    public boolean checkEmail(String email){
       return CommonFunction.checkIsEmail(email);
    }    
    
	public String forgetPwd(NcpSession session, String email) throws Exception {
		if(!this.checkEmail(email)){
			NcpException ncpEx = new NcpException("forgetpwd_email", "Email地址错误");
			throw ncpEx;
		}
		
		String checkExistEmailSql = "select u.id as id, u.code as code from d_user u where u.email = " + SysConfig.getParamPrefix() + "email";
		HashMap<String, Object> eP2vs = new HashMap<String, Object>();
		eP2vs.put("email", email);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
		fieldTypes.put("id", ValueType.String);
		fieldTypes.put("code", ValueType.String);
		
		DataTable uDt = this.dBParserAccess.selectList(dbSession, checkExistEmailSql, eP2vs, alias, fieldTypes);
		List<DataRow> uRows = uDt.getRows();
		if(uRows.size() == 0){
			NcpException ncpEx = new NcpException("forgetpwd_email", "此邮箱尚未绑定到用户");
			throw ncpEx;
		}
		else {
			DataRow uRow = uRows.get(0);
			String userCode = uRow.getStringValue("code");
			String userId = uRow.getStringValue("id");
		
			String randomString = this.getRandomString(4);
			Date forgetChangePwdTime = new Date(System.currentTimeMillis() + this.changePwdValidateCodeTimeout * 60 * 1000);
			Data userData = DataCollection.getData("d_User");
			HashMap<String, Object> fieldValues = new HashMap<String, Object>();
			fieldValues.put("forgetchangepwdcode", randomString);
			fieldValues.put("forgetchangepwdtime", forgetChangePwdTime); 
			this.dBParserAccess.updateByData(dbSession, userData, fieldValues, userId);			
			
			String content = userCode + ":\r\n\r\n    您好, 我是数据助理客服机器人!"
					+ "\r\n    您申请了重置密码, 本次的验证码是 " + randomString + "。"
					+ "\r\n    (此验证码" + changePwdValidateCodeTimeout + "分钟后失效)."
					+ "\r\n\r\n数据助理"
					+ "\r\n" + ValueConverter.convertToString(new Date(), ValueType.Time);
			
			EmailUtils emailUtil = this.getEmailUtils();
			emailUtil.send("修改密码所需的验证码 - 数据助理", content, email);	
			return userId;
		}	
	}    
    
	public void forgetChangePwd(NcpSession session, String userId, String validateCode, String newPwd) throws Exception {
		if(validateCode.length() == 0){
			NcpException ncpEx = new NcpException("forgetchangepwd_validateCode", "验证码不能为空");
			throw ncpEx;
		}		
		if(newPwd.length() == 0){
			NcpException ncpEx = new NcpException("forgetchangepwd_newPwd", "新密码不能为空");
			throw ncpEx;
		}
		
		String checkExistUserSql = "select u.id as id, u.code as code, u.email as email from d_user u where u.id = " + SysConfig.getParamPrefix() + "id"
				+ " and u.forgetchangepwdcode = " + SysConfig.getParamPrefix() + "forgetchangepwdcode"
				+ " and u.forgetchangepwdtime > " + SysConfig.getParamPrefix() + "forgetchangepwdtime";
		HashMap<String, Object> eP2vs = new HashMap<String, Object>();
		eP2vs.put("id", userId);
		eP2vs.put("forgetchangepwdcode", validateCode);
		eP2vs.put("forgetchangepwdtime", new Date());
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("email");
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
		fieldTypes.put("id", ValueType.String);
		fieldTypes.put("code", ValueType.String);
		fieldTypes.put("email", ValueType.String);
		
		DataTable uDt = this.dBParserAccess.selectList(dbSession, checkExistUserSql, eP2vs, alias, fieldTypes);
		List<DataRow> uRows = uDt.getRows();
		if(uRows.size() == 0){
			NcpException ncpEx = new NcpException("forgetchangepwd_validateCode", "验证码错误或者已过期");
			throw ncpEx;
		}
		else { 
			DataRow uRow = uRows.get(0);
			String email = uRow.getStringValue("email");
			String userCode = uRow.getStringValue("code");
			String encryptionNewPwd = SecurityUtils.novaEnCryption(newPwd);
			
			Data userData = DataCollection.getData("d_User");
			HashMap<String, Object> fieldValues = new HashMap<String, Object>();
			fieldValues.put("password", encryptionNewPwd); 
			this.dBParserAccess.updateByData(dbSession, userData, fieldValues, userId);		
			
			//登出
			session.invalidate(); 	
			
			String content = userCode + ":\r\n\r\n    您好, 我是数据助理机器人小z!"
					+ "\r\n    您已成功修改密码, 修改时间: " + ValueConverter.convertToString(new Date(), ValueType.Time) + "."
					+ "\r\n\r\n数据助理"
					+ "\r\n" + ValueConverter.convertToString(new Date(), ValueType.Time);
			
			EmailUtils emailUtil = this.getEmailUtils();
			emailUtil.send("修改密码成功 - 数据助理", content, email);	
		}	
	}
    
	public void changePwd(NcpSession session, String oldPwd, String newPwd) throws Exception {
		if(!session.getIsOnline()){
			NcpException ncpEx = new NcpException("changepwd_offline", "尚未登录");
			throw ncpEx;
		}
		if(oldPwd.length() == 0){
			NcpException ncpEx = new NcpException("changepwd_oldPwd", "原密码不能为空");
			throw ncpEx;
		}
		if(newPwd.length() == 0){
			NcpException ncpEx = new NcpException("changepwd_newPwd", "新密码不能为空");
			throw ncpEx;
		}
		String userId = session.getUserId();
		String checkExistUserSql = "select u.id as id, u.code as code, u.email as email, u.password as password from d_user u where u.id = " + SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> eP2vs = new HashMap<String, Object>();
		eP2vs.put("id", userId); 
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("code");
		alias.add("email");
		alias.add("password");
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
		fieldTypes.put("id", ValueType.String);
		fieldTypes.put("code", ValueType.String);
		fieldTypes.put("email", ValueType.String);
		fieldTypes.put("password", ValueType.String);
		
		DataTable uDt = this.dBParserAccess.selectList(dbSession, checkExistUserSql, eP2vs, alias, fieldTypes);
		List<DataRow> uRows = uDt.getRows();
		if(uRows.size() == 0){
			NcpException ncpEx = new NcpException("changepwd_noneUser", "不存在此用户");
			throw ncpEx;
		}
		else { 
			DataRow uRow = uRows.get(0);
			String email = uRow.getStringValue("email");
			String userCode = uRow.getStringValue("code");
			String password = uRow.getStringValue("password");			
			
			String encryptionOldPwd = SecurityUtils.novaEnCryption(oldPwd);
			if(!encryptionOldPwd.equals(password)){
				NcpException ncpEx = new NcpException("changepwd_oldPwd", "原密码错误");
				throw ncpEx;
			}
			else{		
				String encryptionNewPwd = SecurityUtils.novaEnCryption(newPwd);
				
				
				Data userData = DataCollection.getData("d_User");
				HashMap<String, Object> fieldValues = new HashMap<String, Object>();
				fieldValues.put("password", encryptionNewPwd); 
				this.dBParserAccess.updateByData(dbSession, userData, fieldValues, userId);	
				
				//登出
				session.invalidate(); 		
				
				String content = userCode + ":\r\n    您好, 我是数据助理机器人小z!"
						+ "\r\n    您已成功修改密码, 修改时间: " + ValueConverter.convertToString(new Date(), ValueType.Time) + "."
						+ "\r\n\r\n数据助理"
						+ "\r\n" + ValueConverter.convertToString(new Date(), ValueType.Time);
				
				EmailUtils emailUtil = this.getEmailUtils();
				emailUtil.send("修改密码成功 - 数据助理", content, email);	
			}
		}	
	}
	
	public String getRandomString(int length){
		StringBuilder ss= new StringBuilder();
		int sourceLength = this.randomCharSource.length();
        Random random = new Random();
        for(int i = 0; i < length; i++){
            int rInt = random.nextInt(sourceLength);
            ss.append(this.randomCharSource.charAt(rInt));
        }
		return ss.toString();
	}
	
	
}
