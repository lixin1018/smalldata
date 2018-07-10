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
	<script type="text/javascript" src="js/validateExcel.js"></script> 
</head>
<body>	 
	<div class="createExcelGridNavigator" id="createExcelGridNavigatorId">
		<div class="createExcelGridTitleDiv">
			<span class="createExcelGridTitle">第三步: 请选择要导入的Sheet页</span>
			<a class="createExcelGridBackToBegin" href="selectStyle.jsp">返回到第一步</a>
		</div>
		<div class="sheetNameContainerDiv" id="sheetNameContainerDivId">
			<div class="sheetNameItem">正在读取Excel中包含的所有Sheet页名称</div> 
		</div>
		<div class="validateExcelSheetBtnDiv" id="validateExcelSheetBtnDivId">生成模板</div>		
	</div>  
</body>
</html>