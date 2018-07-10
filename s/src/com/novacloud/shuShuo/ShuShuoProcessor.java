package com.novacloud.shuShuo;

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
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ShuShuoProcessor {
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
	
	private String imageDir = "";
	public String getImageDir() {
		return imageDir;
	}
	public void setImageDir(String imageDir) {
		this.imageDir = imageDir;
	} 
	
	public String getImagePath(String dirName, String imageName){
		return this.getImageDir() + dirName + "/" + imageName;
	}
	
	private String audioDir = "";
	public String getAudioDir() {
		return audioDir;
	}
	public void setAudioDir(String audioDir) {
		this.audioDir = audioDir;
	} 
	
	public String getAudioPath(String dirName, String audioName){
		return this.getAudioDir() + dirName + "/" + audioName;
	}
	
	public DataTable getData(String code) throws Exception{
		HashMap<String, String> sqlAndDataInfo = this.getSqlByCode(code);
		String dataName = sqlAndDataInfo.get("dataName");
		String dataSql = sqlAndDataInfo.get("sql");
		Data data = DataCollection.getData(dataName);
		if(data == null){
			throw new Exception("None data named " + dataName);
		}
		
		List<Object[]> idObjectList = this.dBParserAccess.selectList(getDBSession(), dataSql);
		List<String> idList = new ArrayList<String>();
		for(int i = 0; i < idObjectList.size(); i++){
			Object idObj = idObjectList.get(i);
			idList.add((String)idObj);
		}		
		
		DataTable resultTable = this.dBParserAccess.getDtByIds(getDBSession(), data, idList);
		return resultTable;
	}
	
	private HashMap<String, String> getSqlByCode(String code) throws Exception{
		String vdtSql = "select t.dataname as dataname, t.queryidsql as queryidsql from ss_viewdatatable t where code = " + SysConfig.getParamPrefix() +"code";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", code);
		
		List<Object[]> resultValues = this.dBParserAccess.selectList(getDBSession(), vdtSql, p2vs);
		if(resultValues.size() == 0){
			throw new Exception("无法找到数据, Code = " + code);
		}
		else{
			HashMap<String, String> resultValue = new HashMap<String, String>();
			resultValue.put("dataName", (String)resultValues.get(0)[0]);
			resultValue.put("sql", (String)resultValues.get(0)[1]);
			return resultValue;
		} 
	}
	public HashMap<String, Object> getSSPlayInfo(String code) throws Exception {
		String vdtSql = "select p.code as code, p.title as title, p.description as description, p.tag as tag, p.createtime as createtime from ss_play p where p.enable = 'Y' and p.code = " + SysConfig.getParamPrefix() +"code";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("code", code);
		
		List<Object[]> resultValues = this.dBParserAccess.selectList(getDBSession(), vdtSql, p2vs);
		if(resultValues.size() == 0){
			throw new Exception("无法找到数据, Code = " + code);
		}
		else{
			HashMap<String, Object> resultValue = new HashMap<String, Object>();
			resultValue.put("code", (String)resultValues.get(0)[0]);
			resultValue.put("title", CommonFunction.encode((String)resultValues.get(0)[1]));
			resultValue.put("description", CommonFunction.encode((String)resultValues.get(0)[2]));
			resultValue.put("tag", CommonFunction.encode((String)resultValues.get(0)[3]));
			
			SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd");  
			Date createTime = (Date)resultValues.get(0)[4];  
			resultValue.put("createTime", (createTime == null ? "" : sdf.format(createTime)));
			return resultValue;
		} 
	}
	public JSONArray getSSPlayList() throws UnsupportedEncodingException, SQLException, ParseException{
		JSONArray playListArray = (JSONArray)GlobalVariables.getValue(GlobalVariableType.shuShuoPlayList);
		
		if(playListArray == null){
			synchronized(this){
				refreshPlayList();
				playListArray = (JSONArray)GlobalVariables.getValue(GlobalVariableType.shuShuoPlayList); 
				return playListArray;
			}
		}
		else{
			return playListArray;
		}		
	}
	
	//更新数据动画列表，这样编辑好的列表，就会更新到列表首页里 added by lixin 20180703
	public void refreshPlayList() throws UnsupportedEncodingException, SQLException, ParseException{
		JSONArray playListArray = this.getPlayListJSONArray();
		Date nextDate =  this.getNextDay();
		GlobalVariables.setValue(GlobalVariableType.shuShuoPlayList, playListArray, nextDate);   
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
	
	private JSONArray getPlayListJSONArray() throws SQLException, UnsupportedEncodingException{
		DataTable playDt = this.getPlayListFromDB(null);
		JSONArray playArray = new JSONArray();
		List<DataRow> playRows = playDt.getRows();
		SimpleDateFormat sdf =   new SimpleDateFormat("yyyy-MM-dd");  
		for(int i = 0; i < playRows.size(); i++){
			DataRow playRow = playRows.get(i);
			String id = playRow.getStringValue("id");
			String code = playRow.getStringValue("code");
			String title = playRow.getStringValue("title");
			String description = playRow.getStringValue("description");
			String tag = playRow.getStringValue("tag");  
			Date createTime = playRow.getDateTimeValue("createtime");  

			JSONObject categoryJson = new JSONObject();
			categoryJson.put("id", id);
			categoryJson.put("createTime", createTime);
			categoryJson.put("code", CommonFunction.encode(code));
			categoryJson.put("title", CommonFunction.encode(title));
			categoryJson.put("description", CommonFunction.encode(description));
			categoryJson.put("tag", CommonFunction.encode(tag));
			categoryJson.put("createTime", (createTime == null ? "" : sdf.format(createTime)));	
			categoryJson.put("index", i + 1);
			playArray.add(categoryJson);
		}
		return playArray;
	}

	private DataTable getPlayListFromDB(Integer count) throws SQLException{
		String getPlayListSql = "select p.id as id, p.code as code, p.title as title, p.description as description, p.tag as tag, p.createtime as createtime from ss_play p where p.enable = 'Y' order by p.sortindex asc, p.createtime desc";
		Session dbSession = this.getDBSession();
		
		List<String> alias = new ArrayList<String>();
		alias.add("id"); 
		alias.add("code");
		alias.add("title"); 
		alias.add("description"); 
		alias.add("tag"); 
		alias.add("createtime"); 
		
		Map<String, ValueType> fieldValueTypes = new HashMap<String, ValueType>();
		fieldValueTypes.put("id", ValueType.String); 
		fieldValueTypes.put("code", ValueType.String);
		fieldValueTypes.put("title", ValueType.String);
		fieldValueTypes.put("description", ValueType.String);
		fieldValueTypes.put("tag", ValueType.String);
		fieldValueTypes.put("createtime", ValueType.Time);
		
		DataTable playDt = null;
		if(count == null){
			playDt = this.dBParserAccess.selectList(dbSession, getPlayListSql, null, alias, fieldValueTypes);
		}
		else{
			playDt = this.dBParserAccess.selectList(dbSession, getPlayListSql, null, alias, fieldValueTypes, 0, count);	
		}
		return playDt;
	} 
}
