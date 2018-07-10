<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>我的单据</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/wf_CreateInstanceList.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_CreateInstanceList.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_DocType.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_DocTypeList.js"></script>
	
	<script> 
		$(document).ready(function(){  
			var p = { 
					containerId:"createInstanceListContainer",   
					docTypeListContainerId:"docTypeListContainer",
					batchSubmitBtnId:"batchSubmitBtnId",
					multiselect:true,  
					dataModel:dataModels.wf_CreateInstanceList,
					viewModel:viewModels.wf_CreateInstanceList,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					windowType:"create"
				};
			var grid = new NcpDocumentGrid(p); 
			grid.show();  
	});  
	</script>
</head>  
<body style="width:100%;height:100%;">
	<div id = "createInstanceListContainer" class="easyui-layout" style="width:100%;height:100%;" >
		<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
			<span class="ncpGridToolbar">
				<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建单据</a>
				<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">详细信息</a>
				<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
			</span>
			<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
			<span class="ncpGridComplexQueryBar">
				<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
			</span>
			<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			<span style="width:400px;">
				<input type="button" id="batchSubmitBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;" value="批量提交" /> 
			</span>	
		</div>   
		<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
			<table name="gridCtrl" ></table>  
		</div> 
	</div> 
	<div id = "docTypeListContainer" class="easyui-layout" style="width:500px;height:250px;display:none;" >
		<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	  
			<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
			<span class="ncpGridSearchBar" style="float:left;"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
		<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
			<table name="gridCtrl" ></table>  
		</div> 
	</div> 
</body>	 
</html>