package com.novacloud.novaone.expression.test;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;

import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.expression.definition.Parameter;
import com.novacloud.novaone.expression.definition.RunAt;
import com.novacloud.novaone.expression.definition.ValidateResult;
import com.novacloud.novaone.expression.definition.Validator;
import com.novacloud.novaone.expression.run.RunResult;
import com.novacloud.novaone.expression.run.Runner;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONObject;

public class TestExpression  extends NcpActionSupport {

	private Validator expValidator = null;
	public void setExpValidator(Validator expValidator){
		this.expValidator = expValidator;
	}

	private Runner expRunner = null;
	public void setExpRunner(Runner expRunner){
		this.expRunner = expRunner;
	}
	
	public String validateExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));  
 			ValidateResult result = expValidator.validateExp(expression, null, RunAt.Server, "");
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("info",result.getSucceed() ? "验证通过." : "验证不通过");
			resultHash.put("errors", result.getErrors());
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate expression", "验证表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
	
	public String runExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));  
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, null, RunAt.Server, "");
			Date dt2 = new Date();
 			RunResult runResult = expRunner.runExp(validateResult, null, null);
			Date dt3 = new Date();
			double timespan1 = dt2.getTime() - dt1.getTime();
			double timespan2 = dt3.getTime() - dt2.getTime();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed", runResult.getSucceed()?"true":"false");
			resultHash.put("info", !runResult.getSucceed() || runResult.getValue()==null ? "" : runResult.getValue().toString()); 
			resultHash.put("runError", runResult.getError());		
			resultHash.put("validateErrors", validateResult.getErrors());
			resultHash.put("timespan1", timespan1);
			resultHash.put("timespan2", timespan2);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("run expression", "运行表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
	
	public String validateJsExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));  
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, null, RunAt.Js, "");
			Date dt2 = new Date(); 
			String jsCode = expValidator.toJsCode(validateResult);
			Date dt3 = new Date();
			double timespan1 = dt2.getTime() - dt1.getTime();
			double timespan2 = dt3.getTime() - dt2.getTime();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("validateErrors", validateResult.getErrors());
			resultHash.put("timespan1", timespan1);
			resultHash.put("timespan2", timespan2);
			resultHash.put("jsCode", CommonFunction.encode(jsCode));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("run expression", "运行表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
}
