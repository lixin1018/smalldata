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
		<link rel="stylesheet" type="text/css" href="${css}/common.css">
		<script type="text/javascript" src="${expressionjs}/expressionEditor.js"></script> 

 		<script> 
	 		$(document).ready(function(){ 


	 			
	 			$("#eidtExpId").click(function(){

		 			var inputExpParams = {
		 					expText:$("#expressionInputId").val(), 
		 					needResultType:valueType.string,
		 					userParameters:[
		 					                {name:"p1", valueType:valueType.string, description:"参数1"},
		 					                {name:"p2", valueType:valueType.decimal, description:"参数2"}
		 					                ],
		 					returnFunc:function(p){
		 						if(p.succeed){
		 							$("#expressionInputId").val(p.expText);
		 						}
		 					},
		 					runAt:expRunAt.js
		 				};
		 			var expEditor =new ExpressionEditor();
		 			expEditor.show(inputExpParams);
	 			});
 			}); 
 		</script>
	</head>
	<body style="width: 100%; height: 100%;" >  
		<input type="text" value="" id="expressionInputId" style="width:300px;"/>
		<br />  
		<input type="button" value="editExp" id="eidtExpId" /> 
	</body>
</html>