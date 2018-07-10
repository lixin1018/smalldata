$(document).ready(function(){
	var args = cmnPcr.getQueryStringArgs();
	teamId = args["teamid"];

	showJoinRequestList();
	
	$("#showTeamBtnId").click(function(){
		showTeam();
	});

	$("#applyAllBtnId").click(function(){
		applyAll();
		return false;
	}); 
});

function showTeam(){
	window.location = "teamInfoOwner.jsp?teamid=" + teamId;
}
 
var grid = null;
var teamId = null;
function showJoinRequestList(){
	var p = { 
		containerId:"innerDiv",   
		multiselect:false,  
		dataModel:dataModels.tm_JoinProcess,
		onePageRowCount:50,
		isRefreshAfterSave:false,
		viewModel:viewModels.tm_JoinProcess,
	};
	grid = new NcpGrid(p); 
	
	var externalObject = {
		beforeDoPage: function(param){
			param.otherRequestParam = {teamId: teamId};
			return true;
		}
	};
	grid.addExternalObject(externalObject);
	grid.show();
} 

function applyAll(){
	
}

//操作按钮列的名称
var operateColumnName = "operateColumn";
		
//获取操作按钮单元格内容html
function getLinkHtml(id){ 
	var showApplyBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return applyJoin('" + id + "');\">同意</a>";
	var	showRejectBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return rejectJoin('" + id + "');\">拒绝</a>";
	return "&nbsp;&nbsp;&nbsp;" + showApplyBtnHtml + "&nbsp;&nbsp;&nbsp;" + showRejectBtnHtml;
}

//操作按钮列ID
function getCellContainerId(id){
	return operateColumnName + "_" + id;
}

//同意加入
function applyJoin(id){ 
	var row = grid.datatable.getRowByIdField(id, "id"); 
	var joinUserId = row.getValue("joinuserid"); 
	processJoin(id, joinUserId, true);
	return false;
}

//拒绝加入
function rejectJoin(id){  
	var row = grid.datatable.getRowByIdField(id, "id"); 
	var joinUserId = row.getValue("joinuserid"); 
	processJoin(id, joinUserId, false);
	return false;
}

//调用服务器端处理
function processJoin(id, joinUserId, applyOrReject){
	var requestParam = {
		joinUserId: joinUserId,
		teamId: teamId,
		applyOrReject: applyOrReject
	};	
	serverAccess.request({
		waitingBarParentId: "innerDiv",
		serviceName:"teamNcpService",
		funcName:"processJoinTeam",
		args:{requestParam: cmnPcr.jsonToStr(requestParam)},
		successFunc:function(obj){
			afterProcessJoin(id);
		}
	}); 
}

function afterProcessJoin(id){
	var row = grid.datatable.getRowByIdField(id, "id"); 
	var rowId = row.rowId;
	$(grid.gridCtrl).jqGrid("delRowData", rowId);
	grid.datatable.remove(rowId); 
}

//从模型中增加操作按钮列
viewModels.tm_JoinProcess.colModel.push({name:operateColumnName,
	label:"操作",
	width:80,
	hidden:false,
	sortable:false, 
	search:false,
	resizable:true,
	editable:false,
	canEdit:false,
	formatter:function(cellvalue, options, rowObject){
		var html = getLinkHtml(rowObject.id);
		var containerId = getCellContainerId(rowObject.id);
		return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
	}
}); 
