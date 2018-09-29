﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.math.BigDecimal" %>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ page import="com.novacloud.novaone.dao.db.ValueType" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.dataHelper.control.BuyControl" %>
<%@ page import="com.novacloud.dataHelper.buy.OrderStatusType" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.novacloud.dataHelper.export.ExportStatusType" %>
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
		<jsp:include  page="headerA.jsp">
			<jsp:param value="订单详情" name="subTitle"/>
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
						<div class="orderItemColumnTitleOperate">操作</div>
					</div>
					<%
						for(int j = 0; j < orderLineArray.size(); j++){
							JSONObject orderLineObj = orderLineArray.getJSONObject(j);
							String orderLineId = orderLineObj.getString("id");
							String definitionId = CommonFunction.decode(orderLineObj.getString("definitionId")); 
							String definitionName = CommonFunction.decode(orderLineObj.getString("definitionName"));  
							String dbTableName = CommonFunction.decode(orderLineObj.getString("dbTableName"));  
							String dataFilter = CommonFunction.decode(orderLineObj.getString("dataFilter"));  
							String originalPrice = orderLineObj.getString("originalPrice");    
							String actualPrice = orderLineObj.getString("actualPrice");    
							String newRowCount = orderLineObj.getString("newRowCount");    
							int totalRowCount = Integer.parseInt(orderLineObj.getString("totalRowCount"));    
							String unitPrice = orderLineObj.getString("unitPrice");     
							String exportLog = orderLineObj.getString("exportLog");    
							Date exportStartTime = (Date)ValueConverter.convertToObject(orderLineObj.getString("exportStartTime"), ValueType.Time);   
							int exportedRowCount = Integer.parseInt(orderLineObj.getString("exportedRowCount"));   
							ExportStatusType exportStatus = ExportStatusType.valueOf(orderLineObj.getString("exportStatus"));
							String exportFileName = orderLineObj.getString("exportFileName");    
							
							String operateInfo = "";
							if(status == OrderStatusType.Paid){
								switch(exportStatus){
									case WaitingExport:
										operateInfo = "正在排队等待, 请稍后刷新界面";
										break;
									case Exporting:
										if(exportedRowCount > 0){
											Date nowTime = new Date();
											double remainTotalMilliseconds = ( nowTime.getTime() - exportStartTime.getTime()) * ((double)totalRowCount - (double)exportedRowCount) / (double)exportedRowCount;
											long remainTotalSeconds = (long)Math.ceil(remainTotalMilliseconds / (double)1000);
											long remainSeconds =  remainTotalSeconds % 60;
											long remainTotalMinutes =  Math.floorDiv(remainTotalSeconds, 60);
											long remainMinutes =  remainTotalMinutes % 60;
											long remainTotalHours =  Math.floorDiv(remainTotalMinutes, 60);
											operateInfo = "正在生成数据文件, 剩余时间 " + (remainTotalHours == 0 ? "" : (remainTotalHours + "小时"))  +  remainMinutes + "分钟" +  remainSeconds + "秒";											
										}
										else{
											operateInfo = "马上开始生成数据文件, 请稍后刷新界面";
										}
										break;
									case Exported:		
										String downloadUrl = "../../../order/export?" + buyControl.getExportFileDownloadUrlQueryString(orderLineId, definitionId, definitionName, exportFileName);
										operateInfo = "<a href=\"" + downloadUrl + "\" target=\"_blank\">点击此处下载数据文件</a>";
										break;
									case Error:
										operateInfo = "生成数据文件出错: " + exportLog;
										break;
								}
							}

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
						<div class="orderLineOperate" ><%=operateInfo%></div>   
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