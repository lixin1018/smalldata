<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html lang="en" class="">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="imgScroller.js"></script>
	<link rel="stylesheet" type="text/css" href="imgScroller.css">
	<script>
		$(document).ready(function(){ 
			var imgScroller = new ImgScroller();
			imgScroller.init({
				containerId: "imgScrollerMainDivId",
				direction: "vertical",
				firstPageWaitTime: 2000,
				pageWaitTime:500,
				pageFadeInStepTime:50,
				pageFadeInStepCount:3,
				firstPagePosition:300,
				showCompletedFunc: function(){ 
				},
				afterShowOneImageFunc: function(index){ 
				}
			});
		});
	</script>
</head>
<body>
	<div style="width:960px; height:240px;position:relative;">
		<div id="imgScrollerMainDivId" class="imgScroller_main_div"> 
			<div class=imgScroller_pageContainer> 
				<div class=imgScroller_page> 
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">11111111111111</div>
				</div>
				<div class=imgScroller_page>
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">222222222222222</div>
				</div>
				<div class=imgScroller_page>
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">333333333333333</div>
				</div>
				<div class=imgScroller_page>
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">4444444444444444</div>
				</div>
				<div class=imgScroller_page>
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">5555555555</div>
				</div>
				<div class=imgScroller_page>
					<div class="imgScroller_pageInner"></div>
					<div class="imgScroller_pageContent">666666666666</div>
				</div>
				<div class=imgScroller_blankPage> 
				</div>
			</div>
		</div>
	</div>
</body>
</html>