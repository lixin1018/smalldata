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
		height:70px;
		border-right:1px solid #000000;
		border-bottom:1px solid #000000;
		font-size:12px;
		padding:5px;
		text-align:right;
		background-color:#dddddd;
	}
</style>
<script>
	//简单的节流函数
	function throttle(func, wait, mustRun) {
	    var timeout,
	        startTime = new Date();
	 
	    return function() {
	        var context = this,
	            args = arguments,
	            curTime = new Date();
	 
	        clearTimeout(timeout);
	        // 如果达到了规定的触发时间间隔，触发 handler
	        if(curTime - startTime >= mustRun){
	            func.apply(context,args);
	            startTime = curTime;
	        // 没达到触发间隔，重新设定定时器
	        }else{
	            timeout = setTimeout(func, wait);
	        }
	    };
	};
	// 实际想绑定在 scroll 事件上的 handler
	function realFunc(){
	    console.log("Success");
	} 
	
	$(document).ready(function(){	


		// 采用了节流函数
		window.addEventListener('scroll',throttle(realFunc,500,1000));
		window.addEventListener('scroll',realFunc);
		
		var rowCount = 100;
		var colCount = 10;
		var innerHtml = "";
		for(var i=0;i<rowCount;i++){
			var top = i*(70+10 + 1); 
			for(var j=0;j<colCount;j++){
				var left = j*(120+10 + 1); 
				var tdId = "td" + i + "_" + j; 
				innerHtml +=  "<div class=\"myDiv\" id=\"" + tdId + "\" style=\"left:" + left + "px;top:" + top + "px;\">" +tdId+ "你好吗<br/>你好吗<br/>你好吗</div>";
			}
		}
		$("#mainDiv").html(innerHtml);		
		$("#mainDiv").css({
			height:rowCount*(70+10 + 1),
			width:colCount*(120+10 + 1)
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