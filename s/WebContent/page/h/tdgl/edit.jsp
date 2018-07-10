<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<title>编辑团队基本信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<script type="text/javascript" src="js/edit.js"></script>
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
		<div class="pagePathContainer">			
			<div class="pagePathInner">
				<a class="pagePathNameLink" href="../home/index.jsp" target="_self">首页</a> &gt; 
				<a class="pagePathNameLink" href="../tdgl/tdgl.jsp" target="_self">团队管理</a> &gt; 
				<span class="pathPathNameText">编辑团队基本信息</span> 
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../tdgl/subMenu.jsp">
					<jsp:param value="" name="subMenuName"/>
				</jsp:include>
			</div>
			<div id="innerDiv" style="position:absolute;left:445px;top:0px;bottom:20px;width:1050px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
	 			<div style="position:absolute;right:0px;top:20px;height:40px;left:0px;width:350px;text-align:center;color: #f56600;font-size:24px;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;text-align:center;">
					修改团队基本信息
				</div>
				<input type="text" placeholder="请输入团队的新名称"  id="nameInputId" style="position:absolute;left:25px;top:80px;width:270px;height:22px;line-height:22px;padding:10px;display: block;color:#333333;font-size:100%;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;" />
				<div id="alertNameInputId" style="position:absolute;left:340px;top:80px;width:270px;height:22px;line-height:22px;padding:10px;display: block;font-size:12px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #f56600;"></div>
				
				<textarea placeholder="请输入团队简介"  id="descriptionInputId" style="position:absolute;left:25px;top:140px;width:270px;height:80px;line-height:22px;padding:10px;display: block;color:#333333;font-size:100%;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;"></textarea>
				<div id="alertDescriptionlInputId" style="position:absolute;left:340px;top:140px;width:270px;height:22px;line-height:22px;padding:10px;display: block;font-size:12px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;text-align:left;color: #f56600;"></div>
				 
				<div id="saveTeamBtnId" style="position:absolute;left:25px;top:260px;width:294px;height:42px;line-height:42px;padding:0px;display: block;color:#333333;font-size:16px;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;background-color: #f56600;color:#ffffff;cursor:pointer;">确认修改</div>
				 
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