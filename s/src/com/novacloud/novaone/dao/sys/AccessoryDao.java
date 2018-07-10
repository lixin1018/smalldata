package com.novacloud.novaone.dao.sys;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.fileupload.util.Streams;
import org.hibernate.Session;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

public class AccessoryDao implements IAccessoryDao{

	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	private FileOperate fileOperate; 
	public void setFileOperate(FileOperate fileOperate) {
		this.fileOperate = fileOperate;
	}  
	private FileOperate getFileOperate() {
		return this.fileOperate;
	}
	
	private Session dbSession = null;
	protected Session getDBSession(){ 
		if(this.dbSession == null){
			throw new RuntimeException("none db session.");
		}
		return this.dbSession;
	} 
	public void setDBSession(Session dbSession){
		this.dbSession = dbSession;
	}
	
	private String uploadFileDir = "";
	public String getUploadFileDir() {
		return uploadFileDir;
	}
	public void setUploadFileDir(String uploadFileDir) {
		this.uploadFileDir = uploadFileDir;
	}
	
	
	public String getFilePathByNameAndUploadTime(String name, Date uploadTime, String millisecond){
        SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMddHHmmss");   
        String  uploadTimeStr = sdfFileName.format(uploadTime);
        String filePath = this.getUploadFileDir() + uploadTimeStr.substring(0, 8) + "/" + uploadTimeStr.substring(8) + millisecond + name;
        return filePath;
	}
	
	public String getDirPathByNameAndUploadTime(String name, Date uploadTime){
        SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMdd");   
        String  uploadDateStr = sdfFileName.format(uploadTime);
        String dirPath = this.getUploadFileDir() + uploadDateStr;
        return dirPath;
	}
	
