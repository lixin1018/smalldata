package com.novacloud.novaone.dbDataProcess;
  
 
import org.hibernate.Session;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.dataFile.FileUseType;  

public interface IDbDataProcessor{ 
	public String getDefaultApplicationVersion();
	
	public String getDefaultApplicationName();
	public void setDBSession(Session dbSession);

	public static int endThreadCount = 0;
	public static int threadCount = 0;
	 
	public void matchedPerson(INcpSession session) throws Exception; 
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys, boolean isHidden, FileUseType useType) throws Exception;
}