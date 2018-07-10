<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html lang="en" class="">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="pptSlider.js"></script>
	<link rel="stylesheet" type="text/css" href="pptSlider.css">
	<script>
		$(document).ready(function(){ 
			var pptSlider = new PPTSlider();
			pptSlider.init({
				containerId: "pptSliderMainDivId",
				firstPageWaitTime: 6000,
				pageWaitTime:1000,
				pageFadeInStepTime:100,
				pageFadeInStepCount:3,
				showCompletedFunc: function(){
					alert("aaa");
				}
			});
		});
	</script>
</head>
<body>
	<div style="width:960px; height:540px;position:relative;">
		<div id="pptSliderMainDivId" class="pptSlider_main_div"> 
			<div class=pptSlider_page> 
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
			<div class=pptSlider_page>
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
			<div class=pptSlider_page>
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
			<div class=pptSlider_page>
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
			<div class=pptSlider_page>
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
			<div class=pptSlider_page>
				<div class="pptSlider_pageInner"></div>
				<div class="pptSlider_pageContent">11111111111111</div>
			</div>
		</div>
	</div>
</body>
</html>