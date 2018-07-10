package com.novacloud.novaone.excelGrid.team;

import java.math.BigInteger;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import com.novacloud.novaone.user.SystemUserProcessor;

public class TeamProcessor {
	
	//用户最多拥有的团队个数
	private int userMaxOwnGroupCount = 10;
	public int getUserMaxOwnGroupCount() {
		return userMaxOwnGroupCount;
	}
	public void setUserMaxOwnGroupCount(int userMaxOwnGroupCount) {
		this.userMaxOwnGroupCount = userMaxOwnGroupCount;
	}

	private SystemUserProcessor systemUserProcessor = null;
	public SystemUserProcessor getSystemUserProcessor() {
		return systemUserProcessor;
	}
	public void setSystemUserProcessor(SystemUserProcessor systemUserProcessor) {
		this.systemUserProcessor = systemUserProcessor;
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
	
	
	//新建团队
	public String addTeam(INcpSession session, String name, String description) throws SQLException, NcpException{
		String userId = session.getUserId(); 
		
		//新建团队，每个人的团队个数不能超过允许的团队数目		
		int teamCount = this.getOwnTeamCount(userId);
		if(this.getUserMaxOwnGroupCount() <= teamCount){
			NcpException ex = new NcpException("addTeam_002", "不能新建团队, 每个人允许建立的团队数不能超过 " + this.getUserMaxOwnGroupCount());
			throw ex;
		}
		
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			String teamId = this.addTeam(userId, name, description);
			this.addMember(teamId, userId, true); 
			tx.commit();
			return teamId;  
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 
	}
	
	private String addTeam(String userId, String name, String description){
		Data teamData = DataCollection.getData("tm_Team");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();  
		
		Date nowDate = new Date();
		String code = ValueConverter.dateTimeToString(nowDate, "yyyyMMddHHmmssSSS");
		fieldValues.put("code", code);
		fieldValues.put("name", name);
		fieldValues.put("description", description);
		fieldValues.put("createtime", nowDate);
		fieldValues.put("createuserid", userId);
		fieldValues.put("isdeleted", "N");
			
		Session dbSession = this.getDBSession();
		String teamId = this.getDBParserAccess().insertByData(dbSession, teamData, fieldValues);
		
		
		return teamId;
	} 
	
	private void saveTeam(String teamId, String name, String description){
		Data teamData = DataCollection.getData("tm_Team");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();  
		 
		fieldValues.put("name", name);
		fieldValues.put("description", description);
			
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().updateByData(dbSession, teamData, fieldValues, teamId);
	}
	
	private int getOwnTeamCount(String userId) throws SQLException{
		String teamCountSql = "select count(1) as teamcount from tm_team t where t.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		Session dbSession = this.getDBSession();
		int teamCount = ((BigInteger)this.getDBParserAccess().selectOne(dbSession, teamCountSql, p2vs)).intValue();
		return teamCount;
	}
	
	public void deleteTeam(INcpSession session, String teamId){
		String userId = session.getUserId();
		this.deleteTeam(teamId, userId);
	}
	
	private void deleteTeam(String teamId, String userId){
		String teamDeleteSql = "update tm_team count(1) as teamcount from tm_team t where t.createuserid = " + SysConfig.getParamPrefix() + "userId and id = " + SysConfig.getParamPrefix() + "teamId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("teamId", teamId);
		p2vs.put("userId", userId);
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().update(dbSession, teamDeleteSql, p2vs); 
	}
	
	public void updateTeamInfo(INcpSession session, String teamId, String name, String description) throws NcpException, SQLException{ 
		String userId = session.getUserId(); 
		
		//新建团队，每个人的团队个数不能超过允许的团队数目		
		boolean isTeamManager = this.isTeamManager(userId, teamId);
		if(isTeamManager){
			this.updateTeamInfo(userId, teamId, name, description);
		}
		else{
			NcpException ex = new NcpException("updateTeamInfo_002", "您不是团队的管理员,没有权限更改团队基本信息");
			throw ex;
		}
	}
	
	private void updateTeamInfo(String userId, String teamId, String name, String description){
		String updateSql = "update tm_team set name = " + SysConfig.getParamPrefix() + "name, description = " + SysConfig.getParamPrefix() + "description where id = " + SysConfig.getParamPrefix() + "teamId and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("teamId", teamId);
		p2vs.put("userId", userId);
		p2vs.put("name", name);
		p2vs.put("description", description);
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().update(dbSession, updateSql, p2vs); 
	}
	
	public void requestJoinTeam(INcpSession session, String teamId, String message) throws SQLException, NcpException{
		String userId = session.getUserId();
		boolean isMember = this.isTeamMember(userId, teamId);
		if(isMember){
			throw new NcpException("requestJoinTeam_002", "已经加入此团队");
		}
		else{
			boolean hasRequest = this.hasRequestJoin(userId, teamId);
			if(hasRequest){
				throw new NcpException("requestJoinTeam_003", "此前已发送加入请求，请勿重复发送");
			}
			else{
				this.requestJoinTeam(userId, teamId, message);
			}
		}
	}
	
	private void requestJoinTeam(String userId, String teamId, String message) throws SQLException{
		Date currentTime = new Date();
		Data joinData = DataCollection.getData("tm_Join");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("joinuserid", userId);
		f2vs.put("teamid", teamId);
		f2vs.put("message", message);
		f2vs.put("status", "request");
		f2vs.put("requesttime",currentTime);
		this.getDBParserAccess().insertByData(dbSession, joinData, f2vs); 
	}
	
	//踢出，从团队中删除成员memberId时，在数据库记录下来删除日志
	private void logDeleteFromTeam(String memberId, String processUserId, String teamId) throws SQLException{
		Date currentTime = new Date();
		Data joinData = DataCollection.getData("tm_Join");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("joinuserid", memberId);
		f2vs.put("teamid", teamId); 
		f2vs.put("status", "deleted");
		f2vs.put("requesttime", currentTime);
		f2vs.put("processuserid", processUserId);
		f2vs.put("processtime", currentTime);
		this.getDBParserAccess().insertByData(dbSession, joinData, f2vs); 
	}
	
	//离开，从团队中删除成员memberId时，在数据库记录下来删除日志
	private void logLeaveFromTeam(String memberId, String processUserId, String teamId) throws SQLException{
		Date currentTime = new Date();
		Data joinData = DataCollection.getData("tm_Join");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("joinuserid", memberId);
		f2vs.put("teamid", teamId); 
		f2vs.put("status", "left");
		f2vs.put("requesttime", currentTime);
		f2vs.put("processuserid", processUserId);
		f2vs.put("processtime", currentTime);
		this.getDBParserAccess().insertByData(dbSession, joinData, f2vs); 
	}
	
	private boolean hasRequestJoin(String userId, String teamId) throws SQLException{
		String requestCountSql = "select count(1) as requestCount from tm_join j where j.joinuserid = " + SysConfig.getParamPrefix() +"userId and j.teamid = " + SysConfig.getParamPrefix() + "teamId and j.status = 'request'";
		HashMap<String, Object> hasRequestP2vs = new HashMap<String, Object>();
		hasRequestP2vs.put("userId", userId);
		hasRequestP2vs.put("teamId", teamId);
		int requestCount = ((BigInteger)this.getDBParserAccess().selectOne(dbSession, requestCountSql, hasRequestP2vs)).intValue();
		return requestCount > 0;
	}
	
	public boolean isTeamMember(String userId, String teamId) throws SQLException{
		String isMemberSql = "select count(1) as memberCount from tm_teammember tm where tm.memberid = " + SysConfig.getParamPrefix() + "userId and tm.teamid = " + SysConfig.getParamPrefix() + "teamId";
		HashMap<String, Object> isMemberP2vs = new HashMap<String, Object>();
		isMemberP2vs.put("userId", userId);
		isMemberP2vs.put("teamId", teamId);
		int memberCount = ((BigInteger)this.getDBParserAccess().selectOne(dbSession, isMemberSql, isMemberP2vs)).intValue();
		return memberCount > 0;
	}
	
	public void processJoinTeam(INcpSession session, String joinUserId, String teamId, boolean applyOrReject) throws SQLException, NcpException{
		String processUserId = session.getUserId();
		boolean isTeamManager = this.isTeamManager(processUserId, teamId); 
		if(isTeamManager){
			boolean hasRequest = this.hasRequestJoin(joinUserId, teamId);
			if(hasRequest){ 
				this.processJoinTeam(processUserId, joinUserId, teamId, applyOrReject);
			}
			else{
				throw new NcpException("processJoinTeam_003", "不存在此用户的加入申请或加入申请已处理");
			}
		}
		else{
			throw new NcpException("processJoinTeam_002", "没有权限执行此操作");
		}
	}
	
	private void addMember(String teamId, String memberId, boolean isManager){
		Session dbSession = this.getDBSession();
		Data memberData = DataCollection.getData("tm_TeamMember");
		HashMap<String, Object> f2vs = new HashMap<String, Object>();
		f2vs.put("memberid", memberId);
		f2vs.put("teamid", teamId);
		f2vs.put("ismanager", isManager ? "Y" : "N");
		this.getDBParserAccess().insertByData(dbSession, memberData, f2vs); 
	}
	
	private void processJoinTeam(String processUserId, String joinUserId, String teamId, boolean applyOrReject) throws NcpException{
		Date currentTime = new Date();
		Session dbSession = this.getDBSession();
		String updateSql = "update tm_join set status = " + SysConfig.getParamPrefix() + "status, processuserid = " + SysConfig.getParamPrefix() + "processUserId, processtime = " + SysConfig.getParamPrefix() + "processTime where joinuserid = " + SysConfig.getParamPrefix() + "joinUserId and teamid = " + SysConfig.getParamPrefix() + "teamId and status = 'request'";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("status", applyOrReject ? "applied" : "rejected");
		p2vs.put("processTime", currentTime);
		p2vs.put("processUserId", processUserId);
		p2vs.put("joinUserId", joinUserId);
		p2vs.put("teamId", teamId); 
		this.getDBParserAccess().update(dbSession, updateSql, p2vs); 
		
		if(applyOrReject){ 
			this.addMember(teamId, joinUserId, false);
		}	
		
		DataRow teamObj = this.getTeamInfo(teamId);
		String teamName = teamObj.getStringValue("name");
		String teamCode = teamObj.getStringValue("code");
		
		SystemUserProcessor systemUserProcessor = this.getSystemUserProcessor();
		systemUserProcessor.setDBSession(dbSession);
		DataRow userObj = systemUserProcessor.getUserInfo(joinUserId);
		String userName = userObj.getStringValue("name");
		String userCode = userObj.getStringValue("code");
		
		String content = "";
		if(applyOrReject){ 
			content = "尊敬的用户 " + userName + "(" + userCode + "):\r\n"
				+ "    您好!\r\n"
				+ "    您已经被同意并加入到 " + teamName + "(" + teamCode + ")" + ".\r\n"
				+ "---------------------------------------------\r\n"
				+ "系统管理员\r\n"
				+ ValueConverter.dateTimeToString(new Date(), "yyyy-MM-dd HH:mm");
		}
		else{
			content = "尊敬的用户 " + userName + "(" + userCode + "):\r\n"
				+ "    很抱歉!\r\n"
				+ "    您被拒绝加入到 " + teamName + "(" + teamCode + ")" + ".\r\n"
				+ "---------------------------------------------\r\n"
				+ "系统管理员\r\n"
				+ ValueConverter.dateTimeToString(new Date(), "yyyy-MM-dd HH:mm");
		}
		systemUserProcessor.sendUserMessage(processUserId, joinUserId, content);	
	}
	
	public DataRow getTeamInfo(String teamId) throws NcpException{ 
		Data teamData = DataCollection.getData("tm_Team");
		Session dbSession = this.getDBSession();
		DataTable teamDt = this.getDBParserAccess().getDtById(dbSession, teamData, teamId);
		List<DataRow> teamRows = teamDt.getRows();
		if(teamRows.size() == 0){
			throw new NcpException("getTeamInfo_002", "不存在的团队, teamId = " + teamId);
		}
		else{
			return teamRows.get(0);
		}
	}
	
	public boolean isTeamOwner(String userId, String teamId) throws SQLException{
		String ownerId = this.getTeamOwnerId(teamId); 
		return userId.equals(ownerId);
	}
	
	private String getTeamOwnerId(String teamId) throws SQLException{
		String ownerSql = "select t.createuserid as createUserId from tm_team t where t.id = " + SysConfig.getParamPrefix() + "teamId";
		HashMap<String, Object> ownerP2vs = new HashMap<String, Object>(); 
		ownerP2vs.put("teamId", teamId);
		String createUserId = (String)this.getDBParserAccess().selectOne(dbSession, ownerSql, ownerP2vs);
		return createUserId;
	}
	
	public boolean isTeamManager(String userId, String teamId) throws SQLException{
		String managerSql = "select count(1) as managerCount from tm_teammember tm where tm.teamid = " + SysConfig.getParamPrefix() + "teamId and tm.memberid = " + SysConfig.getParamPrefix() + "userId and tm.ismanager = 'Y'";
		HashMap<String, Object> mP2vs = new HashMap<String, Object>(); 
		mP2vs.put("teamId", teamId);
		mP2vs.put("userId", userId);
		int managerCount = ((BigInteger)this.getDBParserAccess().selectOne(dbSession, managerSql, mP2vs)).intValue();
		return managerCount > 0;
	}
	
	public void deleteFromTeam(INcpSession session, String memberId, String teamId) throws SQLException, NcpException{
		String processUserId = session.getUserId();
		if(processUserId.equals(memberId)){
			throw new NcpException("deleteFromTeam_002", "不能将自己删除");
		}
		else{
			boolean isTeamOwner = this.isTeamOwner(memberId, teamId);
			if(isTeamOwner){
				throw new NcpException("deleteFromTeam_003", "不能删除团队的创建人");
			}
			else{
				boolean sessionUserIsManager = this.isTeamManager(processUserId, teamId);
				if(sessionUserIsManager){
					this.deleteFromTeam(memberId, teamId);			
					this.logDeleteFromTeam(memberId, processUserId, teamId);
				}
				else{
					throw new NcpException("deleteFromTeam_004", "您不是团队管理员, 无权进行此操作");
				}
			}
		}
	}
	
	private void deleteFromTeam(String memberId, String teamId){
		String deleteSql = "delete from tm_teammember where memberid = " + SysConfig.getParamPrefix() + "memberId and teamid = " + SysConfig.getParamPrefix() + "teamId";
		HashMap<String, Object> deleteP2vs = new HashMap<String, Object>();
		deleteP2vs.put("memberId", memberId);
		deleteP2vs.put("teamId", teamId);
		Session dbSession = this.getDBSession();
		this.getDBParserAccess().delete(dbSession, deleteSql, deleteP2vs);
	}

	public void leaveFromTeam(INcpSession session, String teamId) throws SQLException, NcpException{
		String userId = session.getUserId();
		boolean isMember = this.isTeamMember(userId, teamId);
		if(isMember){
			boolean isTeamOwner = this.isTeamOwner(userId, teamId);
			if(isTeamOwner){
				throw new NcpException("leaveFromTeam_002", "团队的创建者不能离开团队");
			}
			else{
				this.deleteFromTeam(userId, teamId);			
				this.logLeaveFromTeam(userId, userId, teamId);
			}
		}
	}
	
	//获取此人所在的团队信息
	public List<DataRow> getMemberTeams(String memberId) throws SQLException{
		String teamSql = "select tm.memberid as memberid, tm.teamid as teamid, t.name as teamname, tm.ismanager as ismanager from tm_teammember tm"
			+ " left outer join tm_team t on t.id = tm.teamid"
			+ " where tm.memberId = " + SysConfig.getParamPrefix() + "memberId and t.isdeleted = 'N' order by t.name asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("memberId", memberId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("memberid");
		alias.add("teamid");
		alias.add("teamname");
		alias.add("ismanager");
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();		
		fieldValueTypes.put("memberid", ValueType.String);
		fieldValueTypes.put("teamid", ValueType.String);
		fieldValueTypes.put("teamname", ValueType.String);
		fieldValueTypes.put("ismanager", ValueType.Boolean);
		
		Session dbSession = this.getDBSession();
		DataTable teamDt = this.getDBParserAccess().selectList(dbSession, teamSql, p2vs, alias, fieldValueTypes);
		List<DataRow> teamRows = teamDt.getRows();
		return teamRows;
	}

	
	//获取某个团队teamid的所有表格类型definition	
	public List<DataRow> getTeamDefinitions(String teamId) throws SQLException{
		String teamDefinitionSql = "select d.id as definitionid, d.name as definitionname, d.teamid as teamid, v.id as versionid"
			+ " from eg_definition d"
			+ " left outer join eg_definitionversion v on v.definitionid = d.id"
			+ " where d.teamid = " + SysConfig.getParamPrefix() + "teamId and d.isdeleted = 'N' and v.enable ='Y' and v.isdeleted='N' order by d.name asc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("teamId", teamId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("definitionid");
		alias.add("definitionname");
		alias.add("teamid"); 
		alias.add("versionid");  
		
		HashMap<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();		
		fieldValueTypes.put("definitionid", ValueType.String);
		fieldValueTypes.put("definitionname", ValueType.String);
		fieldValueTypes.put("teamid", ValueType.String); 
		fieldValueTypes.put("versionid", ValueType.String); 
		
		Session dbSession = this.getDBSession();
		DataTable tdDt = this.getDBParserAccess().selectList(dbSession, teamDefinitionSql, p2vs, alias, fieldValueTypes);
		List<DataRow> definitionRows = tdDt.getRows();
		return definitionRows;
	}	
}
