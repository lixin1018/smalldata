$(document).ready(function(){ 
	var p = { 
		containerId:"innerDiv",   
		multiselect:false,  
		dataModel:dataModels.d_UserMessage,
		onePageRowCount:20,
		isRefreshAfterSave:true,
		viewModel:viewModels.d_UserMessage,
		sheetModel:sheetModels.userMessage,
		detailPageUrl:"userMessageDetail.jsp"
	};
	ncpWin = new NcpMultiStyleWin(p); 
	ncpWin.show();
	grid = ncpWin.gridStyleCtrl; 
	
	$("#markAllReadBtnId").click(function(){
		markAllRead();
		return false;
	}); 
});  

var ncpWin = null;
var grid = null;


//操作按钮列的名称
var operateColumnName = "operateColumn";
var statusColumnName = "statusColumn";
		
//获取操作按钮单元格内容html
function getoOperateLinkHtml(uMsgId){
	var uMsgRow = grid.datatable.getRowByIdField(uMsgId, "id");  
	var showDetailBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return showDetailPage('" + uMsgId + "');\">查看详情</a>";
	var marReadBtnHtml = uMsgRow.getValue("status") == "unRead" ? "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return markRead(['" + uMsgId + "']);\">设为已读</a>" : "";
	return "&nbsp;&nbsp;&nbsp;" + showDetailBtnHtml + "&nbsp;&nbsp;&nbsp;" + marReadBtnHtml;
}

//操作按钮列ID
function getCellContainerId(uMsgId){
	return operateColumnName + "_" + uMsgId;
}

//显示详情页
function showDetailPage(uMsgId){
	var uMsgRow = grid.datatable.getRowByIdField(uMsgId, "id");  
	grid.selectRowInGrid(uMsgRow.rowId);
	
	ncpWin.showDetailInfo({idValue: uMsgId});
	return false;
} 

//从模型中增加操作按钮列
viewModels.d_UserMessage.colModel.push({name:statusColumnName,
	label:"状态",
	width:50,
	hidden:false,
	sortable:false, 
	search:false,
	resizable:true,
	editable:false,
	canEdit:false,
	formatter:function(cellvalue, options, rowObject){
		var statusText = "";
		switch(rowObject.status){
			case "read":
				statusText = "已读";
				break;
			case "unread":
				statusText = "未读";
				break;
			case "deleted":
				statusText = "已删除";
				break; 
		}  
		var containerId = getCellContainerId(rowObject.id + "_status");
		return "<div id=\"" + containerId + "\" style=\"width:100%;height:24px;line-height:24px;\">" + statusText + "</div>";
	}
});
viewModels.d_UserMessage.colModel.push({name:operateColumnName,
	label:"操作",
	width:100,
	hidden:false,
	sortable:false, 
	search:false,
	resizable:true,
	editable:false,
	canEdit:false,
	formatter:function(cellvalue, options, rowObject){
		var html = getoOperateLinkHtml(rowObject.id);
		var containerId = getCellContainerId(rowObject.id + "_operate");
		return "<div id=\"" + containerId + "\" style=\"width:100%;height:24px;line-height:24px;\">" + html + "</div>";
	}
});

//全部设为已读
function markAllRead(){
	var allRowIds = new Array();
	for(var rowId in grid.datatable.rows){
		allRowIds.push(rowId);
	}
	markRead(allRowIds);
	return false;
}

function markCurrentRead(){
	var row = grid.getCurrentRow();
	markRead([row.rowId]);
}

function markRead(rowIds){	
	if(rowIds.length > 0){
		var markRowIds = new Array();	
		var allIdValues = new Array();
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var row = grid.datatable.rows(rowId);
			if(row.getValue("status") == "unread"){
				var idValue = row.getValue("id");
				allIdValues.push(idValue);
				markRowIds.push(rowId);
			}
		}
		
		if(markRowIds.length > 0){
			var requestParam = {
				messageIds: allIdValues
			};	
			serverAccess.request({
				serviceName:"userNcpService", 
				funcName:"markUserMessage", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){				
					markAllReadAfterServerResponse(markRowIds);
				}
			}); 
		}
	}
	return false;		
}

function markAllReadAfterServerResponse(allRowIds){
	for(var i = 0; i < allRowIds.length; i++){
		var rowId = allRowIds[i];
		var row = grid.datatable.rows(rowId);
		var id = row.getValue("id"); 
		var containerId = getCellContainerId(id + "_status");
		$("#" + containerId).text("已读");	
	}	
}