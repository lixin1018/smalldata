<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>个人信息-个人中心</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="数据助手,数据共享,数据工具,数据,数据抓取">  
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	  
	<link rel="stylesheet" type="text/css" href="css/grzx.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<script type="text/javascript" src="js/grzx.js"></script>	
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../home/headerA.jsp">
			<jsp:param value="grzx" name="menuName"/>
		</jsp:include>
	</div>
	<div id="pageContentDiv" class="pageContent grzxPageContent">
		<div class="grzxMainDiv">
			<div id="innerDiv" class="grzxInputDiv">
				<div class="grzxPhoto">
					<img class="grzxPhotoImage" src="images/photo.jpg" />
				</div>
				<div class="grzxUserName" id="userNameDivId">
				</div>
				<div class="grzxCodeTitle">
					账号:&nbsp;<span class="grzxUserCode" id="userCodeDivId"></span>	
				</div> 	
				<a class="grzxChangeUserInfo" id="changeUserInfoBtn" href="../grzx/changeUserInfo.jsp">修改个人信息&nbsp;&gt;&gt;</a>
				<a class="grzxChangePwd" id="changePwdBtn" href="../grzx/changePwd.jsp">修改密码&nbsp;&gt;&gt;</a>
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>