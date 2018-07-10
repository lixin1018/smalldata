package com.novacloud.novaone.service;

public interface IDataFileService {

	String createDir();

	String createFile();

	String moveTo();

	String copyTo();

	String delete();

	String rename();

	String getChildren();

	String getPath(); 

	String getDirAndFileInfo();

	String sendTo();  

	String markRead();

	String inviteAndCreateUser();

	String getUserInfoByEmail(); 

	String getSendInfos();

	String getReceiveInfos();

	String saveAs();

}
