package com.novacloud.novaone.excelGrid.egInstance;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.excelGrid.definition.ExcelGridProcessor;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ExcelGridInstanceProcessor {
	
	//超过这个时间间隔后，不允许取回
	private int bingBackLimitMinutes = 3;
	public int getBingBackLimitMinutes() {
		return bingBackLimitMinutes;
	}
	public void setBingBackLimitMinutes(int bingBackLimitMinutes) {
		this.bingBackLimitMinutes = bingBackLimitMinutes;
	} 
	
	private ExcelGridProcessor excelGridProcessor = null;
	public ExcelGridProcessor getExcelGridProcessor() {
		return excelGridProcessor;
	}
	public void setExcelGridProcessor(ExcelGridProcessor excelGridProcessor) {
		this.excelGridProcessor = excelGridProcessor;
	} 
	
	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	private Session dbSession = null;
	public Session getDBSession() {
		return dbSession;
	}
	public void setDBSession(Session dbSession) {
		this.dbSession = dbSession;
	}

	//获取填报实例文件路径
	private String getInstanceFilePath(String partPath){
		String filePath = this.getInstanceFileDirectory() + "\\" + partPath;
		return filePath;
	}
	
	//文件的保存文件位置（填报实例文件）
	private String instanceFileDirectory = null;
	private String getInstanceFileDirectory(){
		if(instanceFileDirectory == null){
			instanceFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_EXCELGRID_INSTANCEFILEDIRECTORY);
		}
		return instanceFileDirectory;
	}	

	//获取填报实例文件文件夹路径
	private String getInstanceFolderPath(String partPath){
		String filePath = this.getInstanceFileDirectory() + "\\" + partPath;
		return filePath;
	}

	
	public DataRow getTeamDefinition(String definitionId, String teamId) throws SQLException{
		String definitionSql = "select d.id as definitionid,"
			+ " v.id as versionid," 
			+ " d.name as definitionname," 
			+ " t.name as teamname" 
			+ " from eg_definition d"
			+ " left outer join tm_team t on t.id = d.teamid"
			+ " left outer join eg_definitionversion v on v.definitionid = d.id"
			+ " where d.id = " + SysConfig.getParamPrefix() + "definitionId"
			+ " and d.teamId = " + SysConfig.getParamPrefix() + "teamId "
			+ " and v.enable = 'Y'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("definitionId", definitionId);
		p2vs.put("teamId", teamId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("definitionid");
		alias.add("versionid");
		alias.add("definitionname");
		alias.add("teamname");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("definitionid", ValueType.String);
		valueTypes.put("versionid", ValueType.String);
		valueTypes.put("definitionname", ValueType.String);
		valueTypes.put("teamname", ValueType.String);
		
		Session dbSession = this.getDBSession();
		DataTable definitionDt = this.getDBParserAccess().selectList(dbSession, definitionSql, p2vs, alias, valueTypes);
		List<DataRow> definitionRows = definitionDt.getRows();
		return definitionRows.size() == 0 ? null : definitionRows.get(0);
	}
	//获取个人所有任务instanceId（分页）
	public List<String> getPersonalInstanceIds(String userId, int fromIndex, int onePageRowCount) throws SQLException{
		String instanceSql = "select i.id as instanceid from eg_instance i" 
				+ " where i.createuserid = " + SysConfig.getParamPrefix() + "userId and i.isdeleted = 'N'"
				+ " order by i.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("instanceid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("instanceid", ValueType.String);
		
		DataTable instanceDt = this.dBParserAccess.selectList(dbSession, instanceSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> instanceIds = new ArrayList<String>();
		List<DataRow> instanceRows = instanceDt.getRows();
		for(DataRow instanceRow : instanceRows){
			String instanceId = instanceRow.getStringValue("instanceid");
			instanceIds.add(instanceId);
		}
		return instanceIds;		
	}
	
	public DataRow getInstance(String instanceId) throws SQLException{
		List<String> instanceIds = new ArrayList<String>();
		instanceIds.add(instanceId);
		
		List<DataRow> instanceRows = this.getInstances(instanceIds);
		if(instanceRows == null || instanceRows.size() == 0){
			return null;
		}
		else{
			return instanceRows.get(0);
		}
	}
	
	public List<DataRow> getInstances(List<String> instanceIds) throws SQLException{
		if(instanceIds == null || instanceIds.size() == 0){
			return null;
		}
		else{
			StringBuilder instanceIdStr = new StringBuilder();
			for(int i = 0; i < instanceIds.size(); i++){
				String instanceId = instanceIds.get(i); 
				if(i > 0){
					instanceIdStr.append(",");
				}
				instanceIdStr.append("'" + instanceId + "'");
			}
		
		
			String instanceSql = "select i.id as instanceid,"
					+ " i.createstepid as createstepid,"
					+ " ip.title as title,"
					+ " i.definitionid as definitionid,"
					+ " def.name as definitionname,"
					+ " i.createuserid as createuserid,"
					+ " i.createtime as createtime,"
					+ " i.lastmodifytime as lastmodifytime,"
					+ " i.statusnote as statusnote"
					+ " from eg_instance i" 
					+ " left outer join eg_instancestep ip on ip.id = i.createstepid" 
					+ " left outer join eg_definition def on def.id = i.definitionid" 
					+ " where i.id in (" + instanceIdStr.toString() + ")"
					+ " order by i.createtime desc"; 
			Session dbSession = this.getDBSession();
			
			List<String> alias = new ArrayList<String>();
			alias.add("instanceid");
			alias.add("createstepid");
			alias.add("title");
			alias.add("definitionid");
			alias.add("definitionname");
			alias.add("createuserid");
			alias.add("createtime");
			alias.add("lastmodifytime");
			alias.add("statusnote");
			
			HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
			fieldValueTypes.put("instanceid", ValueType.String);
			fieldValueTypes.put("createstepid", ValueType.String);
			fieldValueTypes.put("title", ValueType.String);
			fieldValueTypes.put("definitionid", ValueType.String);
			fieldValueTypes.put("definitionname", ValueType.String);
			fieldValueTypes.put("createuserid", ValueType.String);
			fieldValueTypes.put("createtime", ValueType.Time);
			fieldValueTypes.put("lastmodifytime", ValueType.Time);
			fieldValueTypes.put("statusnote", ValueType.String);
			
			DataTable instanceDt = this.dBParserAccess.selectList(dbSession, instanceSql, null, alias, fieldValueTypes); 
			List<DataRow> instanceRows = instanceDt.getRows(); 
			return instanceRows;	
		}
	}
	
	//获取个人所有任务记录数
	public int getPersonalInstanceCount(String userId) throws SQLException{
		String instanceSql = "select count(1) as instanceCount from eg_instance i" 
				+ " where i.createuserid = " + SysConfig.getParamPrefix() + "userId and i.isdeleted = 'N'";
			HashMap<String, Object> p2vs = new HashMap<String, Object>();
			p2vs.put("userId", userId); 
			Session dbSession = this.getDBSession();
			int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, instanceSql, p2vs)).intValue();
			return stepCount;
	}
	
	//获取个人待办的所有任务instanceStepId（分页，包括待处理和参与讨论）
	public List<String> getWaitingProcessInstanceStepIds(String userId, int fromIndex, int onePageRowCount) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip" 
				+ " left outer join eg_instance i on i.id = ip.instanceid"
				+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and ip.processtime is null and i.isdeleted = 'N'"
				+ " order by ip.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;
	}

	public List<DataRow> getInstanceSteps(List<String> stepIds, StepOrderByType orderByType) throws SQLException{
		if(stepIds == null || stepIds.size() == 0){
			return null;
		}
		else{
			StringBuilder stepIdStr = new StringBuilder();
			for(int i = 0; i < stepIds.size(); i++){
				String stepId = stepIds.get(i); 
				if(i > 0){
					stepIdStr.append(",");
				}
				stepIdStr.append("'" + stepId + "'");
			}
			
			String orderByField = null;
			switch(orderByType){
				case CreateTime:
					orderByField = "ip.createtime";
					break;
				case ProcessTime:
					orderByField = "ip.processtime";
					break;
				case None:
					orderByField = null;
					break;
			}
		
			String stepSql = "select ip.id as id,"
					+ " ip.instanceid as instanceid,"
					+ " i.title as instancetitle,"
					+ " ip.title as steptitle,"
					+ " i.definitionid as definitionid,"
					+ " def.name as definitionname,"
					+ " i.createuserid as createuserid,"
					+ " iu.name as createusername,"
					+ " ip.userid as processuserid,"
					+ " ipu.name as processusername,"
					+ " ip.createtime as stepcreatetime,"
					+ " ip.processtime as processtime,"
					+ " ip.operatetype as operatetype,"
					+ " ip.resulttype as resulttype,"
					+ " ip.note as note,"
					+ " i.statusnote as statusnote"
					+ " from eg_instancestep ip" 
					+ " left outer join d_user ipu on ipu.id = ip.userid" 
					+ " left outer join eg_instance i on i.id = ip.instanceid" 
					+ " left outer join d_user iu on iu.id = i.createuserid" 
					+ " left outer join eg_definition def on def.id = i.definitionid" 
					+ " where ip.id in (" + stepIdStr.toString() + ")"
					+  (orderByField == null ? "" : " order by " + orderByField + " desc"); 
			Session dbSession = this.getDBSession();
			
			List<String> alias = new ArrayList<String>();
			alias.add("id");
			alias.add("instanceid");
			alias.add("instancetitle");
			alias.add("steptitle");
			alias.add("definitionid");
			alias.add("definitionname");
			alias.add("createuserid");
			alias.add("createusername");
			alias.add("processuserid");
			alias.add("processusername");
			alias.add("stepcreatetime");
			alias.add("processtime");
			alias.add("operatetype");
			alias.add("resulttype");
			alias.add("note");
			alias.add("statusnote");
			
			HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
			fieldValueTypes.put("id", ValueType.String); 
			fieldValueTypes.put("instanceid", ValueType.String); 
			fieldValueTypes.put("instancetitle", ValueType.String); 
			fieldValueTypes.put("steptitle", ValueType.String); 
			fieldValueTypes.put("definitionid", ValueType.String); 
			fieldValueTypes.put("definitionname", ValueType.String); 
			fieldValueTypes.put("createuserid", ValueType.String); 
			fieldValueTypes.put("createusername", ValueType.String); 
			fieldValueTypes.put("processuserid", ValueType.String); 
			fieldValueTypes.put("processusername", ValueType.String); 
			fieldValueTypes.put("stepcreatetime", ValueType.Time); 
			fieldValueTypes.put("processtime", ValueType.Time); 
			fieldValueTypes.put("operatetype", ValueType.String);
			fieldValueTypes.put("resulttype", ValueType.String);
			fieldValueTypes.put("note", ValueType.String);
			fieldValueTypes.put("statusnote", ValueType.String);  
			
			DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, null, alias, fieldValueTypes); 
			List<DataRow> stepRows = stepDt.getRows(); 
			return stepRows;	
		}
	}
	
	public List<DataRow> getInstanceStepLinks(List<String> stepLinkIds) throws SQLException{
		if(stepLinkIds == null || stepLinkIds.size() == 0){
			return null;
		}
		else{
			StringBuilder stepLinkIdStr = new StringBuilder();
			for(int i = 0; i < stepLinkIds.size(); i++){
				String stepLinkId = stepLinkIds.get(i); 
				if(i > 0){
					stepLinkIdStr.append(",");
				}
				stepLinkIdStr.append("'" + stepLinkId + "'");
			}
		
		
			String stepLinkSql = "select ipl.instanceid as instanceid,"
					+ " ipl.fromstepid as fromstepid,"
					+ " ipl.tostepid as tostepid,"
					+ " ipl.createtime as createtime,"
					+ " ipl.id as id "
					+ " from eg_instancesteplink ipl"
					+ " where ipl.id in (" + stepLinkIdStr.toString() + ")"; 
			Session dbSession = this.getDBSession();
			
			List<String> alias = new ArrayList<String>();
			alias.add("instanceid");
			alias.add("fromstepid");
			alias.add("tostepid");
			alias.add("createtime");
			alias.add("id"); 
			
			HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
			fieldValueTypes.put("instanceid", ValueType.String); 
			fieldValueTypes.put("fromstepid", ValueType.String); 
			fieldValueTypes.put("tostepid", ValueType.String);
			fieldValueTypes.put("processtime", ValueType.Time); 
			fieldValueTypes.put("id", ValueType.String);  
			
			DataTable stepLinkDt = this.dBParserAccess.selectList(dbSession, stepLinkSql, null, alias, fieldValueTypes); 
			List<DataRow> stepLinkRows = stepLinkDt.getRows(); 
			return stepLinkRows;	
		}
	}

	
	public DataRow getInstanceStep(String instanceId, String stepId) throws SQLException{  
		String stepSql = "select ip.instanceid as instanceid,"
				+ " i.title as instancetitle,"
				+ " ip.title as steptitle,"
				+ " i.definitionid as definitionid,"
				+ " def.name as definitionname,"
				+ " i.createuserid as createuserid,"
				+ " iu.name as createusername,"
				+ " ip.userid as processuserid,"
				+ " ipu.name as processusername,"
				+ " ip.createtime as stepcreatetime,"
				+ " ip.processtime as processtime,"
				+ " i.statusnote as statusnote"
				+ " from eg_instancestep ip" 
				+ " left outer join d_user ipu on ipu.id = ip.userid" 
				+ " left outer join eg_instance i on i.id = ip.instanceid" 
				+ " left outer join d_user iu on iu.id = i.createuserid" 
				+ " left outer join eg_definition def on def.id = i.definitionid" 
				+ " where ip.id = " + SysConfig.getParamPrefix() + "stepId"
				+ " and ip.instanceid = " + SysConfig.getParamPrefix() + "instanceId"
				+ " and i.isdeleted = 'N'"
				+ " order by i.lastmodifytime desc"; 
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("stepId", stepId);
		p2vs.put("instanceId", instanceId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("instanceid");
		alias.add("instancetitle");
		alias.add("steptitle");
		alias.add("definitionid");
		alias.add("definitionname");
		alias.add("createuserid");
		alias.add("createusername");
		alias.add("processuserid");
		alias.add("processusername");
		alias.add("stepcreatetime");
		alias.add("processtime");
		alias.add("statusnote");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("instanceid", ValueType.String); 
		fieldValueTypes.put("instanceid", ValueType.String); 
		fieldValueTypes.put("steptitle", ValueType.String); 
		fieldValueTypes.put("definitionid", ValueType.String); 
		fieldValueTypes.put("definitionname", ValueType.String); 
		fieldValueTypes.put("createuserid", ValueType.String); 
		fieldValueTypes.put("createusername", ValueType.String); 
		fieldValueTypes.put("processuserid", ValueType.String); 
		fieldValueTypes.put("processusername", ValueType.String); 
		fieldValueTypes.put("stepcreatetime", ValueType.Time); 
		fieldValueTypes.put("processtime", ValueType.Time); 
		fieldValueTypes.put("statusnote", ValueType.String);  
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes); 
		List<DataRow> stepRows = stepDt.getRows(); 
		return stepRows.size() == 0 ? null : stepRows.get(0);	
	}
	
	//获取个人待办的所有任务记录数
	public int getWaitingProcessInstanceStepCount(String userId) throws SQLException{
		String stepSql = "select count(1) as stepCount from eg_instanceStep ip"
			+ " left outer join eg_instance i on i.id = ip.instanceid"
			+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and ip.processtime is null and i.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, stepSql, p2vs)).intValue();
		return stepCount;
	}
	
	//获取经办的所有任务instanceStepId(分页，包括处理过的和参与讨论的）
	public List<String> getProcessedIntanceStepIds(String userId, int fromIndex, int onePageRowCount) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip" 
				+ " left outer join eg_instance i on i.id = ip.instanceid"
				+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and ip.processtime is not null and i.isdeleted = 'N'"
				+ " order by ip.processtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;		
	}
	
	//获取经办的所有任务记录数
	public int getProcessedIntanceStepCount(String userId) throws SQLException{
		String stepSql = "select count(1) as stepCount from eg_instanceStep ip"
			+ " left outer join eg_instance i on i.id = ip.instanceid"
			+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and ip.processtime is not null and i.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, stepSql, p2vs)).intValue();
		return stepCount;		
	}
	
	//根据definitionId、userId，获取个人的任务
	public List<String> getPersonalInstanceIds(String userId, String definitionId, int fromIndex, int onePageRowCount) throws SQLException{
		String instanceSql = "select i.id as instanceid from eg_instance i" 
				+ " where i.createuserid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId and i.isdeleted = 'N'"
				+ " order by i.lastmodifytime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		p2vs.put("definitionId", definitionId); 
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("instanceid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("instanceid", ValueType.String);
		
		DataTable instanceDt = this.dBParserAccess.selectList(dbSession, instanceSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> instanceIds = new ArrayList<String>();
		List<DataRow> instanceRows = instanceDt.getRows();
		for(DataRow instanceRow : instanceRows){
			String instanceId = instanceRow.getStringValue("instanceid");
			instanceIds.add(instanceId);
		}
		return instanceIds;
	}
	
	//根据definitionId、userId，获取个人的任务记录数
	public int getPersonalInstanceCount(String userId, String definitionId) throws SQLException{
		String instanceSql = "select count(1) as instanceCount from eg_instance i" 
			+ " where i.createuserid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId and i.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, instanceSql, p2vs)).intValue();
		return stepCount;
	}

	//根据definitionId、processUserId，获取个人待办instanceStepId
	public List<String> getWaitingProcessInstanceStepIds(String userId, String definitionId, int fromIndex, int onePageRowCount) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip" 
				+ " left outer join eg_instance i on i.id = ip.instanceid"
				+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId  and ip.processtime is null and i.isdeleted = 'N'"
				+ " order by ip.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;
	}
	
	//根据instanceId、processUserId，获取个人待办instanceStepId
	public List<String> getWaitingProcessInstanceStepIdsOneInstance(String userId, String instanceId) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip"  
				+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId"
				+ " and ip.instanceid = " + SysConfig.getParamPrefix() + "instanceId"
				+ " and ip.processtime is null"
				+ " order by ip.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		p2vs.put("instanceId", instanceId);
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;
	}
	
	//根据definitionId、processUserId，获取个人待办记录数
	public int getWaitingProcessInstanceStepCount(String userId, String definitionId) throws SQLException{
		String stepSql = "select count(1) as stepCount from eg_instanceStep ip"
			+ " left outer join eg_instance i on i.id = ip.instanceid"
			+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId and ip.processtime is null and i.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, stepSql, p2vs)).intValue();
		return stepCount;		
	}
	
	//根据definitionId、processUserId，获取个人经办历史instanceStepId
	public List<String> getProcessedIntanceStepIds(String userId, String definitionId, int fromIndex, int onePageRowCount) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip" 
				+ " left outer join eg_instance i on i.id = ip.instanceid"
				+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId and ip.processtime is not null and i.isdeleted = 'N'"
				+ " order by ip.processtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId); 
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes, fromIndex, onePageRowCount);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;		
	}
	
	//根据instanceId，获取所有instanceStepId
	public List<String> getIntanceStepIdsOneInstance(String instanceId) throws SQLException{
		String stepSql = "select ip.id as stepid from eg_instancestep ip" 
				+ " left outer join eg_instance i on i.id = ip.instanceid"
				+ " where ip.instanceid = " + SysConfig.getParamPrefix() + "instanceId and i.isdeleted = 'N'"
				+ " order by ip.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
		p2vs.put("instanceId", instanceId);
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("stepid", ValueType.String);
		
		DataTable stepDt = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, fieldValueTypes);
		List<String> stepIds = new ArrayList<String>();
		List<DataRow> stepRows = stepDt.getRows();
		for(DataRow stepRow : stepRows){
			String stepId = stepRow.getStringValue("stepid");
			stepIds.add(stepId);
		}
		return stepIds;		
	}
	
	//根据instanceId，获取所有instanceStepLinkId
	public List<String> getIntanceStepLinkIdsOneInstance(String instanceId) throws SQLException{
		String stepLinkSql = "select ipl.id as steplinkid from eg_instancesteplink ipl" 
				+ " left outer join eg_instance i on i.id = ipl.instanceid"
				+ " where ipl.instanceid = " + SysConfig.getParamPrefix() + "instanceId and i.isdeleted = 'N'"
				+ " order by ipl.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>(); 
		p2vs.put("instanceId", instanceId);
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("steplinkid");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("steplinkid", ValueType.String);
		
		DataTable stepLinkDt = this.dBParserAccess.selectList(dbSession, stepLinkSql, p2vs, alias, fieldValueTypes);
		List<String> stepLinkIds = new ArrayList<String>();
		List<DataRow> stepLinkRows = stepLinkDt.getRows();
		for(DataRow stepLinkRow : stepLinkRows){
			String stepLinkId = stepLinkRow.getStringValue("steplinkid");
			stepLinkIds.add(stepLinkId);
		}
		return stepLinkIds;		
	}
	
	//根据definitionId、processUserId，获取个人经办历史记录数
	public int getProcessedIntanceStepCount(String userId, String definitionId) throws SQLException{
		String stepSql = "select count(1) as stepCount from eg_instanceStep ip"
			+ " left outer join eg_instance i on i.id = ip.instanceid"
			+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId and i.definitionid = " + SysConfig.getParamPrefix() + "definitionId and ip.processtime is not null and i.isdeleted = 'N'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		int stepCount= ((BigInteger)this.getDBParserAccess().selectOne(dbSession, stepSql, p2vs)).intValue();
		return stepCount;
	}
	
	//添加instance
	public String createInstanceWithTx(String userId, String definitionId, String versionId, String teamId, String title) throws Exception{
		//生成eg_instance.id
		String newInstanceId = UUID.randomUUID().toString(); 
		//生成eg_instanceStep.id
		String newStepId = UUID.randomUUID().toString();  		
		
		this.createInstanceWithTx(newInstanceId, newStepId, userId, definitionId, versionId, teamId, title);
		
		return newInstanceId;
	}  
	
	//添加instance
	public void createInstanceWithTx(String newInstanceId, String newStepId, String userId, String definitionId, String versionId, String teamId, String title) throws Exception{
		Session dbSession = this.getDBSession();
		
		//获取当前时间
		Date currentTime = new Date();  
		
		//保存文件到硬盘，文件名以eg_instance.id命名
		this.createInstanceFile(versionId, newInstanceId, currentTime);		
		
		//事务，添加到eg_instance表，添加到eg_instanceprocess表
		Transaction tx = null;
		try{
			tx = dbSession.beginTransaction();			
			this.createInstance(newInstanceId, newStepId, definitionId, versionId, teamId, userId, title, currentTime);
			this.createStep(userId, newInstanceId, newStepId, title, currentTime, currentTime, StepOperateType.create);			
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 
	}  

	
	//删除instance，如果已经产生了其他step,且不是处理人，且处理人不是创建人，那么不允许删除
	public void deleteInstance(String userId, String instanceId) throws Exception{
		Session dbSession = this.getDBSession();
		
		Date currentTime = new Date(); 
		
		DataRow instanceRow = this.getInstance(instanceId);
		
		if(instanceRow == null){
			throw new NcpException("deleteInstance_002", "不存在的表格");
		}
		else{
			if(!userId.equals(instanceRow.getStringValue("createuserid"))){
				throw new NcpException("deleteInstance_003", "没有权限删除此表格, 您不是创建人");
			}
			else{
				List<String> stepIds = this.getIntanceStepIdsOneInstance(instanceId);
				List<DataRow> stepRows = this.getInstanceSteps(stepIds, StepOrderByType.None);
				for(DataRow stepRow : stepRows){
					if(stepRow.isNull("processtime") && !userId.equals(stepRow.getStringValue("processuserid"))){
						throw new NcpException("deleteInstance_003", "不能删除, 请先取回表格");
					}
				}		
		
				String updateInstanceSql = "update eg_instance set isdeleted='Y', lastmodifytime = " + SysConfig.getParamPrefix() +"currentTime where id = " + SysConfig.getParamPrefix() + "instanceId";
				HashMap<String, Object> p2vs = new HashMap<String, Object>();
				p2vs.put("instanceId", instanceId);
				p2vs.put("currentTime", currentTime); 
				 
				this.getDBParserAccess().update(dbSession, updateInstanceSql, p2vs);
			}
		}
	}  

	//根据模板创建实例文件
	private String createInstanceFile(String versionId, String instanceId, Date currentTime) throws Exception{
		String fileStr = this.readVersionFileByVersionId(versionId);
		String instanceFilePath = this.saveInstanceFile(instanceId, currentTime, fileStr);
		return instanceFilePath;
	}  

	//获取模板文件
	private String readVersionFileByVersionId(String versionId) throws Exception{
		ExcelGridProcessor excelGridProcessor = this.getExcelGridProcessor();
		excelGridProcessor.setDBSession(this.getDBSession());
		String versionFilePath = excelGridProcessor.getVersionFilePathById(versionId);
		FileOperate fo = new FileOperate();
		String txt = fo.readTxt(versionFilePath);
		return txt;
	}  

	//保存实例文件
	private String saveInstanceFile(String instanceId, Date currentTime, String fileStr) throws Exception{
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String saveTimeStr = sdf.format(currentTime); 

		//判断excelGrid存储文件夹是否存在  
		String egDirPath = this.getInstanceFolderPath(instanceId);
		File egDir = new File(egDirPath);   
		if(!egDir.exists() && !egDir.isDirectory()) {        
			egDir.mkdir();    
		}
		
		String filePath = instanceId + "\\" + instanceId + "_" + saveTimeStr + ".json";
		String fullPath = this.getInstanceFilePath(filePath);
		FileOperate fo = new FileOperate();
		fo.createFile(fullPath, fileStr);
		return filePath;
	}

	//读取实例文件
	public String readInstanceFile(String instanceId, Date fileModifyTime) throws Exception{		
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String fileModifyTimeStr = sdf.format(fileModifyTime);		
		String filePath = instanceId + "\\" + instanceId + "_" + fileModifyTimeStr + ".json";
		String fullPath = this.getInstanceFilePath(filePath);
		FileOperate fo = new FileOperate();
		String fileStr = fo.readTxt(fullPath);
		return fileStr;
	}
	
	//更新instance对应的文件和fileLastMofiyTime
	public void updateStepWithTx(String userId, String instanceId, String stepId, String fileStr, String title) throws Exception{
		Session dbSession = this.getDBSession();
		
		//获取当前时间
		Date currentTime = new Date();
		
		//使用instanceId+时间戳作为文件名，存储到硬盘中
		this.saveInstanceFile(instanceId, currentTime, fileStr);
		
		//事务，判断instance是否还在instanceStepId上，且userId对不，然后更新eg_instance和eg_instanceStep.filelastmodifytime
		Transaction tx = null;
		try{
			tx = dbSession.beginTransaction();	 
			this.lockInstance(instanceId);
  
			DataRow stepRow = this.getStep(stepId);
			Date processTime = stepRow.getDateTimeValue("processtime");
			String processUserId = stepRow.getStringValue("userid");
			
			if(processTime != null){
				throw new NcpException("updateStepFileModifyTimeWithTx_002", "不能执行更新操作, 流程已经发生变化(其他人执行了发送、取回或退回操作)");
			}
			else if(!userId.equals(processUserId)){
				throw new NcpException("updateStepFileModifyTimeWithTx_003", "不能执行更新操作, 流程已经发生变化(操作人发生变更)");
			}  
			
			this.updateStepFileModifyTime(stepId, currentTime, title);
			
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 
	}
	
	//审批通过
	public void driveToNextWithTx(String userId, List<String> nextUserIds, List<String> titles, String instanceId, List<String> fromStepIds, String note) throws SQLException, NcpException{
		Transaction tx = null;
		try{
			tx = dbSession.beginTransaction();	 
			this.lockInstance(instanceId);
			
			List<String> fromUserIds = new ArrayList<String>();
			fromUserIds.add(userId);
			
			//循环，分发给后续处理人，每个fromStepId有nextUserIds.size个后续节点，注意，这里不是聚合
			for(String fromStepId : fromStepIds){
				DataRow  stepRow = this.getStep(fromStepId);
				
				Date fileLastModifyTime = stepRow.getDateTimeValue("filelastmodifytime");
				List<Date> fileLastModifyTimes = new ArrayList<Date>();
				for(int i = 0; i < nextUserIds.size(); i++){
					fileLastModifyTimes.add(fileLastModifyTime);
				}
				
				List<String> branchFromStepIds = new ArrayList<String>();
				branchFromStepIds.add(fromStepId);
				
				String title = stepRow.getStringValue("title");
				List<String> toTitles = new ArrayList<String>(); 
				for(String t : titles){
					toTitles.add(t == null || t.length() ==0 ? title : t);					
				}
				
				this.createSteps(instanceId, fromUserIds, branchFromStepIds, nextUserIds, toTitles, note, fileLastModifyTimes, StepOperateType.driveToNext, StepResultType.sendNext);
			} 
			
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 
	}
	
	//聚合，汇聚，汇总
	public String convergeWithTx(String userId, String instanceId, List<String> fromStepIds, String title, String note) throws SQLException, NcpException{
		Transaction tx = null;
		String toStepId = null; 
		try{
			tx = this.getDBSession().beginTransaction();
			List<String> fromUserIds = new ArrayList<String>();
			
			List<String> nextUserIds = new ArrayList<String>();
			nextUserIds.add(userId);
			
			List<String> titles = new ArrayList<String>();
			titles.add(title);
			
			List<Date> fileLastModifyTimes = new ArrayList<Date>();
			fileLastModifyTimes.add(null);
			 
			for(String fromStepId : fromStepIds){
				DataRow  stepRow = this.getStep(fromStepId);
				String fromUserId = stepRow.getStringValue("userid");
				fromUserIds.add(fromUserId);
			} 
				
			List<String> toStepIds = this.createSteps(instanceId, fromUserIds, fromStepIds, nextUserIds, titles, note, fileLastModifyTimes, StepOperateType.converge, StepResultType.sendNext);
			toStepId = toStepIds.get(0);
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}
		return toStepId;
	}

	//结束流程
	public void endWithTx(String userId, String instanceId, List<String> fromStepIds, String note) throws SQLException, NcpException{
		Transaction tx = null;
		try{
			tx = this.getDBSession().beginTransaction();
			List<String> nextUserIds = new ArrayList<String>();
			nextUserIds.add("");
			
			List<String> titles = new ArrayList<String>();
			titles.add("");

			List<String> fromUserIds = new ArrayList<String>();
			for(int i = 0; i < fromStepIds.size(); i++){
				fromUserIds.add(userId);
			}
			
			List<Date> fileLastModifyTimes = new ArrayList<Date>();
			fileLastModifyTimes.add(null);
			
			this.createSteps(instanceId, fromUserIds, fromStepIds, nextUserIds, titles, note, fileLastModifyTimes, StepOperateType.end, StepResultType.sendNext);	
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}
	}

	//取回
	public List<String> bringBackWithTx(String userId, String instanceId, String backToStepId, List<String> fromUserIds, List<String> fromStepIds, String note) throws SQLException, NcpException{
		List<String> toStepIds = null;
		Transaction tx = null;
		try{
			tx = this.getDBSession().beginTransaction();
			DataRow stepRow = this.getStep(backToStepId);
			if(stepRow == null){
				throw new NcpException("bringBack_002", "不存在的StepId");
			}
			
			String stepUserId = stepRow.getStringValue("userid");
			if(!stepUserId.equals(userId)){
				throw new NcpException("bringBack_005", "没有权限进行此操作");
			} 
			
			Date fileLastModifyTime = stepRow.getDateTimeValue("filelastmodifytime");
			List<Date> fileLastModifyTimes = new ArrayList<Date>();
			fileLastModifyTimes.add(fileLastModifyTime);
			
			String title = stepRow.getStringValue("title");
			List<String> titles = new ArrayList<String>();
			titles.add(title);
			
			List<String> toUserIds = new ArrayList<String>();
			toUserIds.add(userId);	
	
			for(String fromStepId : fromStepIds){
				DataRow fromStepRow = this.getStep(fromStepId);
				
				Date processTime = fromStepRow.getDateTimeValue("processtime");
				if(processTime != null){
					throw new NcpException("bringBack_003", "无法取回, 后续环节人员已进行了操作");
				}	
				
				Date createTime = fromStepRow.getDateTimeValue("createtime");
				Date currentTime = new Date(); 
				if(!fromStepRow.getStringValue("operatetype").equals(StepOperateType.end.toString()) && (currentTime.getTime() - createTime.getTime()) > this.getBingBackLimitMinutes() * 60 *1000){
					throw new NcpException("bringBack_004", "无法取回, 距您上次的操作已经超过" + this.getBingBackLimitMinutes() + "分钟");
				}		
			}
			
			toStepIds = this.createSteps(instanceId, fromUserIds, fromStepIds, toUserIds, titles, note, fileLastModifyTimes, StepOperateType.bringBack, StepResultType.bringBack);	
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}
		return toStepIds;
	}
	
	//退回,允许批量退回多个step的数据
	public void sendBackWithTx(HashMap<String, List<String>> fromStepIdToBackToUserIds, String fromUserId, String instanceId, String note) throws SQLException, NcpException{
		Transaction tx = null;
		try{
			tx = this.getDBSession().beginTransaction();
			for(String fromStepId : fromStepIdToBackToUserIds.keySet()){ 
				List<String> backToUserIds = fromStepIdToBackToUserIds.get(fromStepId);
				List<Date> fileLastModifyTimes = new ArrayList<Date>();
				List<String> titles = new ArrayList<String>();
				
				for(String backToUserId : backToUserIds){
					DataRow stepRow = this.getUserLastProcessedStep(backToUserId, fromStepId);
					if(stepRow == null){
						throw new NcpException("sendBack_002", "接收人必须是经办人之一");
					}
					else{
						Date fileLastModifyTime = stepRow.getDateTimeValue("filelastmodifytime");
						fileLastModifyTimes.add(fileLastModifyTime);

						String title = stepRow.getStringValue("title");
						titles.add(title);
					}
				}
	
				List<String> fromUserIds = new ArrayList<String>();
				fromUserIds.add(fromUserId);
				
				List<String> fromStepIds = new ArrayList<String>();
				fromStepIds.add(fromStepId); 			 
				
				this.createSteps(instanceId, fromUserIds, fromStepIds, backToUserIds, titles, note, fileLastModifyTimes, StepOperateType.sendBack, StepResultType.sendBack);			
			}			
			tx.commit();
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}	
	}

	private List<DataRow> getUserProcesssedSteps(String userId) throws SQLException{
		String stepSql = "select ip.id as stepid, ip.userid as userid, ip.filelastmodifytime as filelastmodifytime"
			+ " from eg_instancestep ip"
			+ " where ip.userid = " + SysConfig.getParamPrefix() + "userId"
			+ " order by ip.processtime desc";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);

		List<String> alias = new ArrayList<String>();
		alias.add("stepid"); 
		alias.add("userid"); 
		alias.add("filelastmodifytime"); 
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("stepid", ValueType.String); 
		valueTypes.put("userid", ValueType.String); 
		valueTypes.put("filelastmodifytime", ValueType.Time); 
		DataTable stepDt = this.getDBParserAccess().selectList(dbSession, stepSql, p2vs, alias, valueTypes);
		return stepDt.getRows();
	}
	private List<String> getToStepIds(String fromStepId) throws SQLException{
		String toStepSql = "select isl.tostepid as tostepid"
			+ " from eg_instancesteplink isl"
			+ " where isl.fromstepid = " + SysConfig.getParamPrefix() + "fromStepId";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("fromStepId", fromStepId);

		List<String> alias = new ArrayList<String>();
		alias.add("tostepid");  
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("tostepid", ValueType.String);  
		DataTable toStepDt = this.getDBParserAccess().selectList(dbSession, toStepSql, p2vs, alias, valueTypes);
		List<DataRow> toStepRows = toStepDt.getRows();
		if(toStepRows.size() == 0){
			return null;
		}
		else{
			List<String> toStepIds = new ArrayList<String>();
			for(DataRow toStepRow : toStepRows){
				String toStepId = toStepRow.getStringValue("tostepid");
				toStepIds.add(toStepId);
			}
			return toStepIds;
		}
	}
	
	private DataRow getUserLastProcessedStep(String userId, String currentStepId) throws SQLException{
		List<DataRow> userProcessedStepRows = this.getUserProcesssedSteps(userId);
		
		for(DataRow userProcessedStepRow : userProcessedStepRows){
			String userStepId = userProcessedStepRow.getStringValue("stepid");
			List<String> fromStepIds = new ArrayList<String>();
			fromStepIds.add(userStepId);
			
			while(fromStepIds.size() > 0){
				List<String> nextStepIds = new ArrayList<String>();
				for(String fromStepId : fromStepIds){
					List<String> toStepIds = this.getToStepIds(fromStepId);
					if(toStepIds.contains(currentStepId)){
						return userProcessedStepRow;
					}
					else{
						nextStepIds.addAll(toStepIds);
					}
				}
			}
		}
		return null;
	}
	
	private List<DataRow> getPreviousSteps( String currentStepId) throws SQLException{
		String stepSql = "select isl.id as fromstepid, ip.userid as userid, ip.filelastmodifytime as filelastmodifytime"
			+ " from eg_instancesteplink isl"
			+ " left outer join eg_instancestep ip on ip.id = isl.fromstepid"
			+ " where isl.tostepid = " + SysConfig.getParamPrefix() + "toStepId"
			+ " order by ip.processtime desc";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("toStepId", currentStepId);

		List<String> alias = new ArrayList<String>();
		alias.add("fromstepid"); 
		alias.add("userid"); 
		alias.add("filelastmodifytime"); 
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("fromstepid", ValueType.String); 
		valueTypes.put("userid", ValueType.String); 
		valueTypes.put("filelastmodifytime", ValueType.Time); 
		DataTable stepDt = this.getDBParserAccess().selectList(dbSession, stepSql, p2vs, alias, valueTypes);
		return stepDt.getRows();
	}	 
	
	private List<String> getAllPreviousStepUserIds(String currentStepId) throws SQLException{	 
		List<String> stepIds = new ArrayList<String>();
		stepIds.add(currentStepId);	 
		return this.getAllPreviousStepUserIds(stepIds);
	}
	
	private List<String> getAllPreviousStepUserIds(List<String> currentStepIds) throws SQLException{	
		List<String> allPreviousStepUserIds = new ArrayList<String>();	 	
		List<String> allPreviousStepIds = new ArrayList<String>();			
		while(currentStepIds.size() > 0){
			List<String> fromStepIds = new ArrayList<String>();
			for(String stepId : currentStepIds){
				List<DataRow> stepRows = this.getPreviousSteps(stepId);
				for(DataRow stepRow : stepRows){
					String processUserId = stepRow.getStringValue("userid"); 
					String fromStepId = stepRow.getStringValue("fromstepid");
					fromStepIds.add(fromStepId);	
					if(!allPreviousStepIds.contains(fromStepId)){
						allPreviousStepIds.add(fromStepId);
						if(!allPreviousStepUserIds.contains(processUserId)){
							allPreviousStepUserIds.add(processUserId);
						}
					}
				}
			}
			currentStepIds = fromStepIds;
		}
		return allPreviousStepUserIds;
	}
	
	//单据流转，新的处理人
	private List<String> createSteps(String instanceId, List<String> fromUserIds, List<String> fromStepIds, List<String> nextUserIds, List<String> titles, String note, List<Date> fileLastModifyTimes, StepOperateType operateType, StepResultType resultType) throws SQLException, NcpException{
		Date currentTime = new Date(); 
		for(int i = 0; i < fromStepIds.size(); i++){
			String fromStepId = fromStepIds.get(i);
			String fromUserId = fromUserIds.get(i);
			DataRow fromStepRow = this.getStep(fromStepId);
			Date processTime = fromStepRow.getDateTimeValue("processtime");
			String processUserId = fromStepRow.getStringValue("userid");
			
			if(processTime != null){
				throw new NcpException("createStep_002", "流程已经发生变化(其他人执行了发送、取回或退回操作), 请刷新后重新操作.");
			}
			else if(!fromUserId.equals(processUserId)){
				throw new NcpException("createStep_003", "流程已经发生变化(操作人发生变更), 请刷新后重新操作.");
			}
			
			this.updateStepProcessTime(fromStepId, currentTime, resultType, note);
		}			
		
		List<String> toStepIds = new ArrayList<String>();
		
		for(int i = 0; i < nextUserIds.size(); i++){
			String nextUserId = nextUserIds.get(i);
			Date fileLastModifyTime = fileLastModifyTimes.get(i);
			String title = titles.get(i);
			String toStepId = this.createStep(nextUserId, instanceId, title, currentTime, fileLastModifyTime, operateType);
			toStepIds.add(toStepId);
		}
		for(int i = 0; i < fromStepIds.size(); i++){
			String fromStepId = fromStepIds.get(i); 
			for(String toStepId : toStepIds){ 
				this.createStepLink(fromStepId, toStepId, instanceId, currentTime); 
			}
		}
		
		String statusNote = this.getNewStatusNote(instanceId);
		
		this.updateInstanceModifyTime(instanceId, currentTime, statusNote);
		return toStepIds;
	}
	
	private String getNewStatusNote(String instanceId) throws SQLException{
		String stepSql = "select ip.id as stepid, ip.userid as userid, ipu.name as username"
			+ " from eg_instancestep ip"
			+ " left outer join d_user ipu on ipu.id = ip.userid"
			+ " where ip.instanceid = " + SysConfig.getParamPrefix() + "instanceId"
			+ " and ip.resulttype =" + SysConfig.getParamPrefix() + "resultType";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("instanceId", instanceId);
		p2vs.put("resultType", StepResultType.waitingProcess.toString());
		
		List<String> alias = new ArrayList<String>();
		alias.add("stepid");
		alias.add("userid");
		alias.add("username");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("stepid", ValueType.String);
		valueTypes.put("userid", ValueType.String);
		valueTypes.put("username", ValueType.String);
		
		DataTable stepTable = this.dBParserAccess.selectList(dbSession, stepSql, p2vs, alias, valueTypes);
		List<DataRow> stepRows = stepTable.getRows();
		HashMap<String, String> userHash = new HashMap<String, String>();
		List<String> userNames = new ArrayList<String>();
		boolean hasTooManyUser = false;
		int needUserCount = 5;
		for(DataRow stepRow : stepRows){
			String userId = stepRow.getStringValue("userid");
			if(userId != null && !userId.isEmpty() && !userHash.containsKey(userId)){
				if(userHash.size() < needUserCount){
					userHash.put(userId, null);
					String userName = stepRow.getStringValue("username");
					userNames.add(userName);
				}
				else{
					hasTooManyUser = true;
				}
			}
		}
		if(userNames.size() == 0){
			return "已完成";
		}
		else{
		 	String statusNote = "待 " + CommonFunction.listToString(userNames, ", ") + " " + (hasTooManyUser ? "等等人" : "") + "处理";
		 	return statusNote;
		}
	}
	
	private void lockInstance(String instanceId) throws SQLException{
		String lockInstanceSql = "select i.id as id"
			+ " from eg_instance i where i.id = " + SysConfig.getParamPrefix() + "instanceId for update";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("instanceId", instanceId);

		List<String> alias = new ArrayList<String>();
		alias.add("id"); 
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String); 
		this.getDBParserAccess().selectList(dbSession, lockInstanceSql, p2vs, alias, valueTypes); 
	}
	
	private void updateInstanceModifyTime(String instanceId, Date currentTime, String statusNote){ 
		String updateInstanceModifyTimeSql = "update eg_instance set lastmodifytime = " + SysConfig.getParamPrefix() +"currentTime,"
			+ "statusnote = " + SysConfig.getParamPrefix() + "statusNote"
			+ " where id = " + SysConfig.getParamPrefix() + "instanceId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("instanceId", instanceId);
		p2vs.put("currentTime", currentTime); 
		p2vs.put("statusNote", statusNote); 
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().update(dbSession, updateInstanceModifyTimeSql, p2vs);
	}
	
	private void updateStepFileModifyTime(String stepId, Date currentTime, String title){ 
		String updateStepFileModifyTimeSql = "update eg_instancestep set filelastmodifytime = " + SysConfig.getParamPrefix() +"currentTime,"
				+ " title =" + SysConfig.getParamPrefix() + "title"
				+ " where id = " + SysConfig.getParamPrefix() + "stepId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("stepId", stepId);
		p2vs.put("currentTime", currentTime);
		p2vs.put("title", title);
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().update(dbSession, updateStepFileModifyTimeSql, p2vs);
	}
	
	private void updateStepProcessTime(String stepId, Date currentTime, StepResultType resultType, String note){ 
		String updateStepProcessTimeSql = "update eg_instancestep set"
			+ " processtime = " + SysConfig.getParamPrefix() +"currentTime,"
			+ " resulttype = " + SysConfig.getParamPrefix() +"resultType,"
			+ " note = " + SysConfig.getParamPrefix() +"note"
			+ " where id = " + SysConfig.getParamPrefix() + "stepId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("stepId", stepId);
		p2vs.put("currentTime", currentTime);
		p2vs.put("resultType", resultType.toString()); 
		p2vs.put("note", note);
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().update(dbSession, updateStepProcessTimeSql, p2vs);
	}
	
	public List<DataRow> getStep(INcpSession session, String instanceId, StepOperateType operateType) throws NcpException, SQLException{
		String getStepSql = "select ip.id as id, ip.instanceid as instanceid, ip.title as title, ip.createtime as createtime, ip.processtime as processtime, ip.userid as userid, ip.operatetype as operatetype, ip.title as title, ip.filelastmodifytime as filelastmodifytime"
			+ " from eg_instancestep ip where ip.instanceid = " + SysConfig.getParamPrefix() + "instanceId and ip.operatetype = " + SysConfig.getParamPrefix() + "operateType";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("instanceId", instanceId);
		p2vs.put("operateType", operateType.toString());

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("instanceid");
		alias.add("title");
		alias.add("createtime");
		alias.add("processtime");
		alias.add("userid");
		alias.add("operatetype");
		alias.add("title");
		alias.add("filelastmodifytime");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("instanceid", ValueType.String);
		valueTypes.put("title", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("processtime", ValueType.Time);
		valueTypes.put("userid", ValueType.String);
		valueTypes.put("operatetype", ValueType.String);
		valueTypes.put("title", ValueType.String);
		valueTypes.put("filelastmodifytime", ValueType.String);
		
		DataTable stepDt = this.getDBParserAccess().selectList(dbSession, getStepSql, p2vs, alias, valueTypes);
		List<DataRow> stepRows = stepDt.getRows(); 
		return stepRows;
	}
	
	public DataRow getStep(String stepId) throws NcpException, SQLException{
		String getStepSql = "select ip.id as id,"
			+ " ip.instanceid as instanceid,"
			+ " ip.title as title,"
			+ " ip.createtime as createtime,"
			+ " ip.processtime as processtime,"
			+ " ip.userid as userid,"
			+ " ip.operatetype as operatetype,"
			+ " ip.resulttype as resulttype,"
			+ " ip.filelastmodifytime as filelastmodifytime"
			+ " from eg_instancestep ip where ip.id = " + SysConfig.getParamPrefix() + "stepId";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("stepId", stepId);

		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("instanceid");
		alias.add("title");
		alias.add("createtime");
		alias.add("processtime");
		alias.add("userid");
		alias.add("operatetype"); 
		alias.add("resulttype"); 
		alias.add("filelastmodifytime");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("instanceid", ValueType.String);
		valueTypes.put("title", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("processtime", ValueType.Time);
		valueTypes.put("userid", ValueType.String);
		valueTypes.put("operatetype", ValueType.String); 
		valueTypes.put("resulttype", ValueType.String); 
		valueTypes.put("filelastmodifytime", ValueType.String);
		
		DataTable stepDt = this.getDBParserAccess().selectList(dbSession, getStepSql, p2vs, alias, valueTypes);
		List<DataRow> stepRows = stepDt.getRows();
		if(stepRows.size() == 0){
			throw new NcpException("getStep_002", "Can not get instance step row. stepId = " + stepId);
		}
		else{
			return stepRows.get(0);
		}
	}
	
	//添加stepLink
	private void createStepLink(String fromStepId, String toStepId, String instanceId, Date currentTime){
		Data stepLinkData = DataCollection.getData("eg_InstanceStepLink");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("instanceid", instanceId);
		f2vs.put("fromstepid", fromStepId);
		f2vs.put("tostepid", toStepId);
		f2vs.put("createtime", currentTime);
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().insertByData(dbSession, stepLinkData, f2vs);
	}
	
	private String createStep(String stepUserId, String instanceId, String title, Date currentTime, Date fileLastModifyTime, StepOperateType operateType){		
		String stepId = UUID.randomUUID().toString();
		this.createStep(stepUserId, instanceId, stepId, title, currentTime, fileLastModifyTime, operateType);
		return stepId;
	}
	
	private void createStep(String stepUserId, String instanceId, String createStepId, String title, Date currentTime, Date fileLastModifyTime, StepOperateType operateType){		
		Data stepData = DataCollection.getData("eg_InstanceStep");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("instanceid", instanceId);
		f2vs.put("userid", stepUserId);
		f2vs.put("filelastmodifytime", fileLastModifyTime);
		f2vs.put("createtime", currentTime);
		f2vs.put("title", title);
		f2vs.put("operatetype", operateType.toString());
		f2vs.put("resulttype", StepResultType.waitingProcess.toString());
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().insertByData(dbSession, stepData, f2vs, createStepId); 
	} 
	
	private void createInstance(String instanceId, String createStepId, String definitionId, String versionId, String teamId, String userId, String title, Date currentTime){	
		
		Random r = new Random(99999);
		r.setSeed(currentTime.getTime());
		String randomStr = String.format("%05d", r.nextInt());
		
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String timeStr = sdf.format(currentTime); 
		
		String code = timeStr + randomStr;
		String statusNote = "新创建, 尚未发送给其他人";
		
		Data instanceData = DataCollection.getData("eg_Instance");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("definitionid", definitionId);
		f2vs.put("versionid", versionId); 
		f2vs.put("code", code); 
		f2vs.put("createuserid", userId);
		f2vs.put("createtime", currentTime);
		f2vs.put("lastmodifytime", currentTime);
		f2vs.put("teamid", teamId);
		f2vs.put("title", title);
		f2vs.put("isdeleted", "N");
		f2vs.put("statusnote", statusNote);
		f2vs.put("createstepid", createStepId);
		
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().insertByData(dbSession, instanceData, f2vs, instanceId); 
	}  
	 
	public DataRow getCreateStep(INcpSession session, String instanceId) throws Exception{
		
		List<DataRow> stepRows = this.getStep(session, instanceId, StepOperateType.create);
		if(stepRows.size() == 0){
			throw new NcpException("getCreateStep_002", "无法获取其创建节点");
		}
		else if(stepRows.size() > 1){
			throw new NcpException("getCreateStep_003", "一个实例不能有两个创建节点");
		}
		
		DataRow stepRow = stepRows.get(0);
		return stepRow;
	}
	
	public JSONObject getInstanceStepsAndLinks(String userId, String instanceId) throws SQLException, UnsupportedEncodingException {
		List<String> stepIds = this.getIntanceStepIdsOneInstance(instanceId);
		List<DataRow> stepRows = this.getInstanceSteps(stepIds, StepOrderByType.ProcessTime);
		List<String> stepLinkIds = this.getIntanceStepLinkIdsOneInstance(instanceId);
		List<DataRow> stepLinkRows = this.getInstanceStepLinks(stepLinkIds);
		
		JSONObject instanceObj = new JSONObject();
		instanceObj.put("id", instanceId);
		
		JSONArray stepObjects = new JSONArray();
		for(DataRow stepRow : stepRows){
			JSONObject stepObj = new JSONObject();
			stepObj.put("id", stepRow.getStringValue("id")); 
			stepObj.put("title", CommonFunction.encode(stepRow.getStringValue("steptitle")));  
			stepObj.put("processUserId", stepRow.getStringValue("processuserid")); 
			stepObj.put("processUserName", CommonFunction.encode(stepRow.getStringValue("processusername"))); 
			stepObj.put("stepCreateTime", ValueConverter.dateTimeToString(stepRow.getDateTimeValue("stepcreatetime"), "yyyy-MM-dd HH:mm:ss")); 
			stepObj.put("processTime", ValueConverter.dateTimeToString(stepRow.getDateTimeValue("processtime"), "yyyy-MM-dd HH:mm:ss"));
			stepObj.put("operateType", stepRow.getStringValue("operatetype"));
			stepObj.put("resultType", stepRow.getStringValue("resulttype"));
			stepObj.put("note", CommonFunction.encode(stepRow.getStringValue("note")));
			stepObjects.add(stepObj);
		}
		instanceObj.put("steps", stepObjects);
		
		JSONArray stepLinkObjects = new JSONArray();
		if(stepLinkRows != null){
			for(DataRow stepLinkRow : stepLinkRows){
				JSONObject stepLinkObj = new JSONObject();
				stepLinkObj.put("id", stepLinkRow.getStringValue("id")); 
				stepLinkObj.put("fromStepId", stepLinkRow.getStringValue("fromstepid"));  
				stepLinkObj.put("toStepId", stepLinkRow.getStringValue("tostepid"));  
				stepLinkObj.put("createTime", ValueConverter.dateTimeToString(stepLinkRow.getDateTimeValue("createtime"), "yyyy-MM-dd HH:mm:ss"));
				stepLinkObjects.add(stepLinkObj);
			}
		}
		instanceObj.put("stepLinks", stepLinkObjects);
		return instanceObj;
	} 
}