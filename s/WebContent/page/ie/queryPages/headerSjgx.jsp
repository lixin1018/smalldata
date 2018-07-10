<%@ page import="com.novacloud.novaone.common.NcpSession" %>  
<div class="headerTop"> 
	<div id="headerLeftTopDiv" class="headerLeftTop">
	<%				
		String rootDir = request.getContextPath();
		HttpSession httpSession = request.getSession();
		NcpSession ncpSession = new NcpSession(httpSession, false);
		if(ncpSession.getIsOnline()){
			String userName = ncpSession.getUserName();
			%>
			<%=userName%>,&nbsp;欢迎您&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>" class="toMainPage">首&nbsp;页</a>
			<%
		}
		else{
			%>
			&nbsp;&nbsp;<a href="<%=rootDir%>" class="toLogout">首&nbsp;页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/login.jsp" class="toLogin">登&nbsp;录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/reg.jsp" class="toReg">注&nbsp;册</a>
			<%
		}
	%>				
	</div>
	<div id="headerRightTopDiv" class="headerRightTop">
		<div class="tableQueryPopButtonDiv"><span id="popQueryBtnId">筛选条件</span></div> 
	</div>
</div>