package com.novacloud.dataHelper.export;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import com.Ostermiller.util.MD5;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.DataBaseDao;
import com.novacloud.novaone.importExport.commonFunction.BigExcelWriter;
import com.novacloud.novaone.importExport.commonFunction.ExcelWriter;
import com.novacloud.novaone.importExport.definition.DataType;
import com.novacloud.novaone.importExport.definition.ExcelColumn;
import com.novacloud.novaone.importExport.definition.ExcelParser;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.model.sysmodel.DataField;
import com.novacloud.novaone.model.sysmodel.View;
import com.novacloud.novaone.model.sysmodel.ViewCollection;
import com.novacloud.novaone.model.sysmodel.ViewDispunit;

import net.sf.json.JSONArray; 

//单个任务执行类
public class ExportRunnerThread extends Thread {

	private static Logger logger=Logger.getLogger(ExportRunnerThread.class);
	
	private String orderLineId;
	public String getOrderLineId() {
		return orderLineId;
	}
	public void setOrderLineId(String orderLineId) {
		this.orderLineId = orderLineId;
	}
	
	private String definitionId;
	public String getDefinitionId() {
		return definitionId;
	}
	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}
	
	private String dataName;
	public String getDataName() {
		return dataName;
	}
	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	
	private String dataFilter;
	public String getDataFilter() {
		return dataFilter;
	}
	public void setDataFilter(String dataFilter) {
		this.dataFilter = dataFilter;
	}
	
	private int totalRowCount;
	public int getTotalRowCount() {
		return totalRowCount;
	}
	public void setTotalRowCount(int totalRowCount) {
		this.totalRowCount = totalRowCount;
	}   

	private int onePageRowSize = 1000;
	public int getOnePageRowSize() {
		return this.onePageRowSize;
	}
	
	private String getOrderExportFilePath(String definitionId, String fileName){
		
		return this.getOrderExportRootFileFolder() + "\\" + definitionId + "\\" + fileName + ".xlsx";
	}
	
	private String getOrderExportDirPath(String definitionId){
		
		return this.getOrderExportRootFileFolder() + "\\" + definitionId;
	}
	
	private void createFolder(String dirPath){ 
		File dir =new File(dirPath);   
		if(!dir.exists() && !dir.isDirectory()) {        
			dir.mkdir();    
		}
	}
	
	private String generateFileName(String dataFilter){
		String fileName = MD5.getHashString(dataFilter);
		return fileName;
	}
	
	//待导入文件存储目录
	private static String orderExportRootFileFolder = null;
	private String getOrderExportRootFileFolder(){
		if(ExportRunnerThread.orderExportRootFileFolder == null){
			String definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY);
			ExportRunnerThread.orderExportRootFileFolder = definitionFileDirectory + "\\export";
		}
		return ExportRunnerThread.orderExportRootFileFolder;
	}
	
	private void setExporting(Session dbSession, IDBParserAccess dbAccess, Data orderLineData, String orderLineId, String fileName){
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("exportstarttime", new Date());
		fieldValues.put("exportstatus", ExportStatusType.Exporting.toString());
		fieldValues.put("exportfilename", fileName); 		
		dbAccess.updateByData(dbSession, orderLineData, fieldValues, orderLineId);
	}
	
	private void setExportingProcess(Session dbSession, IDBParserAccess dbAccess, Data orderLineData, String orderLineId, int exportedRowCount){
		HashMap<String, Object> fieldValues = new HashMap<String, Object>(); 
		fieldValues.put("exportedrowcount", exportedRowCount); 		
		dbAccess.updateByData(dbSession, orderLineData, fieldValues, orderLineId);
	}
	
	private void setExported(Session dbSession, IDBParserAccess dbAccess, Data orderLineData, String orderLineId, int exportedRowCount){
		HashMap<String, Object> fieldValues = new HashMap<String, Object>(); 
		fieldValues.put("exportedrowcount", exportedRowCount); 
		fieldValues.put("exportstatus", ExportStatusType.Exported.toString());
		fieldValues.put("exportendtime", new Date());		
		dbAccess.updateByData(dbSession, orderLineData, fieldValues, orderLineId);
		
	}
	
	private void setExportError(Session dbSession, IDBParserAccess dbAccess, Data orderLineData, String orderLineId, String errorLog){
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();  
		fieldValues.put("exportstatus", ExportStatusType.Error.toString());
		fieldValues.put("exportendtime", new Date());		
		fieldValues.put("exportlog", errorLog);		
		dbAccess.updateByData(dbSession, orderLineData, fieldValues, orderLineId);		
	}
	
	@Override
	public void run() {			 
		Session dbSession = null;
		IDBParserAccess dBParserAccess = null;
		Data orderLineData = null;
		try{
			//执行表达式中的函数需要用到数据库连接，此处为这些函数设置数据库连接
			HibernateTransactionManager transactionManager = (HibernateTransactionManager)ContextUtil.getBean("transactionManager");   
			dbSession = transactionManager.getSessionFactory().openSession(); 
			dBParserAccess = (IDBParserAccess)ContextUtil.getBean("dBParserAccess");
			orderLineData = DataCollection.getData("dm_ExportOrderLine");
			String fileName = this.generateFileName(this.getDataFilter());
			this.setExporting(dbSession, dBParserAccess, orderLineData, this.getOrderLineId(), fileName);			
			JSONArray dataFilterArray =JSONArray.fromObject(this.getDataFilter());	
			Data exportDataModel = DataCollection.getData(dataName);
			View exportViewModel = ViewCollection.getView(dataName);
			SelectSqlParser sqlParser = exportDataModel.getDsSqlParser();
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			String userWhere = DataBaseDao.getWhere(dBParserAccess, sqlParser, dataFilterArray, p2vs, "and");
			int pageCount = (int)Math.ceil((double)this.getTotalRowCount() / (double)this.getOnePageRowSize());
			
			String excelDirPath = this.getOrderExportDirPath(this.getDefinitionId());
			this.createFolder(excelDirPath);
			
			String excelFilePath = this.getOrderExportFilePath(this.getDefinitionId(), fileName);
			
			File excelFile = new File(excelFilePath);
			if(!excelFile.exists()){
				//构造导出用的excel格式
				BigExcelWriter ew = new BigExcelWriter(); 
				ExcelParser ep = new ExcelParser();
				List<ExcelColumn> allExcelColumns = new ArrayList<ExcelColumn>();
				HashMap<String, ViewDispunit> allViewUnits = exportViewModel.getDispunits();
				List<ViewDispunit> dispunitList = new ArrayList<ViewDispunit>(); 
	
				for(ViewDispunit dispunit : allViewUnits.values()){ 
					for(int j=0;j<=dispunitList.size();j++){
						if(j==dispunitList.size()){
							dispunitList.add(dispunit);
							break;
						}
						else if(dispunitList.get(j).getColIndex() > dispunit.getColIndex()){
							dispunitList.add(j, dispunit);
							break;
						}
					}
				} 
				for(int i = 0; i < dispunitList.size(); i++) {
					ViewDispunit unit = dispunitList.get(i);
					if(unit.getColVisible()){
					    DataField dataField = exportDataModel.getDataField(unit.getName());
						ExcelColumn ec = new ExcelColumn();
						ec.setItemName(unit.getName());
						ec.setExcelColumnName(unit.getLabel());
						DataType dataType = DataType.String;
						switch(dataField.getValueType()){
							case Decimal: 
								dataType = DataType.Decimal;
								break;
							case Boolean:
								dataType = DataType.Boolean;
								break;
							case Time:
								dataType = DataType.Time;
								break;
							case Date:
								dataType = DataType.Date;
								break;					
							case String:
							case Object:
							default:
								dataType = DataType.String;
								break;
						}
						ec.setDataType(dataType);
						allExcelColumns.add(ec); 
					}
				}
				ep.setColumns(allExcelColumns);
							
				//从数据库中读取数据
				List<HashMap<String, Object>> allRows = new ArrayList<HashMap<String, Object>>();
				for(int i = 0; i < pageCount; i++){
					List<DataRow> onePageRows = this.getRows(dBParserAccess, dbSession, sqlParser, p2vs, userWhere, i + 1, this.getOnePageRowSize());
					for(int j = 0; j < onePageRows.size(); j++){
						DataRow row = onePageRows.get(j);
						HashMap<String, Object> excelRow = new HashMap<String, Object>();
						for(int k = 0; k < allExcelColumns.size(); k++){
							ExcelColumn ec = allExcelColumns.get(k); 
							String fieldName = ec.getItemName();
							Object value = row.getValue(fieldName);
							if(ec.getDataType() == DataType.Boolean){
								value = value == null ? null : ValueConverter.convertToDBObject(value.toString(), ValueType.Boolean);
							}
							excelRow.put(fieldName, value);
						}
						allRows.add(excelRow);
					}
					
					this.setExportingProcess(dbSession, dBParserAccess, orderLineData, this.getOrderLineId(), allRows.size());
				}
				
				
				//保存数据到文件
				ew.saveExcel(excelFilePath, "List", ep, allRows); 
				this.setExported(dbSession, dBParserAccess, orderLineData, this.getOrderLineId(), allRows.size());
			}
			else{
				this.setExported(dbSession, dBParserAccess, orderLineData, this.getOrderLineId(), this.getOnePageRowSize());
			}
		}
		catch(Exception ex){			
			ex.printStackTrace();
			logger.error("ExportRunnerThread run error. orderLineId = " + this.getOrderLineId() + ". error = " + ex.getMessage());
			this.setExportError(dbSession, dBParserAccess, orderLineData, this.getOrderLineId(),  ex.getMessage());
		}
		finally{

			ProcessOrderExportData.RemoveRunningTask(orderLineId);
			
			if(dbSession != null){
				dbSession.close();
			}
		}
	}
	
	private List<DataRow> getRows(IDBParserAccess dBParserAccess, Session dbSession, SelectSqlParser sqlParser, HashMap<String, Object> p2vs, String userWhere, int pageIndex, int pageSize) throws Exception {	
		DataTable dt = dBParserAccess.getDtBySqlParser(dbSession, sqlParser, pageIndex, pageSize, p2vs, userWhere, "");
		return dt.getRows();
	}
}
