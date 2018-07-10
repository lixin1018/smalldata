<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>表格模板</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../css/subMenu.css"> 
	<script type="text/javascript" src="../../js/siteCommon.js"></script>
	<script type="text/javascript" src="${dataModel}/eg_Definition.js"></script>
	<script type="text/javascript" src="${viewModel}/eg_Definition.js"></script>
	<script type="text/javascript" src="${dataModel}/eg_DefinitionVersion.js"></script>
	<script type="text/javascript" src="${viewModel}/eg_DefinitionVersion.js"></script>
	<script type="text/javascript" src="${sheetModel}/egDefinition.js"></script>
	<script type="text/javascript" src="js/list.js"></script>
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
			<div class="easyui-layout" style="position:absolute;left:200px;width:1000px;height:600px;" id = "testGridContainer">
				<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">
					<span class="ncpGridToolbar">
						<a id="addNewDefinitionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
					</span>
					<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
				</div>
				<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">
					<table name="gridCtrl" ></table>
				</div>
				<div class="ncpGridToolbarContainer" data-options="region:'south',border:false"> 
					<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
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