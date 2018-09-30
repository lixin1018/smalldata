<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %> 
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
				String loginRedirectUrl = CommonFunction.encode(request.getRequestURI() + "?" + request.getQueryString());
				%>
				&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/index.jsp" class="toMainPage">首&nbsp;页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/login.jsp?loginRedirectUrl=<%=loginRedirectUrl %>" class="toLogin">登&nbsp;录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/reg.jsp" class="toReg">注&nbsp;册</a>
				<%
			}
		%>
		</div>
		<div id="headerRightTopDiv" class="headerRightTop">
			<div class="headerRightTopButtonDiv">
				<div class="showCartDiv" id="showCartDivId"><a href="<%=rootDir%>/page/h/buy/cart.jsp" class="toCartPage">购物车</a></div>
				<div class="headerRightTopSpliter">&nbsp;|&nbsp;</div> 
				<div class="showOrderListDiv" id="showOrderListDivId"><a href="<%=rootDir%>/page/h/buy/orderList.jsp" class="toOrderListPage">订&nbsp;单</a></div> 
			</div>
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