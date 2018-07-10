<div id="subMenuMainDivId" class="subMenuMain">
	<div class="subMenuMainInner">  
		<div class="subMenuCategory">
			<div class="subMenuCategoryName">团队管理</div>
		</div>
		<div name="myTeam" class="subMenuItem">
			<a href="../buy/myTeamList.jsp" class="<%=request.getParameter("subMenuName").equals("myTeam") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">我的团队</span>
			</a>
		</div>   
		<div name="createTeam" class="subMenuItem"> 
			<a href="../buy/orderList.jsp" class="<%=request.getParameter("subMenuName").equals("createTeam") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<span class="subMenuItemName">新建团队</span>
			</a>
		</div>
	</div> 
</div>