<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../../baseSitePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 	
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<link rel="stylesheet" type="text/css" href="css/play.css"> 
	<script type="text/javascript" src="js/play.js"></script>
	<script type="text/javascript" src="../../common/common.js"></script>
</head>
<body> 
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../../../h/home/headerA.jsp">
			<jsp:param value="kpdh" name="menuName"/>
		</jsp:include>
	</div> 
	<div class="sectionBlankSpace" style="border-top:solid 1px #E3E4E5;"></div>	
	<div class="sectionBlankSpace"></div>
	<div id="pageContentPlayDiv" class="pageContentPlay" >
		<div id="pageContentPlayOuterDiv" class="pageContentPlayOuter">			
			<div id="pageContentPlayInnerDiv" class="pageContentPlayInner">
				
			</div> 
		</div> 
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../../../h/common/footer.html"%>
	</div>
</body>
</html>