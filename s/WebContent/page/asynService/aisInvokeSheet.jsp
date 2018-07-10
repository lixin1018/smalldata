<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>流程信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/ais_Invoke.js"></script>
	<script type="text/javascript" src="${viewModel}/ais_Invoke.js"></script>
	<script type="text/javascript" src="${dataModel}/ais_InvokeParameter.js"></script>
	<script type="text/javascript" src="${viewModel}/ais_InvokeParameter.js"></script>
	<script type="text/javascript" src="${sheetModel}/aisInvoke.js"></script>
	
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
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false" style="overflow:hidden;">
				<table>
					<tr style="height:25px;">
						<td style="width:80px;height:22px;text-align:right;">创建时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">调用时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="invoketime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">结束时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="endtime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:25px;">
						<td style="width:80px;height:22px;text-align:right;">服务名</td>
						<td style="width:150px;height:22px;"><input type="text" name="servicename" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">状态</td>
						<td style="width:150px;height:22px;"><input type="text" name="statustype" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">创建人</td>
						<td style="width:150px;height:22px;"><input type="text" name="username" style="width:150px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:75px;">
						<td style="text-align:right;">备注</td>
						<td style="width:950px;height:200px;" colspan="7"><textarea name="note" style="width:950px;height:200px;" cardCtrl="true"></textarea></td>
					</tr>
					<tr style="height:25px;">
						<td style="width:80px;height:22px;text-align:right;">调用来源</td>
						<td style="width:150px;height:22px;"><input type="text" name="fromname" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">调用来源标示</td>
						<td style="width:150px;height:22px;"><input type="text" name="fromid" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:80px;height:22px;text-align:right;">&nbsp;</td>
						<td style="width:150px;height:22px;">&nbsp;</td>
					</tr>
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="参数" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="parameter" data-options="fit:true" id="testCardContainer2">
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