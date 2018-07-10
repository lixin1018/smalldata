<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>团队详情</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="../css/siteCommon.css">  
	<link rel="stylesheet" type="text/css" href="../css/subMenu.css">  
	<script type="text/javascript" src="../js/siteCommon.js"></script>	 
	<script type="text/javascript" src="${dataModel}/tm_MyTeam.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_MyTeam.js"></script>
	<script type="text/javascript" src="${dataModel}/tm_TeamMember.js"></script>
	<script type="text/javascript" src="${viewModel}/tm_TeamMember.js"></script>
	<script type="text/javascript" src="${sheetModel}/myTeam.js"></script>
	<script type="text/javascript" src="js/teamInfoMember.js"></script>
</head>  
<body>
	<div id="pageHeaderDiv" class="pageHeader"> 
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="tdgl" name="menuName"/>
		</jsp:include>
	</div>
	<div class="sectionBlankSpace" style="border-top: solid 1px #E3E4E5; "></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent" style="height:490px;width:100%;background-color:#ffffff;text-align:center;">
		<div class="pagePathContainer">			
			<div class="pagePathInner">
				<a class="pagePathNameLink" href="../home/index.jsp" target="_self">首页</a> &gt; 
				<a class="pagePathNameLink" href="../tdgl/tdgl.jsp" target="_self">团队管理</a> &gt; 
				<span class="pathPathNameText">团队信息</span> 
			</div>	 
		</div> 
		<div style="width:1200px;position:relative;height:100%;margin:1px auto;">
			<div style="position:absolute;left:0px;width:170px;top:0x;background-color:#ffffff;">
				<jsp:include  page="../tdgl/subMenu.jsp">
					<jsp:param value="" name="subMenuName"/>
				</jsp:include>
			</div>
			<div id="innerDiv" class="easyui-layout"  style="position:absolute;left:170px;top:0px;bottom:20px;width:1050px;background-color:#ffffff;font-family: arial,'Hiragino Sans GB','Microsoft YaHei',sans-serif;">
				<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">
					<span class="ncpCardToolbar">
						<a id="leaveFromTeamBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">退出团队</a>
					</span>
				</div>   
				<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
					<div class="easyui-layout" data-options="fit:true" >
						<div data-options="region:'north',border:false">
							<table>
								<tr style="height:22px;">
									<td style="width:100px;height:22px;text-align:right;">名称</td>
									<td style="width:400px;height:22px;"><input type="text" name="teamname" class="easyui-validatebox" style="width:400px;height:22px;" cardCtrl="true"></input></td>
									<td style="width:80px;height:22px;text-align:right;">管理员</td>
									<td style="width:150px;height:22px;"><input type="text" name="createusername" style="width:150px;height:22px;" cardCtrl="true"></input></td>
									<td>&nbsp;</td> 
								</tr>
								<tr style="height:22px;">
									<td style="width:100px;text-align:right;">描述</td>
									<td style="width:400px;height:22px;"><input type="text" name="description" style="width:400px;height:22px;" cardCtrl="true"></input></td> 
									<td style="width:80px;height:22px;text-align:right;">创建时间</td>
									<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
									<td>&nbsp;</td>
								</tr> 
								<tr style="height:22px;">
									<td style="width:100px;text-align:right;">分享链接</td>
									<td colspan="3" style="width:640px;height:22px;"><input type="text" name="shareurl" style="width:640px;height:22px;" cardCtrl="true"></input></td> 
									<td style="width:200px;height:22px;">(访问此网址, 加入到此团队)</input></td> 
								</tr> 
							</table>
						</div>
						<div data-options="region:'center',border:false" class="ncpInnerContainer">
							<div class="easyui-tabs" data-options="fit:true,plain:true">
								<div title="成员" class="ncpCardTab">
									<div class="easyui-layout" sheetPart="member" data-options="fit:true" id="testCardContainer2">
										<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
											<table name="gridCtrl" ></table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>  
			</div>
		</div>
	</div> 
	<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace"></div> 
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>