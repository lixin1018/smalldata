$(document).ready(function(){ 	
	var initParam = window.parent.multiStyleWinInitParam; 
	initParam.containerId = "testSheetContainer";
	sheetWin = new NcpMultiStyleSheetWin(initParam); 
	sheetWin.show();	
	var sheetCtrl = sheetWin.sheetCtrl;	
	versionGrid = sheetCtrl.getPartCardCtrl("detail"); 
	versionGrid.hideMultiSelectColumn();
	versionGrid.addExternalObject({
		beforeDoEdit: function(){
			return false;
		}
	});
	
	$("#refreshBtnId").click(function(){
	
		var mainCardCtrl = sheetWin.sheetCtrl.getMainCardCtrl(); 
		if(mainCardCtrl.currentStatus == formStatusType.edit){
			mainCardCtrl.doCancel({isShowConfirm: false, cancelBackToGrid: true});
		}		
		
		window.parent.ncpWin.showDetailInfo({
			idValue: getCurrentExcelGridId()
		}); 
	}); 	
});  

var sheetWin = null;

var versionGrid = null; 

//操作按钮列的名称
var operateColumnName = "operateColumn";
		
//获取操作按钮单元格内容html
function getLinkHtml(versionId, isEnable){
	var showEditBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return showEditPage('" + versionId + "');\">编辑</a>";
	var deleteVersionBtnHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return deleteVersion('" + versionId + "');\">删除</a>";
	var activateVersionHtml = "";
	if(!isEnable){
		activateVersionHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return activateVersion('" + versionId + "');\">启用</a>";
	}
	else{
		activateVersionHtml = "<a target=\"_blank\" style=\"line-height:24px;cursor:pointer;\" onclick=\"return inactivateVersion('" + versionId + "');\">停用</a>";
	}
	return "&nbsp;&nbsp;&nbsp;" + showEditBtnHtml + "&nbsp;&nbsp;&nbsp;" + deleteVersionBtnHtml + "&nbsp;&nbsp;&nbsp;" + activateVersionHtml ;
}

//操作按钮列ID
function getCellContainerId(versionId){
	return operateColumnName + "_" + versionId;
}

//显示编辑页面
function showEditPage(versionId){
	var excelGridRow = getCurrentExcelGridRow();
	var name = excelGridRow.getValue("name");
	var definitionId = excelGridRow.getValue("id");
	var editPageUrl = "../excelGrid/definition/editDefinition.jsp?name=" + encodeURIComponent(name) + "&excelgrid=" + definitionId + "&version=" + versionId;
	parent.parent.iocClient.mainPageTab().showPage(versionId, "编辑模板:" + name, editPageUrl, true);
	return false;
}

//获取当然excelGrid记录
function getCurrentExcelGridRow(){
	var mainCardCtrl = sheetWin.sheetCtrl.getMainCardCtrl(); 
	var excelGridRow = mainCardCtrl.datatable.getRowByIndex(0); 
	return excelGridRow; 
}

//启用版本
function activateVersion(versionId){	 
	if(msgBox.confirm({info:"确定要启用吗?"})){
		var excelGridId = getCurrentExcelGridId();
		var requestParam = {
			excelGridId: excelGridId, 
			excelGridVersionId: versionId
		};
 		serverAccess.request({
 			waitingBarParentId: "testSheetContainer",
			serviceName:"excelGridNcpService", 
			funcName:"activateVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				afterActivateVersion(versionId);
			},
			failFunc:function(obj){ 
				if(obj.code == "activateVersion_002"){
					msgBox.alert({info: "验证失败:\r\n" + obj.message});
				}
				else{
					msgBox.alert({info: cmnPcr.jsonToStr(obj)}); 
				}}
		});
	}
	return false;
}

//停用版本
function inactivateVersion(versionId){ 		 
	if(msgBox.confirm({info:"确定要停用吗?"})){
		var excelGridId = getCurrentExcelGridId();
		var requestParam = {
			excelGridId: excelGridId, 
			excelGridVersionId: versionId
		};
 		serverAccess.request({
 			waitingBarParentId: "testSheetContainer",
			serviceName:"excelGridNcpService", 
			funcName:"inactivateVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				afterInactivateVersion(versionId);
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	return false;
}

//版本版本
function deleteVersion(versionId){	 		 
	if(msgBox.confirm({info:"确定要删除吗?"})){
		var definitionId = getCurrentExcelGridId();
		var requestParam = {
			excelGridId: definitionId,
			versions: [{versionId: versionId}]
		};
 		serverAccess.request({
 			waitingBarParentId: "testSheetContainer",
			serviceName:"excelGridNcpService", 
			funcName:"deleteVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				afterDeleteVersion(versionId);
			},
			failFunc:function(obj){
				if(obj.code == "deleteVersion_002"){
					msgBox.alert({info: obj.message});
				}
				else{
					msgBox.alert({info: cmnPcr.jsonToStr(obj)}); 
				}
			}
		});
	}
	return false;
}

function afterDeleteVersion(versionId){ 
	var row = versionGrid.datatable.getRowByIdField(versionId, "id"); 
	var rowId = row.rowId;
	$(versionGrid.gridCtrl).jqGrid("delRowData", rowId);
	versionGrid.datatable.remove(rowId); 
}

function afterActivateVersion(versionId){	 
	for ( var rowId in versionGrid.datatable.allRows()) {		
		var vRow = versionGrid.datatable.rows(rowId); 
		if(vRow.getValue("enable")){
			vRow.setValue("enable", false);
			$(versionGrid.gridCtrl).jqGrid("setRowData", rowId, vRow.allCells());	
		} 
	}

	var versionRow = versionGrid.datatable.getRowByIdField(versionId, "id");
	versionRow.setValue("enable", true); 
	$(versionGrid.gridCtrl).jqGrid("setRowData", versionRow.rowId, versionRow.allCells());		
	
	var containerId = getCellContainerId(versionRow.getValue("id"));
	var html = getLinkHtml(versionRow.getValue("id"), versionRow.getValue("enable"));
	return $("#" +containerId).html(html);
}

function afterInactivateVersion(versionId){	 
	var versionRow = versionGrid.datatable.getRowByIdField(versionId, "id"); 
	versionRow.setValue("enable", false); 
	$(versionGrid.gridCtrl).jqGrid("setRowData", versionRow.rowId, versionRow.allCells());	
	
	var containerId = getCellContainerId(versionRow.getValue("id"));
	var html = getLinkHtml(versionRow.getValue("id"), versionRow.getValue("enable"));
	return $("#" +containerId).html(html);
}

//获取ExcelGrid
function getCurrentExcelGridId(){
	var mainCardCtrl = sheetWin.sheetCtrl.getMainCardCtrl(); 
	var excelGridId = mainCardCtrl.getCurrentIdValue();
	return excelGridId; 
}

//从模型中增加操作按钮列
viewModels.eg_definitionVersion.colModel.push({name:operateColumnName,
	label:"操作",
	width:110,
	hidden:false,
	sortable:false, 
	search:false,
	resizable:true,
	editable:false,
	canEdit:false,
	formatter:function(cellvalue, options, rowObject){
		var html = getLinkHtml(rowObject.id, rowObject.enable);
		var containerId = getCellContainerId(rowObject.id);
		return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
	}
});