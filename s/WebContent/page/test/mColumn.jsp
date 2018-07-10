<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../basePage.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>用户</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">

		<script type="text/javascript" src="${dataModel}/d_User.js"></script>
		<script type="text/javascript" src="${viewModel}/d_User.js"></script>

		<script> 
			var grid = null;
			
			//操作按钮列的名称
			var operateColumnName = "operateColumn";
					
			//获取操作按钮单元格内容html
			function getLinkHtml(rowId){
				var row = grid.datatable.getRowByIdField(rowId, "id"); 
				var nameValue = row.getValue("name");
				var timeMark = (new Date()).getMilliseconds();
				var html = "<a href=\"#\" target=\"blank\" style=\"line-height:24px;\" onclick=\"return clickLink('" + rowId + "')\">" + timeMark + ":" + (nameValue== undefined ? "无" : nameValue) + "</a>";
				return html;
			}
			
			//操作按钮列ID
			function getCellContainerId(rowId){
				return operateColumnName + "_" + rowId;
			}
			
			//手工刷新操作按钮列内容
			function clickLink(rowId){
				var row = grid.datatable.getRowByIdField(rowId, "id"); 
				alert("Code: " +row.getValue("code"));
				return false;
			}
	
			//从模型中增加操作按钮列
			viewModels.d_User.colModel.push({name:operateColumnName,
				label:"操作",
				width:100,
				hidden:false,
				sortable:false, 
				search:false,
				resizable:true,
				editable:false,
				canEdit:false,
				formatter:function(cellvalue, options, rowObject){
					var html = getLinkHtml(rowObject.id);
					var containerId = getCellContainerId(rowObject.id);
					return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
				}
			});
			
			$(document).ready(function() {
			
				//构造grid
				var p = {
					containerId : "testGridContainer",
					multiselect : true,
					dataModel : dataModels.d_User,
					onePageRowCount : 3,
					isRefreshAfterSave : true,
					viewModel : viewModels.d_User
				};
				
				grid = new NcpGrid(p);
				grid.show(); 
				
				//手工刷新一下超链接的内容
				$("#refreshLinkId").click(function(){ 
					var rowId = "1";
					var containerId = getCellContainerId(rowId);
					$("#" + containerId).html(getLinkHtml(rowId)); 
				});
			});
		</script>
	</head>
	<body class="easyui-layout" style="width: 100%; height: 100%;"
		id="testGridContainer">
		<div class="ncpGridToolbarContainer"
			data-options="region:'north',border:false">
			<span class="ncpGridToolbar"> <a name="addBtn" href="#"
				class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-add'">新建</a> <a
				name="editBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-edit'">编辑</a> <a
				name="saveBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a> <a
				name="cancelBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-cancel'">取消</a> <a
				name="deleteBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-delete'">删除</a>  
			</span>
			<span name="paginationCtrl"
				class="easyui-pagination ncpGridPagination"
				data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
			<span class="ncpGridSearchBar"><input name="searchCtrl"
					class="easyui-searchbox" style="width: 110px;"
					data-options="prompt:'模糊查询'"></input> </span>
			<input type="button" id="refreshLinkId" value="刷新Link" />
		</div>
		<div name="gridDiv" class="ncpGridDiv"
			data-options="region:'center',border:false">
			<table name="gridCtrl"></table>
		</div>
	</body>
</html>