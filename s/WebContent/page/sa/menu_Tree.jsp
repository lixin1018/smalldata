<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>菜单</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Menu.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Menu.js"></script>
	<script type="text/javascript" src="${treeModel}/menu.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = { 
				containerId:"testGridContainer", 
				treeModel:treeModels.menu,
				editPageUrl:"sys_Menu_Card.jsp",
				editWinHeight:280,
				editWinWidth:500
			};
			var tree = new NcpTree(p); 
			tree.show();    
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">
		<span class="ncpGridToolbar">
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建根节点</a> 
			<a name="addchildBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-addchild'">新建子节点</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a>
		</span>
	</div>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">
		<table name="gridCtrl" ></table>
	</div>
</body>
</html>