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
import com.novacloud.novaone.dao.system.Sys_Tree;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField; 
import com.novacloud.novaone.model.sysmodel.Tree;
import com.novacloud.novaone.model.sysmodel.TreeCollection;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;

public class Sys_TreeImpl extends DataBaseDao implements Sys_Tree {

	private TreeCollection treeCollection = null;
	public void setTreeCollection(TreeCollection treeCollection){
		this.treeCollection = treeCollection;
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
		String treeId = customParam.getString("treeId");	 
		Tree tree = treeCollection.reloadTreeFromDB(treeId);		
		String jsFilePath = ContextUtil.getAbsolutePath() + NovaCloudState.DATA_MODEL_PATH_OF_TREE + tree.getName() + ".js";
		List<String> errors = this.validateTreeModel(tree);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		if(errors.size() == 0) {
			this.generateJsByTree(tree, jsFilePath);		 
			resultMap.put("succeed", "true");
		}
		else { 		
			resultMap.put("succeed", "false");	
			resultMap.put("errors", errors);
		}
		return resultMap;
	}
	
	private List<String> validateTreeModel(Tree tree){
		List<String> errors = new ArrayList<String>(); 
		 		    
		View view = ViewCollection.getView(tree.getViewName());
		if(view == null){
			errors.add("视图模型 " + tree.getViewName() + " 不存在.");
		}
		else{
			Data data = DataCollection.getData(view.getDataName());
			if(data == null){
				errors.add("视图模型 " + tree.getViewName() + " 对应的数据模型 " + view.getDataName() + " 不存在.");
			}
			else{
				DataField labelField = data.getDataField(tree.getLabelField());
				if(labelField == null){
					errors.add("数据模型 " + data.getName() + " 中不存在名为 " + tree.getLabelField() + " 的字段");
				}
				DataField parentPointerField = data.getDataField(tree.getParentPointerField());
				if(parentPointerField == null){
					errors.add("数据模型 " + data.getName() + " 中不存在名为 " + tree.getParentPointerField() + " 的字段");
				} 
				else{
					if(parentPointerField.getValueType() !=ValueType.String){
						errors.add("上级外键字段 " + parentPointerField.getName() + " 必须为字符串类型.");
					}
				}
				DataField isLeafField = data.getDataField(tree.getIsLeafField());
				if(isLeafField == null){
					errors.add("数据模型 " + data.getName() + " 中不存在名为 " + tree.getIsLeafField() + " 的字段");
				} 
				else{
					if(isLeafField.getValueType() !=ValueType.Boolean){
						errors.add("叶节点标示字段 " + isLeafField.getName() + " 必须为布尔类型.");
					}
				}
				String sortFieldName = tree.getSortField();
				if(sortFieldName == null || sortFieldName.isEmpty()){
					DataField sortField = data.getDataField(tree.getSortField());
					if(sortField == null){
						errors.add("数据模型 " + data.getName() + " 中不存在名为 " + tree.getSortField() + " 的字段");
					}
				}
			}
		}
		return errors;
	}	
	
	private void generateJsByTree(Tree tree, String jsFilePath) throws Exception{  

		StringBuilder jsStr = new StringBuilder("treeModels." + tree.getName() + " = {\r\n");
		jsStr.append("  id:\"" + tree.getId() + "\",\r\n");
		jsStr.append("  name:\"" + tree.getName() + "\",\r\n"); 
		jsStr.append("  view:\"" + tree.getViewName() + "\",\r\n");  
		jsStr.append("  labelField:\"" + tree.getLabelField() + "\",\r\n");   
		jsStr.append("  parentPointerField:\"" + tree.getParentPointerField() + "\",\r\n");   
		jsStr.append("  isLeafField:\"" + tree.getIsLeafField() + "\",\r\n");   
		jsStr.append("  sortField:\"" + tree.getSortField() + "\"\r\n");   
		jsStr.append("}\r\n");
		
		FileOperate fileOperate = new FileOperate();
		fileOperate.createFile(jsFilePath, jsStr.toString());
	} 
}
