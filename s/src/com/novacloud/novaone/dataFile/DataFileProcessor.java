package com.novacloud.novaone.dataFile;
 
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date; 
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID; 
import org.hibernate.Session;
import org.hibernate.Transaction;
import com.nova.frame.utils.SecurityUtils;
import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType; 
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DataFileProcessor {
	
	//单页显示的记录数
	private int onePageRowCount = 20;
	public int getOnePageRowCount() {
		return onePageRowCount;
	}
	public void setOnePageRowCount(int onePageRowCount) {
		this.onePageRowCount = onePageRowCount;
	}
	
	//邀请码长度
	private int inviteCodeLength = 6;
	public int getInviteCodeLength() {
		return inviteCodeLength;
	}
	public void setInviteCodeLength(int inviteCodeLength) {
		this.inviteCodeLength = inviteCodeLength;
	}
	
	//普通用户角色Id（数据库里D_Role表里commonUserRole角色对应的Id）
	private String commonUserRoleId = "";
	public String getCommonUserRoleId() {
		return commonUserRoleId;
	}
	public void setCommonUserRoleId(String commonUserRoleId) {
		this.commonUserRoleId = commonUserRoleId;
	}
	
	//发送文件后，邮件提醒的模板
	private String emailFormatWhenSendFile = "";
	public String getEmailFormatWhenSendFile() {
		return emailFormatWhenSendFile;
	}
	public void setEmailFormatWhenSendFile(String emailFormatWhenSendFile) {
		this.emailFormatWhenSendFile = emailFormatWhenSendFile;
	}
	
	//发送邀请的邮件模板
	private String emailFormatWhenInvite = "";
	public String getEmailFormatWhenInvite() {
		return emailFormatWhenInvite;
	}
	public void setEmailFormatWhenInvite(String emailFormatWhenInvite) {
		this.emailFormatWhenInvite = emailFormatWhenInvite;
	}

	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}

	private ExeFileRegConfig exeFileRegConfig; 
	public void setExeFileRegConfig(ExeFileRegConfig exeFileRegConfig) {
		this.exeFileRegConfig = exeFileRegConfig;
	}  
	public ExeFileRegConfig getExeFileRegConfig() {
		return this.exeFileRegConfig;
	}
	  
	//数据库Session（需要Service类里的方法把dbSession传递过来）
	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}
	
	//文件根目录的保存文件位置
	private String fileRootDirAbsolutePath = null;
	public String getFileRootDirAbsolutePath(){ 
		return this.fileRootDirAbsolutePath;
	}	
	public void setFileRootDirAbsolutePath(String fileRootDirAbsolutePath){
		this.fileRootDirAbsolutePath = fileRootDirAbsolutePath; 
	}

	//获取新文件的相对路径
	private String getNewFileRelativePath(Date time){
		SimpleDateFormat sdfYM =   new SimpleDateFormat("yyyyMM");
		SimpleDateFormat sdfDT =   new SimpleDateFormat("ddHHmmssSSS");
		String ymStr = sdfYM.format(time);
		String dtStr = sdfDT.format(time);
		
    	UUID uuid = UUID.randomUUID();  
    	String uStr = uuid.toString();

    	String partA = uStr.substring(0, 1);
    	String partB = uStr.substring(1, 2);
    	String partC = uStr.substring(2, 3);
    	String partD = uStr.substring(4, 5);
    	
    	String path = ymStr+ "/"  + partA + "/" + partB + "/" + partC + "/" + partD + "/" + uStr +"/" + dtStr;
    	return path;
	}

	//获取新文件的的相对路径
	private String getNewFileRelativePath(String oldFileRelativePath, Date time){
		SimpleDateFormat sdfYM =   new SimpleDateFormat("yyyyMM");
		SimpleDateFormat sdfDT =   new SimpleDateFormat("ddHHmmssSSS");
		String ymStr = sdfYM.format(time);
		String dtStr = sdfDT.format(time);
    	
		String path = ymStr + oldFileRelativePath.substring(6, oldFileRelativePath.length() - 11) + dtStr;
    	return path;
	}

	//获取file的绝对路径
	private String getFileAbsolutePath(String fileRelativePath){
		String path = this.getFileRootDirAbsolutePath() + "/" + fileRelativePath;
		return path;
	}

	//获取dir的绝对路径
	private String getDirAbsolutePath(String fileRelativePath){
		String path = this.getFileRootDirAbsolutePath() + "/" + fileRelativePath.substring(0, fileRelativePath.length() - 12);
		return path;
	}

	//查找是否存在重名
	private boolean hasSameName(String name, String parentId, String ownerId, String fileId) throws SQLException{ 
		String sql = "select count(1) from fl_userfile f"
				+ " where f.ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and f.name = " + SysConfig.getParamPrefix() +"name"
				+ ((parentId != null && parentId.length() !=0) ? ( " and f.parentid = " + SysConfig.getParamPrefix() +"parentid" ) : ( " and f.parentid is null" ))
				+ " and f.isdeleted = 'N' and f.issys = 'N'"
				+ " and f.id <> " + SysConfig.getParamPrefix() + "fileid"; 	
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("ownerid", ownerId);
		p2vs.put("name", name);
		p2vs.put("fileid", fileId);
		if(parentId != null && parentId.length() !=0){
			p2vs.put("parentid", parentId);
		}
		Session dbSession = this.getDBSession();
		int versionCount = ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue();
		return versionCount != 0;
	}

	//查找是否存在重名
	public boolean hasSameName(String name, String parentId, String ownerId) throws SQLException{ 
		String sql = "select count(1) from fl_userfile f"
				+ " where f.ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and f.name = " + SysConfig.getParamPrefix() +"name"
				+ ((parentId != null && parentId.length() !=0) ? ( " and f.parentid = " + SysConfig.getParamPrefix() +"parentid" ) : ( " and f.parentid is null" ))
				+ " and f.isdeleted = 'N' and f.issys = 'N'";	
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("ownerid", ownerId);
		p2vs.put("name", name);
		if(parentId != null && parentId.length() !=0){
			p2vs.put("parentid", parentId);
		}
		Session dbSession = this.getDBSession();
		int versionCount = ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue();
		return versionCount != 0;
	}

	//创建dir记录（不检查重名）
	private String createDirWithoutCheckSameName(String name, String parentId, String ownerId, boolean isSys, boolean isHidden, FileUseType userType){
		Date currentTime = new Date();
		Data fl_UserFileData = DataCollection.getData("fl_UserFile");		
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("parentid", parentId == null || parentId.length() == 0 ? null : parentId);
		fieldValues.put("name", name);
		fieldValues.put("isdir", "Y");
		fieldValues.put("filetype", FileType.dir.toString());
		fieldValues.put("createtime", currentTime);
		fieldValues.put("lastmodifytime", currentTime);
		fieldValues.put("createuserid", ownerId);
		fieldValues.put("modifyuserid", ownerId);
		fieldValues.put("isdeleted", "N");
		fieldValues.put("issys", isSys ? "Y" : "N");
		fieldValues.put("ishidden", isHidden ? "Y" : "N");
		fieldValues.put("usetype", userType.toString());
		fieldValues.put("ownerid", ownerId);
		String dirId = this.dBParserAccess.insertByData(dbSession, fl_UserFileData, fieldValues);
		return dirId;
	}

	//创建dir记录
	private String createDir(String ownerId, String name, String parentId, boolean isSys, boolean isHidden, FileUseType userType) throws SQLException, NcpException {
		String dirId = null;
		boolean hasSameName = this.hasSameName(name, parentId, ownerId);
		if(hasSameName){
			throw new NcpException("hasSameName", "已经存在名为'" + name + "'的文件夹或文件");
		}
		else{
			dirId = this.createDirWithoutCheckSameName(name, parentId, ownerId, isSys, isHidden, userType);
		} 
		return dirId;
	}
	
	//创建dir记录
	public String createDir(INcpSession session, String name, String parentId, boolean isSys, boolean isHidden, FileUseType userType) throws SQLException, NcpException {
		String userId = session.getUserId();
		String dirId = this.createDir(userId, name, parentId, isSys, isHidden, userType);
		return dirId;
	}

	//在硬盘中创建文件
	private String createFileInDisk(Date createTime, String fileContent) throws Exception{		
		String fileRelativePath  = this.getNewFileRelativePath(createTime);
		String fileAbsolutePath = this.getFileAbsolutePath(fileRelativePath);		
		String dirAbsolutePath = this.getDirAbsolutePath(fileRelativePath);
		
		//在硬盘上创建文件
		FileOperate fo = new FileOperate();
		fo.createFolder(dirAbsolutePath);		
		//创建个文件
		fo.createFile(fileAbsolutePath, fileContent);
		
		return fileRelativePath;
	}
	
	//保存文件内容到硬盘
	private String saveFileInDisk(String oldFileRelativePath, Date createTime, String fileContent) throws Exception{		
		String newFileRelativePath  = this.getNewFileRelativePath(oldFileRelativePath, createTime);
		String fileAbsolutePath = this.getFileAbsolutePath(newFileRelativePath);		
		String dirAbsolutePath = this.getDirAbsolutePath(newFileRelativePath);
		
		//在硬盘上创建文件
		FileOperate fo = new FileOperate();
		fo.createFolder(dirAbsolutePath);		
		//创建个文件
		fo.createFile(fileAbsolutePath, fileContent);
		
		return newFileRelativePath;
	}

	//创建文件（不检查是否重名）
	private String createFileWithoutCheckSameName(String name, FileType fileType, String parentId, String ownerId, Date currentTime, String fileRelativePath, boolean isSys, boolean isHidden, FileUseType useType, String applicationName, String applicationVersion, String property){
		Data fl_UserFileData = DataCollection.getData("fl_UserFile");		
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("parentid", parentId == null || parentId.length() == 0 ? null : parentId);
		fieldValues.put("name", name);
		fieldValues.put("isdir", "N");
		fieldValues.put("filetype", fileType.toString());
		fieldValues.put("filesize", 0);
		fieldValues.put("createtime", currentTime);
		fieldValues.put("lastmodifytime", currentTime);
		fieldValues.put("createuserid", ownerId);
		fieldValues.put("modifyuserid", ownerId);
		fieldValues.put("isdeleted", "N");
		fieldValues.put("issys", isSys ? "Y" : "N");
		fieldValues.put("ishidden", isHidden ? "Y" : "N");
		fieldValues.put("usetype", useType.toString());
		fieldValues.put("relativepath", fileRelativePath);
		fieldValues.put("ownerid", ownerId);
		fieldValues.put("applicationname", applicationName);
		fieldValues.put("applicationversion", applicationVersion);
		fieldValues.put("property", property);
		String fileId = this.dBParserAccess.insertByData(dbSession, fl_UserFileData, fieldValues);
		return fileId;
	}
	
	private FileType getFileType(String typeName) throws Exception{ 
		try{
			FileType fileType = FileType.valueOf(typeName);
			return fileType;
		}
		catch(Exception ex){
			throw new Exception("不支持'" + typeName + "'类型的文件", ex);
		}		
	}

	//创建文件
	public String createFile(String ownerId, String name, String fileTypeName, String fileContent, String parentId, boolean isSys, boolean isHidden, FileUseType useType,  String applicationName, String applicationVersion, String property) throws Exception {
		FileType fileType = this.getFileType(fileTypeName);		
		return this.createFile(ownerId, name, fileType, fileContent, parentId, isSys, isHidden, useType, applicationName, applicationVersion, property);
	}

	//创建文件
	public String createFile(String ownerId, String name, FileType fileType, String fileContent, String parentId, boolean isSys, boolean isHidden, FileUseType useType, String applicationName, String applicationVersion, String property) throws Exception {
		String fileId = null; 
		boolean hasSameName = this.hasSameName(name, parentId, ownerId);
		if(hasSameName){
			throw new NcpException("hasSameName", "已经存在名为'" + name + "'的文件夹或文件");
		}
		else{
			Date currentTime = new Date(); 
			String fileRelativePath = this.createFileInDisk(currentTime, fileContent);
			
			fileId = this.createFileWithoutCheckSameName(name, fileType, parentId, ownerId, currentTime, fileRelativePath, isSys, isHidden, useType, applicationName, applicationVersion, property);
		} 
		return fileId;
	}

	//创建文件
	public void saveFile(String userId, String fileId, String name, String fileContent, boolean isSys, boolean isHidden, FileUseType useType, String applicationName, String applicationVersion, String property) throws Exception {
		DataRow fileRow = this.getDirAndFileInfoById(userId, fileId);
		String parentId = fileRow.getStringValue("parentid");
		boolean hasSameName = this.hasSameName(name, parentId, userId, fileId);
		if(hasSameName){
			throw new NcpException("hasSameName", "已经存在名为'" + name + "'的文件夹或文件");
		}
		else{
			Date currentTime = new Date();
			 
			String fileRelativePath = this.createFileInDisk(currentTime, fileContent);
			
			this.updateFileRow(userId, name, fileId, currentTime, fileRelativePath, applicationName, applicationVersion, property);
		}  
	}

	//读取文件
	public String readFile(String userId, String fileId) throws Exception {
		DataRow fileRow = this.getDirAndFileInfoById(userId, fileId);
		if(fileRow == null){
			throw new NcpException("NoneFile", "不存在此文件");
		}
		else{
			String fileRelativePath = fileRow.getStringValue("relativepath");
			String fileAbsolutePath = this.getFileAbsolutePath(fileRelativePath); 
			FileOperate fo = new FileOperate();
			String fileContent = fo.readTxt(fileAbsolutePath);
			return fileContent;
		}  
	}
	
	private void updateFileRow(String userId, String name, String fileId, Date currentTime, String fileRelativePath, String applicationName, String applicationVersion, String property) { 
		String sql = "update fl_userfile set modifyuserid = " + SysConfig.getParamPrefix() + "modifyuserid, "
				+ " lastmodifytime = " + SysConfig.getParamPrefix() + "lastmodifytime,"
				+ " name = " + SysConfig.getParamPrefix() + "name,"
				+ " relativepath = " + SysConfig.getParamPrefix() + "relativepath,"
				+ " applicationname = " + SysConfig.getParamPrefix() + "applicationname,"
				+ " applicationversion = " + SysConfig.getParamPrefix() + "applicationversion,"
				+ " property = " + SysConfig.getParamPrefix() + "property"
				+ " where id = " + SysConfig.getParamPrefix() + "fileid";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("modifyuserid", userId);  
		p2vs.put("lastmodifytime", currentTime);   
		p2vs.put("name", name);   
		p2vs.put("relativepath", fileRelativePath);  
		p2vs.put("fileid", fileId);    
		p2vs.put("applicationname", applicationName);    
		p2vs.put("applicationversion", applicationVersion);    
		p2vs.put("property", property);  
		  
		this.dBParserAccess.update(dbSession, sql, p2vs); 
		
	}
	//创建文件
	public String createFile(INcpSession session, String name, String fileType, String fileContent, String parentId, boolean isSys, boolean isHidden, FileUseType useType, String applicationName, String applicationVersion, String property) throws Exception {
		String userId = session.getUserId();
		String fileId = this.createFile(userId, name, fileType, fileContent, parentId, isSys, isHidden, useType, applicationName, applicationVersion, property);
		return fileId;
	}	

	//获取dir信息
	public JSONObject getDirFromDBToJSONObject(INcpSession session, String dirId) throws Exception {
		String userId = session.getUserId();
		DataRow infoRow = this.getDirAndFileInfoById(userId, dirId);		
		JSONObject dirInfoJson = this.convertDirAndFileInfoToJSON(infoRow);		
		return dirInfoJson;
	}

	//获取file信息
	public JSONObject getFileFromDBToJSONObject(INcpSession session, String fileId) throws Exception {
		String userId = session.getUserId();
		DataRow infoRow = this.getDirAndFileInfoById(userId, fileId);		
		JSONObject fileInfoJson = this.convertDirAndFileInfoToJSON(infoRow);	
		
		//增加上exeType，即默认的打开方式
		String exeType = this.getExeFileRegConfig().getDefaultExeType(infoRow.getStringValue("filetype"));
		fileInfoJson.put("exeType", exeType);		
		
		FileUseType useType = FileUseType.valueOf(infoRow.getStringValue("usetype"));
		boolean readonly = this.getIsUserReadonlyByUseType(useType);
		fileInfoJson.put("readonly", readonly ? "Y" : "N");
		
		return fileInfoJson;
	} 
	
	public boolean getIsUserReadonlyByUseType(FileUseType useType){
		boolean readonly = true;
		switch(useType){
			case application:
			case user:
				readonly = false;
				break;
			case system:
			case sent:
			case received:
				readonly = true;
				break;
		}
		return readonly;
	}

	//复制
	public List<HashMap<String, String>> copyTo(INcpSession session, String toParentId, List<String> fileIds, boolean isSys, boolean isHidden, FileUseType useType, boolean autoRename) throws Exception {
		String userId = session.getUserId();
		List<HashMap<String, String>> allMovedDirAndFiles = this.copyTo(userId, toParentId, fileIds, isSys, isHidden, useType, autoRename);
		for(int i = 0; i < allMovedDirAndFiles.size(); i++){
			HashMap<String, String> movedDirAndFile = allMovedDirAndFiles.get(i);
			movedDirAndFile.put("name", CommonFunction.encode(movedDirAndFile.get("name")));
			if(movedDirAndFile.containsKey("newName")){
				movedDirAndFile.put("newName", CommonFunction.encode(movedDirAndFile.get("newName")));
			}
		}
		return allMovedDirAndFiles;
	} 

	//另存为
	public HashMap<String, String> saveAs(INcpSession session, String toParentId, String fileId, String fileName, boolean isSys, boolean isHidden, FileUseType useType) throws Exception {
		String userId = session.getUserId();
		HashMap<String, String> saveAsFile = this.saveAs(userId, toParentId, fileId, fileName, isSys, isHidden, useType);  
		saveAsFile.put("name", CommonFunction.encode(saveAsFile.get("name"))); 
		return saveAsFile;
	} 

	//复制
	public List<HashMap<String, String>> copyTo(String userId, String toParentId, List<String> fileIds, boolean isSys, boolean isHidden, FileUseType useType, boolean autoRename) throws Exception {
		List<DataRow> fileInfoRows = this.getDirAndFileInfo(userId, fileIds);
		for(int i = 0; i < fileIds.size(); i++){
			DataRow fileRow = fileInfoRows.get(i); 
			String name = fileRow.getStringValue("name");
			boolean isDeleted = fileRow.getBooleanValue("isdeleted");
			boolean isDir = fileRow.getBooleanValue("isdir");
			if(isDeleted){
				throw new Exception("文件 \"" + name + "\" 已被删除, 无法复制.");
			}
			if(isDir){
				throw new Exception("不支持复制文件夹. 您选择了文件夹 \"" + name + "\".");
			}
		}
		
		List<HashMap<String, String>> allNewFiles = new ArrayList<HashMap<String, String>>(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			for(int i = 0; i < fileInfoRows.size(); i++){
				DataRow fileInfoRow = fileInfoRows.get(i);
				String id = fileInfoRow.getStringValue("id"); 
				String name = fileInfoRow.getStringValue("name");
				String applicationName = fileInfoRow.getStringValue("applicationname");
				String applicationVersion = fileInfoRow.getStringValue("applicationversion");
				String property = fileInfoRow.getStringValue("property");
				FileType fileType = this.getFileType(fileInfoRow.getStringValue("filetype"));

				HashMap<String, String> fileObj = new HashMap<String, String>();
				fileObj.put("oldId", id);
				fileObj.put("name", name);
				
				boolean hasSameName = this.hasSameName(name, toParentId, userId);
				if(hasSameName && !autoRename){
					throw new Exception("文件 \"" + name + "\" 重名");
				}
				Date currentTime = new Date();
				if(hasSameName){
					SimpleDateFormat sdf = new SimpleDateFormat("HHmmssSSS");
					name = name + "_" +sdf.format(currentTime); 
					fileObj.put("newName", name);					
				} 
				
				//复制后的新文件和源文件实际存储位置是一样的
				String fileRelativePath = fileInfoRow.getStringValue("relativepath");
				
				String fileId = this.createFileWithoutCheckSameName(name, fileType, toParentId, userId, currentTime, fileRelativePath, isSys, isHidden, useType, applicationName, applicationVersion, property);
				fileObj.put("id", fileId);
				allNewFiles.add(fileObj);
			}
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}		
		return allNewFiles;		
	}

	//另存为
	public HashMap<String, String> saveAs(String userId, String toParentId, String oldFileId, String fileName, boolean isSys, boolean isHidden, FileUseType useType) throws Exception {
		DataRow fileRow = this.getDirAndFileInfoById(userId, oldFileId); 
		String name = fileRow.getStringValue("name");
		boolean isDeleted = fileRow.getBooleanValue("isdeleted");
		boolean isDir = fileRow.getBooleanValue("isdir");
		if(isDeleted){
			throw new Exception("文件 \"" + name + "\" 已被删除, 无法复制.");
		}
		if(isDir){
			throw new Exception("不支持复制文件夹. 您选择了文件夹 \"" + name + "\".");
		} 
		
		HashMap<String, String> newFile = new HashMap<String, String>(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();  
			String id = fileRow.getStringValue("id"); 
			String applicationName = fileRow.getStringValue("applicationname"); 
			String applicationVersion = fileRow.getStringValue("applicationversion"); 
			String property = fileRow.getStringValue("property");
			
			FileType fileType = this.getFileType(fileRow.getStringValue("filetype"));
 
			newFile.put("oldId", id);
			newFile.put("name", fileName);
			
			boolean hasSameName = this.hasSameName(fileName, toParentId, userId);
			if(hasSameName){
				throw new Exception("文件 \"" + fileName + "\" 重名");
			}

			//复制后的新文件和源文件实际存储位置是一样的
			String fileRelativePath = fileRow.getStringValue("relativepath");
			Date currentTime = new Date();
			String fileId = this.createFileWithoutCheckSameName(fileName, fileType, toParentId, userId, currentTime, fileRelativePath, isSys, isHidden, useType, applicationName, applicationVersion, property);
			newFile.put("id", fileId); 
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}		
		return newFile;		
	}

	//更改dir或file的父文件夹id
	private void changeDirAndFileParent(String ownerId, String oldParentId, String newParentId, List<String> dirAndFileIds, HashMap<String, String> allFileNewNames) throws SQLException { 
		for(int i = 0; i < dirAndFileIds.size(); i++){
			String id = dirAndFileIds.get(i); 
			String newName = allFileNewNames.containsKey(id) ? allFileNewNames.get(id) : null; 
	
			String sql = "update fl_userfile set parentid = " + SysConfig.getParamPrefix() + "newparentid"
					+ (newName == null ? "" : (", name = " + SysConfig.getParamPrefix() + "name")) 
					+ " where ownerid = " + SysConfig.getParamPrefix() + "ownerid" 
					+ " and id = " + SysConfig.getParamPrefix() + "id";
			
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("ownerid", ownerId);  
			p2vs.put("id", id);   
			p2vs.put("newparentid", newParentId == null || newParentId.length() == 0 ? null : newParentId);  
			if(newName != null){
				p2vs.put("name", newName);
			}
			  
			this.dBParserAccess.update(dbSession, sql, p2vs); 
		}
	}
	
	//判断是否为父文件夹
	private boolean isParent(String ownerId, String childId, String parentDirId, boolean recursion) throws SQLException{
		if(parentDirId == null || parentDirId.length() == 0){
			return true;
		}
		else{
			DataRow dfRow = this.getDirAndFileInfoById(ownerId, childId);
			if(dfRow == null){
				return false;
			}
			else{
				String dfParentId = dfRow.getStringValue("parentid");
				if(dfParentId == null){
					return false;
				}
				else if(parentDirId.equals(dfParentId)){
					return true;
				}
				else{
					if(recursion){
						return this.isParent(ownerId, dfParentId, parentDirId, recursion);
					}
					else{
						return false;
					}
				}
			}
		}
	}

	//移动文件
	public List<HashMap<String, String>> moveTo(INcpSession session, String fromParentId, String toParentId, List<String> dirAndFileIds, boolean autoRename) throws Exception {
		String userId = session.getUserId();
		List<HashMap<String, String>> allMovedDirAndFiles = this.moveTo(userId, fromParentId, toParentId, dirAndFileIds, autoRename);
		for(int i = 0; i < allMovedDirAndFiles.size(); i++){
			HashMap<String, String> movedDirAndFile = allMovedDirAndFiles.get(i);
			movedDirAndFile.put("name", CommonFunction.encode(movedDirAndFile.get("name")));
			if(movedDirAndFile.containsKey("newName")){
				movedDirAndFile.put("newName", CommonFunction.encode(movedDirAndFile.get("newName")));
			}
		}
		return allMovedDirAndFiles;
	}

	//判断是否为同一个文件或文件夹
	private boolean isSameDirOrFile(String idA, String idB){
		if(idA == null || idA.length() == 0){
			return idB == null || idB.length() == 0;
		}
		else{
			return idA.equals(idB);
		}
	}

	//移动文件
	private List<HashMap<String, String>> moveTo(String ownerId, String fromParentId, String toParentId, List<String> dirAndFileIds, boolean autoRename) throws Exception {
		if(this.isSameDirOrFile(fromParentId, toParentId)){
			throw new Exception("目标文件夹与文件所在文件夹相同.");
		}
		else{
			List<DataRow> dirAndFileInfoRows = this.getDirAndFileInfo(ownerId, dirAndFileIds);
			if(dirAndFileInfoRows.size() != dirAndFileIds.size()){
				throw new Exception("后台查询获得的记录数少于被选中的记录数, 请刷新界面后重新操作.");
			}
			
			List<HashMap<String, String>> allMovedDirAndFiles = new ArrayList<HashMap<String, String>>();
			HashMap<String, String> allFileNewNames = new HashMap<String, String>();
			for(int i = 0; i < dirAndFileIds.size(); i++){
				DataRow dirAndFileRow = dirAndFileInfoRows.get(i);
				String name = dirAndFileRow.getStringValue("name");
				String id = dirAndFileRow.getStringValue("id");
				boolean isDeleted = dirAndFileRow.getBooleanValue("isdeleted");
				boolean isDir = dirAndFileRow.getBooleanValue("isdir"); 
				if(isDeleted){
					throw new Exception( "\"" + name + "\" 已被删除, 无法移动.");
				}
				if(isDir){
					if(id.equals(toParentId)){
						throw new Exception("不能将文件夹'" + name + "'移动到自身里.");
					}
					else{
						//不能将文件夹moveTo它的子文件夹里
						boolean isMoveToChildDir = this.isParent(ownerId, toParentId, id, true);
						if(isMoveToChildDir){
							throw new Exception("不能将文件夹'" + name + "'移动到它的子文件夹里.");
						}
					}
				}
				
				HashMap<String, String> movedDirAndFile = new HashMap<String, String>();
				movedDirAndFile.put("id", id);
				movedDirAndFile.put("name", name); 
				
				boolean hasSameName = this.hasSameName(name, toParentId, ownerId);
				if(hasSameName){
					if(autoRename){
						Date currentTime = new Date(); 
						SimpleDateFormat sdf = new SimpleDateFormat("HHmmssSSS");
						name = name + "_" +sdf.format(currentTime);  
						movedDirAndFile.put("newName", name);
						
						allFileNewNames.put(id, name);
					}
					else{
						throw new Exception("文件 \"" + name + "\" 重名");
					}
				}		
				allMovedDirAndFiles.add(movedDirAndFile);
			}
			 
			Transaction tx = null;
			try{  
				tx = dbSession.beginTransaction();
				this.changeDirAndFileParent(ownerId, fromParentId, toParentId, dirAndFileIds,  allFileNewNames);
				tx.commit();
			}
			catch(RuntimeException ex){ 
				if(tx != null){
					tx.rollback();
				}
				throw ex;
			}
			return allMovedDirAndFiles;		
		}
	}

	//删除
	private void deleteByIds(String ownerId, String parentId, List<String> dirAndFileIds) {		
		StringBuilder fStr = new StringBuilder();
		for(int i = 0; i < dirAndFileIds.size(); i++){
			fStr.append((i == 0 ? "'" : ", '") + dirAndFileIds.get(i) +"'");
		}
		
		String sql = "update fl_userfile set" 
				+ " isdeleted = 'Y'"  
				+ " where ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and parentid = " + SysConfig.getParamPrefix() + "parentid"
				+ " and id in (" + fStr.toString() + ")";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("ownerid", ownerId);
		if(parentId != null && parentId.length() != 0){
			p2vs.put("parentid", parentId); 
		}
		
		Session dbSession = this.getDBSession();
		this.dBParserAccess.update(dbSession, sql, p2vs);
	}

	//删除
	private void delete(String ownerId, String parentId, List<String> dirAndFileIds) { 
		List<List<String>> allGroupIds = CommonFunction.splitGroups(dirAndFileIds, 50);
		
		for(int i = 0; i < allGroupIds.size(); i++){
			List<String> oneGroupIds = allGroupIds.get(i);
			this.deleteByIds(ownerId, parentId, oneGroupIds); 
		} 
	}
	
	//删除
	public void delete(INcpSession session, String parentId, List<String> dirAndFileIds) {	
		String userId = session.getUserId();	 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction(); 
			this.delete(userId, parentId, dirAndFileIds);
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}
	}

	//重命名
	private void rename(String ownerId, String id, String newName) {		
		String sql = "update fl_userfile set" 
				+ " name = " + SysConfig.getParamPrefix() + "name"  
				+ " where ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and id = " + SysConfig.getParamPrefix() + "id";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("name", newName);
		p2vs.put("ownerid", ownerId);
		p2vs.put("id", id); 
		
		Session dbSession = this.getDBSession();
		this.dBParserAccess.update(dbSession, sql, p2vs);
	}
	
	//重命名
	private void rename(String ownerId, String parentId, String id, String newName) throws SQLException, NcpException {
		boolean hasSameName = this.hasSameName(newName, parentId, ownerId);
		if(hasSameName){
			throw new NcpException("hasSameName", "已经存在名为" + newName + "的文件夹或文件");
		}
		else{
			this.rename(ownerId, id, newName);
		}
	}
	
	//重命名
	public void rename(INcpSession session, String parentId, String id, String newName) throws SQLException, NcpException {
		String userId = session.getUserId();	 
		this.rename(userId, parentId, id, newName);
	}

	//获取符合条件的已发送文件信息
	public JSONArray getReceiveInfos(INcpSession session, String fromUser, String toUser, Date receiveDate, String fileName, String message, int pageIndex) throws Exception { 
		String userId = session.getUserId();
		int onePageRowCount = this.getOnePageRowCount();
		int fromIndex = (pageIndex - 1) * onePageRowCount;
		List<DataRow> receiveInfoRows = this.getReceiveInfos(userId, fromUser, toUser, receiveDate, fileName, message, fromIndex, onePageRowCount);
		JSONArray receiveInfoArray = new JSONArray();
		for(DataRow receiveInfoRow : receiveInfoRows){
			String id = receiveInfoRow.getStringValue("id");
			String hasRead = receiveInfoRow.getBooleanValue("hasread") ? "Y" : "N";
			String receiveTime = ValueConverter.convertToString(receiveInfoRow.getDateTimeValue("receivetime"), ValueType.Time);
			String fileIds = receiveInfoRow.getStringValue("fileids"); 
			String hasBringBack = receiveInfoRow.getBooleanValue("hasbringback") ? "Y" : "N";
			String fromUserIdStr = receiveInfoRow.getStringValue("fromuserid");
			String fromUserNameStr = receiveInfoRow.getStringValue("fromusername");
			String fromUserEmailStr = receiveInfoRow.getStringValue("fromuseremail");
			String fullMessage = receiveInfoRow.getStringValue("message");
			String toUserIds = receiveInfoRow.getStringValue("touserids");
			String bringBackTime = ValueConverter.convertToString(receiveInfoRow.getDateTimeValue("bringbacktime"), ValueType.Time); 
			String fileNames = receiveInfoRow.getStringValue("filenames"); 
			String toUserNames = receiveInfoRow.getStringValue("tousernames"); 
			String toUserEmails = receiveInfoRow.getStringValue("touseremails"); 
			
			JSONObject receiveInfoObj = new JSONObject();
			receiveInfoObj.put("id", id);
			receiveInfoObj.put("hasRead", hasRead);
			receiveInfoObj.put("receiveTime", receiveTime);
			receiveInfoObj.put("fileIds", fileIds);
			receiveInfoObj.put("hasBringBack", hasBringBack);
			receiveInfoObj.put("fromUserId", fromUserIdStr);
			receiveInfoObj.put("fromUserName", fromUserNameStr);
			receiveInfoObj.put("fromUserEmail", fromUserEmailStr);
			receiveInfoObj.put("message", fullMessage);
			receiveInfoObj.put("toUserIds", toUserIds);
			receiveInfoObj.put("bringBackTime", bringBackTime);
			receiveInfoObj.put("fileNames", fileNames);
			receiveInfoObj.put("toUserNames", toUserNames);
			receiveInfoObj.put("toUserEmails", toUserEmails);
			receiveInfoArray.add(receiveInfoObj);
		}
		return receiveInfoArray;
	}

	//获取符合条件的已收到文件信息
	public List<DataRow> getReceiveInfos(String ownerId, String fromUser, String toUser, Date receiveDate, String fileName, String message, int fromIndex, int onePageRowCount) throws Exception { 
		StringBuilder queryReceivedFileInfoSql = new StringBuilder("select rf.id as id,"
				+ " rf.userid as userid,"
				+ " rf.hasread as hasread,"
				+ " rf.receivetime as receivetime,"
				+ " rf.fileids as fileids,"
				+ " rf.hasbringback as hasbringback,"
				+ " sf.fromuserid as fromuserid,"
				+ " sf.fromusername as fromusername,"
				+ " sf.fromuseremail as fromuseremail,"
				+ " sf.message as message,"
				+ " sf.touserids as touserids," 
				+ " sf.bringbacktime as bringbacktime,"
				+ " sf.filenames as filenames,"
				+ " sf.tousernames as tousernames,"
				+ " sf.touseremails as touseremails"
				+ " from fl_receivefile rf left outer join fl_sendfile sf on rf.sendfileid = sf.id"
				+ " where rf.userid = " + SysConfig.getParamPrefix() + "userid");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", ownerId);

		if(fromUser!= null && fromUser.length() != 0){
			queryReceivedFileInfoSql.append(" and (sf.fromusername like " + SysConfig.getParamPrefix() + "fromusername or sf.fromuseremail like " + SysConfig.getParamPrefix() + "fromuseremail)");
			p2vs.put("fromusername", "%" + fromUser + "%");
			p2vs.put("fromuseremail", "%" + fromUser + "%");
		} 
		
		if(toUser != null && toUser.length() != 0){
			queryReceivedFileInfoSql.append(" and (sf.tousernames like " + SysConfig.getParamPrefix() + "tousername or sf.touseremails like " + SysConfig.getParamPrefix() + "touseremail)");
			p2vs.put("tousername", "%" + toUser + "%");
			p2vs.put("touseremail", "%" + toUser + "%");
		} 
		
		if(receiveDate != null){
			String fromTimeStr = ValueConverter.dateTimeToString(receiveDate, "yyyy-MM-dd");
			Date fromTime = ValueConverter.convertToDate(fromTimeStr, "yyyy-MM-dd"); 
			Calendar c = Calendar.getInstance(); 
			c.setTime(fromTime); 
			int day=c.get(Calendar.DATE); 
			c.set(Calendar.DATE, day + 1); 
			Date toTime = c.getTime(); 			
			
			queryReceivedFileInfoSql.append(" and rf.receivetime >= " + SysConfig.getParamPrefix() + "fromtime and rf.receivetime < " + SysConfig.getParamPrefix() + "totime");
			p2vs.put("fromtime", fromTime);
			p2vs.put("totime", toTime);		
		}
		
		if(fileName != null && fileName.length() != 0){
			queryReceivedFileInfoSql.append(" and sf.filenames like " + SysConfig.getParamPrefix() + "filename");
			p2vs.put("filename", "%" + fileName + "%");
		}
		
		if(message != null && message.length() != 0){
			queryReceivedFileInfoSql.append(" and sf.message like " + SysConfig.getParamPrefix() + "message");
			p2vs.put("message", "%" + message + "%");
		}
		
		queryReceivedFileInfoSql.append(" order by rf.receivetime desc");
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("userid");
		alias.add("hasread");
		alias.add("receivetime");
		alias.add("fileids");
		alias.add("hasbringback");
		alias.add("fromuserid"); 
		alias.add("fromusername"); 
		alias.add("fromuseremail"); 
		alias.add("message");
		alias.add("touserids"); 
		alias.add("bringbacktime");
		alias.add("filenames");
		alias.add("tousernames");
		alias.add("touseremails");	
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("userid", ValueType.String);
		fieldValueTypes.put("hasread", ValueType.Boolean);
		fieldValueTypes.put("sendtime", ValueType.Time);
		fieldValueTypes.put("fileids", ValueType.String);
		fieldValueTypes.put("hasbringback", ValueType.Boolean);
		fieldValueTypes.put("fromuserid", ValueType.String);
		fieldValueTypes.put("fromusername", ValueType.String);
		fieldValueTypes.put("fromuseremail", ValueType.String);
		fieldValueTypes.put("message", ValueType.String);
		fieldValueTypes.put("touserids", ValueType.String); 
		fieldValueTypes.put("bringbacktime", ValueType.Time);
		fieldValueTypes.put("filenames", ValueType.String);
		fieldValueTypes.put("tousernames", ValueType.String);
		fieldValueTypes.put("touseremails", ValueType.String);
		
		DataTable receiveFileInfoTable = this.getDBParserAccess().selectList(getDBSession(), queryReceivedFileInfoSql.toString(), p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<DataRow> receiveFileInfoRows = receiveFileInfoTable.getRows();
		return receiveFileInfoRows;
	}

	//获取符合条件的已收到文件信息
	public DataRow getReceiveInfo(String receiveId) throws Exception { 
		StringBuilder queryReceivedFileInfoSql = new StringBuilder("select rf.id as id,"
				+ " rf.userid as userid,"
				+ " rf.hasread as hasread,"
				+ " rf.receivetime as receivetime,"
				+ " rf.fileids as fileids,"
				+ " rf.hasbringback as hasbringback,"
				+ " sf.fromuserid as fromuserid,"
				+ " sf.fromusername as fromusername,"
				+ " sf.fromuseremail as fromuseremail,"
				+ " sf.message as message,"
				+ " sf.touserids as touserids," 
				+ " sf.bringbacktime as bringbacktime,"
				+ " sf.filenames as filenames,"
				+ " sf.tousernames as tousernames,"
				+ " sf.touseremails as touseremails"
				+ " from fl_receivefile rf left outer join fl_sendfile sf on rf.sendfileid = sf.id"
				+ " where rf.id = " + SysConfig.getParamPrefix() + "id");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", receiveId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("userid");
		alias.add("hasread");
		alias.add("receivetime");
		alias.add("fileids");
		alias.add("hasbringback");
		alias.add("fromuserid"); 
		alias.add("fromusername"); 
		alias.add("fromuseremail"); 
		alias.add("message");
		alias.add("touserids"); 
		alias.add("bringbacktime");
		alias.add("filenames");
		alias.add("tousernames");
		alias.add("touseremails");	
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("userid", ValueType.String);
		fieldValueTypes.put("hasread", ValueType.Boolean);
		fieldValueTypes.put("sendtime", ValueType.Time);
		fieldValueTypes.put("fileids", ValueType.String);
		fieldValueTypes.put("hasbringback", ValueType.Boolean);
		fieldValueTypes.put("fromuserid", ValueType.String);
		fieldValueTypes.put("fromusername", ValueType.String);
		fieldValueTypes.put("fromuseremail", ValueType.String);
		fieldValueTypes.put("message", ValueType.String);
		fieldValueTypes.put("touserids", ValueType.String); 
		fieldValueTypes.put("bringbacktime", ValueType.Time);
		fieldValueTypes.put("filenames", ValueType.String);
		fieldValueTypes.put("tousernames", ValueType.String);
		fieldValueTypes.put("touseremails", ValueType.String);
		
		DataTable receiveFileInfoTable = this.getDBParserAccess().selectList(getDBSession(), queryReceivedFileInfoSql.toString(), p2vs, alias, fieldValueTypes);
		List<DataRow> receiveFileInfoRows = receiveFileInfoTable.getRows();
		return receiveFileInfoRows.size() == 0 ? null : receiveFileInfoRows.get(0);
	}
	
	//获取符合条件的已收到文件信息的个数
	public int getReceiveInfoCount(INcpSession session, String fromUser, String toUser, Date receiveDate, String fileName, String message) throws Exception {
		String userId = session.getUserId();
		return this.getReceiveInfoCount(userId, fromUser, toUser, receiveDate, fileName, message);
	}
	
	//获取符合条件的已收到文件信息的个数
	public int getReceiveInfoCount(String ownerId, String fromUser, String toUser, Date receiveDate, String fileName, String message) throws Exception { 
		StringBuilder queryReceivedFileInfoSql = new StringBuilder("select count(rf.id) as receivecount"
				+ " from fl_receivefile rf left outer join fl_sendfile sf on rf.sendfileid = sf.id"
				+ " where rf.userid = " + SysConfig.getParamPrefix() + "userid");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userid", ownerId);

		if(fromUser!= null && fromUser.length() != 0){
			queryReceivedFileInfoSql.append(" and (sf.fromusername like " + SysConfig.getParamPrefix() + "fromusername or sf.fromuseremail like " + SysConfig.getParamPrefix() + "fromuseremail)");
			p2vs.put("fromusername", "%" + fromUser + "%");
			p2vs.put("fromuseremail", "%" + fromUser + "%");
		} 
		
		if(toUser != null && toUser.length() != 0){
			queryReceivedFileInfoSql.append(" and (sf.tousernames like " + SysConfig.getParamPrefix() + "tousername or sf.touseremails like " + SysConfig.getParamPrefix() + "touseremail)");
			p2vs.put("tousername", "%" + toUser + "%");
			p2vs.put("touseremail", "%" + toUser + "%");
		} 
		
		if(receiveDate != null){
			String fromTimeStr = ValueConverter.dateTimeToString(receiveDate, "yyyy-MM-dd");
			Date fromTime = ValueConverter.convertToDate(fromTimeStr, "yyyy-MM-dd"); 
			Calendar c = Calendar.getInstance(); 
			c.setTime(fromTime); 
			int day=c.get(Calendar.DATE); 
			c.set(Calendar.DATE, day + 1); 
			Date toTime = c.getTime(); 
			
			
			queryReceivedFileInfoSql.append(" and rf.receivetime >= " + SysConfig.getParamPrefix() + "fromtime and rf.receivetime < " + SysConfig.getParamPrefix() + "totime");
			p2vs.put("fromtime", fromTime);
			p2vs.put("totime", toTime);		
		}
		
		if(fileName != null && fileName.length() != 0){
			queryReceivedFileInfoSql.append(" and sf.filenames like " + SysConfig.getParamPrefix() + "filename");
			p2vs.put("filename", "%" + fileName + "%");
		}
		
		if(message != null && message.length() != 0){
			queryReceivedFileInfoSql.append(" and sf.message like " + SysConfig.getParamPrefix() + "message");
			p2vs.put("message", "%" + message + "%");
		}
		 
		int receiveCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), queryReceivedFileInfoSql.toString(), p2vs)).intValue(); 
		return receiveCount;
	}

	//获取符合条件的已发送文件信息
	public JSONArray getSendInfos(INcpSession session, String toUserId, String toUser, Date sendDate, String fileName, String message, int pageIndex) throws Exception { 
		String userId = session.getUserId();
		int onePageRowCount = this.getOnePageRowCount();
		int fromIndex = (pageIndex - 1) * onePageRowCount;
		List<DataRow> sendInfoRows = this.getSendInfos(userId, toUserId, toUser, sendDate, fileName, message, fromIndex, onePageRowCount);
		JSONArray sendInfoArray = new JSONArray();
		for(DataRow sendInfoRow : sendInfoRows){
			String id = sendInfoRow.getStringValue("id");
			String fromUserId = sendInfoRow.getStringValue("fromuserid");
			String sendTime = ValueConverter.convertToString(sendInfoRow.getDateTimeValue("sendtime"), ValueType.Time);
			String fullMessage = sendInfoRow.getStringValue("message");
			String hasBringBack = sendInfoRow.getBooleanValue("hasbringback") ? "Y" : "N";
			String toUserIds = sendInfoRow.getStringValue("touserids"); 
			String fileIds = sendInfoRow.getStringValue("fileids"); 
			String bringBackTime = ValueConverter.convertToString(sendInfoRow.getDateTimeValue("bringbacktime"), ValueType.Time); 
			String fileNames = sendInfoRow.getStringValue("filenames"); 
			String toUserNames = sendInfoRow.getStringValue("tousernames"); 
			String toUserEmails = sendInfoRow.getStringValue("touseremails"); 
			
			JSONObject sendInfoObj = new JSONObject();
			sendInfoObj.put("id", id);
			sendInfoObj.put("fromUserId", fromUserId);
			sendInfoObj.put("sendTime", sendTime);
			sendInfoObj.put("message", fullMessage);
			sendInfoObj.put("hasBringBack", hasBringBack);
			sendInfoObj.put("toUserIds", toUserIds);
			sendInfoObj.put("fileIds", fileIds);
			sendInfoObj.put("bringBackTime", bringBackTime);
			sendInfoObj.put("fileNames", fileNames);
			sendInfoObj.put("toUserNames", toUserNames);
			sendInfoObj.put("toUserEmails", toUserEmails);
			sendInfoArray.add(sendInfoObj);
		}
		return sendInfoArray;
	}

	//获取符合条件的已发送文件信息
	public List<DataRow> getSendInfos(String ownerId, String toUserId, String toUser, Date sendDate, String fileName, String message, int fromIndex, int onePageRowCount) throws Exception { 
		StringBuilder querySendInfoSql = new StringBuilder("select sf.id as id,"
				+ " sf.fromuserid as fromuserid,"
				+ " sf.sendtime as sendtime,"
				+ " sf.message as message,"
				+ " sf.hasbringback as hasbringback,"
				+ " sf.touserids as touserids,"
				+ " sf.fileids as fileids,"
				+ " sf.bringbacktime as bringbacktime,"
				+ " sf.filenames as filenames,"
				+ " sf.tousernames as tousernames,"
				+ " sf.touseremails as touseremails"
				+ " from fl_sendfile sf"
				+ " where sf.fromuserid = " + SysConfig.getParamPrefix() + "fromuserid");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("fromuserid", ownerId);
		
		if(toUserId != null && toUserId.length() != 0){
			querySendInfoSql.append(" and sf.touserids like " + SysConfig.getParamPrefix() + "touserid");
			p2vs.put("touserid", "%" + toUserId + "%");
		}
		
		if(toUser != null && toUser.length() != 0){
			querySendInfoSql.append(" and (sf.tousernames like " + SysConfig.getParamPrefix() + "tousername or sf.touseremails like " + SysConfig.getParamPrefix() + "touseremail)");
			p2vs.put("tousername", "%" + toUser + "%");
			p2vs.put("touseremail", "%" + toUser + "%");
		} 
		
		if(sendDate != null){
			String fromTimeStr = ValueConverter.dateTimeToString(sendDate, "yyyy-MM-dd");
			Date fromTime = ValueConverter.convertToDate(fromTimeStr, "yyyy-MM-dd"); 
			Calendar c = Calendar.getInstance(); 
			c.setTime(fromTime); 
			int day=c.get(Calendar.DATE); 
			c.set(Calendar.DATE, day + 1); 
			Date toTime = c.getTime(); 			
			
			querySendInfoSql.append(" and sf.sendtime >= " + SysConfig.getParamPrefix() + "fromtime and sf.sendtime < " + SysConfig.getParamPrefix() + "totime");
			p2vs.put("fromtime", fromTime);
			p2vs.put("totime", toTime);		
		}
		
		if(fileName != null && fileName.length() != 0){
			querySendInfoSql.append(" and sf.filenames like " + SysConfig.getParamPrefix() + "filename");
			p2vs.put("filename", "%" + fileName + "%");
		}
		
		if(message != null && message.length() != 0){
			querySendInfoSql.append(" and sf.message like " + SysConfig.getParamPrefix() + "message");
			p2vs.put("message", "%" + message + "%");
		}
		
		querySendInfoSql.append(" order by sf.sendtime desc");
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("fromuserid");
		alias.add("sendtime");
		alias.add("message");
		alias.add("hasbringback");
		alias.add("touserids");
		alias.add("fileids");
		alias.add("bringbacktime");
		alias.add("filenames");
		alias.add("tousernames");
		alias.add("touseremails");	
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("fromuserid", ValueType.String);
		fieldValueTypes.put("sendtime", ValueType.Time);
		fieldValueTypes.put("message", ValueType.String);
		fieldValueTypes.put("hasbringback", ValueType.Boolean);
		fieldValueTypes.put("touserids", ValueType.String);
		fieldValueTypes.put("fileids", ValueType.String);
		fieldValueTypes.put("bringbacktime", ValueType.Time);
		fieldValueTypes.put("filenames", ValueType.String);
		fieldValueTypes.put("tousernames", ValueType.String);
		fieldValueTypes.put("touseremails", ValueType.String);
		
		DataTable sendFileInfoTable = this.getDBParserAccess().selectList(getDBSession(), querySendInfoSql.toString(), p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<DataRow> sendFileInfoRows = sendFileInfoTable.getRows();
		return sendFileInfoRows;
	}

	//获取符合条件的已发送文件信息
	public DataRow getSendInfo(String sendId) throws Exception { 
		StringBuilder querySendInfoSql = new StringBuilder("select sf.id as id,"
				+ " sf.fromuserid as fromuserid,"
				+ " sf.sendtime as sendtime,"
				+ " sf.message as message,"
				+ " sf.hasbringback as hasbringback,"
				+ " sf.touserids as touserids,"
				+ " sf.fileids as fileids,"
				+ " sf.bringbacktime as bringbacktime,"
				+ " sf.filenames as filenames,"
				+ " sf.tousernames as tousernames,"
				+ " sf.touseremails as touseremails"
				+ " from fl_sendfile sf"
				+ " where sf.id = " + SysConfig.getParamPrefix() + "id");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", sendId); 
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("fromuserid");
		alias.add("sendtime");
		alias.add("message");
		alias.add("hasbringback");
		alias.add("touserids");
		alias.add("fileids");
		alias.add("bringbacktime");
		alias.add("filenames");
		alias.add("tousernames");
		alias.add("touseremails");	
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("fromuserid", ValueType.String);
		fieldValueTypes.put("sendtime", ValueType.Time);
		fieldValueTypes.put("message", ValueType.String);
		fieldValueTypes.put("hasbringback", ValueType.Boolean);
		fieldValueTypes.put("touserids", ValueType.String);
		fieldValueTypes.put("fileids", ValueType.String);
		fieldValueTypes.put("bringbacktime", ValueType.Time);
		fieldValueTypes.put("filenames", ValueType.String);
		fieldValueTypes.put("tousernames", ValueType.String);
		fieldValueTypes.put("touseremails", ValueType.String);
		
		DataTable sendFileInfoTable = this.getDBParserAccess().selectList(getDBSession(), querySendInfoSql.toString(), p2vs, alias, fieldValueTypes);
		List<DataRow> sendFileInfoRows = sendFileInfoTable.getRows();
		return sendFileInfoRows.size() == 0 ? null : sendFileInfoRows.get(0);
	}

	//获取符合条件的已发送文件信息的个数
	public int getSendInfoCount(INcpSession session, String toUserId, String toUser, Date sendDate, String fileName, String message) throws Exception{
		String userId = session.getUserId();
		return this.getSendInfoCount(userId, toUserId, toUser, sendDate, fileName, message);
	}

	//获取符合条件的已发送文件信息的个数
	public int getSendInfoCount(String ownerId, String toUserId, String toUser, Date sendDate, String fileName, String message) throws Exception{
		StringBuilder querySentFileCountSql = new StringBuilder("select count(sf.id) as sentcount"
				+ " from fl_sendfile sf"
				+ " where sf.fromuserid = " + SysConfig.getParamPrefix() + "fromuserid");
				
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("fromuserid", ownerId);
		
		if(toUserId != null && toUserId.length() != 0){
			querySentFileCountSql.append(" and sf.touserids like " + SysConfig.getParamPrefix() + "touserid");
			p2vs.put("touserid", "%" + toUserId + "%");
		}
		
		if(toUser != null && toUser.length() != 0){
			querySentFileCountSql.append(" and (sf.tousernames like " + SysConfig.getParamPrefix() + "tousername or sf.touseremails like " + SysConfig.getParamPrefix() + "touseremail)");
			p2vs.put("tousername", "%" + toUser + "%");
			p2vs.put("touseremail", "%" + toUser + "%");
		} 
		
		if(sendDate != null){
			String fromTimeStr = ValueConverter.dateTimeToString(sendDate, "yyyy-MM-dd");
			Date fromTime = ValueConverter.convertToDate(fromTimeStr, "yyyy-MM-dd"); 
			Calendar c = Calendar.getInstance(); 
			c.setTime(fromTime); 
			int day=c.get(Calendar.DATE); 
			c.set(Calendar.DATE, day + 1); 
			Date toTime = c.getTime(); 
			
			
			querySentFileCountSql.append(" and sf.sendtime >= " + SysConfig.getParamPrefix() + "fromtime and sf.sendtime < " + SysConfig.getParamPrefix() + "totime");
			p2vs.put("fromtime", fromTime);
			p2vs.put("totime", toTime);		
		}
		
		if(fileName != null && fileName.length() != 0){
			querySentFileCountSql.append(" and sf.filenames like " + SysConfig.getParamPrefix() + "filename");
			p2vs.put("filename", "%" + fileName + "%");
		}
		
		if(message != null && message.length() != 0){
			querySentFileCountSql.append(" and sf.message like " + SysConfig.getParamPrefix() + "message");
			p2vs.put("message", "%" + message + "%");
		}
		
		int sendFileInfoCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), querySentFileCountSql.toString(), p2vs)).intValue(); 
		return sendFileInfoCount;		
	}

	//获取文件夹内其他子目录和文件的信息
	public List<DataRow> getChildren(String ownerId, String  parentId, boolean doesShowDir, boolean doesShowFile, boolean needGetHidden) throws SQLException { 
		String sql = "select f.id as id,"
				+ " f.name as name,"
				+ " f.isdir as isdir,"
				+ " f.filetype as filetype,"
				+ " f.filesize as filesize,"
				+ " f.createtime as createtime,"
				+ " f.lastmodifytime as lastmodifytime,"
				+ " f.createuserid as createuserid,"
				+ " f.modifyuserid as modifyuserid,"
				+ " f.parentid as parentid,"
				+ " f.isdeleted as isdeleted,"
				+ " f.issys as issys,"
				+ " f.ishidden as ishidden,"
				+ " f.usetype as usetype,"
				+ " f.description as description,"
				+ " f.ownerid as ownerid,"
				+ " f.relativepath as relativepath"
				+ " from fl_userfile f"
				+ " where f.ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and f.parentid = " + SysConfig.getParamPrefix() + "parentid"
				+ (doesShowDir &&  doesShowFile ? "" : (doesShowDir ? " and f.isdir = 'Y'" : (doesShowFile ? " and f.isdir = 'N'" : " and f.isdir = ''")))
				+ (needGetHidden ? "": " and f.ishidden ='N'")
				+ " and f.isdeleted = 'N'";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("ownerid", ownerId);  
		if(parentId != null && parentId.length() != 0){
			p2vs.put("parentid", parentId);  
		}
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("isdir");
		alias.add("filetype");
		alias.add("filesize");
		alias.add("createtime");
		alias.add("lastmodifytime");
		alias.add("createuserid");
		alias.add("modifyuserid"); 
		alias.add("parentid");
		alias.add("isdeleted");
		alias.add("issys");
		alias.add("ishidden");
		alias.add("usetype");
		alias.add("description");
		alias.add("ownerid");
		alias.add("relativepath");
		
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("isdir", ValueType.Boolean);
		fieldValueTypes.put("filetype", ValueType.String);
		fieldValueTypes.put("filesize", ValueType.String);
		fieldValueTypes.put("createtime", ValueType.String);
		fieldValueTypes.put("lastmodifytime", ValueType.String);
		fieldValueTypes.put("createuserid", ValueType.String);
		fieldValueTypes.put("modifyuserid", ValueType.String); 
		fieldValueTypes.put("parentid", ValueType.String);
		fieldValueTypes.put("isdeleted", ValueType.Boolean);
		fieldValueTypes.put("issys", ValueType.Boolean);
		fieldValueTypes.put("ishidden", ValueType.Boolean);
		fieldValueTypes.put("usetype", ValueType.String);
		fieldValueTypes.put("description", ValueType.String);
		fieldValueTypes.put("ownerid", ValueType.String);
		fieldValueTypes.put("relativepath", ValueType.String);

		Session dbSession = this.getDBSession();
		DataTable childrenTable = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		List<DataRow> allChildrenRows = childrenTable.getRows();
		return allChildrenRows;
	}
	
	//获取文件夹内其他子目录和文件的信息
	public JSONArray getChildren(INcpSession session, String parentId, boolean doesShowDir, boolean doesShowFile, boolean needGetHidden) throws Exception {
		String userId = session.getUserId();	 
		List<DataRow> allChildrenRows = this.getChildren(userId, parentId, doesShowDir, doesShowFile, needGetHidden);
		
		JSONArray infoArray = new JSONArray();
		for(int i = 0; i < allChildrenRows.size(); i++){
			DataRow infoRow = allChildrenRows.get(i);
			JSONObject infoJson = this.convertDirAndFileInfoToJSON(infoRow);
			
			//增加上exeType，即默认的打开方式
			String exeType = this.getExeFileRegConfig().getDefaultExeType(infoRow.getStringValue("filetype"));
			infoJson.put("exeType", exeType);			
			
			infoArray.add(infoJson);
		}
		return infoArray;	
	}
	
	
	
	//获取dir或file的虚拟路径的各部分详细信息
	public List<DataRow> getPathRows(String ownerId, String id) throws Exception {
		List<DataRow> tempPathRows = new ArrayList<DataRow>();
		List<String> pathIds = new ArrayList<String>();
		while(id != null && id.length() != 0){
			if(pathIds.contains(id)){
				throw new Exception("文件路径出现了环形引用, id = " + id + ". 请与管理员联系");
			}
			else{
				pathIds.add(id);
			}
			DataRow infoRow = this.getDirAndFileInfoById(ownerId, id);
			if(infoRow != null){
				tempPathRows.add(infoRow);
				String parentId = infoRow.getStringValue("parentid");
				id = parentId;
			}
			else{
				id = null;
			}
		}
		
		//排序翻转
		List<DataRow> pathRows = new ArrayList<DataRow>();
		for(int i = tempPathRows.size() - 1; i >= 0; i--){
			pathRows.add(tempPathRows.get(i));
		}
		return pathRows;
	} 
	
	//获取dir或者file的的虚拟路径
	public JSONArray getPath(INcpSession session, String id) throws Exception {
		String userId = session.getUserId();
		List<DataRow> pathRows = this.getPathRows(userId, id);
		
		JSONArray pathArray = new JSONArray();
		for(int i = 0; i < pathRows.size(); i++){
			DataRow pathRow = pathRows.get(i);
			JSONObject infoJson = this.convertDirAndFileInfoToJSON(pathRow);
			pathArray.add(infoJson);
		}
		return pathArray;
	}
	
	//获取dir或file信息
	public DataRow getDirAndFileInfoById(String ownerId, String  dirAndFileId) throws SQLException { 
		String sql = "select f.id as id,"
				+ " f.name as name,"
				+ " f.isdir as isdir,"
				+ " f.filetype as filetype,"
				+ " f.filesize as filesize,"
				+ " f.createtime as createtime,"
				+ " f.lastmodifytime as lastmodifytime,"
				+ " f.createuserid as createuserid,"
				+ " f.modifyuserid as modifyuserid,"
				+ " f.parentid as parentid,"
				+ " f.isdeleted as isdeleted,"
				+ " f.issys as issys,"
				+ " f.ishidden as ishidden,"
				+ " f.usetype as usetype,"
				+ " f.description as description,"
				+ " f.ownerid as ownerid,"
				+ " f.relativepath as relativepath"
				+ " from fl_userfile f"
				+ " where f.ownerid = " + SysConfig.getParamPrefix() + "ownerid"
				+ " and f.id = " + SysConfig.getParamPrefix() + "id";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("ownerid", ownerId);  
		p2vs.put("id", dirAndFileId);  
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("isdir");
		alias.add("filetype");
		alias.add("filesize");
		alias.add("createtime");
		alias.add("lastmodifytime");
		alias.add("createuserid");
		alias.add("modifyuserid"); 
		alias.add("parentid");
		alias.add("isdeleted");
		alias.add("issys");
		alias.add("ishidden");
		alias.add("usetype");
		alias.add("description");
		alias.add("ownerid");
		alias.add("relativepath");
		
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("isdir", ValueType.Boolean);
		fieldValueTypes.put("filetype", ValueType.String);
		fieldValueTypes.put("filesize", ValueType.String);
		fieldValueTypes.put("createtime", ValueType.String);
		fieldValueTypes.put("lastmodifytime", ValueType.String);
		fieldValueTypes.put("createuserid", ValueType.String);
		fieldValueTypes.put("modifyuserid", ValueType.String); 
		fieldValueTypes.put("parentid", ValueType.String);
		fieldValueTypes.put("isdeleted", ValueType.Boolean);
		fieldValueTypes.put("issys", ValueType.Boolean);
		fieldValueTypes.put("ishidden", ValueType.Boolean);
		fieldValueTypes.put("usetype", ValueType.String);
		fieldValueTypes.put("description", ValueType.String);
		fieldValueTypes.put("ownerid", ValueType.String);
		fieldValueTypes.put("relativepath", ValueType.String);

		Session dbSession = this.getDBSession();
		DataTable infoTable = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
		List<DataRow> allInfoRows = infoTable.getRows();
		return allInfoRows.size() == 0 ? null : allInfoRows.get(0);
	}
	
	//获取dir或file信息（批量）
	private DataTable getDirAndFileInfoByIds(String ownerId, List<String> dirAndFileIds) throws SQLException {		
		if(dirAndFileIds.size() == 0){
			return null;
		}
		else{
			StringBuilder fStr = new StringBuilder();
			for(int i = 0; i < dirAndFileIds.size(); i++){
				fStr.append((i == 0 ? "'" : ", '") + dirAndFileIds.get(i) +"'");
			}
		
			String sql = "select f.id as id,"
					+ " f.name as name,"
					+ " f.isdir as isdir,"
					+ " f.filetype as filetype,"
					+ " f.filesize as filesize,"
					+ " f.createtime as createtime,"
					+ " f.lastmodifytime as lastmodifytime,"
					+ " f.createuserid as createuserid,"
					+ " f.modifyuserid as modifyuserid,"
					+ " f.parentid as parentid,"
					+ " f.isdeleted as isdeleted,"
					+ " f.issys as issys,"
					+ " f.ishidden as ishidden,"
					+ " f.usetype as usetype,"
					+ " f.description as description,"
					+ " f.ownerid as ownerid,"
					+ " f.relativepath as relativepath"
					+ " from fl_userfile f"
					+ " where f.ownerid = " + SysConfig.getParamPrefix() + "ownerid"
					+ " and f.id in (" + fStr.toString() + ")";
			
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("ownerid", ownerId);  
			
			List<String> alias = new ArrayList<String>();
			alias.add("id");
			alias.add("name");
			alias.add("isdir");
			alias.add("filetype");
			alias.add("filesize");
			alias.add("createtime");
			alias.add("lastmodifytime");
			alias.add("createuserid");
			alias.add("modifyuserid"); 
			alias.add("parentid");
			alias.add("isdeleted");
			alias.add("issys");
			alias.add("ishidden");
			alias.add("usetype");
			alias.add("description");
			alias.add("ownerid");
			alias.add("relativepath");
			
			Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>(); 
			fieldValueTypes.put("id", ValueType.String);
			fieldValueTypes.put("name", ValueType.String);
			fieldValueTypes.put("isdir", ValueType.Boolean);
			fieldValueTypes.put("filetype", ValueType.String);
			fieldValueTypes.put("filesize", ValueType.String);
			fieldValueTypes.put("createtime", ValueType.String);
			fieldValueTypes.put("lastmodifytime", ValueType.String);
			fieldValueTypes.put("createuserid", ValueType.String);
			fieldValueTypes.put("modifyuserid", ValueType.String); 
			fieldValueTypes.put("parentid", ValueType.String);
			fieldValueTypes.put("isdeleted", ValueType.Boolean);
			fieldValueTypes.put("issys", ValueType.Boolean);
			fieldValueTypes.put("ishidden", ValueType.Boolean);
			fieldValueTypes.put("usetype", ValueType.String);
			fieldValueTypes.put("description", ValueType.String);
			fieldValueTypes.put("ownerid", ValueType.String);
			fieldValueTypes.put("relativepath", ValueType.String);

			Session dbSession = this.getDBSession();
			DataTable infoTable = this.dBParserAccess.selectList(dbSession, sql, p2vs, alias, fieldValueTypes);
			return infoTable;
		}
	}

	//获取dir或file信息（分组批量获取）
	public List<DataRow> getDirAndFileInfo(String ownerId, List<String> dirAndFileIds) throws SQLException { 
		List<DataRow> allInfoRows = new ArrayList<DataRow>(); 
		List<List<String>> allGroupIds = CommonFunction.splitGroups(dirAndFileIds, 50);
		
		for(int i = 0; i < allGroupIds.size(); i++){
			List<String> oneGroupIds = allGroupIds.get(i);
			DataTable infoTable = this.getDirAndFileInfoByIds(ownerId, oneGroupIds);
			allInfoRows.addAll(infoTable.getRows());
		}
		return allInfoRows;
	}
	
	//将dir或file信息转换成json
	private JSONObject convertDirAndFileInfoToJSON(DataRow infoRow) throws Exception{
		JSONObject infoJson = new JSONObject();
		infoJson.put("id", infoRow.getValue("id")); 
		infoJson.put("name", CommonFunction.encode(infoRow.getStringValue("name")));
		infoJson.put("isDir", infoRow.getValue("isdir"));
		infoJson.put("fileType", infoRow.getValue("filetype"));
		infoJson.put("fileSize", infoRow.getIntegerValue("filesize"));
		infoJson.put("createTime", infoRow.getStringValue("createtime", ValueType.Time));
		infoJson.put("lastModifyTime", infoRow.getStringValue("lastmodifytime", ValueType.Time));
		infoJson.put("createUserId", infoRow.getValue("createuserid"));
		infoJson.put("modifyUserId", infoRow.getValue("modifyuserid")); 
		infoJson.put("parentId", infoRow.getValue("parentid"));
		infoJson.put("isDeleted", infoRow.getValue("isdeleted"));
		infoJson.put("isSys", infoRow.getValue("issys"));
		infoJson.put("isHidden", infoRow.getValue("ishidden"));
		infoJson.put("useType", infoRow.getValue("usetype"));
		infoJson.put("description", CommonFunction.encode(infoRow.getStringValue("description")));
		infoJson.put("ownerId", infoRow.getValue("ownerid"));
		return infoJson;
	}
	
	//获取Dir或file信息
	public JSONArray getDirAndFileInfo(INcpSession session, List<String> dirAndFileIds) throws Exception {
		String userId = session.getUserId();
		List<DataRow> allInfoRows = this.getDirAndFileInfo(userId, dirAndFileIds);
		
		JSONArray infoArray = new JSONArray();
		for(int i = 0; i < allInfoRows.size(); i++){
			DataRow infoRow = allInfoRows.get(i);
			JSONObject infoJson = this.convertDirAndFileInfoToJSON(infoRow);
			
			//增加上exeType，即默认的打开方式
			String exeType = this.getExeFileRegConfig().getDefaultExeType(infoRow.getStringValue("filetype"));
			infoJson.put("exeType", exeType);		
			
			infoArray.add(infoJson);
		}
		return infoArray;		
	}
	
	//将文件发送给其他用户
	public void sendTo(INcpSession session, List<String> fileIds, List<String> toUserEmails, boolean needSendEmail, String message) throws Exception {
		String fromUserId = session.getUserId();
		DataRow fromUserRow = this.getUserInfoById(fromUserId);
		String fromUserName = fromUserRow.getStringValue("name");
		String fromUserEmail = fromUserRow.getStringValue("email");
		List<HashMap<String, String>> userReceiveInfos  = this.createSentAndFileInfo(fromUserId, fromUserName, fromUserEmail, toUserEmails, fileIds, message);
		this.sendEmailOnSendFile(fromUserId, userReceiveInfos, message);		
	}  
	
	//创建fl_SendFile表记录
	private String createSendFileInfo(String fromUserId, String fromUserName, String fromUserEmail, List<String> toUserIds, List<String> fileIds, String fileNameStr, String toUserNameStr, String toUserEmailStr, String message){
		String toUserIdStr = CommonFunction.listToString(toUserIds, "; ");
		String fileIdStr = CommonFunction.listToString(fileIds, "; ");
		Date currentTime = new Date();
		
		Data sendFileData = DataCollection.getData("fl_SendFile");		
		HashMap<String, Object> allFieldValues = new HashMap<String, Object>();
		allFieldValues.put("fromuserid", fromUserId);
		allFieldValues.put("fromusername", fromUserName);
		allFieldValues.put("fromuseremail", fromUserEmail);
		allFieldValues.put("sendtime", currentTime);
		allFieldValues.put("message", message);
		allFieldValues.put("isdeleted", "N");
		allFieldValues.put("hasbringback", "N");
		allFieldValues.put("touserids", toUserIdStr);
		allFieldValues.put("fileids", fileIdStr); 
		allFieldValues.put("filenames", fileNameStr); 
		allFieldValues.put("tousernames", toUserNameStr); 
		allFieldValues.put("touseremails", toUserEmailStr); 
		
		String sendFileId = this.getDBParserAccess().insertByData(getDBSession(), sendFileData, allFieldValues);
		return sendFileId;
	}
	
	//创建fl_ReceiveFile表记录
	private String createReceiveInfo(String toUserId, String sendFileId, List<String> fileIds, String fileNameStr){ 
		String fileIdStr = CommonFunction.listToString(fileIds, "; ");
		Date currentTime = new Date();
		
		Data receiveFileData = DataCollection.getData("fl_ReceiveFile");		
		HashMap<String, Object> allFieldValues = new HashMap<String, Object>();
		allFieldValues.put("sendfileid", sendFileId);
		allFieldValues.put("userid", toUserId); 
		allFieldValues.put("receivetime", currentTime); 
		allFieldValues.put("hasread", "N"); 
		allFieldValues.put("hasbringback", "N"); 
		allFieldValues.put("fileids", fileIdStr);
		
		String receiveFileId = this.getDBParserAccess().insertByData(getDBSession(), receiveFileData, allFieldValues);
		return receiveFileId;
	} 
	
	//发送邮件提醒（发送文件时）
	private void sendEmailOnSendFile(String fromUserId, List<HashMap<String, String>> userReceiveInfos, String message) throws SQLException{
		DataRow fromUserInfo = this.getUserInfoById(fromUserId);
		String fromUserName = fromUserInfo.getStringValue("name");
		Date currentTime = new Date();
		for(int i = 0; i < userReceiveInfos.size(); i++){
			HashMap<String, String> userReceiveInfo = userReceiveInfos.get(i);
			String toUserId = userReceiveInfo.get("toUserId");
			String receiveFileInfoId = userReceiveInfo.get("receiveFileInfoId");
			String fileNameStr = userReceiveInfo.get("fileNames");
			
			DataRow toUserInfo = this.getUserInfoById(toUserId);
			String toUserName = toUserInfo.getStringValue("name");	
			String toUserEmail = toUserInfo.getStringValue("email");			
			HashMap<String, String> keyValues = new HashMap<String, String>();
			keyValues.put("fromUserName", fromUserName);
			keyValues.put("toUserName", toUserName);
			keyValues.put("message", message == null || message.length() == 0 ? "无" : message);
			keyValues.put("fileNameStr", fileNameStr);
			keyValues.put("receiveFileInfoId", receiveFileInfoId);
			keyValues.put("currentTime", ValueConverter.dateTimeToString(currentTime, "yyyy-MM-dd HH:mm"));
			String emailContent = this.getEmailContent(this.getEmailFormatWhenSendFile(), keyValues);
			this.sendEmail(toUserEmail, emailContent);
		}
	}
	
	//构造邮件正文
	private String getEmailContent(String emailFormat, HashMap<String, String> keyValues){
		for(String key : keyValues.keySet()){
			String value = keyValues.get(key);
			String keyReg = CommonFunction.encodeRegExpString("{{" + key + "}}");
			emailFormat = emailFormat.replaceAll(keyReg, value);
		}
		return emailFormat;
	}
	
	//发送邮件给toUserEmail
	private void sendEmail(String toUserEmail, String emailContent){
		//尚未实现发送邮件功能
	}
	
	//创建send和receive信息记录，并在发送人sent和接收人receive里插入file记录
	private List<HashMap<String, String>> createSentAndFileInfo(String fromUserId, String fromUserName, String fromUserEmail, List<String> toUserEmails, List<String> sourceFileIds, String message) throws Exception{
		List<HashMap<String, String>> userReceiveInfos = new ArrayList<HashMap<String, String>>();
		List<DataRow> fileInfoRows = this.getDirAndFileInfo(fromUserId, sourceFileIds);
		HashMap<String, DataRow> sourceFileIdToFileRows = new HashMap<String, DataRow>();
		List<String> fileRelativePaths = new ArrayList<String>();
		List<String> fileNames = new ArrayList<String>();
		List<String> applicationNames = new ArrayList<String>();
		List<String> applicationVersions = new ArrayList<String>();
		List<String> properties = new ArrayList<String>();
		List<FileType> fileTypes = new ArrayList<FileType>();
		
		//判断源文件是否还存在
		for(int i = 0; i < fileInfoRows.size(); i++){
			DataRow fileInfoRow = fileInfoRows.get(i);
			String sourceFileId = fileInfoRow.getStringValue("id");
			sourceFileIdToFileRows.put(sourceFileId, fileInfoRow);
			fileRelativePaths.add(fileInfoRow.getStringValue("relativepath"));
			fileNames.add(fileInfoRow.getStringValue("name"));
			applicationNames.add(fileInfoRow.getStringValue("applicationname"));
			applicationVersions.add(fileInfoRow.getStringValue("applicationversion"));
			properties.add(fileInfoRow.getStringValue("property"));
			fileTypes.add(this.getFileType(fileInfoRow.getStringValue("filetype")));
		}
		for(int i = 0; i < sourceFileIds.size(); i++){
			String sourceFileId = sourceFileIds.get(i);
			if(!sourceFileIdToFileRows.containsKey(sourceFileId)){
				throw new Exception("选中的文件已不存在，请刷新界面后重新操作.");
			}
		}

		List<String> toUserNames = new ArrayList<String>();
		List<String> toUserIds = new ArrayList<String>();
		for(int i = 0; i < toUserEmails.size(); i++){
			String toUserEmail = toUserEmails.get(i); 
			DataRow userInfoRow = this.getUserInfoByEmail(toUserEmail);
			if(userInfoRow == null){
				throw new Exception("None user. userEmai = " + toUserEmail);
			}
			toUserNames.add(userInfoRow.getStringValue("name"));
			toUserIds.add(userInfoRow.getStringValue("id"));
		}
		
		
		Date currentTime = new Date();
		String fileNameStr = CommonFunction.listToString(fileNames, "; ");
		String toUserNameStr = CommonFunction.listToString(toUserNames, "; ");
		String toUserEmailStr = CommonFunction.listToString(toUserEmails, "; ");
		
		String sentDirId = this.createRootDir(fromUserId, RootDirType.sent);
		List<String> sentFileIds = this.batchCreateFileWithoutCheckSameName(fileNames, fileTypes, applicationNames, applicationVersions, properties, sentDirId, fromUserId, currentTime, fileRelativePaths, false, false, FileUseType.sent);
		String sendFileInfoId = this.createSendFileInfo(fromUserId, fromUserName, fromUserEmail, toUserIds, sentFileIds, fileNameStr, toUserNameStr, toUserEmailStr, message);
  
		for(int i = 0; i < toUserIds.size(); i++){
			String toUserId = toUserIds.get(i); 
			String receiveDirId = this.getRootDirId(toUserId, RootDirType.sent);
			List<String> receiveFileIds = this.batchCreateFileWithoutCheckSameName(fileNames, fileTypes, applicationNames, applicationVersions, properties, receiveDirId, toUserId, currentTime, fileRelativePaths, false, false, FileUseType.received);
			String receiveFileInfoId = this.createReceiveInfo(toUserId, sendFileInfoId, receiveFileIds, fileNameStr);
			HashMap<String, String> userReceiveInfo = new HashMap<String, String>();
			userReceiveInfo.put("toUserId", toUserId);
			userReceiveInfo.put("receiveFileInfoId", receiveFileInfoId);
			userReceiveInfo.put("fileNames", fileNameStr);
			userReceiveInfos.add(userReceiveInfo);
		}
		return userReceiveInfos;
	}
	
	//批量创建文件，无需检查重名
	private List<String> batchCreateFileWithoutCheckSameName(List<String> names, List<FileType> fileTypes, List<String> applicationNames, List<String> applicationVersions, List<String> properties, String parentId, String ownerId, Date currentTime, List<String> fileRelativePaths, boolean isSys, boolean isHidden, FileUseType useType){
		List<String> fileIds = new ArrayList<String>(); 
		for(int i = 0; i < fileRelativePaths.size(); i++){
			String fileRelativePath = fileRelativePaths.get(i);
			String name = names.get(i);
			String applicationName = applicationNames.get(i);
			String applicationVersion = applicationVersions.get(i);
			String property = properties.get(i);
			FileType fileType = fileTypes.get(i);
			String fileId = this.createFileWithoutCheckSameName(name, fileType, parentId, ownerId, currentTime, fileRelativePath, isSys, isHidden, useType, applicationName, applicationVersion, property);
			fileIds.add(fileId);
		}
		return fileIds;
	}
	
	//打上已读标记
	public void markRead(INcpSession session, List<String> receiveFileInfoIds) {
		String userId = session.getUserId();
		Date currentTime = new Date();
		for(String receiveFileInfoId : receiveFileInfoIds){
			this.markRead(userId, receiveFileInfoId, currentTime);
		}
	}
	
	//打上已读的标记
	private void markRead(String userId, String receiveFileInfoId, Date readTime){ 
		String updateReceiveInfoSql = "update fl_receivefile set hasread = 'Y', readtime = " + SysConfig.getParamPrefix() + "readtime"
				+ " where id = " + SysConfig.getParamPrefix() + "receiveid and hasread = 'N'";
		HashMap<String, Object> updateP2vs = new HashMap<String, Object>();
		updateP2vs.put("readtime", readTime);
		updateP2vs.put("receiveid", receiveFileInfoId);
		this.getDBParserAccess().update(getDBSession(), updateReceiveInfoSql, updateP2vs);
	}
	
	//取回已发送的文件，实际是打上删除标记
	public void bringBack(INcpSession session, String sendInfoId) throws Exception {
		//先查看明细是否已经被阅读，如果明细都没有被阅读，那么允许取回
		String userId = session.getUserId();
		boolean existRead = this.existHasRead(userId, sendInfoId);
		if(!existRead){
			this.bringBackWithoutCheckRead(userId, sendInfoId);
		}
		else{
			throw new Exception("接收人已读文件, 无法取回");
		}
	} 
	
	private void bringBackWithoutCheckRead(String userId, String sendInfoId){
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();	
			String updateReceiveSql = "update fl_receivefile set hasbringback = 'Y' where sendfileid=" + SysConfig.getParamPrefix() + "sendid";
			HashMap<String, Object> updateReceiveP2vs = new HashMap<String, Object>();
			updateReceiveP2vs.put("sendid", sendInfoId);
			this.getDBParserAccess().update(getDBSession(), updateReceiveSql, updateReceiveP2vs);
			
			Date currentTime = new Date();
			String updateSendSql = "update fl_sendfile set hasbringback = 'Y', bringbacktime = " + SysConfig.getParamPrefix() + "bringbacktime where id=" + SysConfig.getParamPrefix() + "sendid";
			HashMap<String, Object> updateSend2vs = new HashMap<String, Object>();
			updateSend2vs.put("bringbacktime", currentTime);
			updateSend2vs.put("sendid", sendInfoId);
			this.getDBParserAccess().update(getDBSession(), updateSendSql, updateSend2vs);
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}		
	}
	
	private boolean existHasRead(String userId, String sendInfoId) throws Exception{
		String sendCoutSql = "select count(sf.id) as sendcount from fl_sendfile sf where sf.id = " + SysConfig.getParamPrefix() + "sendid and sf.fromuserid = " + SysConfig.getParamPrefix() + "fromuserid";
		HashMap<String, Object> sendCountP2vs = new HashMap<String, Object>();
		sendCountP2vs.put("sendid", sendInfoId);
		sendCountP2vs.put("fromuserid", userId);
		int sendCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), sendCoutSql, sendCountP2vs)).intValue();
		if(sendCount == 0){
			throw new Exception("当前登录用户没有权限取回.");
		}
		else{
			String hasReadSql = "select count(rf.id) as receivecount from fl_receivefile rf where rf.sendfileid = " + SysConfig.getParamPrefix() + "sendid and rf.hasread = 'Y'";
			HashMap<String, Object> hasReadP2vs = new HashMap<String, Object>();
			hasReadP2vs.put("sendid", sendInfoId);
			int existHasReadCount = ((BigInteger)this.getDBParserAccess().selectOne(getDBSession(), hasReadSql, hasReadP2vs)).intValue();
			return existHasReadCount > 0;
		}
	}
	
	//邀请并创建用户
	public HashMap<String, String> inviteAndCreateUser(INcpSession session, List<String> toUserEmails) throws SQLException {
		String inviteByUserId = session.getUserId();
		return this.inviteAndCreateUser(inviteByUserId, toUserEmails);
	}
	
	//邀请并创建用户
	private HashMap<String, String> inviteAndCreateUser(String inviteByUserId, List<String> toUserEmails) throws SQLException {
		HashMap<String, String> emailToUserIds = new HashMap<String, String>(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();	
			for(int i = 0; i < toUserEmails.size(); i++){
				String email = toUserEmails.get(i);
				String toUserId = this.createUserOnInvite(email, inviteByUserId);
				emailToUserIds.put(email, toUserId);
			}
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}	 
		this.sendEmailOnInvite(inviteByUserId, toUserEmails);
		return emailToUserIds;
	}	
	
	//发送邀请函，邀请用户使用系统
	private void sendEmailOnInvite(String fromUserId, List<String> toUserEmails) throws SQLException{
		DataRow fromUserInfo = this.getUserInfoById(fromUserId);
		String fromUserName = fromUserInfo.getStringValue("name");
		Date currentTime = new Date();
		for(int i = 0; i < toUserEmails.size(); i++){
			String toUserEmail = toUserEmails.get(i);  		
			HashMap<String, String> keyValues = new HashMap<String, String>();
			keyValues.put("fromUserName", fromUserName);
			keyValues.put("toUserName", toUserEmail);  
			keyValues.put("toUserEmail", toUserEmail);
			keyValues.put("currentTime", ValueConverter.dateTimeToString(currentTime, "yyyy-MM-dd HH:mm"));
			String emailContent = this.getEmailContent(this.getEmailFormatWhenInvite(), keyValues);
			this.sendEmail(toUserEmail, emailContent);
		}
	}	
	
	//创建新用户，并赋予普通用户角色（邀请时调用）
	private String createUserOnInvite(String email, String inviteUserId){
		Date currentTime = new Date();
		String userCode = "User" +ValueConverter.dateTimeToString(currentTime, "yyyyMMddHHmmssSSSS") + this.getNumberRandomCode(4);
		String inviteCode = this.getNumberRandomCode(this.getInviteCodeLength());
		String password = SecurityUtils.enCryption(userCode + inviteCode);
		Data userData = DataCollection.getData("d_User");
		HashMap<String, Object> userFieldValues = new HashMap<String, Object>();
		userFieldValues.put("code", userCode);
		userFieldValues.put("invitecode", inviteCode);
		userFieldValues.put("email", email);
		userFieldValues.put("password", password);
		userFieldValues.put("isusing", "Y");
		userFieldValues.put("isactive", "N");
		String userId = this.getDBParserAccess().insertByData(getDBSession(), userData, userFieldValues);

		Data userRoleData = DataCollection.getData("d_UserRole");
		HashMap<String, Object> userRoleFieldValues = new HashMap<String, Object>();
		userRoleFieldValues.put("userid", userId);
		userRoleFieldValues.put("roleid", this.getCommonUserRoleId());
		this.getDBParserAccess().insertByData(getDBSession(), userRoleData, userRoleFieldValues);
		return userId; 
	}
	
	//获取length长度的随机数字
	private String getNumberRandomCode(int length){
		StringBuilder codeStr = new StringBuilder();
		long seed = (new Date()).getTime();
		Random random = new Random(seed);
		for(int i = 0; i < length; i++){
			int value = random.nextInt(10);
			codeStr.append(value);
		}
		return codeStr.toString();
	}
	
	//根据email获取用户信息（批量）
	public JSONArray getUserInfoByEmail(INcpSession session, List<String> emails) throws SQLException, UnsupportedEncodingException { 
		HashMap<String, DataRow> emailToUserInfos = this.getUserInfoByEmail(emails);
		JSONArray userInfoArray = new JSONArray();
		for(int i = 0; i < emails.size(); i++){
			String email = emails.get(i);
			DataRow userInfo = emailToUserInfos.get(email);
			JSONObject userInfoObj = new JSONObject();
			userInfoObj.put("name", userInfo == null ? "" : CommonFunction.encode(userInfo.getStringValue("name")));
			userInfoObj.put("id", userInfo == null ? "" : userInfo.getStringValue("id")); 
			userInfoObj.put("email", email); 
			userInfoArray.add(userInfoObj);
		}
		return userInfoArray;
	}
	
	//根据email获取用户信息（批量）
	public HashMap<String, DataRow> getUserInfoByEmail(List<String> emails) throws SQLException {
		HashMap<String, DataRow> emailToUserInfos = new HashMap<String, DataRow>();
		for(int i = 0; i < emails.size(); i++){
			String email = emails.get(i);
			DataRow userInfoRow = this.getUserInfoByEmail(email);
			emailToUserInfos.put(email, userInfoRow);
		}
		return emailToUserInfos;
	}
	
	//根据email获取用户信息
	public DataRow getUserInfoByEmail(String email) throws SQLException {
		String sql = "select u.id as id, u.name as name, u.code as code, u.email as email from d_user u where u.email = " + SysConfig.getParamPrefix() + "email and u.isusing = 'Y'";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("email", email);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("email");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("email", ValueType.String);
				
		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}
	
	//获取用户信息
	public DataRow getUserInfoById(String id) throws SQLException {
		String sql = "select u.id as id, u.name as name, u.code as code, u.email as email from d_user u where u.id = " + SysConfig.getParamPrefix() + "id and u.isusing = 'Y'";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", id);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("email");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("name", ValueType.String);
		valueTypes.put("code", ValueType.String);
		valueTypes.put("email", ValueType.String);
				
		DataTable dt = this.getDBParserAccess().selectList(getDBSession(), sql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		return rows.size() == 0 ? null : rows.get(0);
	}
	
	//创建rootDirType类型的根目录
	public String createRootDir(INcpSession session, RootDirType rootDirType) throws SQLException, NcpException {
		String userId = session.getUserId();
		return this.createRootDir(userId, rootDirType);
	}
	
	//创建rootDirType类型的根目录
	public String createRootDir(String userId, RootDirType rootDirType) throws SQLException, NcpException{
		String rootDirId = null;
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();			
			rootDirId = this.getRootDirId(userId, rootDirType);
			if(rootDirId == null){
				rootDirId = this.createDir(userId, rootDirType.toString(), null, true, false, FileUseType.system);
			}
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}	 
		return rootDirId;
	}
	
	//获取rootDirType类型的根目录的id
	public String getRootDirId(String userId, RootDirType rootDirType) throws SQLException, NcpException{		 
		String queryRootDirSql = "select f.id as id from fl_userfile f where f.parentid is null and f.ownerid = " + SysConfig.getParamPrefix() + "ownerid and name = " + SysConfig.getParamPrefix() + "dirtype";		
		HashMap<String, Object> queryP2vs = new HashMap<String, Object>();
		queryP2vs.put("ownerid", userId);
		queryP2vs.put("dirtype", rootDirType.toString());		
		String rootDirId = (String)this.getDBParserAccess().selectOne(getDBSession(), queryRootDirSql, queryP2vs);			 
		return rootDirId == null || rootDirId.length() == 0 ? null : rootDirId;
	}
}
