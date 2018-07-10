<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>${alertTitle}</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="${css}/jquery-ui-custom.css">
	<link rel="stylesheet" type="text/css" href="${css}/easyui.css">
	<link rel="stylesheet" type="text/css" href="${css}/icon.css">
	<link rel="stylesheet" type="text/css" href="${css}/main.css">

	<script type="text/javascript" src="${js}/main.js"></script>	
	
</head>
<body class="easyui-layout">
	<div id="novaoneHeader" data-options="region:'north',border:false">
		<table style="position:absolute;width:100%;height:100%;" cellspacing="0" cellpadding="0">
			<tr>
				<td id="novaoneBanner" style="background-image:url('${base}/<%=com.novacloud.novaone.core.ConfigContext.getConfigMap().get(com.novacloud.novaone.constants.NovaCloudState.NOVAONE_BANNER)%>');">&nbsp;</td>
				<td class="headerImg1">&nbsp;<td>
			</tr>
		</table>
		<div class="headerImg2"></div>
		<div id="headerContainerId" class="headerImg3"></div>
		<div id="logoutBtnId" class="headerLogout">退出</div>
	</div>
	<div data-options="region:'west',title:'我的菜单',iconCls:'icon-menu',split:true,border:true" style="width:180px;padding:0px;">
		<div id="menuContainerId" class="ncpMenuContainer"></div>
	</div>
	<div data-options="region:'center',border:true">
		<div id="contentContainerId" class="ncpMenuContainer"></div>
	</div>
<script type="text/javascript">
$(function(){
	try{
		//$.modal("<div><h1>SimpleModal</h1></div>");
		
		//alert('eeeeee');
		//$.modal("<div class=\"waiting\"></div>",{
		//	opacity:5,
		//	overlayCss: {backgroundColor:"#AABDFF"},
		//	escClose:false
		//}); 
		//iocClient.mainPageTab().showPage("editOrg","组织结构","../admin/org_Tree.jsp")
		//iocClient.mainPageTab().showPage("test","测试Struts页面","../../test!testpage.dhtml")
		//iocClient.mainPageTab().showPage("editOrg","组织结构","admin/org_Tree.jsp")
	}catch(e){
    	alert(e.message);
	}
});		
</script>	
</body>
</html>