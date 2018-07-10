package com.novacloud.novaone.service;
 
public interface IDataService extends IServiceInterface  {
	
	String getInputStatus();
	
	String getList();
	
	String add();
	
	String select(); 
	
	String save();
	
	String delete();
	
	String doOtherAction();
}
