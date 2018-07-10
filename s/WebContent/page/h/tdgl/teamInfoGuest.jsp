<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %>
<html xmlns="http://www.w3.org/1999/xhtml">

<head> 
	<title>团队</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 	  
	<script type="text/javascript" src="js/teamInfoGuest.js"></script>
	<%		 
		HttpSession httpSession = request.getSession();
		NcpSession ncpSession = new NcpSession(httpSession, false);
		boolean isOnLine = ncpSession.getIsOnline();
	%>
	<script>
		var isOnLine = <%=isOnLine ? "true" : "false"%>;
	</script>
</head>  
<body>
	<div id="pageHeaderDiv" class="pageHeader"> 
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="tdgl" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:490px;width:100%;background-color:#ffffff;text-align:center;"> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;"> 
			<div id="innerDiv" style="position:absolute;left:425px;top:20px;bottom:20px;width:400px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
			 
				<div style="position:absolute;right:0px;top:20px;height:40px;left:0px;width:350px;text-align:center;color: #f56600;font-size:24px;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;text-align:center;">
					团队信息
				</div>
				<div id="nameDivId" style="position:absolute;left:25px;top:80px;width:294px;height:22px;line-height:22px;padding:10px;display: block;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #333333;"></div>
				
				<div id="descriptionDivId" style="position:absolute;left:25px;top:140px;width:294px;height:22px;line-height:22px;padding:10px;display: block;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #333333;"></div>
				
				<div id="createUserNameDivId" style="position:absolute;left:25px;top:200px;width:294px;height:22px;line-height:22px;padding:10px;display: block;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #333333;"></div>
			   	
			   	<div id="joinTeamBtnId" style="position:absolute;left:25px;top:260px;width:294px;height:42px;line-height:42px;padding:0px;display: block;color:#333333;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;color:#ffffff;<%=isOnLine ? "cursor:pointer;background-color:#f56600;" : "background-color: #999999;" %>">申请加入</div>
				<%
					if(!isOnLine){
						String redirectUrl = CommonFunction.encode(request.getRequestURL().toString() + "?" + request.getQueryString());
				%>				
				<div style="position:absolute;left:25px;top:300px;width:294px;height:42px;line-height:42px;padding:0px;display: block;font-size:14px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				尚未登录到系统, 不能加入团队! 请 
				<a href="../home/login.jsp?loginRedirectUrl=<%=redirectUrl%>" style="text-decoration:none;color:#f56600;font-weight:600;">登录</a> 
				或 
				<a href="../home/reg.jsp?redirectUrl=<%=redirectUrl%>" style="text-decoration:none;color:#f56600;font-weight:600;">注册</a>
				</div>
				<%
					}
				%>
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