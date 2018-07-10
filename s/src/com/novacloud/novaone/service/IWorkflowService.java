package com.novacloud.novaone.service;
 
public interface IWorkflowService extends IServiceInterface  { 
 
	String saveWorkflow();
 
	String getWorkflow(); 
	
	String getDocFields();

	String deleteWorkflow();
}
