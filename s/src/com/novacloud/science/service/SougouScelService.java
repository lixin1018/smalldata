package com.novacloud.science.service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.ArrayList;
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
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.model.sysmodel.DataField;
import com.novacloud.novaone.workflow.definition.IWorkflowDefineDao;
import com.novacloud.novaone.workflow.definition.Wf_Workflow;
import com.novacloud.science.words.ParseSogo;
import com.opensymphony.xwork2.ActionSupport;
 
public class SougouScelService extends NcpActionSupport implements ISougouScelService{
  
	@Override
	public String convertToTxt(){
		Session dbSession = null;
		try
		{
			NcpSession session = new NcpSession(this.getHttpSession(), true);
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam); 
			String fromFilePath = requestObj.getString("fromFilePath");
			String toFilePath = requestObj.getString("toFilePath");
			 
			try{ 
				ParseSogo ps = new ParseSogo();
				 
				File f = new File(fromFilePath);
				File[] childFiles = f.listFiles();
				List<String> errors = new ArrayList<String>();
				for(int i = 0; i < childFiles.length; i++) {
					File childFile = childFiles[i];
					String fromPath = childFile.getAbsolutePath();
					String toPath = toFilePath + "/" + childFile.getName() + ".txt";
					File toFileObj = new File(toPath);
					if(!toFileObj.exists()){
						try {						
							ps.sogou(fromPath, toPath, false);
						}
						catch(Exception ex){
							errors.add(ex.getMessage());
						}
					}
				}
				
				if(errors.size() != 0){
					String errorString = CommonFunction.listToString(errors, "; ");
					throw new Exception(errorString);
				}
				
				HashMap<String, Object> resultHash = new HashMap<String, Object>();  
				String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
				this.addResponse(resultString);
			}
			catch(Exception e){
	        	e.printStackTrace();
 				HashMap<String, Object> resultHash = new HashMap<String, Object>();
				resultHash.put("succeed", false);
				resultHash.put("errorMessage", e.getMessage());
				String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
				this.addResponse(resultString);
			} 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("convertToText", "词库转换为txt失败", ex);
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