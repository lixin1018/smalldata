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
	<title>订单列表-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/orderList.css">
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
	<script type="text/javascript" src="js/orderList.js"></script>	
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="headerA.jsp">
			<jsp:param value="订单列表" name="subTitle"/>
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
			<div class="alertOrderListError">请登录后查看订单列表</div>			
			<%
				}
				else { 
					String pageIndexStr = request.getParameter("p");
	
					int pageIndex = 1;
					
					try{
						pageIndex = Integer.parseInt(pageIndexStr);
						if(pageIndex < 1){
							pageIndex = 1;
						}
					}
					catch(Exception ex){
						
					}
					
					int orderListOnePageNum = 5;
					
					BuyControl buyControl = (BuyControl)ContextUtil.getBean("dataHelperBuyControl");
					JSONObject orderListObj = buyControl.getOrderList(ncpSession, pageIndex, orderListOnePageNum);  
					JSONArray orderListArray = orderListObj.getJSONArray("orders");
					int orderCount = orderListObj.getInt("orderCount"); 
					if(orderCount == 0){
			%>
			<div class="alertOrderListError">无订单信息!</div>
			<%
					}
					else {
			%>
			<div class="orderListSection">
			<% 
						int pageIndexBtnCount = 5;
						int pageIndexBtnHalfCount = pageIndexBtnCount / 2;
						int pageCount = orderCount / orderListOnePageNum + (orderCount % orderListOnePageNum > 0 ? 1 : 0);
						if((pageIndex - 1) * orderListOnePageNum > orderCount){
							pageIndex = (orderCount / orderListOnePageNum) + (orderCount % orderListOnePageNum > 0 ? 1 : 0);
						}
						int fromIndex = (pageIndex - 1) * orderListOnePageNum;
						int toIndex = fromIndex + orderListOnePageNum - 1 > orderCount - 1 ? orderCount - 1 : fromIndex + orderListOnePageNum - 1;
						for(int i = 0; i <= toIndex - fromIndex; i++){
							JSONObject dataObject = orderListArray.getJSONObject(i);
							String orderId = dataObject.getString("id");
							String orderNumber = dataObject.getString("orderNumber");
							String orderCreateTime = dataObject.getString("createTime"); 
							String originalTotalPrice = dataObject.getString("originalTotalPrice"); 
							String actualTotalPrice = dataObject.getString("actualTotalPrice"); 
							String payTime = dataObject.getString("payTime"); 
							OrderStatusType status = OrderStatusType.valueOf(dataObject.getString("status"));
							String statusName = buyControl.getOrderStatusName(status);
							
							JSONArray orderLineArray = buyControl.getOrderLines(ncpSession, orderId);		
							String orderPageUrl = "order.jsp?id=" + orderId;
							String payPageUrl = "orderPay_Ali.jsp?id=" + orderId;
							
			%>
				<div class="orderItem" orderId="<%=orderId%>"> 
					<div class="orderItemTitle" orderId="<%=orderId%>"> 
						<div class="orderItemTitleCreateTime"><%=orderCreateTime%></div> 
						<div class="orderItemTitleOrderNumber">订单号: <%=orderNumber%></div> 
					</div>
					<%
						for(int j = 0; j < orderLineArray.size(); j++){
							JSONObject orderLineObj = orderLineArray.getJSONObject(j);
							String orderLineId = orderLineObj.getString("id");
							String definitionName = CommonFunction.decode(orderLineObj.getString("definitionName"));  
							String dataFilter = CommonFunction.decode(orderLineObj.getString("dataFilter"));  
							String dbTableName = orderLineObj.getString("dbTableName");    

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
					</div>
					
					<%
						}
					%>
					<div class="orderItemRight3">
						<div class="orderItemTitleActualTotalPrice">￥<%=actualTotalPrice%></div>
					</div>
					<div class="orderItemRight2">						 
						<%
							if(status == OrderStatusType.Paid){
							 %>
							 	<div class="orderItemTitleStatusName" style="line-height:20px;">
							 		<%=statusName%>
							 		<span class="orderItemTitlePayTime">(<%=payTime%>)</span>
						 		</div>
								 
							<%
							}
							else if(status == OrderStatusType.WaitingPay){
								 %>
								<div class="orderItemTitleStatusName">
							 		<%=statusName%>&nbsp;&nbsp;<a href="<%=payPageUrl%>" class="orderLineToPayPage" target="_blank">去支付/下载数据</a> 
						 		</div>
								<%
							}
							else{
								 %>
								<div class="orderItemTitleStatusName">
							 		<%=statusName%>
						 		</div>
								<%
							}
						%>						
					</div>
					<div class="orderItemRight1">						
						<div class="orderItemTitleOperateContainer">
						<a href="<%=orderPageUrl%>" target="_blank" class="toOrderDetail" orderId="<%=orderId%>">查看详情</a>
						<%
							if(status == OrderStatusType.WaitingPay){
							 %>
								<span class="closeOrder" orderId="<%=orderId%>">取消订单</span>
							<%
							}
						 %>
						</div>
					</div> 
				</div>
				<div class="orderItemSpaceBorder"></div>			
			<%
						}
			%>
			</div> 
			<div class="orderFooterSection">
				<div class="pageIndexContainer">
					<div class="pageItem">&nbsp;</div>
					<%
						if(pageCount > pageIndexBtnCount && pageIndex > 1){
							String pageUrl = "orderList.jsp?p=1";
						%>
						<div class="pageIndexItem pageIndexFirst"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">|&lt;</a></div>
						<%
						}
					%>
					<%
						if(pageIndex > 1){
							String pageUrl = "orderList.jsp?p=" + (pageIndex - 1);
						%> 
						<div class="pageIndexItem pageIndexPrevious"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&lt;</a></div>
						<%
						}
					%> 
					
					<%
						if(pageIndex - pageIndexBtnHalfCount - 1 > 0 && pageCount > pageIndexBtnCount){ 
						%> 
						<div class="pageIndexItem pageIndexOther"><div class="pageIndexText">...</div></div>
						<%
						}
					%>  
					<%
						List<Integer> pageIndexList = new ArrayList<Integer>();
						if(pageCount > pageIndexBtnCount){
							for(int i = pageIndexBtnHalfCount; i > 0; i--){
								int p = pageIndex - i;
								if(p > 0){
									pageIndexList.add(pageIndex - i);
								}
							}
							pageIndexList.add(pageIndex);
							for(int i = 1; i <= pageIndexBtnHalfCount; i++){
								int p = pageIndex + i;
								if(p <= pageCount){
									pageIndexList.add(p);
								}
							} 
						}
						else{ 
							for(int i = 1; i <= pageCount; i++){
								pageIndexList.add(i);
							}								
						}
						for(int i = 0; i < pageIndexList.size(); i++){
							int p = pageIndexList.get(i);
							if(p == pageIndex){
								%>
						<div class="pageIndexItem pageIndexCurrent"><div class="pageIndexText"><%=p%></div></div>
								<%
							}
							else{
								String pageUrl = "orderList.jsp?p=" + (p);
								%>
						<div class="pageIndexItem"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self"><%=p%></a></div>
								<%
							}
						}
						
					%>
					<%
						if(pageCount > pageIndexBtnHalfCount + pageIndex && pageCount > pageIndexBtnCount){ 
						%> 
						<div class="pageIndexItem pageIndexOther"><div class="pageIndexText">...</div></div>
						<%
						}
					%>
					<%
						if(pageIndex < pageCount){
							String pageUrl = "orderList.jsp?p=" + (pageIndex + 1);
						%> 
						<div class="pageIndexItem pageIndexNext"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;</a></div>
						<%
						}
					%>  
					<%
						if(pageCount > pageIndexBtnCount && pageIndex < pageCount){
							String pageUrl = "orderList.jsp?p=" + pageCount;
						%>
						<div class="pageIndexItem pageIndexLast"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;|</a></div>
						<%
						}
					%>
					<div class="pageCount">共<%=pageCount%>页</div>
				</div>
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