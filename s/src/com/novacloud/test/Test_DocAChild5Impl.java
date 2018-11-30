package com.novacloud.test;
  
import java.util.HashMap;  
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.sys.MultiSelectChildValueProcessor; 

//测试，父子表数据的查询、保存、删除，子表以多选方式在父表界面中显示和编辑 added by lixin 20181130
//表Test_DocAChild5是表Test_DocAChild5_1的父表，但同时是Test_DocAParent的子表
public class Test_DocAChild5Impl extends DataBaseDao {
  
	private MultiSelectChildValueProcessor multiSelectChildValueProcessor; 
	public void setMultiSelectChildValueProcessor(MultiSelectChildValueProcessor multiSelectChildValueProcessor) {
		this.multiSelectChildValueProcessor = multiSelectChildValueProcessor;
	}  
	
	//删除时，在删除父表记录前，先删除对应的子表记录
	@Override
	protected void beforeDelete(INcpSession session, JSONObject requestObj) throws Exception{
		String childDataName5_1 = "test_DocAChild5_1";
		String parentIdFieldName5_1 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName5_1, parentIdFieldName5_1);
	}

	//保存时，在保存父表记录后，再将本次提交的子表信息保存到数据库中
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{		
		String childDataName5_1 = "test_DocAChild5_1";
		String parentIdFieldName5_1 = "parentid";
		String valueFieldName5_1 = "typeid";
		String parentDataName5_1 = "test_DocAChild5";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName5_1, parentDataName5_1, parentIdFieldName5_1, valueFieldName5_1);
	}

	//查询时，在获取到父表记录后，再将对应的子表记录信息获取到，并返回给客户端
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