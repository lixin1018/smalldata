<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.dataHelper.control.DataShareControl" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>数据共享-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/sjgx.css"> 
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="sjgx" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpaceTopBorder"></div>	
	<div id="pageContentDiv" class="pageContent">
		<%    
			DataShareControl dataShareCtrl = (DataShareControl)ContextUtil.getBean("dataShareControl");
			JSONArray categoryArray = dataShareCtrl.getCategoryList();
			int categoryIndex = 0;
			for(Object categoryObj : categoryArray){
				JSONObject categoryJson = (JSONObject)categoryObj;
				String categoryId = categoryJson.getString("id");
				String categoryName = CommonFunction.decode(categoryJson.getString("name"));
				String categoryCode = CommonFunction.decode(categoryJson.getString("code"));
				String categoryUrl = "list.jsp?code=" + categoryCode;
				JSONArray dataListArray = categoryJson.getJSONArray("dataList");
		%>
		<%
			if(categoryIndex % 3 == 0){
		%>
		<div class="sectionBlankSpace"></div>
		<%
			if(categoryIndex != 0){
		%>
		<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>
		<%
			}
		%>
		<div id="categoryListDiv" class="categoryListContaienr">
		<%
			}
		%>
			<div class="categoryBlock">
				<div class="categoryHeader" categoryCode="<%=categoryCode%>">
				<a href="<%=categoryUrl%>" class="categoryNameLink" target="_self"><%=categoryName%></a>
				<a href="<%=categoryUrl%>" class="categoryMoreLink" target="_self">More&gt;&gt;</a>
				</div>
				<ul class="categoryList">
					<%
					int count = dataListArray.size() > 6 ? 6 : dataListArray.size();
					for(int i = 0; i < count; i++){
						Object dataObj = dataListArray.get(i);
						JSONObject dataJson = (JSONObject)dataObj;
						String dataId = dataJson.getString("id");
						String dataName = CommonFunction.decode(dataJson.getString("name"));
						String dataCode = CommonFunction.decode(dataJson.getString("code"));
						String tableName = dataJson.getString("tableName");
						String lastUpdateTime = CommonFunction.decode(dataJson.getString("lastUpdateTime"));
					%>
						<li class="categoryItem" dataCode="<%=dataCode%>"><a class="categoryLinkItem" href="../../ie/queryPages/<%=tableName%>.jsp" target="_blank"><%=dataName%></a><span class="serviceItemTime"><%=lastUpdateTime%></span></li>
					<%
					}
					%>
				</ul>
			</div>
		
		<%
			if(categoryIndex % 3 != 2){
		%>
			<div class="serviceListBlockBorder"></div>			
		<%
			}
			else{
		%>
		</div>
		<%
			}
		%>
		<%
			categoryIndex++;
		}
       	%>     
	</div>
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>