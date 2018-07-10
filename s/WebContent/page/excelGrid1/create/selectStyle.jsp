<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>ExcelGrid定义列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/selectStyle.js"></script> 
	
	<script>  
	</script>
</head>
<body> 
	<div class="createExcelGridNavigator" id="createExcelGridNavigatorId">
		<div class="createExcelGridTitleDiv">
			<span class="createExcelGridTitle">第一步: 请选择新建模板的方式</span>
		</div>
		<div class="createExcelGridStyleItem" id="createByImportExcelBtnId"><h3>从Excel导入</h3><span>上传本地的Excel文档, 导入后可以对模板做调整</span></div>
		<div class="createExcelGridStyleItem" id="createByBlankDefinitionBtnId"><h3>打开空白模板</h3><span>直接在空白模板中设计你的模板</span></div>
	</div>  
</body>
</html>