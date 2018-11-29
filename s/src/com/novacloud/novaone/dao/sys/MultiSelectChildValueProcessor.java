package com.novacloud.novaone.dao.sys;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.hibernate.Session;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

//处理子表多选保存、删除、获取 added by lixin 20181127
public class MultiSelectChildValueProcessor {

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	public void GetMultiSelectChildValues(Session dbSession, JSONObject requestObj, HashMap<String,Object> resultHash, String childDataName, String parentIdFieldName, String valueFieldName, String foreignKeyFieldName, String parentDataIdFieldName){
		HashMap tableHash = (HashMap)resultHash.get("table");
		JSONArray rowJsonArray = (JSONArray)tableHash.get("rows");
		Data childData = DataCollection.getData(childDataName);
		
		JSONArray childDataJsonArray = new JSONArray();
		for(int i = 0; i < rowJsonArray.size(); i++){
			String parentId = rowJsonArray.getJSONObject(i).getString(parentDataIdFieldName);
			JSONArray childValueArray =  new JSONArray();
			DataTable childDt = this.dBParserAccess.getDtByFieldValue(dbSession, childData, parentIdFieldName, "=", parentId);
			List<DataRow> childRows = childDt.getRows();
			for(int j = 0; j < childRows.size(); j++){
				DataRow childRow = childRows.get(j);
				JSONObject childValueObj = new JSONObject();
				childValueObj.put(valueFieldName, childRow.getStringValue(valueFieldName));
				if(foreignKeyFieldName !=null && foreignKeyFieldName.length() > 0){
					childValueObj.put(foreignKeyFieldName, childRow.getStringValue(foreignKeyFieldName));
				}
				childValueArray.add(childValueObj);
			}
			JSONObject childDataJson = new JSONObject();
			childDataJson.put("idValue", parentId);
			childDataJson.put("values", childValueArray);
			childDataJsonArray.add(childDataJson);			
		}

		String otherResponseParamPropertyName = "otherResponseParam";
		if(!resultHash.containsKey(otherResponseParamPropertyName)){
			resultHash.put(otherResponseParamPropertyName, new JSONObject());
		}		
		JSONObject otherResponseParamJson = (JSONObject)resultHash.get(otherResponseParamPropertyName);
		
		String multiSelectsPropertyName = "multiSelects";
		if(!otherResponseParamJson.containsKey(multiSelectsPropertyName)){
			otherResponseParamJson.put(multiSelectsPropertyName,  new JSONObject());
		}
		JSONObject multiSelectJson = otherResponseParamJson.getJSONObject(multiSelectsPropertyName);
		multiSelectJson.put(childDataName, childDataJsonArray);	
	}
	
	public void SaveMultiSelectChildValues(Session dbSession, JSONObject requestObj, HashMap<String,Object> resultHash, String childDataName, String parentIdFieldName, String valueFieldName){
		Data childData = DataCollection.getData(childDataName);		
		
		JSONObject idValueToRowIdsObj = (JSONObject)resultHash.get("idValueToRowIds");
		HashMap<String, String> rowIdToIdValues = new HashMap<String, String>();
		for(Object idValueObj : idValueToRowIdsObj.keySet()){
			String idValue = (String)idValueObj;
			String rowId = idValueToRowIdsObj.getString(idValue);
			rowIdToIdValues.put(rowId, idValue);
		}
		
		JSONObject otherRequestParamObj = requestObj.getJSONObject("otherRequestParam");
		if(otherRequestParamObj != null && !otherRequestParamObj.isNullObject()){
			JSONObject multiSelectsObj = otherRequestParamObj.getJSONObject("multiSelects");
			if(multiSelectsObj != null && !multiSelectsObj.isNullObject() && multiSelectsObj.containsKey(childDataName)){
			   JSONArray multiSelectsArray = multiSelectsObj.getJSONArray(childDataName);
			   for(int i = 0; i < multiSelectsArray.size(); i++){
				   JSONObject multiSelectObj = multiSelectsArray.getJSONObject(i);
				   String rowId = multiSelectObj.getString("rowId");
				   String idValue = rowIdToIdValues.get(rowId);
				   
				   //删除以前的子表记录
				   this.dBParserAccess.deleteByData(dbSession, childData, parentIdFieldName, "=", idValue);
				   
				   JSONArray valueArray = multiSelectObj.getJSONArray("values");
				   for(int j = 0; j < valueArray.size(); j++){
					   String value = valueArray.getString(j);
					   HashMap<String, Object> fieldValues = new HashMap<String, Object>();
					   fieldValues.put(parentIdFieldName, idValue);
					   fieldValues.put(valueFieldName, value);				
					   
					   //添加新记录
					   this.dBParserAccess.insertByData(dbSession, childData, fieldValues);
				   }			   
			   	}
			}
		}
	}
	
	public void DeleteMultiSelectChildValues(Session dbSession, JSONObject requestObj, String childDataName, String parentIdFieldName){
		Data childData = DataCollection.getData(childDataName);		

		List<String> ids = null;
		if(requestObj.containsKey("deleteRows")) {
			JSONObject rowIdToIdValues = requestObj.getJSONObject("deleteRows");
			ids = new ArrayList<String>();
			for(Object idObj : rowIdToIdValues.values().toArray()){
				ids.add((String)idObj);
			}  
		}
		else{
			String parentDataName = requestObj.getString("dataName");	
			Data parentData = DataCollection.getData(parentDataName);		
			JSONObject deleteByFieldValue = requestObj.getJSONObject("deleteByFieldValue"); 
			String fieldName = deleteByFieldValue.getString("fieldName");
			DataField field = parentData.getDataField(fieldName);
			String operateStr = deleteByFieldValue.getString("operateStr");
			String fieldValueStr = deleteByFieldValue.getString("fieldValue");
			Object fieldValue = ValueConverter.convertToDBObject(fieldValueStr, field.getValueType());
			ids = this.dBParserAccess.getIds(dbSession, parentData.getIdFieldName(), parentData, fieldName, operateStr, fieldValue);
		}
		for(int i = 0; i < ids.size(); i++){
			this.dBParserAccess.deleteByData(dbSession, childData, parentIdFieldName, "=", ids.get(i));
		}
	}
}
