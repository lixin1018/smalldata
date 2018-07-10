package com.novacloud.novaone.workflow;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao; 

//我的单据（制单窗口）Dao类
public class Wf_CreateInstanceListImpl extends DataBaseDao {	
	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		JSONObject userObj = new JSONObject();
		userObj.put("parttype", "field");
		userObj.put("field", "userid");
		userObj.put("operator", "=");
		userObj.put("value", session.getUserId());
		
		JSONArray sysWhere = new JSONArray();
		sysWhere.add(userObj);
		
		requestObj.put("sysWhere", sysWhere);
	}	
}
