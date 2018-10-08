package com.novacloud.dataHelper.buy;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.novacloud.dataHelper.export.ExportStatusType;
import com.novacloud.novaone.common.FileOperate;
import com.novacloud.novaone.common.INcpSession; 
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession; 
import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.common.util.EncrypDES;
import com.novacloud.novaone.constants.NovaCloudState;
import com.novacloud.novaone.core.ConfigContext;
import com.novacloud.novaone.dao.db.DataRow;
import com.novacloud.novaone.dao.db.DataTable;
import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.dao.db.SelectSqlParser;
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.dao.sys.DataBaseDao; 
import com.novacloud.novaone.model.sysmodel.Data;
import com.novacloud.novaone.model.sysmodel.DataCollection; 

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

public class BuyProcessor {
  	private static Logger logger=Logger.getLogger(BuyProcessor.class); 

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
	
	private AliPayProcessor aliPayProcessor ; 
	public AliPayProcessor getAliPayProcessor() {
		return aliPayProcessor;
	}
	public void setAliPayProcessor(AliPayProcessor aliPayProcessor) {
		this.aliPayProcessor = aliPayProcessor;
	}	
	
	private static Random random = new Random(1000);

  	private int maxCartLinePerUser = 20;

  	private int onePageRowCountWhenGetIds = 1000;
  	
  	//60天内的购买，数据出现重复的情况，不再重复计费
  	private long historyOrderTimeoutDays = 365;
  	
  	private int orderSubjectInfoMaxLength = 256;
  	
  	private int orderBodyInfoMaxLength = 128;
	
	private DataRow getDefinitionInfo(String definitionId) throws SQLException{

		Session dbSession = this.getDBSession();
		String unitPriceSql = "select d.id as id, d.dbtablename as dbtablename, d.unitprice as unitprice from dm_importexportdefinition d where d.id = " + SysConfig.getParamPrefix() + "definitionId";
		HashMap<String, Object> uP2vs = new HashMap<String, Object>();
		uP2vs.put("definitionId", definitionId);
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("dbtablename");
		alias.add("unitprice");
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
		fieldTypes.put("id", ValueType.String);
		fieldTypes.put("dbtablename", ValueType.String);
		fieldTypes.put("unitprice", ValueType.Decimal);
		
		DataTable dDt = this.dBParserAccess.selectList(dbSession, unitPriceSql, uP2vs, alias, fieldTypes);
		List<DataRow> dRows = dDt.getRows();
		
		return dRows.size() == 0 ? null : dRows.get(0);
	}
	
	public String addToCart(INcpSession session, String definitionId, JSONArray dataFilterArray) throws Exception {

		Session dbSession = this.getDBSession();
		
		int clCount = this.getCartLineCount(session);
		if(clCount >= this.maxCartLinePerUser){
			NcpException ncpEx = new NcpException("addToCart_maxCartLineCount", "购物车内的商品数量不能超过" + this.maxCartLinePerUser);
			throw ncpEx;
		}
		
		DataRow dRow = this.getDefinitionInfo(definitionId);
		
		if(dRow == null){
			NcpException ncpEx = new NcpException("addToCart_noneDefinition", "不存在的数据");
			throw ncpEx;
		}
		else {
			if(dRow.isNull("unitprice")){
				NcpException ncpEx = new NcpException("addToCart_noneUnitPrice", "此数据尚未定价");
				throw ncpEx;
			}
			else {
				if(this.hasSameCartLine(session.getUserId(), definitionId, dataFilterArray)){
					NcpException ncpEx = new NcpException("addToCart_sameData", "购物车中已放入同样的数据");
					throw ncpEx;
				}
				else{
					BigDecimal unitPrice = dRow.getBigDecimalValue("unitprice");
					String dataName = "ie_" + dRow.getStringValue("dbtablename");

					int rowCountInt = this.getRowCount(dataName, dataFilterArray);
					BigDecimal rowCount = BigDecimal.valueOf(rowCountInt);
					if(rowCountInt > this.getMaxRowCount()){
						NcpException ncpEx = new NcpException("addToCart_overMaxRowCount", "单次购买的数据不能超过" + this.getMaxRowCount() + "行, 请联系管理员获取更高权限");
						throw ncpEx;
					}
					else{
						String dataFilter = dataFilterArray.toString();
						
						BigDecimal price = unitPrice.multiply(rowCount);
						
						Data cartLineData = DataCollection.getData("dm_ExportCartLine");				
						HashMap<String, Object> uFieldValues = new HashMap<String, Object>();
						uFieldValues.put("definitionid", definitionId);
						uFieldValues.put("createtime", new Date());
						uFieldValues.put("createuserid", session.getUserId());
						uFieldValues.put("datafilter", dataFilter);
						uFieldValues.put("price", price);
						uFieldValues.put("rowcount", rowCount);
						uFieldValues.put("unitprice", unitPrice);
						uFieldValues.put("status", CartLineStatusType.InCart.toString());
						String cartLineId = this.dBParserAccess.insertByData(dbSession, cartLineData, uFieldValues);
						return cartLineId;
					}
				}
			}				
		}
	} 
	
	private int maxRowCount = 1000000;
	public void setMaxRowCount(int maxRowCount){
		this.maxRowCount = maxRowCount;
	}
	private int getMaxRowCount() { 
		return this.maxRowCount;
	}
	
	private int getRowCount(String dataName, JSONArray dataFilterArray) throws Exception {		
		Data data = DataCollection.getData(dataName);
		SelectSqlParser sqlParser = data.getDsSqlParser();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		String userWhere = DataBaseDao.getWhere(this.dBParserAccess, sqlParser, dataFilterArray, p2vs, "and");
		int rowCount = this.dBParserAccess.getRecordCountBySqlParser(this.getDBSession(), sqlParser, p2vs, userWhere);
		return rowCount;
	}
	
	public void removeFromCart(INcpSession session, String cartLineId) throws SQLException, NcpException {
		DataRow clRow = this.getCartLineInfo(cartLineId);
		
		if(clRow == null){
			NcpException ncpEx = new NcpException("removeFromCart_noneCartLine", "购物车中不存在此产品");
			throw ncpEx;
		}
		else { 
			String currentUserId = session.getUserId();
			String createUserId = clRow.getStringValue("createuserid");
			if(!currentUserId.equals(createUserId)){
				NcpException ncpEx = new NcpException("removeFromCart_notCreateUser", "不能删除他人购物车里的商品");
				throw ncpEx;
			}
			else{		
				Data clData = DataCollection.getData("dm_ExportCartLine");
				HashMap<String, Object> fieldValues = new HashMap<String, Object>();
				fieldValues.put("status", CartLineStatusType.Deleted.toString()); 
				this.dBParserAccess.updateByData(dbSession, clData, fieldValues, cartLineId);
			}
		}			
	}
	
	private DataRow getCartLineInfo(String cartLineId) throws SQLException{
		String getCartLineSql = "select cl.id as id, cl.createuserid as createuserid from dm_exportcartline cl where cl.id = " + SysConfig.getParamPrefix() + "id";
		HashMap<String, Object> clP2vs = new HashMap<String, Object>();
		clP2vs.put("id", cartLineId); 
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("createuserid");
		HashMap<String, ValueType> fieldTypes = new HashMap<String, ValueType>();
		fieldTypes.put("id", ValueType.String);
		fieldTypes.put("createuserid", ValueType.String);
		
		DataTable clDt = this.dBParserAccess.selectList(dbSession, getCartLineSql, clP2vs, alias, fieldTypes);
		List<DataRow> clRows = clDt.getRows();
		
		return clRows.size() == 0 ? null : clRows.get(0);
	}
	
	private int getCartLineCount(String userId) throws SQLException{
		String getCartLineSql = "select count(1) as rowCount from dm_exportcartline cl where cl.createuserid = " + SysConfig.getParamPrefix() + "userId and status = " + SysConfig.getParamPrefix() + "status";
		HashMap<String, Object> clP2vs = new HashMap<String, Object>();
		clP2vs.put("userId", userId); 
		clP2vs.put("status", CartLineStatusType.InCart.toString()); 
		 
		BigInteger rowCount = (BigInteger)this.dBParserAccess.selectOne(dbSession, getCartLineSql, clP2vs);
		return rowCount.intValue();
	}
	
