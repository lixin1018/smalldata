<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>

<%				
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, false);
	ncpSession.invalidate(); 
	response.sendRedirect("index.jsp");	
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>首页-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
</head>
<body>
	<div class="sectionBlankSpace"></div>	 
</body>
</html>