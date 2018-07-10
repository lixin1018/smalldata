package com.novacloud.dataHelper.control;
 
import java.math.BigDecimal;
import java.sql.SQLException; 

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.buy.BuyProcessor;
import com.novacloud.dataHelper.buy.OrderStatusType;
import com.novacloud.dataHelper.buy.PayType;
import com.novacloud.dataHelper.buy.WeixinPayProcessor; 
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.NcpException;  
 
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
	
	private WeixinPayProcessor weixinPayProcessor ; 
	public WeixinPayProcessor getWeixinPayProcessor() {
		return weixinPayProcessor;
	}
	public void setWeixinPayProcessor(WeixinPayProcessor weixinPayProcessor) {
		this.weixinPayProcessor = weixinPayProcessor;
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
	
	public String getWeixinPayCodeUrl(INcpSession session, String orderId) throws Exception{
		String orderNumber = "";
		BigDecimal payPrice = new BigDecimal(0); 
		Integer payPriceInt = 0; 
		Session dbSessionBuy = null;
		try{
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSessionBuy = this.openDBSession();
			buyProcessor.setDBSession(dbSessionBuy);
			JSONObject orderObj = buyProcessor.getOrderMainInfo(session, orderId);
			if(orderObj == null){
				NcpException ncpEx = new NcpException("getWeixinPayInfo_noneOrder", "不存在此订单, 可能的原因: 1.订单号不存在; 2.当前用户不是订单所有者; 3.订单不是未支付状态.");
				throw ncpEx;
			}
			else{
				orderNumber = orderObj.getString("orderNumber");
				payPrice = BigDecimal.valueOf(Double.valueOf(orderObj.getString("payPrice")));		
				payPriceInt = payPrice.multiply(BigDecimal.valueOf(100)).intValue();				
			}
			
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSessionBuy != null){
				dbSessionBuy.close();
			}
		} 

		Session dbSessionPay = null;
		try{ 
			WeixinPayProcessor payProcessor = this.getWeixinPayProcessor();	
			dbSessionPay = this.openDBSession();
			payProcessor.setDBSession(dbSessionPay);
			JSONObject prepayObj = payProcessor.generateUnifiedOrderFromWeixin(orderId, orderNumber, payPriceInt);
			String payFlowId = prepayObj.getString("prepayId");
			String payCodeUrl = prepayObj.getString("codeUrl");		
			payProcessor.createPay(session, orderId, payPrice, payCodeUrl, payFlowId, PayType.Weixin);
			return payCodeUrl;		
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			if(dbSessionPay != null){
				dbSessionPay.close();
			}
		} 
	}
}