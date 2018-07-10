package com.novacloud.novaone.workflow;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao; 

//个人审批历史记录Dao类
public class Wf_ReviewInstanceListImpl extends DataBaseDao {	
	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		JSONObject userObj = new JSONObject();
		userObj.put("parttype", "field");
		userObj.put("field", "instloguserid");
		userObj.put("operator", "=");
		userObj.put("value", session.getUserId());
		
		JSONArray sysWhere = new JSONArray();
		sysWhere.add(userObj);
		
		requestObj.put("sysWhere", sysWhere);
	}	
}
