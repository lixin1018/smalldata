<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<div id="headerMainDiv" class="headerMain">
	<div class="headerTop"> 
		<div id="headerLeftTopDiv" class="headerLeftTop">
		<%				
			String rootDir = request.getContextPath(); 
			HttpSession httpSession = request.getSession();
			NcpSession ncpSession = new NcpSession(httpSession, false);
			if(ncpSession.getIsOnline()){
				String userName = ncpSession.getUserName();
				%>
					<%=userName%>, &nbsp;欢迎您&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/index.jsp" class="toMainPage">首&nbsp;页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/logout.jsp" class="toLogout">退&nbsp;出</a>
				<%
			}
			else{
				%>
				&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/index.jsp" class="toMainPage">首&nbsp;页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/login.jsp" class="toLogin">登&nbsp;录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/reg.jsp" class="toReg">注&nbsp;册</a>
				<%
			}
		%>
		</div>
	</div>
	<div class="headerBottom">
		<div class="headerBottomInner">
			<div class="headerLeftBottom">
				<a href="<%=rootDir%>/page/h/home/index.jsp"><img class="headerLogo" src="<%=rootDir%>/page/h/images/logo.png" /></a>
				<span class="headerSysName">数据助理</span>
				<span class="headerSysSubName">Power Data Helper</span>
				
				<div class="pageHeaderTitleContainer">
					<div class="pageHeaderTitle"><%=request.getParameter("subTitle") %></div> 
				</div>
			</div> 
		</div> 
	</div> 
</div>