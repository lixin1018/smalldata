<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>流程和日志</title>
	<meta name="description" content="When a diagram node is selected show buttons on which a click invokes a command or a drag starts a tool">
	<meta charset="UTF-8">
	<script src="../js/go.js"></script> 
	<script src="flowCanvas.js"></script>
	<script src="flowObjects.js"></script> 
	<script type="text/javascript" src="${dataModel}/wf_InstanceLogList.js"></script>
	<script type="text/javascript" src="${viewModel}/wf_InstanceLogList.js"></script>
	<script>  
		var queryParameters = cmnPcr.getQueryStringArgs();
		var workflowId = queryParameters["workflowid"];
		var instanceId = queryParameters["instanceid"];
		
		$(document).ready(function(){   
		    var flowCanvas = new FlowCanvas();
		    flowCanvas.showWorkflowById({
		    	layoutId:"testGridContainerId",
		    	diagramDivId:"myFlowDiagramDiv",
		    	workflowId:workflowId,
		    	workflowNameLabelId:"workflowNameLabelId",
		    	canEdit:false
	    	}); 
		    
			var p = { 
					containerId:"showInstanceLogDivId",   
					multiselect:false,  
					dataModel:dataModels.wf_InstanceLogList,
					onePageRowCount:100,
					isRefreshAfterSave:false,
					viewModel:viewModels.wf_InstanceLogList 
			};
			grid = new NcpGrid(p);
			var externalObject = {
				beforeDoPage:function(param){
					param.otherRequestParam = instanceId;
					return true;
				}	
			};
			grid.addExternalObject(externalObject);
			grid.show();
		});
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainerId">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false" > 
		<span id="workflowNameLabelId" style="font-size:14px;text-align:right;width:100%;height:100%;line-height:30px;"></span>
	</div>
	<div class="ncpCardDiv" data-options="region:'south',border:false,collapsed:false,split:false,title:''" style="height:160px;">
		<div class="easyui-layout" style="width:100%;height:100%;" id = "showInstanceLogDivId">
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   
				<table name="gridCtrl" ></table> 
			</div>
		</div>	 
	</div>
	<div class="ncpCardDiv" data-options="region:'center',border:false" >
		<div id="myFlowDiagramDiv" style="border: solid 0px #aaaaaa; width:100%; height:100%"></div>
	</div>
</body>
</html>