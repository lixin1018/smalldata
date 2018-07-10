package com.novacloud.dataHelper.buy;
 
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap; 
import org.apache.log4j.Logger; 
import org.hibernate.Session; 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 

public class PayProcessor {
  	private static Logger logger=Logger.getLogger(PayProcessor.class);   

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
	
	private int connectTimeout = 30000;
	public int getConnectTimeout() {
		return connectTimeout;
	}
	public void setConnectTimeout(int connectTimeout) {
		this.connectTimeout = connectTimeout;
	}   
	
	private int readTimeout = 30000;
	public int getReadTimeout() {
		return readTimeout;
	}
	public void setReadTimeout(int readTimeout) {
		this.readTimeout = readTimeout;
	} 
	
	public String createPay(INcpSession session, String orderId, BigDecimal payPrice, String payCodeUrl, String payFlowId, PayType payType) throws SQLException{
		Session dbSession = this.getDBSession();
		
		String getPaySql = "select p.id as id from dm_pay p "
				+ "where p.orderid = " + SysConfig.getParamPrefix() + "orderId "
				+ "and payflowid = " + SysConfig.getParamPrefix() + "payFlowId"
				+ "and paytype = " + SysConfig.getParamPrefix() + "payType";
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("orderId", orderId);
		p2vs.put("payFlowId", payFlowId);
		p2vs.put("payType", payType.toString());

		Data payData = DataCollection.getData("dm_Pay");
		String payId = (String)this.dBParserAccess.selectOne(dbSession, getPaySql, p2vs);
		if(payId == null){			
			HashMap<String, Object> payValues = new HashMap<String, Object>();
			payValues.put("orderid", orderId);
			payValues.put("beginpaytime", new Date()); 
			payValues.put("payPrice", payPrice);
			payValues.put("userid", session.getUserId());			
			payId = this.dBParserAccess.insertByData(dbSession, payData, payValues);
		}
		else{
			HashMap<String, Object> payValues = new HashMap<String, Object>(); 
			payValues.put("payPrice", payPrice);			
			this.dBParserAccess.updateByData(dbSession, payData, payValues, payId);
		}
		return payId;		
		
	}
	 
}
