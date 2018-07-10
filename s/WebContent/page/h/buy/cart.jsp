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
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/cart.css">
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
	<script type="text/javascript" src="js/cart.js"></script>	
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
			<div class="headerBottomInner">
				<div class="headerLeftBottom" style="width:240px;">
					<a href="../../../"><img class="headerLogo" src="../../h/images/logo.png" /></a> 
					<span class="headerSysName">数据助理</span>
					<span class="headerSysSubName">Power Data Helper</span>
				</div>
				<div class="headerRightBottom" style="left:260px;">
					<div class="pageHeaderTitle">购物车</div> 
				</div>
			</div>	  			
		</div>	
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div id="pageContentDiv" class="pageContent">
		<div id="cartContaienrDiv" class="cartContaienr">
			<div style="width:100%;height:40px;background-color:#E3EEFF;position:relative;font-size:13px;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;color:#666666;">
				<input type="checkbox" checked="checked" id="selectAllCheckboxId" style="position:absolute;top:10px;left:12px;width:15px;height:15px;" />
				<span style="position:absolute;top:12px;left:35px;width:40px;height:20px;">全选</span>
				<span style="position:absolute;top:12px;left:80px;width:80px;height:20px;">名称</span>
				<span style="position:absolute;top:12px;left:400px;width:80px;height:20px;">数据筛选条件</span>
				<span style="position:absolute;top:12px;right:350px;width:80px;height:20px;text-align:right;">单价(元/条)</span>
				<span style="position:absolute;top:12px;right:250px;width:80px;height:20px;text-align:right;">数量(条)</span>
				<span style="position:absolute;top:12px;right:150px;width:80px;height:20px;text-align:right;">小计(元)</span>
				<span style="position:absolute;top:12px;right:0px;width:100px;height:20px;text-align:left;">操作</span>
			</div>
			<div class="sectionBlankSpace"></div>
				<% 
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
				<div style="width:100%;height:50px;position:relative;font-size:13px;border:solid 1px #eeeeee;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;color:#666666;">
					<div style="position:absolute;top:2px;right:150px;width:180px;height:20px;text-align:right;">合计:&nbsp;<span id="totalPriceId" style="font-size:16px;color:#FE6000;font-weight:600;">?</span></div>
					<div style="position:absolute;top:27px;right:150px;width:240px;height:20px;text-align:right;">请点击结算, 更多优惠价格等着您</div>
					<div id="toPayPage" style="position:absolute;top:0px;right:0px;width:120px;bottom:0px;text-align:center;line-height:50px;font-size:16px;background-color:#FF4400;color:#ffffff;cursor:pointer;">结&nbsp;算</div>
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