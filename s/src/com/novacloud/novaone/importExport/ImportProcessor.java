package com.novacloud.novaone.importExport;
  
import java.sql.SQLException; 
import java.util.HashMap; 
import org.apache.log4j.Logger; 
import org.hibernate.Session; 
import org.springframework.orm.hibernate4.HibernateTransactionManager; 
import com.novacloud.novaone.asynService.AsynInvokeBase; 
import com.novacloud.novaone.asynService.InvokeResult;
import com.novacloud.novaone.asynService.InvokeStatusType; 
import com.novacloud.novaone.common.SysConfig; 
import com.novacloud.novaone.dao.db.IDBParserAccess; 
 
//通用方法集合
public class ImportProcessor extends AsynInvokeBase{
	private static Logger logger=Logger.getLogger(ImportProcessor.class);
	
	public ImportProcessor(){
		
	}

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	} 
	
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}
	private String fileName = ""; 
	public String getFileName()
	{
		return this.fileName;
	}
	
	
	@Override
	public void setParameter(HashMap<String, Object> parameterValues) { 
		this.fileName = (String)parameterValues.get("fileName"); 
	}
	
	@Override	
	public void run() throws Exception{ 
		
		ImportCoreProcess importPro= new ImportCoreProcess();  
		
		Session dbSession = this.openDBSession();
		importPro.setDBSession(dbSession);
		importPro.setDBParserAccess(this.dBParserAccess);
		importPro.setFileName(fileName);	
		
		importPro.run();
	}   
	
	
	//获取任务状态
	private InvokeResult accessImportDataToGetTaskStatus() throws Exception{
		Session dbSession = null; 
		try { 
			dbSession = this.openDBSession(); 
			String invokeId = this.getInvokeId();
			
			String getImportStatusSql = "select i.statustype as statustype from dm_importinstance i where i.filename = " + SysConfig.getParamPrefix() + "filename";
			HashMap<String, Object> getImportStatusP2vs = new HashMap<String, Object>();
			getImportStatusP2vs.put("filename", this.getFileName()); ;
			String statusTypeStr = (String)this.dBParserAccess.selectOne(dbSession, getImportStatusSql, getImportStatusP2vs); 
			if(statusTypeStr == null){
				//没明白什么时候会出现这种情况
				return new InvokeResult(InvokeStatusType.error, "未能创建导入任务");
				//return null;//new InvokeResult(InvokeStatusType.waiting, "尚未创建导入任务. invokeId = " + invokeId);
			}
			else{			 
				ImportStatusType statusType= ImportStatusType.valueOf(statusTypeStr); 
				switch(statusType){
					case Deleted:{
						return new InvokeResult(InvokeStatusType.deleted, "");
					}
					case Error:{
						return new InvokeResult(InvokeStatusType.error, "");
					}
					case Succeed:{  
						return new InvokeResult(InvokeStatusType.succeed, "");
					}
					case Importing:{   
						return new InvokeResult(InvokeStatusType.running, "");
					}
					default:{   
						return new InvokeResult(InvokeStatusType.error, "");
					}
				}
			}		
		}
		catch(Exception ex){			
			ex.printStackTrace();
			String error = ex.getMessage();
			logger.error(error); 
			throw ex;			
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}

	@Override
	public InvokeResult check() throws Exception { 
		return this.accessImportDataToGetTaskStatus();  
	}

	@Override
	public int getCheckWaitingSecond() { 
		return 15;
	}

	//最长执行时间，超过这个时间，则认为超时出错
	@Override
	public int getMaxRuningSecond() { 
		return 60 * 60 * 5;
	}
}
