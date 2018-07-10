<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.ExcelGridInstanceControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%@ page import="com.novacloud.novaone.common.ValueConverter" %>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>我的数据</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="homepage"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css"> 
	<script type="text/javascript" src="../js/siteCommon.js"></script>
	<style type="text/css">
		.myInstanceDetailLineDiv{position:relative;width:100%;height:30px;border-bottom:dashed 0px #e9eaea;}
		.myInstanceDetailDefinitionNameDiv{position:absolute;left:0px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.myInstanceDetailTitleDiv{position:absolute;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;left:200px;top:0px;width:300px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.myInstanceDetailTitleDiv a{color:#757575;text-decoration:none;word-break: break-all;}
		.myInstanceDetailTitleDiv a:hover{text-decoration:underline;}
		.myInstanceDetailCreateTimeDiv{position:absolute;left:500px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.myInstanceDetailStatusNoteDiv{position:absolute;left:650px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.myInstanceDetailLasModifyTimeDiv{position:absolute;left:850px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.waitingDetailLineDiv{position:relative;width:100%;height:30px;border-bottom:dashed 0px #e9eaea;}
		.waitingDetailDefinitionNameDiv{position:absolute;left:0px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.waitingDetailStepTitleDiv{position:absolute;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;left:200px;top:0px;width:300px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.waitingDetailStepTitleDiv a{color:#757575;text-decoration:none;word-break: break-all;}
		.waitingDetailStepTitleDiv a:hover{text-decoration:underline;}
		.waitingDetailStepCreateTimeDiv{position:absolute;left:500px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.waitingDetailStatusNoteDiv{position:absolute;left:650px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.waitingDetailCreateUserNameDiv{position:absolute;left:850px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.processedDetailLineDiv{position:relative;width:100%;height:30px;border-bottom:dashed 0px #e9eaea;}
		.processedDetailDefinitionNameDiv{position:absolute;left:0px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
		.processedDetailStepTitleDiv{position:absolute;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;left:200px;top:0px;width:300px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;} 
		.processedDetailStepTitleDiv a{color:#757575;text-decoration:none;word-break: break-all;}
		.processedDetailStepTitleDiv a:hover{text-decoration:underline;}
		.processedDetailProcessTimeDiv{position:absolute;left:500px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.processedDetailStatusNoteDiv{position:absolute;left:650px;top:0px;width:200px;height:30px;line-height:30px;font-size:12px;text-align:center;color:#757575;}
		.processedDetailCreateUserNameDiv{position:absolute;left:850px;top:0px;width:150px;height:30px;line-height:30px;font-size:12px;text-align:left;color:#757575;}
	</style>
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include page="../home/headerA.jsp">
			<jsp:param value="mydata" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:760px;width:100%;background-color:#ffffff;text-align:center;">
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../mydata/subMenu.jsp">
					<jsp:param value="allJobs" name="subMenuName"/>
				</jsp:include>
			</div>			
				<%				
					HttpSession httpSession = request.getSession();
					NcpSession ncpSession = new NcpSession(httpSession, true); 
					String userId = ncpSession.getUserId();
					ExcelGridInstanceControl excelGridInstanceControl = (ExcelGridInstanceControl)ContextUtil.getBean("excelGridInstanceControl");

					int personalInstanceCount = excelGridInstanceControl.getPersonalInstanceCount(ncpSession);
					int waitingProcessStepCount = excelGridInstanceControl.getWaitingProcessInstanceStepCount(ncpSession);
					int processedStepCount = excelGridInstanceControl.getProcessedIntanceStepCount(ncpSession);
					
					List<DataRow> instanceRows = personalInstanceCount == 0 ? null : excelGridInstanceControl.getPersonalInstances(ncpSession, 0, 6);
					List<DataRow> waitingProcessInstanceSteps = waitingProcessStepCount == 0 ? null : excelGridInstanceControl.getWaitingProcessInstanceSteps(ncpSession, 0, 6);
					List<DataRow> processedInstanceSteps = processedStepCount == 0 ? null : excelGridInstanceControl.getProcessedIntanceSteps(ncpSession, 0, 6);
				%>	
			<div id="innerDiv" style="position:absolute;left:200px;top:0px;bottom:50px;width:1000px;background-color:#ffffff;font-family:'Microsoft YaHei','lucida grande', tahoma, verdana, arial, sans-serif;">
				<div style="position:absolute;left:0px;top:0px;bottom:0px;width:100%;height:240px;border:solid 1px #E3E4E5;">	
					<div Style="position:absolute;left:10px;top:0px;right:10px;height:40px;border-bottom:solid 1px #E3E4E5;">
						<div style="position:absolute;left:50px;top:0px;width:150px;height:40px;line-height:45px;font-size:15px;font-weight:600;text-align:left;color:#cc4125;">待办任务</div>
						<div style="position:absolute;left:0px;top:0px;width:50px;height:40px;line-height:40px;font-size:22px;font-weight:600;text-align:center;color:#df4829;"><%=waitingProcessStepCount%></div>
					</div>			
				<%
				if(waitingProcessInstanceSteps != null){
				%>
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:20px;border-bottom:dashed 1px #e9eaea;">
						<div style="position:absolute;left:0px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">类型</div>
						<div style="position:absolute;left:200px;top:0px;width:300px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">主题</div>
						<div style="position:absolute;left:500px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">接收时间</div>
						<div style="position:absolute;left:650px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态</div>
						<div style="position:absolute;left:850px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">发起人</div>
					</div>	
					<div Style="position:absolute;left:10px;top:60px;right:10px;">
				<%
					for(int i = 0; i < waitingProcessInstanceSteps.size(); i++){
						DataRow stepRow = waitingProcessInstanceSteps.get(i);
						String stepId = stepRow.getStringValue("id");
						String instanceId = stepRow.getStringValue("instanceid");
						String instanceTitle = StringEscapeUtils.escapeHtml(stepRow.getStringValue("instancetitle"));
						String stepTitle = StringEscapeUtils.escapeHtml(stepRow.getStringValue("steptitle"));
						String definitionName = StringEscapeUtils.escapeHtml(stepRow.getStringValue("definitionname"));
						String createUserName = StringEscapeUtils.escapeHtml(stepRow.getStringValue("createusername"));
						Date stepCreateTime = stepRow.getDateTimeValue("stepcreatetime");
						String stepCreateTimeStr = ValueConverter.dateTimeToString(stepCreateTime, "yyyy-MM-dd HH:mm");
						Date processTime = stepRow.getDateTimeValue("processtime");
						String processTimeStr = ValueConverter.dateTimeToString(processTime, "yyyy-MM-dd HH:mm");
						String statusNote = StringEscapeUtils.escapeHtml(stepRow.getStringValue("statusnote"));
				%>
						<div class="waitingDetailLineDiv">
							<div class="waitingDetailDefinitionNameDiv"><%=definitionName%></div>
							<div class="waitingDetailStepTitleDiv">
								<a title="<%=stepTitle%>" href="instance/processStep.jsp?instance=<%=instanceId%>&step=<%=stepId%>" target="_blank"><%=stepTitle%></a>
							</div>
							<div class="waitingDetailStepCreateTimeDiv"><%=stepCreateTimeStr%></div>
							<div class="waitingDetailStatusNoteDiv"><%=statusNote%></div>
							<div class="waitingDetailCreateUserNameDiv"><%=createUserName%></div>
						</div>
				<%
					}
				%>
					</div>
				<%
				}
				else{
				%>
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:200px;line-height:200px;font-size:12px;color:#757575;">
							没有待办任务
					</div>
				<%
				}
				%>
				</div>
				<div style="position:absolute;left:0px;top:250px;bottom:0px;width:100%;height:240px;border:solid 1px #E3E4E5;">	
					<div Style="position:absolute;left:10px;top:0px;right:10px;height:40px;border-bottom:solid 1px #E3E4E5;">
						<div style="position:absolute;left:50px;top:0px;width:150px;height:40px;line-height:45px;font-size:15px;font-weight:600;text-align:left;color:#366b9c;">个人提交</div>
						<div style="position:absolute;left:0px;top:0px;width:50px;height:40px;line-height:40px;font-size:22px;font-weight:600;text-align:center;color:#4091d9;"><%=personalInstanceCount%></div>
					</div>			
				<%
					if(instanceRows != null){
				%>			
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:20px;border-bottom:dashed 1px #e9eaea;">
						<div style="position:absolute;left:0px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">类型</div>
						<div style="position:absolute;left:200px;top:0px;width:300px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">主题</div>
						<div style="position:absolute;left:500px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">创建时间</div>
						<div style="position:absolute;left:650px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态</div>
						<div style="position:absolute;left:850px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态更新时间</div>
					</div>	
					<div Style="position:absolute;left:10px;top:60px;right:10px;">
				<%
					for(int i = 0; i < instanceRows.size(); i++){
						DataRow instanceRow = instanceRows.get(i);
						String instanceId = instanceRow.getStringValue("instanceid");
						String createStepId = instanceRow.getStringValue("createstepid");
						String title = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("title"));
						String definitionId = instanceRow.getStringValue("definitionid");
						String definitionName = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("definitionname"));
						Date createTime = instanceRow.getDateTimeValue("createtime");
						String createTimeStr = ValueConverter.dateTimeToString(createTime, "yyyy-MM-dd HH:mm");
						Date lastModifyTime = instanceRow.getDateTimeValue("lastmodifytime");
						String lastModifyTimeStr = ValueConverter.dateTimeToString(lastModifyTime, "yyyy-MM-dd HH:mm");
					String statusNote = StringEscapeUtils.escapeHtml(instanceRow.getStringValue("statusnote"));
				%>
						<div class="myInstanceDetailLineDiv">
							<div class="myInstanceDetailDefinitionNameDiv"><%=definitionName%></div>
							<div class="myInstanceDetailTitleDiv">
								<a title="<%=title%>" href="instance/processStep.jsp?instance=<%=instanceId%>&step=<%=createStepId%>" target="_blank"><%=title%></a>
							</div>
							<div class="myInstanceDetailCreateTimeDiv"><%=createTimeStr%></div>
							<div class="myInstanceDetailStatusNoteDiv"><%=statusNote%></div>
							<div class="myInstanceDetailLasModifyTimeDiv"><%=lastModifyTimeStr%></div>
						</div>
				<%
					}
				%>
					</div>
				<%
				}
				else{
				%>
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:200px;line-height:200px;font-size:12px;color:#757575;">
							没有个人发起的任务
					</div>
				<%
				}				
				%>
				</div>
				<div style="position:absolute;left:0px;top:500px;bottom:0px;width:100%;height:240px;border:solid 1px #E3E4E5;">	
					<div Style="position:absolute;left:10px;top:0px;right:10px;height:40px;border-bottom:solid 1px #E3E4E5;">
						<div style="position:absolute;left:50px;top:0px;width:150px;height:40px;line-height:45px;font-size:15px;font-weight:600;text-align:left;color:#813d5f;">经办历史</div>
						<div style="position:absolute;left:0px;top:0px;width:50px;height:40px;line-height:40px;font-size:22px;font-weight:600;text-align:center;color:#a64d79;"><%=processedStepCount%></div>
					</div>
				<%
				if(processedInstanceSteps != null){
				%>
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:20px;border-bottom:dashed 1px #e9eaea;">
						<div style="position:absolute;left:0px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">类型</div>
						<div style="position:absolute;left:200px;top:0px;width:300px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">主题</div>
						<div style="position:absolute;left:500px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">处理时间</div>
						<div style="position:absolute;left:650px;top:0px;width:200px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">状态</div>
						<div style="position:absolute;left:850px;top:0px;width:150px;height:20px;line-height:20px;font-size:12px;text-align:center;color:#757575;">发起人</div>
					</div>	
					<div Style="position:absolute;left:10px;top:60px;right:10px;">
				<%
					for(int i = 0; i < processedInstanceSteps.size(); i++){
						DataRow stepRow = processedInstanceSteps.get(i);
						String stepId = stepRow.getStringValue("id");
						String instanceId = stepRow.getStringValue("instanceid");
						String instanceTitle = StringEscapeUtils.escapeHtml(stepRow.getStringValue("instancetitle"));
						String stepTitle = StringEscapeUtils.escapeHtml(stepRow.getStringValue("steptitle"));
						String definitionName = StringEscapeUtils.escapeHtml(stepRow.getStringValue("definitionname"));
						String createUserName = StringEscapeUtils.escapeHtml(stepRow.getStringValue("createusername"));
						Date stepCreateTime = stepRow.getDateTimeValue("stepcreatetime");
						String stepCreateTimeStr = ValueConverter.dateTimeToString(stepCreateTime, "yyyy-MM-dd HH:mm");
						Date processTime = stepRow.getDateTimeValue("processtime");
						String processTimeStr = ValueConverter.dateTimeToString(processTime, "yyyy-MM-dd HH:mm");
						String statusNote = StringEscapeUtils.escapeHtml(stepRow.getStringValue("statusnote"));
				%>
						<div class="processedDetailLineDiv">
							<div class="processedDetailDefinitionNameDiv"><%=definitionName%></div>
							<div class="processedDetailStepTitleDiv">
								<a title="<%=stepTitle%>" href="instance/historyStep.jsp?instance=<%=instanceId%>&step=<%=stepId%>" target="_blank"><%=stepTitle%></a>
							</div> 
							<div class="processedDetailProcessTimeDiv"><%=processTimeStr%></div>
							<div class="processedDetailStatusNoteDiv"><%=statusNote%></div>
							<div class="processedDetailCreateUserNameDiv"><%=createUserName%></div>
						</div>
				<%
					}
				%>
					</div>
				<%
				}
				else{
				%>
					<div Style="position:absolute;left:10px;top:40px;right:10px;height:200px;line-height:200px;font-size:12px;color:#757575;">
						没有历史经办任务
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
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>