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

<%@ include file="../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>登录-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css"> 
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
						<span class="headerSysName">数据助理</span>
						<span class="headerSysSubName">Power Data Helper</span>
					</div> 
				</div> 
			</div> 
		</div>
	</div> 
	<div id="pageContentDiv" class="pageContent" style="height:480px;width:100%;background-color:#14212A;text-align:center;">
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px; top:30px;bottom:0px;width:800px;">
				<img src="../images/login_main.png" style="width:800px;height:400px;margin:1px auto;" />
			</div>	
		
			<div id="innerDiv" style="position:absolute;right:20px;top:50px;bottom:50px;width:350px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				<div style="position:absolute;right:0px;top:20px;height:40px;left:0px;text-align:center;color: #f56600;font-size:24px;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;">
					账号登录
				</div>
				<input type="text" placeholder="请输入账号"  id="userCodeText" style="position:absolute;left:25px;top:80px;width:270px;height:22px;line-height:22px;padding:10px;display: block;color:#333333;font-size:100%;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				<input type="password" placeholder="请输入密码"  id="userPasswordText" style="position:absolute;left:25px;top:140px;width:270px;height:22px;line-height:22px;padding:10px;display: block;color:#333333;font-size:100%;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				<div id="alertDiv" style="position:absolute;left:25px;top:175px;width:270px;height:22px;line-height:22px;padding:10px;display: block;color:#333333;font-size:12px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #f56600;"></div>
				<div id="loginBtn" style="position:absolute;left:25px;top:210px;width:294px;height:42px;line-height:42px;padding:0px;display: block;color:#333333;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;background-color: #f56600;color:#ffffff;cursor:pointer;">立即登录</div>
				<div style="position:absolute;left:25px;top:250px;width:294px;height:42px;line-height:42px;padding:0px;display: block;font-size:11px;color: #999999;">
					<a href="reg.jsp" style="color: #999999;text-decoration: none;">注册账号</a>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;<a href="forgetPwd.jsp" style="color: #999999;text-decoration: none;">忘记密码</a>
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