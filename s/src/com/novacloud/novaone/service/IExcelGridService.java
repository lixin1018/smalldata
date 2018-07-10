package com.novacloud.novaone.service;
 
public interface IExcelGridService extends IServiceInterface  { 
  
	String readVersion();

	String activateVersion();

	String createVersion();

	String updateVersion();

	String copyVersion();

	String deleteVersion(); 
	
	String getDefinitionCount();

	String validateAndGenerateByUploadExcel();

	String deleteDefinition();

	String inactivateVersion();

	String getIsEnableVersion();
}
