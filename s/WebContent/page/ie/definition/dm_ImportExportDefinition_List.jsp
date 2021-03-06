﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>数据列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/dm_ImportExportDefinition.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportDefinition.js"></script>
	
	<script> 
	var grid = null; 
	
	//操作按钮列的名称
	var operateColumnName = "operateColumn";
			
	//获取操作按钮单元格内容html
	function getLinkHtml(rowId){
		var row = grid.datatable.getRowByIdField(rowId, "id"); 
		var code = row.getValue("code"); 
		var name = row.getValue("name"); 
		var html = "<a href=\"#\" target=\"blank\" style=\"line-height:24px;\" onclick=\"return clickLink('" + code + "', '" + name + "')\">编辑数据 </a>";
		return html;
	}
	
	//操作按钮列ID
	function getCellContainerId(rowId){
		return operateColumnName + "_" + rowId;
	}
	
	//手工刷新操作按钮列内容
	function clickLink(code, name){
		window.parent.iocClient.mainPageTab().showPage("editData:" + code, "编辑:" + name, "../ie/editPages/edit_" + code + ".jsp", true); 
		return false;
	}

	//从模型中增加操作按钮列
	viewModels.dm_ImportExportDefinition.colModel.push({name:operateColumnName,
		label:"操作",
		width:100,
		hidden:false,
		sortable:false, 
		search:false,
		resizable:true,
		editable:false,
		canEdit:false,
		formatter:function(cellvalue, options, rowObject){
			var html = getLinkHtml(rowObject.id);
			var containerId = getCellContainerId(rowObject.id);
			return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
		}
	});
	$(document).ready(function(){ 
		var p = { 
			containerId:"testGridContainer",   
			multiselect:true,  
			dataModel:dataModels.dm_ImportExportDefinition,
			onePageRowCount:20,
			isRefreshAfterSave:false,
			viewModel:viewModels.dm_ImportExportDefinition 
		};
		grid = new NcpGrid(p); 
		grid.show();
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>