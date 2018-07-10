package com.novacloud.novaone.expression.run;

import org.hibernate.Session;

import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ISequenceGenerator;

public interface IDatabaseAccess {
	Session getSession(); 
	
	void openSession(); 
	
	Session newSession(); 
	
	void setSession(Session session); 
	
	IDBParserAccess getDBParserAccess(); 
	
	ISequenceGenerator getSequenceGenerator(); 
}
