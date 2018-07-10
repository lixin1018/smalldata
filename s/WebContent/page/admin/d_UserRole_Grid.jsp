<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>用户角色</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_UserRole.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserRole.js"></script>
	<script type="text/javascript" src="${dataModel}/d_Role.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Role.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var userRoleParam = { 
					containerId:"testUserRoleGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_UserRole,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_UserRole,
					isShowData:true,
					where:[{parttype:"clause", clause:"1<>1"}]
			};
			var userRoleParamGrid = new NcpGrid(userRoleParam); 
			userRoleParamGrid.show(); 
			var externalObject = {
					beforeDoAdd:function(param){
						if(userRoleParamGrid.role == undefined || userRoleParamGrid.role.id == null){
							msgBox.alert({info:"请选中角色."});
							return false;
						}
						else{
							return true;
						}
					}, 
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);			
							row.setValue("roleid",userRoleParamGrid.role.id);		
							row.setValue("rolename",userRoleParamGrid.role.name);		
							row.setValue("rolecode",userRoleParamGrid.role.code);
						}
					}
				};
			userRoleParamGrid.addExternalObject(externalObject);
			
			var roleParam = { 
					containerId:"testRoleGridContainer",   
					multiselect:true,  
					dataModel:dataModels.d_Role,
					onePageRowCount:20,
					isRefreshAfterSave:true,
					viewModel:viewModels.d_Role 
			};
			var roleGrid = new NcpGrid(roleParam); 
			
			var externalObject = { 
				afterRowSelect : function(rowId){
					if(rowId == undefined){
						userRoleParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleId", operator:"is", value:""}]
						});
						userRoleParamGrid.role = {id:null, name:null, code:null};
					}
					else{ 
						var row = roleGrid.datatable.rows(rowId);
						var roleid = row.getValue("id");
						var rolename = row.getValue("name");
						var rolecode = row.getValue("code");
						userRoleParamGrid.doPage({
							pageNumber:1,
							where:[{parttype:"field", field:"roleid", operator:"=", value: roleid.toString()}]
						});
						userRoleParamGrid.role = {id:roleid, name:rolename, code:rolecode};
					}
				} 
			};
			roleGrid.addExternalObject(externalObject);
			roleGrid.show();
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;">
	<div data-options="region:'west',border:false,split:true" style="width:400px">
		<div class="easyui-layout" data-options="fit:true" id = "testRoleGridContainer">		
			<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">
				<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
				<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
			</div>
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
				<table name="gridCtrl" ></table>  
			</div> 
		</div>
	</div>
	<div data-options="region:'center',border:false">
		<div class="easyui-layout" data-options="fit:true" id = "testUserRoleGridContainer">		
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