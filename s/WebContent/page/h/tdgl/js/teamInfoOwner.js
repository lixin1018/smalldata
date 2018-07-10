$(document).ready(function(){
	var args = cmnPcr.getQueryStringArgs();
	teamId = args["teamid"]; 

	showTeamDetailInfo();

	$("#editBtnId").click(function(){
		editTeam();
		return false;
	}); 
	
	$("#processJoinBtnId").click(function(){
		showProcessJoinPage();
		return false;
	}); 
});
 
var sheet = null;
var teamId = null;
var memberGrid = null; 
function showTeamDetailInfo(){
	var p = {
		containerId: "innerDiv",
		idValue: teamId,
		dataModel:dataModels.tm_MyTeam,
		isRefreshAfterSave:true,
		viewModel: viewModels.tm_MyTeam,
		sheetModel: sheetModels.myTeam
	};
	sheet = new NcpSheet(p);
	sheet.show();
	memberGrid = sheet.getPartCardCtrl("member"); 
}
 
function showProcessJoinPage(){ 
	window.location = "processJoin.jsp?teamid=" + teamId;
	return false;
}
 
function editTeam(){ 
	window.location = "edit.jsp?teamid=" + teamId;
	return false;
}

//操作按钮列的名称
var operateColumnName = "operateColumn";
		
//获取操作按钮单元格内容html
function getLinkHtml(id, isEnable){
	var deleteBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return deleteFromTeam('" + id + "');\">移除</a>"; 
	return "&nbsp;&nbsp;&nbsp;" + deleteBtnHtml;
}

//操作按钮列ID
function getCellContainerId(id){
	return operateColumnName + "_" + id;
}

//显示编辑页面
function deleteFromTeam(id){
	var row = memberGrid.datatable.getRowByIdField(id, "id"); 
	var memberId = row.getValue("memberid"); 
	 
	if(msgBox.confirm({info:"确定要从团队中移除此人吗?"})){ 
		var requestParam = {
			teamId: teamId, 
			memberId: memberId
		};
 		serverAccess.request({
 			waitingBarParentId: "innerDiv",
			serviceName:"teamNcpService", 
			funcName:"deleteFromTeam", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				afterDeleteFromTeam(id);
			} 
		});
	}
	return false;
}

function afterDeleteFromTeam(id){
	var row = memberGrid.datatable.getRowByIdField(id, "id"); 
	var rowId = row.rowId;
	$(memberGrid.gridCtrl).jqGrid("delRowData", rowId);
	memberGrid.datatable.remove(rowId); 
}
//从模型中增加操作按钮列
viewModels.tm_TeamMember.colModel.push({name:operateColumnName,
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