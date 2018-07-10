<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../../../basePage.jsp" %>
<html>
<head>
	<meta charset="UTF-8">
	<title>感谢</title> 
		<link rel="stylesheet" type="text/css" href="thanks.css">
		<script type="text/javascript" src="thanks.js"></script>
	<script>
		$(document).ready(function(){
			var thanks = new Thanks();
			thanks.init({
				containerId: "thanksMainDivId"
			});
			
			$("#showBtnId").click(function(){
				thanks.show({
					speed: 3000,
					afterShownFunc: function(){}
				});
			}); 
		}); 
	</script>
</head>
<body>
	<div style="width:500px;height:400px;position:relative;">
		<div id="thanksMainDivId" class="thanksMainDiv">
			<table class="thanksTable">
				<tr>
					<td class="thanksTd">感谢观看!</td>
				</tr>
			</table>
			
		</div> 
	</div>
	<input id="showBtnId" type="button" value="show" style="width:100px;height:30px;" /> 
	
	
</body>
</html>