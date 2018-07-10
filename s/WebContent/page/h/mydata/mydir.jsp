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
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css"> 
	<link rel="stylesheet" type="text/css" href="css/dir.css"> 
	<script type="text/javascript" src="../js/siteCommon.js"></script>
	<script type="text/javascript" src="js/dataDirAndFileLayout.js"></script>
	<script type="text/javascript" src="js/dataDirAndFileOrderBy.js"></script>
	<script type="text/javascript" src="js/dataDirAndFiles.js"></script>
	<script type="text/javascript" src="js/mydir.js"></script> 
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
			<jsp:param value="mydata" name="menuName"/>
		</jsp:include>
	</div>
	
	<%				
		String dirId = request.getParameter("did");
		if(dirId == null || dirId.length() == 0){
			HttpSession subHttpSession = request.getSession();
			NcpSession subNcpSession = new NcpSession(subHttpSession, true);  
			DataFileControl dataFileControl = (DataFileControl)ContextUtil.getBean("dataFileControl");  
			String myDirId = dataFileControl.getRootDirId(subNcpSession, RootDirType.myDir);
			%>
			<input type="hidden" id="rootDirId" value="<%=myDirId%>" />
			<% 
		}
	%>
	
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:710px;width:100%;background-color:#ffffff;text-align:center;">
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;height:100%；background-color:#ffffff;">
				<jsp:include page="subMenu.jsp">
					<jsp:param value="mydir" name="subMenuName"/>
				</jsp:include>
			</div>	 
			<div id="innerDiv" style="position:absolute;left:200px;top:0px;bottom:0px;width:1000px;background-color:#ffffff;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;">
				<div style="position:absolute;left:0px;top:0px;bottom:0px;width:100%;height:100%;">	
					<div name="operateBar" Style="position:absolute;left:0px;top:0px;right:0px;height:33px;text-align:left;background-color:#eeeeee;">
						<div style="position:absolute;top:4px;left:4px;right:4px;bottom:0px;">
							<a name="createFile" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-newFile'">新建文件</a>
							<a name="createDir" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-newDir'">新建文件夹</a>
							<a name="copyTo" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-copyTo'">复制到</a>
							<a name="moveTo" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-moveTo'">移动到</a>
							<a name="rename" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-rename'">重命名</a>
							<a name="delete" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a>
							<a name="importFile" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-import'">导入</a>
							<a name="exportFile" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-export'">导出</a>
							<a name="sendFile" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-send'">发送</a>
						</div>
					</div>					
					<div name="navigateBar" Style="position:absolute;left:0px;top:40px;right:0px;height:40px;">
						<div style="position:absolute;left:0px;bottom:7px;width:800px;height:30px;line-height:30px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;"> 
							<div name="dirPathInfo" style="position:absolute;left:3px;width:637px;top:0px;bottom:0px;text-align:left;"></div>
							<div name="dirSummaryInfo" style="position:absolute;right:0px;width:60px;top:0px;bottom:0px;text-align:center;font-size:12px;"></div>
						</div>
					 	<div name="headerSearch" class="headerSearchItem">
							<div class="headerSearchGroup">
					      		<input type="text" class="headerSearchInputText" placeholder="在当前文件夹里搜索">
					       		<input type="button" class="headerSearchButton"></input>
					        </div>
						</div>						
					</div>		 
					<div Style="position:absolute;left:0px;top:80px;right:0px;height:20px;border-bottom:dashed 1px #e9eaea;">
						<div name="columnTitle" class="columnTitleSelectAll"><input type="checkbox" name="selectAllCheckbox"/></div>
						<div name="columnTitle" class="columnTitleName"><span class="columnTitle">名称</span><span name="listSort" class="listSort listSortDisable" sortField="name"></span></div>
						<div name="columnTitle" class="columnTitleLastModifyTime"><span class="columnTitle">修改时间</span><span name="listSort" class="listSort listSortDisable" sortField="modifyTime"></span></div>
						<div name="columnTitle" class="columnTitleCreateTime"><span class="columnTitle">创建时间</span><span name="listSort" class="listSort listSortDisable" sortField="createTime"></span></div>
						<div name="columnTitle" class="columnTitleFileType"><span class="columnTitle">类型</span></div>
						<div name="columnTitle" class="columnTitleFileSize"><span class="columnTitle">大小</span></div>
						<div class="columnTitleDescription"><span class="columnTitle">备注</span></div>
					</div>
					<div name="dirAndFileList" Style="position:absolute;left:0px;top:100px;right:0px;bottom:0px;overflow-x:hidden;overflow-y:auto;">						
					</div>
				</div>
			</div>			
			<div id="selectDir" style="display:none;position:absolute;width:600px;height:400px;">
				<div name="selectTitleBar" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;">
					<div name="selectTitle" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;"></div>
					<div name="selectClose" Style="position:absolute;right:2px;top:2px;width:16px;height:16px;"><img name="selectCloseImage" src="img/close.png" style="width:16px;height:16px;" /></div>
				</div>
				<div name="navigateBar" Style="position:absolute;left:0px;top:20px;right:0px;height:40px;">
					<div style="position:absolute;left:0px;bottom:7px;width:500px;height:30px;line-height:30px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;"> 
						<div name="dirPathInfo" style="position:absolute;left:3px;width:400px;top:0px;bottom:0px;text-align:left;"></div> 
					</div>
					<div style="position:absolute;left:500px;bottom:7px;width:100px;height:30px;line-height:30px;text-align:center;"> 
						<input name="selectDirBtn" type="button" value="确 定" style="width:80px;height:30px;" />
					</div>				
				</div>		 
				<div Style="position:absolute;left:0px;top:60px;right:0px;height:20px;border-bottom:dashed 1px #e9eaea;">
					<div class="popColumnTitleName">名称<span style="width:50px;" name="nameSortDirection"></span></div>
					<div class="popColumnTitleFileType">类型</div>
				</div>
				<div name="dirAndFileList" Style="position:absolute;left:0px;top:100px;right:0px;bottom:0px;overflow-x:hidden;overflow-y:auto;">						
				</div>
			</div>			
			<div id="selectFile" style="display:none;position:absolute;width:600px;height:400px;">
				<div name="selectTitleBar" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;">
					<div name="selectTitle" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;"></div>
					<div name="selectClose" Style="position:absolute;right:2px;top:2px;width:16px;height:16px;"><img name="selectCloseImage" src="img/close.png" style="width:16px;height:16px;" /></div>
				</div>
				<div name="navigateBar" Style="position:absolute;left:0px;top:20px;right:0px;height:40px;">
					<div style="position:absolute;left:0px;bottom:7px;width:500px;height:30px;line-height:30px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;"> 
						<div name="dirPathInfo" style="position:absolute;left:3px;width:400px;top:0px;bottom:0px;text-align:left;"></div> 
					</div>
					<div style="position:absolute;left:500px;bottom:7px;width:100px;height:30px;line-height:30px;text-align:center;"> 
						<input name="selectFileBtn" type="button" value="确 定" style="width:80px;height:30px;" />
					</div>				
				</div>		 
				<div Style="position:absolute;left:0px;top:60px;right:0px;height:20px;border-bottom:dashed 1px #e9eaea;"> 
					<div name="columnTitle" class="popColumnTitleSelectMultiSelect"><input type="checkbox" name="selectAllCheckbox"/></div>
					<div class="popColumnTitleNameMultiSelect">名称<span style="width:50px;" name="nameSortDirection"></span></div>
					<div class="popColumnTitleFileTypeMultiSelect">类型</div>
				</div>
				<div name="dirAndFileList" Style="position:absolute;left:0px;top:80px;right:0px;bottom:0px;overflow-x:hidden;overflow-y:auto;">						
				</div>
			</div>
			<div id="sendFile" style="display:none;position:absolute;width:600px;height:400px;">
				<div name="sendTitleBar" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;">
					<div name="sendTitle" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;text-align:center;"></div>
					<div name="sendClose" Style="position:absolute;right:1px;top:1px;width:16px;height:16px;"><img name="sendCloseImage" src="img/close.png" style="width:16px;height:16px;" /></div>
				</div>
				<div name="navigateBar" Style="position:absolute;left:0px;top:20px;right:0px;height:90px;">
					<input name="toEmailsBtn" type="button" value="接收人(0)..." style="position:absolute;left:100px;top:0px;width:80px;height:27px;cursor:pointer;" />
					<div style="position:absolute;top:0px;left:189px;width:400px;height:40px;line-height:40px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;"> 
						<textarea name="toEmails" style="position:absolute;left:0px;width:400px;top:0px;height:40px;padding:0px;border:0px;resize:none;"></textarea> 
					</div>
					<input name="selectFileBtn" type="button" value="文件(0)..." style="position:absolute;left:100px;top:48px;width:80px;height:27px;cursor:pointer;" />
					<div style="position:absolute;top:48px;left:189px;width:400px;height:45px;line-height:20px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;overflow:auto;"> 
						<div name="fileListDiv" style="position:absolute;left:0px;width:400px;top:0px;height:45px;"></div> 
					</div>
					<div style="position:absolute;top:0px;left:0px;width:100px;height:95px;line-height:95px;text-align:center;"> 
						<input name="sendFileBtn" type="button" value="发 送" style="width:80px;height:95px;cursor:pointer;" />
					</div>
				</div>
				<div name="dirAndFileList" Style="position:absolute;left:10px;top:125px;right:10px;bottom:5px;overflow-x:hidden;overflow-y:auto;text-align:center;border: solid 1px #E3E4E5;"> 
					<textarea name="messageContent" style="position:relative;top:0px;width:578px;height:285px;resize:none;padding:0px;border:0px;" placeholder="请输入留言信息"></textarea>  
				</div>
			</div>
			<div id="selectUser" style="display:none;position:absolute;width:600px;height:400px;">
				<div name="selectTitleBar" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;">
					<div name="selectTitle" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;text-align:center;"></div>
					<div name="selectClose" Style="position:absolute;right:1px;top:1px;width:16px;height:16px;"><img name="selectCloseImage" src="img/close.png" style="width:16px;height:16px;" /></div>
				</div>
				<div Style="position:absolute;left:0px;top:20px;right:0px;height:380px;"> 
					<div class="easyui-layout" style="position:absolute;height:380px;width:600px;"> 
						<div data-options="region:'north',border:false" style="height:36px;">  
							<table style="width:100%;height:100%;font-size:12px;">
								<tr>
									<td style="width:40px;text-align:right;padding-left:3px;">团队:</td>
									<td style="width:100px;"><input name="teamname" style="width:100px;" paramCtrl="true" /></td>
									<td style="width:40px;text-align:right;padding-left:3px;">姓名:</td>
									<td style="width:100px;"><input name="username" style="width:100px;" paramCtrl="true" /></td>
									<td style="width:50px;text-align:center;"><a name="queryUserBtn" style="width:50px;color:#333333;cursor:pointer;" >查&nbsp;询</a></td>
									<td>&nbsp;</td>
									<td style="width:85px;text-align:left;"><input type="button"  name="selectUserBtn" style="width:80px;height:30px;cursor:pointer;" value="确 定" /></td>
								</tr>
							</table>
						</div>
						<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
							<table name="gridCtrl" ></table>  
						</div>
						<div class="ncpGridToolbarContainer" data-options="region:'south',border:false" style="height:30px;">
							<span name="paginationCtrl" style="float:left;" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 	
						</div>
					</div>
				</div>
			</div>
			<div id="selectFileType" style="display:none;position:absolute;width:600px;height:400px;">
				<div name="selectTitleBar" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;">
					<div name="selectTitle" Style="position:absolute;left:0px;top:0px;right:0px;height:20px;text-align:center;"></div>
					<div name="selectClose" Style="position:absolute;right:1px;top:1px;width:16px;height:16px;"><img name="selectCloseImage" src="img/close.png" style="width:16px;height:16px;" /></div>
				</div>
				<div Style="position:absolute;left:0px;top:20px;right:0px;height:340px;"> 
					<%
						ExeFileRegConfig exeFileRegConfig = (ExeFileRegConfig)ContextUtil.getBean("exeFileRegConfig");
						List<HashMap<String, Object>> fileTypes = exeFileRegConfig.getActiveFileTypes();
						for(int i = 0; i < fileTypes.size(); i++){
							HashMap<String, Object> fileType = fileTypes.get(i);
							Boolean allowCreateInDir = (Boolean)fileType.get("allowCreateInDir");
							if(allowCreateInDir){
								String fileTypeCode = (String)fileType.get("code");
								String fileTypeName = StringEscapeUtils.escapeHtml((String)fileType.get("name"));
								String description = StringEscapeUtils.escapeHtml((String)fileType.get("description"));  
								String exeType = exeFileRegConfig.getDefaultExeType(fileTypeCode);
					%>
				
 					<div class="fileTypeItemDiv">
 						<div class="fileTypeItemInnerDiv" title="<%=description%>" typeName="<%=fileTypeCode%>" exeType="<%=exeType%>">
	 						<img class="fileTypeItemImg" src="img/fileType/<%=fileTypeCode%>.png" />
 							<div class="fileTypeItemTypeNameDiv"><%=fileTypeCode%></div>
 							<div class="fileTypeItemTypeDescriptionDiv"><%=fileTypeName%></div>
	 					</div>
 					</div>
 					<%
							}
 						}
 					%>
				</div>
				<div name="navigateBar" Style="position:absolute;left:0px;bottom:0px;right:0px;height:30px;"> 
					<div style="position:absolute;left:0px;bottom:0px;width:500px;height:30px;line-height:30px; border: solid 1px #E3E4E5;font-size:13px;color:#757575;"> 
						<input type="text" name="fileNameInput" placeholder="请输入文件名" style="position:absolute;left:5px;width:490px;top:0px;bottom:0px;text-align:left;padding:0px;border:0px;resize:none;"></input> 
					</div> 	
					<div style="position:absolute;left:500px;bottom:0px;width:100px;height:30px;line-height:30px;text-align:center;"> 
						<input name="selectFileTypeBtn" type="button" value="确 定" style="width:80px;height:30px;" />
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