package com.novacloud.novaone.dao.sys;

import java.io.InputStream;
import java.util.Date;

import org.hibernate.Session;

import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dao.db.DataRow; 

public interface IAccessoryDao { 
	void setDBSession(Session dbSession);
	String getFilePathByNameAndUploadTime(String name, Date uploadTime, String millisecond);
	String getDirPathByNameAndUploadTime(String name, Date uploadTime);
	String getFilePathById(String id) throws Exception; 
	String getFilePath(String id, String filterType, String filterValue, String uploadUserId) throws Exception; 
	DataRow getAccessoryDataRow(String id, String filterType, String filterValue, String uploadUserId) throws Exception; 
	String[] getFilePathByFilter(String filterType, String filterValue) throws Exception;
	int getFileCountByFilter(String filterType, String filterValue) throws Exception;
	String[] getAccessoryIds(String filterType, String filterValue) throws Exception;
	void deleteAccessory(String id) throws Exception;
	String saveAccessory(NcpSession session, InputStream inputStream, String fileName, String filterType, String filterValue) throws Exception;
}
