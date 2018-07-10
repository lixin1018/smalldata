$(document).ready(function(){
			
	checkDefinitionCount();
	
	var p = {
		containerId:"testGridContainer",
		multiselect:false,
		dataModel:dataModels.eg_definition,
		onePageRowCount:20,
		isRefreshAfterSave:true,
		viewModel:viewModels.eg_definition,
		sheetModel:sheetModels.egDefinition,
		detailPageUrl:"detail.jsp"
	};
	ncpWin = new NcpMultiStyleWin(p);
	ncpWin.show();
	grid = ncpWin.gridStyleCtrl;
});

var grid = null;
var ncpWin = null;

//操作按钮列的名称
var operateColumnName = "operateColumn";
		
//获取操作按钮单元格内容html
function getLinkHtml(definitionId){
	var showDetailBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return showDetailPage('" + definitionId + "');\">查看详情</a>";
	var deleteDefinitionBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return deleteDefinition('" + definitionId + "');\">删除</a>";
	return "&nbsp;&nbsp;&nbsp;" + showDetailBtnHtml + "&nbsp;&nbsp;&nbsp;" + deleteDefinitionBtnHtml;
}

//操作按钮列ID
function getCellContainerId(definitionId){
	return operateColumnName + "_" + definitionId;
}

//显示详情页
function showDetailPage(definitionId){ 
	ncpWin.showDetailInfo({idValue: definitionId});
	return false;
}

//删除模板定义
function deleteDefinition(definitionId){	 		 
	if(msgBox.confirm({info:"确定要删除吗?"})){
		var requestParam = {
			definitions: [{excelGridId: definitionId}]
		};
		
 		serverAccess.request({
 			waitingBarParentId: "testGridContainer",
			serviceName:"excelGridNcpService", 
			funcName:"deleteDefinition", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				afterDeleteDefinition(definitionId);
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	return false;
}

function afterDeleteDefinition(definitionId){
	var row = grid.datatable.getRowByIdField(definitionId, "id"); 
	var rowId = row.rowId;
	$(grid.gridCtrl).jqGrid("delRowData", rowId);
	grid.datatable.remove(rowId); 
}

//从模型中增加操作按钮列
viewModels.eg_definition.colModel.push({name:operateColumnName,
	label:"操作",
	width:100,
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

//判断当前用户有定义了几个模板
function checkDefinitionCount(){		
	var requestParam = {};
	serverAccess.request({
		serviceName:"excelGridNcpService", 
		funcName:"getDefinitionCount", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){				
			var definitionCount = obj.result.definitionCount;
			if(definitionCount == 0){
				if(msgBox.confirm({info: "尚未定义任何模板, 是否跳转至模板创建页面?"})){
					window.location = "../create/selectStyle.jsp";
				}
			}					
		},
		failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
	});
}