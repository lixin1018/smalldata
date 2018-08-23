package com.novacloud.dataHelper.service;
 
import java.util.HashMap;

import org.hibernate.Session; 
 
import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor; 
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IDataBaseDao;
import com.novacloud.novaone.dao.sys.IParamWinBaseDao;
import com.novacloud.novaone.service.DataService;
import com.novacloud.novaone.service.ParamWinService;
import com.opensymphony.xwork2.ActionSupport;
  
public class ShareDataParamWinService extends ParamWinService{	 
	@Override
	public String getList() { 
		Session dbSession = null;
		try
		{
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			IParamWinBaseDao paramWinBaseDao = this.getParamWinDao(requestObj); 
			dbSession = this.openDBSession();
			paramWinBaseDao.setDBSession(dbSession);
			INcpSession session = new NcpSession(this.getHttpSession(), false);
			HashMap<String, Object> resultHash = paramWinBaseDao.getList(session, requestObj); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getList", "获取下拉数据未成功", ex);
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
