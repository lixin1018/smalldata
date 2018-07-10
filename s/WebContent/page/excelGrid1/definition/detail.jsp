<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>模板详情</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="../js/excelGrid.js"></script>
	
	<script type="text/javascript" src="${dataModel}/eg_definition.js"></script>
	<script type="text/javascript" src="${viewModel}/eg_definition.js"></script>
	<script type="text/javascript" src="${dataModel}/eg_definitionVersion.js"></script>
	<script type="text/javascript" src="${viewModel}/eg_definitionVersion.js"></script>
	<script type="text/javascript" src="${sheetModel}/egDefinition.js"></script>
	<script type="text/javascript" src="js/detail.js"></script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a id="refreshBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-refresh'">刷新</a>
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false">
				<table>
					<tr style="height:22px;">
						<td style="width:100px;height:22px;text-align:right;">名称</td>
						<td colspan="3" style="width:810px;height:22px;"><input type="text" name="name" class="easyui-validatebox" style="width:810px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:22px;">
						<td style="width:100px;text-align:right;">描述</td>
						<td style="width:500px;height:22px;"><input type="text" name="description" style="width:500px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:100px;height:22px;text-align:right;">创建时间</td>
						<td style="width:200px;height:22px;"><input type="text" name="createtime" style="width:200px;height:22px;" cardCtrl="true"></input></td> 
					</tr> 
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="版本" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="detail" data-options="fit:true" id="testCardContainer2">
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