package com.novacloud.novaone.expression.run;

public interface IExternalBase{
	IDatabaseAccess getDatabaseAccess();

	IDocumentAccess getDocumentAccess();

	ISystemModelAccess getSystemModelAccess();
}
