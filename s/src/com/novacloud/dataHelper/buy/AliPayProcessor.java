package com.novacloud.dataHelper.buy;

import java.io.BufferedReader; 
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.math.BigDecimal;
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
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.novacloud.novaone.common.NcpException;

import net.sf.json.JSONObject; 

public class AliPayProcessor extends PayProcessor {
  	private static Logger logger=Logger.getLogger(AliPayProcessor.class);  
  	
	private String orderName = "";
	public String getOrderName() {
		return orderName;
	}
	public void setOrderName(String orderName) {
		this.orderName = orderName;
	} 
	
	//URL	支付宝网关（固定）	https://openapi.alipay.com/gateway.do
	private String alipayGetwayUrl = "https://openapi.alipay.com/gateway.do";
	public String getAlipayGetwayUrl() {
		return alipayGetwayUrl;
	}
	public void setAlipayGetwayUrl(String alipayGetwayUrl) {
		this.alipayGetwayUrl = alipayGetwayUrl;
	}
	
	//APPID	APPID 即创建应用后生成	获取见上面创建应用
	private String appId ="";
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	
	//APP_PRIVATE_KEY	开发者私钥，由开发者自己生成	获取详见上面配置密钥
	private String appPrivateKey = "";
	public String getAppPrivateKey() {
		return appPrivateKey;
	}
	public void setAppPrivateKey(String appPrivateKey) {
		this.appPrivateKey = appPrivateKey;
	}
	
	//FORMAT	参数返回格式，只支持json	json（固定）
	private String format = "json"; 
	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	
	//CHARSET	编码集，支持GBK/UTF-8	开发者根据实际工程编码配置
	private String charset ="UTF-8";
	public String getCharset() {
		return charset;
	}
	public void setCharset(String charset) {
		this.charset = charset;
	}
	
	//ALIPAY_PUBLIC_KEY	支付宝公钥，由支付宝生成	获取详见上面配置密钥
	private String alipayPublicKey = "";
	public String getAlipayPublicKey() {
		return alipayPublicKey;
	}
	public void setAlipayPublicKey(String alipayPublicKey) {
		this.alipayPublicKey = alipayPublicKey;
	}
	
	//SIGN_TYPE	商户生成签名字符串所使用的签名算法类型，目前支持RSA2和RSA，推荐使用RSA2	RSA2
	private String signType = "RSA2";
	public String getSignType() {
		return signType;
	}
	public void setSignType(String signType) {
		this.signType = signType;
	}
	
	public String GetPayFormHtml(String orderId, String orderNumber, BigDecimal payPrice) {
		
		AlipayClient alipayClient = new DefaultAlipayClient(this.getAlipayGetwayUrl(),
				this.getAppId(),
				this.getAppPrivateKey(),
				this.getFormat(),
				this.getCharset(),
				this.getAlipayPublicKey(),
				this.getSignType());
		AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();//创建API对应的request
	    alipayRequest.setReturnUrl("http://domain.com/CallBack/return_url.jsp");
	    alipayRequest.setNotifyUrl("http://domain.com/CallBack/notify_url.jsp");//在公共参数中设置回跳和通知地址
	    String bizJson = "{" +
		        "    \"out_trade_no\":\"" + orderNumber + "\"," +
		        "    \"product_code\":\"" + orderNumber + "\"," +
		        "    \"total_amount\":" + payPrice.toString() + "," +
		        "    \"subject\":\"" + orderNumber + "\"," +
		        "    \"body\":\"" + orderNumber + "\"," +
		        "    \"passback_params\":\"orderNo%3d" + orderNumber + "\"," +
		        "    \"extend_params\":{}" +
		        "  }";
	    
	    alipayRequest.setBizContent(bizJson);//填充业务参数
	    String form="";
	    try {
	        form = alipayClient.pageExecute(alipayRequest).getBody(); //调用SDK生成表单
	    } catch (AlipayApiException e) {
	        e.printStackTrace();
	    } 
		return form;
	}
}
