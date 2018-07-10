package com.test.workflow;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;

import org.hibernate.Session;

import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.expression.run.ExternalBase; 

public class TestDoc1Workflow extends ExternalBase {
	public boolean updateTestDoc1Table(String id) throws SQLException{ 
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		String getNoteSql = "select td.note from test_doc1 td where td.id = " + SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> getNoteP2vs = new HashMap<String, Object>();
		getNoteP2vs.put("id", id);
		String note = (String)dbParserAccess.selectOne(dbSession, getNoteSql, getNoteP2vs);
		note += (", " + ValueConverter.dateTimeToString(new Date(), "yyyyMMddHHmmss"));
		
		String updateNoteSql = "update test_doc1 set note = " + SysConfig.getParamPrefix() + "note where id = " +  SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> updateNoteP2vs = new HashMap<String, Object>();
		updateNoteP2vs.put("id", id);
		updateNoteP2vs.put("note", note);
		dbParserAccess.update(dbSession, updateNoteSql, updateNoteP2vs);	
		return true;	
	}
}
