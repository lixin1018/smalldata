package com.novacloud.novaone.test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_Role;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.PagePurviewHash;
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.SheetCollection;
import com.novacloud.novaone.model.sysmodel.SheetPart;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;

public class Test_SheetGridImpl extends DataBaseDao{
 	//根据json获取数据
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  

	private String[] allSheetParts = new String[]{"line1", "line2"};
	private String[] getAllSheetParts(){  
		return allSheetParts;
	}

	private HashMap<String, HashMap<String, String>> allChildDataSources = null;
	private HashMap<String, HashMap<String, String>> allChildDataSources(){  
		if(allChildDataSources == null){
			allChildDataSources = new HashMap<String, HashMap<String, String>>();
			
			HashMap<String, String> line1 = new  HashMap<String, String>();
			line1.put("dataName", "d_User");
			line1.put("fieldName", "name");
			allChildDataSources.put("line1", line1);

			HashMap<String, String> line2 = new  HashMap<String, String>();
			line1.put("dataName", "sys_Module");
			line1.put("fieldName", "name");
			allChildDataSources.put("line2", line2);
		}
		return allChildDataSources;
	}

	private String sheetName = "test_SheetGrid";
	private String getSheetName (){
		return sheetName;
	}
	
	@Override
	protected void afterDelete(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		//删除子表记录
		String[] allSheetParts = getAllSheetParts();
		if(allSheetParts.length > 0){ 
			String dataName = (String)requestObj.get("dataName");  
			Data parentData = DataCollection.getData(dataName);
			Session dbSession = this.getDBSession();
			String sheetName = getSheetName();
			Sheet sheet = SheetCollection.getSheet(sheetName); 
			for(int i=0;i<allSheetParts.length;i++){
				String sheetPartName = allSheetParts[i];
				SheetPart sp = sheet.getSheetPart(sheetPartName);
				String viewName = sp.getViewName();
				View view = ViewCollection.getView(viewName);
				String childDataName = view.getDataName();
				Data childData = DataCollection.getData(childDataName); 

				if(requestObj.containsKey("deleteRows")) {
					JSONObject rowIdToIdValues = requestObj.getJSONObject("deleteRows");    	
					List<String> ids = new ArrayList<String>(); 
					for(Object id : rowIdToIdValues.values().toArray()){
						this.dBParserAccess.deleteByData(dbSession, childData, "parentid", "=", (String)id);	
					}  
				}
			}
		}		
	}
	
	private void deleteChildData(Session session, String parentId, Data childData){
		this.dBParserAccess.deleteByData(session, childData, "parentid", "=", parentId);
	}
	
	private void saveChildData(Session session, String parentId,  JSONArray childDataArray, Data childData) {
		//删除历史记录
		this.deleteChildData(session, parentId, childData);
		
		//重新插入新纪录
		if(childDataArray.size()>0) {
			List<HashMap<String, Object>> insertList = new ArrayList<HashMap<String, Object>>();
			for(int i=0; i<childDataArray.size(); i++){
				JSONObject json = childDataArray.getJSONObject(i); 
				HashMap<String, Object> insertMap = new HashMap<String, Object>();
				insertMap.put("parentid", parentId);
				insertMap.put("valueid", json.getString("valueid"));
				insertList.add(insertMap); 
			} 
			this.dBParserAccess.insertByData(session, childData, insertList);
		}
	}
	
	protected void saveChildDataAfterSaveParent(Session dbSession, Sheet sheet, String[] allSheetParts, JSONObject childRowObj, String parentId){
		for(int i=0;i<allSheetParts.length;i++){
			String sheetPartName = allSheetParts[i];
			JSONArray partChildRows = childRowObj.getJSONArray(sheetPartName);
			SheetPart sp = sheet.getSheetPart(sheetPartName);
			String viewName = sp.getViewName();
			View view = ViewCollection.getView(viewName);
			String childDataName = view.getDataName();
			Data childData = DataCollection.getData(childDataName); 
			this.saveChildData(dbSession, parentId, partChildRows, childData);
		}
	}
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{

		String[] allSheetParts = getAllSheetParts();
		if(allSheetParts.length > 0){			
			String dataName = (String)requestObj.get("dataName");  
			Data parentData = DataCollection.getData(dataName);
			Session dbSession = this.getDBSession();
			String sheetName = getSheetName();
			Sheet sheet = SheetCollection.getSheet(sheetName); 
			JSONObject allChildRowsObj = requestObj.getJSONObject("childPartRows");
			
			//保存子表数据
		    JSONObject id2RowIds = (JSONObject)resultHash.get("idValueToRowIds");
		    JSONObject insertRowsObj = requestObj.getJSONObject("insert");
		    for(Object rowIdObj : insertRowsObj.keySet()){
		    	for(Object idValueObj : id2RowIds.keySet()){
		    		if(rowIdObj.equals(id2RowIds.get(idValueObj))){
		    			String idValue = (String)idValueObj;
		    			String rowId = (String)rowIdObj;
		    			JSONObject childRowObj = allChildRowsObj.getJSONObject(rowId);
		    			this.saveChildDataAfterSaveParent(dbSession, sheet, allSheetParts, childRowObj, idValue);
		    		}
		    	}
		    }
		    
		    JSONObject updateRowsObj = requestObj.getJSONObject("update");
		    for(Object rowIdObj : updateRowsObj.keySet()){
		    	String updateRowId = (String)rowIdObj;
		    	JSONObject updateRowObj = updateRowsObj.getJSONObject(updateRowId);
		    	String idValue =(String)updateRowObj.get(parentData.getIdFieldName());    
    			JSONObject childRowObj = allChildRowsObj.getJSONObject(updateRowId);
    			this.saveChildDataAfterSaveParent(dbSession, sheet, allSheetParts, childRowObj, idValue); 
		    }
		    
		    //刷新获取子表数据
			Boolean isRefreshAfterSave = (Boolean) requestObj.get("isRefreshAfterSave");  
		    if(isRefreshAfterSave){   
		    	HashMap<String, Object> table = (HashMap<String, Object>)resultHash.get("table");
		    	JSONArray parentRowsArray = (JSONArray)table.get("rows");
				HashMap<String, Object> allChildPartData = new HashMap<String, Object>();
				for(int i=0;i<allSheetParts.length;i++){
					String sheetPartName = allSheetParts[i];
					SheetPart sp = sheet.getSheetPart(sheetPartName);
					String viewName = sp.getViewName();
					View view = ViewCollection.getView(viewName);
					String childDataName = view.getDataName();
					Data childData = DataCollection.getData(childDataName); 
					
					JSONObject childDataJson = new JSONObject();
					childDataJson.put("sheetPartName", sheetPartName); 		
					this.getChildRows(dbSession, allChildPartData, parentRowsArray, sheet, parentData, sp, childData); 
				}		 
				resultHash.put("allChildPartData", allChildPartData);
		    }
		} 
	}	

