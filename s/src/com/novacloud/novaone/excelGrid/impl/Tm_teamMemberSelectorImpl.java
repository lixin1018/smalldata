package com.novacloud.novaone.excelGrid.impl;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
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
public class Tm_teamMemberSelectorImpl extends DataBaseDao { 

	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		String userName = null;
		String teamId = null;
		if(requestObj.containsKey("otherRequestParam")){
			JSONObject otherRequestParamObj = requestObj.getJSONObject("otherRequestParam");
			userName = otherRequestParamObj.containsKey("userName") &&  !(otherRequestParamObj.get("userName") instanceof JSONNull) ? otherRequestParamObj.getString("userName") : null;
			teamId = otherRequestParamObj.containsKey("teamId") &&  !(otherRequestParamObj.get("teamId") instanceof JSONNull) ? otherRequestParamObj.getString("teamId") : null;
		}

		JSONArray sysWhere = new JSONArray();
		String currentUserId = session.getUserId();
		String clause = teamId != null && teamId.length() > 0
				? "tm.teamid = '" + teamId +"'"
				: "exists(select * from tm_teammember mytm where mytm.teamid = tm.teamid and mytm.memberid='" + currentUserId +"')";
		
		JSONObject sameTeamObj = new JSONObject();
		sameTeamObj.put("parttype", "clause");
		sameTeamObj.put("clause", clause);
		
		sysWhere.add(sameTeamObj);
		 
		if(userName != null){
			userName = userName.trim();
			if(userName.length() > 0){
				JSONObject userNameObj = new JSONObject();
				userNameObj.put("parttype", "field");
				userNameObj.put("field", "username");
				userNameObj.put("operator", "like");
				userNameObj.put("value", "%" + userName + "%");
				sysWhere.add(userNameObj);
			}
		}
		requestObj.put("sysWhere", sysWhere);
	}
}
