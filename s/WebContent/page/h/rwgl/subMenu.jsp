<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.TeamControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>

<%				
	String rootDir = request.getContextPath();
	String urlDefinitionId = request.getParameter("definition");
%>

<div id="subMenuMainDivId" class="subMenuMain">
	<div class="subMenuMainInner">  
		<div class="subMenuCategory">
			<div class="subMenuCategoryName">任务中心</div>
		</div>
		<div name="allJobs" class="subMenuItem"> 
			<a href="<%=rootDir%>/page/h/rwgl/rwgl.jsp" class="<%=request.getParameter("subMenuName").equals("allJobs") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">全部任务</div>
			</a>
		</div> 
		<div name="myInstanceList" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/rwgl/instance/myInstanceList.jsp" class="<%=request.getParameter("subMenuName").equals("myInstanceList") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">个人提交</div>
			</a>
		</div> 
		<div name="waitingList" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/rwgl/instance/waitingList.jsp" class="<%=request.getParameter("subMenuName").equals("waitingList") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">待办事项</div>
			</a>
		</div>   
		<div name="historyList" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/rwgl/instance/historyList.jsp" class="<%=request.getParameter("subMenuName").equals("historyList") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">历史经办</div>
			</a>
		</div>  
		<div name="teamDefinitionList" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/rwgl/definition/list.jsp" class="<%=request.getParameter("subMenuName").equals("teamDefinitionList") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">表格模板定义</div>
			</a>
		</div>   
		
		<!-- 循环所属的团队，形成菜单 -->
		<%				
			HttpSession httpSession = request.getSession();
			NcpSession ncpSession = new NcpSession(httpSession, true); 
			String userId = ncpSession.getUserId();
			TeamControl teamControl = (TeamControl)ContextUtil.getBean("teamControl");
			List<DataRow> teamRows = teamControl.getMemberTeams(ncpSession);
			for(DataRow teamRow : teamRows){
				String teamId = teamRow.getStringValue("teamid");
				String teamName = StringEscapeUtils.escapeHtml(teamRow.getStringValue("teamname"));
				List<DataRow> definitionRows = teamControl.getTeamDefinitions(ncpSession, teamId);				
		%>	
		<div class="subMenuCategory">
			<div class="subMenuCategoryName" teamId="<%=teamId%>"><%=teamName%></div>
		</div>
		<%
				for(DataRow definitionRow : definitionRows){
					String menuDefinitionId = definitionRow.getStringValue("definitionid");
					String versionId = definitionRow.getStringValue("versionid");
					String definitionName = StringEscapeUtils.escapeHtml(definitionRow.getStringValue("definitionname"));
		%>
		<div name="myInstanceList<%=menuDefinitionId%>" class="subMenuItem" >
			<a title="<%=definitionName%>" href="<%=rootDir%>/page/h/rwgl/instance/myInstanceListC.jsp?definition=<%=menuDefinitionId%>&team=<%=teamId%>" class="<%=menuDefinitionId.equals(urlDefinitionId) ? "subMenuItemLinkActive" : "subMenuItemLink" %>" target="_self"> 
				<div class="subMenuItemName"><%=definitionName%></div>
			</a>
		</div>   
		<%
				}
			}
		%>
	</div> 
</div>