	private boolean hasSameCartLine(String userId, String definitionId, JSONArray dataFilterArray) throws SQLException{
		String dataFilter = dataFilterArray.toString();
		String getCartLineSql = "select count(1) as rowCount from dm_exportcartline cl "
			+ "where cl.createuserid = " + SysConfig.getParamPrefix() + "userId "
			+ "and cl.definitionid = " + SysConfig.getParamPrefix() + "definitionId "
			+ "and cl.datafilter = " + SysConfig.getParamPrefix() + "dataFilter "
			+ "and cl.status = " + SysConfig.getParamPrefix() + "status";
		HashMap<String, Object> clP2vs = new HashMap<String, Object>();
		clP2vs.put("userId", userId); 
		clP2vs.put("definitionId", definitionId); 
		clP2vs.put("dataFilter", dataFilter); 
		clP2vs.put("status", CartLineStatusType.InCart.toString()); 
		 
		BigInteger rowCount = (BigInteger)this.dBParserAccess.selectOne(dbSession, getCartLineSql, clP2vs);
		return rowCount.intValue() > 0;
	}
	
	public List<DataRow> getCartLineInfos(String userId, List<String> cartLineIds, boolean forUpdate) throws SQLException{
		StringBuilder getCartLineSql = new StringBuilder();
		getCartLineSql.append("select cl.id as cartlineid, cl.datafilter as datafilter, d.id as definitionid, cl.unitprice as unitprice, cl.rowcount as rowcount, cl.price as price, d.dbtablename as dbtablename, d.name as dataname "
				+ "from dm_exportcartline cl "
				+ "left outer join dm_importexportdefinition d on d.id = cl.definitionid "
				+ "where cl.createuserid = " + SysConfig.getParamPrefix() + "userId "
				+ "and cl.status = " + SysConfig.getParamPrefix() + "status and (");
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", userId);
		p2vs.put("status", CartLineStatusType.InCart.toString());
		for(int i = 0; i < cartLineIds.size(); i++){
			String cartLineId = cartLineIds.get(i);			
			String pName = "clId" + i;
			if(i > 0){
				getCartLineSql.append(" or ");
			}
			getCartLineSql.append("cl.id = " + SysConfig.getParamPrefix() + pName);
			p2vs.put(pName, cartLineId);
		}
		getCartLineSql.append(")");
		if(forUpdate){
			getCartLineSql.append(" for update");
		}
		
		List<String> alias = new ArrayList<String>();
		alias.add("cartlineid");
		alias.add("datafilter");
		alias.add("definitionid");
		alias.add("unitprice");
		alias.add("rowcount");
		alias.add("price");
		alias.add("dbtablename");
		alias.add("dataname");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("cartlineid", ValueType.String);
		valueTypes.put("datafilter", ValueType.String);
		valueTypes.put("definitionid", ValueType.String);
		valueTypes.put("unitprice", ValueType.Decimal);
		valueTypes.put("rowcount", ValueType.Decimal);
		valueTypes.put("price", ValueType.Decimal);
		valueTypes.put("dbtablename", ValueType.String);
		valueTypes.put("dataname", ValueType.String);
		
		DataTable clDt = this.dBParserAccess.selectList(dbSession, getCartLineSql.toString(), p2vs, alias, valueTypes);
		return clDt.getRows();
	}
	
	public void closeOrderWithTx(INcpSession session, String orderId) throws Exception {

		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			this.closeOrder(session, orderId);
			tx.commit(); 
		}
		catch(Exception ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 	
	}
	
	private void closeOrder(INcpSession session, String orderId) throws Exception { 
		String getOrderStatusSql = "select eo.status as status from dm_exportorder eo where eo.id = " + SysConfig.getParamPrefix() + "orderId and eo.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("orderId", orderId);
		p2vs.put("userId", session.getUserId());
		String orderStatus = (String)this.dBParserAccess.selectOne(this.dbSession, getOrderStatusSql, p2vs);
		
		if(orderStatus == null){
			NcpException ncpEx = new NcpException("closeOrder_noneOrder", "不存在此订单或订单不属于当前用户");
			throw ncpEx;
		}
		OrderStatusType statusType = OrderStatusType.valueOf(orderStatus);
		switch(statusType){ 
			case Creating:{
					NcpException ncpEx = new NcpException("closeOrder_errorStatus", "订单正在创建, 请不要关闭");
					throw ncpEx;
				}  
			case WaitingPay:{
					String closeOrderSql = "update dm_exportorder set status = " + SysConfig.getParamPrefix() + "statusType where id = " + SysConfig.getParamPrefix() + "orderId";
					HashMap<String, Object> cP2vs = new HashMap<String, Object>();
					cP2vs.put("orderId", orderId);
					cP2vs.put("statusType", OrderStatusType.Deleted.toString());
					this.dBParserAccess.update(this.getDBSession(), closeOrderSql, cP2vs);
				}
				break;
			case Paying:{
					NcpException ncpEx = new NcpException("closeOrder_errorStatus", "订单正在支付, 请不要关闭");
					throw ncpEx;
				} 
			case Paid:{
					NcpException ncpEx = new NcpException("closeOrder_errorStatus", "不能关闭已支付的订单");
					throw ncpEx;
				} 
			case Deleted:{
					NcpException ncpEx = new NcpException("closeOrder_errorStatus", "不能重复关闭订单");
					throw ncpEx;
				} 
			default:
				break;
		}  
	}

	public String generateOrderWithTx(INcpSession session, List<String> cartLineIds) throws Exception {

		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			String orderId = this.generateOrder(session, cartLineIds);
			tx.commit(); 
			return orderId;
		}
		catch(Exception ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 	
	}
	
	private String generateOrderSubjectInfo(List<DataRow> cartLineRows){
		StringBuilder subjectInfoBuilder = new StringBuilder();
		for(int i = 0; i < cartLineRows.size(); i++){
			DataRow cartRow = cartLineRows.get(i);
			String dataName = cartRow.getStringValue("dataname");
			BigDecimal unitPrice = cartRow.getBigDecimalValue("unitprice");
			BigDecimal rowCount = cartRow.getBigDecimalValue("rowcount");
			BigDecimal price = cartRow.getBigDecimalValue("price");
			
			subjectInfoBuilder.append((i == 0 ? "" : ", ") + dataName);
		}
		String subjectInfo = "数据订单: " + subjectInfoBuilder.toString();
		return subjectInfo.length() > this.orderSubjectInfoMaxLength ? subjectInfo.substring(0, this.orderSubjectInfoMaxLength - 3) + "..." : subjectInfo;
	}
	
	private String generateOrderBodyInfo(List<DataRow> cartLineRows){
		StringBuilder bodyInfoBuilder = new StringBuilder();
		for(int i = 0; i < cartLineRows.size(); i++){
			DataRow cartRow = cartLineRows.get(i);
			String dataName = cartRow.getStringValue("dataname");
			BigDecimal unitPrice = cartRow.getBigDecimalValue("unitprice");
			BigDecimal rowCount = cartRow.getBigDecimalValue("rowcount");
			BigDecimal price = cartRow.getBigDecimalValue("price");
			
			bodyInfoBuilder.append((i == 0 ? "" : "; ") + dataName + ", 条数" + rowCount.toString() + ", 单价" + unitPrice.toString() + ", 价格" + price.toString());
		}
		String bodyInfo = bodyInfoBuilder.toString();
		return bodyInfo.length() > this.orderBodyInfoMaxLength ? bodyInfo.substring(0, this.orderBodyInfoMaxLength - 3) + "..." : bodyInfo;
	}
	
