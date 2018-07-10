package com.novacloud.novaone.service;
 
public interface IImportExportService extends IServiceInterface  { 
  
	String readVersion();

	String activateVersion();

	String createVersion();

	String updateVersion();

	String copyVersion();

	String deleteVersion();

	String validateVersion();
}
