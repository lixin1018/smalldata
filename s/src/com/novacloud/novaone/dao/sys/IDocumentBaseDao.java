package com.novacloud.novaone.dao.sys;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.hibernate.Session;

import net.sf.json.JSONObject;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.workflow.definition.NodeTypeLegend;
import com.novacloud.novaone.workflow.definition.StepStatusType; 

public interface IDocumentBaseDao { 
	void setDBSession( Session dbSession);
	HashMap<String, Object> saveWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException ;
	HashMap<String, Object> deleteWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException; 
	HashMap<String, Object> save(INcpSession session, JSONObject requestObj) throws RuntimeException ;
	HashMap<String, Object> delete(INcpSession session, JSONObject requestObj) throws RuntimeException;
	HashMap<String, Object> submitWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException;
	HashMap<String, Object> driveWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException;
	HashMap<String, Object> getBackWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException;
	HashMap<String, Object> sendBackWithTx(INcpSession session, JSONObject requestObj) throws RuntimeException, SQLException;
	HashMap<String, Object> select(INcpSession session, JSONObject requestObj) throws Exception;
	HashMap<String, Object> getAllUserLogs(INcpSession session, JSONObject requestObj) throws RuntimeException;
	HashMap<String, Object> getCanBackToSteps(INcpSession session, JSONObject requestObj) throws RuntimeException; 
	String getTimingDriveUserId(); 
	void updateStepStatusTypeAfterEndAsyn(INcpSession session, String stepId, String instanceId, String workflowId, String docDataId, String docTypeName, StepStatusType newStatusType, NodeTypeLegend nodeType) throws Exception;
	HashMap<String, Object> getDetailStatus(NcpSession session, JSONObject requestObj); 
	List<DataRow> getCurrentStepStatusRows(String instanceId) throws SQLException;
	List<DataRow> getInvokeRows(String stepId) throws SQLException; 
}
