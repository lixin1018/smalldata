package com.novacloud.dataHelper.memory.impl;
   
import java.util.HashMap; 

import org.hibernate.Session;

import net.sf.json.JSONObject;

import com.novacloud.dataHelper.memory.GlobalVariableType;
import com.novacloud.dataHelper.memory.GlobalVariables;
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao;  

public class Dh_GobalVariableTypeImpl extends DataBaseDao{
  
	@Override 
	public HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException {
		try{
			String actionName = requestObj.getString("actionName");
			JSONObject customParam = requestObj.getJSONObject("customParam");
			if("cleanVariableValue".equals(actionName)){
				return cleanVariableValue(session, customParam);
			}
			return null;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new RuntimeException(ex);
		}
	}

	//删除对应的导入的明细记录
	private HashMap<String, Object> cleanVariableValue(INcpSession session, JSONObject customParam) throws Exception{
		try{
			String variableName = customParam.getString("variableName");	  
			
			GlobalVariableType variableType = GlobalVariableType.valueOf(variableName);
			GlobalVariables.clean(variableType);
			
			HashMap<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("succeed", "true");
			return resultMap; 
		}
		catch(Exception ex){
			throw ex;
		}
	}	 
}
