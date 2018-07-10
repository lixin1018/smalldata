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
					<%=userName%>, &nbsp;欢迎您&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/logout.jsp" class="toLogout">退出</a>
				<% 
			}
			else{
				%>				
				&nbsp;&nbsp;请&nbsp;<a href="<%=rootDir%>/page/h/home/login.jsp" class="toLogin">登录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/reg.jsp" class="toReg">注册</a>
				<% 
			}
		%>				
		</div>
		<div id="headerRightTopDiv" class="headerRightTop" style="font-size:12px;line-height:30px;">  				
			<div style="width:100%;height:30px;top:0px;right:0px;position:absolute;text-align:right;">
				<a  id="cartButtonId" href="../../h/buy/cart.jsp" target="_blank" class="toCart">购物车<span id="cartLineCountSpanId">(0)</span></a> 
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<a href="../../h/buy/orderList.jsp" class="toOrderList">我的订单</a>
				&nbsp;&nbsp;|&nbsp;&nbsp;
				<a href="<%=rootDir%>/page/h/home/help.jsp" class="toHelp">帮助</a>
			</div>
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
					<div name="mydata" class="headerTitleItem<%=request.getParameter("menuName").equals("mydata") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/mydata/mydocument.jsp" target="_self"> 
							<span class="headerTitleItemText">我的数据</span>
						</a>
					</div> 
					<div name="sjgx" class="headerTitleItem<%=request.getParameter("menuName").equals("sjgx") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/sjgx/sjgx.jsp" target="_self"> 
							<span class="headerTitleItemText">数据共享</span>
						</a>
					</div>
					<div name="ss" class="headerTitleItem<%=request.getParameter("menuName").equals("ss") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/ss/list.jsp" target="_self"> 
							<span class="headerTitleItemText">数据动画</span>
						</a>
					</div>
					<!-- 
					<div name="rwgl" class="headerTitleItem<%=request.getParameter("menuName").equals("sjtb") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/rwgl/rwgl.jsp" target="_self"> 
							<span class="headerTitleItemText">任务管理</span>
						</a>
					</div>  
					<div name="tdgl" class="headerTitleItem<%=request.getParameter("menuName").equals("tdgl") ? " headerTitleItemActive" : "" %>">
						<a href="<%=rootDir%>/page/h/tdgl/myTeamList.jsp" target="_self"> 
							<span class="headerTitleItemText">团队管理</span>
						</a>
					</div>
					 -->
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