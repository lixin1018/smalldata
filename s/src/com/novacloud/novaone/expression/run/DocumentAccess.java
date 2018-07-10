package com.novacloud.novaone.expression.run;
 
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IDocumentBaseDao;

public class DocumentAccess implements IDocumentAccess {
	public IDocumentBaseDao getDocumentDao(String sheetName){
		IDocumentBaseDao documentDao = ContextUtil.containsBean(sheetName) ? (IDocumentBaseDao)ContextUtil.getBean(sheetName) :  (IDocumentBaseDao)ContextUtil.getBean("documentBaseDao");		 
		return documentDao;
	}
}
