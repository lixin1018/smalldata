<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>淡入淡出</title> 
		<link rel="stylesheet" type="text/css" href="fadeInOut.css">
		<script type="text/javascript" src="fadeInOut.js"></script>
	<script>
		$(document).ready(function(){
			var fadeInOut = new FadeInOut();
			fadeInOut.init({
				containerId: "fadeInOutDivId"
			});
			
			$("#fadeInBtnId").click(function(){
				fadeInOut.fadeIn();
			});
			
			$("#fadeOutBtnId").click(function(){
				fadeInOut.fadeOut();
			});
		}); 
	</script>
</head>
<body>
	<div style="width:500px;height:400px;position:relative;">
		<div id="fadeInOutDivId" class="fadeInOutMainDiv">
		</div>
		<div style="position:absolute;left:0px;right:0px;top:0px;bottom:0px">
			啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
		</div>
	</div>
	<input id="fadeInBtnId" type="button" value="fadeIn" style="width:100px;height:30px;" />
	&nbsp;<input id="fadeOutBtnId" type="button" value="fadeOut" style="width:100px;height:30px;" />
	
	
</body>
</html>