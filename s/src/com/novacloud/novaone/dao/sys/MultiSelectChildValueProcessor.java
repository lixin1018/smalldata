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

//处理子表多条记录同时保存、删除、获取 added by lixin 20181130
public class MultiSelectChildValueProcessor {

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	//查询
	//requestObj客户端的请求的信息
	//resultHash服务器端处理返回的信息
	//childDataName子表Data模型名称
	//parentIdFieldName子表中关联父表id的字段名，例如parentid
	//valueFieldName子表中显示下拉（弹出）值的字段（数据库中可以不存在此字段，Data模型中存在），例如typename
	//foreignKeyFieldName子表中存储下来（弹出）值的Id的字段（可以理解为外键，可以不定义此字段），例如typeid
	//parentDataIdFieldName父表的Id字段名，例如id	
	public void GetMultiSelectChildValues(Session dbSession, JSONObject requestObj, HashMap<String,Object> resultHash, String childDataName, String parentIdFieldName, String valueFieldName, String foreignKeyFieldName, String parentDataIdFieldName){

		Data childData = DataCollection.getData(childDataName);
		
		//获取本次查询返回的父表记录
		HashMap tableHash = (HashMap)resultHash.get("table");
		JSONArray rowJsonArray = (JSONArray)tableHash.get("rows");
		
		JSONArray childDataJsonArray = new JSONArray();
		//循环所有的父表记录
		for(int i = 0; i < rowJsonArray.size(); i++){
			String parentId = rowJsonArray.getJSONObject(i).getString(parentDataIdFieldName);
			JSONArray childValueArray =  new JSONArray();
			
			//根据父表id值，获取子表对应的记录（多条）
			DataTable childDt = this.dBParserAccess.getDtByFieldValue(dbSession, childData, parentIdFieldName, "=", parentId);
			List<DataRow> childRows = childDt.getRows();
			for(int j = 0; j < childRows.size(); j++){
				DataRow childRow = childRows.get(j);
				JSONObject childValueObj = new JSONObject();
				childValueObj.put(valueFieldName, childRow.getStringValue(valueFieldName));
				if(foreignKeyFieldName != null && foreignKeyFieldName.length() > 0){
					childValueObj.put(foreignKeyFieldName, childRow.getStringValue(foreignKeyFieldName));
				}
				childValueArray.add(childValueObj);
			}
			JSONObject childDataJson = new JSONObject();
			childDataJson.put("idValue", parentId);
			childDataJson.put("values", childValueArray);
			childDataJsonArray.add(childDataJson);			
		}

		//将子表的数据作为本次请求的otherResponseParam，返回给客户端
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

	//保存
	//requestObj客户端的请求的信息
	//resultHash服务器端处理返回的信息
	//childDataName子表Data模型名称
	//parentDataName父表Data模型名称
	//parentIdFieldName子表中关联父表id的字段名，例如parentid
	//valueFieldName子表中存储下拉（弹出）值（或Id）的字段（数据库中需要存在此字段），例如typename或者typeid
	public void SaveMultiSelectChildValues(Session dbSession, JSONObject requestObj, HashMap<String,Object> resultHash, String childDataName, String parentDataName, String parentIdFieldName, String valueFieldName){
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
			if(multiSelectsObj != null && !multiSelectsObj.isNullObject() && multiSelectsObj.containsKey(parentDataName)){
				JSONObject parentMultiSelectsObj = multiSelectsObj.getJSONObject(parentDataName);
				if(parentMultiSelectsObj != null && !parentMultiSelectsObj.isNullObject() && parentMultiSelectsObj.containsKey(childDataName)){
					JSONArray multiSelectsArray = parentMultiSelectsObj.getJSONArray(childDataName);
					for(int i = 0; i < multiSelectsArray.size(); i++){
						JSONObject multiSelectObj = multiSelectsArray.getJSONObject(i);
						String rowId = multiSelectObj.getString("rowId");
						String idValue = rowIdToIdValues.get(rowId);
				   
						//从数据库中delete该父表记录对应的所有子表记录
						this.dBParserAccess.deleteByData(dbSession, childData, parentIdFieldName, "=", idValue);
				   
						JSONArray valueArray = multiSelectObj.getJSONArray("values");
						for(int j = 0; j < valueArray.size(); j++){
							String value = valueArray.getString(j);
							HashMap<String, Object> fieldValues = new HashMap<String, Object>();
							fieldValues.put(parentIdFieldName, idValue);
							fieldValues.put(valueFieldName, value);				
					   
							//再重新将子表记录insert到数据库中
							this.dBParserAccess.insertByData(dbSession, childData, fieldValues);
						}		
					}
			   	}
			}
		}
	}

	//删除
	//requestObj客户端的请求的信息 
	//childDataName子表Data模型名称
	//parentDataName父表Data模型名称
	//parentIdFieldName子表中关联父表id的字段名，例如parentid
	public void DeleteMultiSelectChildValues(Session dbSession, JSONObject requestObj, String childDataName, String parentIdFieldName){
		Data childData = DataCollection.getData(childDataName);		

		//获取本次需要删除的父表记录Id（可以是多条）
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
		
		//逐一删除对应的子表记录
		for(int i = 0; i < ids.size(); i++){
			this.dBParserAccess.deleteByData(dbSession, childData, parentIdFieldName, "=", ids.get(i));
		}
	}
}
