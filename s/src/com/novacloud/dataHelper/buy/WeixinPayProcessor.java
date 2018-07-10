package com.novacloud.dataHelper.buy;

import java.io.BufferedReader; 
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader; 
import java.net.URL;
import java.net.URLConnection; 
import java.util.Arrays; 
import java.util.HashMap;
import java.util.List;
import java.util.Random; 
import javax.xml.parsers.ParserConfigurationException;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader; 

import com.Ostermiller.util.MD5;
import com.novacloud.novaone.common.NcpException;

import net.sf.json.JSONObject; 

public class WeixinPayProcessor extends PayProcessor {
  	private static Logger logger=Logger.getLogger(WeixinPayProcessor.class); 
  	
  	//生成预支付交易单请求地址
  	private String requestUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	public String getRequestUrl() {
		return requestUrl;
	}
	public void setRequestUrl(String requestUrl) {
		this.requestUrl = requestUrl;
	}  	

	private String apiKey="";
	public String getApiKey() {
		return apiKey;
	}
	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}
	
  	//公众账号ID
  	private String appId = "wx4582997ce0e636f6";
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}

	//商户号	
	private String merchantId = "";
	public String getMerchantId() {
		return merchantId;
	}
	public void setMerchantId(String merchantId) {
		this.merchantId = merchantId;
	}

	private String deviceInfo = "";
	public String getDeviceInfo() {
		return deviceInfo;
	}
	public void setDeviceInfo(String deviceInfo) {
		this.deviceInfo = deviceInfo;
	}
	
	private String orderName = "";
	public String getOrderName() {
		return orderName;
	}
	public void setOrderName(String orderName) {
		this.orderName = orderName;
	}
	
	private String spbillCreateIp = "";
	public String getSpbillCreateIp() {
		return spbillCreateIp;
	}
	public void setSpbillCreateIp(String spbillCreateIp) {
		this.spbillCreateIp = spbillCreateIp;
	}

	private String notifyUrl = "";
	public String getNotifyUrl() {
		return notifyUrl;
	}
	public void setNotifyUrl(String notifyUrl) {
		this.notifyUrl = notifyUrl;
	}

	private String tradeType = "";
	public String getTradeType() {
		return tradeType;
	}
	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}

	private static Random random = new Random(1000); 
	
	private HashMap<String, String> getRequestParameters(String orderId, String orderNumber, Integer payPrice) throws ParserConfigurationException, DocumentException{
		HashMap<String, String> parameters = new HashMap<String, String>();
		parameters.put("appid", this.getAppId());
		parameters.put("mch_id", this.getMerchantId());
		parameters.put("device_info", this.getDeviceInfo());

        String nonceStr = String.format("%031d", random.nextInt());
		parameters.put("nonce_str", nonceStr);
		parameters.put("body", this.getOrderName());
		parameters.put("out_trade_no", orderNumber);
		parameters.put("total_fee", payPrice.toString());
		parameters.put("spbill_create_ip", this.getSpbillCreateIp());
		parameters.put("notify_url", this.getNotifyUrl());
		parameters.put("trade_type", this.getTradeType());
		
		String sign = this.sign(parameters);
		parameters.put("sign", sign);
		
		return parameters;
	}
	
	private String sign(HashMap<String, String> parameters){
		
		String[] pNames = new String[]{"appid", "mch_id", "device_info", "nonce_str", "body", "out_trade_no", "total_fee", "spbill_create_ip", "notify_url", "trade_type"};
		Arrays.sort(pNames);
		StringBuilder ss = new StringBuilder();
		for(int i = 0; i < pNames.length; i++){
			if(i > 0){
				ss.append("&");
			}
			String pName = pNames[i];
			String pValue = parameters.get(pName);
			ss.append(pName + "=" + pValue);
		}
		
		String apiKey = "";//key设置路径：微信商户平台(r.weixin.qq.com)-->账户设置-->API安全-->密钥设置;
		
		return MD5.getHashString(ss.toString() + "&key=" + apiKey);
	}
	
	private String getRequestParameters(HashMap<String, String> parameters) throws ParserConfigurationException, DocumentException{
		String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><xml></xml>"; 
		SAXReader reader = new SAXReader(); 
		Document document = reader.read(new StringReader(xml));  
		Element rootElement = document.getRootElement();
		
        String[] pNames = new String[]{"appid", "mch_id", "device_info", "nonce_str", "body", "out_trade_no", "total_fee", "spbill_create_ip", "notify_url", "trade_type", "sign"};
        for(int i = 0; i < pNames.length; i++){ 
			String pName = pNames[i];
			String pValue = parameters.get(pName);

	        Element element = rootElement.addElement(pName);
	        element.setText(pValue); 
		}
        return rootElement.asXML();
	}
	
	public JSONObject generateUnifiedOrderFromWeixin(String orderId, String orderNumber, Integer payPrice) throws Exception{
		String requestXml = "";
		String responseXml = "";
		try{
			HashMap<String, String> requestParameters = this.getRequestParameters(orderId, orderNumber, payPrice);
			requestXml = this.getRequestParameters(requestParameters);
			logger.info(requestXml);
			
			responseXml = this.sendPost(this.getRequestUrl(), requestXml);	
			logger.info(responseXml);	
			HashMap<String, String> responseInfos = this.getResponseInfo(responseXml);
			
			String returnCode = responseInfos.get("return_code");
			if("SUCCESS".equals(returnCode)){
				if(!this.compareVales(requestParameters, responseInfos, "appid")){
					NcpException ncpEx = new NcpException("unifiedOrder_appid", "返回信息中的appid不正确");
					throw ncpEx;
				}
				if(!this.compareVales(requestParameters, responseInfos, "mch_id")){ 
					NcpException ncpEx = new NcpException("unifiedOrder_mch_id", "返回信息中的mch_id不正确");
					throw ncpEx;
				}
				if(!this.compareVales(requestParameters, responseInfos, "device_info")){  
					NcpException ncpEx = new NcpException("unifiedOrder_device_info", "返回信息中的device_info不正确");
					throw ncpEx;
				}
				if(!this.compareVales(requestParameters, responseInfos, "nonce_str")){   
					NcpException ncpEx = new NcpException("unifiedOrder_nonce_str", "返回信息中的nonce_str不正确");
					throw ncpEx;
				}
				if(!this.compareVales(requestParameters, responseInfos, "sign")){   
					NcpException ncpEx = new NcpException("unifiedOrder_sign", "返回信息中的sign不正确");
					throw ncpEx;
				}
				String resultCode = responseInfos.get("result_code");
				if(!resultCode.equals("SUCCESS")){
					String errCode = responseInfos.get("err_code");
					String errCodeDes = responseInfos.get("err_code_des");
					NcpException ncpEx = new NcpException("unifiedOrder_resultError", "err_code:" + errCode +", err_code_des: " + errCodeDes);
					throw ncpEx;
				}				

				String tradeType = responseInfos.get("trade_type");
				String prepayId = responseInfos.get("prepay_id");
				String codeUrl = responseInfos.get("codeUrl");
				
				JSONObject prepayObj = new JSONObject();
				prepayObj.put("tradeType", tradeType);
				prepayObj.put("prepayId", prepayId);
				prepayObj.put("codeUrl", codeUrl);
				
				return prepayObj;
			}
			else{ 
				String returnMsg = responseInfos.get("return_msg");
				NcpException ncpEx = new NcpException("unifiedOrder_errorInfo", returnMsg);
				throw ncpEx;
			}
		}
		catch(Exception ex){
			ex.printStackTrace();
			throw ex;
		}
	}
	
	private boolean compareVales(HashMap<String, String> requestParameters, HashMap<String, String> responseParameters, String parameterName){
		String requestValue = requestParameters.get(parameterName);
		String responseValue = responseParameters.get(parameterName);
		return requestValue.equals(responseValue);
	}
	
	private HashMap<String, String> getResponseInfo(String responseXml) throws DocumentException{ 
		SAXReader reader = new SAXReader(); 
		Document document = reader.read(new StringReader(responseXml));
		//根节点
		Element rootElement = document.getRootElement();
		List<Element> elements = rootElement.elements();
		HashMap<String, String> responseValues = new HashMap<String, String>();
		for(int i = 0; i < elements.size(); i++){
			Element element = elements.get(i);
			String eName = element.getName();
			String eValue = element.getText();
			responseValues.put(eName, eValue);
		}
		return responseValues;
	} 
	
	public String sendPost(String url, String param) throws Exception {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
	    try {
	        URL realUrl = new URL(url);
	        // 打开和URL之间的连接
	        URLConnection conn = realUrl.openConnection();
	        
	        conn.setConnectTimeout(this.getConnectTimeout());
	        conn.setReadTimeout(this.getReadTimeout());
	        
	        // 设置通用的请求属性
	        conn.setRequestProperty("accept", "*/*");
	        conn.setRequestProperty("connection", "Keep-Alive");
	        conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
	        // 发送POST请求必须设置如下两行
	        conn.setDoOutput(true);
	        conn.setDoInput(true);
	        // 获取URLConnection对象对应的输出流
	        out = new PrintWriter(conn.getOutputStream());
	        // 发送请求参数
	        out.print(param);
	        // flush输出流的缓冲
	        out.flush();
	        // 定义BufferedReader输入流来读取URL的响应
	        in = new BufferedReader(
	                new InputStreamReader(conn.getInputStream()));
	        String line;
	        while ((line = in.readLine()) != null) {
	            result += line;
	        }
	    } catch (Exception e) {
	        System.out.println("发送 POST 请求出现异常！"+e);
	        e.printStackTrace();
	        throw e;
	    }
	    //使用finally块来关闭输出流、输入流
	    finally{
	        try{
	            if(out!=null){
	                out.close();
	            }
	            if(in!=null){
	                in.close();
	            }
	        }
	        catch(IOException ex){
	            ex.printStackTrace();
	            throw ex;
	        }
	    }
	    return result;
	}

}
