<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.math.BigDecimal" %>
<%@ page import="java.text.DecimalFormat" %>
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
	<title>订单详情-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/order.css">
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
						&nbsp;&nbsp;|&nbsp;&nbsp;
						<a href="../../h/buy/cart.jsp" class="toCartLink">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<img src="../../h/buy/images/cart.png" class="toCartImage" title="进入购入车页面"/>
							<div id="cartLineCountSpanId" class="toCartLineCount">(?)</div>
						</a>
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
					<div class="pageHeaderTitle">订单详情</div> 
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
					JSONObject orderObj = buyControl.getOrderDetail(ncpSession, orderId);  
					JSONArray orderLineArray = orderObj.getJSONArray("lines"); 
					if(orderObj == null){
			%>
			<div class="alertOrderError">无订单信息!</div>
			<%
					}
					else {
			%>
			<div class="orderSection">
			<%    
						String orderNumber = orderObj.getString("orderNumber"); 
						String orderCreateTime = orderObj.getString("createTime"); 
						String createUserName = orderObj.getString("createUserName"); 
						String originalTotalPrice = orderObj.getString("originalTotalPrice");  
						String actualTotalPrice = orderObj.getString("actualTotalPrice"); 
						
						//String payPrice = orderObj.getString("payPrice"); 
						BigDecimal payPriceNum = new BigDecimal(orderObj.getString("payPrice"));
						DecimalFormat df1 = new DecimalFormat("0.00");
						String payPrice = df1.format(payPriceNum);
						
						String payTime = orderObj.getString("payTime"); 
						OrderStatusType status = OrderStatusType.valueOf(orderObj.getString("status"));
						String statusName = buyControl.getOrderStatusName(status);  				

						String payPageUrl = "orderPay_Ali.jsp?id=" + orderId;			
			%>
				<div class="orderItem" orderId="<%=orderId%>"> 
					<div class="orderItemTitle" orderId="<%=orderId%>"> 
						<div class="orderItemTitleOrderNumber">订单号: <%=orderNumber%></div> 
						<div class="orderItemTitleCreateTime">下单时间: <%=orderCreateTime%></div> 
						<div class="orderItemTitleCreateUserName">买家: <%=createUserName%></div>  
						  
						<%
						if(status == OrderStatusType.Paid){
							%> 
						<div class="orderItemTitleStatusName">订单状态: <%=statusName%></div>
						<div class="orderItemTitlePayTime">付款时间: <%=payTime%></div> 
							<%
						}
						else if(status == OrderStatusType.WaitingPay){
							%> 
						<div class="orderItemTitleStatusName">订单状态: <%=statusName%>&nbsp;&nbsp;<a href="<%=payPageUrl%>" class="orderItemTitleToPayPage" target="_self">去支付</a></div> 
							<%
						}
						else{
							%>
						<div class="orderItemTitleStatusName">订单状态: <%=statusName%></div>
							<%
						}
						%>
					</div>
					<div class="orderItemColumnTitle"> 
						<div class="orderItemColumnTitleDefinitionName">数据描述</div> 
						<div class="orderItemColumnTitleUnitPrice">单价</div> 
						<div class="orderItemColumnTitleTotalRowCount">记录数(条)</div> 
						<div class="orderItemColumnTitleNewRowCount">本次付费记录数(条)</div> 
						<div class="orderItemColumnTitleActualPrice">小计(元)</div>
					</div>
					<%
						for(int j = 0; j < orderLineArray.size(); j++){
							JSONObject orderLineObj = orderLineArray.getJSONObject(j);
							String orderLineId = orderLineObj.getString("id");
							String definitionName = CommonFunction.decode(orderLineObj.getString("definitionName"));  
							String dbTableName = CommonFunction.decode(orderLineObj.getString("dbTableName"));  
							String dataFilter = CommonFunction.decode(orderLineObj.getString("dataFilter"));  
							String originalPrice = orderLineObj.getString("originalPrice");    
							String actualPrice = orderLineObj.getString("actualPrice");    
							String newRowCount = orderLineObj.getString("newRowCount");    
							String totalRowCount = orderLineObj.getString("totalRowCount");    
							String unitPrice = orderLineObj.getString("unitPrice");    

							JSONArray dataFilterArray = JSONArray.fromObject(dataFilter);
							StringBuilder dataFilterSS = new StringBuilder();
							StringBuilder urlParameterSS = new StringBuilder(); 
							for(int k = 0; k < dataFilterArray.size(); k++){
								JSONObject dataFilterObj = dataFilterArray.getJSONObject(k);
								String field = dataFilterObj.getString("field");
								String title = dataFilterObj.getString("title");
								String value = dataFilterObj.getString("value");
								dataFilterSS.append(title + ": " + value + ";&nbsp;");
								urlParameterSS.append(k == 0 ? "?" : "&");
								urlParameterSS.append("q_" + field + "=" + CommonFunction.encode(value));
							}
							String pageUrl = "../../ie/queryPages/ie_" + dbTableName + ".jsp" + urlParameterSS.toString();
							String dataFilterStr = dataFilterSS.length() == 0 ? "全部数据" : dataFilterSS.toString(); 
					%>
					<div class="orderLine" orderId="<%=orderId%>" orderLineId="<%=orderLineId%>">  
						<a href="<%=pageUrl%>" class="orderLineDefinitionName" target="_blank"><%=definitionName%>&nbsp;(<%=dataFilterStr%>)</a>  
						<div class="orderLineUnitPrice" >￥<%=unitPrice%></div>   
						<div class="orderLineTotalRowCount" ><%=totalRowCount%></div>  
						<div class="orderLineNewRowCount" ><%=newRowCount%></div>  
						<div class="orderLineActualPrice" >￥<%=actualPrice%></div>   
					</div>
					
					<%
						}
					%>
					<div class="orderItemBottom">
						<div class="orderItemBottomActualTotalPrice">总价: ￥<%=actualTotalPrice%></div>
						<div class="orderItemBottomPayPrice">实付款: ￥<%=payPrice%></div>
					<%
						if(status == OrderStatusType.WaitingPay){
					%>
						<a href="<%=payPageUrl%>" class="orderItemBottomToPayPage" target="_self">支&nbsp;付</a>
					<%
						}
					%>
					</div>
				</div>
				<div class="orderItemSpaceBorder"></div>
			</div>
			<%
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