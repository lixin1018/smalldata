package com.novacloud.novaone.dbDataProcess;
 
import java.util.HashMap; 

import org.hibernate.Session; 
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor; 
import com.novacloud.novaone.dataFile.service.FileBaseService; 
import com.opensymphony.xwork2.ActionSupport;
  
 //WebExcel文件服务
public class DbDataProcessService extends FileBaseService implements IDbDataProcessService {

	 
	public IDbDataProcessor getDbDataProcessor(){
		return (IDbDataProcessor)this.getFileBaseProcessor();
	}
	
	public String matchedPerson(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);   
			dbSession = this.openDBSession(); 
			this.getDbDataProcessor().setDBSession(dbSession);
			  
			
			//将数据都加载到内存里，然后匹配
			//将lastName、firstName、middleName都切分开（用空格、括号来切分），然后逐词匹配（左匹配），找到最合适的那个
			this.getDbDataProcessor().matchedPerson(session);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getMatchedPerson", "匹配人员成功.", ex);
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
