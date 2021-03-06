﻿<!DOCTYPE html>
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
	<script src="drawMap.js"></script>
	<script src="allDistrictMainPoints.js"></script>
	<script src="allNamePoints.js"></script>
	<script src="cchina_L1.js"></script>
	<script>		
		$(document).ready(function(){
			var boundaryInfo = boundaryList["中国_L1"]; 
			drawMapBoundary({
				boundaryInfo: boundaryInfo,
				allNamePoints: allNamePoints,
				allDistrictMainPoints: allDistrictMainPoints,
				canvasWidth: 1000,
				canvasHeight: 800,
				borderWidth: 10,
				svgElementId: "testSvg1"
			}); 
		});	
	</script>
</head>
<body>
    <svg id="testSvg1" xmlns="http://www.w3.org/2000/svg" version="1.1" height="800" width="1000">   
    </svg>
</body>
</html>