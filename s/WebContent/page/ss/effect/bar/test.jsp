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
		var barGraphMovie = null
		$(document).ready(function(){
			barGraphMovie = new BarGraphMovie();
			barGraphMovie.init({
				containerId: "barInnerDivId",
				displayCount: 10,
				itemHeight: 20,
				itemSpaceBlankHeight: 5,
				itemTitleWidth: 100,
				itemValueWidth: 50,
				itemMaxValue: 100,
				itemBlockMaxWidth: 100	
			});
			
			$("#showBarGraphBtnId").click(function(){
				barGraphMovie.refreshGraph({
					items:[
		       			{code:"cn", title:"中国", value: 50, text: 50},
		       			{code:"us", title:"美国", value: 40, text: 40},
		       			{code:"ru", title:"俄罗斯", value: 100, text: 100}
		       		]
				});
			});	 
			$("#refreshBarGraphBtnId").click(function(){
				barGraphMovie.refreshGraph({
					items:[
		       			{code:"cn", title:"中国", value: 10, text: 10},
		       			{code:"us", title:"美国", value: 40, text: 40},
		       			{code:"ru", title:"俄罗斯", value: 100, text: 100},
		       			{code:"gb", title:"英国", value: 20, text: 20},
		       			{code:"fr", title:"法国", value: 20, text: 20}
		       		]
				});
			});
			$("#refreshBarGraphBtnId2").click(function(){
				barGraphMovie.refreshGraph({
					items:[
		       			{code:"cn", title:"中国", value: 30, text: 30},
		       			{code:"us", title:"美国", value: 60, text: 60},
		       			{code:"ru", title:"俄罗斯", value: 20, text: 20},
		       			{code:"gb", title:"英国", value: 20, text: 20},
		       			{code:"fr", title:"法国", value: 20, text: 20},
		       			{code:"jp", title:"日本", value: 100, text: 100}
		       		]
				});
			});
		});
	</script>
</head>
<body>
	<input id="showBarGraphBtnId" type="button" value="显示bar" style="width:100px;height:30px;" />
	&nbsp;<input id="refreshBarGraphBtnId" type="button" value="刷新bar" style="width:100px;height:30px;" />
	&nbsp;<input id="refreshBarGraphBtnId2" type="button" value="刷新bar2" style="width:100px;height:30px;" />
	<div style="width:500px;height:500px;">
		<div class="barMainDiv">
			<div id="barInnerDivId" class="barInnerDiv">
			<!-- 
				<div class="barItemDiv" style="top:10px;">
					<div class="barItemTitle">aaa</div>
					<div class="barItemBlock">bbb</div>
					<div class="barItemValue">ccc</div>	
					<div class="barItemBlank"></div>				
				</div>
				<div class="barItemDiv" style="top:50px;">
					<div class="barItemTitle">aaa</div>
					<div class="barItemBlock">bbb</div>
					<div class="barItemValue">ccc</div>	
					<div class="barItemBlank"></div>			
				</div>
				<div class="barItemDiv" style="top:90px;">
					<div class="barItemTitle">aaa</div>
					<div class="barItemBlock">bbb</div>
					<div class="barItemValue">ccc</div>	
					<div class="barItemBlank"></div>			
				</div>
				 -->
			</div> 
		</div>
	</div>
</body>
</html>