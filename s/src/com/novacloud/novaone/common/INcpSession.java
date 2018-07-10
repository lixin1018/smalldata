package com.novacloud.novaone.common;

import java.util.HashMap;
import java.util.List;

import com.novacloud.novaone.dao.sys.Org;
import com.novacloud.novaone.dao.sys.Role;

public interface INcpSession {
	void invalidate(); 
	String getUserName();
	String getUserCode();
	String getUserId();
	boolean getIsOnline();
	List<Org> getOrgList();
	void setOrgList(List<Org> orgList);
	List<Role> getRoleList();
	HashMap<String,Object> toHashMap();
	Object getSessionValue(String attributeName); 
}
