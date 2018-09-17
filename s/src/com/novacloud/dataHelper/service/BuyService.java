package com.novacloud.dataHelper.service;
 
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.novacloud.dataHelper.buy.BuyProcessor;
import com.novacloud.dataHelper.user.UserProcessor;
import com.novacloud.novaone.common.INcpSession;
import com.novacloud.novaone.common.JSONProcessor;
import com.novacloud.novaone.common.NcpActionSupport;
import com.novacloud.novaone.common.NcpException;
import com.novacloud.novaone.common.NcpSession;
import com.novacloud.novaone.common.ServiceResultProcessor;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.opensymphony.xwork2.ActionSupport;
 
public class BuyService extends NcpActionSupport implements IBuyService {

  	private static Logger logger=Logger.getLogger(BuyService.class); 

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
		
	@Override
	public String getUnitPrice() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String definitionId = requestObj.getString("definitionId");
			
			NcpSession session = new NcpSession(this.getHttpSession(), false); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			BigDecimal unitPrice = buyProcessor.getUnitPrice(session, definitionId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			if(unitPrice == null){	
				resultHash.put("unitPrice", null);
			}
			else{
				DecimalFormat df = new DecimalFormat("#0.0000000");	
				String unitPriceStr = df.format(unitPrice);
				while(unitPriceStr.endsWith("0")){
					unitPriceStr = unitPriceStr.substring(0, unitPriceStr.length() - 1);
				}
				if(unitPriceStr.endsWith(".")){
					unitPriceStr = unitPriceStr.substring(0, unitPriceStr.length() - 1);
				}
				resultHash.put("unitPrice", unitPriceStr);
			}
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getUnitPrice100", "获取单价失败", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String addToCart() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String definitionId = requestObj.getString("definitionId"); 
			JSONArray dataFilterArray = requestObj.getJSONArray("dataFilter");
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			buyProcessor.addToCart(session, definitionId, dataFilterArray);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("addToCart100", "放入购物车失败", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String removeFromCart() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String cartLineId = requestObj.getString("cartLineId");  
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			buyProcessor.removeFromCart(session, cartLineId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("addToCart100", "添加到购物车", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String generateOrder() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			JSONArray cartLineArray = requestObj.getJSONArray("cartLines");
			List<String> cartLineIds = new ArrayList<String>();
			if(cartLineArray.size() == 0){
				NcpException ncpEx = new NcpException("generateOrder_noneCartLine", "未选定数据商品");
				throw ncpEx;				
			}
			else{
				for(int i = 0; i < cartLineArray.size(); i++){
					JSONObject cartLineObj = cartLineArray.getJSONObject(i);
					String cartLineId = cartLineObj.getString("id");
					cartLineIds.add(cartLineId);
				} 
				
				NcpSession session = new NcpSession(this.getHttpSession(), false); 
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				String orderId = buyProcessor.generateOrderWithTx(session, cartLineIds);
				
				HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
				resultHash.put("orderId", orderId);
				String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
				this.addResponse(resultString); 	 	
			}
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("generateOrder100", "生成订单", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String closeOrder() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String orderId = requestObj.getString("orderId");  
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			buyProcessor.closeOrderWithTx(session, orderId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("closeOrder100", "关闭订单", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String getOrderDetail() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			String orderId = requestObj.getString("orderId");  
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONObject orderObj = buyProcessor.getOrderDetail(session, orderId);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("orderDetail", orderObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getOrderDetail100", "获取订单信息出错", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String getOrderList() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);		

			JSONObject requestObj = JSONProcessor.strToJSON(requestParam);
			int pageIndex = requestObj.getInt("page");  
			int orderListOnePageNum = requestObj.getInt("orderlistonepagenum");  
			
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONObject orderListObj = buyProcessor.getOrderList(session, pageIndex, orderListOnePageNum);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("orderList", orderListObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getOrderList100", "获取订单列表出错", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}	
	
	@Override
	public String getCartList() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);
			NcpSession session = new NcpSession(this.getHttpSession(), true); 
			BuyProcessor buyProcessor =  this.getBuyProcessor();
			dbSession = this.openDBSession();
			buyProcessor.setDBSession(dbSession);
			JSONObject cartListObj = buyProcessor.getCartList(session);
			
			HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
			resultHash.put("cartList", cartListObj);
			String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
			this.addResponse(resultString); 	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getCartList100", "获取购物车信息出错", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;		
	}
	
	@Override
	public String getCartLineCount() throws Exception{ 
		Session dbSession = null;
		try{
			logger.info(requestParam);
			NcpSession session = new NcpSession(this.getHttpSession(), false); 
			if(session.getIsOnline()){
				BuyProcessor buyProcessor =  this.getBuyProcessor();
				dbSession = this.openDBSession();
				buyProcessor.setDBSession(dbSession);
				int clCount = buyProcessor.getCartLineCount(session);
				
				HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
				resultHash.put("cartLineCount", clCount);
				String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);	
				this.addResponse(resultString); 
			}
			else{
				HashMap<String, Object> resultHash = new HashMap<String, Object>(); 
				resultHash.put("cartLineCount", null);
				String resultString = ServiceResultProcessor.createJsonResultStr(resultHash);
				this.addResponse(resultString); 
			}	 	 
		}
		catch(NcpException ex) {
			this.addResponse(ex.toJsonString()); 	 	 
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			NcpException ncpEx = new NcpException("getCartLineCount100", "获取购物车商品数出错", ex);
			this.addResponse(ncpEx.toJsonString()); 	 	 
		} 
		finally{
			if(dbSession != null){
				dbSession.close();
			}
		} 
		return ActionSupport.SUCCESS;	
	}
	
	
}