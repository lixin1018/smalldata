package com.novacloud.dataHelper.export;
import java.io.File;
import java.math.BigDecimal; 
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List; 
import org.apache.log4j.Logger;
import org.apache.log4j.Priority;
import org.hibernate.Session;

import com.novacloud.novaone.asynService.InvokeStatusType;
import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.ContextUtil; 
import com.novacloud.novaone.expression.run.ExternalBase;
import com.novacloud.novaone.expression.run.IDatabaseAccess;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.schedule.JobInstanceRunner;
import com.novacloud.novaone.schedule.StatusType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

//异步调用处理
public class ProcessOrderExportData extends ExternalBase{ 
	private static Logger logger=Logger.getLogger(ProcessOrderExportData.class);
	 
	private static List<String> _RunningTaskOrderLineIdList = new ArrayList<String>();
	public static void AddRunningTask(String orderLineId){
		logger.info("AddRunningTask, orderLineId = " + orderLineId);
		_RunningTaskOrderLineIdList.add(orderLineId);
	}
	public static void RemoveRunningTask(String orderLineId){
		logger.info("RemoveRunningTask, orderLineId = " + orderLineId);
		_RunningTaskOrderLineIdList.remove(orderLineId);
	}
	
	private static boolean CheckIsRunning(String orderLineId){
		logger.info("CheckIsRunning, orderLineId = " + orderLineId);
		return _RunningTaskOrderLineIdList.contains(orderLineId);
	} 

	public List<DataRow> getTopOrderLineInfoWaitingAndExporting(int topCount) throws Exception {
		String getOrderLineSql = "select eol.id as orderlineid, " 
			+ "eol.parentid as orderid, "
			+ "eo.paytime as paytime, " 
			+ "eo.status as orderstatus, "
			+ "eol.exportstatus as exportstatus, "
			+ "eol.datafilter as datafilter, "
			+ "eol.definitionid as definitionid, "
			+ "eol.totalrowcount as totalrowcount, "
			+ "d.dbtablename as dbtablename, " 
			+ "d.name as dataname "
			+ "from dm_exportorderline eol "
			+ "left outer join dm_exportorder eo on eo.id = eol.parentid "
			+ "left outer join dm_importexportdefinition d on d.id = eol.definitionid "
			+ "where eo.status = 'Paid' and eol.exportstatus in ('WaitingExport', 'Exporting') "
			+ "order by eo.paytime asc";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>(); 
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("orderlineid");
		oAlias.add("orderid");
		oAlias.add("paytime");
		oAlias.add("orderstatus");
		oAlias.add("exportstatus");
		oAlias.add("datafilter");
		oAlias.add("definitionid");
		oAlias.add("totalrowcount");
		oAlias.add("dbtablename");
		oAlias.add("dataname");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("orderlineid", ValueType.String); 
		oValueTypes.put("orderid", ValueType.Decimal);
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("orderstatus", ValueType.String);
		oValueTypes.put("exportstatus", ValueType.String); 
		oValueTypes.put("datafilter", ValueType.String); 
		oValueTypes.put("definitionid", ValueType.String); 
		oValueTypes.put("totalrowcount", ValueType.Decimal); 
		oValueTypes.put("dbtablename", ValueType.String); 
		oValueTypes.put("dataname", ValueType.String); 
		IDatabaseAccess dbAccess = this.getDatabaseAccess();
		Session dbSession = dbAccess.getSession();
		DataTable orderLineDt = dbAccess.getDBParserAccess().selectList(dbSession, getOrderLineSql, oP2vs, oAlias, oValueTypes, 0, topCount);
		List<DataRow> orderLineRows = orderLineDt.getRows();
		return orderLineRows;
	}
	
	public void runOrderExportData(BigDecimal maxExportTaskCount) throws Exception{
		
		List<DataRow> orderLineRows = this.getTopOrderLineInfoWaitingAndExporting(maxExportTaskCount.intValue());
		
		if(orderLineRows.size() == 0){
			String info = "无订单待导出数据";
			logger.info(info);
		}
		else{
			for(int i = 0; i < orderLineRows.size(); i++){
				DataRow orderLineRow = orderLineRows.get(i);

				String orderLineId = orderLineRow.getStringValue("orderlineid");
				String definitionId = orderLineRow.getStringValue("definitionid");
				String dataName = "ie_" + orderLineRow.getStringValue("dbtablename");
				String dataFilter = orderLineRow.getStringValue("datafilter");   
				int totalRowCount = orderLineRow.getBigDecimalValue("totalrowcount").intValue();    
				
				if(!CheckIsRunning(orderLineId)){
					this.startExportThread(orderLineId, definitionId, dataName, dataFilter, totalRowCount);
				}
			}
		}  
	}
	
	private void startExportThread(String orderLineId, String definitionId, String dataName, String dataFilter, int totalRowCount){
		logger.info("startExportThread, orderLineId = " + orderLineId);
    	try{ 
    		 
    		ExportRunnerThread exportThread = new ExportRunnerThread();
    		exportThread.setOrderLineId(orderLineId);
    		exportThread.setDefinitionId(definitionId);
    		exportThread.setDataName(dataName);
    		exportThread.setDataFilter(dataFilter);
    		exportThread.setTotalRowCount(totalRowCount);
    		exportThread.start();
    	}
    	catch(Exception ex){
    		ex.printStackTrace();
			logger.error("startExportThread error, orderLineId = " + orderLineId, ex);
    	} 
	}
}
