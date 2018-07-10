package com.novacloud.novaone.dao.sys;

import java.util.HashMap;

import org.hibernate.Session;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;

public interface IParamWinBaseDao {  
	void setDBSession( Session dbSession);
	HashMap<String, Object> getList(INcpSession session, JSONObject requestObj) throws Exception;
	HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException;
}
