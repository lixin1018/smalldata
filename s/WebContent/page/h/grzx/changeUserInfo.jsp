<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>修改密码-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="数据助手,数据共享,数据工具,数据,数据抓取">  
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<link rel="stylesheet" type="text/css" href="css/changeUserInfo.css">  
	<script type="text/javascript" src="js/changeUserInfo.js"></script>	
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
	<div id="pageContentDiv" class="pageContent changeUserInfoPageContent">
		<div class="changeUserInfoMainDiv">
			<div id="innerDiv" class="changeUserInfoInputDiv">
				<div class="changeUserInfoTitle">
					修改个人信息
				</div>
				<input class="changeUserInfoInputNewCode" type="text" placeholder="请输入新的用户名"  id="nameInputId">
				<div class="changeUserInfoAlertInputNewCode" id="alertNameInputId"></div>
				
				<input class="changeUserInfoInputNewEmail" type="text" placeholder="请输入新的Email地址"  id="emailInputId">
				<div class="changeUserInfoAlertInputNewEmail" id="alertEmailInputId"\></div>
				
				<input class="changeUserInfoInputPassword" type="password" placeholder="请输入此账号的密码, 用于提交时验证"  id="pwdInputId">
				<div class="changeUserInfoAlertInputPassword" id="alertPwdInputId"></div>
				
				<div class="changeUserInfoBtn" id="changeUserInfoBtnId">确认修改</div>
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