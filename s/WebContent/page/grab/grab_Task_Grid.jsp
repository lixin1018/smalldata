<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>抓取任务定义</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/grab_TaskDef.js"></script>
	<script type="text/javascript" src="${viewModel}/grab_TaskDef.js"></script>
	<script type="text/javascript" src="${dataModel}/grab_StepDef.js"></script>
	<script type="text/javascript" src="${viewModel}/grab_StepDef.js"></script>
	<script type="text/javascript" src="${sheetModel}/taskDef.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.grab_TaskDef,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.grab_TaskDef,
				sheetModel:sheetModels.taskDef,
				detailPageUrl:"grab_Task_Sheet.jsp"
			};
			var win = new NcpMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl;  
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" >	
		<span class="ncpGridToolbar">
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a> 
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</span> 
		<span class="ncpGridSearchBar">
			<input id="searchCtrl" name="searchCtrl" class="easyui-searchbox" style="width: 110px;" data-options="prompt:'模糊查询'"></input>
		</span> 
		<span class="ncpGridComplexQueryBar">
			<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
		</span>	
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   
		<table name="gridCtrl" ></table> 
	</div>
</body>	 
</html>