<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>组织结构</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_Org.js"></script>
	<script type="text/javascript" src="${viewModel}/d_Org.js"></script>
	<script type="text/javascript" src="${treeModel}/org.js"></script>
	
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
			<tr style="height:15px;">
				<td style="width:100px;text-align:right;"></td>
				<td style="width:200px;text-align:right;"></td>
				<td style="width:100px;text-align:right;"></td>
				<td style="width:200px;text-align:right;"></td>
			</tr>  
			<tr style="height:28px;">
				<td style="width:100px;text-align:right;">编码</td>
				<td style="width:200px;height:22px;"><input type="text" name="code" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">名称</td>
				<td style="width:200px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>  
			<tr style="height:28px;">
				<td style="width:100px;text-align:right;">本级编码</td>
				<td style="width:200px;height:22px;"><input type="text" name="partcode" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">描述</td>
				<td style="width:200px;height:22px;"><input type="text" name="description" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr>    
		</table>   
	</div> 
</body>	 
</html>