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
	 			$("#validateExpId").click(function(){	 				
	 				 var exp = encodeURIComponent($("#expressionInputId").val());
	 				 var requestParam = {runAt:expRunAt.server,expression:exp}; 
			 		 serverAccess.request({
			 			 serviceName:"expressionNcpService", 
			 			 funcName:"validateExp", 
			 			 args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			 			 //args:{"requestParam":requestParam}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			}); 
	 			$("#validateJsExpId").click(function(){	 				
	 				 var exp = encodeURIComponent($("#expressionInputId").val());
	 				 var requestParam = {runAt:expRunAt.js,expression:exp}; 
			 		 serverAccess.request({
			 			 serviceName:"expressionNcpService", 
			 			 funcName:"validateJsExp", 
			 			 args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			 			 //args:{"requestParam":requestParam}, 
			 			 successFunc:function(obj){ 
			 				 	alert(cmnPcr.jsonToStr(obj)); 
			 				 	var exp = decodeURIComponent(obj.result.jsCode);
			 					alert(exp);
			 					var result = eval(exp);
			 					alert(result);
			 				 },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			}); 
	 			$("#runJsExpId").click(function(){	 				
	 				 var exp = encodeURIComponent($("#expressionInputId").val());
	 				 var requestParam = {runAt:expRunAt.js,
	 						 expression:exp,
	 						 parameters:[{name:"p1", valueType:"java.math.BigDecimal"},{name:"p2", valueType:"java.math.BigDecimal"}]}; 
			 		 serverAccess.request({
			 			 serviceName:"expressionNcpService", 
			 			 funcName:"validateJsExp", 
			 			 args:{requestParam:cmnPcr.jsonToStr(requestParam)}, 
			 			 //args:{"requestParam":requestParam}, 
			 			 successFunc:function(obj){ 
			 				 	alert(cmnPcr.jsonToStr(obj)); 
			 				 	var exp = decodeURIComponent(obj.result.jsCode);
			 					alert(exp);
			 					var expRunner = new ExpressionRunner();
			 					var result = expRunner.run({p1:123,p2:100}, exp);
			 					alert(result);
			 				 },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			}); 
	 			$("#runExpId").click(function(){	 				
	 				 var exp = encodeURIComponent($("#expressionInputId").val());
	 				 var requestParam = {runAt:expRunAt.server,expression:exp}; 
			 		 serverAccess.request({
			 			 serviceName:"expressionNcpService", 
			 			 funcName:"runExp",			 			 
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
		<input type="text" value="" id="expressionInputId" style="width:300px;"/>
		<br />  
		<input type="button" value="validateExp" id="validateExpId" />
		<br />  
		<input type="button" value="validateJsExp" id="validateJsExpId" />
		<br />  
		<input type="button" value="runExp" id="runExpId" />
		<br />  
		<input type="button" value="runJsExp" id="runJsExpId" />
		<br /> 
	</body>
</html>