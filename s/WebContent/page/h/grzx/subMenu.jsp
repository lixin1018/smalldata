<div id="subMenuMainDivId" class="subMenuMain">
	<div class="subMenuMainInner">  
		<div class="subMenuCategory">
			<div class="subMenuCategoryName">交易管理</div>
		</div>
		<div name="myOrder" class="subMenuItem"> 
			<a href="../buy/orderList.jsp" class="<%=request.getParameter("subMenuName").equals("myOrder") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">我的订单</span>
			</a>
		</div> 
		<div name="myCart" class="subMenuItem">
			<a href="../buy/cart.jsp" class="<%=request.getParameter("subMenuName").equals("myCart") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">我的购物车</span>
			</a>
		</div>   
		<div class="subMenuCategory">
			<div class="subMenuCategoryName">账号管理</div>
		</div>
		<div name="myInfo" class="subMenuItem">
			<a href="../grzx/grzx.jsp" class="<%=request.getParameter("subMenuName").equals("myInfo") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">我的个人中心</span>
			</a>
		</div> 
		<div name="changeUserInfo" class="subMenuItem">
			<a href="../grzx/changeUserInfo.jsp" class="<%=request.getParameter("subMenuName").equals("changeUserInfo") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">修改个人信息</span>
			</a>
		</div> 
		<div name="userMessage" class="subMenuItem">
			<a href="../grzx/userMessageList.jsp" class="<%=request.getParameter("subMenuName").equals("userMessage") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">消息通知</span>
			</a>
		</div> 
		<div name="changePwd" class="subMenuItem">
			<a href="../grzx/changePwd.jsp" class="<%=request.getParameter("subMenuName").equals("changePwd") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">修改密码</span>
			</a>
		</div>   
	</div> 
</div>