<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html>
<head> 
	<title>文件上传</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
		
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadify.css">
	<script type="text/javascript" src="${uploadify}/swfobject.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadify.min.js"></script>
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/uploadExcel.js"></script> 
</head>
<body>	 
	<div class="createExcelGridNavigator" id="createExcelGridNavigatorId">
		<div class="createExcelGridTitleDiv">
			<span class="createExcelGridTitle">第二步: 上传Excel文档</span>
			<a class="createExcelGridBackToBegin" href="selectStyle.jsp">返回到第一步</a>
		</div>
		<div class="createExcelGridStyleUpload">			
	        <div class="selectExcelDiv">
	        	<input type="file" name="uploadify" id="selectExcelBtnId" />
        		<span class="selectExcelPromptDiv">请选择要上传的Excel文件(文件大小不能超过2M)</span>
        	</div>		       	
			<div id="fileQueueDivId"></div>
			<div class="selectErrorDiv" id="selectErrorDivId"></div>
			<div class="uploadExcelBtnDiv" id="uploadExcelBtnDivId">执行上传</div>		        
		</div> 
	</div> 
</body>
</html>