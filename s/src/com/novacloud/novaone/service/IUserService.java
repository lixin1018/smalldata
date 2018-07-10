package com.novacloud.novaone.service;
 
public interface IUserService extends IServiceInterface {  	
	
	String login();
	
	String logout();
	
	String changePassword();
	
	String getMenu();
	
	String getSysParam();

	String markUserMessage();

	String getUserInfo();

	String changeUserInfo(); 
}
