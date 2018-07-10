<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>随机显示块</title> 
		<link rel="stylesheet" type="text/css" href="randomBlock.css">
		<script type="text/javascript" src="randomBlock.js"></script>
	<script>
		$(document).ready(function(){ 
			var randomBlock = new RandomBlock();
			randomBlock.init({
				containerId: "randomBlockMainDivId",
				fadeInTime: 500,
				fadeOutTime: 5000,
				blockIntervalTime:1000,
				showCompletedFunc: function(){
					
				},
				afterShowOneBlockFunc: function(blockIndex, areaCodeStr){
					
				}
			});
		 }); 
	</script>
</head>
<body>
	<div style="width:960px;height:540px;position:relative;background-color:#BFE4FF;">
		<div id="randomBlockMainDivId" class="randomBlockMainDiv">
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">11111111111111</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">2222</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">333333333333</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
				<div class="randomBlock_div"> 
					<div class="randomBlock_divInner"></div>
					<div class="randomBlock_divContent">44444444</div>
				</div>
		</div>
	</div>
</body>
</html>