	private String generateOrder(INcpSession session, List<String> cartLineIds) throws Exception {
		if(cartLineIds.size() == 0){
			NcpException ncpEx = new NcpException("generateOrder_noneCartLine", "未选中任何商品");
			throw ncpEx;
		}
		List<DataRow> clRows = this.getCartLineInfos(session.getUserId(), cartLineIds, true);
		if(clRows.size() == 0){
			NcpException ncpEx = new NcpException("generateOrder_changedCart", "购物车已发生变化, 请刷新后重新提交订单");
			throw ncpEx;
		}
		
		String orderId = this.createOrderInDB(session.getUserId());
		Date timeoutTime = new Date(System.currentTimeMillis() - historyOrderTimeoutDays * 24 * 60 * 60 * 1000);
		BigDecimal originalTotalPrice = new BigDecimal(0);
		BigDecimal actualTotalTempPrice = new BigDecimal(0);
		
		String subjectInfo = this.generateOrderSubjectInfo(clRows);
		String bodyInfo = this.generateOrderBodyInfo(clRows);
		
		for(int i = 0; i < clRows.size(); i++){
			DataRow clRow = clRows.get(i);
			String definitionId = clRow.getStringValue("definitionid");
			String dataName = "ie_" + clRow.getStringValue("dbtablename");
			String dataFilter = clRow.getStringValue("datafilter"); 
			BigDecimal unitPrice = clRow.getBigDecimalValue("unitprice"); 
			double unitPriceDouble = unitPrice.doubleValue(); 
			JSONArray dataFilterArray =JSONArray.fromObject(dataFilter);
			int totalRowCount = this.getRowCount(dataName, dataFilterArray);
			
			/*先不实现去重
			List<String> totalDataLineIds = this.getDataLineIds(totalRowCount, dataName, dataFilterArray);
			HashMap<String, Object> historyDataLineIds = this.getHistoryDataLineIds(session.getUserId(), definitionId, timeoutTime);
			List<String> unPaidIds = this.getUnPaidDataLineCount(totalDataLineIds, historyDataLineIds);
			int newRowCount = unPaidIds.size();
			*/
			int newRowCount = totalRowCount;
			
			BigDecimal originalPrice = this.calcPrice(totalRowCount, unitPriceDouble);
			originalTotalPrice = originalTotalPrice.add(originalPrice);
			
			BigDecimal actualPrice = this.calcPrice(newRowCount, unitPriceDouble);
			actualTotalTempPrice = actualTotalTempPrice.add(actualPrice);
						
			String orderLineId = this.createOrderLineInDB(orderId, definitionId, unitPrice, originalPrice, actualPrice, dataFilter, totalRowCount, newRowCount);
			
			//保存数据记录的id值到文件
			//this.saveOrderIdContentFile(session.getUserId(), orderId, orderLineId, unPaidIds);			
		}
		
		BigDecimal actualTotalPrice = this.calcActualPrice(actualTotalTempPrice);
		
		this.updateOrderAfterCalcPrice(orderId, originalTotalPrice, actualTotalPrice, subjectInfo, bodyInfo);
		
		this.removeCartLineAfterCreateOrder(cartLineIds);

		return orderId;
	}
	
	private void updateOrderAfterCalcPrice(String orderId, BigDecimal originalTotalPrice, BigDecimal actualTotalPrice, String subjectInfo, String bodyInfo){
		Data orderData = DataCollection.getData("dm_ExportOrder");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("originaltotalprice", originalTotalPrice);
		fieldValues.put("actualtotalprice", actualTotalPrice);
		fieldValues.put("payprice", actualTotalPrice);
		fieldValues.put("status", OrderStatusType.WaitingPay.toString()); 
		fieldValues.put("subjectinfo", subjectInfo);
		fieldValues.put("bodyinfo", bodyInfo); 
		this.dBParserAccess.updateByData(this.getDBSession(), orderData, fieldValues, orderId);
	}
	
	private void updateOrderAfterPaid(String orderId, Date payTime){
		Data orderData = DataCollection.getData("dm_ExportOrder");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>(); 
		fieldValues.put("status", OrderStatusType.Paid.toString()); 
		fieldValues.put("paytime", payTime); 
		this.dBParserAccess.updateByData(this.getDBSession(), orderData, fieldValues, orderId);
	}
	
	private List<String> getUnPaidDataLineCount(List<String> newDataLineIds, HashMap<String, Object> historyDataLineIds){
		List<String> unPaidIds = new ArrayList<String>();
		if(historyDataLineIds == null){
			return newDataLineIds;
		}
		else{
			for(String id : newDataLineIds){
				if(!historyDataLineIds.containsKey(id)){
					unPaidIds.add(id);
				}
			}
			return unPaidIds;
		}
	}

	private List<DataRow> getHistoryOrderLines(String userId, String definitionId, Date timeoutTime) throws SQLException{
		String orderSql = "select eo.id as orderid, eol.id as orderlineid from dm_exportorderline eol left outer join dm_exportorder eo on eo.id = eol.parentid"
			+ " where eo.status = " + SysConfig.getParamPrefix() +"orderStatus and eo.paytime > " + SysConfig.getParamPrefix() + "payTime and eo.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("payTime", timeoutTime);
		p2vs.put("userId", userId);
		p2vs.put("orderStatus", OrderStatusType.Paid.toString());
		
		List<String> alias = new ArrayList<String>();
		alias.add("orderid");
		alias.add("orderlineid");
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("orderid", ValueType.String);
		valueTypes.put("orderlineid", ValueType.String); 
		DataTable orderLineDt = this.dBParserAccess.selectList(this.getDBSession(), orderSql, p2vs, alias, valueTypes);
		return orderLineDt.getRows();
	}
	
	private void removeCartLineAfterCreateOrder(List<String> cartLineIds){
		StringBuilder updateCartLineSql = new StringBuilder();
		updateCartLineSql.append("update dm_exportcartline set status = " + SysConfig.getParamPrefix() +"statustype where (" );
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("statustype", CartLineStatusType.InOrder.toString());
		
		for(int i = 0; i < cartLineIds.size(); i++){
			String cartLineId = cartLineIds.get(i);			
			String pName = "clId" + i;
			if(i > 0){
				updateCartLineSql.append(" or ");
			}
			updateCartLineSql.append("id = " + SysConfig.getParamPrefix() + pName);
			p2vs.put(pName, cartLineId);
		}
		updateCartLineSql.append(")");  
		
		
		this.dBParserAccess.update(dbSession, updateCartLineSql.toString(), p2vs); 
	}
	
	private HashMap<String, Object> getHistoryDataLineIds(String userId, String definitionId, Date timeoutTime) throws Exception{
		List<DataRow> orderLineRows = this.getHistoryOrderLines(userId, definitionId, timeoutTime);
		if(orderLineRows.size() == 0){
			return null;
		}
		else{
			HashMap<String, Object> ids = new HashMap<String, Object>();
			for(int i = 0; i < orderLineRows.size(); i++){
				DataRow orderLineRow = orderLineRows.get(i);
				String orderId = orderLineRow.getStringValue("orderid");
				String orderLineId = orderLineRow.getStringValue("orderlineid");
				String[] dataIds = this.getOrderLineDataIds(userId, orderId, orderLineId);
				for(String dataId : dataIds){
					if(!ids.containsKey(dataId)){
						ids.put(dataId, null);
					}
				}
			}
			return ids;
		}
	}
	
	private String[] getOrderLineDataIds(String userId, String orderId, String orderLineId) throws Exception{
		String filePath = this.getOrderIdContentFilePath(userId, orderId, orderLineId);
		FileOperate fo = new FileOperate();
		String idStr = fo.readTxt(filePath); 
		return idStr.split(";");
	}
	
	private String createOrderInDB(String userId){
		String orderNumber = this.getRandomOrderNumber();
		Data orderData = DataCollection.getData("dm_ExportOrder");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("createtime", new Date());
		fieldValues.put("createuserid", userId);
		fieldValues.put("ordernumber", orderNumber);
		fieldValues.put("status", OrderStatusType.Creating.toString()); 
		String orderId = this.dBParserAccess.insertByData(this.getDBSession(), orderData, fieldValues);
		return orderId;		
	}
	
