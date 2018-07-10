package com.novacloud.novaone.excelGrid.team.impl;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_User;
import com.novacloud.novaone.model.sysmodel.Data;

//输入输出定义dao类
public class Tm_JoinProcess extends DataBaseDao { 
	
	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		
		JSONObject otherParamObj = requestObj.getJSONObject("otherRequestParam");
		String teamId = otherParamObj.getString("teamId");

		JSONObject teamIdObj = new JSONObject();
		teamIdObj.put("parttype", "field");
		teamIdObj.put("field", "teamid");
		teamIdObj.put("operator", "=");
		teamIdObj.put("value", teamId);
		
		JSONArray sysWhere = new JSONArray();
		sysWhere.add(teamIdObj);
		
		requestObj.put("sysWhere", sysWhere);
	}
}
