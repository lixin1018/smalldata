<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.control.ExeControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.ExeConfig" %> 
<%@ include file="../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml"> 
<head> 
	<title>NLP测试</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<script type="text/javascript" src="js/nlpTest.js"></script> 
</head>
<body class="easyui-layout" style="width: 100%; height: 100%;">	
	<div data-options="region:'center',border:false">
		<div class="easyui-tabs" data-options="fit:true,plain:true">
			<div title="标准分词" >  		
				<div class="easyui-layout" sheetPart="event" data-options="fit:true" > 
					<div data-options="region:'center',border:false">   
						<textarea id="textInputId" style="width:100%;height:200px;">今天是星期几啊？</textarea>
						<input type="button" id="segmentBtnId" value="执行标准分词" />
						<textarea id="wordsShowId" style="width:100%;height:400px"></textarea> 
					</div>
				</div> 
			</div>
		</div>
	</div>
</body>
</html>