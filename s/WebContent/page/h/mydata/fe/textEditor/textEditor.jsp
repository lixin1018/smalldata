<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ include file="basePageText.jsp" %>
<%
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>文本编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	 
	<link rel="stylesheet" type="text/css" href="${pagePath}/h/css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="css/textEditor.css">  
	<script type="text/javascript" src="js/textLayout.js"></script> 
	<script type="text/javascript" src="js/text.js"></script> 
</head>  

<body class="easyui-layout" id="bodyContainerId"> 
	<div data-options="region:'north',border:false" style="height:60px;">
		<div class="headerTop">  
			<jsp:include  page="../../headerTop.jsp">
				<jsp:param value="mydata" name="menuName"/>
			</jsp:include> 
		</div> 
		<div class="headerBottom">
			<div class="titleBar"> 
				<div class="titleBarInner">
					<span id="titleContainerId"></span>
				</div> 
			</div>  
			<div class="headerRightTop">   
				<input type="hidden" id="instanceIdHiddenInputId" value="" />
				<span class="toolbarSaveBtn">
					<a id="saveInstanceBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">保存</a>
				</span>
				<span class="toolbarTitleBtn">
				<a id="titleBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-property'">标题</a>
				</span>
			</div>	  			
		</div> 
	</div>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   	
 		<textarea style="width:100%;height:100%;" id="textContainerId"></textarea>
	</div>  
</body>	 
</html>