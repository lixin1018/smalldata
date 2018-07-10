<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="basePage.jsp" %>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title> 
<style>
	.myTr{
		height:20px;
	}
	.myTd{
		width:120px;
		border-right:1px solid #000000;
		border-bottom:1px solid #000000;
		font-size:8px;
	}
	.myDiv{
		position:absolute;
		width:120px;
		height:20px;
		border-right:1px solid #000000;
		border-bottom:1px solid #000000;
		font-size:8px;
	}
</style>
<script>
	//简单的防抖动函数
	function debounce(func, wait, immediate) {
	    // 定时器变量
	    var timeout;
	    return function() {
	        // 每次触发 scroll handler 时先清除定时器
	        clearTimeout(timeout);
	        // 指定 xx ms 后触发真正想进行的操作 handler
	        timeout = setTimeout(func, wait);
	    };
	};
	 
	// 实际想绑定在 scroll 事件上的 handler
	function realFunc(){
	    console.log("Success");
}
	$(document).ready(function(){	

		 
		// 采用了防抖动
		//window.addEventListener('scroll',debounce(realFunc,500));
		// 没采用防抖动
		window.addEventListener('scroll',realFunc);
		
		var rowCount = 1000;
		var colCount = 50;
		var innerHtml = "";
		for(var i=0;i<rowCount;i++){
			var top = i*20; 
			for(var j=0;j<colCount;j++){
				var left = j*120; 
				var tdId = "td" + i + "_" + j;
				innerHtml +=  "<div class=\"myDiv\" id=\"" + tdId + "\" style=\"left:" + left + "px;top:" + top + "px;\">" +tdId+ "你好吗</div>";		
			}
		}
		$("#mainDiv").html(innerHtml);		
		$("#mainDiv").css({
			height:rowCount*20,
			width:colCount*120
		});
		/*
		for(var i=0;i<10000;i++){
			var trId = "tr" + i;
			$("#tableId").append("<tr class=\"myTr\" id=\"" + trId + "\"></tr>");
			
			for(var j=0;j<50;j++){
				var tdId = "td" + i + "_" + j;
				$("#" + trId).append("<td class=\"myTd\" id=\"" + tdId + "\">" +tdId+ "你好吗</td>");				
			}
		}
		*/
		/*
		$(".textDiv").click(function(){
			$("#textInput").val(""); 
			$("#textInput").css("background-color", "transparent");
			$("#textInput").appendTo(this);
			$("#textInput").focus(); 
			
		});
		$("#textInput").keydown(function(){
			$("#textInput").css("background-color", "#ffffff");
		});*/
	});
</script>
</head>
<body>
	<div style="width:100%;height:100%;overflow:auto;">
		<div style="position:relative;" id="mainDiv">
			<!-- <table cellspacing="0" cellpadding="0" id="tableId">
			</table> -->
			
		</div>
	</div>
</body>
</html>