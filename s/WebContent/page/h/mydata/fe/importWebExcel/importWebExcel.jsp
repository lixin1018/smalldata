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
	<title><%=exeName%>-第一步:上传Excel文档</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../../css/subMenu.css"> 
	<script type="text/javascript" src="../../../js/siteCommon.js"></script> 
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadify.css">
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadifive.css">
	<script type="text/javascript" src="${uploadify}/swfobject.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadify.min.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadifive.min.js"></script>
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/uploadExcel.js"></script> 
</head>
<body>  
	<input type="hidden" id="exeId" value="<%=exeId %>" />
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="width:100%;position:relative;height:100%;margin:1px auto;">
 			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer">
				<div class="createExcelGridNavigator" id="createExcelGridNavigatorId">
					<div class="createExcelGridTitleDiv">
						<span class="createExcelGridTitle">第一步: 上传Excel文档</span> 
					</div>
					<div class="createExcelGridStyleUpload">			
				        <div class="selectExcelDiv">
				        	<input type="file" name="uploadify" id="selectExcelBtnId" />
			        		<span class="selectExcelPromptDiv">请选择要上传的Excel文件(文件大小不能超过20M)</span>
			        	</div>		       	
						<div id="fileQueueDivId"></div>
						<div class="selectErrorDiv" id="selectErrorDivId"></div>
						<div class="uploadExcelBtnDiv" id="uploadExcelBtnDivId">执行上传</div>		        
					</div> 
				</div> 
			</div> 
		</div> 
	</div>  
</body>
</html>