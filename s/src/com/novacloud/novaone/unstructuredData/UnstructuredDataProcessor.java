package com.novacloud.novaone.unstructuredData;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException; 
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.Transaction; 

import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection;
import org.hibernate.jdbc.Work;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class UnstructuredDataProcessor {
	private IDBParserAccess dBParserAccess; 
	public void setDBParserAccess(IDBParserAccess dBParserAccess) {
		this.dBParserAccess = dBParserAccess;
	} 

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
	
	public String saveMapResult(INcpSession session, String code, BigDecimal spendTime, String description, String grabType, JSONArray allRowObjects) throws SQLException{
		List<HashMap<String, Object>> allF2Vs = new ArrayList<HashMap<String, Object>>();
		if(allRowObjects != null){
			for(int i=0;i<allRowObjects.size();i++){ 
				JSONObject rowObj = allRowObjects.getJSONObject(i);
				
				HashMap<String, Object> lineObj = new HashMap<String, Object>();
				lineObj.put("name", rowObj.getString("name"));
				lineObj.put("positionx", rowObj.has("positionx") ? ValueConverter.convertToDBObject(rowObj.getString("positionx"),ValueType.Decimal) : null);
				lineObj.put("positiony", rowObj.has("positiony") ? ValueConverter.convertToDBObject(rowObj.getString("positiony"),ValueType.Decimal) : null); 
				lineObj.put("address", rowObj.has("address") ? rowObj.getString("address") : null);
				lineObj.put("tel", rowObj.has("tel") ? rowObj.getString("tel") : null);
				lineObj.put("description", rowObj.has("description") ? rowObj.getString("description") : null);
				lineObj.put("others", rowObj.has("others") ?  rowObj.getString("others") : null);  
				allF2Vs.add(lineObj);
			}
		}	
		return this.saveMapResult(session, code, spendTime, description, grabType, allF2Vs);
	}
	
	private String saveMapResult(INcpSession session, String code, BigDecimal spendTime, String description, String grabType, final List<HashMap<String, Object>> allLineObjects) throws SQLException{
		Session dbSession = this.getDBSession();
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			int lineCount = allLineObjects.size();
			
			//获取父子表对应的Data模型
			Data mapResultData = DataCollection.getData("grab_mapresult"); 
			Data mapResultLineData = DataCollection.getData("grab_mapresultline");
			
			//插入父表记录
			HashMap<String, Object> mapResultF2Vs = new HashMap<String, Object>();		
			mapResultF2Vs.put("code", code);
			mapResultF2Vs.put("createtime", new Date());
			mapResultF2Vs.put("grabuser_id", session.getUserId());
			mapResultF2Vs.put("rowcount", lineCount);
			mapResultF2Vs.put("description", description);
			mapResultF2Vs.put("grabType", grabType);
			mapResultF2Vs.put("spendTime", spendTime);
			final String mapResultId =  this.dBParserAccess.insertByData(dbSession, mapResultData, mapResultF2Vs);

			//批量获取子表ID
			final List<String> ids = dBParserAccess.getSequenceGenerator().getIdSequence("grab_mapresultlin", lineCount);

			//插入子表记录
			if(allLineObjects != null){
				this.getDBSession().doWork(new Work(){
				     public void execute(Connection connection) throws SQLException { 		
						final int batchSize = 1000;
						int count = 0;	
						PreparedStatement statement = connection.prepareStatement("insert into grab_mapresultlin(id, parentid, name, positionx, positiony, address, tel, description, others) values(?, ?, ?, ?, ?, ?, ?, ?, ?)");
						for(int i=0; i<allLineObjects.size(); i++){
							Map<String, Object> lineObj = allLineObjects.get(i); 
							statement.setString(1, ids.get(i));
							statement.setString(2, mapResultId);
							statement.setObject(3, (String)lineObj.get("name"));
							statement.setObject(4, (String)lineObj.get("positionx"));
							statement.setObject(5, (String)lineObj.get("positiony"));
							statement.setObject(6, (String)lineObj.get("address"));
							statement.setObject(7, (String)lineObj.get("tel"));
							statement.setObject(8, (String)lineObj.get("description"));
							statement.setObject(9, (String)lineObj.get("others")); 
							statement.addBatch(); 
						    if(++count % batchSize == 0) {
						    	statement.executeBatch();
						    }	
						}
						statement.executeBatch(); // insert remaining records 
						statement.close();  
					} 
				});
			}  
						
			tx.commit();
			return mapResultId;  
		}
		catch(RuntimeException ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		}  
	}
}
