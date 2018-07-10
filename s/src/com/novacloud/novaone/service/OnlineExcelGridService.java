package com.novacloud.novaone.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.dao.sys.ISheetBaseDao;
import com.novacloud.novaone.dao.sys.IUserDefinedFeatureDao;
import com.novacloud.novaone.excelGrid.definition.ExcelGrid;
import com.novacloud.novaone.excelGrid.expression.definition.Columns;
import com.novacloud.novaone.excelGrid.expression.definition.Rows;
import com.novacloud.novaone.excelGrid.expression.definition.RunAt;
import com.novacloud.novaone.excelGrid.expression.definition.Sheets;
import com.novacloud.novaone.excelGrid.expression.definition.Validator;
import com.opensymphony.xwork2.ActionSupport;
 
public class OnlineExcelGridService extends NcpActionSupport implements IOnlineExcelGridService {
 
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 

	private IUserDefinedFeatureDao userDefinedFeatureDao; 
	public void setUserDefinedFeatureDao(IUserDefinedFeatureDao userDefinedFeatureDao) {
		this.userDefinedFeatureDao = userDefinedFeatureDao;
	}   
	
	
	@Override
	public String saveExcelGrid(){ 
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			JSONObject egJsonObj = requestObj.getJSONObject("excelGrid"); 
			ExcelGrid eg = ExcelGrid.fromJson(egJsonObj);
			
			//在此处实现保存复杂查询条件及值

			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("saveExcelGrid", "保存ExcelGrid", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 
		
	@Override
	public String validateExcelExpression(){ 
		Session dbSession = null;
		try{
			//暂时不验证身份
			//NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String exp = requestObj.getString("expression");
			String cellSheetId = requestObj.getString("sheetId");
			
			JSONArray fieldTypeJsonArray = requestObj.containsKey("fieldTypes") ? requestObj.getJSONArray("fieldTypes") : null;
			HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
			if(fieldTypeJsonArray != null){
				int fieldCount = fieldTypeJsonArray.size();
				for(int i = 0; i < fieldCount; i++){
					JSONObject fieldTypeJsonObj = fieldTypeJsonArray.getJSONObject(i);
					String fieldName = fieldTypeJsonObj.getString("name");
					String fieldValueTypeStr = fieldTypeJsonObj.getString("valueType");
					ValueType fieldType = (ValueType)Enum.valueOf(ValueType.class, fieldValueTypeStr);
					fieldTypes.put(fieldName, fieldType);
				}
			}
			
			RunAt runAt = RunAt.All;
			
			String needResultTypeStr = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null;
			ValueType needResultType = needResultTypeStr == null ? null : ((ValueType)Enum.valueOf(ValueType.class, needResultTypeStr));

			HashMap<String, ValueType> cellValueTypes = new HashMap<String, ValueType>();
			JSONArray cellValueTypeJsonArray = requestObj.containsKey("cellValueTypes") ? requestObj.getJSONArray("cellValueTypes") : null;
			if(cellValueTypeJsonArray != null){
				int cellCount = cellValueTypeJsonArray.size();
				for(int i = 0; i < cellCount; i++){
					JSONObject cellValueTypeJson = cellValueTypeJsonArray.getJSONObject(i);
					String cellId = cellValueTypeJson.getString("cellId");
					String cellValueTypeStr = cellValueTypeJson.getString("valueType");
					ValueType cellValueType = (ValueType)Enum.valueOf(ValueType.class, cellValueTypeStr);
					cellValueTypes.put(cellId, cellValueType);
				}
			}

			List<String> sheetIds = new ArrayList<String>();
			List<String> sheetNames = new ArrayList<String>();
			List<Columns> columnsList = new ArrayList<Columns>();
			List<Rows> rowsList = new ArrayList<Rows>();
			JSONArray sheetJsonArray = requestObj.getJSONArray("sheets");
			
			for(int j = 0; j < sheetJsonArray.size(); j++){
				JSONObject sheetJson = sheetJsonArray.getJSONObject(j);
				String sheetId = sheetJson.getString("sheetId");
				sheetIds.add(sheetId);
				String sheetName = sheetJson.getString("sheetName");
				sheetNames.add(sheetName);

				List<String> allColumnIds = new ArrayList<String>();
				JSONArray columnIdJsonArray = sheetJson.containsKey("columnIds") ? sheetJson.getJSONArray("columnIds") : null;
				if(columnIdJsonArray != null){
					int colCount = columnIdJsonArray.size();
					for(int i = 0; i < colCount; i++){
						JSONObject columnIdJson = columnIdJsonArray.getJSONObject(i);
						String colId = columnIdJson.getString("columnId");
						allColumnIds.add(colId);
					}
				}			
				Columns columns = new Columns(allColumnIds);
				columnsList.add(columns);
				
				List<String> allRowIds = new ArrayList<String>();
				JSONArray rowIdJsonArray = sheetJson.containsKey("rowIds") ? sheetJson.getJSONArray("rowIds") : null;
				if(rowIdJsonArray != null){
					int rowCount = rowIdJsonArray.size();
					for(int i = 0; i < rowCount; i++){
						JSONObject rowIdJson = rowIdJsonArray.getJSONObject(i);
						String rowId = rowIdJson.getString("rowId");
						allRowIds.add(rowId);
					}
				}
				Rows rows = new Rows(allRowIds);
				rowsList.add(rows);
			}
			Sheets sheets = new Sheets(sheetIds, sheetNames, columnsList, rowsList);
			
			
			Validator vali = new Validator();
			vali.validateExp(exp, cellValueTypes, cellSheetId, sheets, fieldTypes, runAt, needResultType);
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("saveExcelGrid", "保存ExcelGrid", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	} 
}
