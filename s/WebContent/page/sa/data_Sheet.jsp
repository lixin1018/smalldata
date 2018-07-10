<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_Data.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataField.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataField.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataFieldMap.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataFieldMap.js"></script>
	<script type="text/javascript" src="${dataModel}/sys_DataEventExpression.js"></script>
	<script type="text/javascript" src="${viewModel}/sys_DataEventExpression.js"></script>
	<script type="text/javascript" src="${sheetModel}/data.js"></script>
	
	<script> 
		$(document).ready(function(){ 	
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl;

			$("#generateJsBtn").click(function(){
				var mainCard = sheetCtrl.getMainCardCtrl();
			 	var idValue = mainCard.getCurrentIdValue();
			 	if(idValue == null){
			 		msgBox.alert({info:"没有记录."});
			 	}
			 	else{
			 		mainCard.doOtherAction({
						actionName:"generateJs",
						customParam:{dataId: idValue},
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
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
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
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false" style="overflow:hidden;">
				<table>
					<tr style="height:25px;">
						<td style="width:50px;height:22px;text-align:right;">名称</td>
						<td style="width:100px;height:22px;"><input type="text" name="name" class="easyui-validatebox" style="width:100px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:30px;height:22px;text-align:right;">启用</td>
						<td style="width:30px;height:22px;"><input type="checkbox" name="isusing" style="width:30px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">主键字段</td>
						<td style="width:60px;height:22px;"><input type="text" name="idfieldname" style="width:100px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">源类型</td>
						<td style="width:60px;height:22px;"><input type="text" name="dstype" style="width:50px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">目标类型</td>
						<td style="width:100px;height:22px;"><input type="text" name="savetype" style="width:100px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">目标名称</td>
						<td style="width:100px;height:22px;"><input type="text" name="savedest" style="width:100px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">所属模块</td>
						<td style="width:100px;height:22px;"><input type="text" name="sysmodule" style="width:100px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
					<tr style="height:25px;">
						<td style="text-align:right;">描述</td>
						<td colspan="13"><input type="text" name="description" style="width:950px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
					<tr style="height:85px;">
						<td style="text-align:right;">源表达式</td>
						<td colspan="13" ><textarea  name="dsexp" style="width:950px;height:80px;" cardCtrl="true"></textarea></td> 
					</tr> 
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="字段" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="line" data-options="fit:true" id="testCardContainer2">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
						 
					</div>	
					<div title="输入帮助字段映射" class="ncpCardTab">  
						<div class="easyui-layout" sheetPart="lineline" data-options="fit:true" id="testCardContainer3">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
					</div>	
					<div title="事件" class="ncpCardTab">  
						<div class="easyui-layout" sheetPart="event" data-options="fit:true" id="testCardContainer4">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
					</div>				
				</div>  
			</div> 
		</div>
	</div>
</body>	 
</html>