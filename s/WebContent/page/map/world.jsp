<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html>
<head> 
	<title>地图</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	<meta http-equiv="X-UA-Compatible" content="IE=11"></meta> 
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="map.css">  
	<script src="allNamePoints.js"></script> 
	<script>		
		function addAreaStyle(p){ 
			var codeLow = p.code.toLowerCase();
			$("path[areaName='" + codeLow + "']").css(p.style); 
		}
	
		function removeAreaStyle(p){ 
			var codeLow = p.code.toLowerCase();
			$("path[areaName='" + codeLow + "']").removeAttr("style");  
		}
			
		$(document).ready(function(){  
			$("#addAreaColorBtnId").click(function(){
				addAreaStyle({
					code: "ru",
					style:{
						"fill": "#FF6A00",
						"filter":"alpha(opacity=50)",
						"-moz-opacity":"0.50",
						"opacity":"0.50"
					}
				});
			}); 
			$("#removeAreaColorBtnId").click(function(){
				removeAreaStyle({
					code: "ru" 
				});
			});
		});	
	</script>
</head>
<body>
	<div style="width:500px;height:300px;">
    	<%@include file="worldMap.svg"%>
	</div>
	<input id="addAreaColorBtnId" type="button" value="改变颜色" style="width:100px;height:30px;" />&nbsp;<input id="removeAreaColorBtnId" type="button" value="取消颜色" style="width:100px;height:30px;" />
</body>
</html>