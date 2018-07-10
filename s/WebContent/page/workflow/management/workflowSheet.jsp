<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>流程信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/wf_Workflow.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_Workflow.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_Node.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_Node.js"></script>
	<script type="text/javascript" src="${dataModel}/wf_Link.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_Link.js"></script>
	<script type="text/javascript" src="${sheetModel}/workflow.js"></script>
	
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
						<td style="width:60px;height:22px;text-align:right;">编码</td>
						<td style="width:150px;height:22px;"><input type="text" name="code" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">名称</td>
						<td style="width:150px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">单据类型</td>
						<td style="width:150px;height:22px;"><input type="text" name="doctypename" style="width:150px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:60px;height:22px;text-align:right;">已启用</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="isusing" style="width:150px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr> 
						<td style="width:60px;height:22px;text-align:right;">组织名称</td>
						<td style="width:150px;height:22px;"><input type="text" name="orgname" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">创建人</td>
						<td style="width:150px;height:22px;"><input type="text" name="createusername" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">创建时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:60px;height:22px;text-align:right;">修改时间</td>
						<td style="width:150px;height:22px;"><input type="text" name="modifytime" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
					<tr style="height:25px;">
						<td style="text-align:right;">描述</td>
						<td colspan="7"><input type="text" name="description" style="width:950px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="节点" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="node" data-options="fit:true" id="testCardContainer2">
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
					<div title="边" class="ncpCardTab">  
						<div class="easyui-layout" sheetPart="link" data-options="fit:true" id="testCardContainer3">
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