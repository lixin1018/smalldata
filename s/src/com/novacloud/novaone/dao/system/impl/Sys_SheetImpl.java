package com.novacloud.novaone.dao.system.impl;
  
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.Sys_Sheet;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField; 
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.SheetCollection;
import com.novacloud.novaone.model.sysmodel.SheetPart;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;

public class Sys_SheetImpl extends DataBaseDao implements Sys_Sheet {

	private SheetCollection sheetCollection = null;
	public void setSheetCollection(SheetCollection sheetCollection){
		this.sheetCollection = sheetCollection;
	} 
		
	@Override 
	public HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException{
		try{
			String actionName = requestObj.getString("actionName");
			JSONObject customParam = requestObj.getJSONObject("customParam");
			if("generateJs".equals(actionName)){
				return generateJs(session, customParam);
			}
			return null;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new RuntimeException(ex);
		}
	}

	private HashMap<String, Object> generateJs(INcpSession session, JSONObject customParam) throws Exception{
		String sheetId = customParam.getString("sheetId");	 
		Sheet sheet = sheetCollection.reloadSheetFromDB(sheetId);		
		String jsFilePath = ContextUtil.getAbsolutePath() +  NovaCloudState.DATA_MODEL_PATH_OF_SHEET  + sheet.getName() + ".js";
		List<String> errors = this.validateSheetModel(sheet);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		if(errors.size() == 0) {
			this.generateJsBySheet(sheet, jsFilePath);		 
			resultMap.put("succeed", "true");
		}
		else { 		
			resultMap.put("succeed", "false");	
			resultMap.put("errors", errors);
		}
		return resultMap;
	}
	
	private List<String> validateSheetModel(Sheet sheet){
		List<String> errors = new ArrayList<String>(); 
		 		 
		HashMap<String, SheetPart> sheetParts = sheet.getSheetParts();
		SheetPart mainSheetPart = null;
		for(String name : sheetParts.keySet()){
			SheetPart sheetPart = sheetParts.get(name);
			if(sheetPart.getParentPartName() != null && !sheetPart.getParentPartName().isEmpty()){
				if(mainSheetPart != null){
					errors.add("只准指定一个顶级组成部分, 即只准有一个组成部分的上级组成部分为空.");
				}
			}
			List<String> parentNames = new ArrayList<String>();
			SheetPart tempPart = sheetPart;
			String parentName = sheetPart.getParentPartName();
			while(parentName!= null && !parentName.isEmpty()){
				if(parentNames.contains(parentName)){
					errors.add("查找上级组成部分时，发现构成了环形.");
					break;
				}
				else{
					parentNames.add(parentName);
					tempPart = sheet.getSheetPart(parentName);
					if(tempPart == null){
						errors.add("不存在名为 " + parentName + " 的组成部分, 不能指定 " + parentName + " 为上级组成部分.");
						break;
					}
					else{
						parentName = tempPart.getParentPartName();
					}
				}
			}
		}
		for(String name : sheetParts.keySet()){
			SheetPart sheetPart = sheetParts.get(name);
			View view = ViewCollection.getView(sheetPart.getViewName());
			if(view == null){
				errors.add("视图模型 " + sheetPart.getViewName() + " 不存在.");
			}
			else{
				Data data = DataCollection.getData(view.getDataName());
				if(data == null){
					errors.add("视图模型 " + sheetPart.getViewName() + " 对应的数据模型 " + view.getDataName() + " 不存在.");
				}
				else{
					DataField labelField = data.getDataField(sheetPart.getLabelField());
					if(labelField == null){
						errors.add("数据模型 " + data.getName() + " 中不存在名为 " + sheetPart.getLabelField() + " 的字段");
					}
					if(sheetPart.getParentPartName() != null && !sheetPart.getParentPartName().isEmpty()){ 
						DataField parentPointerField = data.getDataField(sheetPart.getParentPointerField());
						if(parentPointerField == null){
							errors.add("数据模型 " + data.getName() + " 中不存在名为 " + sheetPart.getParentPointerField() + " 的字段");
						} 
						else{
							if(parentPointerField.getValueType() !=ValueType.String){
								errors.add("上级外键字段 " + parentPointerField.getName() + " 必须为字符串类型.");
							}
						}
					}
				}
			}
		}
		return errors;
	}	
	
	private void generateJsBySheet(Sheet sheet, String jsFilePath) throws Exception{  
		StringBuilder jsStr = new StringBuilder("sheetModels." + sheet.getName() + " = {\r\n");
		jsStr.append("  id:\"" + sheet.getId() + "\",\r\n");
		jsStr.append("  name:\"" + sheet.getName() + "\",\r\n"); 
		jsStr.append("  parts:{\r\n");
		int partCount = sheet.getSheetParts().size();
		int i = 0;
		for(String partName : sheet.getSheetParts().keySet()){
			i++;
			SheetPart part = sheet.getSheetPart(partName);  
			jsStr.append("    " + partName + ":{"); 
			jsStr.append("name:\"" + part.getName() + "\",");
			jsStr.append("view:\"" + part.getViewName() + "\",");
			jsStr.append("labelField:\"" + part.getLabelField() + "\","); 
			jsStr.append("parentPartName:\"" + (part.getParentPartName()==null|| part.getParentPartName().isEmpty() ? "" : part.getParentPartName()) + "\","); 
			jsStr.append("parentPointerField:\"" + part.getParentPointerField() + "\""); 
			jsStr.append("}" + (i == partCount ? "\r\n" : ",\r\n"));	 
		} 
		
		jsStr.append("  }\r\n");  
		jsStr.append("}\r\n");

		/*
		for(String partName : sheet.getSheetParts().keySet()){ 
			SheetPart part = sheet.getSheetPart(partName);  
			View view = viewCollection.getView(part.getView());
			jsStr.append("document.writeln(\"<script type=\\\"text/javascript\\\" src=\\\"../../js/data/" + view.getDataName() + ".js\\\" />\");\r\n");
			jsStr.append("document.writeln(\"<script type=\\\"text/javascript\\\" src=\\\"../../js/view/" + view.getName() + ".js\\\" />\");\r\n");
		}
		*/
		
		FileOperate fileOperate = new FileOperate();
		fileOperate.createFile(jsFilePath, jsStr.toString());
	} 
}
