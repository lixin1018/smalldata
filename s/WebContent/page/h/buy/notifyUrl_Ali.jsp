<%@ page language="java" contentType="text/html; charset=utf-8"	pageEncoding="utf-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.dataHelper.control.BuyControl" %>
<%
	//功能：支付宝服务器同步通知页面  
	//获取支付宝GET过来反馈信息
	Map<String,String> params = new HashMap<String,String>();
	Map<String,String[]> requestParams = request.getParameterMap();
	for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
		String name = (String) iter.next();
		String[] values = (String[]) requestParams.get(name);
		String valueStr = "";
		for (int i = 0; i < values.length; i++) {
			valueStr = (i == values.length - 1) ? valueStr + values[i]
					: valueStr + values[i] + ",";
		}
		//乱码解决，这段代码在出现乱码时使用
		//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
		params.put(name, valueStr);
	}

	BuyControl buyControl = (BuyControl)ContextUtil.getBean("dataHelperBuyControl");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, false);
	try{
		buyControl.modifyOrderStatusAfterAliApid(ncpSession, params); 
		out.println("success");
	}
	catch(Exception ex){
		ex.printStackTrace();
		out.println("fail");
	}
%>