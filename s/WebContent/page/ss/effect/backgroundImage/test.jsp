<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html lang="en" class="">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="fog.js"></script>
	<link rel="stylesheet" type="text/css" href="fog.css">
	<script>
		$(document).ready(function(){
			var fog = new Fog();
			fog.init({
				containerId: "fogMainDivId"
			});
		});
	</script>
</head>
<body>
	<div style="width:960px; height:540px;position:relative;">
		<div id="fogMainDivId" class="fog_main_div">
			<img class="fogBackground" src="senlin.jpg">
			<div class="fog_u-full-width">
			  <center>
			    <canvas class="fogCanvas" ></canvas>
			  </center>
			</div> 
		 </div>
	 </div>
</body>
</html>