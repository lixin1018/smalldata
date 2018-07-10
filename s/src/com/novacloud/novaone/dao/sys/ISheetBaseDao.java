package com.novacloud.novaone.dao.sys;

import java.sql.SQLException;
import java.util.HashMap;

import org.hibernate.Session;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;

public interface ISheetBaseDao { 
	void setDBSession( Session dbSession);
	HashMap<String, Object> saveWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException ;
	HashMap<String, Object> deleteWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException; 
	HashMap<String, Object> save(INcpSession session, JSONObject requestObj) throws RuntimeException ;
	HashMap<String, Object> delete(INcpSession session, JSONObject requestObj) throws RuntimeException; 
}
