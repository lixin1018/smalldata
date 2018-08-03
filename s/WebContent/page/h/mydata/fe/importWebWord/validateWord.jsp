<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.control.ExeControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.ExeConfig" %> 
<%@ include file="../../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<%
	String exeId = request.getParameter("exeid");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();  
	ExeControl exeControl = (ExeControl)ContextUtil.getBean("exeControl"); 
	String exeName = "";
	String exeVersion = "";
	String exeCode = "";
	
	try{
		ExeConfig exeConfig = exeControl.loadConfig(ncpSession, exeId);
		exeCode = exeConfig.getCode(); 
		exeName = exeConfig.getName();
		exeVersion = exeConfig.getVersion();
	}
	catch(Exception ex){
		response.sendRedirect("error.jsp");
	}
%> 
<head> 
	<title><%=exeName %>-第二步:生成在线预览文件</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/validateWord.js"></script> 

</head>
<body>  
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="width:100%;position:relative;height:100%;margin:1px auto;"> 
			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer">
				<div class="createWordNavigator" id="createWordNavigatorId">
					<div class="createWordTitleDiv">
						<span class="createWordTitle">第二步: 生成在线预览文件</span>
						<a class="createWordBackToBegin" href="importWebWord.jsp">返回到第一步</a>
					</div>
					<div class="validateWordBtnDiv" id="validateWordBtnDivId">请等待......</div>	 
				</div>  
			</div> 
		</div> 
	</div>  
</body>
</html>