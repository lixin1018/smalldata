package com.novacloud.novaone.dataFile;

import java.sql.SQLException;

import org.hibernate.Session;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.IDBParserAccess;

import net.sf.json.JSONObject;

public abstract class FileBaseProcessor implements IFileBaseProcessor{

	private DataFileProcessor dataFileProcessor = null;
	public DataFileProcessor getDataFileProcessor() {
		return dataFileProcessor;
	}
	public void setDataFileProcessor(DataFileProcessor dataFileProcessor) {
		this.dataFileProcessor = dataFileProcessor;
	} 
	
	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	protected IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	private Session dbSession = null;
	public Session getDBSession() {
		return dbSession;
	}
	public void setDBSession(Session dbSession) {
		this.dbSession = dbSession;
	}  
	
	public void beforeSaveFile(INcpSession session, String fileId, String fileContent, String title, String applicationName, String applicationVersion, String property) throws Exception{
		DataRow fileInfo = this.getDataFileProcessor().getDirAndFileInfoById(session.getUserId(), fileId);
		if(fileInfo == null){
			throw new NcpException("FilePurviewError", "没有查看读写此文件的权限, 或者此文件不存在.");
		}

		FileUseType useType = FileUseType.valueOf(fileInfo.getStringValue("usetype"));
		if(this.getDataFileProcessor().getIsUserReadonlyByUseType(useType)){
			throw new NcpException("FilePurviewError", "不允许保存此文件.");
		}
	}
	
	public void afterSaveFile(INcpSession session, String fileId, String applicationName, String applicationVersion, String property) throws Exception{
		
	}
	 
	public void saveFileCore(INcpSession session, String fileId, String fileContent, String title, String applicationName, String applicationVersion, String property) throws Exception {
		String userId = session.getUserId();
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.saveFile(userId, fileId, title, fileContent, true, false, FileUseType.user, applicationName, applicationVersion, property);
	}  
	 
	public void saveFile(INcpSession session, String fileId, String fileContent, String title, String applicationName, String applicationVersion, String property) throws Exception {
		dataFileProcessor.setDBSession(getDBSession());
		this.beforeSaveFile(session, fileId, fileContent, title, applicationName, applicationVersion, property);
		this.saveFileCore(session, fileId, fileContent, title, applicationName, applicationVersion, property);
		this.afterSaveFile(session, fileId, applicationName, applicationVersion, property);
	}  
	
	public void beforeReadFile(INcpSession session, String fileId) throws Exception{
		DataRow fileInfo = this.getDataFileProcessor().getDirAndFileInfoById(session.getUserId(), fileId);
		if(fileInfo == null){
			throw new NcpException("FilePurviewError", "没有查看读写此文件的权限, 或者此文件不存在.");
		}		
	}
	
	public String afterReadFile(INcpSession session, String fileId, String fileContent) throws Exception{
		return fileContent;
	}
	
	public String readFileCore(INcpSession session, String fileId) throws Exception {		
		String userId = session.getUserId();
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor(); 
		return dataFileProcessor.readFile(userId, fileId);
	}
	
	public String readFile(INcpSession session, String fileId) throws Exception {
		dataFileProcessor.setDBSession(getDBSession());
		this.beforeReadFile(session, fileId);
		String fileContent = this.readFileCore(session, fileId);
		return this.afterReadFile(session, fileId, fileContent);
	}
		
	public JSONObject getFileInfo(INcpSession session, String fileId) throws Exception { 
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.setDBSession(getDBSession());
		return dataFileProcessor.getFileFromDBToJSONObject(session, fileId);
	}
	
	@Override
	public abstract String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys, boolean isHidden, FileUseType useType) throws Exception;
}
