<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>消息通知</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<script type="text/javascript" src="${dataModel}/d_UserMessage.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserMessage.js"></script>
	<script type="text/javascript" src="${sheetModel}/userMessage.js"></script>
	<script type="text/javascript" src="js/userMessageList.js"></script>
</head>  
<body>
	<div id="pageHeaderDiv" class="pageHeader"> 
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="grzx" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:490px;width:100%;background-color:#ffffff;text-align:center;">
		<div class="pagePathContainer">			
			<div class="pagePathInner">
				<a class="pagePathNameLink" href="../home/index.jsp" target="_self">首页</a> &gt; 
				<a class="pagePathNameLink" href="../grzx/grzx.jsp" target="_self">个人中心</a> &gt; 
				<span class="pathPathNameText">消息通知</span> 
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../grzx/subMenu.jsp">
					<jsp:param value="userMessage" name="subMenuName"/>
				</jsp:include>
			</div>
			<div id="innerDiv" class="easyui-layout"  style="position:absolute;left:170px;top:0px;bottom:20px;width:1050px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
			 	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" >	 
					<span class="ncpGridToolbar">
						<a id="markAllReadBtnId" name="markAllReadBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-mark'">全部设为已读</a> 
					</span>
					<span class="ncpGridSearchBar">
						<input id="searchCtrl" name="searchCtrl" class="easyui-searchbox" style="width: 110px;" data-options="prompt:'模糊查询'"></input>
					</span>
				</div>   
				<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   
					<table name="gridCtrl" ></table> 
				</div>
			 	<div class="ncpGridToolbarContainer" data-options="region:'south',border:false" > 
					<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
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