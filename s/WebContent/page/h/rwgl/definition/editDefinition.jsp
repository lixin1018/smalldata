<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ include file="../../../basePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>表格模板定义</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../css/subMenu.css"> 
	<link rel="stylesheet" type="text/css" href="../css/excelGrid.css"> 
	<script type="text/javascript" src="../../../../novaone-style/plugins/novaone/expression/excelFunctionList.js"></script>
	<script type="text/javascript" src="../../../../novaone-style/plugins/novaone/expression/excelOperatorList.js"></script>
	<script type="text/javascript" src="../js/excelGridSheet.js"></script>
	<script type="text/javascript" src="../js/excelGrid.js"></script>
	<script type="text/javascript" src="../js/excelGridLayout.js"></script>
	<script type="text/javascript" src="../js/excelCommonFunction.js"></script>
	<script type="text/javascript" src="../js/excelGridValidator.js"></script>
	<script type="text/javascript" src="js/excelGridDefinitionLayout.js"></script>
	<script type="text/javascript" src="js/editDefinition.js"></script> 
	<script type="text/javascript" src="js/cssEditor.js"></script> 
	<script type="text/javascript" src="js/viewEditor.js"></script> 
	<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
</head>  

<body class="easyui-layout" style="width:100%;height:100%;" id="bodyContainerId">
	<div class="headerTop" style="position:absolute;height:30px;left:0px;right:0px;z-index:4;">
		<div style="position:absolute;bottom:0px;top:0px;right:0px;left:0px;text-align:center;">
			<div style="position:relative;height:100%;width:600px;margin:0 auto;">  
				<div style="text-align:center;height:30px;line-height:30px;width:100%;">
					<span id="excelGridTitleContainerId" style="font-size:13px;font-weight:600;"></span> 
					&nbsp;(<span id="excelGridSubTitleContainerId" style="font-size:9px;font-weight:400;"></span>)
				</div>
			</div>	
		</div> 
		<div class="headerTopInner">
			<div id="headerLeftTopDiv" class="headerLeftTop" >
			<%				
				HttpSession httpSession = request.getSession();
				NcpSession ncpSession = new NcpSession(httpSession, false);
				if(ncpSession.getIsOnline()){
					String userName = ncpSession.getUserName();
					%>				
						<%=userName%>, &nbsp;欢迎使用数据助理&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../../home/logout.jsp" class="toLogout">退出</a>
					<% 
				}
				else{
					%>				
					欢迎使用数据助理, 请&nbsp;<a href="../../home/login.jsp" class="toLogin">登录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="../../home/reg.jsp" class="toReg">注册</a>
					<% 
				}
			%>					
			</div> 
		</div> 
		<div style="position:absolute;top:2px;right:10px;height:26px;float:right;width:400px;">  
			<a id="activateDefinitionBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-enable'">启用</a>
			<a id="saveDefinitionBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">保存</a>
			<a id="propertyBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-property'">属性</a>
			<a id="styleBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-style'">样式</a>
			<a id="viewBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-view'">视图</a>
		</div>	
	</div> 
	<div class="headerBottom" style="display:none;">
		<div class="headerBottomInner" style="width:100%;">
			<div class="headerLeftBottom" style="width:380px;">
				<a href="../../../../"><img class="headerLogo" src="../../images/logo.png" /></a> 
				<span class="headerSysName">数据助理</span>
				<span style="position:absolute;left:237px;top:24px;width:140px;height:30px;font-size:16px;font-weight:600;">- 表格模板定义</span>
				<span class="headerSysSubName">Power Data Helper</span>
			</div>
		</div>	 			
	</div>	  
	<div class="gridEditbar" style="display:none;">
		<table style="width:100%;height:27px;padding-top:1px;" cellpadding="0" cellspacing="0">
			<tr>
				<td style="width: 7px;"></td>
				<td style="width: 65px;vertical-align: top;">
					<div id="currentCellInfoDivId" style="height:25px;width:60px;line-height:25px;text-align:center;border:solid 1px #cccccc;"></div>
				</td>
				<td style="width: 30px;vertical-align: top;">
					<div id="editExpressionButtonId" style="width:25px;height:25px;border:solid 1px #cccccc;line-height:25px;text-align:center;cursor:default;">fx</div> 
				</td>
				<td style="vertical-align: top;"> 
					<input type="text" id="cellOutEditorId" class="gridEditor" style="height:25px;border:solid 1px #cccccc;padding:0px;resize:none;"></input> 
				</td>
				<td style="width: 9px;"></td>
			</tr>
		</table>
	</div>  
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" style="height:31px;width:100%;padding-top:0px;padding-left:0px;padding-right:0px;">
 	</div>  
	<div id="colMenu" class="easyui-menu" style="width:120px;">
		<div id="colCut">剪切</div>		
		<div id="colCopy">复制</div>	
		<div id="colPaste">粘贴</div>		
		<div id="colInsertBefore">此前插入</div>		
		<div id="colInsertAfter">此后插入</div>	
		<div id="colDelete">删除</div>	
		<div id="colClearContent">清除内容</div>	
		<div id="colSetWidth">设置列宽</div>
	</div> 
	<div id="rowMenu" class="easyui-menu" style="width:120px;">
		<div id="rowCut">剪切</div>		
		<div id="rowCopy">复制</div>	
		<div id="rowPaste">粘贴</div>		
		<div id="rowInsertBefore">此前插入</div>		
		<div id="rowInsertAfter">此后插入</div>	
		<div id="rowDelete">删除</div>	
		<div id="rowClearContent">清除内容</div>	
		<div id="rowSetHeight">设置行高</div>
	</div> 
	<div id="cellMenu" class="easyui-menu" style="width:120px;">
		<div id="cellCopy">复制</div>	
		<div id="cellPaste">粘贴</div>		
		<div id="cellClearContent">清除内容</div>
		<div id="cellMerge">合并单元格</div>
		<div id="cellUnmerge">取消合并单元格</div>
		<div id="formFreeze">冻结窗格</div>
	</div> 
	<div id="sheetMenu" class="easyui-menu" style="width:120px">
		<div id="sheetToPrevious">前移</div>	
		<div id="sheetToNext">后移</div>		
		<div id="sheetRename">重命名</div>
		<div id="sheetInsert">添加新工作表</div>
		<div id="sheetDelete">删除工作表</div>
	</div>
	<div id="sheetAllMenu" class="easyui-menu" style="width:120px">
		<div id="sheetAllInsert">添加新工作表</div>
	</div>
	<div style="width:0px;height:0px;">
		<textarea id="copyPasteInputId" style="display:block;width:0px;height:0px;"></textarea> 
	</div> 
	<jsp:include page="cssEditor.jsp"></jsp:include>
	<jsp:include page="viewEditor.jsp"></jsp:include>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		<div id="excelSheetListId" class="easyui-tabs" data-options="fit:true" style="display:none;">
		</div>  
	</div> 
</body>	 
</html>