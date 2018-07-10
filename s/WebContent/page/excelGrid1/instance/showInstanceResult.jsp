<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>预算表在线编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	<link rel="stylesheet" type="text/css" href="../css/excelGrid.css">
	<script type="text/javascript" src="../js/excelGrid.js"></script>
	<script type="text/javascript"> 
		var egl = null; 
		$(document).ready(function(){			
			var queryStrings = cmnPcr.getQueryStringArgs();
			var name = decodeURIComponent(queryStrings["name"]);
			var instanceId = queryStrings["instanceid"];  

			$("#instanceNameId").text(name);
			$("#instanceId").text("(instance:" + instanceId + ")");
			
			egl = new ExcelGridInstanceResultLayout();
			egl.loadFromServer({
				instanceId: instanceId, 
				afterLoadFunc: function(){
					egl.show({
						containerId: "excelGridlayoutContainerId",
						toolbarContainerId: "toolbarContainerId"
					});
				}
			});	
		});		
	</script> 
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id="testGridContainer">
	<div id="toolbarContainerId" data-options="region:'north',border:false" style="height:56px;overflow:hidden;">	 
		<div class="gridToolbar">  
			<span id="instanceNameId" style="padding-left:5px;height:27px;line-height:27px;font-size:15px;font-weight:600;"></span>
			<span id="instanceId" style="height:27px;font-size:11px;font-weight:400;"></span>
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
					<td></td>
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