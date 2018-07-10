package com.novacloud.novaone.dao.system.impl;
  
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.Sys_View;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField; 
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;
import com.novacloud.novaone.model.sysmodel.ViewDispunit; 

public class Sys_ViewImpl extends DataBaseDao implements Sys_View {

	private ViewCollection viewCollection = null;
	public void setViewCollection(ViewCollection viewCollection){
		this.viewCollection = viewCollection;
	} 
		
	@Override 
	public HashMap<String, Object> doOtherAction(INcpSession session, JSONObject requestObj) throws RuntimeException{
		try{
			String actionName = requestObj.getString("actionName");
			JSONObject customParam = requestObj.getJSONObject("customParam");
			if("generateJs".equals(actionName)){
				return generateJs(session, customParam);
			}
			else if("generatePopPage".equals(actionName)){
				return generatePopPage(session, customParam);
			}
			return null;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new RuntimeException(ex);
		}
	}
	//生成弹出所用的view的页面
	//TODO: 现在还未自成生成，现在是手工操作
	private HashMap<String, Object> generatePopPage(INcpSession session, JSONObject customParam) throws Exception{
		String viewId = customParam.getString("viewId");	 
		View view = viewCollection.reloadViewFromDB(viewId);		
		String modelPageFilePath = ContextUtil.getAbsolutePath() + "\\page\\pop\\viewPageModel.jsp";
		String pageFilePath = ContextUtil.getAbsolutePath() + "\\page\\pop\\" + view.getName() + "_View.js";
		HashMap<String, List<String>> msgs = this.validateViewModel(view);
		List<String> errors = msgs.get("errors");
		List<String> warnings = msgs.get("warnings");
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		if(errors.size() == 0) {
			this.generatePopPageByView(view, modelPageFilePath, pageFilePath);		 
			resultMap.put("succeed", "true");
			resultMap.put("warnings", warnings);
		}
		else { 		
			resultMap.put("succeed", "false");	
			resultMap.put("errors", errors);
			resultMap.put("warnings", warnings);
		}
		return resultMap;		
	}
	
	private void generatePopPageByView(View view, String modelPageFilePath, String pageFilePath) throws Exception{
		StringBuilder pageStr = new StringBuilder();
		
		FileOperate fileOperate = new FileOperate();
		fileOperate.createFile(pageFilePath, pageStr.toString());
	} 
	//根据view的定义，生成前端需要的js
	private HashMap<String, Object> generateJs(INcpSession session, JSONObject customParam) throws Exception{
		String viewId =  customParam.getString("viewId");	 
		View view = viewCollection.reloadViewFromDB(viewId);		
		HashMap<String, List<String>> msgs = this.validateViewModel(view);
		List<String> errors = msgs.get("errors");
		List<String> warnings = msgs.get("warnings");
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		if(errors.size() == 0) {
			generateJsByView(view);
			resultMap.put("succeed", "true");
			resultMap.put("warnings", warnings);
		}
		else { 		
			resultMap.put("succeed", "false");
			resultMap.put("errors", errors);
			resultMap.put("warnings", warnings);
		}
		return resultMap;
	}
	
	private HashMap<String, List<String>> validateViewModel(View view){
		List<String> errors = new ArrayList<String>(); 
		List<String> warnings = new ArrayList<String>(); 
		
		Data data = DataCollection.getData(view.getDataName());
		if(data == null){
			errors.add("不存在名为 " + view.getDataName() + " 的数据模型.");		
		}
		else {
			HashMap<String, ViewDispunit> dispunits = view.getDispunits();
			for(String fieldName : dispunits.keySet()){
				DataField df = data.getDataField(fieldName);
				if(df == null){
					warnings.add("数据模型 " + data.getName() + " 中不存在名为 " + fieldName + " 的字段");
				}
			} 
		}
		HashMap<String, List<String>> msgHash = new HashMap<String, List<String>>();
		msgHash.put("errors", errors);
		msgHash.put("warnings", warnings);
		return msgHash;
	}	
	
	public static void generateJsByView(View view) throws Exception{
		String jsFilePath = ContextUtil.getAbsolutePath() + NovaCloudState.DATA_MODEL_PATH_OF_VIEW + view.getName() + ".js";
		generateJsByView(view, jsFilePath);
	}	
	
