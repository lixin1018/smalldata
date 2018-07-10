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
	String currentStepId = request.getParameter("step");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
	ExcelGridInstanceControl excelGridInstanceControl = (ExcelGridInstanceControl)ContextUtil.getBean("excelGridInstanceControl");
	DataRow instanceRow = excelGridInstanceControl.getInstance(ncpSession, instanceId);
	String instanceTitle = instanceRow.getStringValue("title").replace("\"", "\\\"");
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
	<script type="text/javascript" src="../../js/siteCommon.js"></script>
	<script type="text/javascript" src="../../../../novaone-style/plugins/novaone/expression/excelFunctionList.js"></script>
	<script type="text/javascript" src="../../../../novaone-style/plugins/novaone/expression/excelOperatorList.js"></script>
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
	<script type="text/javascript" src="js/processMultiStep.js"></script> 
	
	<script type="text/javascript" src="${dataModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${paramWinModel}/driveToNextUserSelector.js"></script>
	<style>
		.stepListItem{position:relative;width:100%;height:48px;border-top:dashed 1px #e9eaea;}
		.stepListItemActive{background-color:#f4f4f4;font-weight:600;}
		.stepListItemTitle{position:absolute;left:26px;right:0px;top:6px;height:18px;font-size:13px;cursor:pointer;}
		.stepListItem a{text-decoration:none;color:#000000;white-space: pre;}
		.stepListItem a:hover{text-decoration:underline;color:#000000;}
		.stepListItemSelectButton{position:absolute;left:0px;top:14px;width:14px;height:14px;}
		.stepListItemCreateTime{position:absolute;left:26px;right:0px;top:24px;height:18px;font-size:11px;}
	</style> 
</head>  

<body class="easyui-layout" style="width:100%;height:100%;" id = "bodyId"> 
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" style="height:140px;">
		<div class="headerTop">
			<div class="headerTopInner">
				<div id="headerLeftTopDiv" class="headerLeftTop">
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
		</div> 
		<div class="headerBottom">
			<div class="headerBottomInner" style="width:100%;">
				<div class="headerLeftBottom" style="width:380px;">
					<a href="../../../../"><img class="headerLogo" src="../../images/logo.png" /></a> 
					<span class="headerSysName">数据助理</span>
					<span style="position:absolute;left:237px;top:24px;width:140px;height:30px;font-size:16px;font-weight:600;">- 任务处理</span>
					<span class="headerSysSubName">Power Data Helper</span>
				</div>
				<div class="headerRightBottom" style="left:380px;right:10px;"> 
					<div style="position:absolute;bottom:0px;height:25px;float:right;padding: 2px;width:100%;">
						<input type="hidden" id="instanceIdHiddenInputId" value="" />
						<input type="hidden" id="instanceTitleHiddenInputId" value="<%=instanceTitle%>" />
						<a id="showFlowBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-showFlow'">查看过程</a>
						<a id="endBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-end'">设为完成</a>
						<a id="driveToNextBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-driveToNext'">发送</a>
						<a id="saveInstanceBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-save'">保存</a>
						<a id="titleBtnId" href="#" class="easyui-linkbutton" style="float:right;display:none;" data-options="plain:true,iconCls:'icon-property'">标题</a>
					</div>	
					<div style="position:absolute;bottom:0px;height:50px;left:0px;right:300px;">  
						<div style="text-align: center;top:0px;height:25px;width:100%;">
							<span id="instanceTitleContainerId" style="padding-left:5px;height:25px;line-height:25px;font-size:15px;font-weight:600;"></span> 
						</div>
						<div style="text-align: center;top:30px;height:30px;width:100%;"> 
							<span id="instanceSubTitleContainerId" style="height:25px;line-height:25px;font-size:11px;font-weight:400;"></span>
						</div>
					</div>	
				</div> 
			</div>	 
			<div class="gridEditbar">
				<table style="width:100%;height:27px;" cellpadding="0" cellspacing="0">
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
		</div>	  
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
	<div name="stepListDiv" data-options="region:'east', border:false, title:'相关任务'" style="width:240px;position:relative;">
		<div style="position:absolute;top:0px;left:5px;right:5px;bottom:0px;">
			<div style="position:relative;width:100%;height:35px;">
				<div style="position:absolute;width:50px;height:24px;top:7px;line-height:24px;">
					<input type="checkbox" id="selectAllStepBtnId" style="position:absolute;top:3px;left:0px;width:14px;height:14px;" />
					<span style="position:absolute;top:0px;left:20px;">全选</span>
				</div>
				<a id="convergeBtnId" href="#" class="easyui-linkbutton" style="position:absolute;right:10px;top:6px;" data-options="plain:true,iconCls:'icon-converge'">合并处理</a>
			</div>
		<%
			List<DataRow> stepRows = excelGridInstanceControl.getWaitingProcessInstanceStepIdsOneInstance(ncpSession, instanceId);
			for(int i = 0; i < stepRows.size(); i++){
				DataRow stepRow = stepRows.get(i);
				String stepId = stepRow.getStringValue("id");
				String title = StringEscapeUtils.escapeHtml(stepRow.getStringValue("steptitle"));
				Date createTime = stepRow.getDateTimeValue("stepcreatetime");
				String createTimeStr = ValueConverter.dateTimeToString(createTime, "yyyy-MM-dd HH:mm:ss");
		%>
			<div class="stepListItem<%=stepId.equals(currentStepId) ? " stepListItemActive" : ""%>">
				<div class="stepListItemTitle"><a target="_self" href="processInstance.jsp?instance=<%=instanceId%>&step=<%=stepId%>"><%=title%></a></div>
				<input type="checkbox" class="stepListItemSelectButton" stepId="<%=stepId%>" />
				<div class="stepListItemCreateTime">接收时间: <%=createTimeStr%></div>
			</div>
		<%
			}
		%>
		</div>
	</div>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		<div id="instancelayoutContainerId" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">			
			<div name="topDiv" data-options="region:'north',border:false,split:false" style="height:100px;">
				<div name="topLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true"> 
					<div name="leftTopFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftTopFrozenTable" class="normalTable" style="height:100px;width:100px;">
						</table>
					</div> 
					<div name="topFrozenDiv" data-options="region:'center',border:false,split:false" style="overflow:hidden;">
						<div name="topFrozenTableContainerDiv" style="width:20px;height:100px;">
							<table name="topFrozenTable" class="normalTable" style="height:100px;width:500px;">
							</table>
						</div>
					</div>
				</div>
			</div>
			<div data-options="region:'center',border:false,split:false">
				<div name="bottomLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">
					<div name="leftFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftFrozenTable" class="normalTable" style="width:100px;height:520px;">
						</table>
						<div style="height:20px;"></div>
					</div> 
					<div name="mainDiv"  data-options="region:'center',border:false,split:false" id="rightBottomDivId" style="overflow:auto;"">
						<table name="mainTable"  class="normalTable" style="width:500px;height:500px;" cellspacing="0" cellpadding="0" >
						</table>
					</div>
				</div>
			</div> 
		</div> 
	</div> 
</body>	 
</html>