<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ include file="../../../basePage.jsp" %>
<%
	String instanceId = request.getParameter("instance");
	String createStepId = request.getParameter("step");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
	ExcelGridInstanceControl excelGridInstanceControl = (ExcelGridInstanceControl)ContextUtil.getBean("excelGridInstanceControl");
	DataRow instanceRow = excelGridInstanceControl.getInstance(ncpSession, instanceId);
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>任务处理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage">
	
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
	<script type="text/javascript" src="js/excelGridInstanceLayout.js"></script>
	<script type="text/javascript" src="js/driveToNext.js"></script>
	<script type="text/javascript" src="js/displayFlow.js"></script>
	<script type="text/javascript" src="js/end.js"></script>
	<script type="text/javascript" src="../flow/js/flowViewer.js"></script>
	<script type="text/javascript" src="../flow/js/go.js"></script>
	<script type="text/javascript" src="js/processStep.js"></script> 
	
	<script type="text/javascript" src="${dataModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${paramWinModel}/driveToNextUserSelector.js"></script> 
</head>  

<body class="easyui-layout" style="width:100%;height:100%;" id="bodyContainerId"> 
	<div class="headerTop" style="position:absolute;height:30px;left:0px;right:0px;z-index:4;">
		<div style="position:absolute;bottom:0px;top:0px;right:0px;left:0px;text-align:center;">
			<div style="position:relative;height:100%;width:600px;margin:0 auto;">  
				<div style="text-align:center;height:30px;line-height:30px;width:100%;">
					<span id="instanceTitleContainerId" style="font-size:13px;font-weight:600;"></span> 
					&nbsp;(<span id="instanceSubTitleContainerId" style="font-size:9px;font-weight:400;"></span>)
				</div>
			</div>	
		</div> 
		<div class="headerTopInner">
			<div id="headerLeftTopDiv" class="headerLeftTop" >
			<%
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
			<input type="hidden" id="instanceIdHiddenInputId" value="" />
			<a id="showFlowBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-showFlow'">查看过程</a>
			<a id="endBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-end'">设为完成</a>
			<a id="driveToNextBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-driveToNext'">发送</a>
			<a id="saveInstanceBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-save'">保存</a>
			<a id="titleBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-property'">标题</a>
		</div>	
	</div> 
	<div class="headerBottom" style="display:none;">
		<div class="headerBottomInner" style="width:100%;">
			<div class="headerLeftBottom" style="width:380px;">
				<a href="../../../../"><img class="headerLogo" src="../../images/logo.png" /></a> 
				<span class="headerSysName">数据助理</span>
				<span style="position:absolute;left:237px;top:24px;width:140px;height:30px;font-size:16px;font-weight:600;">- 任务处理</span>
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
	<div style="width:0px;height:0px;">
		<textarea id="copyPasteInputId" style="display:block;width:0px;height:0px;"></textarea> 
	</div>
	
	<jsp:include page="driveToNext.jsp"></jsp:include>
	<jsp:include page="displayFlow.jsp"></jsp:include> 
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		<div id="excelSheetListId" class="easyui-tabs" data-options="fit:true" style="display:none;">
		</div>  
	</div>   
</body>	 
</html>