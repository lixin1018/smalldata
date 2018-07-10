<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>数据导入定义</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/dm_ImportExportDefinition.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportDefinition.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam); 
			cardWin.show();	
			var cardCtrl = cardWin.cardCtrl;


			$("#updateRuntimeBtn").click(function(){ 
			 	var idValue = cardCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有选定行."});
			 	}
			 	else{
			 		cardCtrl.doOtherAction({
						actionName:"updateRuntime",
						customParam:{importDefinitionId: idValue},
						successFunc: function(obj){
							alert(cmnPcr.jsonToStr(obj));
						},
						failFunc:function(obj){
							alert(cmnPcr.jsonToStr(obj));
						}
					});
			 	}
			}); 
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>  
		</span>	
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
		<table>
			<tr style="height:22px;">
				<td style="width:80px;text-align:right;">名称</td>
				<td style="width:250px;height:22px;" colspan="2"><input type="text" name="name" style="width:250px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:80px;text-align:right;">编码</td>
				<td style="width:250px;height:22px;" colspan="2"><input type="text" name="code" style="width:250px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:80px;text-align:right;">所属模块</td>
				<td style="width:120px;height:22px;" colspan="1"><input type="text" name="modulename" style="width:120px;height:22px;" cardCtrl="true"></input></td> 
			</tr>  
			<tr style="height:22px;">
				<td style="width:80px;text-align:right;">所有者</td>
				<td style="width:150px;height:22px;"><input type="text" name="ownername" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:80px;text-align:right;">所有者编码</td>
				<td style="width:150px;height:22px;"><input type="text" name="ownercode" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:80px;text-align:right;">创建时间</td>
				<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:80px;text-align:right;">修改时间</td>
				<td style="width:150px;height:22px;"><input type="text" name="modifytime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
			</tr>   
			<tr style="height:60px;">
				<td style="width:80px;text-align:right;">自动更新模型</td>
				<td style="width:150px;height:22px;"><input type="checkbox" name="autoupdatemodel" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
				<td style="width:80px;text-align:right;">描述</td>
				<td style="width:700px;height:22px;" colspan="5"><textarea  name="description" style="width:700px;height:60px;" cardCtrl="true"></textarea></td>
			</tr>   
			<tr style="height:400px;">
				<td style="width:80px;text-align:right;">定义Xml</td>
				<td style="width:840px;height:22px;" colspan="7"><textarea name="definitionxml" style="width:840px;height:400px;" cardCtrl="true"></textarea></td>
			</tr>   
		</table>   
	</div> 
</body>	 
</html>