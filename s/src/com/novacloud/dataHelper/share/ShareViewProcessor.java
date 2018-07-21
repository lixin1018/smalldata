package com.novacloud.dataHelper.share;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import com.novacloud.dataHelper.memory.GlobalVariableType;
import com.novacloud.dataHelper.memory.GlobalVariables;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ShareViewProcessor {

	//DBParserAccess
	private IDBParserAccess dBParserAccess;
	public void setDBParserAccess(IDBParserAccess dBParserAccess){ 
		this.dBParserAccess = dBParserAccess;
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
	
	public JSONArray getCategoryTypeList() throws UnsupportedEncodingException, SQLException, ParseException{
		JSONArray categoryTypeListArray = (JSONArray)GlobalVariables.getValue(GlobalVariableType.shareCategoryTypeList);
		
		if(categoryTypeListArray == null){
			synchronized(this){
				refreshCategoryInfo();
				categoryTypeListArray = (JSONArray)GlobalVariables.getValue(GlobalVariableType.shareCategoryTypeList); 
				return categoryTypeListArray;
			}
		}
		else{
			return categoryTypeListArray;
		}		
	}
	
	//更新数据共享的分类信息，这样编辑好的分类，就会更新到数据分享首页里 added by lixin 20180607
	public void refreshCategoryInfo() throws UnsupportedEncodingException, SQLException, ParseException{
		JSONArray categoryTypeListArray = this.getCategoryTypeListJSONArray();
		Date nextDate =  this.getNextDay();
		GlobalVariables.setValue(GlobalVariableType.shareCategoryTypeList, categoryTypeListArray, nextDate);   
	}
	
	public JSONObject getCategory(String code) throws UnsupportedEncodingException, SQLException, ParseException{
		JSONArray categoryTypeListArray = this.getCategoryTypeList();
		for(int i = 0; i < categoryTypeListArray.size(); i++){
			JSONArray categoryArray = categoryTypeListArray.getJSONObject(i).getJSONArray("categoryArray");
			for(int j = 0; j < categoryArray.size(); j++){
				JSONObject categoryObject = categoryArray.getJSONObject(j);
				if(categoryObject.getString("code").equals(code)){
					return categoryObject;
				}
			}
		}
		return null;
	}
	
	public Date getNextDay() throws ParseException{
		 //获取当前日期  
        Date date = new Date();  
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");  
        String nowDate = sf.format(date);  
        System.out.println(nowDate);  
        //通过日历获取下一天日期  
        Calendar cal = Calendar.getInstance();  
        cal.setTime(sf.parse(nowDate));  
        cal.add(Calendar.DAY_OF_YEAR, +1);  
        return cal.getTime();
	}
	
	private JSONArray getCategoryTypeListJSONArray() throws SQLException, UnsupportedEncodingException{
		List<String> typeIdList = new ArrayList<String>();
		HashMap<String, JSONObject> typeId2TypeJson = new HashMap<String, JSONObject>();
		
		DataTable categoryDt = this.getCategoriesFromDB(null);
		JSONArray categoryArray = null;
		JSONObject typeJson = null;
		List<DataRow> categoryRows = categoryDt.getRows();
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd"); 
		for(DataRow categoryRow : categoryRows){

			String typeId = categoryRow.getStringValue("typeid");
			String typeName = categoryRow.getStringValue("typename");
			String typeCode = categoryRow.getStringValue("typecode");
			BigDecimal typeIndex = categoryRow.getBigDecimalValue("typeshowindex");
			
			if(!typeId2TypeJson.containsKey(typeId)){
				categoryArray = new JSONArray();
				typeJson = new JSONObject();
				typeJson.put("id", typeId);
				typeJson.put("name", typeName);
				typeJson.put("code", typeCode);
				typeJson.put("showIndex", typeIndex);
				typeJson.put("categoryArray", categoryArray);
			}
			else{
				typeJson = typeId2TypeJson.get(typeId);
				categoryArray = typeJson.getJSONArray("categoryArray");				
			}
			
			String categoryId = categoryRow.getStringValue("id");
			String categoryName = categoryRow.getStringValue("name");
			String categoryCode = categoryRow.getStringValue("code");
			BigDecimal categoryIndex = categoryRow.getBigDecimalValue("showindex");
			JSONObject categoryJson = new JSONObject();
			categoryJson.put("id", categoryId);
			categoryJson.put("code", CommonFunction.encode(categoryCode));
			categoryJson.put("name", CommonFunction.encode(categoryName));
			categoryJson.put("index", categoryIndex.intValue());
			
			JSONArray dataListArray = new JSONArray();
			
			DataTable categoryDataDt = this.getCategoryDataListFromDB(categoryId, null);
			List<DataRow> categoryDataRows =categoryDataDt.getRows();
			for(DataRow categoryDataRow : categoryDataRows){
				String dataId = categoryDataRow.getStringValue("id");
				String definitionId = categoryDataRow.getStringValue("definitionid");
				String dataName = categoryDataRow.getStringValue("name");
				String dataCode = categoryDataRow.getStringValue("code");
				String description = categoryDataRow.getStringValue("description");
				String tableName = "ie_" + categoryDataRow.getStringValue("dbtablename");
				BigDecimal dataIndex = categoryDataRow.getBigDecimalValue("showindex");
								
				JSONObject dateListJson = new JSONObject();
				dateListJson.put("id", dataId);
				dateListJson.put("definitionId", definitionId);
				dateListJson.put("code", CommonFunction.encode(dataCode));
				dateListJson.put("name", CommonFunction.encode(dataName));
				dateListJson.put("tableName", tableName);
				dateListJson.put("description", CommonFunction.encode(description));
				dateListJson.put("index", dataIndex.intValue());	
				
				Date updateTime = this.getDataLastUpdateTimeFromDB(definitionId);
				dateListJson.put("lastUpdateTime", (updateTime == null ? "" : sdf.format(updateTime)));				
				
				dataListArray.add(dateListJson);
			}
			categoryJson.put("dataList", dataListArray);
			categoryArray.add(categoryJson);
			typeJson.put("categoryArray", categoryArray);

			if(!typeId2TypeJson.containsKey(typeId)){
				typeIdList.add(typeId);
				typeId2TypeJson.put(typeId, typeJson);
			}
		}		

		JSONArray typeArray = new JSONArray();
		for(String typeId : typeIdList){
			typeArray.add(typeId2TypeJson.get(typeId));
		}
		
		return typeArray;
	}

	private DataTable getCategoriesFromDB(Integer count) throws SQLException{
		String getCategroySql = "select c.id as id, "
				+ "c.name as name, "
				+ "c.code as code, "
				+ "c.showindex as showindex, "
				+ "c.typeid as typeid, "
				+ "ct.showindex as typeshowindex, "
				+ "ct.name as typename, "
				+ "ct.code as typecode "
				+ "from dm_datacategory c "
				+ "left outer join dm_datacategorytype ct on ct.id = c.typeid "
				+ "where c.isactive = 'Y' and ct.isactive = 'Y' order by ct.showindex asc, c.showindex asc";
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("showindex"); 
		alias.add("typeid"); 
		alias.add("typeshowindex"); 
		alias.add("typename"); 
		alias.add("typecode"); 
		
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("code", ValueType.String);
		fieldValueTypes.put("showindex", ValueType.Decimal);
		fieldValueTypes.put("typeid", ValueType.String);
		fieldValueTypes.put("typename", ValueType.String);
		fieldValueTypes.put("typecode", ValueType.String);
		fieldValueTypes.put("typeshowindex", ValueType.Decimal);
		
		DataTable categoryDt = null;
		if(count == null){
			categoryDt = this.dBParserAccess.selectList(dbSession, getCategroySql, null, alias, fieldValueTypes);
		}
		else{
			categoryDt = this.dBParserAccess.selectList(dbSession, getCategroySql, null, alias, fieldValueTypes, 0, count);	
		}
		return categoryDt;
	}

	private DataTable getCategoryDataListFromDB(String categoryId, Integer count) throws SQLException{ 
		String getCategroyDataSql = "select cd.id as id, ied.name as name, ied.code as code, ied.dbtablename as dbtablename, ied.description as description, cd.definitionid as definitionid, cd.showindex as showindex from dm_datacategorydatalist cd left outer join dm_importexportdefinition ied on ied.id = cd.definitionid where cd.parentid = " + SysConfig.getParamPrefix() + "categoryId and cd.isactive = 'Y' order by cd.showindex asc";
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("categoryId", categoryId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("name");
		alias.add("code");
		alias.add("dbtablename");
		alias.add("description");
		alias.add("definitionid");
		alias.add("showindex");
		
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String);
		fieldValueTypes.put("name", ValueType.String);
		fieldValueTypes.put("code", ValueType.String);
		fieldValueTypes.put("dbtablename", ValueType.String);
		fieldValueTypes.put("description", ValueType.String);
		fieldValueTypes.put("definitionid", ValueType.String);
		fieldValueTypes.put("showindex", ValueType.Decimal);

		DataTable categoryDataDt = null;
		if(count == null){
			categoryDataDt = this.dBParserAccess.selectList(dbSession, getCategroyDataSql, p2vs, alias, fieldValueTypes);
		}
		else{
			categoryDataDt = this.dBParserAccess.selectList(dbSession, getCategroyDataSql, p2vs, alias, fieldValueTypes, 0, count);	
		} 
		return categoryDataDt;
	}
	
	private Date getDataLastUpdateTimeFromDB(String definitionId) throws SQLException{ 
		String getDataUpdateTimeSql = "select ii.createtime as createtime from dm_importinstance ii where ii.definitionid = " + SysConfig.getParamPrefix() + "definitionId and ii.statustype = 'Succeed'";
		Session dbSession = this.getDBSession();
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("definitionId", definitionId);
		 
		Object time = this.dBParserAccess.selectOne(dbSession, getDataUpdateTimeSql, p2vs);
		if(time == null){
			return null;
		}
		else{
			return (Date)time;	
		}  
	}
	
}
