<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %>
<%@ page import="com.novacloud.shuShuo.control.ShuShuoControl" %>
<%@ page import="net.sf.json.JSONArray" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %>
<%@ include file="../../baseSitePage.jsp" %>

<%
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
	
	ShuShuoControl shuShuoControl = (ShuShuoControl)ContextUtil.getBean("shuShuoControl");
	JSONArray dataListArray = shuShuoControl.getSSPlayList(); 
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>数据动画 - GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="GoonData,数据动画">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="css/list.css"> 
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="ss" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpaceTopBorder"></div>	
	<div id="pageContentDiv" class="pageContent">
		<div id="categoryContaienrDiv" class="categoryContaienr"> 
			<!-- 
			<div class="categoryHeaderSection">			
				<div class="categoryNameContainer">
					<a class="categoryNameLink" href="../home/index.jsp" target="_self">首页</a> &gt; 
					数据动画
				</div>	 
			</div> 
			 -->
				<% 
					if(dataListArray == null){
				%>
				<div class="alertCategoryError">获取列表失败!</div>
				<%
					}
					else { 
						int dataCount = dataListArray.size();
						if(dataCount == 0){
				%>
				<div class="alertCategoryError">列表为空!</div>
				<%
						}
						else {
				%>
				<div class="dataListSection">
				<% 
							int onePageItemCount = 10;
							int pageIndexBtnCount = 5;
							int pageIndexBtnHalfCount = pageIndexBtnCount / 2;
							int pageCount = dataCount / onePageItemCount + (dataCount % onePageItemCount > 0 ? 1 : 0);
							if((pageIndex - 1) * onePageItemCount > dataCount){
								pageIndex = (dataCount / onePageItemCount) + (dataCount % onePageItemCount > 0 ? 1 : 0);
							}
							int fromIndex = (pageIndex - 1) * onePageItemCount;
							int toIndex = fromIndex + onePageItemCount - 1 > dataCount - 1 ? dataCount - 1 : fromIndex + onePageItemCount - 1;
							for(int i = fromIndex; i <= toIndex; i++){
								JSONObject dataObject = dataListArray.getJSONObject(i);
								String code = dataObject.getString("code"); 
								String createTime = dataObject.getString("createTime"); 
								String title = CommonFunction.decode(dataObject.getString("title"));
								String description = CommonFunction.decode(dataObject.getString("description")); 
								String tag = CommonFunction.decode(dataObject.getString("tag"));  
								String pageUrl = "../../ss/v/main/play.jsp?code=" + code;
							
				%>
					<div class="dataItem">
						<div class="dataTitle"><a class="dataTitleLink" href="<%=pageUrl%>" target="_blank"><%=title%></a></div>
						<div class="dataTime"><%=createTime%></div>
						<div class="dataDetail"><a class="dataDetailLink" href="<%=pageUrl%>" target="_blank">观看动画</a></div>
						<div class="dataDescription">标签:&nbsp;<%=tag%><br /><%=description%></div> 
					</div>
					<div class="dataItemSpaceBorder"></div>
				<%
							}
				%>
				</div> 
				<div class="categoryFooterSection">
					<div class="pageIndexContainer">
						<div class="pageItem">&nbsp;</div>
						<%
							if(pageCount > pageIndexBtnCount && pageIndex > 1){
								String pageUrl = "list.jsp?p=1";
							%>
							<div class="pageIndexItem pageIndexFirst"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">|&lt;</a></div>
							<%
							}
						%>
						<%
							if(pageIndex > 1){
								String pageUrl = "list.jsp?p=" + (pageIndex - 1);
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
									String pageUrl = "list.jsp?p=" + (p);
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
								String pageUrl = "list.jsp?p=" + (pageIndex + 1);
							%> 
							<div class="pageIndexItem pageIndexNext"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;</a></div>
							<%
							}
						%>  
						<%
							if(pageCount > pageIndexBtnCount && pageIndex < pageCount){
								String pageUrl = "list.jsp?p=" + pageCount;
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