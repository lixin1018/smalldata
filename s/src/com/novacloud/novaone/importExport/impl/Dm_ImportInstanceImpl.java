package com.novacloud.novaone.importExport.impl;
   
import java.util.HashMap; 

import org.hibernate.Session;

import net.sf.json.JSONObject;
 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig; 
import com.novacloud.novaone.dao.db.IDBParserAccess; 
import com.novacloud.novaone.dao.sys.DataBaseDao; 
import com.novacloud.novaone.importExport.ImportStatusType;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 

public class Dm_ImportInstanceImpl extends DataBaseDao{
 
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	@Override 
	public HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException {
		try{
			String actionName = requestObj.getString("actionName");
			JSONObject customParam = requestObj.getJSONObject("customParam");
			if("deleteDetailRows".equals(actionName)){
				return deleteDetailRows(session, customParam);
			}
			return null;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new RuntimeException(ex);
		}
	}

	//删除对应的导入的明细记录
	private HashMap<String, Object> deleteDetailRows(INcpSession session, JSONObject customParam) throws Exception{
		try{
			String importInstanceId = customParam.getString("id");	  
			
			String getTableNameSql = "select i.desttablename as desttablename from dm_importinstance i where i.id = " + SysConfig.getParamPrefix() + "id";
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("id", importInstanceId);
			
			Session dbSession = this.getDBSession();
			String destTableName = (String)this.dBParserAccess.selectOne(dbSession, getTableNameSql, p2vs);
			
			if(destTableName != null && destTableName.length() != 0){				
				String deleteSql = "delete from " + destTableName + " where parentid = " + SysConfig.getParamPrefix() + "id";
				HashMap<String, Object> deleteP2vs = new HashMap<String, Object>();
				deleteP2vs.put("id", importInstanceId);
				this.dBParserAccess.delete(dbSession, deleteSql, deleteP2vs);
			}
	
			Data importInstanceData = DataCollection.getData("dm_ImportInstance");
			HashMap<String, Object> fieldValues = new HashMap<String, Object>();
			fieldValues.put("statustype", ImportStatusType.Deleted.toString());
			this.dBParserAccess.updateByData(dbSession, importInstanceData, fieldValues, importInstanceId);

			HashMap<String, Object> resultMap = new HashMap<String, Object>();
			resultMap.put("succeed", "true");
			return resultMap; 
		}
		catch(Exception ex){
			throw ex;
		}
	}	 
}
