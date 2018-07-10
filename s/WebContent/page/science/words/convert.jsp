<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.control.ExeControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.ExeConfig" %> 
<%@ include file="../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml"> 
<head> 
	<title>字库转TXT</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<script type="text/javascript" src="js/convert.js"></script> 
</head>
<body class="easyui-layout" style="width: 100%; height: 100%;">	
	<div data-options="region:'center',border:false">
		<div class="easyui-tabs" data-options="fit:true,plain:true">
			<div title="字库转TXT" >  		
				<div class="easyui-layout" sheetPart="event" data-options="fit:true" > 
					<div data-options="region:'center',border:false">   
						<textarea id="fromFilePath" style="width:100%;height:200px;">E:\Work\NCP\教育\专业词库\计算机词汇大全【官方推荐】.scel</textarea>
						<textarea id="toFilePath" style="width:100%;height:200px;">E:\Work\NCP\教育\专业词库\计算机词汇大全【官方推荐】.txt</textarea>
						<input type="button" id="convertBtnId" value="执行" /> 
					</div>
				</div> 
			</div>
		</div>
	</div>
</body>
</html>