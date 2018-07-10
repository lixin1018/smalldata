package com.novacloud.novaone.dataFile.exe.control;
  
import java.sql.SQLException; 
import java.util.Date; 
import java.util.List; 
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.dataFile.exe.ExeConfig;
import com.novacloud.novaone.dataFile.exe.ExeProcessor; 
 
public class ExeControl{
  	private static Logger logger=Logger.getLogger(ExeControl.class); 

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private ExeProcessor exeProcessor;
	public void setExeProcessor(ExeProcessor exeProcessor){
		this.exeProcessor = exeProcessor;
	}
	private ExeProcessor getExeProcessor(){
		return this.exeProcessor;
	}  

	public ExeConfig loadConfig(INcpSession session, String exeId) throws Exception{
		logger.info("loadConfig");
		Session dbSession = null;
		try{
			ExeProcessor exeProcessor =  this.getExeProcessor();
			dbSession = this.openDBSession();
			exeProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId();
			ExeConfig exeConfig = exeProcessor.loadConfig(session, exeId);
			return exeConfig;
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