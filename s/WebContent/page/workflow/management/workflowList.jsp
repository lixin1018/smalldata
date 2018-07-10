<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>流程列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/wf_Workflow.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_WorkflowList.js"></script>
	<script> 
		var grid = null; 
		var isEditNewOne = false;
		$(document).ready(function(){ 

			var p = { 
						containerId:"listContainerId",   
						multiselect:false,  
						dataModel:dataModels.wf_Workflow,
						onePageRowCount:20,
						isRefreshAfterSave:false,
						viewModel:viewModels.wf_WorkflowList 
			};
			grid = new NcpGrid(p); 
			grid.setGridOtherParam = function(initParam){ 
				initParam.ondblClickRow = function(rowid, iRow, iCol, e){   
					editWorkflow();
				} 
			}
			grid.show();
			
			//新建			 
			$("#addBtnId").click(function(){
				addWorkflow();
			});	 
			
			//编辑
			$("#editBtnId").click(function(){	
				editWorkflow();
			});
			
			//删除
			$("#deleteBtnId").click(function(){	
				deleteWorkflow();
			});
		});  
		
		function addWorkflow(){
			isEditNewOne = true;
			$("#listContainerId").css("display", "none");
			$("#workflowEditLayoutId").css("display", "block");
			$("#workflowFrameId").attr("src", "workflowDesigner.jsp");
		}
		
		function editWorkflow(){
			var id = grid.getCurrentIdValue(); 
			if(id != null){
				isEditNewOne = false;
				$("#listContainerId").css("display", "none");
				$("#workflowEditLayoutId").css("display", "block");
				$("#workflowFrameId").attr("src", "workflowDesigner.jsp?workflowid=" + id);
			}
			else{
				msgBox.alert({info:"请选中流程."});
			}
		}
		
		function deleteWorkflow(){
			var id = grid.getCurrentIdValue(); 

			if(msgBox.confirm({info:"确认删除吗?"})){
				var requestParam = {
					workflowId: id
				}; 
				serverAccess.request({
					serviceName:"workflowNcpService", 
					funcName:"deleteWorkflow",
					args:{
						requestParam:cmnPcr.jsonToStr(requestParam)
					},  
					successFunc:function(obj){  
						grid.doPage( {
							pageNumber : grid.pageNumber
						}); 
						msgBox.alert({info:"删除成功!"});	
					},  
					failFunc:function(obj){  
						msgBox.alert({info:obj.message});
					}
				}); 
			}
		}
		
		function backToList(){
			$("#workflowEditLayoutId").css("display", "none");
			$("#listContainerId").css("display", "block");	
			grid.doPage( {
				pageNumber : isEditNewOne ? 1 : grid.pageNumber
			});
		}
		
	</script>
</head>  
<body style="width:100%;height:100%;">
	<div class="easyui-layout" style="width:100%;height:100%;" id = "listContainerId">
		<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" >	
			<span class="ncpGridToolbar">
				<a id="addBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
				<a id="editBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a> 
				<a id="deleteBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
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
	</div>
	<div class="easyui-layout" id="workflowEditLayoutId" style="width:100%;height:100%;"> 
		<div id="workflowEditContainerId" class="ncpGridDiv" data-options="region:'center',border:false" >
			<iframe id="workflowFrameId" style="width:100%;height:100%;border:0px"></iframe> 
		</div>
	</div>
</body>	 
</html>