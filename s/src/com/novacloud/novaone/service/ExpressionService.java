package com.novacloud.novaone.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.expression.definition.ExpCommonValueType;
import com.novacloud.novaone.expression.definition.Parameter;
import com.novacloud.novaone.expression.definition.RunAt;
import com.novacloud.novaone.expression.definition.ValidateResult;
import com.novacloud.novaone.expression.definition.Validator;
import com.novacloud.novaone.expression.run.RunResult;
import com.novacloud.novaone.expression.run.Runner;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ExpressionService  extends NcpActionSupport {

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
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			RunAt runAt = RunAt.valueOf(requestObj.getString("runAt"));
			List<Parameter> parameters = this.getUserParameters(requestObj);
 			ValidateResult result = expValidator.validateExp(expression, parameters, runAt, needResultType);
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",result.getSucceed());
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
	
	public String validateJsExp(){ 
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression")); 
			List<Parameter> parameters = this.getUserParameters(requestObj); 
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, parameters , RunAt.Js, needResultType);
			Date dt2 = new Date(); 
			String jsCode = validateResult.getSucceed()? expValidator.toJsCode(validateResult):"";
			Date dt3 = new Date();
			double timespan1 = dt2.getTime() - dt1.getTime();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",validateResult.getSucceed());
			resultHash.put("validateErrors", validateResult.getErrors()); 
			resultHash.put("jsCode", CommonFunction.encode(jsCode));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate js expression", "验证js表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
	
	private List<Parameter> getUserParameters(JSONObject requestObj) throws Exception{ 
		if(requestObj.containsKey("userParameters")){
			List<Parameter> parameters = new ArrayList<Parameter>();
			JSONArray parameterJsons = requestObj.getJSONArray("userParameters");
			for(int i=0;i<parameterJsons.size();i++){
				JSONObject parameterJson = parameterJsons.getJSONObject(i);
				Parameter parameter = new Parameter();
				
				String name = parameterJson.getString("name");
				parameter.setName(name);

				String valueType = parameterJson.getString("valueType");  
				String runtimeValueType = ExpCommonValueType.getRuntimeValueType(valueType);
				parameter.setValueType(runtimeValueType);
				
				parameters.add(parameter);
			}
			return parameters;
		}
		else{
			return null;
		}
	}

	public String runExp(){ 
		Session dbSession = null;
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression"));  
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			RunAt runAt = RunAt.valueOf(requestObj.getString("runAt"));
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, null, runAt, needResultType);
			Date dt2 = new Date();
			HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager");  
			dbSession = transactionManager.getSessionFactory().openSession();			
 			RunResult runResult = expRunner.runExp(validateResult, null, dbSession);
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
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
		return ActionSupport.SUCCESS;
	}
	
	public String generateFunctionListJs(){
		try{  
			//输入参数
			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);  
			String expression = CommonFunction.decode(requestObj.getString("expression")); 
			String needResultType = requestObj.containsKey("needResultType") ? requestObj.getString("needResultType") : null; 
			List<Parameter> parameters = this.getUserParameters(requestObj); 
			Date dt1 = new Date();
 			ValidateResult validateResult = expValidator.validateExp(expression, parameters , RunAt.Js, needResultType);
			Date dt2 = new Date(); 
			String jsCode = validateResult.getSucceed()? expValidator.toJsCode(validateResult):"";
			Date dt3 = new Date();
			double timespan1 = dt2.getTime() - dt1.getTime();
			double timespan2 = dt3.getTime() - dt2.getTime();
			HashMap<String, Object> resultHash = new HashMap<String, Object>();
			resultHash.put("succeed",validateResult.getSucceed());
			resultHash.put("validateErrors", validateResult.getErrors()); 
			resultHash.put("jsCode", CommonFunction.encode(jsCode));
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
			this.addResponse(resultString);	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("validate js expression", "验证js表达式失败", ex);
			this.addResponse(ncpEx.toJsonString());
		} 	 
		return ActionSupport.SUCCESS;
	}
}
