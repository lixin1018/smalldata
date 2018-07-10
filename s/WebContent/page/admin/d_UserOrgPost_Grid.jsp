<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>用户-部门-岗位</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_UserOrgPost.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserOrgPost.js"></script>
	<script type="text/javascript" src="${dataModel}/d_Org.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Org.js"></script>
	<script type="text/javascript" src="${treeModel}/org.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var userOrgPostParam = { 
					containerId:"testUserOrgPostGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_UserOrgPost,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_UserOrgPost,
					isShowData:true,
					where:[{parttype:"clause", clause:"1<>1"}]
			};
			var userOrgPostParamGrid = new NcpGrid(userOrgPostParam); 
			userOrgPostParamGrid.show(); 
			var externalObject = {
					beforeDoAdd:function(param){
						if(userOrgPostParamGrid.org == undefined || userOrgPostParamGrid.org.id == null){
							msgBox.alert({info:"请选中部门."});
							return false;
						}
						else{
							return true;
						}
					}, 
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);			
							row.setValue("orgid",userOrgPostParamGrid.org.id);		
							row.setValue("orgname",userOrgPostParamGrid.org.name);		
							row.setValue("orgcode",userOrgPostParamGrid.org.code);
						}
					}
				};
			userOrgPostParamGrid.addExternalObject(externalObject);
			

			var orgParam = { 
				containerId:"testOrgGridContainer", 
				treeModel:treeModels.org, 
				editWinHeight:150,
				editWinWidth:500,
				isExpandRoot:true
			};
			var orgTree = new NcpTree(orgParam);  
			
			var externalObject = { 
				afterRowSelect : function(rowId){
					if(rowId == undefined){
						userOrgPostParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"orgId", operator:"is", value:""}]
						});
						userOrgPostParamGrid.org = {id:null, name:null, code:null};
					}
					else{ 
						var row = orgTree.treeGridCtrl.datatable.rows(rowId);
						var orgid = row.getValue("id");
						var orgname = row.getValue("name");
						var orgcode = row.getValue("code");
						userOrgPostParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"orgid", operator:"=", value: orgid.toString()}]
						});
						userOrgPostParamGrid.org = {id:orgid, name:orgname, code:orgcode};
					}
				} 
			};
			orgTree.show();
			orgTree.treeGridCtrl.addExternalObject(externalObject);
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;">
	<div data-options="region:'west',border:false,split:true" style="width:400px">
		<div class="easyui-layout" data-options="fit:true" id = "testOrgGridContainer">		
			<div class="ncpGridToolbarContainer" data-options="region:'north',border:false"> 
				<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			</div>
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">
				<table name="gridCtrl" ></table>
			</div>
		</div>
	</div>
	<div data-options="region:'center',border:false">
		<div class="easyui-layout" data-options="fit:true" id = "testUserOrgPostGridContainer">		
			<div class="ncpGridToolbarContainer" data-options="region:'north',border:false"> 
				<span class="ncpGridToolbar">
					<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
					<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'"></a>
					<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true"></a>
					<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'"></a> 
					<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
				</span>
				<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
				<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			</div>
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
				<table name="gridCtrl" ></table>  
			</div> 
		</div>
	</div>
</body>	 
</html>