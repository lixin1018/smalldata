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

		<script type="text/javascript" src="${dataModel}/d_User.js">
</script>
		<script type="text/javascript" src="${viewModel}/d_User.js">
</script>

		<script>
$(document).ready(function() {
	var p = {
		containerId : "testGridContainer",
		multiselect : true,
		dataModel : dataModels.d_User,
		onePageRowCount : 20,
		isRefreshAfterSave : true,
		viewModel : viewModels.d_User
	};
	
	var grid = new NcpGrid(p);
	grid.show();

	
	//用户类型
	$("#userTypeBtnId").click(function(){
		var subRow = getCurrentSubRow();
		if(subRow == null){
			msgBox.alert({info:"请选中明细行."});
		}
		else{
			//根据广告类型选择要弹出的内容
			viewUserType(subRow);
		}
	});
	//获得选中行
	function getCurrentSubRow(){			
		var id = grid.getCurrentIdValue();
		if(id != null){
			var subRow = grid.datatable.getRowByIdField(id, "id"); 
			return subRow;
		}
		else{
			return null;
		}
	}
	
	//
	function viewUserType(subRow){
		var popContainer = new PopupContainer({width:500, height:400, top:50});
		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		popContainer.show(); 
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", "../b2badmin/userTypeSelector.jsp");
		//商品选择完成后
		window.closeWinUserTypeSelector = function(backParam){
				//alert(backParam.userTypeId);
			if(backParam.userTypeId != null){
				subRow.setValue("user_type_code",backParam.userTypeId);
				$(grid.gridCtrl).jqGrid("setCell", subRow.rowId, "user_type_code", backParam.userTypeId);
			}
			popContainer.close();
		} 
	}
});
</script>
	</head>
	<body class="easyui-layout" style="width: 100%; height: 100%;"
		id="testGridContainer">
		<div class="ncpGridToolbarContainer"
			data-options="region:'north',border:false">
			<span class="ncpGridToolbar"> 
				<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a> 
				<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a> 
				<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a> 
				<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a> 
				<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
			</span>
			<span class="ncpGridSearchBar">
				<input id="searchCtrl" name="searchCtrl" class="easyui-searchbox" style="width: 110px;" data-options="prompt:'模糊查询'"></input>
			</span> 
			<span class="ncpGridComplexQueryBar">
				<a name="complexQueryBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-complexQuery',text:'高级查询'"></a> 
			</span>	
			<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
		</div>
		<div name="gridDiv" class="ncpGridDiv"
			data-options="region:'center',border:false">
			<table name="gridCtrl"></table>
		</div>
	</body>
</html>