package com.novacloud.novaone.dao.system.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_Role;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.PagePurviewHash;

public class D_RoleImpl extends DataBaseDao implements D_Role {

	private PagePurviewHash pagePurviewHash = null;
	public void setPagePurviewHash(PagePurviewHash pagePurviewHash){
		this.pagePurviewHash = pagePurviewHash;
	} 
	
	//根据json获取数据
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	@Override
	protected void afterDelete(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		 
		//删除所有角色关于此菜单项的权限设置
		JSONObject rowIdToIdValues = requestObj.getJSONObject("deleteRows");    
		Data rmData = DataCollection.getData("d_RoleMenu"); 
		for(Object id : rowIdToIdValues.values().toArray()){ 
			this.dBParserAccess.deleteByData(this.getDBSession(), rmData, "roleid", "=", id);
		}		 
		pagePurviewHash.initFromDB();
	}
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		List<String> newRoleIds = new ArrayList<String>();
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert");
	    JSONObject id2RowIds = (JSONObject) resultHash.get("idValueToRowIds");
	    for(Object rowIdObj : insertRowsObj.keySet()){
	    	for(Object idValueObj : id2RowIds.keySet()){
	    		if(rowIdObj.equals(id2RowIds.get(idValueObj))){
	    			newRoleIds.add(idValueObj.toString());
	    		}
	    	}
	    }
	    
	    String menuSql = "select m.id as id, m.isdefaultenable as isdefaultenable from sys_menu m";
	    DataTable menuDt =this.dBParserAccess.getMultiLineValues(this.getDBSession(), menuSql, null,new String[]{"id", "isdefaultenable"}, new ValueType[]{ValueType.String, ValueType.Boolean}); 
    		    
	    List<HashMap<String, Object>> allRMs = new ArrayList<HashMap<String, Object>>();
	    //循环所有的新建行，
	    for(String roleId : newRoleIds){
		    for(DataRow menuRow : menuDt.getRows()){ 
		    	String menuid = menuRow.getStringValue("id");
		    	boolean isDefaultEnable = menuRow.getBooleanValue("isdefaultenable"); 
		    	HashMap<String, Object> rm = new HashMap<String, Object>();
	    		rm.put("menuid", menuid);
	    		rm.put("roleid", roleId);
	    		rm.put("isenable", isDefaultEnable ? "Y" : "N");
	    		allRMs.add(rm);
		    }    	 
	    } 
		Data rmData = DataCollection.getData("d_RoleMenu"); 
		this.dBParserAccess.insertByData(this.getDBSession(), rmData, allRMs); 
		pagePurviewHash.initFromDB();
	}	
}
