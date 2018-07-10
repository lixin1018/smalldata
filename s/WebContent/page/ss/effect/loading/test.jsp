<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html lang="en" class="">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="loading.js"></script>
	<link rel="stylesheet" type="text/css" href="loading.css">
	<script>
		$(document).ready(function(){
			var loading = new Loading();
			loading.init({
				containerId: "loadingMainDivId"
			});
			loading.show();
		});
	</script>
</head>
<body>
	<div style="width:960px; height:540px;position:relative;">
		<div id="loadingMainDivId" class="loading_main_div">
			<img class="loading_img" src="loading.gif"> 
		 </div>
	 </div>
</body>
</html>