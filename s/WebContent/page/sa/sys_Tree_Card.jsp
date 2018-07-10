<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Tree模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Tree.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Tree.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam); 
			cardWin.show();	
			var cardCtrl = cardWin.cardCtrl;
			
			
			$("#generateJsBtn").click(function(){
			 	var idValue = cardCtrl.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
					card.doOtherAction({
						actionName:"generateJs",
						customParam:{treeId: idValue},
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
		<input type="button" id="generateJsBtn" value="更新运行时" /> 	 
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
		<table>
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">名称</td>
				<td style="width:200px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">View</td>
				<td style="width:200px;height:22px;"><input type="text" name="viewname" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
			</tr>  
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">Label字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="labelfield" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">关联字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="parentpointerfield" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
			</tr>   
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">叶节点字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="isleaffield" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">排序字段</td>
				<td style="width:200px;height:22px;"><input type="text" name="sortfield" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
			</tr>   
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">所属模块</td>
				<td style="width:200px;height:22px;"><input type="text" name="sysmodule" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;"></td>
				<td style="width:200px;">&nbsp;</td> 
			</tr>   
		</table>   
	</div> 
</body>	 
</html>