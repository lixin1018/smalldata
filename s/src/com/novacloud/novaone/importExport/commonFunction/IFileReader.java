package com.novacloud.novaone.importExport.commonFunction;

import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;

import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.importExport.definition.ExcelParser;
import com.novacloud.novaone.importExport.definition.FileParser;
import com.novacloud.novaone.model.sysmodel.Data;

public interface IFileReader {

	List<String[]> getSourceData(String filePath, FileParser fileParser) throws Exception;
 
	void batchInsertToDB(Session dbSession, IDBParserAccess dbParserAccess, Data dataModel, List<String[]> batchRows, HashMap<String, String> itemName2DbName, String importInstanceId) throws Exception;

	void checkValueLength(List<String[]> allMemoRows, HashMap<String, String> itemName2DbName, HashMap<String, Integer> dbFieldNameToLength) throws Exception;

}
