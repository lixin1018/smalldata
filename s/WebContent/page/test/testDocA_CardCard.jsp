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
	<script type="text/javascript" src="${basejs}/ncpMultiSelectControlInGrid.js"></script>
	<script type="text/javascript" src="${sheetModel}/test_DocA.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild2.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild5.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild5_1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild2.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild5.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild5_1.js"></script>
	
	<script>
		$(document).ready(function(){

			var multiSelectCtrl5_1 = new NcpMultiSelectControlInGrid({
				childColumnName: "表5_1",
				childColumnWidth: 500,
				childDataModel: dataModels.test_DocAChild5_1,
				childViewModel: viewModels.test_DocAChild5_1,
				parentViewModel: viewModels.test_DocAChild5,
				parentDataModel: dataModels.test_DocAChild5,
				childListFieldName:"typename",
				childKeyFieldName: "typeid"
			});

			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.initOtherEvent = function(sheetCtrl){		
				var childGrid5Ctrl = sheetCtrl.getPartCardCtrl("test_DocAChild5");
				multiSelectCtrl5_1.init({
					parentGridControl: childGrid5Ctrl
				});
				
				//设置弹出框，重写了平台原有的弹出
				childGrid5Ctrl.getPopContainer = function(param){
					var popContainer = new PopupContainer( {
						width : 500,
						height : 300,
						top : 50
					});
					return popContainer;
				}				
			}
						
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl; 
			var cardCtrl = sheetCtrl.getMainCardCtrl(); 
				
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
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false">
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
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="表5" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="test_DocAChild5" data-options="fit:true" id="testCardContainer2">
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