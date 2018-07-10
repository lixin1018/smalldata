<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../basePage.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>文本分析</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="文本分析">
		<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
		<script>
			$(document).ready(function() {
				$("#positionButtonId").click(function(){
					position();
				});
				$("#getTFButtonId").click(function(){
					getTF();
				});
				$("#getIDFButtonId").click(function(){
					getIDF();
				});
			});
		
			function position(){
				var requestParam = {text:encodeURIComponent($("#textInputId").val())}; 
				serverAccess.request({
				 serviceName:"textAnalyzerNcpService", 
				 funcName:"position",
				 args:{
					 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
				 successFunc:function(obj){  
					 if(obj.result.succeed){ 
						 $("#positionAnalyzerResultDivId").val(decodeURIComponent(obj.result.info));
					 } 
					 else{
						 $("#positionAnalyzerResultDivId").val(decodeURIComponent(obj.result.message));
					 }
				 }
				}); 
			}
		
			function getTF(){
				var requestParam = {dir:encodeURIComponent($("#tfDirInputId").val())}; 
				serverAccess.request({
				 serviceName:"textAnalyzerNcpService", 
				 funcName:"getTF",
				 args:{
					 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
				 successFunc:function(obj){  
					 if(obj.result.succeed){ 
						 $("#getTFAnalyzerResultDivId").val(decodeURIComponent(obj.result.info));
					 } 
					 else{
						 $("#getTFAnalyzerResultDivId").val(decodeURIComponent(obj.result.message));
					 }
				 }
				}); 
			}
		
			function getIDF(){
				var requestParam = {dir:encodeURIComponent($("#idfDirInputId").val())}; 
				serverAccess.request({
				 serviceName:"textAnalyzerNcpService", 
				 funcName:"getIDF",
				 args:{
					 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
				 successFunc:function(obj){  
					 if(obj.result.succeed){ 
						 $("#getIDFAnalyzerResultDivId").val(decodeURIComponent(obj.result.info));
					 } 
					 else{
						 $("#getIDFAnalyzerResultDivId").val(decodeURIComponent(obj.result.message));
					 }
				 }
				}); 
			}
			
		</script>
	</head>
	<body class="easyui-layout" data-options="fit : true,border : false">
		<div data-options="region:'center',border:true" style="overflow:hidden;">	
			<div id="tt" class="easyui-tabs" data-options="fit:true">
				<div title="分词" > 
					<div class="easyui-layout" data-options="fit:true">
						<div data-options="region:'center'" style="overflow:hidden;">	 
							<textarea placeholder="请输入文本" id="textInputId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;"
							 value="" >这里的饮食远远不如中国的健康</textarea>
						</div> 
						<div style="width:500px;" data-options="region:'east'">
							<div class="easyui-layout" data-options="fit:true" >
							 	<div data-options="region:'north',border:false" style="height:25px;overflow:hidden;">
							 		<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">
							 			<tr style="vertical-align:bottom;text-align:center;">
							 				<td style="width:80px;">
								 				<input id="positionButtonId" type="button" value="分词 " style="width:90px;height:23px;" />
								 			</td> 					 			
							 				<td style="text-align:right;">
								 				&nbsp;
								 			</td>
							 			</tr>
							 		</table>   
							 	</div>
								<div data-options="region:'center',border:false"  style="overflow:hidden;">
									<textarea id="positionAnalyzerResultDivId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;" ></textarea>
								</div>
							 </div>
						 </div> 
					</div>
				</div>  
				<div title="TF(词频)" >
					<div class="easyui-layout" data-options="fit:true">
						<div data-options="region:'center'" style="overflow:hidden;">	 
							<textarea placeholder="请输入文件夹路径" id="tfDirInputId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;">F:\Test\TextAnalyzer</textarea>
						</div> 
						<div style="width:500px;" data-options="region:'east',border:false">
							<div class="easyui-layout" data-options="fit:true" >
							 	<div data-options="region:'north'" style="height:25px;overflow:hidden;">
							 		<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">
							 			<tr style="vertical-align:bottom;text-align:center;">
							 				<td style="width:80px;">
								 				<input id="getTFButtonId" type="button" value="获取词频 " style="width:90px;height:23px;" />
								 			</td> 					 			
							 				<td style="text-align:right;">
								 				&nbsp;
								 			</td>
							 			</tr>
							 		</table>   
							 	</div>
								<div data-options="region:'center',border:false" style="overflow:hidden;">
									<textarea id="getTFAnalyzerResultDivId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;" ></textarea>
								</div>
							 </div>
						 </div> 
					</div>
				</div>  
				<div title="IDF" >
					<div class="easyui-layout" data-options="fit:true">
						<div data-options="region:'center'" style="overflow:hidden;">	 
							<textarea placeholder="请输入文件夹路径" id="idfDirInputId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;">F:\Test\TextAnalyzer</textarea>
						</div> 
						<div style="width:500px;" data-options="region:'east',border:false">
							<div class="easyui-layout" data-options="fit:true" >
							 	<div data-options="region:'north'" style="height:25px;overflow:hidden;">
							 		<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">
							 			<tr style="vertical-align:bottom;text-align:center;">
							 				<td style="width:80px;">
								 				<input id="getIDFButtonId" type="button" value="计算IDF" style="width:90px;height:23px;" />
								 			</td> 					 			
							 				<td style="text-align:right;">
								 				&nbsp;
								 			</td>
							 			</tr>
							 		</table>   
							 	</div>
								<div data-options="region:'center',border:false" style="overflow:hidden;">
									<textarea id="getIDFAnalyzerResultDivId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;" ></textarea>
								</div>
							 </div>
						 </div> 
					</div>
				</div>  
			</div> 
		</div> 
	</body>
</html>