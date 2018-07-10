<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../basePage.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>用户</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">

 		<script>
 
	 		$(document).ready(function(){
	 			$("#openTabId").click(function(){  
	 				//参数为id, name, url, closable
	 				parent.iocClient.mainPageTab().showPage("baidu","百度","http://www.baidu.com",true);
	 			}); 
 			}); 
 		</script>
	</head>
	<body style="width: 100%; height: 100%;" > 
		<input type="button" value="打开新Tab" id="openTabId" />
		<br /> 
	</body>
</html>