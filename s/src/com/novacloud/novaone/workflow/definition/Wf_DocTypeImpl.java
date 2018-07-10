package com.novacloud.novaone.workflow.definition;
 
import net.sf.json.JSONObject; 
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField;
import com.novacloud.novaone.model.sysmodel.DocType;
import com.novacloud.novaone.model.sysmodel.DocTypeCollection;
import com.novacloud.novaone.model.sysmodel.DownList;
import com.novacloud.novaone.model.sysmodel.DownListCollection;
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.SheetCollection;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;

//单据类型Dao
public class Wf_DocTypeImpl extends DataBaseDao implements IWf_DocType {	

	private DocTypeCollection docTypeCollection = null;
	public void setDocTypeCollection(DocTypeCollection docTypeCollection){
		this.docTypeCollection = docTypeCollection;
	} 
	
	@Override 
	public HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException{
		try{
			String actionName = requestObj.getString("actionName");
			JSONObject customParam = requestObj.getJSONObject("customParam");
			if("loadRuntime".equals(actionName)){
				return loadRuntime(session, customParam);
			}
			return null;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new RuntimeException(ex);
		}
	}

	private HashMap<String, Object> loadRuntime(INcpSession session, JSONObject customParam) throws Exception{
		String docTypeId = customParam.getString("docTypeId");	 
		DocType dt = docTypeCollection.reloadDocTypeFromDB(docTypeId);	 

		List<String> errors = new ArrayList<String>();
		this.validateDocType(dt.getName(), dt.getSheetName(), dt.getUserIdFieldName(), dt.getOrgIdFieldName(), dt.getIsDeletedFieldName(), errors);
		
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		if(errors.size() == 0) {	 
			resultMap.put("succeed", "true");
		}
		else { 		
			resultMap.put("succeed", "false");	
			resultMap.put("errors", errors);
		}
		return resultMap; 
	}

	public void validateDocType(String docTypeName, String sheetName, String userIdFieldName, String orgIdFieldName, String isDeletedFieldName, List<String> errors){
		Sheet sheet = SheetCollection.getSheet(sheetName);
		if(sheet == null){
			errors.add("不存在Sheet模型, sheetName = '" + sheetName + "', docTypeName = '" + docTypeName + "'");
		}
		else{
			String viewName = sheet.getMainPart().getViewName();
			View view = ViewCollection.getView(viewName);
			if(view == null){
				errors.add("不存在View模型, viewName = '" + viewName + "', docTypeName = '" + docTypeName + "'");
			}
			else{
				String dataName = view.getDataName();
				Data data = DataCollection.getData(dataName);
				if(data == null){
					errors.add("不存在Data模型, dataName = '" + dataName + "', docTypeName = '" + docTypeName + "'");
				}
				else{
					DataField orgIdField = data.getDataField(orgIdFieldName);
					if(orgIdField == null){
						errors.add("不存在DataField模型, name = '" + orgIdFieldName + "', docTypeName = '" + docTypeName + "'");
					}
					
					DataField userIdField = data.getDataField(userIdFieldName);
					if(userIdField == null){
						errors.add("不存在DataField模型, name = '" + userIdFieldName + "', docTypeName = '" + docTypeName + "'");
					}		

					DataField isDeletedField = data.getDataField(isDeletedFieldName);
					if(isDeletedField == null){
						errors.add("不存在DataField模型, name = '" + isDeletedFieldName + "', docTypeName = '" + docTypeName + "'");
					}		
				}
			}
		}
	}
}
