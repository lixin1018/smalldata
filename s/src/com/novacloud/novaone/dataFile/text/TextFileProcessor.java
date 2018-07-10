package com.novacloud.novaone.dataFile.text;
 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileBaseProcessor;
import com.novacloud.novaone.dataFile.FileType;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.IFileBaseProcessor;  

public class TextFileProcessor extends FileBaseProcessor {
	public String getDefaultApplicationVersion(){
		return "1.0.0";
	}
	
	public String getDefaultApplicationName(){
		return "textEditor";
	}
	
	@Override
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys, boolean isHidden, FileUseType useType) throws Exception {
		String fileContent = "This is a text file.";
		
		String userId = session.getUserId();
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.setDBSession(getDBSession());
		
		String fileId = dataFileProcessor.createFile(userId, name, FileType.text, fileContent, parentId, isSys, isHidden, useType, this.getDefaultApplicationName(), this.getDefaultApplicationVersion(), "");
		return fileId;
	} 
}