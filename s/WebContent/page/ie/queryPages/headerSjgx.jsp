<%@ page import="com.novacloud.novaone.common.NcpSession" %>  
<%@ page import="com.novacloud.novaone.common.util.CommonFunction" %> 
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
			String loginRedirectUrl = CommonFunction.encode(request.getRequestURI() + "?" + request.getQueryString());
			%>
			&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/index.jsp" class="toMainPage">首&nbsp;页</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/login.jsp?loginRedirectUrl=<%=loginRedirectUrl %>" class="toLogin">登&nbsp;录</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="<%=rootDir%>/page/h/home/reg.jsp" class="toReg">注&nbsp;册</a>
			<%
		}
	%>				
	</div>
	<div id="headerRightTopDiv" class="headerRightTop">
		<div class="tableQueryPopButtonDiv">
			<div class="showCartDiv" id="showCartDivId"><div class="showCartImage"></div><div class="cartCountSpan cartCountDiv" id="cartCountDivId"></div></div>
			<div class="headerRightTopSpliter">&nbsp;|&nbsp;</div>
			<div class="popQueryBtn" id="popQueryBtnId">数据筛选/购买</div>
		</div>
	</div>
	<div class="addToCartSucceedDiv" id="addToCartSucceedDivId">
		<div class="addToCartSuccceedHeaderDiv">
			<div class="addToCartSuccceedTitleDiv">提示信息</div>
			<div class="addToCartSucceedCloseImageDiv"></div>
		</div>
		<div class="addToCartSuccceedMessageDiv">已放入购物车.<br/><span class="goToCartLinkSpan"><a href="../../h/buy/cart.jsp" target="_blank">进入购物车结算</a></span>.</div>
	</div>
</div>