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
		var initParam = window.parent.treeCardInitParam; 
		initParam.containerId = "testCardContainer";
		var treeCard = new NcpTreeCard(initParam);
		treeCard.show(); 
	}); 
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">  
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a> 
		</span> 
		<a name="cancelBtn" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true" >关闭</a> 
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
		<table>
			<tr style="height:22px;">
				<td style="width:80px;text-align:right;">编码</td>
				<td style="width:150px;height:22px;"><input type="text" name="code" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:80px;text-align:right;">名称</td>
				<td style="width:150px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>  
			<tr style="height:22px;">
				<td style="width:80px;text-align:right;">描述</td>
				<td style="width:150px;height:22px;"><input type="text" name="description" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:80px;height:22px;text-align:right;">图标名</td>
				<td style="width:150px;height:22px;"><input type="text" name="icon" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>    
			<tr style="height:22px;">
				<td style="width:80px;text-align:right;">默认可用</td>
				<td style="width:150px;height:22px;"><input type="checkbox" name="isdefaultenable" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:80px;text-align:right;">隐藏</td>
				<td style="width:150px;height:22px;"><input type="checkbox" name="ishidden" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>   
			<tr style="height:60px;">
				<td style="width:80px;text-align:right;">执行表达式</td>
				<td colspan="3"><textarea name="actionexp" style="width:400px;height:60px" cardCtrl="true"></textarea></td> 
			</tr>    
			<tr style="height:60px;">
				<td style="width:80px;text-align:right;">页面地址</td>
				<td colspan="3"><textarea name="pageurl" style="width:400px;height:60px" cardCtrl="true"></textarea></td> 
			</tr>    
		</table>   
	</div> 
</body>	 
</html>