	private String createOrderLineInDB(String orderId, String definitionId, BigDecimal unitPrice, BigDecimal originalPrice, BigDecimal actualPrice, String dataFilter, int totalRowCount, int newRowCount){
		Data orderLineData = DataCollection.getData("dm_ExportOrderLine");
		HashMap<String, Object> fieldValues = new HashMap<String, Object>();
		fieldValues.put("parentid", orderId);
		fieldValues.put("definitionid", definitionId);
		fieldValues.put("originalprice" , originalPrice);
		fieldValues.put("actualprice", actualPrice); 
		fieldValues.put("datafilter", dataFilter); 
		fieldValues.put("unitprice", unitPrice); 
		fieldValues.put("totalrowcount", BigDecimal.valueOf(totalRowCount)); 
		fieldValues.put("newrowcount", BigDecimal.valueOf(newRowCount)); 
		fieldValues.put("exportstatus", ExportStatusType.WaitingExport.toString()); 
		fieldValues.put("exportedrowcount", BigDecimal.valueOf(0));
		String orderLineId = this.dBParserAccess.insertByData(this.getDBSession(), orderLineData, fieldValues);
		return orderLineId;
	}
	
	private void saveOrderIdContentFile(String userId, String orderId, String orderLineId, List<String> ids) throws Exception{
		StringBuilder idStr = new StringBuilder();
		idStr.append(";");
		for(int i = 0; i < ids.size(); i++){
			idStr.append(ids.get(i) + ";");
		}
		
		String filePath = this.getOrderIdContentFilePath(userId, orderId, orderLineId);
		FileOperate fo = new FileOperate();
		File file = new File(filePath);
		fo.createFolder(file.getParentFile(), true);
		
		fo.createFile(filePath, idStr.toString());
	}
	
	private String getOrderIdContentFilePath(String userId, String orderId, String orderLineId){
		return this.getOrderIdContentFileFolder() + "\\" + userId + "\\" + orderId + "\\" + orderLineId + ".txt";
	}
	
	//待导入文件存储目录
	private static String orderIdContentFileFolder = null;
	private String getOrderIdContentFileFolder(){
		if(BuyProcessor.orderIdContentFileFolder == null){
			String definitionFileDirectory = ConfigContext.getConfigMap().get(NovaCloudState.NOVAONE_IMPORTEXPORT_DEFINITIONFILEDIRECTORY);
			BuyProcessor.orderIdContentFileFolder = definitionFileDirectory + "\\buy";
		}
		return BuyProcessor.orderIdContentFileFolder;
	}
	
	private List<String> getDataLineIds(int rowCount, String dataName, JSONArray dataFilterArray) throws Exception{
		Data data = DataCollection.getData(dataName);
		SelectSqlParser sqlParser = data.getDsSqlParser();
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		String userWhere = DataBaseDao.getWhere(this.dBParserAccess, sqlParser, dataFilterArray, p2vs, "and");
		
		BuyDataSelectSqlParser buyDataSqlParser = new BuyDataSelectSqlParser(sqlParser.getInitSql());
		buyDataSqlParser.parser();
 	   	HashMap<String, ValueType> fieldTypeMap = new HashMap<String, ValueType>(); 
 	   	fieldTypeMap.put("id", ValueType.String); 
 	   	buyDataSqlParser.setFieldTypeMap(fieldTypeMap);
		
 	   	int pageCount = (int) Math.ceil((double)rowCount / (double)this.onePageRowCountWhenGetIds); 
		List<String> ids = new ArrayList<String>();
		for(int i = 0; i < pageCount; i++){
			DataTable dataLineDt = this.dBParserAccess.getDtBySqlParser(this.getDBSession(), buyDataSqlParser, i + 1, this.onePageRowCountWhenGetIds, p2vs, "", userWhere, "");
			List<DataRow> dataLineRows = dataLineDt.getRows();
			for(int j = 0; j < dataLineRows.size(); j++){
				DataRow dataLineRow = dataLineRows.get(j);
				String id = dataLineRow.getStringValue("id");
				ids.add(id);
			}
		}
		return ids;
	}
	
	//取两位小数
	private BigDecimal calcPrice(int rowCount, double unitPrice){
		BigDecimal price = BigDecimal.valueOf(unitPrice * rowCount); 
		return price;
	}

	
	//取两位小数
	private BigDecimal calcActualPrice(BigDecimal orignalPrice){
		double priceTemp = Math.floor(orignalPrice.doubleValue() * 100) / 100;
		BigDecimal price = priceTemp == 0 && orignalPrice.doubleValue() > 0 ? BigDecimal.valueOf(0.01) : BigDecimal.valueOf(priceTemp);
		return price;
	}

