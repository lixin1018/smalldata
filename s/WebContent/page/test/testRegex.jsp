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
	 			$("#testRegexId").click(function(){	 				
	 				 var text = encodeURIComponent($("#textId").val());
	 				 var regTxt = encodeURIComponent($("#textRegexId").val());
	 				 var requestParam = {text:text,regTxt:regTxt}; 
			 		 serverAccess.request({
			 			 serviceName:"testService", 
			 			 funcName:"testRegex", 
			 			 args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			 			 //args:{"requestParam":requestParam}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
 			}); 
 		</script>
	</head>
	<body style="width: 100%; height: 100%;" >  
		<textarea id="textId" style="width:300px;">ab. czz.
		zd
		ef</textarea>
		<br />  
		<textarea id="textRegexId" style="width:300px;">(. )|(.
		)</textarea> 
		<br />  
		<input type="button" value="validateExp" id="testRegexId" /> 
	</body>
</html>