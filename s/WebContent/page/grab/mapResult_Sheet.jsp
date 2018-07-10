<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>地图数据抓取结果</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/grab_mapresult.js"></script>
	<script type="text/javascript" src="${viewModel}/grab_mapresult.js"></script>
	<script type="text/javascript" src="${dataModel}/grab_mapresultline.js"></script>
	<script type="text/javascript" src="${viewModel}/grab_mapresultline.js"></script>
	<script type="text/javascript" src="${sheetModel}/mapresult.js"></script>
	
	<script> 
		$(document).ready(function(){ 	
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl; 
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
						<td style="width:50px;height:22px;text-align:right;">编码</td>
						<td style="width:200px;height:22px;"><input type="text" name="code" class="easyui-validatebox" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">开始时间</td>
						<td style="width:200px;height:22px;"><input type="text" name="begintime" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">完成时间</td>
						<td style="width:200px;height:22px;"><input type="text" name="endtime" style="width:200px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:25px;">
						<td style="width:50px;height:22px;text-align:right;">抓取类型</td>
						<td style="width:200px;height:22px;"><input type="text" name="grabtype" style="width:200px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:50px;height:22px;text-align:right;">总行数</td>
						<td style="width:200px;height:22px;"><input type="text" name="rowcount" style="width:200px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:50px;height:22px;text-align:right;">抓取人</td>
						<td style="width:200px;height:22px;"><input type="text" name="grabuser" style="width:200px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
					<tr style="height:25px;">
						<td style="text-align:right;">描述</td>
						<td colspan="5"><input type="text" name="description" style="width:850px;height:22px;" cardCtrl="true"></input></td> 
					</tr> 
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="抓取结果明细" class="ncpCardTab">   
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
				</div>  
			</div> 
		</div>
	</div>
</body>	 
</html>