	private static void generateJsByView(View view, String jsFilePath) throws Exception{ 
		Data data = DataCollection.getData(view.getDataName());
		//ViewCollection viewCollection = (DownListCollection)ContextUtil.getBean("viewCollection"); 
		int dispunitCount = view.getDispunits().size();
		List<ViewDispunit> dispunitList = new ArrayList<ViewDispunit>();

		for(ViewDispunit dispunit : view.getDispunits().values()){ 
			for(int j=0;j<=dispunitList.size();j++){
				if(j==dispunitList.size()){
					dispunitList.add(dispunit);
					break;
				}
				else if(dispunitList.get(j).getColIndex() > dispunit.getColIndex()){
					dispunitList.add(j, dispunit);
					break;
				}
			}
		} 
		StringBuilder colModelStr = new StringBuilder();
		StringBuilder dispUnitModelStr = new StringBuilder();
		
		//增加多选列
  
		colModelStr.append("    {"); 
		colModelStr.append("name:\"ncpRowSelect\", ");
		colModelStr.append("label:\" \", ");
		colModelStr.append("width:20, ");
		colModelStr.append("hidden:false, ");	
		colModelStr.append("sortable:false, ");	
		colModelStr.append("search:false, ");	
		colModelStr.append("resizable:false, ");	
		colModelStr.append("editable:false, ");	
		colModelStr.append("canEdit:false, ");	
		colModelStr.append("nullable:true, ");	
		colModelStr.append("edittype:\"checkbox\", ");
		colModelStr.append("dispunitType:\"checkbox\"");
		colModelStr.append("},\r\n"); 
		
		//循环所有显示域
		for(int i = 0;i<dispunitCount;i++){
			ViewDispunit dispunit = dispunitList.get(i);
			DataField field = data.getDataField(dispunit.getName());
			String editType = "";
			String dispunitType = "";
			if(field != null){
				switch(field.getValueType()){
					case String:
						editType = "text";
						dispunitType = "text";
						break;
					case Decimal:
						editType = "text";
						dispunitType = "decimal";
						break;
					case Date:
						editType = "text";
						dispunitType = "date";
						break;
					case Time:
						editType = "text";
						dispunitType = "time";
						break;
					case Boolean:
						editType = "checkbox";
						dispunitType = "checkbox";
						break;
					default:
						break;
				}
				if("list".equals(field.getInputHelpType())){
					dispunitType = "list";
				}
				if("pop".equals(field.getInputHelpType())){
					dispunitType = "pop";
				}
			}

			colModelStr.append("    {"); 
			colModelStr.append("name:\"" + dispunit.getName() + "\", ");
			colModelStr.append("label:\"" + dispunit.getLabel() + "\", ");
			colModelStr.append("width:" + dispunit.getColWidth() + ", ");
			colModelStr.append("hidden:" + !dispunit.getColVisible() + ", ");	
			colModelStr.append("sortable:" + dispunit.getColSortable() + ", ");	
			colModelStr.append("search:" + dispunit.getColSearch() + ", ");	
			colModelStr.append("resizable:" + dispunit.getColResizable() + ", ");	
			colModelStr.append("editable:true, ");	
			colModelStr.append("canEdit:" + dispunit.getEditable() + ", ");	
			colModelStr.append("nullable:" + dispunit.getNullable()+ ", ");	
			colModelStr.append("edittype:\"" + editType + "\", ");

			if(field != null){
				switch(field.getValueType()){
				
					case Date:
						colModelStr.append("formatter:dateFormater, ");
						break;
					case Time:
						colModelStr.append("formatter:timeFormater, ");
						break;
					default:
						break;			
				}
			}
			
			colModelStr.append("dispunitType:\"" + dispunitType + "\"");
			colModelStr.append("}" + (i == dispunitCount-1 ? "\r\n" : ",\r\n"));	

			dispUnitModelStr.append("    {"); 
			dispUnitModelStr.append("name:\"" + dispunit.getName() + "\", ");
			dispUnitModelStr.append("label:\"" + dispunit.getLabel() + "\", "); 	
			dispUnitModelStr.append("editable:" + dispunit.getEditable() + ","); 
			dispUnitModelStr.append("nullable:" + dispunit.getNullable()+ ", ");	
			dispUnitModelStr.append("hidden:" + !dispunit.getColVisible() + ", ");	
			dispUnitModelStr.append("dispunitType:\"" + dispunitType + "\", ");
			dispUnitModelStr.append("}" + (i == dispunitCount-1 ? "\r\n" : ",\r\n"));	
		}
		StringBuilder jsStr = new StringBuilder("viewModels." + view.getName() + " = {\r\n");
		jsStr.append("  id:\"" + view.getId() + "\",\r\n");
		jsStr.append("  name:\"" + view.getName() + "\",\r\n"); 
		jsStr.append("  dataName:\"" + view.getDataName() + "\",\r\n"); 
		jsStr.append("  colModel:[\r\n");
		jsStr.append(colModelStr.toString()); 
		jsStr.append("  ],\r\n"); 
		jsStr.append("  dispUnitModel:[\r\n");
		jsStr.append(dispUnitModelStr.toString()); 
		jsStr.append("  ]\r\n"); 
		jsStr.append("}\r\n");
		
		//jsStr.append("document.writeln(\"<script type=\\\"text/javascript\\\" src=\\\"../../js/data/" + view.getDataName() + ".js\\\" />\");");
		
		FileOperate fileOperate = new FileOperate();
		fileOperate.createFile(jsFilePath, jsStr.toString());
	} 
}
