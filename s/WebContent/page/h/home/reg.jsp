<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 

<%@ include file="../../baseSitePage.jsp" %>
<%
	response.sendRedirect("cannotReg.jsp");
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>注册-ShuJuZhuLi.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="数据助手,数据共享,数据工具,数据,数据抓取">  
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	 
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/reg.css">  
	<script type="text/javascript" src="js/reg.js"></script>	 	
</head>
<body>
	<div class="sectionBlankSpace"></div>	
	<div id="pageHeaderDiv" class="pageHeader">
		<div id="headerMainDiv" class="headerMain"> 
			<div class="headerBottom">
				<div class="headerBottomInner">
					<div class="headerLeftBottom">
						<img class="headerLogo" src="../images/logo.png" />
						<span class="headerSysName">数据助理</span>
						<span class="headerSysSubName">Power Data Helper</span>
					</div> 
				</div> 
			</div> 
		</div>
	</div> 
	<div id="pageContentDiv" class="regPageContent">
		<div class="regMainDiv">
			<div id="regInputDiv" class="regInputDiv">
				<div class="regInputTitle">
					注册数据助理账号
				</div>
				<input type="text" placeholder="请输入账号"  id="userCodeText" class="regInputCode">
				<div id="alertUserCodeText" class="regAlertInputCode"></div>
				
				<input type="password" placeholder="请输入密码"  id="userPasswordText" class="regInputPassword">
				<div id="alertUserPasswordText" class="regAlertInputPassword"></div>
				
				<input type="password" placeholder="请再输入一次密码"  id="userPasswordConfirmText" class="regInputConfirmPassword">
				<div id="alertUserPasswordConfirmText" class="regAlertInputConfirmPassword"></div>
				
				<input type="text" placeholder="请输入E-Mail地址"  id="emailText" class="regInputEmail">
				<div id="alertEmailText" class="regAlertInputEmail"></div>
				
				<input type="text" placeholder="图片验证码"  id="imgCodeText" class="regInputImgCode">
				<img id="imgCodeImage" src="" class="regCodeImage" />
				<div id="alertImgCodeText" class="regAlertCodeImage"></div>
				
				<div id="regBtn" class="regBtn">立即注册</div>
				<div class="regInfoDiv">
					<a href="login.jsp" class="regToLogin">已有账号</a>
				</div>
			</div>
		</div>
	</div>  
	<div class="sectionBlankSpaceBottomBorder"></div> 
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>