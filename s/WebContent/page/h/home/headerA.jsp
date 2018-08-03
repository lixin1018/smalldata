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
			</div>
			<div class="headerRightBottom">
				<div class="headerRightBottomInner">
					<div name="sjjs" class="headerTitleItem<%=request.getParameter("menuName").equals("sjjs") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/home/index.jsp" target="_self"> 
							<span class="headerTitleItemText">首&nbsp;&nbsp;页</span>
						</a>
					</div>
					<div name="sjgx" class="headerTitleItem<%=request.getParameter("menuName").equals("sjgx") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/sjgx/sjgx.jsp" target="_self"> 
							<span class="headerTitleItemText">数据共享</span>
						</a>
					</div>
					<div name="kpdh" class="headerTitleItem<%=request.getParameter("menuName").equals("kpdh") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/ss/list.jsp" target="_self"> 
							<span class="headerTitleItemText">科普动画</span>
						</a>
					</div>
					<div name="cjcb" class="headerTitleItem<%=request.getParameter("menuName").equals("cjcb") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/cjcb/cjcb.jsp" target="_self"> 
							<span class="headerTitleItemText">超级传播</span>
						</a>
					</div>  
					<div name="mydocument" class="headerTitleItem<%=request.getParameter("menuName").equals("mydocument") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/mydata/mydocument.jsp" target="_self"> 
							<span class="headerTitleItemText">我的文件</span>
						</a>
					</div> 
					<div name="myapplication" class="headerTitleItem<%=request.getParameter("menuName").equals("myapplication") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/mydata/myapplication.jsp" target="_self"> 
							<span class="headerTitleItemText">我的应用</span>
						</a>
					</div> 
					<div name="wjxx" class="headerTitleItem<%=request.getParameter("menuName").equals("wjxx") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/mydata/r.jsp" target="_self"> 
							<span class="headerTitleItemText">文件快递</span>
						</a>
					</div> 
					<div name="grzx" class="headerTitleItem<%=request.getParameter("menuName").equals("grzx") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/grzx/grzx.jsp" target="_self"> 
							<span class="headerTitleItemText">个人中心</span>
						</a>
					</div>
				</div>
			</div>
		</div> 
	</div> 
</div>