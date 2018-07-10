<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ include file="../../../basePage.jsp" %>
		
<%				
	HttpSession httpSession = request.getSession();
	NcpSession ncpSession = new NcpSession(httpSession, true); 
	String userId = ncpSession.getUserId();
	String userName = ncpSession.getUserName();
	ExcelGridInstanceControl excelGridInstanceControl = (ExcelGridInstanceControl)ContextUtil.getBean("excelGridInstanceControl");
	String definitionId = request.getParameter("definition");
	String teamId = request.getParameter("team"); 
	String teamDefinitionName = "";
	String teamName = "";
	String teamDefinitionId = "";
	String teamDefinitionVersionId = "";
	boolean existTeamDefinition = false; 
	
	//判断是否可以查看此team和definition对应的表格信息 
	if(definitionId != null &&  teamId != null){
		DataRow defintionRow = excelGridInstanceControl.getTeamDefinition(ncpSession, definitionId, teamId);
		if(defintionRow != null){ 
			teamDefinitionName = defintionRow.getStringValue("definitionname");
			teamName = defintionRow.getStringValue("teamname");
			teamDefinitionId = defintionRow.getStringValue("definitionid");
			teamDefinitionVersionId = defintionRow.getStringValue("versionid");
			existTeamDefinition = true;
		}
	} 
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>个人提交<%=existTeamDefinition ? ("-" + teamDefinitionName + "-" + teamName) : ""%></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../../css/subMenu.css"> 
	<link rel="stylesheet" type="text/css" href="../css/list.css"> 
	<script type="text/javascript" src="../../js/siteCommon.js"></script>
	<script type="text/javascript" src="js/myInstanceListC.js"></script>
	<style>
		.detailLineDiv{position:relative;width:100%;height:30px;border-bottom:dashed 0px #e9eaea;}
		.detailDefinitionNameDiv{position:absolute;left:0px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.detailTitleDiv{position:absolute;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;left:200px;top:0px;width:300px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.detailTitleDiv a{color:#757575;text-decoration:none;word-break: break-all;}
		.detailTitleDiv a:hover{text-decoration:underline;}
		.detailCreateTimeDiv{position:absolute;left:500px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.detailStatusNoteDiv{position:absolute;left:650px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.detailLastModifyTimeDiv{position:absolute;left:850px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
	</style>
</head>
<body id="bodyId">
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../../home/headerA.jsp">
			<jsp:param value="sjtb" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; ">
		<input id="definitionIdHiddenInputId" type="hidden" value="<%=teamDefinitionId%>" />
		<input id="versionIdHiddenInputId" type="hidden" value="<%=teamDefinitionVersionId%>" />
		<input id="userNameHiddenInputId" type="hidden" value="<%=userName%>" />
		<input id="definitionNameHiddenInputId" type="hidden" value="<%=teamDefinitionName%>" />
	</div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:660px;width:100%;background-color:#ffffff;text-align:center;">
		<div class="pagePathContainer">			
			<div class="pagePathInner">
				<a class="pagePathNameLink" href="../home/index.jsp" target="_self">首页</a> &gt;
				<span class="pathPathNameText">个人提交</span>
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include page="../../rwgl/subMenu.jsp">
					<jsp:param value="myInstanceListC" name="subMenuName"/>
				</jsp:include>
			</div>		
				<%
					int personalInstanceCount = 0; 
					if(existTeamDefinition){
						personalInstanceCount = excelGridInstanceControl.getPersonalInstanceCount(ncpSession, definitionId);
					}  

					String pageIndexStr = request.getParameter("p");
					int pageIndex = ValueConverter.CheckDecimal(pageIndexStr) ? ValueConverter.convertToDecimal(pageIndexStr, "").intValue() : 1;
					
					int onePageItemCount = 15;
					int pageIndexBtnCount = 5;
					int pageIndexBtnHalfCount = pageIndexBtnCount / 2;
					int fromIndex = (pageIndex - 1) * onePageItemCount;
					int pageCount = personalInstanceCount / onePageItemCount + (personalInstanceCount % onePageItemCount > 0 ? 1 : 0); 					
					
					List<DataRow> instanceRows = null;
					if(personalInstanceCount != 0){ 
						instanceRows = excelGridInstanceControl.getPersonalInstances(ncpSession, definitionId, fromIndex, onePageItemCount);
					} 
				%>	
			<div id="innerDiv" style="position:absolute;left:200px;top:0px;bottom:50px;width:1000px;background-color:#ffffff;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;">
				<div style="position:absolute;left:0px;top:0px;bottom:0px;width:100%;height:540px;">	
					<div Style="position:absolute;left:0px;top:0px;right:0px;height:40px;border-bottom:solid 1px #E3E4E5;">
						<div style="position:absolute;left:50px;top:0px;width:500px;height:40px;line-height:45px;font-size:15px;font-weight:600;text-align:left;color:#ff6700;">个人提交<%=existTeamDefinition ? (" - " + teamDefinitionName + " - " + teamName) : ""%></div>
						<div style="position:absolute;left:0px;top:0px;width:50px;height:40px;line-height:40px;font-size:22px;font-weight:600;text-align:center;color:#ff6700;"><%=personalInstanceCount%></div>
						<div id="createInstanceBtnId" style="position:absolute;right:0px;bottom:5px;height:30px;line-height:30px;cursor:pointer;color:#ffffff;font-weight:600;width:80px;background-color:#ff6700;font-size:15px;">新&nbsp;建</div>
					</div>			
				<%
					if(personalInstanceCount != 0){
				%>			
					<div Style="position:absolute;left:0px;top:40px;right:0px;height:20px;border-bottom:dashed 1px #e9eaea;">
						<div style="position:absolute;left:0px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">类型</div>
						<div style="position:absolute;left:200px;top:0px;width:300px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">主题</div>
						<div style="position:absolute;left:500px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">创建时间</div>
						<div style="position:absolute;left:650px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态</div>
						<div style="position:absolute;left:850px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态更新时间</div>
					</div>	
					<div Style="position:absolute;left:0px;top:60px;right:0px;">
				<%
					for(int i = 0; i < instanceRows.size(); i++){
						DataRow instanceRow = instanceRows.get(i);
						String instanceId = instanceRow.getStringValue("instanceid"); 
						String createStepId = instanceRow.getStringValue("createstepid"); 
						String title = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("title")); 
						String definitionName = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("definitionname"));
						Date createTime = instanceRow.getDateTimeValue("createtime");
						String createTimeStr = ValueConverter.dateTimeToString(createTime, "yyyy-MM-dd HH:mm");
						Date lastModifyTime = instanceRow.getDateTimeValue("lastmodifytime");
						String lastModifyTimeStr = ValueConverter.dateTimeToString(lastModifyTime, "yyyy-MM-dd HH:mm");
					String statusNote = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("statusnote"));
				%>
						<div class="detailLineDiv">
							<div class="detailDefinitionNameDiv"><%=definitionName%></div>
							<div class="detailTitleDiv">
								<a title="<%=title%>" href="processStep.jsp?instance=<%=instanceId%>&step=<%=createStepId%>" target="_blank"><%=title%></a>
							</div>
							<div class="detailCreateTimeDiv"><%=createTimeStr%></div>
							<div class="detailStatusNoteDiv"><%=statusNote%></div>
							<div class="detailLastModifyTimeDiv"><%=lastModifyTimeStr%></div>
						</div>
				<%
					}
				%>
						<div Style="position:relative;left:0px;right:0px;height:50px;border-top:solid 1px #E3E4E5;">
							<div class="pageIndexContainer">
								<div class="pageItem">&nbsp;</div>
								<%
									if(pageCount > pageIndexBtnCount && pageIndex > 1){
										String pageUrl = "myInstanceList.jsp?&p=1";
									%>
									<div class="pageIndexItem pageIndexFirst"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">|&lt;</a></div>
									<%
									}
								%>
								<%
									if(pageIndex > 1){
										String pageUrl = "myInstanceList.jsp?p=" + (pageIndex - 1);
									%> 
									<div class="pageIndexItem pageIndexPrevious"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&lt;</a></div>
									<%
									}
								%> 
								
								<%
									if(pageIndex - pageIndexBtnHalfCount - 1 > 0 && pageCount > pageIndexBtnCount){ 
									%> 
									<div class="pageIndexItem pageIndexOther"><div class="pageIndexText">...</div></div>
									<%
									}
								%>  
								<%
									List<Integer> pageIndexList = new ArrayList<Integer>();
									if(pageCount > pageIndexBtnCount){
										for(int i = pageIndexBtnHalfCount; i > 0; i--){
											int p = pageIndex - i;
											if(p > 0){
												pageIndexList.add(pageIndex - i);
											}
										}
										pageIndexList.add(pageIndex);
										for(int i = 1; i <= pageIndexBtnHalfCount; i++){
											int p = pageIndex + i;
											if(p <= pageCount){
												pageIndexList.add(p);
											}
										} 
									}
									else{ 
										for(int i = 1; i <= pageCount; i++){
											pageIndexList.add(i);
										}								
									}
									for(int i = 0; i < pageIndexList.size(); i++){
										int p = pageIndexList.get(i);
										if(p == pageIndex){
											%>
									<div class="pageIndexItem pageIndexCurrent"><div class="pageIndexText"><%=p%></div></div>
											<%
										}
										else{
											String pageUrl = "myInstanceList.jsp?p=" + (p);
											%>
									<div class="pageIndexItem"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self"><%=p%></a></div>
											<%
										}
									}
									
								%>
								<%
									if(pageCount > pageIndexBtnHalfCount + pageIndex && pageCount > pageIndexBtnCount){ 
									%> 
									<div class="pageIndexItem pageIndexOther"><div class="pageIndexText">...</div></div>
									<%
									}
								%>
								<%
									if(pageIndex < pageCount){
										String pageUrl = "myInstanceList.jsp?p=" + (pageIndex + 1);
									%> 
									<div class="pageIndexItem pageIndexNext"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;</a></div>
									<%
									}
								%>  
								<%
									if(pageCount > pageIndexBtnCount && pageIndex < pageCount){
										String pageUrl = "myInstanceList.jsp?p=" + pageCount;
									%>
									<div class="pageIndexItem pageIndexLast"><a class="pageIndexLink" href="<%=pageUrl%>" target="_self">&gt;|</a></div>
									<%
									}
								%>
								<div class="pageCount">第<%=pageIndex%>页, 共<%=pageCount%>页</div>
							</div>
						</div>
					</div>
				<%
				}
				else{
				%>
					<div Style="position:absolute;left:0px;top:40px;right:0px;height:200px;line-height:200px;font-size:16px;font-weight:600;color:#757575;">
							没有个人发起的任务
					</div>
				<%
				}				
				%>
				</div> 
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../../common/footer.html"%>
	</div>
</body>
</html>