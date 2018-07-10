<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %> 
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %> 
<%@ page import="com.novacloud.novaone.dataFile.control.DataFileControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.RootDirType" %> 

<%@ include file="../../basePage.jsp" %>
<%
	String sendId = request.getParameter("s");
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
	DataFileControl dataFileControl = (DataFileControl)ContextUtil.getBean("dataFileControl");
	DataRow sendRow = null;
	String errorInfo = "";
	
	String sendTimeStr = "";
	String message = "";
	Boolean hasBringBack = false;
	String toUserIds = "";
	String toUserNames = "";
	String toUserEmails = "";
	String fileIdStr = "";
	String bringBackTimeStr = ""; 
	List<DataRow> fileRows = null;
	String sendDirId = "";
	
	try{
		sendRow = dataFileControl.getSendInfo(ncpSession, sendId); 
		sendDirId = dataFileControl.getSendDirId(ncpSession);

		sendTimeStr = ValueConverter.dateTimeToString(sendRow.getDateTimeValue("sendtime"), "yyyy-MM-dd HH:mm");
		message = sendRow.getStringValue("message");
		hasBringBack = sendRow.getBooleanValue("hasbringback");		
		toUserIds = sendRow.getStringValue("touserids");
		toUserNames = sendRow.getStringValue("tousernames");
		toUserEmails = sendRow.getStringValue("touseremails");
		fileIdStr = sendRow.getStringValue("fileids");
		bringBackTimeStr = ValueConverter.dateTimeToString(sendRow.getDateTimeValue("bringbacktime"), "yyyy-MM-dd HH:mm");
		
		String[] fileIds = fileIdStr.split(";");
		List<String> fileIdList = new ArrayList<String>();
		for(int i = 0; i < fileIds.length; i++){
			String fileId = fileIds[i].trim();
			fileIdList.add(fileId);
		}
		fileRows = dataFileControl.getFileInfos(ncpSession, fileIdList);
	}
	catch(Exception ex){
		errorInfo = ex.getMessage();
	}
%>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>发送信息详情-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="css/si.css">
	<script type="text/javascript" src="js/si.js"></script>
	<script type="text/javascript" src="js/saveAndDirSelectWindow.js"></script>  
	<script type="text/javascript" src="js/dataDirAndFiles.js"></script>  
	<script type="text/javascript" src="js/dataDirAndFileOrderBy.js"></script>  
</head>  

<body class="easyui-layout" id="bodyContainerId"> 	
	<div class="headerMain" data-options="region:'north',border:false">  
		<jsp:include  page="headerTop.jsp">
			<jsp:param value="mydata" name="menuName"/>
		</jsp:include>
	</div>    
	<div name="gridDiv" class="ncpGridDiv riAllContainer" data-options="region:'center',border:false" >
		<div class="riInfoContainer">	 
			<div class="riToUser">接收人:&nbsp;<%=toUserNames %>(<%=toUserEmails %>)</div>
			<div class="riSendTime">发送时间:&nbsp;<%=sendTimeStr %></div>
			<div
			<%
				if(hasBringBack){
			%>
			 class="riStatus"
			<%
				}
			%>
			
			>状态:&nbsp;
			<%
				if(hasBringBack){
			%>
				已取回(<%=bringBackTimeStr %>)
			<%
				}
				else{
			%>
				已发送&nbsp;<a id="bringBackBtnId" href="#" class="easyui-linkbutton riBringBackBtn" data-options="plain:true,iconCls:'icon-bringBack'">取消发送</a>
			<%
				}
			%>
			</div>
			<% 
				String applicationDirId = dataFileControl.getRootDirId(ncpSession, RootDirType.myApplication);
			%>
			<input type="hidden" id="applicationDirId" value="<%=applicationDirId%>" />
			<input type="hidden" id="sendId" value="<%=sendId%>" />
			<input type="hidden" id="sendDirId" value="<%=sendDirId%>" />
			<div class="riMessage" title="<%=message %>">留言:&nbsp;
			<%
				if(message == null || message.length() == 0){
			%>
			无
			<%
				}
				else {
			%>
			<%=message %>
			<%
				}
			%>
			</div> 
			<div class="riFileNames">文件:&nbsp;
				<% 
					if(fileRows != null){
						for(int i = 0; i < fileRows.size(); i++){ 
							DataRow fileRow = fileRows.get(i);
							String fileName = StringEscapeUtils.escapeHtml(fileRow.getStringValue("name"));
							String fileId = fileRow.getStringValue("id");								
							String fileType = fileRow.getStringValue("filetype");	
							boolean canPreview = dataFileControl.getCanPreview(fileType);
							String exeTypeName = canPreview ? dataFileControl.getDefaultExeType(fileType) : "";	
				%>
				<span class="fileLink" fileId="<%=fileId %>" exeTypeName="<%=exeTypeName%>" fileType="<%=fileType%>"><img class="fileLinkImage" src="img/fileType/<%=fileType %>.png" /><a title="<%=fileName %>" fileId="<%=fileId %>"><%=fileName %></a></span>; 
				<%
						}
					}
				%>
			</div> 
		</div> 
		<%
			if(sendRow == null){
		%>
		<div id="errorInfoId" style="width:100%;height:100%;text-align:center;font-size:18px;" >
			<%=errorInfo%>
		</div>  
		<%
			}
			else{
		%>		
		<div class="fileTitleContainer">
			<span id="fileTitle" class="fileTitle"></span>
			<a id="saveAsBtnId" href="#" class="easyui-linkbutton fileSaveAsBtn" style="float:right;" data-options="plain:true,iconCls:'icon-saveAs'">另存为</a>
		</div> 
		<div id="fileContentId" class="riFileContainer"> 
		</div>  
		<%
			}
		%>
	</div>  	
	<div id="saveAndDirSelect" class="saveAndDirSelect">
		<div name="selectTitleBar" class="sadsTitleBar">
			<div name="selectTitle" class="sadsTitle"></div>
			<div name="selectClose" class="sadsClose"><img class="sadsCloseImage" name="selectCloseImage" src="img/close.png" /></div>
		</div>
		<div name="navigateBar" class="sadsNavigateBar">
			<div class="sadsNavigateBarInner"> 
				<div name="dirPathInfo" class="sadsDirPathInfo"></div> 
			</div>			
		</div>		 
		<div class="sadsColumnContainer">
			<div class="sadsPopColumnTitleName">名称<span name="nameSortDirection"></span></div>
			<div class="sadsPopColumnTitleFileType">类型</div>
		</div>
		<div name="dirAndFileList" class="sadsDirAndFileList">						
		</div>
		<div class="sadsOperateContainer">
			<div class="sadsInputFileNameContainer"> 
				<input class="sadsInputFileName" type="text" name="fileNameInput" placeholder="请输入文件名"></input> 
			</div> 	
			<div class="sadsBtnContainer"> 
				<input class="sadsSelectDirBtn" name="selectDirBtn" type="button" value="确 定" />
			</div>			
		</div>		 
	</div> 	 
</body>	 
</html>