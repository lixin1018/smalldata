<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>数据结构模板版本</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="../js/importExport.js"></script>
	 
	<script type="text/javascript" src="${dataModel}/dm_ImportExportVersion.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportVersion.js"></script>
	<script type="text/javascript" src="${dataModel}/dm_ImportExportField.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportField.js"></script>
	<script type="text/javascript" src="${sheetModel}/importExportVersion.js"></script>
	
	<script>
		var sheetWin = null;
		$(document).ready(function(){
			var importExportVersionId = window.parent.importExportVersionId; 
			var initParam = {
				containerId:"testSheetContainer",
				idValue: importExportVersionId,
				dataModel:dataModels.dm_ImportExportVersion,  
				viewModel:viewModels.dm_ImportExportVersion,
				sheetModel:sheetModels.importExportVersion
			} 
			sheetWin = new NcpSheet(initParam); 
			sheetWin.show();	
		});
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">  
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>  
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false">
				<table>
					<tr style="height:22px;">
						<td style="width:120px;height:22px;text-align:right;">版本编码</td>
						<td style="width:150px;height:22px;"><input type="text" name="code" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:120px;height:22px;text-align:right;">名称</td>
						<td style="width:150px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:120px;text-align:right;">数据源文件类型</td>
						<td style="width:150px;height:22px;"><input type="text" name="sourcedatafiletype" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:120px;text-align:right;">数据源包含标题行</td>
						<td style="width:50px;height:22px;"><input type="checkbox" name="sourcedatahasheaderrow" style="width:50px;height:15px;"  cardCtrl="true"></input></td> 
						<td style="width:120px;height:22px;text-align:right;">已启用</td>
						<td style="width:50px;height:22px;"><input type="checkbox" name="isactive" style="width:50px;height:15px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:22px;">
						<td style="width:120px;height:22px;text-align:right;">创建人</td>
						<td style="width:150px;height:22px;"><input type="text" name="createusername" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:120px;height:22px;text-align:right;">创建时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:120px;height:22px;text-align:right;">修改时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="modifytime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:120px;height:22px;text-align:right;">排序</td>
						<td colspan="3" style="width:250px;height:22px;"><input type="text" name="orderby" style="width:250px;height:22px;" cardCtrl="true"></td>
					</tr>   
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="字段" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="field" data-options="fit:true" id="testCardContainer2">
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