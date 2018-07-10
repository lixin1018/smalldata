package com.novacloud.novaone.dataFile.webExcel.service;

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
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.opensymphony.xwork2.ActionSupport;
  
 //WebExcel文件服务
public class WebExcelFileService extends FileBaseService implements IWebExcelFileService {

	 
	public WebExcelFileProcessor getEWebExcelFileProcessor(){
		return (WebExcelFileProcessor)this.getFileBaseProcessor();
	}
	
	//获取Excel文件的所有sheet页名称
	public String getExcelSheetNames(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			 
			String accessoryId = requestObj.getString("accessoryId");   

			dbSession = this.openDBSession(); 
			this.getEWebExcelFileProcessor().setDBSession(dbSession);
			
			List<String> allSheetNames = this.getEWebExcelFileProcessor().getExcelSheetNames(session, accessoryId); 
			
			JSONArray sheetNameArray = new JSONArray(); 
			for(String sheetName : allSheetNames){
				sheetName = CommonFunction.encode(sheetName);
				sheetNameArray.add(sheetName); 
			}
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("sheetNames", sheetNameArray);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getExcelSheetNames", "获取Excel文件的所有sheet页名称失败.", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}


	//验证上传的excel文件的sheet页内容是否合法
	public String validateAndGenerateByUploadExcel(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 

			String accessoryId = requestObj.getString("accessoryId"); 
			String dirId = requestObj.containsKey("dirId") ? requestObj.getString("dirId") : null; 
			JSONArray sheetNameArray = requestObj.getJSONArray("sheetNames");
			List<String> sheetNames = new ArrayList<String>();
			for(int i = 0; i < sheetNameArray.size(); i++){
				sheetNames.add(sheetNameArray.getString(i));
			}

			dbSession = this.openDBSession(); 
			this.getEWebExcelFileProcessor().setDBSession(dbSession);
			
			String fileId = this.getEWebExcelFileProcessor().validateAndGenerateByUploadExcel(session, dirId, accessoryId, sheetNames); 
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("fileId", fileId);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);
		}
		catch(NcpException ex) {
             	ex.printStackTrace(); 
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validateUploadExcel", "验证上传的excel文件的sheet页内容失败", ex);
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
