package com.novacloud.novaone.excelGrid.team.impl;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

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
import com.opensymphony.xwork2.ActionContext;

//输入输出定义dao类
public class Tm_MyTeam extends DataBaseDao { 

	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		 
		String userId = session.getUserId();
		JSONObject teamIdObj = new JSONObject();
		teamIdObj.put("parttype", "field");
		teamIdObj.put("field", "memberid");
		teamIdObj.put("operator", "=");
		teamIdObj.put("value", userId);
		
		JSONArray sysWhere = new JSONArray();
		sysWhere.add(teamIdObj);
		
		requestObj.put("sysWhere", sysWhere);
	}
	@Override
	protected void afterSelect(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		HttpServletRequest request = ServletActionContext.getRequest(); 
		String shareUrl = request.getRequestURL().toString().replace(request.getRequestURI(), request.getContextPath() + "/page/h/tdgl/teamInfoGuest.jsp");
		String userId = session.getUserId();
		HashMap tableObj = (HashMap)resultHash.get("table");
		JSONArray rows = (JSONArray)tableObj.get("rows");
		if(rows.size() > 0){
			for(int i = 0; i < rows.size(); i++){
				JSONObject row = rows.getJSONObject(i);
				String createUserId = row.getString("createuserid");
				row.put("isowner", userId.equals(createUserId) ? "Y" : "N");
				row.put("shareurl", shareUrl + "?teamid=" + row.getString("teamid"));
			}
		}
	}
}