	public String getFilePathById(String id) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id, a.name as name, a.uploadtime as uploadtime, a.millisecond as millisecond from d_accessory a where a.id = " + SysConfig.getParamPrefix()+"id";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", id);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id", "name", "uploadtime", "millisecond"}, new ValueType[]{ValueType.String, ValueType.String, ValueType.Time, ValueType.String});
		List<DataRow> rows = accessoryDt.getRows();
		if(rows.size() == 0){
			throw new Exception("none accessory。 id="+id);
		}
		else{
			DataRow row = rows.get(0);
			String name = row.getStringValue("name");
			String millisecond = row.getStringValue("millisecond");
			Date uploadTime = row.getDateTimeValue("uploadtime");
			return this.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
		}		
	}
	
	public String getFilePath(String id, String filterType, String filterValue, String uploadUserId) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id, a.name as name, a.uploadtime as uploadtime, a.millisecond as millisecond from d_accessory a where a.id = " + SysConfig.getParamPrefix()+"id"
				+ " and a.filtertype = " + SysConfig.getParamPrefix()+"filtertype"
				+ " and a.filtervalue = " + SysConfig.getParamPrefix()+"filtervalue"
				+ " and a.uploaduserid = " + SysConfig.getParamPrefix()+"uploaduserid";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", id);
		p2vs.put("filtertype", filterType);
		p2vs.put("filtervalue", filterValue);
		p2vs.put("uploaduserid", uploadUserId);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id", "name", "uploadtime", "millisecond"}, new ValueType[]{ValueType.String, ValueType.String, ValueType.Time, ValueType.String});
		List<DataRow> rows = accessoryDt.getRows();
		if(rows.size() == 0){
			throw new Exception("none accessory。 id="+id);
		}
		else{
			DataRow row = rows.get(0);
			String name = row.getStringValue("name");
			String millisecond = row.getStringValue("millisecond");
			Date uploadTime = row.getDateTimeValue("uploadtime");
			return this.getFilePathByNameAndUploadTime(name, uploadTime, millisecond);
		}		
	}
	
	public DataRow getAccessoryDataRow(String id, String filterType, String filterValue, String uploadUserId) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id, a.name as name, a.uploadtime as uploadtime, a.millisecond as millisecond from d_accessory a where a.id = " + SysConfig.getParamPrefix()+"id"
				+ " and a.filtertype = " + SysConfig.getParamPrefix()+"filtertype"
				+ " and a.filtervalue = " + SysConfig.getParamPrefix()+"filtervalue"
				+ " and a.uploaduserid = " + SysConfig.getParamPrefix()+"uploaduserid";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("id", id);
		p2vs.put("filtertype", filterType);
		p2vs.put("filtervalue", filterValue);
		p2vs.put("uploaduserid", uploadUserId);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id", "name", "uploadtime", "millisecond"}, new ValueType[]{ValueType.String, ValueType.String, ValueType.Time, ValueType.String});
		List<DataRow> rows = accessoryDt.getRows();
		if(rows.size() == 0){
			throw new Exception("none accessory。 id="+id);
		}
		else{
			return rows.get(0);
		}		
	}

	public String[] getFilePathByFilter(String filterType, String filterValue) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id, a.name as name, a.uploadtime as uploadtime, a.millisecond as millisecond from d_accessory a where a.filtertype = " + SysConfig.getParamPrefix()+"filtertype and a.filtervalue = " + SysConfig.getParamPrefix()+"filtervalue";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("filtertype", filterType);
		p2vs.put("filtervalue", filterValue);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id", "name", "uploadtime", "millisecond"}, new ValueType[]{ValueType.String, ValueType.String, ValueType.Time, ValueType.String});
		List<DataRow> rows = accessoryDt.getRows();
		List<String> filePaths = new ArrayList<String>(); 
		for(DataRow row : rows){ 
			String name = row.getStringValue("name");
			String millisecond = row.getStringValue("millisecond");
			Date uploadTime = row.getDateTimeValue("uploadtime");
			filePaths.add(this.getFilePathByNameAndUploadTime(name, uploadTime, millisecond));
		}
		return (String[])filePaths.toArray();
	}

	public String[] getAccessoryIds(String filterType, String filterValue) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id from d_accessory a where a.filtertype = " + SysConfig.getParamPrefix() + "filtertype and a.filtervalue = " + SysConfig.getParamPrefix()+"filtervalue";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("filtertype", filterType);
		p2vs.put("filtervalue", filterValue);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id"}, new ValueType[]{ValueType.String});
		List<DataRow> rows = accessoryDt.getRows();
		List<String> ids = new ArrayList<String>(); 
		for(DataRow row : rows){ 
			String id = row.getStringValue("id"); 
			ids.add(id);
		}
		return (String[])ids.toArray();
	}
	
	public int getFileCountByFilter(String filterType, String filterValue) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "select a.id as id, a.name as name, a.uploadtime as uploadtime from d_accessory a where a.filtertype = " + SysConfig.getParamPrefix()+"filtertype and a.filtervalue = " + SysConfig.getParamPrefix()+"filtervalue";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("filtertype", filterType);
		p2vs.put("filtervalue", filterValue);
		DataTable accessoryDt = dbAccess.getMultiLineValues(this.getDBSession(), sql, p2vs, new String[]{"id", "name", "uploadtime"}, new ValueType[]{ValueType.String, ValueType.String, ValueType.Time});
		return accessoryDt.getRows().size();
	}
	
	public String insertAccessoryRow(NcpSession session, String name, Date uploadTime, String millisecond, String filterType, String filterValue) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess(); 
		Data data = DataCollection.getData("d_Accessory");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		String fileType = name.substring (name.lastIndexOf (".") + 1);
		fieldValues.put("name", name);
		fieldValues.put("filetype", fileType);
		fieldValues.put("uploadtime", uploadTime); 
		fieldValues.put("millisecond", millisecond);
		fieldValues.put("filtertype", filterType);
		fieldValues.put("filtervalue", filterValue);
		fieldValues.put("isdeleted", "N");
		fieldValues.put("uploaduserid", session.getUserId());
		return dbAccess.insertByData(this.getDBSession(), data, fieldValues);
	} 
	
	public String saveAccessory(NcpSession session, InputStream inputStream, String fileName, String filterType, String filterValue) throws Exception{
		Date uploadTime = new Date();
		System.out.println((new SimpleDateFormat("HHmmss")).format(uploadTime));
		String dirPath = this.getDirPathByNameAndUploadTime(fileName, uploadTime); 
		this.getFileOperate().createFolder(dirPath); 
        SimpleDateFormat sdfFileName = new SimpleDateFormat("SSS");
        String millisecond = sdfFileName.format(uploadTime);
		String filePath = this.getFilePathByNameAndUploadTime(fileName, uploadTime, millisecond);
		System.out.println(filePath);
		BufferedInputStream in = new BufferedInputStream(inputStream);// 获得文件输入流  
        BufferedOutputStream outStream = new BufferedOutputStream(new FileOutputStream(filePath));// 获得文件输出流  
        Streams.copy(in, outStream, true);// 开始把文件写到你指定的上传文件夹 
        return this.insertAccessoryRow(session, fileName, uploadTime, millisecond, filterType, filterValue);
	}
	
	public void deleteAccessory(String id) throws Exception{
		IDBParserAccess dbAccess = this.getDBParserAccess();
		String sql = "update d_accessory set isdeleted = 'Y' where id = " + SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> ps = new HashMap<String, Object>();
		ps.put("id", id);
		dbAccess.update(this.getDBSession(), sql, ps);
	}
}
