package com.novacloud.novaone.dataFile;

import java.util.Date;

import org.hibernate.Session;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpSession;

import net.sf.json.JSONObject;

public interface IFileBaseProcessor {
	String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys, boolean isHidden, FileUseType useType) throws Exception;

	void setDBSession(Session dbSession);

	void saveFile(INcpSession session, String fileId, String fileContent, String title, String applicationName, String applicationVersion, String property) throws Exception;

	String readFile(INcpSession session, String fileId) throws Exception;

	void beforeSaveFile(INcpSession session, String fileId, String fileContent, String title, String applicationName, String applicationVersion, String property) throws Exception;

	void beforeReadFile(INcpSession session, String fileId) throws Exception;

	void afterSaveFile(INcpSession session, String fileId, String applicationName, String applicationVersion, String property) throws Exception;

	String afterReadFile(INcpSession session, String fileId, String fileContent) throws Exception;

	JSONObject getFileInfo(INcpSession session, String fileId) throws Exception;
}
