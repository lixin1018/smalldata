package com.novacloud.novaone.dataFile.control;
  
import java.sql.SQLException; 
import java.util.Date;
import java.util.HashMap;
import java.util.List; 
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager; 
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.RootDirType; 
 
public class DataFileControl{
  	private static Logger logger=Logger.getLogger(DataFileControl.class); 

	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private DataFileProcessor dataFileProcessor;
	public void setDataFileProcessor(DataFileProcessor dataFileProcessor){
		this.dataFileProcessor = dataFileProcessor;
	}
	private DataFileProcessor getDataFileProcessor(){
		return this.dataFileProcessor;
	}  

	public int getSendInfoCount(INcpSession session, String toUserId, String toUser, Date sendDate, String fileName, String message) throws Exception{
		logger.info("getSendInfoCount");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId();
			int sendCount = dataFileProcessor.getSendInfoCount(ownerId, toUserId, toUser, sendDate, fileName, message);
			return sendCount;
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

	public List<DataRow> getSendInfos(INcpSession session, String toUserId, String toUser, Date sendDate, String fileName, String message, int fromIndex, int onePageRowCount) throws Exception{
		logger.info("getSendInfos");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId();
			List<DataRow> sendRows = dataFileProcessor.getSendInfos(ownerId, toUserId, toUser, sendDate, fileName, message, fromIndex, onePageRowCount);
			return sendRows;
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

	public int getReceiveInfoCount(INcpSession session, String fromUser, String toUser, Date receiveDate, String fileName, String message) throws Exception{
		logger.info("getReceiveInfoCount");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId();
			int sendCount = dataFileProcessor.getReceiveInfoCount(ownerId, fromUser, toUser, receiveDate, fileName, message);
			return sendCount;
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

	public List<DataRow> getReceiveInfos(INcpSession session, String fromUser, String toUser, Date receiveDate, String fileName, String message, int fromIndex, int onePageRowCount) throws Exception{
		logger.info("getReceiveInfos");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId();
			List<DataRow> receiveRows = dataFileProcessor.getReceiveInfos(ownerId, fromUser, toUser, receiveDate, fileName, message, fromIndex, onePageRowCount);
			return receiveRows;
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

	public DataRow getReceiveInfo(INcpSession session, String receiveId) throws Exception{
		logger.info("getReceiveInfo");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			DataRow receiveRow = dataFileProcessor.getReceiveInfo(receiveId);
			if(receiveRow == null){
				throw new Exception("不存在此发送信息.");
			}
			else{
				String receiveUserId = receiveRow.getStringValue("userid");
				if(!userId.equals(receiveUserId)){ 
					throw new Exception("没有权限查看此信息.");
				}
				else{
					return receiveRow;
				}
			}
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

	public DataRow getSendInfo(INcpSession session, String sendId) throws Exception{
		logger.info("getReceiveInfo");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String userId = session.getUserId();
			DataRow sendRow = dataFileProcessor.getSendInfo(sendId);
			if(sendRow == null){
				throw new Exception("不存在此发送信息.");
			}
			else{
				String sendUserId = sendRow.getStringValue("fromuserid");
				if(!userId.equals(sendUserId)){ 
					throw new Exception("没有权限查看信息.");
				}
				else{
					return sendRow;
				}
			}
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

	public List<DataRow> getFileInfos(INcpSession session, List<String> fileIdList) throws Exception{
		logger.info("getFileInfos");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId(); 
			List<DataRow> fileRows = dataFileProcessor.getDirAndFileInfo(ownerId, fileIdList);
			return fileRows;
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
	
	public boolean getCanPreview(String fileType){
		DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
		HashMap<String, Object> fileTypeInfo = dataFileProcessor.getExeFileRegConfig().getFileType(fileType);
		return (Boolean)fileTypeInfo.get("canPreview");
	}
	
	public String getDefaultExeType(String fileType){
		DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
		return dataFileProcessor.getExeFileRegConfig().getDefaultExeType(fileType); 
	}

	public String getSendDirId(INcpSession session) throws Exception{
		logger.info("getSendDirId");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId(); 
			String sendDirId = dataFileProcessor.createRootDir(ownerId, RootDirType.sent);
			return sendDirId;
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

	public String getReceiveDirId(INcpSession session) throws Exception{
		logger.info("getReceiveDirId");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId(); 
			String receiveDirId = dataFileProcessor.createRootDir(ownerId, RootDirType.received);
			return receiveDirId;
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

	public String getRootDirId(INcpSession session, RootDirType dirType) throws Exception{
		logger.info("getRootDirId");
		Session dbSession = null;
		try{
			DataFileProcessor dataFileProcessor =  this.getDataFileProcessor();
			dbSession = this.openDBSession();
			dataFileProcessor.setDBSession(dbSession); 
			String ownerId = session.getUserId(); 
			String dirId = dataFileProcessor.createRootDir(ownerId, dirType);
			return dirId;
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