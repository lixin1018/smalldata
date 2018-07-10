<%@ page import="com.novacloud.novaone.common.NcpSession" %> 
<%@ page import="com.novacloud.novaone.dao.sys.ContextUtil" %> 
<%@ page import="com.novacloud.novaone.excelGrid.control.TeamControl" %>
<%@ page import="java.util.List" %>
<%@ page import="com.novacloud.novaone.dao.db.DataRow" %>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>

<%				
	String rootDir = request.getContextPath(); 
%>

<div id="subMenuMainDivId" class="subMenuMain">
	<div class="subMenuMainInner">  
		<div class="subMenuCategory">
			<div class="subMenuCategoryName">我的数据</div>
		</div>
		<div name="mydocument" class="subMenuItem"> 
			<a href="<%=rootDir%>/page/h/mydata/mydocument.jsp" class="<%=request.getParameter("subMenuName").equals("mydocument") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">我的文件</div>
			</a>
		</div>   
		<div name="myapplication" class="subMenuItem"> 
			<a href="<%=rootDir%>/page/h/mydata/myapplication.jsp" class="<%=request.getParameter("subMenuName").equals("myapplication") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">我的应用</div>
			</a>
		</div>   
		<div name="myreceive" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/mydata/r.jsp" class="<%=request.getParameter("subMenuName").equals("myreceive") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">已接收</div>
			</a>
		</div>   
		<div name="mysend" class="subMenuItem">
			<a href="<%=rootDir%>/page/h/mydata/s.jsp" class="<%=request.getParameter("subMenuName").equals("mysend") ? "subMenuItemLinkActive" : "subMenuItemLink" %> " target="_self"> 
				<div class="subMenuItemName">已发送</div>
			</a>
		</div>	
	</div> 
</div>