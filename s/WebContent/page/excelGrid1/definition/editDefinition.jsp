<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>模板编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	<link rel="stylesheet" type="text/css" href="../css/excelGrid.css">
	<script type="text/javascript" src="../../../novaone-style/plugins/novaone/expression/excelFunctionList.js"></script>
	<script type="text/javascript" src="../../../novaone-style/plugins/novaone/expression/excelOperatorList.js"></script>
	<script type="text/javascript" src="../js/excelGrid.js"></script>
	<script type="text/javascript" src="../js/excelCommonFunction.js"></script>
	<script type="text/javascript" src="../js/excelGridValidator.js"></script>
	<script type="text/javascript" src="js/editDefinition.js"></script> 
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id="testGridContainer">

	<div id="colMenu" class="easyui-menu" style="width:120px;">
		<div id="colCut">剪切</div>		
		<div id="colCopy">复制</div>	
		<div id="colPaste">粘贴</div>		
		<div id="colInsertBefore">此前插入</div>		
		<div id="colInsertAfter">此后插入</div>	
		<div id="colDelete">删除</div>	
		<div id="colClearContent">清除内容</div>	
		<div id="colSetWidth">设置列宽</div>
	</div> 
	<div id="rowMenu" class="easyui-menu" style="width:120px;">
		<div id="rowCut">剪切</div>		
		<div id="rowCopy">复制</div>	
		<div id="rowPaste">粘贴</div>		
		<div id="rowInsertBefore">此前插入</div>		
		<div id="rowInsertAfter">此后插入</div>	
		<div id="rowDelete">删除</div>	
		<div id="rowClearContent">清除内容</div>	
		<div id="rowSetHeight">设置行高</div>
	</div> 
	<div id="cellMenu" class="easyui-menu" style="width:120px;">
		<div id="cellCopy">复制</div>	
		<div id="cellPaste">粘贴</div>		
		<div id="cellClearContent">清除内容</div>
		<div id="cellMerge">合并单元格</div>
		<div id="cellUnmerge">取消合并单元格</div>
		<div id="formFreeze">冻结窗格</div>
	</div>
	<div style="width:0px;height:0px;">
		<textarea id="copyPasteInputId" style="display:block;width:0px;height:0px;"></textarea> 
	</div>
						
	<div id="toolbarContainerId" data-options="region:'north',border:false" style="height:56px;overflow:hidden;">	 
		<div class="gridToolbar">  
			<a id="activateDefinitionBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-edit'">启用</a>
			<a id="saveDefinitionBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">保存</a>
			<a id="propertyBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-property'">属性</a>
			<span id="excelGridNameContainerId" style="padding-left:5px;height:27px;line-height:27px;font-size:15px;font-weight:600;"></span>
			<span id="excelGridCreateTimeContainerId" style="height:27px;font-size:11px;font-weight:400;"></span>
		</div>
		<div class="gridEditbar">
			<table style="width:100%;height:27px;" cellpadding="0" cellspacing="0">
				<tr>
					<td style="width: 7px;"></td>
					<td style="width: 65px;vertical-align: top;">
						<div name="currentCellInfoDiv" style="height:25px;width:60px;line-height:25px;text-align:center;border:solid 1px #cccccc;"></div>
					</td>
					<td style="width: 30px;vertical-align: top;">
						<div name="editExpressionButton" style="width:25px;height:25px;border:solid 1px #cccccc;line-height:25px;text-align:center;cursor:default;">fx</div> 
					</td>
					<td style="vertical-align: top;"> 
						<textarea name="cellOutEditor" class="gridEditor" style="height:25px;border-width:1px;border-color:#cccccc;padding:0px;resize:none;"></textarea> 
					</td>
					<td style="width: 9px;"></td>
				</tr>
			</table>
		</div>  
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		<div id="excelGridlayoutContainerId" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">			
			<div name="topDiv" data-options="region:'north',border:false,split:false" style="height:100px;">
				<div name="topLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true"> 
					<div name="leftTopFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftTopFrozenTable" class="normalTable" style="height:100px;width:100px;">
						</table>
					</div> 
					<div name="topFrozenDiv" data-options="region:'center',border:false,split:false" style="overflow:hidden;">
						<div name="topFrozenTableContainerDiv" style="width:20px;height:100px;">
							<table name="topFrozenTable" class="normalTable" style="height:100px;width:500px;">
							</table> 
						</div>
					</div>	 
				</div> 
			</div>
			<div data-options="region:'center',border:false,split:false">  
				<div name="bottomLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">  
					<div name="leftFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftFrozenTable" class="normalTable" style="width:100px;height:520px;">
						</table>
						<div style="height:20px;"></div>
					</div> 
					<div name="mainDiv"  data-options="region:'center',border:false,split:false" id="rightBottomDivId" style="overflow:auto;"">
						<table name="mainTable"  class="normalTable" style="width:500px;height:500px;" cellspacing="0" cellpadding="0" >
						</table>
					</div>
				</div>
			</div> 
		</div>
	</div>
</body>	 
</html>