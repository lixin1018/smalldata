<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ include file="basePageWebExcel.jsp" %>
<%
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>WebExcel编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	 
	<link rel="stylesheet" type="text/css" href="${pagePath}/h/css/siteCommon.css"> 
	<link rel="stylesheet" type="text/css" href="${pagePath}/h/rwgl/css/excelGrid.css"> 
	<link rel="stylesheet" type="text/css" href="css/webExcelEditor.css"> 
	<script type="text/javascript" src="${plugins}/novaone/expression/excelFunctionList.js"></script>
	<script type="text/javascript" src="${plugins}/novaone/expression/excelOperatorList.js"></script>
	<script type="text/javascript" src="${pagePath}/h/rwgl/js/excelGridSheet.js"></script>	
	<script type="text/javascript" src="${pagePath}/h/rwgl/js/excelGrid.js"></script>
	<script type="text/javascript" src="${pagePath}/h/rwgl/js/excelGridLayout.js"></script>
	<script type="text/javascript" src="${pagePath}/h/rwgl/js/excelCommonFunction.js"></script>
	<script type="text/javascript" src="${pagePath}/h/rwgl/js/excelGridValidator.js"></script>
	<script type="text/javascript" src="js/webExcelLayout.js"></script> 
	<script type="text/javascript" src="js/webExcel.js"></script>
	<script type="text/javascript" src="js/cssEditor.js"></script> 
	<script type="text/javascript" src="js/viewEditor.js"></script> 
</head>  

<body class="easyui-layout" id="bodyContainerId"> 
	<div class="headerTop">  
		<jsp:include  page="../../headerTop.jsp">
			<jsp:param value="mydata" name="menuName"/>
		</jsp:include> 
	</div> 
	<div class="headerBottom">
		<div class="titleBar"> 
			<div class="titleBarInner">
				<span id="titleContainerId"></span>
			</div> 
		</div>  
		<div class="headerRightTop">   
			<input type="hidden" id="instanceIdHiddenInputId" value="" />
			<span class="toolbarSaveBtn">
				<a id="saveInstanceBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">保存</a>
			</span>
			<span class="toolbarTitleBtn">
			<a id="titleBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-property'">标题</a>
			</span>
			<span class="toolbarStyleBtn">
			<a id="styleBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-style'">样式</a>
			</span>
			<span class="toolbarViewBtn">
			<a id="viewBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-view'">视图</a>
			</span> 
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
	<div id="allMenuDiv" style="display:none;">
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