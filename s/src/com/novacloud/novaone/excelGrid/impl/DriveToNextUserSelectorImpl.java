package com.novacloud.novaone.excelGrid.impl;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.sys.ParamWinBaseDao;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DriveToNextUserSelectorImpl extends ParamWinBaseDao {
	@Override
	protected void beforeGetList(INcpSession session, JSONObject requestObj) throws Exception{
		
		JSONArray whereArray = requestObj.containsKey("where") ? requestObj.getJSONArray("where") : new JSONArray();
		JSONObject userIdObj = new JSONObject();
		userIdObj.put("parttype", "field");
		userIdObj.put("field", "memberid");
		userIdObj.put("operator", "=");
		userIdObj.put("value", session.getUserId());
		
		whereArray.add(userIdObj);
		
		requestObj.put("where", whereArray);
	}	
}
