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
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/orderPay.css">
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<div class="headerTop">
			<div class="headerTopInner">
				<div id="headerLeftTopDiv" class="headerLeftTop">
				<%				
					HttpSession httpSession = request.getSession();
					NcpSession ncpSession = new NcpSession(httpSession, false);
					if(ncpSession.getIsOnline()){
						String userName = ncpSession.getUserName();
						%>
							<%=userName%>, &nbsp;欢迎使用数据助理&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../home/changePwd.jsp" class="toChangePwd">修改密码</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../home/logout.jsp" class="toLogout">退出</a>
						<%
					}
					else{
						%>
						欢迎使用数据助理, 请&nbsp;<a href="../home/login.jsp" class="toLogin">登录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../home/reg.jsp" class="toReg">注册</a>
						<%
					}
				%>
				</div> 
				<div id="headerRightTopDiv" class="headerRightTop">  
					<div class="toContainer"> 
						<a href="../../h/buy/orderList.jsp" class="toOrderList">我的订单</a>
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a href="../home/help.jsp" class="toHelp">帮助</a>
					</div>
				</div>
			</div> 
		</div>
		<div class="headerBottom">
			<div class="headerBottomInner"">
				<div class="headerLeftBottom" style="width:240px;">
					<a href="../../../"><img class="headerLogo" src="../../h/images/logo.png" /></a> 
					<span class="headerSysName">数据助理</span>
					<span class="headerSysSubName">Power Data Helper</span>
				</div>
				<div class="headerRightBottom" style="left:260px;">
					<div class="pageHeaderTitle">收银台</div> 
				</div>
			</div>	  			
		</div>	
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div id="pageContentDiv" class="pageContent">
		<div id="orderContaienrDiv" class="orderContaienr"> 
			<% 
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
								payPageHtml = buyControl.getAliPayFormHtml(ncpSession, orderId);
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
					<div class="payTypeCurrent" style="left:0px;">
						支付宝支付
					</div>
					<!-- 
					<div class="payTypeOther" style="left:200px;">
						支付宝支付
					</div>
					 -->
					<div class="paySectionLine"></div>
				</div>
				<div class="payCodeSection">
					<%=payPageHtml%>
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