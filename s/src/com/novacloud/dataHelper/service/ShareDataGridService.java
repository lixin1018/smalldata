package com.novacloud.dataHelper.service;
 
import java.util.HashMap;

import org.hibernate.Session; 
 
import net.sf.json.JSONObject;  
import com.novacloud.novaone.common.JSONProcessor; 
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IDataBaseDao;
import com.novacloud.novaone.service.DataService;
import com.opensymphony.xwork2.ActionSupport;
  
public class ShareDataGridService extends DataService{ 
	
	//查询时，获取页码数，如果页码值>2，且没有登录，那么不允许在查看数据了。
	@Override
	public String select(){ 
		Session dbSession = null;
		try
		{ 
			
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);

			int currentPage = requestObj.getInt("currentPage"); 
			int pageSize = requestObj.getInt("pageSize");
			
			if(pageSize > 50){
				throw new Exception("单页数据过多.");
			}

			NcpSession session = null;
			if(currentPage > 2){
				//查看超过第三页的数据时，需要登录
				session = new NcpSession(this.getHttpSession(), true);
			}
			else{
				session = new NcpSession(this.getHttpSession(), false);
			}
			
			IDataBaseDao dataDao = this.getDataDao(requestObj); 
			dbSession = this.openDBSession();
			dataDao.setDBSession(dbSession); 
			HashMap<String, Object> resultHash = dataDao.select(session, requestObj);  
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
        	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}	 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("001", "查询数据未成功", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}	 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;	
	}
	
	private IDataBaseDao getDeaultDao(){
		IDataBaseDao dataDao = (IDataBaseDao)ContextUtil.getBean("shareDataBaseDao"); 
		return dataDao;
	}
	protected IDataBaseDao getDataDao(JSONObject requestObj){ 
		IDataBaseDao dataDao = null;
		if(requestObj.containsKey("dataName")){
			String dataName = requestObj.getString("dataName");
			dataDao = ContextUtil.containsBean(dataName) 
					? (IDataBaseDao)ContextUtil.getBean(dataName) 
					:  this.getDeaultDao(); ;
		}
		else{ 
			dataDao = this.getDeaultDao();
		}  
		return dataDao;
	} 
}
