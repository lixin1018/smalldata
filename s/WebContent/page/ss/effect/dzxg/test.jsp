<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>打字效果</title> 
		<link rel="stylesheet" type="text/css" href="dzxg.css">
		<script type="text/javascript" src="dzxg.js"></script>
	<script>
		$(document).ready(function(){  
			autoType({
				elementClass: ".dzxgType-js",
				typingSpeed: 200,
				afterTypedFunc: function(){
					alert("aaa");
				}
		  	});
		 }); 
	</script>
</head>
<body>
	<div style="width:960px;height:540px;position:relative;">
		<div class="dzxgMainDiv">
			<div class="dzxgType-js dzxgHeadline"><div class="dzxgCursor"></div>
				<h1 class="dzxgText-js dzxgTextH">数说系列——恐龙有多大</h1>
			</div>
		</div>
	</div>
</body>
</html>