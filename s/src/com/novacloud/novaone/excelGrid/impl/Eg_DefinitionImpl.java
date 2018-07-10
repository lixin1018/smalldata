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
public class Eg_DefinitionImpl extends DataBaseDao { 

	@Override
	protected void beforeSelect(INcpSession session, JSONObject requestObj) throws Exception{
		JSONObject userIdObj = new JSONObject();
		userIdObj.put("parttype", "field");
		userIdObj.put("field", "createuserid");
		userIdObj.put("operator", "=");
		userIdObj.put("value", session.getUserId());
		
		JSONArray sysWhere = requestObj.getJSONArray("sysWhere");
		if(sysWhere == null){
			sysWhere = new JSONArray();
		}
		sysWhere.add(userIdObj);
		
		requestObj.put("sysWhere", sysWhere);
	}
	
	@Override
	protected void beforeSave(INcpSession session, JSONObject requestObj) throws Exception{
	    //新增	    
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert"); 
	    int insertRowCount = insertRowsObj.size();
	    Object[] insertRowIds = insertRowsObj.keySet().toArray();
	    for(int i = 0;i < insertRowCount; i++){	    	
	    	String insertRowId = (String)insertRowIds[i];
	    	JSONObject insertRowObj = insertRowsObj.getJSONObject(insertRowId); 

	    	String currentUserId = session.getUserId(); 
	    	insertRowObj.put("createuserid", currentUserId); 
	    	
	    	Date dt = new Date();
	    	String createTime = ValueConverter.convertToString(dt, ValueType.Time);
	    	insertRowObj.put("createtime", createTime);
	    }

	    //更新	    
	    JSONObject updateRowsObj = requestObj.getJSONObject("update"); 
	    int updateRowCount = updateRowsObj.size();
	    Object[] updateRowIds = updateRowsObj.keySet().toArray();
	    for(int i = 0;i < updateRowCount; i++){	    	
	    	String updateRowId = (String)updateRowIds[i];
	    	JSONObject updateRowObj = updateRowsObj.getJSONObject(updateRowId); 

	    	String currentUserId = session.getUserId(); 
	    	updateRowObj.put("modifyuserid", currentUserId); 
	    	
	    	Date dt = new Date();
	    	String modifyTime = ValueConverter.convertToString(dt, ValueType.Time);
	    	updateRowObj.put("modifytime", modifyTime);
	    }
	}	

	@Override
	protected void beforeGetList(INcpSession session, JSONObject requestObj) throws Exception{
		JSONObject memberIdObj = new JSONObject();
		memberIdObj.put("parttype", "field");
		memberIdObj.put("field", "memberid");
		memberIdObj.put("operator", "=");
		memberIdObj.put("value", session.getUserId());
		
		JSONArray sysWhere = new JSONArray();
		sysWhere.add(memberIdObj);
		
		requestObj.put("sysWhere", sysWhere);
	}
}
