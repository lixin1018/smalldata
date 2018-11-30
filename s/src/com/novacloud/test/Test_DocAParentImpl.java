package com.novacloud.test;
  
import java.util.HashMap;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.sys.MultiSelectChildValueProcessor;
import net.sf.json.JSONObject;  

//测试，父子表数据的查询、保存、删除，子表以多选方式在父表界面中显示和编辑 added by lixin 20181130
public class Test_DocAParentImpl extends DataBaseDao {
  
	private MultiSelectChildValueProcessor multiSelectChildValueProcessor; 
	public void setMultiSelectChildValueProcessor(MultiSelectChildValueProcessor multiSelectChildValueProcessor) {
		this.multiSelectChildValueProcessor = multiSelectChildValueProcessor;
	}  

	//删除时，在删除父表记录前，先删除对应的子表记录
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

		String childDataName4 = "test_DocAChild4";
		String parentIdFieldName4 = "parentid"; 
		multiSelectChildValueProcessor.DeleteMultiSelectChildValues(this.getDBSession(), requestObj, childDataName4, parentIdFieldName4);
	}

	//保存时，在保存父表记录后，再将本次提交的子表信息保存到数据库中
	@Override
	protected void afterSave(INcpSession session, JSONObject requestObj, HashMap<String,Object> resultHash) throws Exception{		
		String childDataName1 = "test_DocAChild1";
		String parentIdFieldName1 = "parentid";
		//子表中的字段name存储下拉看到的值
		String valueFieldName1 = "name";
		String parentDataName1 = "test_DocAParent";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName1, parentDataName1, parentIdFieldName1, valueFieldName1);
		
		String childDataName2 = "test_DocAChild2";
		String parentIdFieldName2 = "parentid";
		//子表的Data模型中，字段typename设置了下拉，但是字段typename在数据库中存在，字段typeid用来存储下拉数据的Id值
		String valueFieldName2 = "typeid";
		String parentDataName2 = "test_DocAParent";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName2, parentDataName2, parentIdFieldName2, valueFieldName2);
		
		String childDataName3 = "test_DocAChild3";
		String parentIdFieldName3 = "parentid";
		String valueFieldName3 = "name";
		String parentDataName3 = "test_DocAParent";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName3, parentDataName3, parentIdFieldName3, valueFieldName3);

		String childDataName4 = "test_DocAChild4";
		String parentIdFieldName4 = "parentid";
		//子表的Data模型中，字段typename设置了弹出，但是字段typename在数据库中存在，字段typeid用来存储下拉数据的Id值
		String valueFieldName4 = "typeid";
		String parentDataName4 = "test_DocAParent";
		multiSelectChildValueProcessor.SaveMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName4, parentDataName4, parentIdFieldName4, valueFieldName4);
	}

	//查询时，在获取到父表记录后，再将对应的子表记录信息获取到，并返回给客户端
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
		
		String childDataName4 = "test_DocAChild4";
		String parentIdFieldName4 = "parentid";
		String valueFieldName4 = "typename";
		String foreignKeyFieldName4 = "typeid";
		String parentDataIdFieldName4 = "id";		
		multiSelectChildValueProcessor.GetMultiSelectChildValues(this.getDBSession(), requestObj, resultHash, childDataName4, parentIdFieldName4, valueFieldName4, foreignKeyFieldName4, parentDataIdFieldName4);
	}
}