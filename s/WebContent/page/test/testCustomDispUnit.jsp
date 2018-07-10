<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../basePage.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<title>testParamWin</title>
	<script type="text/javascript" src="testCustomDispUnit.js"></script> 
	<script> 
		$(document).ready(function(){ 		 
			var paramWin = new NcpParamWin({
				containerId:"testCardContainer",
				paramWinModel:paramWinModels.testParamWin
			}); 
			paramWin.show();
			
			$("#queryBtn").click(function(){
				var result = paramWin.getParamResult();
				if(result.verified){
					
				}
				else{
					
				}
				
			});
			
			$("#customListValueInputId").listDispunit({
				idField:"code",
				textField:"name",
				columns:[[{field:"code",valueType:valueType.string,title:"code",width:100,hidden:true},
				         {field:"name",valueType:valueType.string,title:"连接方式",width:100,hidden:false}]],
				getListFunc:function(p){  
					var rows = [{code:"or", name:"或"},{code:"and", name:"且"}];
					$("#customListValueInputId").listDispunit("showList",rows);
				},
				options:{},
				style:{}}); 
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer"> 
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
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
				<td colspan="6" style="width:100px;text-align:center;"><input type="button" id="queryBtn" value="查询" style="width:100px;height:25px;"></input></td> 
			</tr>
			<tr style="height:28px;"> 
				<td style="width:100px;text-align:right;">自定义下拉值</td>
				<td style="width:200px;"><input id="customListValueInputId" name="p122"  type="text" style="width:200px;" ></input></td> 
				<td colspan="4"  style="width:200px;"></td> 
			</tr>
		</table>
	</div> 
</body>	 
</html>