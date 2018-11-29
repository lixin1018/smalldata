<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>父子表只有表头表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${basejs}/ncpMultiSelectControlInCard.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild2.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild2.js"></script>
	
	<script>
		$(document).ready(function(){

			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var cardWin = new NcpMultiStyleCardWin(initParam); 
						
			cardWin.show();	
			var cardCtrl = cardWin.cardCtrl; 
				
			var multiSelectControl1 = new NcpMultiSelectControlInCard();
			multiSelectControl1.init({
				parentCardControl: cardCtrl, 
				childDataModel: dataModels.test_DocAChild1,
				childViewModel: dataModels.test_DocAChild1,
				childListFieldName: "name",
				containerId: "div_Test_DocAChild1"
			}); 
				
			var multiSelectControl2 = new NcpMultiSelectControlInCard();
			multiSelectControl2.init({
				parentCardControl: cardCtrl, 
				childDataModel: dataModels.test_DocAChild2,
				childViewModel: dataModels.test_DocAChild2,
				childListFieldName: "typename",
				containerId: "div_Test_DocAChild2"
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
				<td style="width:100px;text-align:right;">名称</td>
				<td style="width:400px;height:22px;"><input type="text" name="name" style="width:350px;height:22px;" cardCtrl="true"></input></td> 
			</tr> 
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">子表1</td>
				<td style="width:400px;height:22px;"><div id="div_Test_DocAChild1"></div></td> 
			</tr> 
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">子表2</td>
				<td style="width:400px;height:22px;"><div id="div_Test_DocAChild2"></div></td> 
			</tr> 
		</table>   
	</div> 
</body>	 
</html>