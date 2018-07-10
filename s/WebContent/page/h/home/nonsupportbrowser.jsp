<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>错误-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">   
</head>
<body style="overflow:hidden;margin:0px;padding:0px;"> 
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../home/header.jsp">
			<jsp:param value="" name="menuName"/>
		</jsp:include>
	</div> 
	<div class="sectionBlankSpace"></div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>
	<div id="pageContentDiv" class="pageContent" style="height:480px;width:100%;background-color:#ffffff;text-align:center;">
		<div style="width:600px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;text-align:center;width:100%;height:30px;top: 200px;font-weight:600;font-size:14px;left:0px;">
				数据助理提示:<br/>
				不支持此版本的浏览器。建议使用Chrome、Firefox、IE8.0或以上版本.
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>