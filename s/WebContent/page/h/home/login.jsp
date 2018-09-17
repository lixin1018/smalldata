<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>

<%				
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, false);
	if(ncpSession.getIsOnline()){
		response.sendRedirect("index.jsp");
		return;
	}
%>	

<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>登录-ShuJuZhuLi.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/login.css">
	<script type="text/javascript" src="js/login.js"></script>
</head>
<body>
	<div class="sectionBlankSpace"></div>	
	<div id="pageHeaderDiv" class="pageHeader">
		<div id="headerMainDiv" class="headerMain"> 
			<div class="headerBottom">
				<div class="headerBottomInner">
					<div class="headerLeftBottom">
						<a href="../../../"><img class="headerLogo" src="../images/logo.png" /></a> 
						<span class="headerSysName">ShuJuZhuLi.com</span>
						<span class="headerSysSubName">Power Data Helper</span>
					</div> 
				</div> 
			</div> 
		</div>
	</div> 
	<div id="pageContentDiv" class="pageContent loginPageContent">
		<div class="loginMainDiv">
			<div class="loginMainImageContainerDiv">
				<img class="loginMainImage" src="../images/login_main.png" />
			</div>	
		
			<div id="innerDiv" class="loginInputDiv">
				<div class="loginInputTitle">
					账号登录
				</div>
				<input type="text" placeholder="请输入账号"  id="userCodeText" class="loginInputCode">
				<input type="password" placeholder="请输入密码"  id="userPasswordText" class="loginInputPassword">
				<div id="alertDiv" class="loginAlertDiv"></div>
				<div id="loginBtn" class="loginBtn">立即登录</div>
				<div class="loginInfoDiv">
					<a href="reg.jsp" class="loginToReg">注册账号</a>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;<a href="../grzx/forgetPwd.jsp" class="loginToForgetPwd">忘记密码</a>
				</div>
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>