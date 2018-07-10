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
	 			$("#deploymentId").click(function(){ 
			 		 serverAccess.request({
			 			 serviceName:"testWorkflowNcpService", funcName:"deployment", args:{requestParam:""}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
	 			$("#startProcessId").click(function(){ 
			 		 serverAccess.request({
			 			 serviceName:"testWorkflowNcpService", funcName:"startProcess", args:{requestParam:""}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
	 			$("#startProcessWithTxId").click(function(){ 
			 		 serverAccess.request({
			 			 serviceName:"testWorkflowNcpService", funcName:"startProcessWithTx", args:{requestParam:""}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
	 			$("#getMyPersonalTaskId").click(function(){ 
			 		 serverAccess.request({
			 			 serviceName:"testWorkflowNcpService", funcName:"getMyPersonalTask", args:{requestParam:""}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
	 			$("#completeTaskId").click(function(){ 
			 		 serverAccess.request({
			 			 serviceName:"testWorkflowNcpService", funcName:"completeTask", args:{requestParam:""}, 
			 			 successFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); },
			 			 failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			 		 });
	 			});
 			}); 
 		</script>
	</head>
	<body style="width: 100%; height: 100%;" > 
		<input type="button" value="deployment" id="deploymentId" />
		<br />
		<input type="button" value="startProcess" id="startProcessId" />
		<br />
		<input type="button" value="startProcessWithTx" id="startProcessWithTxId" />
		<br />
		<input type="button" value="getMyPersonalTask" id="getMyPersonalTaskId" />
		<br />
		<input type="button" value="completeTask" id="completeTaskId" />
		<br />
	</body>
</html>