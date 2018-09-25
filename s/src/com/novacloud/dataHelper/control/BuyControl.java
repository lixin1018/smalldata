package com.novacloud.dataHelper.control;
 
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.buy.AliPayProcessor;
import com.novacloud.dataHelper.buy.BuyProcessor;
import com.novacloud.dataHelper.buy.OrderStatusType;
import com.novacloud.dataHelper.buy.PayType;
import com.novacloud.dataHelper.buy.WeixinPayProcessor; 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.opensymphony.xwork2.ActionSupport;  
 
public class BuyControl{

  	private static Logger logger=Logger.getLogger(BuyControl.class); 

	
	private HibernateTransactionManager transactionManager; 
	public void setTransactionManager(HibernateTransactionManager transactionManager) {
		this.transactionManager = transactionManager;
	}   
	 
	protected Session openDBSession() throws SQLException{ 
		return this.transactionManager.getSessionFactory().openSession(); 
	}
	
	private BuyProcessor buyProcessor;
	public void setBuyProcessor(BuyProcessor buyProcessor){
		this.buyProcessor = buyProcessor;
	}
	private BuyProcessor getBuyProcessor(){
		return this.buyProcessor;
	}
	
	public JSONObject getCartList(INcpSession ncpSession) throws Exception{
		logger.info("getCartList");
		Session dbSession = null;
		try{
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONObject cartListObj = buyProcessor.getCartList(ncpSession);  
			return cartListObj;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}

	public JSONObject getOrderList(INcpSession ncpSession, int pageIndex, int orderListOnePageNum) throws Exception{
		logger.info("getOrderList");
		Session dbSession = null;
		try{
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONObject orderListObj = buyProcessor.getOrderList(ncpSession, pageIndex, orderListOnePageNum);  
			return orderListObj;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}
	
	public JSONArray getOrderLines(INcpSession ncpSession, String orderId) throws Exception{
		logger.info("getOrderList");
		Session dbSession = null;
		try{
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONArray orderLineArray = buyProcessor.getOrderLines(ncpSession, orderId);  
			return orderLineArray;
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
	}
	
	public JSONObject getOrderDetail(INcpSession ncpSession, String orderId) throws Exception{
		logger.info("getOrderDetail");
		if(orderId== null || orderId.length() == 0){
			return null;
		}
		else{
			Session dbSession = null;
			try{
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				JSONObject orderObj = buyProcessor.getOrderDetail(ncpSession, orderId);  
				return orderObj;
			}
			catch(Exception ex){
				throw ex;
			}
			finally{
				if(dbSession != null){
					dbSession.close();
				}
			} 
		}
	}
	
	public JSONObject getOrderMainInfo(INcpSession ncpSession, String orderId) throws Exception{
		logger.info("getOrderMainInfo");
		if(orderId== null || orderId.length() == 0){
			return null;
		}
		else{
			Session dbSession = null;
			try{
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				JSONObject orderObj = buyProcessor.getOrderMainInfo(ncpSession, orderId);  
				return orderObj;
			}
			catch(Exception ex){
				throw ex;
			}
			finally{
				if(dbSession != null){
					dbSession.close();
				}
			} 
		}
	}
	
	public JSONObject getOrderMainInfoByOrderNumber(INcpSession ncpSession, String orderNumber) throws Exception{
		logger.info("getOrderMainInfoByOrderNumber");
		if(orderNumber== null || orderNumber.length() == 0){
			return null;
		}
		else{
			Session dbSession = null;
			try{
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				JSONObject orderObj = buyProcessor.getOrderMainInfoByOrderNumber(ncpSession, orderNumber);  
				return orderObj;
			}
			catch(Exception ex){
				throw ex;
			}
			finally{
				if(dbSession != null){
					dbSession.close();
				}
			} 
		}
	}

	
	public String getOrderIdByOrderNumber(INcpSession ncpSession, String orderNumber) throws Exception{
		logger.info("getOrderMainInfoByOrderNumber");
		if(orderNumber== null || orderNumber.length() == 0){
			return null;
		}
		else{
			Session dbSession = null;
			try{
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				JSONObject orderObj = buyProcessor.getOrderMainInfoByOrderNumber(ncpSession, orderNumber);  
				return orderObj == null ? null : orderObj.getString("id");
			}
			catch(Exception ex){
				throw ex;
			}
			finally{
				if(dbSession != null){
					dbSession.close();
				}
			} 
		}
	}

	
	public String getAliPayFormHtml(INcpSession ncpSession, String  orderId) throws NcpException	{
		Session dbSession = null;
		try{     
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			String payFormHtml = buyProcessor.getAliPayFormHtml(ncpSession, orderId);  
			return payFormHtml;
		} 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getAliPayFormHtml", "获取支付宝支付页面Html失败", ex); 
			throw ncpEx;
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}  
	}
	
	public void modifyOrderStatusAfterAliApid(INcpSession session, Map<String, String> returnParameters) throws NcpException	{
		Session dbSession = null;
		try{     
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			if(buyProcessor.rsaCheckAliV1(session, returnParameters)){	
				buyProcessor.modifyOrderStatusAfterAliApid(session, returnParameters);
			}
			else{
				Exception ex = new Exception("rsaCheckAliV1 验证Alipay返回值出错"); 
				throw ex;
			}
		} 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getAliPayFormHtml", "获取支付宝支付页面Html失败", ex); 
			throw ncpEx;
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}  
	}
	
	public void checkAliPayReturnInfo(INcpSession session, Map<String, String> returnParameters) throws NcpException	{
		Session dbSession = null;
		try{     
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			if(buyProcessor.rsaCheckAliV1(session, returnParameters)){	
				buyProcessor.checkAlipayReturnInfo(session, returnParameters);
			}
			else{
				Exception ex = new Exception("rsaCheckAliV1 验证Alipay返回值出错"); 
				throw ex;
			}
		} 
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("checkAliPayReturnInfo", "订单状态验证失败", ex); 
			throw ncpEx;
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		}  
	}

	
	public String getOrderStatusName(OrderStatusType status) throws Exception{
		BuyProcessor buyProcessor =  this.getBuyProcessor();
		return buyProcessor.getOrderStatusName(status);
	}
}