package com.novacloud.test;
  
import java.util.HashMap;  
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.sys.MultiSelectChildValueProcessor; 

//测试父子表，子表以多选方式在父表界面中编辑保存  added by lixin 20181127
public class Test_DocAParentImpl extends DataBaseDao {
  
	private MultiSelectChildValueProcessor multiSelectChildValueProcessor; 
	public void setMultiSelectChildValueProcessor(MultiSelectChildValueProcessor multiSelectChildValueProcessor) {
		this.multiSelectChildValueProcessor = multiSelectChildValueProcessor;
	}  
	
	@Override
	protected void beforeDelete(INcpSession session, JSONObject requestObj) throws Exception{
		String childDataName1 = "test_DocAChild1";
		String parentIdFieldName1 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName1, parentIdFieldName1);

		String childDataName2 = "test_DocAChild2";
		String parentIdFieldName2 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName2, parentIdFieldName2);

		String childDataName3 = "test_DocAChild3";
		String parentIdFieldName3 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName3, parentIdFieldName3);
	}
	
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{		
		String childDataName1 = "test_DocAChild1";
		String parentIdFieldName1 = "parentid";
		String valueFieldName1 = "name";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName1, parentIdFieldName1, valueFieldName1);
		
		String childDataName2 = "test_DocAChild2";
		String parentIdFieldName2 = "parentid";
		String valueFieldName2 = "typeid";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName2, parentIdFieldName2, valueFieldName2);
		
		String childDataName3 = "test_DocAChild3";
		String parentIdFieldName3 = "parentid";
		String valueFieldName3 = "name";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName3, parentIdFieldName3, valueFieldName3);
	}
	
	@Override
	protected void afterSelect(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{
		String childDataName1 = "test_DocAChild1";
		String parentIdFieldName1 = "parentid";
		String valueFieldName1 = "name";
		String parentDataIdFieldName1 = "id";
		multiSelectChildValueProcessor.GetMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName1, parentIdFieldName1, valueFieldName1, "", parentDataIdFieldName1);
		
		String childDataName2 = "test_DocAChild2";
		String parentIdFieldName2 = "parentid";
		String valueFieldName2 = "typename";
		String foreignKeyFieldName2 = "typeid";
		String parentDataIdFieldName2 = "id";		
		multiSelectChildValueProcessor.GetMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName2, parentIdFieldName2, valueFieldName2, foreignKeyFieldName2, parentDataIdFieldName2);
		
		String childDataName3 = "test_DocAChild3";
		String parentIdFieldName3 = "parentid";
		String valueFieldName3 = "name";
		String parentDataIdFieldName3 = "id";		
		multiSelectChildValueProcessor.GetMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName3, parentIdFieldName3, valueFieldName3, "", parentDataIdFieldName3);
	}
}