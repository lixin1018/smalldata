package com.novacloud.novaone.schedule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.transaction.TransactionManager;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.expression.definition.IEnvironment;
import com.novacloud.novaone.expression.definition.RunAt;
import com.novacloud.novaone.expression.definition.ValidateResult;
import com.novacloud.novaone.expression.definition.Validator;
import com.novacloud.novaone.expression.run.IDatabaseAccess;
import com.novacloud.novaone.expression.run.RunResult;
import com.novacloud.novaone.expression.run.Runner;
import com.novacloud.novaone.expression.run.RuntimeUserParameter;
import net.sf.json.JSONObject;

//单个任务执行类
public class JobInstanceRunner implements Runnable {

	private static Logger logger=Logger.getLogger(JobInstanceRunner.class);

	private String jobInstanceId;
	private String jobId;
	private String runExp;
	private String runParameters;
	private HashMap<String, ValueType> fieldTypes = null;
	private List<RuntimeUserParameter> parameters = null;
	private IJobManager jobManager;

	public void setJobInstanceId(String jobInstanceId) {
		this.jobInstanceId = jobInstanceId;
	} 
	public String getJobInstanceId() {
		return jobInstanceId;
	} 

	public void setJobId(String jobId) {
		this.jobId = jobId;
	} 
	public String getJobId() {
		return jobId;
	} 

	public void setRunExp(String runExp) {
		this.runExp = runExp;
	} 
	public String getRunExp() {
		return runExp;
	} 

	public void setJobManager(IJobManager jobManager) {
		this.jobManager = jobManager;
	} 
	public IJobManager getJobManager() {
		return jobManager;
	} 

	public void setRunParameters(String runParameters) throws Exception {
		this.runParameters = runParameters;
		JSONObject jsonObj = JSONProcessor.strToJSON(runParameters);
		this.fieldTypes = new HashMap<String, ValueType>();		
		this.parameters = new ArrayList<RuntimeUserParameter>(); 
		for(Object pNameObj : jsonObj.keySet()){
			String pName = (String)pNameObj;
			JSONObject pObj = jsonObj.getJSONObject(pName);
			ValueType valueType = (ValueType)Enum.valueOf(ValueType.class, pObj.getString("valueType"));
			Object value = ValueConverter.convertToObject(pObj.getString("value"), valueType);
			
			this.fieldTypes.put(pName, valueType);
			RuntimeUserParameter runParameter = new RuntimeUserParameter(pName, value);;
			this.parameters.add(runParameter);
		}
	}
	public String getRunParameters() {
		return runParameters;
	}
	
	@Override
	public void run() {
		boolean runSucceed = false;
		String error = null;
		Session dbSession = null;
		try{
			//执行表达式中的函数需要用到数据库连接，此处为这些函数设置数据库连接
			HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager");   
			dbSession = transactionManager.getSessionFactory().openSession(); 
		    
			try{
				Runner expRunner = new Runner();// (Runner)ContextUtil.getBean("expRunner");
				IEnvironment expEnvironment = (IEnvironment)ContextUtil.getBean("expEnvironment");
				expRunner.setExpEnvironment(expEnvironment);
				Validator expValidator = (Validator)ContextUtil.getBean("expValidator");
				ValidateResult validateResult = expValidator.validateExp(runExp, fieldTypes, RunAt.Server, null);
				if(validateResult.getSucceed()){  
					
					List<RuntimeUserParameter> runParameters = new ArrayList<RuntimeUserParameter>();
					runParameters.add(new RuntimeUserParameter("jobInstanceId", this.getJobInstanceId()));
					for(RuntimeUserParameter p : parameters){
						runParameters.add(p);
					}
					
					RunResult runResult = expRunner.runExp(validateResult, runParameters, dbSession);
					if(runResult.getSucceed()){
						runSucceed = true; 
					}
					else{
						throw new Exception("执行表达式出错. jobInstId = " + this.getJobInstanceId() + ", runExp = " + this.getRunExp() + ", errors = " + runResult.getError());
					} 
				}
				else{
					throw new Exception("验证表达式出错. jobInstId = " + this.getJobInstanceId() + ", runExp = " + this.getRunExp() + ", errors = " + ValueConverter.arrayToString(validateResult.getErrors(), ". "));
				}
			}
			catch(Exception ex){			
				ex.printStackTrace();
				error = ex.getMessage();
				logger.error(error); 
			} 
			try {  
				this.jobManager.updateJobInstance(dbSession, jobInstanceId, runSucceed ? StatusType.succeed : StatusType.error, error);  			
				this.jobManager.createJobInstance(dbSession, jobId);
			}
			catch (Exception ex) {  
				ex.printStackTrace();
				logger.error("更新定时任务执行结果出错, jobInstId = " +this.getJobInstanceId() + ", " + ex.getMessage());
			}
		}
		catch(Exception ex){
			ex.printStackTrace();
			logger.error("JobInstanceRunner error. " + ex.getMessage());
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}
	} 
}
