﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>创建模板-第二步:上传Excel文档</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../css/subMenu.css"> 
	<script type="text/javascript" src="../../js/siteCommon.js"></script> 
	<link rel="stylesheet" type="text/css" href="css/create.css">
	<script type="text/javascript" src="js/validateExcel.js"></script> 

</head>
<body> 
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../../home/header.jsp">
			<jsp:param value="sjtb" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:760px;width:100%;background-color:#ffffff;text-align:center;">
		<div class="pagePathContainer">			
			<div class="pagePathInner">
				<a class="pagePathNameLink" href="../home/index.jsp" target="_self">首页</a> &gt;
				<a class="pagePathNameLink" href="../rwgl.jsp" target="_self">任务管理</a> &gt;
				<span class="pathPathNameText">表格模板定义</span> 
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../../rwgl/subMenu.jsp">
					<jsp:param value="teamDefinitionList" name="subMenuName"/>
				</jsp:include>
			</div>			
			<div style="position:absolute;left:200px;width:1000px;height:600px;" id = "testGridContainer">
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
			</div> 
		</div> 
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../../common/footer.html"%>
	</div>
</body>
</html>