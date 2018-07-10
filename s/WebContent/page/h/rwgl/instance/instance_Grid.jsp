<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>ExcelGrid实例列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/eg_instance.js"></script>
	<script type="text/javascript" src="${viewModel}/eg_instance.js"></script>
	
	<script> 
		var instanceGrid = null;	
		$(document).ready(function(){ 
			var p = { 
						containerId:"testGridContainer",   
						multiselect:true,  
						dataModel:dataModels.eg_instance,
						onePageRowCount:20,
						isRefreshAfterSave:false,
						viewModel:viewModels.eg_instance 
			};
			instanceGrid = new NcpGrid(p); 
			instanceGrid.show();

			$("#editInstanceBtnId").click(function(){
				var instanceRow = getCurrentInstanceRow();
				if(instanceRow != null){			
					var instanceId = instanceRow.getValue("id");
					var instanceName = instanceRow.getValue("name"); 
					window.open("../instance/editInstance.jsp?name=" + encodeURIComponent(instanceName) + "&instanceid=" + instanceId, instanceId); 
				}
				else{
					msgBox.alert({info: "请选择实例!"});
				}
			});
			
			$("#deleteInstanceBtnId").click(function(){				
				var selectedInstances = getSelectedInstances();
				if(selectedInstances.length == 0){
					msgBox.alert({info: "请选择实例!"});
				}
				else{				
					if(msgBox.confirm({info:"确定要删除吗?"})){
						var requestParam = {
							instances: selectedInstances
						};
						
				 		serverAccess.request({
							serviceName:"excelGridNcpService", 
							funcName:"deleteInstance", 
							args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
							successFunc:function(obj){
								afterDeleteInstance(selectedInstances);
							},
							failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
						});
					}
				} 
			});
		});  

		function afterDeleteInstance(selectedInstances){ 
			for ( var i = 0; i < selectedInstances.length; i++) {
				var rowId = selectedInstances[i].rowId;
				$(instanceGrid.gridCtrl).jqGrid("delRowData", rowId);
				instanceGrid.datatable.remove(rowId); 
			}
		}
		
		function getSelectedInstances(){ 
			var selectedInstanceIdJsons = new Array();
			var rowIds = instanceGrid.getSelectedRowIds();
			for(var i = 0; i < rowIds.length; i++){
				var rowId = rowIds[i];
				var instanceId = instanceGrid.datatable.rows(rowId).getValue("id");
				selectedInstanceIdJsons.push({
					rowId: rowId, 
					instanceId: instanceId
				});
			}
			
			return selectedInstanceIdJsons;
		}

		function getCurrentInstanceId(){ 
			var instanceId = instanceGrid.getCurrentIdValue();
			return instanceId; 
		}
		
		function getCurrentInstanceRow(){ 
			var selRowId = $(instanceGrid.gridCtrl).jqGrid("getGridParam", "selrow");
			var row = instanceGrid.datatable.rows(selRowId);
			return row;
		}
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpGridToolbar"> 
			<a id="editInstanceBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>  
			<a id="deleteInstanceBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>