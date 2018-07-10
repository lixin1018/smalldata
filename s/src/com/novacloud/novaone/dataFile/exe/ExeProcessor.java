package com.novacloud.novaone.dataFile.exe;
 
import java.util.HashMap;

import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.dao.db.DataRow; 
import com.novacloud.novaone.dataFile.FileBaseProcessor; 
import com.novacloud.novaone.dataFile.FileUseType;  

public class ExeProcessor extends FileBaseProcessor {
	public void setConfigParameterValues(INcpSession session, String exeId, HashMap<String, String> paramValues) throws Exception{
		String userId = session.getUserId();
		String configText = this.readFile(session, exeId);
		ExeConfig config = ExeConfig.loadFrom(configText);
		for(String param : paramValues.keySet()){
			String value = paramValues.get(param);
			config.setParameterValue(param, value);
		}
		String newConfigText = config.toString();
		this.getDataFileProcessor().setDBSession(getDBSession());
		DataRow exeFileRow = this.getDataFileProcessor().getDirAndFileInfoById(userId, exeId);
		String name = exeFileRow.getStringValue("name");
		String applicationName = exeFileRow.getStringValue("applicationName");
		String applicationVersion = exeFileRow.getStringValue("applicationVersion");
		String property = exeFileRow.getStringValue("property");
		this.getDataFileProcessor().saveFile(userId, exeId, name, newConfigText, false, false, FileUseType.application, applicationName, applicationVersion, property);
	}
	
	public ExeConfig loadConfig(INcpSession session, String exeId) throws Exception{ 
		String userId = session.getUserId();
		this.getDataFileProcessor().setDBSession(getDBSession());
		String configText = this.getDataFileProcessor().readFile(userId, exeId);
		ExeConfig config = ExeConfig.loadFrom(configText);
		return config;
	}

	@Override
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys,
			boolean isHidden, FileUseType useType) throws Exception {
		// 尚未实现
		return null;
	}
}