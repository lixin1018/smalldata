<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>绘制工作流</title>
	<meta name="description" content="When a diagram node is selected show buttons on which a click invokes a command or a drag starts a tool">
	<meta charset="UTF-8">
	<script src="../js/go.js"></script> 
	<script src="flowCanvas.js"></script>
	<script src="flowObjects.js"></script> 
	<script type="text/javascript" src="${paramWinModel}/workflowNodePropertyEditor.js"></script> 
	<script type="text/javascript" src="${paramWinModel}/workflowPropertyEditor.js"></script> 
	<script type="text/javascript" src="${paramWinModel}/workflowLinkPropertyEditor.js"></script> 
	<script> 
		var flowDisgner = null;
		$(document).ready(function(){ 
			$("#backToListId").click(function(){
				if(window.parent !=  null && window.parent.backToList != null){
					if(msgBox.confirm({info:"确认退出编辑吗?"})){
						window.parent.backToList();						
					}
				}
			});
			
			var queryParameters = cmnPcr.getQueryStringArgs();
			var workflowId = queryParameters["workflowid"];
			 
	    	if(workflowId == null){
	    		createWorkflow();
	    	}
	    	else{
	    		showWorkflow({workflowId:workflowId});
	    	}
		});
		
		function showWorkflow(p){
		    flowCanvas = new FlowCanvas();
		    flowCanvas.showWorkflowById({
		    	layoutId:"testGridContainerId",
		    	diagramDivId:"myFlowDiagramDiv",
		    	workflowEditDivId:"workflowEditId",
		    	nodeEditDivId:"nodeEditId",
		    	linkEditDivId:"linkEditId", 
		    	workflowPropertyBtnId:"workflowPropertyBtnId",
		    	saveBtnId:"saveBtnId",
		    	messageControlId:"messageControlId", 
		    	workflowId:p.workflowId,
		    	workflowNameLabelId:"workflowNameLabelId",
		    	aisParameterContainerId:"aisParameterContainerId",
		    	canEdit:true
	    	}); 
		}
		
		function createWorkflow(){
		    flowCanvas = new FlowCanvas();
		    flowCanvas.createWorkflow({
		    	layoutId:"testGridContainerId",
		    	diagramDivId:"myFlowDiagramDiv",
		    	workflowEditDivId:"workflowEditId",
		    	nodeEditDivId:"nodeEditId",
		    	linkEditDivId:"linkEditId", 
		    	workflowPropertyBtnId:"workflowPropertyBtnId",
		    	saveBtnId:"saveBtnId",
		    	messageControlId:"messageControlId",
		    	workflowNameLabelId:"workflowNameLabelId",
		    	aisParameterContainerId:"aisParameterContainerId",
		    	canEdit:true
	    	}); 
		}
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainerId">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false" >	
		<span class="ncpGridToolbar">
			<a id="backToListId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a>
			<a id="workflowPropertyBtnId" name="workflowPropertyBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-property'">流程属性</a>
			<a id="saveBtnId" name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save'">保存</a> 
		</span>
		<span id="workflowNameLabelId" style="font-size:14px;text-align:right;float:right;width:600px;height:100%;line-height:30px;"></span>
	</div>
	<div class="ncpCardDiv" data-options="region:'east',border:true,collapsed:true,split:true,title:'提示信息'" style="width:200px;">
		<textarea id="messageControlId" style="width:100%;height:100%;" readonly="readonly" ></textarea>
	</div>
	<div class="ncpCardDiv" data-options="region:'center',border:false" >
		<div id="myFlowDiagramDiv" style="border: solid 0px #aaaaaa; width:100%; height:100%"></div>
		<div id="workflowEditId" style="display:none;">
			<table style="width:100%;">
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">编码</td>
					<td style="width:150px;"><input type="text" name="code" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">名称</td>
					<td style="width:150px;"><input type="text" name="name" style="width:150px;" paramCtrl="true"></input></td> 
					<td style="width:80px;text-align:right;">已启用</td>
					<td style="width:150px;"><input type="checkbox" name="isactive" style="width:150px;" paramCtrl="true"></input></td>
				</tr>
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">单据类型</td>
					<td style="width:150px;"><input type="text" name="doctypename" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">适用组织</td>
					<td style="width:150px;"><input type="text" name="orgname" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">创建人</td>
					<td style="width:150px;"><input type="text" name="createusername" style="width:150px;" paramCtrl="true"></input></td>
				</tr>
				<tr style="height:28px;"> 
					<td style="width:80px;text-align:right;">创建时间</td>
					<td style="width:150px;"><input type="text" name="createtime" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">修改时间</td>
					<td style="width:150px;"><input type="text" name="modifytime" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">&nbsp;</td>
					<td style="width:150px;">&nbsp;</td>
				</tr>
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">摘要表达式</td> 
					<td colspan="5"><input type="text"  name="abstractexp" style="width:643px;" paramCtrl="true"></input></td>
				</tr>
				<tr style="height:75px;">
					<td style="width:80px;text-align:right;">描述</td>
					<td colspan="5"><textarea name="description" style="width:643px;height:75px;" paramCtrl="true"></textarea></td>
				</tr>
			</table>		
		</div>
		<div id="nodeEditId" style="display:none;">
			<div class="easyui-tabs" data-options="fit:true,plain:true" style="width:750px;height:355px;">
				<div title="基本属性" class="ncpCardTab">   
					<table style="width:100%;">
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">名称</td>
							<td style="width:150px;"><input type="text" name="name" style="width:150px;" paramCtrl="true"></input></td>
							<td style="width:80px;text-align:right;">节点类型</td>
							<td style="width:150px;"><input type="text" name="nodetype" style="width:150px;" paramCtrl="true"></input></td> 
							<td style="width:80px;text-align:right;">触发类型</td>
							<td style="width:150px;"><input type="text" name="triggertype" style="width:150px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">状态名称</td>
							<td style="width:150px;"><input type="text" name="statusname" style="width:150px;" paramCtrl="true"></input></td>
							<td style="width:80px;text-align:right;">允许返回</td>
							<td style="width:150px;"><input type="checkbox" name="canbackfrom" style="width:150px;" paramCtrl="true"></input></td>
							<td style="width:80px;text-align:right;">允许退至</td>
							<td style="width:150px;"><input type="checkbox" name="canbackto" style="width:150px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;" >
							<td style="width:80px;text-align:right;">执行页面</td>
							<td colspan="2"><input type="text"  name="actionpageurl" style="width:230px;" paramCtrl="true"></input></td>
							<td style="width:80px;text-align:right;">查看历史页面</td>
							<td colspan="2"><input type="text"  name="reviewpageurl" style="width:230px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">审批人</td>
							<td colspan="5"><input type="text"  name="userexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">通过后执行</td>
							<td colspan="5"><input type="text"  name="passexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">流转至执行</td>
							<td colspan="5"><input type="text"  name="inexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">退回至执行</td>
							<td colspan="5"><input type="text"  name="backinexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">通过票数</td>
							<td colspan="5"><input type="text"  name="ticketexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">定时处理时间</td>
							<td colspan="5"><input type="text"  name="timingexp" style="width:643px;" paramCtrl="true"></input></td>
						</tr>
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">描述</td>
							<td colspan="5"><textarea name="description" style="width:643px;" paramCtrl="true"></textarea></td>
						</tr>
					</table>	
				</div>
				<div title="异步调用" class="ncpCardTab">   
					<table style="width:100%;">
						<tr style="height:28px;">
							<td style="width:80px;text-align:right;">服务名</td>
							<td style="width:150px;"><input type="text" name="aisname" style="width:150px;height:24px;" paramCtrl="true"></input></td>
							<td colspan="4">&nbsp;</td>
						</tr>
						<tr style="height:28px; border-top:solid 1px #dddddd;">
							<td style="width:80px;text-align:right;">参数表达式</td>
							<td colspan="5">&nbsp;</td>
						</tr>
						<tr>
							<td colspan="6" id="aisParameterContainerId">无参数, 尚未选定异步调用服务名称</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div id="linkEditId" style="display:none;">
			<table style="width:100%;">
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">名称</td>
					<td style="width:150px;"><input type="text" name="name" style="width:150px;" paramCtrl="true"></input></td>
					<td style="width:80px;text-align:right;">连接线类型</td>
					<td style="width:150px;"><input type="text" name="linetype" style="width:150px;" paramCtrl="true"></input></td> 
					<td style="width:80px;text-align:right;">&nbsp;</td>
					<td style="width:150px;">&nbsp;</td>
				</tr>
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">条件</td> 
					<td colspan="5"><input type="text"  name="conditionexp" style="width:643px;" paramCtrl="true"></input></td>
				</tr>
				<tr style="height:28px;">
					<td style="width:80px;text-align:right;">描述</td>
					<td colspan="5"><textarea name="description" style="width:643px;" paramCtrl="true"></textarea></td>
				</tr>
			</table>	
		</div>
	</div>
</body>
</html>