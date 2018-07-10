﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${sheetModel}/data.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.sys_Data,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.sys_Data,
				sheetModel:sheetModels.data,
				detailPageUrl:"data_Sheet.jsp"
			};
			var win = new NcpMultiStyleWin(p); 
			win.show();
			var gridCtrl = win.gridStyleCtrl; 

			$("#generateJsBtn").click(function(){ 
			 	var idValue = gridCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		gridCtrl.doOtherAction({
						actionName:"generateJs",
						customParam:{dataId: idValue},
						successFunc: function(obj){
							alert(cmnPcr.jsonToStr(obj));
						},
						failFunc:function(obj){
							alert(cmnPcr.jsonToStr(obj));
						}
					});
			 	}
			}); 
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" >	 
		<span class="ncpGridToolbar"> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</span>
		<span class="ncpGridSearchBar">
			<input id="searchCtrl" name="searchCtrl" class="easyui-searchbox" style="width: 110px;" data-options="prompt:'模糊查询'"></input>
		</span> 
		<span class="ncpGridComplexQueryBar">
			<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
		</span>	
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
		<input type="button" id="generateJsBtn" value="更新运行时" /> 	
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   
		<table name="gridCtrl" ></table> 
	</div>
</body>	 
</html>