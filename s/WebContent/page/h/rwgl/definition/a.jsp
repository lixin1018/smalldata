<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ include file="../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>表格模板定义</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../css/subMenu.css"> 
	<link rel="stylesheet" type="text/css" href="../css/excelGrid.css">
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<script>
		$(document).ready(function(){
			$("#testBtnId").click(function(){
				$("#testDivId").css("width", "300px");
				$("#testDivId").css("height", "300px");
			});
		});
	
	</script> 
	<style>
		.mytable tr td{position:relative;
	border-left: solid 0px #CCCCCC; 
	border-top: solid 0px #CCCCCC; 
	border-bottom: solid 1px #CCCCCC; 
	border-right: solid 1px #CCCCCC; 
		}
	</style>
</head>  

<body class="easyui-layout" style="width:100%;height:100%;" id = "dataGridContainer"> 
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" > 
	<input type="button" value="test" id="testBtnId" />
	<table class="mytable" style="width:450px;height:450px;" border=0 cellSpacing="0" cellpadding="0">
		<tr style="height:149px;">
			<td style="width:149px;background-color:#444444;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				
					<div style="position:absolute;left:0px;top:0px;width:300px;height:300px;z-index:4;background-color:green;"></div>
				</div>
			</td>
			<td style="width:149px;background-color:#234567;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
			<td style="width:149px;background-color:#876544;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
		</tr>
		<tr style="height:149px;">
			<td style="width:149px;background-color:#876544;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
			<td style="width:149px;background-color:#123456;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
			<td style="width:149px;background-color:#234567;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
		</tr>
		<tr style="height:149px;">
			<td style="width:149px;background-color:#123456;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
			<td style="width:149px;background-color:#234567;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
			<td style="width:149px;background-color:#876544;">
				<div style="position:absolute;left:0px;top:0px;width:150px;height:150px;background-color:red;">				 
				</div>
			</td>
		</tr>
	</table>  
	</div> 
</body>	 
</html>