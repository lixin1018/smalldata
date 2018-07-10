<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="java.lang.Boolean" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %> 
<%@ page import="com.novacloud.novaone.dataFile.ExeFileRegConfig" %> 
<%@ page import="com.novacloud.novaone.dataFile.control.DataFileControl" %> 
<%@ page import="com.novacloud.novaone.dataFile.RootDirType" %> 
<%@ page import="java.lang.Exception" %>
<%@ include file="../../basePage.jsp" %>
		
<%
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId(); 
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>我的数据-数据助理</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css"> 
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css"> 
	<link rel="stylesheet" type="text/css" href="css/myapplication.css">  
	<script type="text/javascript" src="js/dataDirAndFileLayout.js"></script>
	<script type="text/javascript" src="js/dataDirAndFileOrderBy.js"></script>
	<script type="text/javascript" src="js/dataDirAndFiles.js"></script>
	<script type="text/javascript" src="js/mydocument.js"></script> 
	<script type="text/javascript" src="js/dirSelectWindow.js"></script> 
	<script type="text/javascript" src="js/fileSendWindow.js"></script> 
	<script type="text/javascript" src="js/fileSelectWindow.js"></script> 
	<script type="text/javascript" src="js/fileTypeSelectWindow.js"></script> 
	<script type="text/javascript" src="js/userSelectWindow.js"></script> 
	<script type="text/javascript" src="${dataModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_teamMemberSelector.js"></script>
	<script type="text/javascript" src="${paramWinModel}/driveToNextUserSelector.js"></script>  
</head>


