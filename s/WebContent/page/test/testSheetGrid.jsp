<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>测试Grid多选</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/test_SheetGridLine1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_SheetGridLine1.js"></script>
	<script type="text/javascript" src="${dataModel}/test_SheetGridLine2.js"></script>
	<script type="text/javascript" src="${viewModel}/test_SheetGridLine2.js"></script>
	<script type="text/javascript" src="${dataModel}/test_SheetGrid.js"></script>
	<script type="text/javascript" src="${viewModel}/test_SheetGrid.js"></script>
	<script type="text/javascript" src="testSheetGrid.js"></script>
	
	<script> 
		var multiValueFields = new Object();
		multiValueFields["customcolumn1"] = {
				name:"customcolumn1",
				childPartSheetName:"line1",
				childDataModelName:"test_SheetGridLine1",
				childFieldName:"value"
			};
		multiValueFields["customcolumn2"] = {
			name:"customcolumn2",
			childPartSheetName:"line2",
			childDataModelName:"test_SheetGridLine2",
			childFieldName:"value"
		}
		 
		$(document).ready(function(){
			
			var p = { 
						containerId:"testGridContainer",   
						multiselect:false,  
						dataModel:dataModels.test_SheetGrid,
						onePageRowCount:20,
						isRefreshAfterSave:true,
						viewModel:viewModels.test_SheetGrid 
			};
			var grid = new NcpGrid(p); 
			
			initSheetGrid(grid);
			
			grid.show();
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpGridToolbar">
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a> 
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>