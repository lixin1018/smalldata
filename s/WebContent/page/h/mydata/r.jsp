<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %> 
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %> 
<%@ page import="com.novacloud.novaone.dataFile.control.DataFileControl" %> 
<%@ page import="java.lang.Exception" %>
<%@ include file="../../basePage.jsp" %>
		
<%
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId(); 
	DataFileControl dataFileControl = (DataFileControl)ContextUtil.getBean("dataFileControl");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>已接收-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">   
	<link rel="stylesheet" type="text/css" href="css/list.css">  
	<link rel="stylesheet" type="text/css" href="css/r.css"> 
	<script type="text/javascript" src="${paramWinModel}/myDataReceiveParam.js"></script> 
	<script type="text/javascript" src="js/r.js"></script> 
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../home/headerA.jsp">
			<jsp:param value="wjxx" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpaceBottomBorder"></div>	 
	<div id="pageContentDiv" class="pageContent rPageContent">
		<div class="rMain"> 
			<%

				String pageIndexStr = request.getParameter("p"); 
				String fromUser = CommonFunction.decode(request.getParameter("fromUser"));
				String toUser = CommonFunction.decode(request.getParameter("toUser"));
				String receiveDateStr = request.getParameter("receiveDate");
				String fileName = CommonFunction.decode(request.getParameter("fileName"));
				String message = CommonFunction.decode(request.getParameter("message"));
				Date receiveDate = null;
				if(receiveDateStr != null && receiveDateStr.length() != 0){
					receiveDate = ValueConverter.convertToDate(receiveDateStr, "yyyy-MM-dd");
				}

				
				String filterPathStr = "toUserId=" + (request.getParameter("fromUser") == null ? "" : request.getParameter("fromUser"))
				+  "&toUser=" + (request.getParameter("toUser") == null ? "" : request.getParameter("toUser"))
				+  "&receiveDate=" + (request.getParameter("receiveDate") == null ? "" : request.getParameter("receiveDate"))
				+  "&fileName=" + (request.getParameter("fileName") == null ? "" : request.getParameter("fileName"))
				+  "&message=" + (request.getParameter("message") == null ? "" : request.getParameter("message"));
			
			
				int count = dataFileControl.getReceiveInfoCount(ncpSession, fromUser, toUser, receiveDate, fileName, message); 

				int pageIndex = ValueConverter.CheckDecimal(pageIndexStr) ? ValueConverter.convertToDecimal(pageIndexStr, "").intValue() : 1;
				
				int onePageRowCount = 20;
				int pageIndexBtnCount = 5;
				int pageIndexBtnHalfCount = pageIndexBtnCount / 2;
				int fromIndex = (pageIndex - 1) * onePageRowCount;
				int pageCount = count / onePageRowCount + (count % onePageRowCount > 0 ? 1 : 0); 					
				
				List<DataRow> rows = null;
				if(count != 0){ 
					rows = dataFileControl.getReceiveInfos(ncpSession, fromUser, toUser, receiveDate, fileName, message, fromIndex, onePageRowCount);
				} 
			%>	
			<div id="innerDiv" class="rInnerDiv">
				<div class="rInfoContainer">	
					<div class="rTitleContainer">
						<div class="rTitle">已接收<span>&nbsp;|&nbsp;<a href="s.jsp">查看已发送</a></span></div> 
						<div class="rFilterContainer" id="paramWinId">
							<table class="rFilterTable" cellpadding="0" cellspacing="0">
								<tr>
									<td>&nbsp;</td> 
									<td class="rFilterTitleFromUser">发送人:</td>
									<td class="rFilterInputFromUserDiv"><input class="rFilterInputFromUser" name="fromuser" paramCtrl="true" /></td>
									<td class="rFilterTitleToUser">接收人:</td>
									<td class="rFilterInputToUserDiv"><input class="rFilterInputToUser" name="touser" paramCtrl="true" /></td>
									<td class="rFilterTitleFileName">文件名:</td>
									<td class="rFilterInputFileNameDiv"><input class="rFilterInputFileName" name="filename" paramCtrl="true" /></td>
									<td class="rFilterTitleMessage">留言:</td>
									<td class="rFilterInputMessageDiv"><input class="rFilterInputMessage" name="message" paramCtrl="true" /></td>
									<td class="rFilterTitleReceiveDate">日期:</td>
									<td class="rFilterInputReceiveDateDiv"><input class="rFilterInputReceiveDate" name="receivedate" paramCtrl="true" /></td>
									<td class="rFilterBtnContainer"><a class="rFilterQueryBtn" name="queryUserBtn" >查&nbsp;询</a></td>
								</tr>
							</table>
						</div>  
					</div>			
				<%
					if(count != 0){
				%>			
					<div class="rColumnTitleContainer">
						<div class="rColumnTitleFromUser">发送人</div>
						<div class="rColumnTitleToUser">接收人</div>
						<div class="rColumnTitleFileName">文件名</div>
						<div class="rColumnTitleReceiveTime">接收时间</div>
						<div class="rColumnTitleMessage">留言</div>
						<div class="rColumnTitleStatus">状态</div>
						<div class="rColumnTitleOperate">操作</div>
					</div>	
					<div class="rItemListContainer">
				<%
					for(int i = 0; i < rows.size(); i++){
						DataRow row = rows.get(i);
						String id = row.getStringValue("id"); 
						boolean hasBringBack = row.getBooleanValue("hasbringback");
						String fromUserNameStr = StringEscapeUtils.escapeHtml(row.getStringValue("fromusername"));  
						String fromUserEmailStr = StringEscapeUtils.escapeHtml(row.getStringValue("fromuseremail"));  
						String toUserNames = hasBringBack ? "" : StringEscapeUtils.escapeHtml(row.getStringValue("tousernames")); 
						String toUserEmails = hasBringBack ? "" : StringEscapeUtils.escapeHtml(row.getStringValue("touseremails")); 
						String fileNames = hasBringBack? "" : StringEscapeUtils.escapeHtml(row.getStringValue("filenames")); 
						String receiveTimeStr = ValueConverter.dateTimeToString(row.getDateTimeValue("receivetime"), "yyyy-MM-dd HH:mm");
						String messageContent = hasBringBack ? "" : StringEscapeUtils.escapeHtml(row.getStringValue("message")); 
						String status = hasBringBack ? "已取回" : (row.getBooleanValue("hasread") ? "已读" : "未读");
				%>
						<div class="detailLine">
							<div class="detailLineFromUserName" title="<%=fromUserNameStr%>(<%=fromUserEmailStr%>>)"><span>发送人:&nbsp;</span><%=fromUserNameStr%></div>
							<div class="detailLineToUserNames" title="<%=toUserNames%>(<%=toUserEmails%>>)"><span>接收人:&nbsp;</span><%=toUserNames%></div>
							<div class="detailLineFileNames" title="<%=fileNames%>"><%=fileNames%></div>
							<div class="detailLineReceiveTime"><span>接收时间:&nbsp;</span><%=receiveTimeStr%></div>
							<div class="detailLineMessage" title="<%=messageContent%>"><span>留言:&nbsp;</span><%=messageContent%></div>
							<div class="detailLineStatus"><span>状态:&nbsp;</span><%=status%></div>
							<div class="detailLineOperate">
								<a href="ri.jsp?r=<%=id%>" target="_blank">查看详情</a>
							</div>
						</div>
				<%
					}
				%>
						<div class="navigatorContainer">
							<div class="pageIndexContainer">
								<div class="pageItem">&nbsp;</div>
								<%
									if(pageCount > pageIndexBtnCount && pageIndex > 1){
										String pageUrl = "r.jsp?&p=1&" + filterPathStr;
									%>
									<div class="pageIndexItem pageIndexFirst"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">|&lt;</a></div>
									<%
									}
								%>
								<%
									if(pageIndex > 1){
										String pageUrl = "r.jsp?p=" + (pageIndex - 1) + "&" + filterPathStr;
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
											String pageUrl = "r.jsp?p=" + (p) + "&" + filterPathStr;
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
										String pageUrl = "r.jsp?p=" + (pageIndex + 1) + "&" + filterPathStr;
									%> 
									<div class="pageIndexItem pageIndexNext"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;</a></div>
									<%
									}
								%>  
								<%
									if(pageCount > pageIndexBtnCount && pageIndex < pageCount){
										String pageUrl = "r.jsp?p=" + pageCount + "&" + filterPathStr;
									%>
									<div class="pageIndexItem pageIndexLast"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;|</a></div>
									<%
									}
								%>
								<div class="pageCount">第<%=pageIndex%>页, 共<%=pageCount%>页</div>
							</div>
						</div>
					</div>
				<%
				}
				else{
				%>
					<div class="rNoneItem">
							没有找到符合条件的发送信息
					</div>
				<%
				}				
				%>
				</div> 
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>