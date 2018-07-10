<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>预算表在线编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">  
	<script type="text/javascript"> 
		$(document).ready(function(){ 
			$("#checkExpId").click(function(){
				var exp = $("#inputExpId").val();
				var allParts = checkExp(exp);
				findFunction(allParts);
				findCellReference(allParts);
				
				var str = "";
				for(var i=0;i<allParts.length;i++){
					var p = allParts[i];
					str += (p.value + "\r\n" + p.type +", " + p.valueType 
							+ (p.cellRefInfo == null ? "" : ("\r\n" + cmnPcr.jsonToStr(p.cellRefInfo))) 
							+ (p.fromCellRefInfo == null ? "" : ("\r\n" + cmnPcr.jsonToStr(p.fromCellRefInfo)) + (p.toCellRefInfo == null ? "" : cmnPcr.jsonToStr(p.toCellRefInfo))) + "\r\n\r\n");
				}
				$("#checkResultId").val(str);
			});
		});

	</script> 
</head>  
<body id="testGridContainer">
	<input type="text" id="inputExpId" value="aaaaaaaaa+'aaaaaaa'!$A$1:$BBB$222 + aasdf(asdfsaf,asfdasfd)/222" style="width:500px;"/>
	<input type="button" id="checkExpId" value="Check"/>
	<br>
	<textarea id="checkResultId" style="width:800px;height:500px;"></textarea>
</body>	 
</html>