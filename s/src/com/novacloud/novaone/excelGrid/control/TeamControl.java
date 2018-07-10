package com.novacloud.novaone.excelGrid.control;
 
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.share.ShareViewProcessor;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.excelGrid.team.TeamProcessor;  
 
public class TeamControl{

  	private static Logger logger=Logger.getLogger(TeamControl.class); 

	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private TeamProcessor teamProcessor;
	public void setTeamProcessor(TeamProcessor teamProcessor){
		this.teamProcessor = teamProcessor;
	}
	private TeamProcessor getTeamProcessor(){
		return this.teamProcessor;
	}
	
	public List<DataRow> getTeamDefinitions(INcpSession session, String teamId) throws Exception{
		logger.info("getTeamDefinitions");
		Session dbSession = null;
		try{
			TeamProcessor teamProcessor =  this.getTeamProcessor();
			dbSession = this.openDBSession();
			teamProcessor.setDBSession(dbSession);
			List<DataRow> definitionRows = teamProcessor.getTeamDefinitions(teamId);  
			return definitionRows;
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
	
	public List<DataRow> getMemberTeams(INcpSession session) throws Exception{
		logger.info("getMemberTeams");
		Session dbSession = null;
		try{
			TeamProcessor teamProcessor =  this.getTeamProcessor();
			dbSession = this.openDBSession();
			teamProcessor.setDBSession(dbSession);
			List<DataRow> teamRows = teamProcessor.getMemberTeams(session.getUserId());  
			return teamRows;
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