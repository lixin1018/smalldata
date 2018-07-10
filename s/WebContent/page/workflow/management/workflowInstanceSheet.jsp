<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>流程实例信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/wf_Instance.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_Instance.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_InstanceStep.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_InstanceStep.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_InstanceLog.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_InstanceLog.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_InstanceUser.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_InstanceUser.js"></script>
	<script type="text/javascript" src="${sheetModel}/workflowInstance.js"></script>
	
	<script> 
		$(document).ready(function(){ 	
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl; 
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a>  
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false" style="overflow:hidden;">
				<table>
					<tr style="height:25px;">
						<td style="width:60px;height:22px;text-align:right;">流程id</td>
						<td style="width:150px;height:22px;"><input type="text" name="workflowid" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">用户id</td>
						<td style="width:150px;height:22px;"><input type="text" name="userid" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">用户编码</td>
						<td style="width:150px;height:22px;"><input type="text" name="usercode" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">用户名</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="username" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">已结束</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="isend" style="width:150px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:25px;">
						<td style="width:60px;height:22px;text-align:right;">创建时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">完成时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="endtime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">当前节点</td>
						<td style="width:150px;height:22px;"><input type="text" name="currentnodes" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">当前状态</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="currentstatus" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">已删除</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="isdeleted" style="width:150px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr> 
						<td style="width:60px;height:22px;text-align:right;">组织id</td>
						<td style="width:150px;height:22px;"><input type="text" name="orgid" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">组织编码</td>
						<td style="width:150px;height:22px;"><input type="text" name="orgcode" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">组织名称</td>
						<td style="width:150px;height:22px;"><input type="text" name="orgname" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">&nbsp;</td>
						<td style="width:150px;height:22px;">&nbsp;</td>  
						<td style="width:60px;height:22px;text-align:right;">&nbsp;</td>
						<td style="width:150px;height:22px;">&nbsp;</td>  
					</tr>
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="处理环节" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="step" data-options="fit:true" id="testCardContainer2">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
						 
					</div>	
					<div title="当前处理人" class="ncpCardTab">  
						<div class="easyui-layout" sheetPart="user" data-options="fit:true" id="testCardContainer3">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
					</div>	
					<div title="历史处理日志" class="ncpCardTab">  
						<div class="easyui-layout" sheetPart="log" data-options="fit:true" id="testCardContainer4">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
								</span>	 
							</div>   
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div> 
					</div>		
				</div>  
			</div> 
		</div>
	</div>
</body>	 
</html>