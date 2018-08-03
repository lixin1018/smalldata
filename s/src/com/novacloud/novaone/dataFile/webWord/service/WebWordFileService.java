package com.novacloud.novaone.dataFile.webWord.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.dataFile.service.FileBaseService;
import com.novacloud.novaone.dataFile.webExcel.WebExcelFileProcessor;
import com.novacloud.novaone.dataFile.webWord.WebWordFileProcessor;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.opensymphony.xwork2.ActionSupport;
  
 //WebWord文件服务
public class WebWordFileService extends FileBaseService implements IWebWordFileService {

	 
	public WebWordFileProcessor getWebWordFileProcessor(){
		return (WebWordFileProcessor)this.getFileBaseProcessor();
	}
	
	//生成Word文件的预览文件
	public String createPreviewFile(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String accessoryId = requestObj.getString("aid");   

			dbSession = this.openDBSession(); 
			this.getWebWordFileProcessor().setDBSession(dbSession);
			
			String fileId = this.getWebWordFileProcessor().createPreviewFile(session, accessoryId); 
			 
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("fileId", fileId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("createPreviewFile", "生成Word文件的预览文件失败.", ex);
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
