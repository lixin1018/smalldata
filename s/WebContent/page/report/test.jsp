<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>testParamWin</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${paramWinModel}/testParamWin.js"></script>
	<script type="text/javascript" src="${reportModel}/testReport.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			var p = {
					containerId:"testCardContainer",
					reportModel:reportModels.testReport
				};
				var report = new NcpReport(p);
				report.show();
		});
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer">
	<div name="paramWinDiv" data-options="region:'north',border:false"> 	
		<table>
			<tr style="height:28px;">
				<td style="width:100px;text-align:right;">弹出grid</td>
				<td style="width:200px;"><input type="text" name="p1" style="width:150px;" paramCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">数值</td>
				<td style="width:200px;"><input type="text" name="p2" style="width:150px;" paramCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">日期</td>
				<td style="width:200px;"><input type="text" name="p3" style="width:150px;" paramCtrl="true"></input></td>
			</tr>
			<tr style="height:28px;">
				<td style="width:100px;text-align:right;">时间</td>
				<td style="width:200px;"><input type="text" name="p4" style="width:150px;" paramCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">布尔类型</td>
				<td style="width:200px;"><input type="checkbox" name="p5" style="width:150px;" paramCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">下拉</td>
				<td style="width:200px;"><input type="text" name="p6" style="width:150px;" paramCtrl="true"></input></td> 
			</tr>
			<tr style="height:28px;">
				<td style="width:100px;text-align:right;">弹出tree</td>
				<td style="width:200px;"><input type="text" name="p7" style="width:150px;" paramCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">tree多值</td>
				<td style="width:200px;"><input type="text" name="p9" style="width:150px;" paramCtrl="true"></input></td> 
				<td style="width:100px;text-align:right;">grid多值</td>
				<td style="width:200px;"><input type="text" name="p11" style="width:150px;" paramCtrl="true"></input></td>  
			</tr>
			<tr style="height:28px;"> 
				<td colspan="6" style="width:100px;text-align:center;"><input type="button" name="showReportBtn" id="queryBtn" value="查询" style="width:100px;height:25px;"></input></td> 
			</tr>
		</table>
	</div>   
	<div name="reportDiv" data-options="region:'center',border:false" style="border:solid 1px red;" >asdf
	</div> 
</body>	 
</html>