	@Override
	protected void afterSelect(INcpSession session, JSONObject requestObj,  HashMap<String,Object> resultHash) throws Exception{
		String[] allSheetParts = getAllSheetParts();
		if(allSheetParts.length > 0){
			//获取子表记录
			HashMap<String,Object> tableObj = (HashMap<String,Object>)resultHash.get("table");
			JSONArray rowsArray = (JSONArray)tableObj.get("rows");
			//遍历所有的	allSheetPart，来获取字表记录值，resultHash中增加键childDataArray，格式为
			/*[
			 * {sheetPartName:"line1", 
			 * 	datatableArray:[
			 * 		{
			 * 			parentIdValue:"r1",
			 * 			table:这条父表记录对应的字表datatable，客户端服务器端都可以只用通用的办法，解析封装datatable，客户端在展示的时候，将子表记录值拼接显示在附表中
			 * 		}, 
			 * 		{
			 * 			parentIdValue:"r2",
			 * 			table:这条父表记录对应的字表datatable，客户端服务器端都可以只用通用的办法，解析封装datatable，客户端在展示的时候，将子表记录值拼接显示在附表中
			 * 		} 
			 * 	]
			 * },
			 * {
			 * 		sheetPartName:"line2", 
			 * 		[]
			 * }
			 * ]
			 */
			Session dbSession = this.getDBSession();
			HashMap<String, Object> allChildPartData = new HashMap<String, Object>();
			String sheetName = getSheetName();
			Sheet sheet = SheetCollection.getSheet(sheetName);
			String dataName = requestObj.getString("dataName");
			Data parentData = DataCollection.getData(dataName);
			for(int i=0;i<allSheetParts.length;i++){
				String sheetPartName = allSheetParts[i];
				SheetPart sp = sheet.getSheetPart(sheetPartName);
				String viewName = sp.getViewName();
				View view = ViewCollection.getView(viewName);
				String childDataName = view.getDataName();
				Data childData = DataCollection.getData(childDataName); 
				
				JSONObject childDataJson = new JSONObject();
				childDataJson.put("sheetPartName", sheetPartName);
				 
				this.getChildRows(dbSession, allChildPartData, rowsArray, sheet, parentData, sp, childData); 
			}		 
			resultHash.put("allChildPartData", allChildPartData);
		}
	}
	private void getChildRows(Session session, HashMap<String, Object> allChildPartData, JSONArray rowsArray, Sheet sheet, Data parentData, SheetPart sp, Data childData) throws Exception{
		String pointerFieldName = sp.getParentPointerField(); 
		SelectSqlParser sqlParser = childData.getDsSqlParser();
		String sourceFieldFullName = sqlParser.getSelectExpMap(pointerFieldName);
		String where = sourceFieldFullName + " = " + SysConfig.getParamPrefix() + "parentId";
		for(int i=0;i<rowsArray.size();i++){
			JSONObject parentRow = rowsArray.getJSONObject(i);
			String parentId = parentRow.getString(parentData.getIdFieldName()); 
			DataTable dt = getChildRows(session, sqlParser, where, parentId);
			HashMap<String, Object> partData = null;
			if(allChildPartData.containsKey(parentId)){
				partData = (HashMap<String, Object>)allChildPartData.get(parentId);
			}
			else{
				partData =  new HashMap<String, Object>();
				allChildPartData.put(parentId, partData);
			} 
			partData.put(sp.getName(), dt.toHashMap()); 
		}
	}
	private DataTable getChildRows(Session session, SelectSqlParser sqlParser, String where, String parentId){
    	HashMap<String, Object> p2vs = new HashMap<String, Object>();
    	p2vs.put("parentId", parentId);
		DataTable dt = this.dBParserAccess.getDtBySqlParser(session, sqlParser, 0,1000, p2vs, where, "");
		return dt;
	}
	 
}
