package com.novacloud.novaone.excelGrid.expression.run;
 

public class ExternalBase implements IExternalBase{
	private IDatabaseAccess databaseAccess;
	public void setDatabaseAccess(IDatabaseAccess databaseAccess){
		this.databaseAccess = databaseAccess;
	}
	public IDatabaseAccess getDatabaseAccess(){
		return this.databaseAccess;
	}
}
