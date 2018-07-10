package com.novacloud.novaone.excelGrid.control;
 
import java.math.BigInteger;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.share.ShareViewProcessor;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.excelGrid.egInstance.ExcelGridInstanceProcessor;
import com.novacloud.novaone.excelGrid.egInstance.StepOrderByType;
import com.novacloud.novaone.excelGrid.team.TeamProcessor;  
 
public class ExcelGridInstanceControl{

  	private static Logger logger=Logger.getLogger(ExcelGridInstanceControl.class); 

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private ExcelGridInstanceProcessor excelGridInstanceProcessor;
	public void setExcelGridInstanceProcessor(ExcelGridInstanceProcessor excelGridInstanceProcessor){
		this.excelGridInstanceProcessor = excelGridInstanceProcessor;
	}
	private ExcelGridInstanceProcessor getExcelGridInstanceProcessor(){
		return this.excelGridInstanceProcessor;
	}

	public DataRow getTeamDefinition(INcpSession session, String definitionId, String teamId) throws Exception{
		logger.info("getDefinitionName");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession); 
			DataRow teamDefinition = excelGridInstanceProcessor.getTeamDefinition(definitionId, teamId);  
			return teamDefinition;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	
	
	public List<DataRow> getPersonalInstances(INcpSession session, String definitionId, int pageIndex, int onePageRowCount) throws Exception{
		logger.info("getPersonalInstances");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			List<String> instanceIds = excelGridInstanceProcessor.getPersonalInstanceIds(userId, definitionId, pageIndex, onePageRowCount); 
			List<DataRow> instanceRows = excelGridInstanceProcessor.getInstances(instanceIds);
			return instanceRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	
	
	public List<DataRow> getPersonalInstances(INcpSession session, int pageIndex, int onePageRowCount) throws Exception{
		logger.info("getPersonalInstances");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			List<String> instanceIds = excelGridInstanceProcessor.getPersonalInstanceIds(userId, pageIndex, onePageRowCount); 
			List<DataRow> instanceRows = excelGridInstanceProcessor.getInstances(instanceIds);
			return instanceRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	
	
	public List<DataRow> getWaitingProcessInstanceSteps(INcpSession session, int pageIndex, int onePageRowCount) throws Exception{
		logger.info("getWaitingProcessInstanceSteps");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			List<String> stepIds = excelGridInstanceProcessor.getWaitingProcessInstanceStepIds(userId, pageIndex, onePageRowCount); 
			List<DataRow> stepRows = excelGridInstanceProcessor.getInstanceSteps(stepIds, StepOrderByType.CreateTime);
			return stepRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	
	
	public List<DataRow> getWaitingProcessInstanceStepIdsOneInstance(INcpSession session, String instanceId) throws Exception{
		logger.info("getWaitingProcessInstanceStepIdsOneInstance");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			List<String> stepIds = excelGridInstanceProcessor.getWaitingProcessInstanceStepIdsOneInstance(userId, instanceId); 
			List<DataRow> stepRows = excelGridInstanceProcessor.getInstanceSteps(stepIds, StepOrderByType.CreateTime);
			return stepRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	 
	
	public List<DataRow> getProcessedIntanceSteps(INcpSession session, int pageIndex, int onePageRowCount) throws Exception{
		logger.info("getProcessedIntanceSteps");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			List<String> stepIds = excelGridInstanceProcessor.getProcessedIntanceStepIds(userId, pageIndex, onePageRowCount); 
			List<DataRow> stepRows = excelGridInstanceProcessor.getInstanceSteps(stepIds, StepOrderByType.ProcessTime);
			return stepRows;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	 
	
	public int getPersonalInstanceCount(INcpSession session) throws Exception{
		logger.info("getPersonalInstanceCount");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			int instanceCount = excelGridInstanceProcessor.getPersonalInstanceCount(userId);  
			return instanceCount;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	 
	
	public int getPersonalInstanceCount(INcpSession session, String definitionId) throws Exception{
		logger.info("getPersonalInstanceCount");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			int instanceCount = excelGridInstanceProcessor.getPersonalInstanceCount(userId, definitionId);  
			return instanceCount;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	  
	
	public int getWaitingProcessInstanceStepCount(INcpSession session) throws Exception{
		logger.info("getWaitingProcessInstanceStepCount");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			int instanceCount = excelGridInstanceProcessor.getWaitingProcessInstanceStepCount(userId);  
			return instanceCount;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	  
	
	public int getProcessedIntanceStepCount(INcpSession session) throws Exception{
		logger.info("getProcessedIntanceStepCount");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			int instanceCount = excelGridInstanceProcessor.getProcessedIntanceStepCount(userId);  
			return instanceCount;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	  
	
	public DataRow getInstance(INcpSession session, String instanceId) throws Exception{
		logger.info("getInstance");
		Session dbSession = null;
		try{
			ExcelGridInstanceProcessor excelGridInstanceProcessor =  this.getExcelGridInstanceProcessor();
			dbSession = this.openDBSession();
			excelGridInstanceProcessor.setDBSession(dbSession);
			String userId = session.getUserId();
			DataRow instanceRow = excelGridInstanceProcessor.getInstance(instanceId);  
			return instanceRow;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}	  
 
}