<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../home/headerA.jsp">
			<jsp:param value="myapplication" name="menuName"/>
		</jsp:include>
	</div>
	
	<%				
		String dirId = request.getParameter("did");
		if(dirId == null || dirId.length() == 0){
			HttpSession subHttpSession = request.getSession();
			NcpSession subNcpSession = new NcpSession(subHttpSession, true);  
			DataFileControl dataFileControl = (DataFileControl)ContextUtil.getBean("dataFileControl");  
			String myApplicationDirId = dataFileControl.getRootDirId(subNcpSession, RootDirType.myApplication);
			%>
			<input type="hidden" id="rootDirId" value="<%=myApplicationDirId%>" />
			<% 
		}
	%>
	
	<div class="sectionBlankSpaceTopBorder"></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent dirPageContent">
		<div class="dirMainContainer">
			<div id="innerDiv" class="dirInnerDiv">
				<div class="dirListDiv">	
					<div class="operateBar" name="operateBar">
						<div class="operateBarInner">
							<a name="sendFile" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-send'">发送</a>
						</div>
					</div>					
					<div class="navigateBar" name="navigateBar">
						<div class="pathBar"> 
							<div name="dirPathInfo" class="dirPathInfo"></div>
							<div name="dirSummaryInfo" class="dirSummaryInfo"></div>
						</div>
					 	<div name="headerSearch" class="headerSearchItem">
							<div class="headerSearchGroup">
					      		<input type="text" class="headerSearchInputText" placeholder="在当前文件夹里搜索">
					       		<input type="button" class="headerSearchButton"></input>
					        </div>
						</div>						
					</div>		 
					<div class="columnTitleBar">
						<div name="columnTitle" class="columnTitleSortBy">排序:</div>
						<div name="columnTitle" class="columnTitleSelectAll"><span>&nbsp;&nbsp;全选</span><input type="checkbox" name="selectAllCheckbox"/></div>
						<div name="columnTitle" class="columnTitleName"><span class="columnTitle">名称</span><span name="listSort" class="listSort listSortDisable" sortField="name"></span></div>
						<div name="columnTitle" class="columnTitleLastModifyTime"><span class="columnTitle">修改时间</span><span name="listSort" class="listSort listSortDisable" sortField="modifyTime"></span></div>
						<div name="columnTitle" class="columnTitleCreateTime"><span class="columnTitle">创建时间</span><span name="listSort" class="listSort listSortDisable" sortField="createTime"></span></div>
						<div name="columnTitle" class="columnTitleFileType"><span class="columnTitle">类型</span></div>
						<div name="columnTitle" class="columnTitleFileSize"><span class="columnTitle">大小</span></div>
						<div class="columnTitleDescription"><span class="columnTitle">备注</span></div>
					</div>
					<div name="dirAndFileList" class="dirAndFileList">						
					</div>
				</div>
			</div> 			
			<div id="selectFile" class="selectFile">
				<div name="selectTitleBar" class="selectTitleBar">
					<div name="selectTitle" class="selectTitle" ></div>
					<div name="selectClose" class="selectClose"><img name="selectCloseImage" class="selectCloseImage" src="img/close.png" /></div>
				</div>
				<div name="navigateBar" class="selectNavigateBar">
					<div class="selectDirPathContainer"> 
						<div name="dirPathInfo" class="selectDirPathInfo"></div> 
					</div>
					<div class="selectBtnContainer"> 
						<input name="selectFileBtn" type="button" value="确 定" class="selectSelectBtn" />
					</div>				
				</div>		 
				<div class="selectColumnTitleContainer"> 
					<div name="columnTitle" class="popColumnTitleSelectMultiSelect"><input type="checkbox" name="selectAllCheckbox"/></div>
					<div class="popColumnTitleNameMultiSelect">名称<span class="selectNameSortDirection" name="nameSortDirection"></span></div>
					<div class="popColumnTitleFileTypeMultiSelect">类型</div>
				</div>
				<div name="dirAndFileList" class="selectDirAndFileList">				
				</div>
			</div>
			<div id="sendFile" class="sendFile">
				<div name="sendTitleBar" class="sendTitleBar">
					<div name="sendTitle" class="sendTitle"></div>
					<div name="sendClose" class="sendClose"><img name="sendCloseImage" class="sendCloseImage" src="img/close.png" /></div>
				</div>
				<div name="navigateBar" class="sendNavigateBar" >
					<input name="toEmailsBtn" class="sendToEmailsBtn" type="button" value="接收人(0)..."  />
					<div class="sendToEmailsContainer" > 
						<textarea name="toEmails" class="sendToEmails" ></textarea> 
					</div>
					<input name="selectFileBtn" class="sendSelectFileBtn" type="button" value="文件(0)..."  />
					<div class="sendFileListContainer" > 
						<div name="fileListDiv" class="sendFileList" ></div> 
					</div>
					<div class="sendFileBtnContainer" > 
						<input name="sendFileBtn" class="sendFileBtn" type="button" value="发 送"  />
					</div>
				</div>
				<div name="dirAndFileList" class="sendMessageContainer" > 
					<textarea name="messageContent" class="sendMessageContent"  placeholder="请输入留言信息"></textarea>  
				</div>
			</div>
			<div id="selectUser" class="selectUser" >
				<div name="selectTitleBar" class="selectUserTitleBar" >
					<div name="selectTitle" class="selectUserTitle" ></div>
					<div name="selectClose" class="selectUserClose" ><img name="selectCloseImage" class="selectUserCloseImage" src="img/close.png"  /></div>
				</div>
				<div class="selectUserMain" > 
					<div class="easyui-layout selectUserLayout" > 
						<div class="selectUserFilterContainer" data-options="region:'north',border:false" >  
							<table class="selectUserFilterTable" >
								<tr>
									<td class="selectUserFilterTitleTeamTd" >团队:</td>
									<td class="selectUserFilterTeamTd" ><input class="selectUserFilterTeam" name="teamname"  paramCtrl="true" /></td>
									<td class="selectUserFilterTitleUserTd" >姓名:</td>
									<td class="selectUserFilterUserTd" ><input class="selectUserFilterUser" name="username"  paramCtrl="true" /></td>
									<td class="selectUserFilterBtnContainer" ><a class="selectUserFilterBtn" name="queryUserBtn"  >查&nbsp;询</a></td>
									<td>&nbsp;</td>
									<td class="selectUserFilterReturnBtnContainer" ><input class="selectUserFilterReturnBtn" type="button"  name="selectUserBtn"  value="确 定" /></td>
								</tr>
							</table>
						</div>
						<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
							<table name="gridCtrl" ></table>  
						</div>
						<div class="ncpGridToolbarContainer selectUserPaginationContainer" data-options="region:'south',border:false" >
							<span name="paginationCtrl"  class="easyui-pagination ncpGridPagination selectUserPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 	
						</div>
					</div>
				</div>
			</div> 
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>