	public JSONObject getOrderMainInfo(INcpSession session, String orderId) throws Exception {
		String getOrderSql = "select eo.id as id, "
			+ "eo.payprice as payprice, "
			+ "eo.subjectinfo as subjectinfo, "
			+ "eo.bodyinfo as bodyinfo, " 
			+ "eo.ordernumber as ordernumber, "
			+ "eo.paytime as paytime, "
			+ "eo.status as status "
			+ "from dm_exportorder eo "
			+ "where eo.id = " +SysConfig.getParamPrefix() + "orderId "
			+ "and eo.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>();
		oP2vs.put("orderId", orderId);
		oP2vs.put("userId", session.getUserId());
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("id"); 
		oAlias.add("payprice");
		oAlias.add("subjectinfo");
		oAlias.add("bodyinfo");
		oAlias.add("ordernumber");
		oAlias.add("paytime");
		oAlias.add("status");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("id", ValueType.String); 
		oValueTypes.put("payprice", ValueType.Decimal);
		oValueTypes.put("subjectinfo", ValueType.String);
		oValueTypes.put("bodyinfo", ValueType.String);
		oValueTypes.put("ordernumber", ValueType.String); 
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("status", ValueType.String);
		
		DataTable orderDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderSql, oP2vs, oAlias, oValueTypes);
		List<DataRow> orderRows = orderDt.getRows();
		if(orderRows.size() == 0){
			return null;
		} 
		else{		
			DataRow orderRow = orderRows.get(0);
			JSONObject orderObj = new JSONObject();
			orderObj.put("id", orderRow.getStringValue("id"));
			orderObj.put("orderNumber", orderRow.getStringValue("ordernumber"));
			orderObj.put("payPrice",orderRow.isNull("payprice") ? "" :  ValueConverter.convertToString(orderRow.getBigDecimalValue("payprice"), ValueType.Decimal));
			orderObj.put("payTime", orderRow.isNull("paytime") ? "" : ValueConverter.convertToString(orderRow.getDateTimeValue("paytime"), ValueType.Time).substring(0, 16));
			orderObj.put("status", orderRow.getStringValue("status"));
			orderObj.put("subjectInfo", orderRow.getStringValue("subjectinfo"));
			orderObj.put("bodyInfo", orderRow.getStringValue("bodyinfo"));
	
			return orderObj;
		}
	}

	public JSONObject getOrderMainInfoByOrderNumber(INcpSession session, String orderNumber) throws Exception {
		String getOrderSql = "select eo.id as id, "
			+ "eo.payprice as payprice, "
			+ "eo.subjectinfo as subjectinfo, "
			+ "eo.bodyinfo as bodyinfo, " 
			+ "eo.ordernumber as ordernumber, "
			+ "eo.paytime as paytime, "
			+ "eo.status as status "
			+ "from dm_exportorder eo "
			+ "where eo.ordernumber = " +SysConfig.getParamPrefix() + "orderNumber ";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>();
		oP2vs.put("orderNumber", orderNumber); 
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("id"); 
		oAlias.add("payprice");
		oAlias.add("subjectinfo");
		oAlias.add("bodyinfo");
		oAlias.add("ordernumber");
		oAlias.add("paytime");
		oAlias.add("status");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("id", ValueType.String); 
		oValueTypes.put("payprice", ValueType.Decimal);
		oValueTypes.put("subjectinfo", ValueType.String);
		oValueTypes.put("bodyinfo", ValueType.String);
		oValueTypes.put("ordernumber", ValueType.String); 
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("status", ValueType.String);
		
		DataTable orderDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderSql, oP2vs, oAlias, oValueTypes);
		List<DataRow> orderRows = orderDt.getRows();
		if(orderRows.size() == 0){
			return null;
		} 
		else{		
			DataRow orderRow = orderRows.get(0);
			JSONObject orderObj = new JSONObject();
			orderObj.put("id", orderRow.getStringValue("id"));
			orderObj.put("orderNumber", orderRow.getStringValue("ordernumber"));
			orderObj.put("payPrice",orderRow.isNull("payprice") ? "" :  ValueConverter.convertToString(orderRow.getBigDecimalValue("payprice"), ValueType.Decimal));
			orderObj.put("payTime", orderRow.isNull("paytime") ? "" : ValueConverter.convertToString(orderRow.getDateTimeValue("paytime"), ValueType.Time).substring(0, 16));
			orderObj.put("status", orderRow.getStringValue("status"));
			orderObj.put("subjectInfo", orderRow.getStringValue("subjectinfo"));
			orderObj.put("bodyInfo", orderRow.getStringValue("bodyinfo"));
	
			return orderObj;
		}
	}

	public JSONObject getOrderDetail(INcpSession session, String orderId) throws Exception {
		String getOrderSql = "select eo.id as id, "
			+ "eo.ordernumber as ordernumber, "
			+ "eo.createtime as createtime, "
			+ "eo.createuserid as createuserid, "
			+ "u.name as createusername, "
			+ "eo.originaltotalprice as originaltotalprice, "
			+ "eo.actualtotalprice as actualtotalprice, "
			+ "eo.payprice as payprice, "
			+ "eo.paytime as paytime, "
			+ "eo.status as status "
			+ "from dm_exportorder eo "
			+ "left outer join d_user u on u.id = eo.createuserid "
			+ "where eo.id = " +SysConfig.getParamPrefix() + "orderId "
			+ "and eo.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>();
		oP2vs.put("orderId", orderId);
		oP2vs.put("userId", session.getUserId());
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("id");
		oAlias.add("ordernumber");
		oAlias.add("createtime");
		oAlias.add("createuserid");
		oAlias.add("createusername");
		oAlias.add("originaltotalprice");
		oAlias.add("actualtotalprice");
		oAlias.add("payprice");
		oAlias.add("paytime");
		oAlias.add("status");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("id", ValueType.String);
		oValueTypes.put("ordernumber", ValueType.String);
		oValueTypes.put("createtime", ValueType.Time);
		oValueTypes.put("createuserid", ValueType.String);
		oValueTypes.put("createusername", ValueType.String);
		oValueTypes.put("originaltotalprice", ValueType.Decimal);
		oValueTypes.put("actualtotalprice", ValueType.Decimal);
		oValueTypes.put("payprice", ValueType.Decimal);
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("status", ValueType.String);
		
		DataTable orderDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderSql, oP2vs, oAlias, oValueTypes);
		List<DataRow> orderRows = orderDt.getRows();
		if(orderRows.size() == 0){
			NcpException ncpEx = new NcpException("getOrderDetail_noneOrder", "不存在此订单");
			throw ncpEx;
		} 
		
		DataRow orderRow = orderRows.get(0);
		JSONObject orderObj = new JSONObject();
		orderObj.put("id", orderRow.getStringValue("id"));
		orderObj.put("createTime", ValueConverter.convertToString(orderRow.getDateTimeValue("createtime"), ValueType.Time).substring(0, 16));
		orderObj.put("orderNumber", orderRow.getStringValue("ordernumber"));
		orderObj.put("createUserId", orderRow.getStringValue("createuserid"));
		orderObj.put("createUserName", orderRow.getStringValue("createusername"));
		orderObj.put("originalTotalPrice", ValueConverter.convertToString(orderRow.getBigDecimalValue("originaltotalprice"), ValueType.Decimal));
		orderObj.put("actualTotalPrice", ValueConverter.convertToString(orderRow.getBigDecimalValue("actualtotalprice"), ValueType.Decimal));
		orderObj.put("payPrice",orderRow.isNull("payprice") ? "" :  ValueConverter.convertToString(orderRow.getBigDecimalValue("payprice"), ValueType.Decimal));
		orderObj.put("payTime", orderRow.isNull("paytime") ? "" : ValueConverter.convertToString(orderRow.getDateTimeValue("paytime"), ValueType.Time).substring(0, 16));
		orderObj.put("status", orderRow.getStringValue("status"));

		String getOrderDetailSql = "select eol.id as id, "
			+ "eol.definitionid as definitionid, "
			+ "d.name as definitionname, "
			+ "d.dbtablename as dbtablename, "
			+ "eol.originalprice as originalprice, "
			+ "eol.actualprice as actualprice, "
			+ "eol.datafilter as datafilter, "
			+ "eol.newrowcount as newrowcount, "
			+ "eol.totalrowcount as totalrowcount, "
			+ "eol.unitprice as unitprice, "
			+ "eol.exportlog as exportlog, "
			+ "eol.exportstarttime as exportstarttime, "
			+ "eol.exportedrowcount as exportedrowcount, "
			+ "eol.exportfilename as exportfilename, "
			+ "eol.exportstatus as exportstatus "
			+ "from dm_exportorderline eol "
			+ "left outer join dm_importexportdefinition d on d.id = eol.definitionid "
			+ "where eol.parentid = " +SysConfig.getParamPrefix() + "orderId ";
		HashMap<String, Object> dP2vs = new HashMap<String, Object>();
		dP2vs.put("orderId", orderId);
		
		List<String> dAlias = new ArrayList<String>();
		dAlias.add("id");
		dAlias.add("definitionid");
		dAlias.add("definitionname");
		dAlias.add("dbtablename");
		dAlias.add("originalprice");
		dAlias.add("actualprice");
		dAlias.add("datafilter");
		dAlias.add("newrowcount");
		dAlias.add("totalrowcount");
		dAlias.add("unitprice");
		dAlias.add("exportlog");
		dAlias.add("exportstarttime");
		dAlias.add("exportedrowcount");
		dAlias.add("exportfilename");
		dAlias.add("exportstatus");
		
		HashMap<String, ValueType> dValueTypes = new HashMap<String, ValueType>();
		dValueTypes.put("id", ValueType.String);
		dValueTypes.put("definitionid", ValueType.String);
		dValueTypes.put("definitionname", ValueType.String);
		dValueTypes.put("dbtablename", ValueType.String);
		dValueTypes.put("originalprice", ValueType.Decimal);
		dValueTypes.put("actualprice", ValueType.Decimal);
		dValueTypes.put("datafilter", ValueType.String);
		dValueTypes.put("newrowcount", ValueType.Decimal);
		dValueTypes.put("totalrowcount", ValueType.Decimal);
		dValueTypes.put("unitprice", ValueType.Decimal);
		dValueTypes.put("exportlog", ValueType.String);
		dValueTypes.put("exportstarttime", ValueType.Time);
		dValueTypes.put("exportedrowcount", ValueType.Decimal);
		dValueTypes.put("exportfilename", ValueType.String);
		dValueTypes.put("exportstatus", ValueType.String);
		
		DataTable orderLineDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderDetailSql, dP2vs, dAlias, dValueTypes);
		List<DataRow> orderLineRows = orderLineDt.getRows();
		
		JSONArray detailArray = new JSONArray();
		for(DataRow orderLineRow : orderLineRows){
			JSONObject orderLineObj = new JSONObject();
			orderLineObj.put("id", orderLineRow.getStringValue("id"));
			orderLineObj.put("definitionId", orderLineRow.getStringValue("definitionid"));
			orderLineObj.put("definitionName",CommonFunction.encode(orderLineRow.getStringValue("definitionname")));
			orderLineObj.put("dbTableName",CommonFunction.encode(orderLineRow.getStringValue("dbtablename")));
			orderLineObj.put("originalPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("originalprice"), ValueType.Decimal));
			orderLineObj.put("actualPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("actualprice"), ValueType.Decimal));
			orderLineObj.put("dataFilter", CommonFunction.encode(orderLineRow.getStringValue("datafilter")));
			orderLineObj.put("newRowCount", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("newrowcount"), ValueType.Decimal));
			orderLineObj.put("totalRowCount", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("totalrowcount"), ValueType.Decimal));
			orderLineObj.put("unitPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("unitprice"), ValueType.Decimal));		
			orderLineObj.put("exportLog",  orderLineRow.getStringValue("exportlog") == null ? "" : orderLineRow.getStringValue("exportlog"));		
			orderLineObj.put("exportStartTime", orderLineRow.getValue("exportstarttime") == null ? "" : ValueConverter.convertToString(orderLineRow.getValue("exportstarttime"), ValueType.Time));		
			orderLineObj.put("exportedRowCount", orderLineRow.getValue("exportedrowcount") == null ? "" : ValueConverter.convertToString(orderLineRow.getValue("exportedrowcount"), ValueType.Decimal));
			orderLineObj.put("exportFileName", orderLineRow.getStringValue("exportfilename") == null ? "" : orderLineRow.getStringValue("exportfilename"));					
			orderLineObj.put("exportStatus", orderLineRow.getStringValue("exportstatus"));			
			detailArray.add(orderLineObj);
		}		
		orderObj.put("lines", detailArray);		
		return orderObj;
	}
	
	public JSONArray getOrderLines(INcpSession session, String orderId) throws Exception {
		String getOrderDetailSql = "select eol.id as id, "
			+ "eol.definitionid as definitionid, "
			+ "d.name as definitionname, "
			+ "d.dbtablename as dbtablename, "
			+ "eol.originalprice as originalprice, "
			+ "eol.actualprice as actualprice, "
			+ "eol.datafilter as datafilter, "
			+ "eol.newrowcount as newrowcount, "
			+ "eol.totalrowcount as totalrowcount, "
			+ "eol.unitprice as unitprice "
			+ "from dm_exportorderline eol "
			+ "left outer join dm_importexportdefinition d on d.id = eol.definitionid "
			+ "where eol.parentid = " +SysConfig.getParamPrefix() + "orderId ";
		HashMap<String, Object> dP2vs = new HashMap<String, Object>();
		dP2vs.put("orderId", orderId);
		
		List<String> dAlias = new ArrayList<String>();
		dAlias.add("id");
		dAlias.add("definitionid");
		dAlias.add("definitionname");
		dAlias.add("dbtablename");
		dAlias.add("originalprice");
		dAlias.add("actualprice");
		dAlias.add("datafilter");
		dAlias.add("newrowcount");
		dAlias.add("totalrowcount");
		dAlias.add("unitprice");
		
		HashMap<String, ValueType> dValueTypes = new HashMap<String, ValueType>();
		dValueTypes.put("id", ValueType.String);
		dValueTypes.put("definitionid", ValueType.String);
		dValueTypes.put("definitionname", ValueType.String);
		dValueTypes.put("dbtablename", ValueType.String);
		dValueTypes.put("originalprice", ValueType.Decimal);
		dValueTypes.put("actualprice", ValueType.Decimal);
		dValueTypes.put("datafilter", ValueType.String);
		dValueTypes.put("newrowcount", ValueType.Decimal);
		dValueTypes.put("totalrowcount", ValueType.Decimal);
		dValueTypes.put("unitprice", ValueType.Decimal);
		
		DataTable orderLineDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderDetailSql, dP2vs, dAlias, dValueTypes);
		List<DataRow> orderLineRows = orderLineDt.getRows();
		
		JSONArray detailArray = new JSONArray();
		for(DataRow orderLineRow : orderLineRows){
			JSONObject orderLineObj = new JSONObject();
			orderLineObj.put("id", orderLineRow.getStringValue("id"));
			orderLineObj.put("definitionId", orderLineRow.getStringValue("definitionid"));
			orderLineObj.put("definitionName",CommonFunction.encode(orderLineRow.getStringValue("definitionname")));
			orderLineObj.put("dbTableName",CommonFunction.encode(orderLineRow.getStringValue("dbtablename")));
			orderLineObj.put("originalPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("originalprice"), ValueType.Decimal));
			orderLineObj.put("actualPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("actualprice"), ValueType.Decimal));
			orderLineObj.put("dataFilter", CommonFunction.encode(orderLineRow.getStringValue("datafilter")));
			orderLineObj.put("newRowCount", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("newrowcount"), ValueType.Decimal));
			orderLineObj.put("totalRowCount", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("totalrowcount"), ValueType.Decimal));
			orderLineObj.put("unitPrice", ValueConverter.convertToString(orderLineRow.getBigDecimalValue("unitprice"), ValueType.Decimal));			
			detailArray.add(orderLineObj);
		}	
		return detailArray;
	}
	
	public JSONObject getOrderList(INcpSession session, int pageIndex, int orderListOnePageNum) throws Exception {
		String getOrderSql = "select eo.id as id, "
			+ "eo.ordernumber as ordernumber, "
			+ "eo.createtime as createtime, "
			+ "eo.createuserid as createuserid, "
			+ "eo.originaltotalprice as originaltotalprice, "
			+ "eo.actualtotalprice as actualtotalprice, "
			+ "eo.payprice as payprice, "
			+ "eo.paytime as paytime, "
			+ "eo.status as status "
			+ "from dm_exportorder eo "
			+ "where eo.createuserid = " + SysConfig.getParamPrefix() + "userId "
			+ "order by eo.createtime desc";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>();
		oP2vs.put("userId", session.getUserId());
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("id");
		oAlias.add("ordernumber");
		oAlias.add("createtime");
		oAlias.add("createuserid");
		oAlias.add("originaltotalprice");
		oAlias.add("actualtotalprice");
		oAlias.add("payprice");
		oAlias.add("paytime");
		oAlias.add("status");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("id", ValueType.String);
		oValueTypes.put("ordernumber", ValueType.String);
		oValueTypes.put("createtime", ValueType.Time);
		oValueTypes.put("createuserid", ValueType.String);
		oValueTypes.put("originaltotalprice", ValueType.Decimal);
		oValueTypes.put("actualtotalprice", ValueType.Decimal);
		oValueTypes.put("payprice", ValueType.Decimal);
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("status", ValueType.String);

		int fromIndex = (pageIndex - 1) * orderListOnePageNum;
		DataTable orderDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderSql, oP2vs, oAlias, oValueTypes, fromIndex, orderListOnePageNum);
		List<DataRow> orderRows = orderDt.getRows();  
		
		JSONArray orderArray = new JSONArray();
		for(DataRow orderRow : orderRows){ 
			JSONObject orderObj = new JSONObject();
			orderObj.put("id", orderRow.getStringValue("id"));
			orderObj.put("orderNumber", orderRow.getStringValue("ordernumber"));
			orderObj.put("createTime", ValueConverter.convertToString(orderRow.getDateTimeValue("createtime"), ValueType.Time).substring(0, 16));
			orderObj.put("createUserId", orderRow.getStringValue("createuserid"));
			orderObj.put("originalTotalPrice", ValueConverter.convertToString(orderRow.getBigDecimalValue("originaltotalprice"), ValueType.Decimal));
			orderObj.put("actualTotalPrice", ValueConverter.convertToString(orderRow.getBigDecimalValue("actualtotalprice"), ValueType.Decimal));
			orderObj.put("payPrice", orderRow.isNull("payprice") ? "" : ValueConverter.convertToString(orderRow.getBigDecimalValue("payprice"), ValueType.Decimal));
			orderObj.put("payTime", orderRow.isNull("paytime") ? "" : ValueConverter.convertToString(orderRow.getDateTimeValue("paytime"), ValueType.Time).substring(0, 16));
			orderObj.put("status", orderRow.getStringValue("status"));		
			orderArray.add(orderObj);
		}		

		String getOrderCountSql = "select count(1) as orderCount "
				+ "from dm_exportorder eo "
				+ "where eo.createuserid = " + SysConfig.getParamPrefix() + "userId";
		HashMap<String, Object> ocP2vs = new HashMap<String, Object>();
		ocP2vs.put("userId", session.getUserId());
		
		BigInteger orderCount = (BigInteger)this.dBParserAccess.selectOne(this.getDBSession(), getOrderCountSql, ocP2vs);
				
		JSONObject orderListObj = new JSONObject();
		orderListObj.put("orders", orderArray);	
		orderListObj.put("orderCount", orderCount.intValue());
		orderListObj.put("pageIndex", pageIndex);
		return orderListObj;
	}
	
	public JSONObject getCartList(INcpSession session) throws Exception {
		String getCartLineSql = "select cl.id as id, "
			+ "cl.datafilter as datafilter, "
			+ "d.id as definitionid, "
			+ "d.name as definitionname, "
			+ "d.dbtablename as dbtablename, "
			+ "cl.unitprice as unitprice, "
			+ "cl.price as price, "
			+ "cl.createtime as createtime, "
			+ "cl.rowcount as rowcount "
			+ "from dm_exportcartline cl "
			+ "left outer join dm_importexportdefinition d on d.id = cl.definitionid "
			+ "where cl.createuserid = " + SysConfig.getParamPrefix() + "userId "
			+ "and cl.status = " + SysConfig.getParamPrefix() + "status "
			+ "order by cl.createtime desc";
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("userId", session.getUserId());
		p2vs.put("status", CartLineStatusType.InCart.toString());  
		
		List<String> alias = new ArrayList<String>();
		alias.add("id");
		alias.add("datafilter");
		alias.add("definitionid");
		alias.add("definitionname");
		alias.add("dbtablename");
		alias.add("unitprice");
		alias.add("price");
		alias.add("createtime");
		alias.add("rowcount"); 
		
		HashMap<String, ValueType> valueTypes = new HashMap<String, ValueType>();
		valueTypes.put("id", ValueType.String);
		valueTypes.put("datafilter", ValueType.String);
		valueTypes.put("definitionid", ValueType.String);
		valueTypes.put("definitionname", ValueType.String);
		valueTypes.put("dbtablename", ValueType.String);
		valueTypes.put("unitprice", ValueType.Decimal);
		valueTypes.put("price", ValueType.Decimal);
		valueTypes.put("createtime", ValueType.Time);
		valueTypes.put("rowcount", ValueType.Decimal); 
		
		DataTable clDt = this.dBParserAccess.selectList(dbSession, getCartLineSql.toString(), p2vs, alias, valueTypes);
		List<DataRow> clRows = clDt.getRows();
		
		JSONArray clArray = new JSONArray();
		for(DataRow clRow : clRows){
			JSONObject clObj = new JSONObject();
			clObj.put("id", clRow.getStringValue("id")); 
			clObj.put("dataFilter", CommonFunction.encode(clRow.getStringValue("datafilter")));
			clObj.put("definitionId", clRow.getStringValue("definitionid"));
			clObj.put("definitionName", CommonFunction.encode(clRow.getStringValue("definitionname")));
			clObj.put("dbTableName", clRow.getStringValue("dbtablename"));
			clObj.put("unitPrice", ValueConverter.convertToString(clRow.getBigDecimalValue("unitprice"), ValueType.Decimal));
			clObj.put("price", ValueConverter.convertToString(clRow.getBigDecimalValue("price"), ValueType.Decimal));
			clObj.put("createTime", ValueConverter.convertToString(clRow.getDateTimeValue("createtime"), ValueType.Time));
			clObj.put("rowCount", ValueConverter.convertToString(clRow.getBigDecimalValue("rowcount"), ValueType.Decimal));
			clArray.add(clObj);
		}
		
		JSONObject clListObj = new JSONObject();
		clListObj.put("cartLineCount", clRows.size());
		clListObj.put("lines", clArray);
		return clListObj;
	}
	
	public int getCartLineCount(INcpSession session) throws SQLException {
		int clCount = this.getCartLineCount(session.getUserId());
		return clCount;
	}
	
	public BigDecimal getUnitPrice(INcpSession session, String definitionId) throws SQLException {
		Session dbSession = this.getDBSession(); 
		String unitPriceSql = "select d.unitprice as unitprice from dm_importexportdefinition d where d.id = " + SysConfig.getParamPrefix() + "definitionId";
		HashMap<String, Object> uP2vs = new HashMap<String, Object>();
		uP2vs.put("definitionId", definitionId);		 
		BigDecimal unitPrice = (BigDecimal) this.dBParserAccess.selectOne(dbSession, unitPriceSql, uP2vs);		
		return  unitPrice;
	}
	
	private Integer getRandomInteger(int maxValue){ 
		return Math.abs(random.nextInt()) % maxValue;
	}
	
	private String getRandomOrderNumber(){
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
		String randomStr = String.format("%08d", this.getRandomInteger(10000000));
		return sdf.format(date) + randomStr;
	} 
	
	private void createPayAfterPaid(String orderId, BigDecimal payPrice, PayType payType, Date payTime, String tradeNumber){
		Data payData = DataCollection.getData("dm_Pay"); 
		
		HashMap<String, Object> p2vs = new HashMap<String, Object>();
		p2vs.put("status", PayStatusType.Paid.toString());
		p2vs.put("tradenumber", tradeNumber);
		p2vs.put("orderid", orderId);
		p2vs.put("payprice", payPrice);
		p2vs.put("paytime", payTime);
		p2vs.put("paytype", payType.toString());
		
		Session dbSession = this.getDBSession();
		this.dBParserAccess.insertByData(dbSession, payData, p2vs);
	}
	
	private void updateOrderStatusAfterPaid(INcpSession session, String orderNumber, PayType payType, BigDecimal payPrice, Date payTime, String tradeNumber) throws NcpException, SQLException{
		String getOrderSql = "select eo.id as id, "
				+ "eo.payprice as payprice, " 
				+ "eo.paytime as paytime, "
				+ "eo.status as status "
				+ "from dm_exportorder eo "
				+ "where eo.ordernumber = " +SysConfig.getParamPrefix() + "orderNumber for update";
		HashMap<String, Object> oP2vs = new HashMap<String, Object>();
		oP2vs.put("orderNumber", orderNumber); 
		
		List<String> oAlias = new ArrayList<String>();
		oAlias.add("id");  
		oAlias.add("payprice");
		oAlias.add("paytime");
		oAlias.add("status");
		
		HashMap<String, ValueType> oValueTypes = new HashMap<String, ValueType>();
		oValueTypes.put("id", ValueType.String);  
		oValueTypes.put("payprice", ValueType.Decimal);
		oValueTypes.put("paytime", ValueType.Time);
		oValueTypes.put("status", ValueType.String);
		
		DataTable orderDt = this.dBParserAccess.selectList(this.getDBSession(), getOrderSql, oP2vs, oAlias, oValueTypes);
		List<DataRow> orderRows = orderDt.getRows();
		if(orderRows.size() == 0){
			NcpException ncpEx = new NcpException("updateOrderStatusAfterPaid_noneOrder", "不存在此订单, orderNumber = " + orderNumber);
			throw ncpEx;
		} 
		else{		
			DataRow orderRow = orderRows.get(0); 
			String orderId = orderRow.getStringValue("id"); 
			BigDecimal orderPayPrice = orderRow.getBigDecimalValue("payprice");
			OrderStatusType orderStatus = OrderStatusType.valueOf(orderRow.getStringValue("status"));
			
			if(orderPayPrice.compareTo(payPrice) != 0){
				
				NcpException ncpEx = new NcpException("updateOrderStatusAfterPaid_errorPrice", "付款金额错误, 应付金额为" + orderPayPrice.toString() + ", 实付金额为" + payPrice.toString());
				throw ncpEx;
			}
			 
			if(orderStatus != OrderStatusType.WaitingPay){
				NcpException ncpEx = new NcpException("updateOrderStatusAfterPaid_errorStatus", "订单状态错误, 订单在付款时已为" + orderStatus.toString() +"状态");
				throw ncpEx;
			}
			
			this.updateOrderAfterPaid(orderId, payTime);
			this.createPayAfterPaid(orderId, payPrice, payType, payTime, tradeNumber);	
		}	
	}
		
	private void updateOrderStatusAfterPaidWithTx(INcpSession session, String orderNumber, PayType payType, BigDecimal payPrice, Date payTime, String tradeNumber) throws Exception{
		Session dbSession = this.getDBSession(); 
		Transaction tx = null;
		try{  
			tx = dbSession.beginTransaction();
			this.updateOrderStatusAfterPaid(session, orderNumber, payType, payPrice, payTime, tradeNumber);
			tx.commit(); 
		}
		catch(Exception ex){ 
			if(tx != null){
				tx.rollback();
			}
			throw ex;
		} 	
	}
	
	//判断 移动端/PC端
	public boolean isMobileBrowser(HttpServletRequest request) {
		List<String> mobileAgents = Arrays.asList("ipad", "iphone os", "rv:1.2.3.4", "ucweb", "android", "windows ce", "windows mobile");
		String ua = request.getHeader("User-Agent").toLowerCase();
		for (String sua : mobileAgents) {
			if (ua.indexOf(sua) > -1) {
				return true;//手机端
			}
		}	
		return false;//PC端
	} 
	
	//是否微信浏览器
	public boolean isWechatBrowser(HttpServletRequest request) {
		String ua = request.getHeader("User-Agent").toLowerCase();
        if (ua.indexOf("micromessenger") > -1) {
        	return true;//微信
     	}
        return false;//非微信手机浏览器      
   	} 
	
	public String getAliPayFormHtml(INcpSession session, String orderId, HttpServletRequest request) throws Exception{
		String orderNumber = "";
		BigDecimal payPrice = new BigDecimal(0);
		String subjectInfo = "";
		String bodyInfo = "";
		try{
			JSONObject orderObj = this.getOrderMainInfo(session, orderId);
			if(orderObj == null){
				NcpException ncpEx = new NcpException("getAliPayFormHtml_NoneOrder", "不存在此订单, 可能的原因: 1.订单号不存在; 2.当前用户不是订单所有者; 3.订单不是未支付状态.");
				throw ncpEx;
			}
			else{
				orderNumber = orderObj.getString("orderNumber");
				payPrice = BigDecimal.valueOf(Double.valueOf(orderObj.getString("payPrice")));		
				subjectInfo = orderObj.getString("subjectInfo");	
				bodyInfo = orderObj.getString("bodyInfo");
			}
			
		}
		catch(Exception ex){
			throw ex;
		} 
 
		try{ 
			AliPayProcessor payProcessor = this.getAliPayProcessor();	 
			payProcessor.setDBSession(this.getDBSession());
			String payFormHtml = "";
			if(payPrice.doubleValue() == 0){
				payFormHtml = this.GetPayFormHtmlForFreeOrder(session, orderId, orderNumber);
			}
			else{
				if(this.isMobileBrowser(request)){
					payFormHtml = payProcessor.GetPayFormMobileHtml(orderId, orderNumber, payPrice, subjectInfo, bodyInfo);
				}
				else{
					payFormHtml = payProcessor.GetPayFormPCHtml(orderId, orderNumber, payPrice, subjectInfo, bodyInfo);
				}
			}
			return payFormHtml;
		}
		catch(Exception ex){
			throw ex;
		} 
	}
	
	private String GetPayFormHtmlForFreeOrder(INcpSession session, String orderId, String orderNumber) throws Exception {
		this.payFreeOrderStatus(session, orderNumber);
		String html = "<script>window.location = \"order.jsp?id=" + orderId + "\";</script>";
		return html;
	}

	
	public void modifyOrderStatusAfterAliApid(INcpSession session, Map<String, String> returnParameters) throws Exception{
		try{
			//商户订单号
			String orderNumber = returnParameters.get("out_trade_no");
			
			//支付宝交易号
			String tradeNumber = returnParameters.get("trade_no");
			
			//付款金额
			String totalAmount = returnParameters.get("total_amount");
			BigDecimal paidAmount = new BigDecimal(totalAmount);
			
			Date payTime = new Date();
			
			this.updateOrderStatusAfterPaidWithTx(session, orderNumber, PayType.Alipay, paidAmount, payTime, tradeNumber);  
		}
		catch(Exception ex){
			throw ex; 
		}
	}
	
	public void payFreeOrderStatus(INcpSession session, String orderNumber) throws Exception{
		try{ 
			Date payTime = new Date();
			BigDecimal paidAmount = new BigDecimal(0);			
			this.updateOrderStatusAfterPaidWithTx(session, orderNumber, PayType.ForFree, paidAmount, payTime, "");  
		}
		catch(Exception ex){
			throw ex; 
		}
	}

	
	public void checkAlipayReturnInfo(INcpSession session, Map<String, String> returnParameters) throws Exception{
		try{
			AliPayProcessor payProcessor = this.getAliPayProcessor();	 
			
			//商户订单号
			String orderNumber = returnParameters.get("out_trade_no");
			
			//支付宝交易号
			String trade_no = returnParameters.get("trade_no");
			
			//付款金额
			String total_amount = returnParameters.get("total_amount");
			BigDecimal paidAmount = new BigDecimal(total_amount);
			
			JSONObject orderObj = this.getOrderMainInfoByOrderNumber(session, orderNumber);
			BigDecimal payPrice = BigDecimal.valueOf(Double.valueOf(orderObj.getString("payPrice")));
			if(paidAmount.compareTo(payPrice) == 0){
				OrderStatusType orderStatus = OrderStatusType.valueOf(orderObj.getString("status"));
				if(orderStatus != OrderStatusType.Paid){
					throw new Exception("订单状态校验失败, 当前订单状态为'" + this.getOrderStatusName(orderStatus) + "'");
				} 
			}
			else{
				throw new Exception("付款失败, 待付款金额为￥" + total_amount + "，付款金额为￥" + payPrice.toString());
			} 
		}
		catch(Exception ex){
			throw ex; 
		}
	}
	
	public String getOrderStatusName(OrderStatusType status) throws Exception{
		 switch(status){
		 case Creating:
			 return "正在创建";
		 case WaitingPay:
			 return "等待付款";
		 case Paying:
			 return "正在支付";
		 case Paid:
			 return "已付款";
		 case Deleted:
			 return "已取消";
		 default:
			 throw new Exception("Unknown Order Status Type, status = " + status.toString());
		 }
	}

	
	public boolean rsaCheckAliV1(INcpSession session, Map<String, String> returnParameters) throws Exception{
		try{
			AliPayProcessor payProcessor = this.getAliPayProcessor();	
			boolean signVerified = payProcessor.rsaCheckV1(returnParameters); 
			return signVerified;
		}
		catch(Exception ex){
			throw ex; 
		}
	}
	
	private EncrypDES encrypDes = null;
	public EncrypDES getEncrypDes() {
		return encrypDes;
	}
	public void setEncrypDes(EncrypDES encrypDes) {
		this.encrypDes = encrypDes;
	}
	
	public String getExportFileDownloadUrlQueryString(String orderLineId, String definitionId, String definitionName, String fileName) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException{
		try{
			EncrypDES de1 = this.getEncrypDes();
			Date nowTime = new Date();
			//String timeStr = ValueConverter.dateTimeToString(nowTime, "yyyyMMddHHmmssSSS") + "|" + definitionId + "|" + fileName;	
			String timeStr = "20180927171333333" + "_" + definitionId + "_" + fileName;	
			byte[] bytes = de1.Encrytor(timeStr);
			String t = Base64.getEncoder().encodeToString(bytes); 
			String url = "olid=" + orderLineId + "&fn=" + URLEncoder.encode(definitionName, "utf-8") + "&t=" + URLEncoder.encode(t, "utf-8");
			return url;
		}
		catch(Exception ex){
			ex.printStackTrace();
			logger.error(ex.getMessage());
			throw ex;
		}
	}

	public String[] checkDownloadUrl(String t) throws Exception{
		EncrypDES de1 = this.getEncrypDes();
		byte[] tBytes = Base64.getDecoder().decode(t);
		byte[] decBytes = de1.Decryptor(tBytes);
		String fullStr = new String(decBytes, "utf-8");
		String[] strParts = fullStr.split("_");
		String timeStr = strParts[0]; 
		Date nowTime = new Date();
		Date urlTime = ValueConverter.convertToTime(timeStr, "yyyyMMddHHmmssSSS");		
		long spanMilliseconds = nowTime.getTime() - urlTime.getTime();
		if(spanMilliseconds < 0 &&  spanMilliseconds > 30 * 60 * 1000){
			throw new Exception("下载地址已过期, 请登录系统后重新获取下载地址");
		}
		else{
			return strParts;
		}
	}

	
	public String getOrderLineExportFileName(INcpSession session, String orderLineId) throws Exception {
		String getOrderDetailSql = "select eol.exportfilename as exportfilename "
			+ "from dm_exportorderline eol "
			+ "where eol.id = " +SysConfig.getParamPrefix() + "orderLineId ";
		HashMap<String, Object> dP2vs = new HashMap<String, Object>();
		dP2vs.put("orderLineId", orderLineId); 
		
		String fileName = (String) this.dBParserAccess.selectOne(getDBSession(), getOrderDetailSql, dP2vs);
		return fileName;
	}
}
