<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>test_Doc1审批单据</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/test_doc1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_doc1.js"></script>
	<script type="text/javascript" src="${dataModel}/test_doc1detail.js"></script>
	<script type="text/javascript" src="${viewModel}/test_doc1detail.js"></script>
	<script type="text/javascript" src="${sheetModel}/testDoc1.js"></script>
	
	<script> 
		$(document).ready(function(){  
			var p = { 
				containerId:"testGridContainer",  
				multiselect:true,  
				onePageRowCount:20,
				isRefreshAfterSave:true,
				dataModel:dataModels.test_doc1,
				viewModel:viewModels.test_doc1, 
				sheetModel:sheetModels.testDoc1,
				docTypeName:"这是个单据",
				windowType:"review"
			};
			var win = new NcpDocumentMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl; 
		});  
	</script>
</head>  
<body style="width:100%;height:100%;">
	<div id = "testGridContainer" class="easyui-layout" style="width:100%;height:100%;" >
		<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
			<span class="ncpGridToolbar"> 
				<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">详细信息</a>
			</span>
			<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
			<span class="ncpGridComplexQueryBar">
				<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
			</span>
			<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			</div>   
		<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
			<table name="gridCtrl" ></table>  
		</div> 
	</div>
</body>	 
</html>