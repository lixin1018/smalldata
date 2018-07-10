package com.novacloud.novaone.common;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;
import javax.xml.ws.WebServiceContext;
import javax.xml.ws.handler.MessageContext;

import net.sf.json.JSONArray;

import com.novacloud.novaone.dao.sys.Org;
import com.novacloud.novaone.dao.sys.Role; 

public class NcpSession implements INcpSession {
 
	private HttpSession session;
	//private Object user;

	@SuppressWarnings("unchecked")
	public NcpSession(WebServiceContext wsContext,boolean isInitSessionValue) throws Exception{
		try
		{
			if(isInitSessionValue){
				MessageContext mc = wsContext.getMessageContext();
				session = (HttpSession) ((javax.servlet.http.HttpServletRequest) mc.get(MessageContext.SERVLET_REQUEST)).getSession();
				if(session.getAttribute("userId") == null){
					throw new NcpException("001", "offline, please login.");
				}
				else{
					this.userName = (String) session.getAttribute("userName");
					this.userCode = (String) session.getAttribute("userCode");
					this.userId = (String) session.getAttribute("userId");
					this.orgList = (List<Org>) session.getAttribute("orgList");
					this.roleList = (List<Role>) session.getAttribute("roleList");
				}
			}
			else {
				MessageContext mc = wsContext.getMessageContext();
				session = (HttpSession) ((javax.servlet.http.HttpServletRequest) mc.get(MessageContext.SERVLET_REQUEST)).getSession();  
				if(session.getAttribute("userId") != null){
					this.userName = (String) session.getAttribute("userName");
					this.userCode = (String) session.getAttribute("userCode");
					this.userId = (String) session.getAttribute("userId");
					this.orgList = (List<Org>) session.getAttribute("orgList");
					this.roleList = (List<Role>) session.getAttribute("roleList");
				} 
			}
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new Exception("can not get session values.", ex);
		}
	}	 
	
	@SuppressWarnings("unchecked")
	public NcpSession(HttpSession httpSession, boolean isInitSessionValue)
			throws Exception {
		try {
			if (isInitSessionValue) {
				// mc = wsContext.getMessageContext();
				session = httpSession;// (HttpSession)
										// ((javax.servlet.http.HttpServletRequest)
										// mc.get(MessageContext.SERVLET_REQUEST)).getSession();
				if(session.getAttribute("userId") == null){
					throw new NcpException("001", "offline, please login.");
				}
				else{				
					this.userName = (String) session.getAttribute("userName");
					this.userCode = (String) session.getAttribute("userCode");
					this.userId = (String) session.getAttribute("userId");
					this.orgList = (List<Org>) session.getAttribute("orgList");
					this.roleList = (List<Role>) session.getAttribute("roleList");
					//this.user = (Object) session.getAttribute("user");
				}
			} else {
				// mc = wsContext.getMessageContext();
				session = httpSession;// (HttpSession)
										// ((javax.servlet.http.HttpServletRequest)
										// mc.get(MessageContext.SERVLET_REQUEST)).getSession();
				if(session.getAttribute("userId") != null){
					this.userName = (String) session.getAttribute("userName");
					this.userCode = (String) session.getAttribute("userCode");
					this.userId = (String) session.getAttribute("userId");
					this.orgList = (List<Org>) session.getAttribute("orgList");
					this.roleList = (List<Role>) session.getAttribute("roleList");
				} 
			}
		} 
		catch (NcpException ex) {
			ex.printStackTrace();
			throw ex;
		}
		catch (Exception ex) {
			ex.printStackTrace();
			throw new Exception("can not get session values.");
		}
	}

	@SuppressWarnings("unchecked")
	public NcpSession(HttpSession session) throws Exception {
		try {
			this.session = session;
			this.userName = (String) session.getAttribute("userName");
			this.userCode = (String) session.getAttribute("userCode");
			this.userId = (String) session.getAttribute("userId");
			this.orgList = (List<Org>) session.getAttribute("orgList");
			this.roleList = (List<Role>) session.getAttribute("roleList");
			//this.user = (Object) session.getAttribute("user");
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new Exception("can not get session values.");
		}
	}

	public NcpSession(String userId) { 
		this.userId = userId;  
	}

	// 作废
	public void invalidate() {
		session.invalidate();
	}

	private String userName;

	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.session.setAttribute("userName", userName);
		this.userName = userName;
	}

	private String userCode;

	public String getUserCode() {
		return this.userCode;
	}

	public void setUserCode(String userCode) {
		this.session.setAttribute("userCode", userCode);
		this.userCode = userCode;
	}

	private String userId;

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.session.setAttribute("userId", userId);
		this.userId = userId;
	}

	public boolean getIsOnline() {
		return session != null && session.getAttribute("userId") != null;
	}

	private List<Org> orgList;

	public List<Org> getOrgList() {
		return this.orgList;
	}

	public void setOrgList(List<Org> orgList) {
		this.session.setAttribute("orgList", orgList);
		this.orgList = orgList;
	}

	private List<Role> roleList;

	public List<Role> getRoleList() {
		return this.roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.session.setAttribute("roleList", roleList);
		this.roleList = roleList;
	}
	
	public Object getSessionValue(String attributeName){
		return this.session.getAttribute(attributeName);
	}
	
	/*
	public Object getUser() {
		return user;
	}

	public void setUser(Object user) {
		this.session.setAttribute("user", user);
		this.user = user;
	}
	*/

	public HashMap<String, Object> toHashMap() {
		HashMap<String, Object> sessionHash = new HashMap<String, Object>();
		sessionHash.put("userId", this.getUserId());
		sessionHash.put("userName", this.getUserName());
		sessionHash.put("userCode", this.getUserCode());

		JSONArray orgArray = new JSONArray();
		for (Org org : this.getOrgList()) {
			HashMap<String, Object> orgObj = new HashMap<String, Object>();
			orgObj.put("id", org.getId());
			orgObj.put("code", org.getCode());
			orgObj.put("name", org.getName());
			orgArray.add(orgObj);
		}
		sessionHash.put("orgList", orgArray);

		JSONArray roleArray = new JSONArray();
		for (Role role : this.getRoleList()) {
			HashMap<String, Object> roleObj = new HashMap<String, Object>();
			roleObj.put("id", role.getId());
			roleObj.put("code", role.getCode());
			roleObj.put("name", role.getName());
			roleArray.add(roleObj);
		}
		sessionHash.put("roleList", roleArray);

		return sessionHash;
	}

}
