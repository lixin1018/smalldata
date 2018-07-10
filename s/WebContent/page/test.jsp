<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="basePage.jsp" %>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title> 
<script>
	$(document).ready(function(){	
		$(".textDiv").click(function(){
			$("#textInput").val(""); 
			$("#textInput").css("background-color", "transparent");
			$("#textInput").appendTo(this);
			$("#textInput").focus(); 
			
		});
		$("#textInput").keydown(function(){
			$("#textInput").css("background-color", "#ffffff");
		});
	});
</script>
</head>
<body>
	<div style="width:1000px;height:1000px;" id="mainDiv">
		<div class="textDiv" style="position:relative;width:100px;height:30px;">
			<div style="position:absolute;left:0px;width:100px;top:0px;height:25px;">
			11111
			</div>
		</div>
		<div class="textDiv" style="position:relative;width:100px;height:30px;">
			<div style="position:absolute;left:0px;width:100px;top:0px;height:25px;">
			222222
			</div>
		</div>
		<div class="textDiv" style="position:relative;width:100px;height:30px;">
			<div style="position:absolute;left:0px;width:100px;top:0px;height:25px;">
			333333
			</div>
		</div>
		<div class="textDiv" style="position:relative;width:100px;height:30px;">
			<div style="position:absolute;left:0px;width:100px;top:0px;height:25px;">
			444444
			</div>
		</div> 
		<input id="textInput" style="position:absolute;left:-2px;width:102px;top:0px;height:23px;background-color:transparent;border-width:0px;outline:none;" /> 
		<input type="button" value="test" id="testBtn" />
	</div>
</body>
</html>