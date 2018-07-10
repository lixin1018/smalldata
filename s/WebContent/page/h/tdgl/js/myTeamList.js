$(document).ready(function(){ 	
	var p = {
		containerId:"innerDiv",
		multiselect:false,
		dataModel:dataModels.tm_MyTeam,
		onePageRowCount:20,
		isRefreshAfterSave:true,
		viewModel:viewModels.tm_MyTeam
	};
	grid = new NcpGrid(p);
	grid.show();
});

var grid = null;

//操作按钮列的名称
var operateColumnName = "operateColumn";
		
//获取操作按钮单元格内容html
function getLinkHtml(teamId){
	var row = grid.datatable.getRowByIdField(teamId, "teamid"); 
	var isOwner = row.getValue("isowner");
	var showDetailBtnHtml = "";
	if(!isOwner){
		showDetailBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return showMemberPage('" + teamId + "');\">查看详情</a>";
	}
	else{
		showDetailBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return showOwnerPage('" + teamId + "');\">编辑详情</a>";
	}
	return "&nbsp;&nbsp;&nbsp;" + showDetailBtnHtml;
}

//操作按钮列ID
function getCellContainerId(teamId){
	return operateColumnName + "_" + teamId;
}

//查看详情页
function showMemberPage(teamId){ 
	window.location = "teamInfoMember.jsp?teamid=" + teamId;
	return false;
}

//编辑详情页
function showOwnerPage(teamId){ 
	window.location = "teamInfoManager.jsp?teamid=" + teamId;
	return false;
}

//从模型中增加操作按钮列
viewModels.tm_MyTeam.colModel.push({name:operateColumnName,
	label:"操作",
	width:80,
	hidden:false,
	sortable:false, 
	search:false,
	resizable:true,
	editable:false,
	canEdit:false,
	formatter:function(cellvalue, options, rowObject){
		var html = getLinkHtml(rowObject.teamid);
		var containerId = getCellContainerId(rowObject.teamid);
		return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
	}
});  