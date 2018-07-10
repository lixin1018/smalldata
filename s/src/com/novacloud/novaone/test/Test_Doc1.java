package com.novacloud.novaone.test;
 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.Date;
import java.util.HashMap; 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.DataBaseDao; 

public class Test_Doc1 extends DataBaseDao {	
	@Override	
	protected void onAdd(INcpSession session, JSONObject requestObj, HashMap<String, Object> resultObj) throws Exception{
		JSONArray defaultValues =  new JSONArray();
		int newRowCount = (Integer) requestObj.get("newRowCount");
		for(int i = 0; i < newRowCount; i++){
			JSONObject oneRowDefaultValue = new JSONObject();
			oneRowDefaultValue.put("note", "我是Note的默认值");
			
			oneRowDefaultValue.put("createuserid", session.getUserId());
			oneRowDefaultValue.put("createusername", session.getUserName());

			oneRowDefaultValue.put("createtime", ValueConverter.convertToString(new Date(), ValueType.Time));
			defaultValues.add(oneRowDefaultValue);
		}
		resultObj.put("defaultValues", defaultValues);
	}
}
