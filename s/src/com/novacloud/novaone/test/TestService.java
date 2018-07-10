package com.novacloud.novaone.test;
  
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; 
import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.Org;
import com.novacloud.novaone.dao.sys.Role;
import com.novacloud.novaone.importExport.commonFunction.TextProcessor;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport; 

//@WebService  
//@SOAPBinding(style = Style.RPC)
public class TestService extends NcpActionSupport {
  	private static Logger logger=Logger.getLogger(TestService.class); 
	//DBParserAccess
	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
	}  
	 
	public String testRegex(){  
		Session dbSession = null;
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String text = CommonFunction.decode(requestObj.getString("text"));
			String regTxt = CommonFunction.decode(requestObj.getString("regTxt"));
			
			TextProcessor tp = new TextProcessor(); 
			tp.splitAndReplaceByRegex(text, regTxt, "(\\s)", " ");
						
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("info", "成功.");
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			
			this.addResponse(resultString); 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("testRegex", "testRegex", ex); 
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
