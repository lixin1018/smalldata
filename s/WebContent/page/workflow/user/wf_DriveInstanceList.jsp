<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>我的任务</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/wf_DriveInstanceList.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_DriveInstanceList.js"></script> 
	
	<script> 
		$(document).ready(function(){  
			var p = { 
					containerId:"driveInstanceListContainer", 
					batchDriveBtnId:"batchDriveBtnId",
					multiselect:true,  
					dataModel:dataModels.wf_DriveInstanceList,
					viewModel:viewModels.wf_DriveInstanceList,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					windowType:"drive"
				};
			var grid = new NcpDocumentGrid(p); 
			grid.show();  
	});  
	</script>
</head>  
<body style="width:100%;height:100%;">
	<div id = "driveInstanceListContainer" class="easyui-layout" style="width:100%;height:100%;" >
		<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
			<span class="ncpGridToolbar"> 
				<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">详细信息</a>
			</span>
			<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
			<span class="ncpGridComplexQueryBar">
				<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
			</span>
			<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			<span style="width:400px;">
				<input type="button" id="batchDriveBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;" value="批量审批" /> 
			</span>	
		</div>   
		<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
			<table name="gridCtrl" ></table>  
		</div> 
	</div>
</body>	 
</html>