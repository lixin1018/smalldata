<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%
	String userId = request.getParameter("tid");
	if(userId == null || userId.length() == 0){
		response.sendRedirect("error.jsp");
	}
%>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>找回密码-ShuJuZhuLi.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="数据助手,数据共享,数据工具,数据,数据抓取">  
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	   
	<link rel="stylesheet" type="text/css" href="css/forgetChangePwd.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
	<script type="text/javascript" src="js/forgetChangePwd.js"></script>	
</head>
<body>
	<div class="sectionBlankSpace"></div>	
	<div id="pageHeaderDiv" class="pageHeader">
		<div id="headerMainDiv" class="headerMain"> 
			<div class="headerBottom">
				<div class="headerBottomInner">
					<div class="headerLeftBottom">
						<a href="../../../"><img class="headerLogo" src="../images/logo.png" /></a> 
						<span class="headerSysName">数据助理</span>
						<span class="headerSysSubName">Power Data Helper</span>
					</div> 
				</div> 
			</div> 
		</div>
	</div>   
	<div id="pageContentDiv" class="pageContent forgetPwdPageContent">
		<div class="forgetPwdMainDiv">
			<div id="innerDiv" class="forgetPwdInputDiv">
				<div class="forgetPwdInputTitle">
					找回密码 (第二步)
				</div>
				<div class="forgetPwdInputSubTitle">
				请查收电子邮件, 获取邮件 "修改密码所需的验证码 - 数据助理" 里的验证码，并填写到下面的录入框中
				</div>
				
				<input id="userIdText" type="hidden" style="display:none;" value="<%=userId%>" />
				<input class="forgetPwdInputCode" type="text" placeholder="电子邮件里收到的验证码" id="validateCodeText">
				<div class="forgetPwdAlertInputCode" id="alertValidateCodeText"></div>
				
				<input class="forgetPwdInputPassword" type="password" placeholder="请录入新密码"  id="newPwdText">
				<div class="forgetPwdAlertInputPassword" id="alertNewPwdText"></div>
				
				<input class="forgetPwdInputConfirmPassword" type="password" placeholder="请再次录入新密码"  id="newPwdConfirmText">
				<div class="forgetPwdAlertInputConfirmPassword" id="alertNewPwdConfirmText"></div>
				
				<div class="forgetPwdBtn"  id="forgetChangePwdBtn">提交</div>
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