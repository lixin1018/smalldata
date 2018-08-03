package com.novacloud.novaone.dataFile.webWord;
 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.converter.pdf.PdfConverter;
import org.apache.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.artofsolving.jodconverter.OfficeDocumentConverter;
import org.artofsolving.jodconverter.office.DefaultOfficeManagerConfiguration;
import org.artofsolving.jodconverter.office.OfficeManager;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.FileOperate;
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

public class WebWordFileProcessor extends FileBaseProcessor{
	
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
	
	//OfficeHome
	private String officeHome = ""; 
	public String getOfficeHome() {
		return officeHome;
	}
	public void setOfficeHome(String officeHome) {
		this.officeHome = officeHome;
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
	 
	public DataRow getAccessoryDataRow(INcpSession session, String accessoryId) throws Exception{
		String userId = session.getUserId();
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		DataRow accessoryRow = accessoryDao.getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		return accessoryRow;
	}
	 
	public String getAccessoryFilePath(String accessoryId) throws Exception{ 
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());
		String filePath = accessoryDao.getFilePathById(accessoryId);
		return filePath;
	}
	
	public String createPreviewFile(INcpSession session, String accessoryId) throws Exception {
		String wordFilePath = this.getWordFilePathByAccessoryId(session, accessoryId); 
		String previewFilePath = this.getPreviewFilePath(wordFilePath);
		
		File f = new File(previewFilePath);
		if(!f.exists()){
			word2007ToPdf(wordFilePath, previewFilePath);
		}
			
		String userId = session.getUserId();
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession());

		DataRow accessoryRow = accessoryDao.getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		String fileName = accessoryRow.getStringValue("name"); 
		
		DataFileProcessor dataFileProcessor = this.getDataFileProcessor();
		dataFileProcessor.setDBSession(getDBSession());

		String dirId = dataFileProcessor.getRootDirId(userId, RootDirType.myDocument);			

		JSONObject fileObj = new JSONObject();
		boolean hasSameName = dataFileProcessor.hasSameName(fileName, dirId, userId); 
		if(hasSameName){
			Date currentTime = new Date();
			SimpleDateFormat sdf = new SimpleDateFormat("HHmmssSSS");
			fileName = fileName + "_" +sdf.format(currentTime);  
		}  
		
	    String fileId = dataFileProcessor.createFile(userId, fileName, FileType.webWord, accessoryId, dirId, false, false, FileUseType.user, this.getDefaultApplicationName(), this.getDefaultApplicationVersion(), "");
	    return fileId;
	} 

	public void word2007ToPdf(String wordFilePath, String pdfFilePath) throws Exception { 
		InputStream source = null;
		OutputStream target = null;
		try { 
			OfficeManager officeManager = new DefaultOfficeManagerConfiguration()
				     .setOfficeHome(this.getOfficeHome())
				     .buildOfficeManager();
			officeManager.start();
			 
			OfficeDocumentConverter converter = new OfficeDocumentConverter(officeManager);
			converter.convert(new File(wordFilePath), new File(pdfFilePath));
	    } 
		catch(Exception ex){
			throw ex;
		}
		finally { 
	    	if (source != null) { 
	    		source.close(); 
		    } 
	    	if (target != null) { 
	    		target.close(); 
		    } 
		}
	} 
    
	private String getPreviewFilePath(String wordFilePath){
		return wordFilePath + ".pdf";
	}
	
	private String getWordFilePathByAccessoryId(INcpSession session, String accessoryId) throws Exception{	
		IAccessoryDao accessoryDao = this.getAccessoryDao();
		accessoryDao.setDBSession(this.getDBSession()); 
		String userId = session.getUserId();
		DataRow accessoryRow = accessoryDao.getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		String fileName = accessoryRow.getStringValue("name");
		String millisecond = accessoryRow.getStringValue("millisecond");
		Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");
		String fileType = accessoryRow.getStringValue("filetype");

		String excelFilePath = this.getAccessoryDao().getFilePathByNameAndUploadTime(fileName, uploadTime, millisecond);
		return excelFilePath;
	}
 
	

	@Override
	public String createNewFile(INcpSession session, String name, String fileTypeName, String parentId, boolean isSys,
			boolean isHidden, FileUseType useType) throws Exception { 
		return null;
	} 
	 
}