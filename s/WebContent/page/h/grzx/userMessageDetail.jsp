<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>消息详情</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/d_UserMessage.js"></script>
	<script type="text/javascript" src="${viewModel}/d_UserMessage.js"></script>
	<script type="text/javascript" src="${sheetModel}/userMessage.js"></script>
	<script type="text/javascript" src="js/userMessageDetail.js"></script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回到消息列表</a> 
		</span> 	 
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'center',border:false" style="overflow:hidden;">
				<table>
					<tr style="height:200px;">
						<td style="text-align:right;">内容</td>
						<td colspan="4"><textarea name="content" style="width:950px;height:200px;" cardCtrl="true"></textarea></td> 
					</tr>
					<tr style="height:25px;">
						<td style="width:50px;height:22px;text-align:right;">发信人</td>
						<td style="width:150px;height:22px;"><input type="text" name="fromusername" class="easyui-validatebox" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:100px;height:22px;text-align:right;">发送时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td>&nbsp;</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</body>	 
</html>