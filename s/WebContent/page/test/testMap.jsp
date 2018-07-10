<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	
	<script> 

		var baiduMapInputParam=null;
		$(document).ready(function(){ 	
			
			
			
		});  
		
		function testBaiduMap(){
			baiduMapInputParam = {
					autoPage:true,
					afterGetResults:function(p){
						alert(p.results.length);
					}
			};
			$("#baiduFrameId").attr("src","../fruitO2O/getBaiduAddress.jsp");
		}
		
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div data-options="region:'north',border:false">	 
		 测试地图
	</div>   
	<div data-options="region:'center',border:false">   
		<div class="easyui-tabs" data-options="fit:true,plain:true">
			<div title="百度地图" >
				<table style="width:100%;height:100%;">
					<tr style="height:30px;">
						<td>
							<input type="button" value="显示地图" />
						</td>
					</tr>
					<tr>
						<td>
							<iframe id="baiduFrameId" frameborder="0" style="width:100%;height:100%;" />
						</td>
					</tr>
				</table>				
			</div>	
			<div title="腾讯地图" >  

			</div>			
		</div>
	</div>
</body>	 
</html>