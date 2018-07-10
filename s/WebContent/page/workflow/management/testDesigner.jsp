<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>绘制工作流</title>
	<meta charset="UTF-8"> 
	<script>   
		$(document).ready(function(){	 
			$("#createBtnId").click(function(){
				$("#workflowFrameId").attr("src", "workflowDesigner.jsp");
			});	 
			$("#showBtnId").click(function(){
				$("#workflowFrameId").attr("src", "workflowDesigner.jsp?workflowid=1080554b-fa51-421b-b4c7-b2cdbfbf3beb");
			});
		}); 
	</script>
</head>
<body >	 
	<a id="createBtnId" name="createBtn" href="#" >新建流程</a>
	<a id="showBtnId" name="showBtn" href="#" >显示流程</a>   
	<iframe id="workflowFrameId" style="width:900px;height:600px;">
	</iframe> 
</body>
</html>