package com.novacloud.novaone.dao.system.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig; 
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.Sys_Menu;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 
import com.novacloud.novaone.model.sysmodel.PagePurviewHash;

public class Sys_MenuImpl extends DataBaseDao implements Sys_Menu {

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
			this.dBParserAccess.deleteByData(this.getDBSession(), rmData, "menuid", "=", id);
		}	 
		pagePurviewHash.initFromDB();
	}
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		List<String> newMenuItemIds = new ArrayList<String>();
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert");
	    JSONObject id2RowIds = (JSONObject) resultHash.get("idValueToRowIds");
	    for(Object rowIdObj : insertRowsObj.keySet()){
	    	for(Object idValueObj : id2RowIds.keySet()){
	    		if(rowIdObj.equals(id2RowIds.get(idValueObj))){
	    			newMenuItemIds.add(idValueObj.toString());
	    		}
	    	}
	    }
	    
	    String roleSql = "select r.id as id from d_role r";
	    DataTable roleDt = this.dBParserAccess.getMultiLineValues(this.getDBSession(), roleSql, null,new String[]{"id"}, new ValueType[]{ValueType.String});
	    List<String> roleIds = new ArrayList<String>();
	    for(DataRow roleRow : roleDt.getRows()){
	    	roleIds.add(roleRow.getStringValue("id"));
	    }
    	
	    
	    List<HashMap<String, Object>> allRMs = new ArrayList<HashMap<String, Object>>();
	    //循环所有的新建行，
	    for(String menuItemId : newMenuItemIds){
	    	String menuSql = "select m.id as id, m.isdefaultenable as isdefaultenable from sys_menu m where m.id = " + SysConfig.getParamPrefix() + "id";
	    	HashMap<String, Object> p2vs = new HashMap<String, Object>();
	    	p2vs.put("id", menuItemId);
	    	DataTable menuDt = this.dBParserAccess.getMultiLineValues( this.getDBSession(), menuSql, p2vs, new String[]{"id","isdefaultenable"}, new ValueType[]{ValueType.String, ValueType.String});
	    	DataRow menuRow = menuDt.getRows().get(0); 
	    	boolean isDefaultEnable =  menuRow.getBooleanValue("isdefaultenable");
	    	for(String roleId : roleIds){
		    	HashMap<String, Object> rm = new HashMap<String, Object>();
	    		rm.put("menuid", menuItemId);
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
