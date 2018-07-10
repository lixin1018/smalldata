<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>处理团队加入申请</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<script type="text/javascript" src="${dataModel}/tm_JoinProcess.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_JoinProcess.js"></script> 
	<script type="text/javascript" src="js/processJoin.js"></script>
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
				<span class="pathPathNameText">处理加入请求</span> 
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../tdgl/subMenu.jsp">
					<jsp:param value="" name="subMenuName"/>
				</jsp:include>
			</div>
			<div id="innerDiv" class="easyui-layout"  style="position:absolute;left:170px;top:0px;bottom:20px;width:1050px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
					<span class="ncpCardToolbar">
						<a id="showTeamBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">查看团队信息</a>
					</span>
				</div>
				<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
					<table name="gridCtrl" ></table>  
				</div>  
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