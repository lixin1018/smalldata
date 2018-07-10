<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html>
<head> 
	<title>地图</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<script src="drawMap.js"></script>
	<script src="710000_L1.js"></script>
	<script>		
		$(document).ready(function(){
			var boundaryInfo = boundaryList["710000_L1"];
 
			drawMapBoundary({
				boundaryInfo: boundaryInfo,
				canvasWidth: 800,
				canvasHeight: 800,
				borderWidth: 10,
				svgElementId: "testSvg1"
			});
			
		});	
	</script>
</head>
<body>
    <svg id="testSvg1" xmlns="http://www.w3.org/2000/svg" version="1.1" height="800" width="800">  
    </svg>
</body>
</html>