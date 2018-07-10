package com.novacloud.shuShuo;
 
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.dao.system.D_User;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DocType;
import com.novacloud.novaone.model.sysmodel.Sheet;
import com.novacloud.novaone.model.sysmodel.SheetCollection;
import com.novacloud.novaone.model.sysmodel.SheetPart;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;
 
public class SS_PlayImpl extends DataBaseDao {
	
	//根据json获取数据
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	
	@Override
	protected void beforeSave(INcpSession session, JSONObject requestObj) throws Exception{
	    //新增	    
	    JSONObject insertRowsObj = requestObj.getJSONObject("insert"); 
	    int insertRowCount = insertRowsObj.size();
	    Object[] insertRowIds = insertRowsObj.keySet().toArray();
	    for(int i = 0;i < insertRowCount; i++){	    	
	    	String insertRowId = (String)insertRowIds[i];
	    	JSONObject insertRowObj = insertRowsObj.getJSONObject(insertRowId);  
	    	
	    	Date dt = new Date();
	    	String createTime = ValueConverter.convertToString(dt, ValueType.Time);
	    	insertRowObj.put("createtime", createTime); 
	    } 
	}
}
