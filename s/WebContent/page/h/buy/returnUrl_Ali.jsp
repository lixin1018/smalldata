<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Alipay支付-支付状态</title>
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">   
</head>
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
	boolean succeed = false;
	String message = "";
	if(!ncpSession.getIsOnline()){ 
		succeed = false;
		message = "请登录系统!";
	}
	else{
		try{
			buyControl.checkAliPayReturnInfo(ncpSession, params);
			String orderNumber = params.get("out_trade_no");
			String orderId = buyControl.getOrderIdByOrderNumber(ncpSession, orderNumber);
			
			message = "支付成功! <a style=\"text-decoration: underline;color:#ff6700;\" href=\"order.jsp?id=" + orderId + "\">查看订单详情及下载数据</a>";
			succeed = true;
		}
		catch(Exception ex){
			ex.printStackTrace();
			message = "支付失败! " + ex.getMessage();
			succeed = false;
		}
	}
%>

<body style="border: 0;margin: 0;padding: 0;width: 100%;height: 100%;"> 
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="" name="menuName"/>
		</jsp:include>
	</div> 
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>
	<div id="pageContentDiv" class="pageContent" style="height:480px;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="position:absolute;text-align:center;width:100%;height:30px;top: 100px;font-size:14px;">
			<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
				<div style="position:absolute;text-align:center;width:100%;height:30px;top: 200px;font-size:20px;">
				 <%=message%>
				</div> 
			</div> 
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>