<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 

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
	  
	<link rel="stylesheet" type="text/css" href="css/forgetPwd.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	
	<script type="text/javascript" src="js/forgetPwd.js"></script>	
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
					找回密码  (第一步)
				</div>
				<div class="forgetPwdInputSubTitle">
				请输入您的账号绑定的E-mail地址
				</div>
				<input class="forgetPwdInputEmail" type="text" placeholder="请输入E-Mail地址"  id="emailText">
				<div class="forgetPwdAlertInputEmail" id="alertEmailText"></div>				
				<div class="forgetPwdBtn" id="forgetPwdBtn">下一步</div>
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