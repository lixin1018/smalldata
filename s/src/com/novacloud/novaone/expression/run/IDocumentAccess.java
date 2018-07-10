package com.novacloud.novaone.expression.run;
 
import com.novacloud.novaone.dao.sys.IDocumentBaseDao;

public interface IDocumentAccess{
	IDocumentBaseDao getDocumentDao(String documentName);
}
