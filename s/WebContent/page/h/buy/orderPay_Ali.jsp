<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.dataHelper.control.BuyControl" %>
<%@ page import="com.novacloud.dataHelper.buy.OrderStatusType" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %>
<%@ include file="../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>收银台-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/orderPay.css">
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="headerA.jsp">
			<jsp:param value="收银台" name="subTitle"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpaceTopBorder"></div>
	<div class="sectionBlankSpace"></div>
	<div id="pageContentDiv" class="pageContent">
		<div id="orderContaienrDiv" class="orderContaienr"> 
			<% 
				HttpSession httpSession = request.getSession();
				NcpSession ncpSession = new NcpSession(httpSession, false);
				if(!ncpSession.getIsOnline()){ 
			%>
			<div class="alertOrderError">请登录后查看订单详情</div>			
			<%
				}
				else { 
					String orderId = request.getParameter("id");  
					
					BuyControl buyControl = (BuyControl)ContextUtil.getBean("dataHelperBuyControl");
					JSONObject orderObj = buyControl.getOrderMainInfo(ncpSession, orderId); 
					if(orderObj == null){
			%>
			<div class="alertOrderError">无订单信息!</div>
			<%
					}
					else {
						String orderNumber = orderObj.getString("orderNumber");  
						String payPrice = orderObj.getString("payPrice");  
						OrderStatusType status = OrderStatusType.valueOf(orderObj.getString("status"));
						String statusName = buyControl.getOrderStatusName(status);  
						if(status != OrderStatusType.WaitingPay){
			%>
			<div class="alertOrderError">不能继续支付, 当前订单状态为"<%=statusName%>"</div>
			<%
						}
						else {
							String payPageHtml = "";
							try{
								payPageHtml = buyControl.getAliPayFormHtml(ncpSession, orderId, request); 
							}
							catch(Exception ex){
								String errorMessage = ex.getMessage();
			%>
			<div class="alertOrderError"><%=errorMessage%></div>
			<%
							}
							if(payPageHtml.length() > 0){ 
			%>
			<div class="orderSection">
				<div class="orderItem" orderId="<%=orderId%>"> 
					<div class="orderItemTitle" orderId="<%=orderId%>"> 
						<div class="orderItemTitleOrderNumber">订单号: <%=orderNumber%></div> 
						<div class="orderItemTitlePayPrice">应付金额: ￥<%=payPrice%></div> 
					</div>
				</div>
				<div class="orderItemSpaceBorder"></div>
				<div class="payTypeSection">
					<div class="payTypeCurrent">
						支付宝支付
					</div> 
					<div class="paySectionLine"></div>
					<div class="payCodeSection">
						<%=payPageHtml%>
					</div>
				</div>
			</div>
			<%
							}
						}
					}
				}
			%>
			
		</div> 
	</div>
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>