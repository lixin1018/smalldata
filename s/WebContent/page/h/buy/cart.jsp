<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.dataHelper.control.BuyControl" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %>
<%@ include file="../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>购物车-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/cart.css">
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
	<script type="text/javascript" src="js/cart.js"></script>	
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="headerA.jsp">
			<jsp:param value="购物车" name="subTitle"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpaceTopBorder"></div>
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent">
		<div id="cartContaienrDiv" class="cartContaienr">
			<div class="columnTitleDiv">
				<input class="columnTitleSelectAll" type="checkbox" checked="checked" id="selectAllCheckboxId" />
				<span class="columnTitleSelectAllName" >全选</span>
				<span class="columnTitleName" >名称</span>
				<span class="columnTitleFilter">数据筛选条件</span>
				<span class="columnTitleUnitPrice">单价</span>
				<span class="columnTitleAmount">数量</span>
				<span class="columnTitlePrice">金额</span>
				<span class="columnTitleOperate">操作</span>
			</div>
			<div class="sectionBlankSpace"></div>
				<% 
					HttpSession httpSession = request.getSession();
					NcpSession ncpSession = new NcpSession(httpSession, false);
					if(!ncpSession.getIsOnline()){
				%>
				<div class="alertCartError">请登录后查看购物车</div>
				<%
					}
					else {
						BuyControl buyCtrl = (BuyControl)ContextUtil.getBean("dataHelperBuyControl");
						JSONObject cartListObj = buyCtrl.getCartList(ncpSession);
						int cartLineCount = cartListObj.getInt("cartLineCount");
						JSONArray cartLines = cartListObj.getJSONArray("lines"); 
						if(cartLineCount == 0){
				%>
				<div class="alertCartError">购物车内没有任何商品!</div>
				<%
						}
						else {
				%>
				<div class="dataListSection">
				<%   
							for(int i = 0; i < cartLineCount; i++){
								JSONObject dataObject = cartLines.getJSONObject(i);
								String cartLineId = dataObject.getString("id");
								String dataFilter = CommonFunction.decode(dataObject.getString("dataFilter"));
								String definitionId = dataObject.getString("definitionId");  
								String definitionName = CommonFunction.decode(dataObject.getString("definitionName")); 
								String dbTableName = dataObject.getString("dbTableName"); 
								String unitPrice = dataObject.getString("unitPrice"); 
								String price = dataObject.getString("price");  
								String createTime = dataObject.getString("createTime"); 
								String rowCount = dataObject.getString("rowCount"); 
								JSONArray dataFilterArray = JSONArray.fromObject(dataFilter);
								StringBuilder dataFilterSS = new StringBuilder();
								StringBuilder urlParameterSS = new StringBuilder(); 
								for(int j = 0; j < dataFilterArray.size(); j++){
									JSONObject dataFilterObj = dataFilterArray.getJSONObject(j);
									String field = dataFilterObj.getString("field");
									String title = dataFilterObj.getString("title");
									String value = dataFilterObj.getString("value");
									dataFilterSS.append(title + ": " + value + ";&nbsp;");
									urlParameterSS.append(j == 0 ? "?" : "&");
									urlParameterSS.append("q_" + field + "=" + CommonFunction.encode(value));
								}
								String pageUrl = "../../ie/queryPages/ie_" + dbTableName + ".jsp" + urlParameterSS.toString();
								String dataFilterStr = dataFilterSS.length() == 0 ? "全部数据" : dataFilterSS.toString();
							
				%>
					<div class="dataItem dataItemSelected" cartLineId="<%=cartLineId%>">
						<input type="checkbox" class="dataCheckBox" cartLineId="<%=cartLineId%>" checked="checked"/>
						<div class="dataName"><a class="dataNameLink" href="<%=pageUrl%>" target="_blank"><%=definitionName%></a></div>
						<div class="dataFilter"><%=dataFilterStr%></div> 
						<div class="dataUnitPrice" unitPrice="<%=unitPrice%>">￥<%=unitPrice%></div> 
						<div class="dataRowCount" rowCount="<%=rowCount%>"><%=rowCount%></div> 
						<div class="dataPrice" price="<%=price%>">￥<%=price%></div>
						<div class="operateContainer"><span class="removeFromCart" cartLineId="<%=cartLineId%>">删除</span></div> 
					</div>
					<div class="dataItemSpaceBorder" cartLineId="<%=cartLineId%>"></div>			
				<%
							} 
				%>				
				<div class="cartBottomLineDiv">
					<div class="cartTotalPriceDiv">合计:&nbsp;<span id="totalPriceId" class="cartTotalPrice">?</span></div>
					<div class="cartNoteDiv"></div>
					<div id="toPayPage" class="toPayPageDiv">结&nbsp;算</div>
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