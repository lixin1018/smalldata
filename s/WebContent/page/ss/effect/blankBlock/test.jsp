<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>Bar</title> 
		<link rel="stylesheet" type="text/css" href="bar.css">
		<script type="text/javascript" src="bar.js"></script>
	<script>
		var blankBlock = null
		$(document).ready(function(){
			blankBlock = new BlankBlock();
			blankBlock.init({ }); 
		});
	</script>
</head>
<body> 
	<div style="width:500px;height:500px;">
		<div class="blankBlockMainDiv"> 
		</div>
	</div>
</body>
</html>