package com.novacloud.test;
  
import java.util.HashMap;  
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.sys.MultiSelectChildValueProcessor; 

//测试父子表，子表以多选方式在父表界面中编辑保存  added by lixin 20181127
public class Test_DocAChild5Impl extends DataBaseDao {
  
	private MultiSelectChildValueProcessor multiSelectChildValueProcessor; 
	public void setMultiSelectChildValueProcessor(MultiSelectChildValueProcessor multiSelectChildValueProcessor) {
		this.multiSelectChildValueProcessor = multiSelectChildValueProcessor;
	}  
	
	@Override
	protected void beforeDelete(INcpSession session, JSONObject requestObj) throws Exception{
		String childDataName5_1 = "test_DocAChild5_1";
		String parentIdFieldName5_1 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName5_1, parentIdFieldName5_1);
	}
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{		
		String childDataName5_1 = "test_DocAChild5_1";
		String parentIdFieldName5_1 = "parentid";
		String valueFieldName5_1 = "typeid";
		String parentDataName5_1 = "test_DocAChild5";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName5_1, parentDataName5_1, parentIdFieldName5_1, valueFieldName5_1);
	}
	
	@Override
	protected void afterSelect(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		String childDataName5_1 = "test_DocAChild5_1";
		String parentIdFieldName5_1 = "parentid";
		String valueFieldName5_1 = "typename";
		String foreignKeyFieldName5_1 = "typeid";
		String parentDataIdFieldName5_1 = "id";		
		multiSelectChildValueProcessor.GetMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName5_1, parentIdFieldName5_1, valueFieldName5_1, foreignKeyFieldName5_1, parentDataIdFieldName5_1);
	}
}