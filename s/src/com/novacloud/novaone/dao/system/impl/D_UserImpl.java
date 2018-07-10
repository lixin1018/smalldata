package com.novacloud.novaone.dao.system.impl;
 
import net.sf.json.JSONObject;

import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_User;

public class D_UserImpl extends DataBaseDao implements D_User {	
	@Override
	protected void beforeSave(INcpSession session, JSONObject requestObj) throws Exception{
	    //插入到数据库	    
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert");
	    String defaultPwd = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_DEFAULT_PASSWORD);
	    int insertRowCount = insertRowsObj.size();
	    Object[] insertRowIds = insertRowsObj.keySet().toArray();
	    for(int i = 0;i < insertRowCount; i++){	    	
	    	String insertRowId = (String)insertRowIds[i];
	    	JSONObject insertRowObj = insertRowsObj.getJSONObject(insertRowId); 
	    	insertRowObj.put("password", SecurityUtils.novaEnCryption(defaultPwd));
	    }
	}	
}
