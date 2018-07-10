package com.novacloud.dataHelper.share;

import java.util.Date;
import java.util.HashMap;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class EditShareDataBaseDao extends DataBaseDao {
	
	//根据json获取数据
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	@Override
	protected HashMap<String, Object> deleteCore(INcpSession session, JSONObject requestObj) throws Exception{ 
		//不真正删除，只是打标记 
		JSONObject deleteRowsJSON = requestObj.getJSONObject("deleteRows");    
		String dataName = requestObj.getString("dataName");
		Data data =	DataCollection.getData(dataName); 
		if(deleteRowsJSON.size() != 0){
			for(Object idValueObj : deleteRowsJSON.values().toArray()){ 
				String idValue = (String)idValueObj;
				HashMap<String, Object> fieldValues = new HashMap<String, Object>();
				fieldValues.put("isdeleted", "Y");
				this.dBParserAccess.updateByData(this.getDBSession(), data, fieldValues, idValue); 
			}
		}  
	    HashMap<String, Object> resultHash=new HashMap<String, Object>();
	    return resultHash;
	}
}
