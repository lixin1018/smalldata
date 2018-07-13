package com.novacloud.novaone.dataFile.webExcel;
 
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IAccessoryDao;
import com.novacloud.novaone.dataFile.DataFileProcessor;
import com.novacloud.novaone.dataFile.FileBaseProcessor;
import com.novacloud.novaone.dataFile.FileType;
import com.novacloud.novaone.dataFile.FileUseType;
import com.novacloud.novaone.dataFile.IFileBaseProcessor;
import com.novacloud.novaone.dataFile.RootDirType;
import com.novacloud.novaone.excelGrid.definition.ConvertExcelToExcelGridProcessor;
import com.novacloud.novaone.excelGrid.definition.ExcelGrid;
import com.novacloud.novaone.excelGrid.definition.ExcelGridValidateResult;

import net.sf.json.JSONObject;  

public class WebExcelFileProcessor extends FileBaseProcessor{
	
	public String getDefaultApplicationVersion(){
		return "1.0.0";
	}
	
	public String getDefaultApplicationName(){
		return "webExcelEditor";
	}

	//附件处理接口
	private IAccessoryDao accessoryDao;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}
	
	//对应附件表里filter字段值
	private String accessoryFilterType = ""; 
	public String getAccessoryFilterType() {
		return accessoryFilterType;
	}
	public void setAccessoryFilterType(String accessoryFilterType) {
		this.accessoryFilterType = accessoryFilterType;
	}
	
	//excel转换为excelgrid
	private ConvertExcelToExcelGridProcessor convertExcelToExcelGridProcessor;
	public ConvertExcelToExcelGridProcessor getConvertExcelToExcelGridProcessor(String fileType) throws Exception {
		if(convertExcelToExcelGridProcessor == null){
			switch(fileType){
				case "xls":
					convertExcelToExcelGridProcessor = (ConvertExcelToExcelGridProcessor)ContextUtil.getBean("convertExcelXlsToExcelGridProcessor");
				break;
				case "xlsx":
					convertExcelToExcelGridProcessor = (ConvertExcelToExcelGridProcessor)ContextUtil.getBean("convertExcelXlsxToExcelGridProcessor");
				break;
				default:
					throw new Exception("无法为 " + fileType + " 类型的文件创建Excel读取实例"); 
			}
		}
		return convertExcelToExcelGridProcessor;
	} 
	
	@Override
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys, boolean isHidden, FileUseType useType) throws Exception {
		ExcelGrid excelGrid = ExcelGrid.createNewExcelGrid(50, 10, 20, 80);
		JSONObject excelGridJsonObj = excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		
		String userId = session.getUserId();
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.setDBSession(getDBSession());
		
		String fileId = dataFileProcessor.createFile(userId, name, FileType.webExcel, excelGridJsonStr, parentId, isSys, isHidden, useType, this.getDefaultApplicationName(), this.getDefaultApplicationVersion(), "");
		return fileId;
	}  

	
	public List<String> getExcelSheetNames(INcpSession session, String accessoryId) throws Exception {
		Workbook wb = this.getExcelWorkbookByAccessoryId(session, accessoryId);
		int sheetCount = wb.getNumberOfSheets();
		List<String> allSheetNames = new ArrayList<String>();
		for(int i = 0; i < sheetCount; i++){
			String sheetName = wb.getSheetName(i);
			allSheetNames.add(sheetName);
		}
		return allSheetNames;
	}
	
	private Workbook getExcelWorkbookByAccessoryId(INcpSession session, String accessoryId) throws Exception{	
		this.accessoryDao.setDBSession(this.getDBSession());
		String userId = session.getUserId();
		DataRow accessoryRow = this.getAccessoryDao().getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		String fileName = accessoryRow.getStringValue("name");
		String millisecond = accessoryRow.getStringValue("millisecond");
		Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
		String fileType = accessoryRow.getStringValue("filetype");

		String excelFilePath = this.getAccessoryDao().getFilePathByNameAndUploadTime(fileName, uploadTime, millisecond);
		//String excelFilePath = this.accessoryDao.getFilePath(accessoryId, this.getAccessoryFilterType(), "", session.getUserId());			
		return this.getConvertExcelToExcelGridProcessor(fileType).getExcelWorkbookByFilePath(session, excelFilePath);
	} 
	
	//验证并生成ExcelGrid和ExcelGridVersion
	public String validateAndGenerateByUploadExcel(INcpSession session, String dirId, String accessoryId, List<String> sheetNames) throws Exception { 
		
		String userId = session.getUserId();
		this.getAccessoryDao().setDBSession(this.getDBSession());
		DataRow accessoryRow = this.getAccessoryDao().getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		String fileName = accessoryRow.getStringValue("name");
		String millisecond = accessoryRow.getStringValue("millisecond");
		Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
		String fileType = accessoryRow.getStringValue("filetype");

		String excelFilePath = this.getAccessoryDao().getFilePathByNameAndUploadTime(fileName, uploadTime, millisecond);
		ExcelGrid excelGrid = this.getConvertExcelToExcelGridProcessor(fileType).createExcelGridFromExcelFile(session, excelFilePath, sheetNames);
		
		JSONObject excelGridJsonObj = excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		 
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.setDBSession(getDBSession());

		if(dirId == null || dirId.length() == 0){
			dirId = dataFileProcessor.getRootDirId(userId, RootDirType.myDocument);
		}
		

		JSONObject fileObj = new JSONObject();
		boolean hasSameName = dataFileProcessor.hasSameName(fileName, dirId, userId); 
		if(hasSameName){
			Date currentTime = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("HHmmssSSS");
			fileName = fileName + "_" +sdf.format(currentTime);  
		} 
		
		String fileId = dataFileProcessor.createFile(userId, fileName, FileType.webExcel, excelGridJsonStr, dirId, false, false, FileUseType.user, this.getDefaultApplicationName(), this.getDefaultApplicationVersion(), "");
		return fileId;   
	}
}