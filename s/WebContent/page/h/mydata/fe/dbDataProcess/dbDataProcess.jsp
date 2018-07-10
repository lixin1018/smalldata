<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.control.ExeControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.exe.ExeConfig" %> 
<%@ include file="../../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<%
	String exeId = request.getParameter("exeid");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true);  
%> 
<head> 
	<title>处理飞行员匹配问题umassd</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
	<script>
		$(document).ready(function(){
			$("#matchPersonBtnId").click(function(){
				var requestParam = { };	
				serverAccess.request({
					waitingBarParentId: "pageContentDiv",
					serviceName:"dbDataProcessNcpService", 
					funcName:"matchedPerson", 
					args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
					successFunc:function(obj){ 
						alert("执行完成.");
					} 
				}); 				
			});
		});
	</script>
</head>
<body>   
	<div id="pageContentDiv" class="pageContent" style="height:100%;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="width:100%;position:relative;height:100%;margin:1px auto;">
 			<div style="position:absolute;left:100px;right:100px;height:100%;" id = "testGridContainer"> 
 				<input id="matchPersonBtnId" type="button" value="执行匹配" />
			</div> 
		</div> 
	</div>  
</body>
</html>