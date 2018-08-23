<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePageSharePopData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/ie_dxbkxkfl.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_dxbkxkfl.js"></script>
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 
				
		var p = { 
			containerId:"testGridContainer",   
			multiselect:initParam.isMultiValue,  
			dataModel:dataModels.ie_dxbkxkfl,
			onePageRowCount:20, 
			viewModel:viewModels.ie_dxbkxkfl 
		};
		var grid = new NcpShareDataPopGrid(p); 

		//数据权限过滤
		var externalObject = {
				beforeDoPage:function(param){
					param.previousField = initParam.previousField;
					param.previousData = initParam.previousData;
					param.popDataField = initParam.popDataField;
					return true;
				} 
		};
		grid.addExternalObject(externalObject); 		

		var closePop = function(rowIds){
			var selectedRows = null; 
			if(rowIds == null){
				selectedRows = null;
			}
			else{
				selectedRows = {};
				for(var i =0 ;i<rowIds.length;i++){
					var rowId = rowIds[i];
					selectedRows[rowId] = grid.datatable.rows(rowId).allCells();
				}
			} 
			initParam.closeWin({selectedRows:selectedRows});
		}
				
		grid.setGridOtherParam = function(initParam){
			initParam.ondblClickRow = function(rowId, iRow, iCol, e){   
				closePop([rowId]);
			}
		}
		grid.show();	

		$("#testGridContainer").find("a[name='returnBtn']").click(function(){
			var rowIds = grid.getSelectedRowIds();
			if(rowIds.length == 0){
				msgBox.alert({info:"请选中记录."});
			}
			else{
				closePop(rowIds);
			}
		});
		$("#testGridContainer").find("a[name='returnNullBtn']").click(function(){
			closePop([]);
		});
		$("#testGridContainer").find("a[name='closeBtn']").click(function(){
			closePop(null);
		});
		
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer sharePopDataToolbar" data-options="region:'north',border:false">			
		<a name="closeBtn" href="#" class="easyui-linkbutton"style="float:right;"  data-options="plain:true">关闭</a>
		<a name="returnNullBtn" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true">返回空值</a>
		<a name="returnBtn" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true">返回</a>
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>