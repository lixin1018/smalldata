<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html>
<head> 
	<title>搜索百度地图</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<link rel="stylesheet" type="text/css" href="${css}/jquery-ui-custom.css">
	<link rel="stylesheet" type="text/css" href="${css}/easyui.css">
	<link rel="stylesheet" type="text/css" href="${css}/icon.css">
	
	<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=W3PPL28Mdgmb9PNV0yxAXYUw"></script>
	
	<script type="text/javascript" src="${paramWinModel}/searchMap.js"></script>  
	<script type="text/javascript" src="js/getBaiduObjects.js"></script>
	<script>
		var baiduMap;
		var autoPage = false;
		var afterGetResults = null;

		$(document).ready(function() {	
			 
			if(window.parent != null){
				var initParam = window.parent.baiduMapInputParam; 
				if(initParam != null){
					autoPage = initParam.autoPage;
					afterGetResults = initParam.afterGetResults;
				}
			}
			
			baiduMap = new NcpBaiduMap();			
			baiduMap.init({
				containerId:"mapContainerId"
			});
			
			//初始化参数录入框
			paramWin = new NcpParamWin({
				containerId: "parameterInputId",
				paramWinModel: paramWinModels.searchMap
			}); 
			paramWin.show();  
			
			//绑定按钮
			$("#searchAddressButtonId").click(function(){
				searchMap();
			});			
		}); 

		//搜索地图
		function searchMap(){ 		
			//获取录入的查询条件值
			var result = paramWin.getParamResult();	
			
			//如果必填项已经填写
			if(result.verified){ 
				$("#searchResultInfo").html("正在搜索......");
				var adds = baiduMap.searchInBounds({
					keywords: result.values.keywords,
					posAX: result.values.posAX,
					posAY: result.values.posAY,
					posBX: result.values.posBX,
					posBY: result.values.posBY,
					afterGetResults: function(p){
						if(afterGetResults != null){
							$("#searchResultInfo").html("搜索完成, 共获取 " + p.results.length + " 条记录");
							afterGetResults(p);
						}
					},
					renderContainerId: "searchResultId"
				});
				
			}			
		}	
		
	</script>

</head>
<body class="easyui-layout">
	<div data-options="region:'north'" style="height:30px;">
		百度地图 
	</div>
	<div id="parameterInputId" data-options="region:'west',title:'参数',split:true" style="width:180px;">
		<table cellspacing="0" cellpadding="0" style="width:100%;height:100%;padding:5px;">
			<tr style="height:30px;">
				<td colspan="3">关键字:</td> 
			</tr>
			<tr style="height:30px;">
				<td><input type="text" id="keywordInputId" name="keywords" paramCtrl="true"  style="width:150px;height:25px;" /></td>
			</tr>
			<tr style="height:30px;"> 
				<td colspan="3">坐标A(左上): </td> 
			</tr>
			<tr style="height:30px;">
				<td><input type="text" id="posAXId" name="posAX" paramCtrl="true" style="width:150px;height:25px;" /></td>
			</tr>
			<tr style="height:30px;">
				<td><input type="text" id="posAYId" name="posAY" paramCtrl="true" style="width:150px;height:25px;" /></td>
				<td></td>
			</tr>
			<tr style="height:30px;"> 
				<td colspan="3">坐标B(右下): </td> 
			</tr>
			<tr style="height:30px;"> 
				<td><input type="text" id="posBXId" name="posBX" paramCtrl="true" style="width:150px;height:25px;" /></td>
			</tr>
			<tr style="height:30px;"> 
				<td><input type="text" id="posBYId" name="posBY" paramCtrl="true" style="width:150px;height:25px;" /></td>
			</tr>
			<tr style="height:30px;"> 
				<td><input type="button" id="searchAddressButtonId" value="搜 索"  style="width:150px;height:25px;"/></td> 
			</tr>
			<tr style="height:30px;"> 
				<td id="searchResultInfo">&nbsp;</td> 
			</tr>
			<tr> 
				<td>&nbsp;</td> 
			</tr>
		</table>
	</div>
	<div data-options="region:'center',title:'百度地图',border:true">
		<div id="mapContainerId" style="width:100%;height:100%;"></div>
	</div> 
	<div data-options="region:'east',title:'查询结果',split:true" style="width:240px;">
		<div id="searchResultId" style="width:100%;height:100%;"></div>		
	</div>
</body> 
</html>