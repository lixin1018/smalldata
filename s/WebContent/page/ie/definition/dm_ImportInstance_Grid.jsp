<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>导入日志</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/dm_ImportInstance.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportInstance.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
						containerId:"testGridContainer",   
						multiselect:false,  
						dataModel:dataModels.dm_ImportInstance,
						onePageRowCount:20,
						isRefreshAfterSave:false,
						viewModel:viewModels.dm_ImportInstance 
			};
			var grid = new NcpGrid(p); 
			grid.show();

			$("#deleteDetailRowsBtn").click(function(){ 
			 	var idValue = grid.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		if(msgBox.confirm({info:"确定删除吗?"})){
				 		grid.doOtherAction({
							actionName:"deleteDetailRows",
							customParam:{id: idValue},
							successFunc: function(obj){ 
								var selRowId = $(grid.gridCtrl).jqGrid("getGridParam", "selrow");
								var iiRow = grid.datatable.rows(selRowId); 
								iiRow.setValue("statustype", "Deleted"); 
								$(grid.gridCtrl).jqGrid("setRowData", selRowId, iiRow.allCells());
								alert("删除成功!");
							},
							failFunc:function(obj){ 
							}
						});
			 		}
			 	}
			}); 
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpGridToolbar">
			<a id="deleteDetailRowsBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除已导入记录</a> 
		</span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>