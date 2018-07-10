package com.novacloud.novaone.excelGrid.definition;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.util.PaneInformation;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
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
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.dao.sys.IAccessoryDao;
import com.novacloud.novaone.excelGrid.expression.definition.CellObject;
import com.novacloud.novaone.excelGrid.expression.definition.Columns;
import com.novacloud.novaone.excelGrid.expression.definition.ExpTreePart;
import com.novacloud.novaone.excelGrid.expression.definition.Rows;
import com.novacloud.novaone.excelGrid.expression.run.RunResult;
import com.novacloud.novaone.excelGrid.expression.run.Runner;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONObject;

public class ExcelGridProcessor {

	//执行数据库操作的通用类
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	}  
	private IDBParserAccess getDBParserAccess() {
		return this.dBParserAccess;
	}
	
	//对应附件表里filter字段值
	private String accessoryFilterType = ""; 
	public String getAccessoryFilterType() {
		return accessoryFilterType;
	}
	public void setAccessoryFilterType(String accessoryFilterType) {
		this.accessoryFilterType = accessoryFilterType;
	}

	//附件处理接口
	private IAccessoryDao accessoryDao;
	public IAccessoryDao getAccessoryDao() {
		return accessoryDao;
	}
	public void setAccessoryDao(IAccessoryDao accessoryDao) {
		this.accessoryDao = accessoryDao;
	}
	
	//excel转换为excelgrid
	private ConvertExcelToExcelGridProcessor convertExcelToExcelGridProcessor;
	public ConvertExcelToExcelGridProcessor getConvertExcelToExcelGridProcessor() {
		return convertExcelToExcelGridProcessor;
	}
	public void setConvertExcelToExcelGridProcessor(ConvertExcelToExcelGridProcessor convertExcelToExcelGridProcessor) {
		this.convertExcelToExcelGridProcessor = convertExcelToExcelGridProcessor;
	}
	
	
	//数据库Session（需要Service类里的方法把dbSession传递过来）
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
	
	//文件的保存文件位置（模板文件）
	private String definitionFileDirectory = null;
	public String getDefinitionFileDirectory(){
		if(definitionFileDirectory == null){
			definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_EXCELGRID_DEFINITIONFILEDIRECTORY);
		}
		return definitionFileDirectory;
	}	

    static SimpleDateFormat sFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    static short[] yyyyMMdd = {14, 31, 57, 58, 179, 184, 185, 186, 187, 188};
    static short[] HHmmss = {20, 32, 190, 191, 192};
    static List<short[]> yyyyMMddList = Arrays.asList(yyyyMMdd);
    static List<short[]> hhMMssList = Arrays.asList(HHmmss);

	//启用模板版本
	public void activateVersion(INcpSession session, String excelGridId, String excelGridVersionId) throws Exception{
		String userId = session.getUserId();
		String excelGridJsonStr = this.readVersion(session, excelGridId, excelGridVersionId);
		ValidateResult vr = this.validateVersion(session, excelGridId, excelGridJsonStr);
		if(vr.getSucceed()){
			//将当前version设置为启用状态
			this.activateVersionInDB(excelGridId, excelGridVersionId, userId);
		}
		else{
			throw new NcpException("activateVersion_002", vr.getError());
		} 
	} 
	
	//停用模板版本
	public void inactivateVersion(INcpSession session, String excelGridId, String excelGridVersionId) throws Exception{
		String userId = session.getUserId();
		this.inactivateVersionInDB(excelGridId, excelGridVersionId, userId);
	}
	
	//计算填报结果（已经对填报内容和表达式继续了语法验证）
	public String calcDefinition(INcpSession session, ExcelGridValidateResult vr, String excelGridId, String excelGridVersionId, ExcelGrid excelGrid) throws Exception{
		this.calcDefinition(session, vr, excelGrid);
		
		String filePath = this.saveToVersionFile(excelGridId, excelGridVersionId, excelGrid);	
		return filePath;
	} 
	
	//计算填报结果（已经对填报内容和表达式继续了语法验证）
	public void calcDefinition(INcpSession session, ExcelGridValidateResult vr,  ExcelGrid excelGrid) throws Exception{
		 //递归逐个单元格计算表达式结果，并将结果赋值到excelGrid里，并存储下来，返回存储路径（相对路径）
		HashMap<String, Object> cellValues = new HashMap<String, Object>();
		HashMap<String, ExcelGridCell> allCells = excelGrid.getAllCells();
		for(String cellId : allCells.keySet()){
			ExcelGridCell cell = allCells.get(cellId);
			if(!cell.getIsExp()){
				cellValues.put(cellId, cell.getValue());
			}
		}
		List<String> calcCellIds = vr.getCalcCellList();
		Map<String, ExpTreePart> allExpTreeParts = vr.getAllCellRootParts();
		Runner runner = (Runner)ContextUtil.getBean("egExpRunner"); 
		for(String cellId : calcCellIds){
			ExcelGridCell calcCell = allCells.get(cellId);
			String sheetId = calcCell.getSheetId();
			ExpTreePart rootPart = allExpTreeParts.get(cellId);	
			RunResult result = runner.runExp(rootPart, cellValues, null, sheetId, vr.getSheets(), dbSession);
			if(result.getSucceed()){
				Object  resultValue = result.getValue();
				if(resultValue instanceof CellObject){
					resultValue = ((CellObject)resultValue).getValue();
				}
				ExcelGridCell cell = allCells.get(cellId);
				cell.setValue(resultValue);
				cellValues.put(cellId, resultValue);		
				cell.setIsError(false);
			}
			else{
				ExcelGridCell cell = allCells.get(cellId);
				//String cellName = excelGrid.getCellNameById(cellId, vr.getColumns(), vr.getRows());		
				cell.setIsError(true);
				cell.setNote(result.getError());
				//throw new Exception(cellName + "执行公式出错: " + result.getError());
			}
		} 
	}
	
	//验证模板版本（模板内容为字符串形式）
	public ExcelGridValidateResult validateVersion(INcpSession session, String excelGridId, String excelGridJsonStr) throws Exception{
		JSONObject jsonObj = JSONProcessor.strToJSON(excelGridJsonStr);
		ExcelGrid excelGrid = ExcelGrid.fromJson(jsonObj); 
		ExcelGridValidateResult vr = excelGrid.validate(); 
		return vr;
	} 
	
	//验证并更新模板版本（模板内容为字符串形式）
	public boolean getIsEnableVersion(INcpSession session, String excelGridId, String excelGridVersionId) throws Exception{
		boolean isEnable = this.isEnableVersion(excelGridVersionId);
		return isEnable;
	} 
	
	//验证并更新模板版本（模板内容为字符串形式）
	public JSONObject validateAndUpdateVersion(INcpSession session, String excelGridId, String excelGridVersionId, String userId, String excelGridJsonStr, String description, boolean needCreateNewVersion) throws Exception{
		JSONObject jsonObj = JSONProcessor.strToJSON(excelGridJsonStr);
		ExcelGrid excelGrid = ExcelGrid.fromJson(jsonObj); 
		ExcelGridValidateResult vr = excelGrid.validate();
		
		JSONObject resultJson = new JSONObject();
 
		if(needCreateNewVersion){
			UUID uuid = UUID.randomUUID();
			excelGridVersionId = uuid.toString();
		}

		resultJson.put("isNewVersion", needCreateNewVersion);
		resultJson.put("excelGridVersionId", excelGridVersionId);
		resultJson.put("validateSucceed", vr.getSucceed());
		
		if(vr.getSucceed()){
			String filePath = this.calcDefinition(session, vr, excelGridId, excelGridVersionId, excelGrid);	
			if(needCreateNewVersion){
				this.createVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
			}
			else{
				this.updateVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
			}
		}
		else{
			//即使没有验证和计算通过，也保存		
			
			String filePath = this.saveToVersionFile(excelGridId, excelGridVersionId, excelGridJsonStr);
			if(needCreateNewVersion){
				this.createVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
			}
			else{
				this.updateVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
			} 
			resultJson.put("error", vr.getError());
		}
		return resultJson;
	}
	
	//创建模板版本
	public String createVersion(INcpSession session, String excelGridId, String excelGridJsonStr, String userId, String description) throws Exception{ 
    	UUID uuid = UUID.randomUUID();
		String excelGridVersionId = uuid.toString();
		String filePath = this.saveToVersionFile(excelGridId, excelGridVersionId, excelGridJsonStr);
		this.createVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
		return excelGridVersionId;
	} 
	
	//删除模板版本（打标记）
	public void deleteVersion(INcpSession session, String excelGridId, List<String> excelGridVersionIds) throws Exception{ 
		String userId = session.getUserId();
		for(String excelGridVersionId : excelGridVersionIds){
			Transaction tx = null;
			try{  
				tx = dbSession.beginTransaction();
				int versionCount = this.getVersionCount(excelGridId, userId);
				if(versionCount > 1){
					this.deleteVersionFromDB(excelGridVersionId, userId);
				}
				else{
					throw new NcpException("deleteVersion_002", "至少保留一个版本");
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
	}

	//删除模板（打标记）
	public void deleteDefinition(INcpSession session, List<String> excelGridIds) throws Exception{ 
		for(String excelGridId : excelGridIds){
			this.deleteDefinitionFromDB(excelGridId, session.getUserId());
		}
	}
	
	//更新模板版本（模板内容为ExcelGrid对象形式）
	public String updateVersion(INcpSession session, String excelGridId, String excelGridVersionId, ExcelGrid excelGrid, String userId, String description) throws Exception{
		JSONObject excelGridJsonObj =  excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		return this.updateVersion(session, excelGridId, excelGridVersionId, excelGridJsonStr, userId, description);
	} 

	//更新模板版本（模板内容为字符串形式）
	public String updateVersion(INcpSession session, String excelGridId, String excelGridVersionId, String excelGridJsonStr, String userId, String description) throws Exception{ 
		String filePath = this.saveToVersionFile(excelGridId, excelGridVersionId, excelGridJsonStr);
		this.updateVersionInDB(excelGridId, excelGridVersionId, userId, filePath, description);
		return excelGridVersionId;
	}

	//创建模板版本
	public String createVersion(INcpSession session, String excelGridId, ExcelGrid excelGrid, String userId, String description) throws Exception{
		JSONObject excelGridJsonObj =  excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		return this.createVersion(session, excelGridId, excelGridJsonStr, userId, description);
	}

	//复制模板版本（即将源版本复制一个新文件，并在数据表eg_definitionVersion插入新行）
	public String copyVersion(INcpSession session, String sourceExcelGridId, String sourceExcelGridVersionId, String userId) throws Exception{
		String excelGridJsonStr = this.readVersion(session, sourceExcelGridId, sourceExcelGridVersionId);  
		return this.createVersion(session, sourceExcelGridId, excelGridJsonStr, userId, "");
	}

	//保存模板版本文件
	public String saveToVersionFile(String excelGridId, String excelGridVersionId, ExcelGrid excelGrid) throws Exception{
		JSONObject excelGridJsonObj =  excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		return this.saveToVersionFile(excelGridId, excelGridVersionId, excelGridJsonStr);
	}

	//保存模板版本文件
	public String saveToVersionFile(String excelGridId, String excelGridVersionId, String excelGridJsonStr) throws Exception{
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String saveTimeStr = sdf.format(new Date()); 

		//判断excelGrid存储文件夹是否存在  
		String egDirPath = this.getVersionFolderPath(excelGridId);
		File egDir =new File(egDirPath);   
		if(!egDir.exists() && !egDir.isDirectory()) {        
			egDir.mkdir();    
		}
		
		String filePath = excelGridId + "\\" + excelGridVersionId + "_" + saveTimeStr + ".json";
		String fullPath = this.getVersionFilePath(filePath);
		FileOperate fo = new FileOperate();
		fo.createFile(fullPath, excelGridJsonStr);
		return filePath;
	}

	//获取模板版本文件夹路径
	private String getVersionFolderPath(String partPath){
		String filePath = this.getDefinitionFileDirectory() + "\\" + partPath;
		return filePath;
	}
	
	//获取模板版本文件路径
	private String getVersionFilePath(String partPath){
		String filePath = this.getDefinitionFileDirectory() + "\\"+ partPath;
		return filePath;
	}
	
	//读取模板版本文件
	public String readVersion(INcpSession session, String excelGridId, String excelGridVersionId) throws Exception{  
		String filePath = this.getVersionFilePathById(excelGridVersionId);
		FileOperate fo = new FileOperate();
		String txt = fo.readTxt(filePath);
		return txt;
	}
	
	//读取文件，生成ExcelGrid对象
	public ExcelGrid readToExcelGrid(INcpSession session, String excelGridId, String excelGridVersionId) throws Exception{  
		String excelGridJsonStr = this.readVersion(session, excelGridId, excelGridVersionId);
		JSONObject excelGridJsonObj =  JSONProcessor.strToJSON(excelGridJsonStr);
		ExcelGrid excelGrid = ExcelGrid.fromJson(excelGridJsonObj);
		return excelGrid;
	}  

	//插入eg_definitionVersion表记录
	public void createVersionInDB(String excelGridId, String excelGridVersionId, String userId, String filePath, String description){
		Data egDefinitionVersionData = DataCollection.getData("eg_DefinitionVersion");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("description", description);
		fieldValues.put("definitionid", excelGridId);
		fieldValues.put("createuserid", userId);
		fieldValues.put("filepath", filePath);
		fieldValues.put("createtime", new Date());
		fieldValues.put("enable", "N");
		fieldValues.put("isdeleted", "N");
		
		this.dBParserAccess.insertByData(dbSession, egDefinitionVersionData, fieldValues, excelGridVersionId); 
	}
	 
	//删除版本记录（实际上是打标记）
	public void deleteVersionFromDB(String excelGridVersionId, String userId){
		Session dbSession = this.getDBSession(); 
		String deleteSql = "update eg_definitionversion set isdeleted = 'Y' where id = " + SysConfig.getParamPrefix() + "id and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs =  new HashMap<String, Object>();
		p2vs.put("id", excelGridVersionId);
		p2vs.put("userId", userId);
		this.dBParserAccess.update(dbSession, deleteSql, p2vs); 
	}

	//删除模板（实际上是打标记）
	public void deleteDefinitionFromDB(String excelGridId, String userId){
		Session dbSession = this.getDBSession(); 
		String deleteSql = "update eg_definition set isdeleted = 'Y' where id = " + SysConfig.getParamPrefix() + "id and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs =  new HashMap<String, Object>();
		p2vs.put("id", excelGridId);
		p2vs.put("userId", userId);
		this.dBParserAccess.update(dbSession, deleteSql, p2vs); 
	}

	//更新eg_definitionVersion记录
	public void updateVersionInDB(String excelGridId, String excelGridVersionId, String userId, String filePath, String description){
		Data egDefinitionVersionData = DataCollection.getData("eg_DefinitionVersion");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("description", description);
		fieldValues.put("definitionid", excelGridId);
		fieldValues.put("modifyuserid", userId);
		fieldValues.put("filepath", filePath);
		fieldValues.put("modifytime", new Date());
		
		this.dBParserAccess.updateByData(dbSession, egDefinitionVersionData, fieldValues, excelGridVersionId); 
	}

	//启用版本，在数据库中打标记
	public void activateVersionInDB(String excelGridId, String excelGridVersionId, String userId){
		Session dbSession = this.getDBSession();		
		String inactivateVersionSql = "update eg_definitionversion set enable = 'N' where definitionid = " + SysConfig.getParamPrefix() + "definitionId and enable = 'Y' and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> inactivateFieldValues =  new HashMap<String, Object>(); 
		inactivateFieldValues.put("definitionId", excelGridId);
		inactivateFieldValues.put("userId", userId);
		this.dBParserAccess.update(dbSession, inactivateVersionSql, inactivateFieldValues);

		String activateVersionSql = "update eg_definitionversion set enable = 'Y' where id = " + SysConfig.getParamPrefix() + "versionId and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> activateFieldValues =  new HashMap<String, Object>(); 
		activateFieldValues.put("versionId", excelGridVersionId);
		activateFieldValues.put("userId", userId);
		this.dBParserAccess.update(dbSession, activateVersionSql, activateFieldValues);
	}
	
	//停用版本，在数据库中打标记
	public void inactivateVersionInDB(String excelGridId, String excelGridVersionId, String userId){
		Session dbSession = this.getDBSession();
		String inactivateVersionSql = "update eg_definitionversion set enable = 'N' where id = " + SysConfig.getParamPrefix() + "versionId and createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> inactivateFieldValues =  new HashMap<String, Object>(); 
		inactivateFieldValues.put("versionId", excelGridVersionId); 
		inactivateFieldValues.put("userId", userId);
		this.dBParserAccess.update(dbSession, inactivateVersionSql, inactivateFieldValues);
	}
	
	//从数据库中获取eg_definitionVersion表记录
	public HashMap<String, Object> getVersionFromDB(String excelGridVersionId) throws Exception{
		Data egDefinitionVersionData = DataCollection.getData("eg_DefinitionVersion");
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.getDtById(dbSession, egDefinitionVersionData, excelGridVersionId);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 0){
			DataRow row = rows.get(0);
			HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
			fieldValues.put("id", row.getValue("id"));
			fieldValues.put("description", row.getValue("description"));
			fieldValues.put("definitionId", row.getValue("definitionid"));
			fieldValues.put("modifyUserId", row.getValue("modifyuserid"));
			fieldValues.put("modifyUserName", row.getValue("modifyusername"));
			fieldValues.put("modifyTime",row.getValue("modifytime"));
			fieldValues.put("createUserId", row.getValue("createuserid"));
			fieldValues.put("createUserName", row.getValue("createusername"));
			fieldValues.put("createTime",row.getValue("createtime"));
			fieldValues.put("filePath", row.getValue("filepath"));
			
			return fieldValues;
		}
		else{
			throw new Exception("Can not get version info from db, version id = " + excelGridVersionId);
		}
	}
 
	//从数据库中读取eg_definitionVersion表记录，并转换为json对象
	public JSONObject getVersionFromDBToJSONObject(String excelGridVersionId) throws Exception{
		String versionSql = "select v.id as id, v.description as description, v.modifyuserid as modifyuserid, mu.name as modifyusername, v.modifytime as modifytime, "
			+ " v.createuserid as createuserid, cu.name as createusername, v.createtime as createtime, v.enable as enable, d.name as definitionname"
			+ " from eg_definitionversion v "
			+ " left outer join eg_definition d on v.definitionid = d.id"
			+ " left outer join d_user mu on mu.id = v.modifyuserid"
			+ " left outer join d_user cu on cu.id = v.createuserid"
			+ " where v.id = " + SysConfig.getParamPrefix() + "versionId";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("versionId", excelGridVersionId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("description");
		alias.add("modifyuserid");
		alias.add("modifyusername");
		alias.add("modifytime");
		alias.add("createuserid");
		alias.add("createusername");
		alias.add("createtime");
		alias.add("enable");
		alias.add("definitionname"); 
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("description", ValueType.String);
		valueTypes.put("modifyuserid", ValueType.String);
		valueTypes.put("modifyusername", ValueType.String);
		valueTypes.put("modifytime", ValueType.Time);
		valueTypes.put("createuserid", ValueType.String);
		valueTypes.put("createusername", ValueType.String);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("enable", ValueType.String);
		valueTypes.put("definitionname", ValueType.String);  
		Session dbSession = this.getDBSession();
		
		DataTable dt = this.dBParserAccess.selectList(dbSession, versionSql, p2vs, alias, valueTypes);
		List<DataRow> rows = dt.getRows();
		if(rows.size() == 1){
			DataRow row = rows.get(0);
			JSONObject fieldValues =  new JSONObject(); 
			fieldValues.put("id", row.getValue("id"));
			fieldValues.put("description", row.getValue("description"));
			fieldValues.put("definitionId", row.getValue("definitionid"));
			fieldValues.put("modifyUserId", row.getValue("modifyuserid"));
			fieldValues.put("modifyUserName", CommonFunction.encode(row.getStringValue("modifyusername")));
			fieldValues.put("modifyTime", ValueConverter.convertToString(row.getValue("modifytime"), ValueType.Time));
			fieldValues.put("createUserId", row.getValue("createuserid"));
			fieldValues.put("createUserName",  CommonFunction.encode(row.getStringValue("createusername")));
			fieldValues.put("createTime", ValueConverter.convertToString(row.getValue("createtime"), ValueType.Time));
			fieldValues.put("filePath", row.getValue("filepath"));
			fieldValues.put("enable", row.getValue("enable"));
			fieldValues.put("definitionName", CommonFunction.encode(row.getStringValue("definitionname")));
			
			return fieldValues;
		}
		else{
			throw new Exception("Can not get version info from db, version id = " + excelGridVersionId);
		}
	}
	 
	//根据模板版本id获取版本文件路径（相对路径，数据表eg_definitionVersion表记录中存储了路径）
	public String getVersionFilePathById(String excelGridVersionId) throws SQLException{
		String sql = "select v.filepath from eg_definitionVersion v where v.id = " + SysConfig.getParamPrefix() + "versionId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("versionId", excelGridVersionId); 
		Session dbSession = this.getDBSession();
		String filePath = this.getVersionFilePath((String)this.dBParserAccess.selectOne(dbSession, sql, p2vs));
		return filePath;
	}
	 
	//根据实例id获取文件路径（相对路径，数据表eg_instance表记录中存储了路径）
	public String createExcelGridInDB(String name, String userId, String description){
		Data egDefinitionData = DataCollection.getData("eg_Definition");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("name", name);
		fieldValues.put("createuserid", userId);
		fieldValues.put("createtime", new Date());
		fieldValues.put("description", description);
		fieldValues.put("isdeleted", "N");
		
		String excelGridId = this.dBParserAccess.insertByData(dbSession, egDefinitionData, fieldValues);
		return excelGridId;
	}
	
	//更新eg_definition表记录
	public void updateExcelGridInDB(String excelGridId, String name, String orgId, String userId, String description){
		Data egDefinitionData = DataCollection.getData("eg_definition");
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> fieldValues =  new HashMap<String, Object>(); 
		fieldValues.put("name", name);
		fieldValues.put("orgid", orgId);
		fieldValues.put("modifyuserid", userId);
		fieldValues.put("modifytime", new Date());
		fieldValues.put("description", description);
		
		this.dBParserAccess.updateByData(dbSession, egDefinitionData, fieldValues, excelGridId);
	}
	
	//获取当前用户的模板个数
	public int getDefinitionCount(INcpSession session) throws SQLException {
		String sql = "select count(1) from eg_definition d"
				+ " where d.createuserid = " + SysConfig.getParamPrefix() + "createUserId"
				+ " and d.isdeleted = 'N'";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("createUserId", session.getUserId()); 
		Session dbSession = this.getDBSession();
		int definitionCount = ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue();
		return definitionCount;
	}
	
	//判断版本是否为启用状态
	private boolean isEnableVersion(String excelGridVersionId) throws SQLException {
		String sql = "select v.enable from eg_definitionversion v"
				+ " where v.id = " + SysConfig.getParamPrefix() + "versionId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("versionId", excelGridVersionId); 
		Session dbSession = this.getDBSession();
		boolean isEnable = "Y".equals(this.dBParserAccess.selectOne(dbSession, sql, p2vs));
		return isEnable;
	}
	
	//判断版本是否为启用状态
	public boolean isDefinitionCreator(String excelGridId, String userId) throws SQLException {
		String sql = "select count(1) as definitionCount from eg_definition d"
				+ " where d.id = " + SysConfig.getParamPrefix() + "excelGridId"
				+ " and d.createuserid = " + SysConfig.getParamPrefix() + "userId";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("excelGridId", excelGridId); 
		p2vs.put("userId", userId); 
		Session dbSession = this.getDBSession();
		return ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue() != 0;
	}
	
	//验证并生成ExcelGrid和ExcelGridVersion
	public JSONObject validateAndGenerateByUploadExcel(INcpSession session, String accessoryId, List<String> sheetNames) throws Exception {

		String userId = session.getUserId();
		this.getAccessoryDao().setDBSession(this.getDBSession());
		DataRow accessoryRow = this.getAccessoryDao().getAccessoryDataRow(accessoryId, this.getAccessoryFilterType(), "", userId);
		String fileName = accessoryRow.getStringValue("name");
		String millisecond = accessoryRow.getStringValue("millisecond");
		Date uploadTime = accessoryRow.getDateTimeValue("uploadtime");

		String excelFilePath = this.getAccessoryDao().getFilePathByNameAndUploadTime(fileName, uploadTime, millisecond);
		ExcelGrid excelGrid = this.getConvertExcelToExcelGridProcessor().createExcelGridFromExcelFile(session, excelFilePath, sheetNames);
		
		//JSONObject excelGridJsonObj = excelGrid.toJson();		
		
		//ExcelGrid的名称以sheet名称构成，如果重名，则增加上excel文件的名称，如果还重名，那么增加上时间戳
		boolean hasName = false;
		int dotIndex = fileName.lastIndexOf(".");
		String fileNameWithoutExt = fileName.substring(0, dotIndex);
		String definitionName = fileNameWithoutExt;
		if(this.getDefinitionCount(userId, definitionName) == 0){
			hasName = true;
		} 
		if(!hasName){
			Date currentTime = new Date();
	        SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMddHHmmss");   
	        String nameTimeStr = sdfFileName.format(currentTime);
			definitionName = definitionName + "-" + nameTimeStr;
		} 
		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			String excelGridId = this.createExcelGridInDB(definitionName, userId, "");			

			ExcelGridValidateResult vr = excelGrid.validate(); 
			
			UUID uuid = UUID.randomUUID();
			String excelGridVersionId = uuid.toString(); 

			this.calcDefinition(session, vr, excelGrid); 
			
			//即使没有验证和计算通过，也保存				
			String filePath = this.saveToVersionFile(excelGridId, excelGridVersionId, excelGrid);
			this.createVersionInDB(excelGridId, excelGridVersionId, userId, filePath, "");
			tx.commit();
			
			JSONObject excelGridVersionObj = new JSONObject();
			excelGridVersionObj.put("name", definitionName);
			excelGridVersionObj.put("excelGridId", excelGridId);
			excelGridVersionObj.put("excelGridVersionId", excelGridVersionId);
			
			return excelGridVersionObj;  
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}	
		 
	}

	private int getDefinitionCount(String userId, String definitionName) throws SQLException{
		String sql = "select count(1) from eg_definition d"
				+ " where d.createuserid = " + SysConfig.getParamPrefix() + "createUserId"
				+ " and d.name = " + SysConfig.getParamPrefix() + "name"
				+ " and d.isdeleted = 'N'";		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("createUserId", userId);
		p2vs.put("name", definitionName);
		Session dbSession = this.getDBSession();
		int definitionCount = ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue();
		return definitionCount;
	}
	private int getVersionCount(String definitionId, String userId) throws SQLException{
		String sql = "select count(1) from eg_definitionversion v"
				+ " left outer join eg_definition d on d.id = v.definitionid"
				+ " where v.definitionid = " + SysConfig.getParamPrefix() + "definitionId"
				+ " and d.createuserid = " + SysConfig.getParamPrefix() +"userId"
				+ " and v.isdeleted = 'N'";	
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		p2vs.put("definitionId", definitionId);
		Session dbSession = this.getDBSession();
		int versionCount = ((BigInteger)this.dBParserAccess.selectOne(dbSession, sql, p2vs)).intValue();
		return versionCount;
	}
	
	public List<String> getExcelSheetNames(INcpSession session, String accessoryId) throws Exception {
		XSSFWorkbook wb = this.getExcelWorkbookByAccessoryId(session, accessoryId);
		int sheetCount = wb.getNumberOfSheets();
		List<String> allSheetNames = new ArrayList<String>();
		for(int i = 0; i < sheetCount; i++){
			String sheetName = wb.getSheetName(i);
			allSheetNames.add(sheetName);
		}
		return allSheetNames;
	}
	
	private XSSFWorkbook getExcelWorkbookByAccessoryId(INcpSession session, String accessoryId) throws Exception{	
		this.accessoryDao.setDBSession(dbSession);
		String excelFilePath = this.accessoryDao.getFilePath(accessoryId, this.getAccessoryFilterType(), "", session.getUserId());			
		return this.getConvertExcelToExcelGridProcessor().getExcelWorkbookByFilePath(session, excelFilePath);
	}
	public JSONObject createNewBlankExcelGrid(NcpSession session, int defaultRowCount, int defaultColumnCount, int defaultRowHeight, int defaultColumnWidth) throws Exception {

		String userId = session.getUserId(); 
		ExcelGrid excelGrid = ExcelGrid.createNewExcelGrid(defaultRowCount, defaultColumnCount, defaultRowHeight, defaultColumnWidth);
		JSONObject excelGridJsonObj = excelGrid.toJson();
		String excelGridJsonStr = JSONProcessor.jsonToStr(excelGridJsonObj);
		
		Date currentTime = new Date();		
        SimpleDateFormat sdfFileName = new SimpleDateFormat("yyyyMMddHHmmss");   
        String nameTimeStr = sdfFileName.format(currentTime);
		String definitionName = "新建模板" + nameTimeStr; 
		
		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			String excelGridId = this.createExcelGridInDB(definitionName, userId, "");			
			String excelGridVersionId = this.createVersion(session, excelGridId, excelGridJsonStr, userId, "");			
			tx.commit();
			
			JSONObject excelGridVersionObj = new JSONObject();
			excelGridVersionObj.put("name", definitionName);
			excelGridVersionObj.put("excelGridId", excelGridId);
			excelGridVersionObj.put("excelGridVersionId", excelGridVersionId);
			
			return excelGridVersionObj;  
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}	
	}	
}
