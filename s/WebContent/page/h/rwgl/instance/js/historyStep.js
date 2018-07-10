var egil = null; 
var instanceId;  
var stepId;
$(document).ready(function(){	
	var queryStrings = cmnPcr.getQueryStringArgs(); 
	instanceId = queryStrings["instance"];  
	stepId = queryStrings["step"];  
	
	egil = new ExcelGridInstanceLayout({
			bodyId: "bodyContainerId",
			currentCellInfoDivId: "currentCellInfoDivId",
			editExpressionButtonId: "editExpressionButtonId",
			cellOutEditorId: "cellOutEditorId",
			containerId: "excelSheetListId",
			toolbarContainerId: "toolbarContainerId",
			titleContainerId: "instanceTitleContainerId",
			subTitleContainerId: "instanceSubTitleContainerId" 
		});
	egil.loadFromServer({
		instanceId: instanceId, 
		stepId: stepId, 
		afterLoadFunc: function(){
			egil.canEdit = egil.stepRowJson.resultType == "waitingProcess";
			egil.show({});
			showTitle();
		}
	});
	
	$("#colCut").click(function(e){
		egil.colCut(e);
	});
	$("#colCopy").click(function(e){
		egil.colCopy(e);				
	});
	$("#colPaste").click(function(e){
		egil.colPaste(e);	
	});
	$("#colDelete").click(function(e){
		egil.colDelete(e);	
	});
	$("#colInsertBefore").click(function(e){
		egil.colInsertBefore(e);	
	});
	$("#colInsertAfter").click(function(e){
		egil.colInsertAfter(e);	
	});
	$("#colClearContent").click(function(e){
		egil.colClearContent(e);	
	});
	$("#colSetWidth").click(function(e){
		egil.colSetWidth(e);	
	});
	$("#rowCut").click(function(e){
		egil.rowCut(e);	
	});
	$("#rowCopy").click(function(e){
		egil.rowCopy(e);	
	});
	$("#rowPaste").click(function(e){
		egil.rowPaste(e);	
	});
	$("#rowDelete").click(function(e){
		egil.rowDelete(e);	
	});
	$("#rowInsertBefore").click(function(e){
		egil.rowInsertBefore(e);	
	});
	$("#rowInsertAfter").click(function(e){
		egil.rowInsertAfter(e);	
	});
	$("#rowClearContent").click(function(e){
		egil.rowClearContent(e);	
	});
	$("#rowSetHeight").click(function(e){
		egil.rowSetHeight(e);	
	});
	$("#cellCopy").click(function(e){
		egil.cellCopy(e);	
	});
	$("#cellPaste").click(function(e){
		egil.cellPaste(e);	
	});
	$("#cellClearContent").click(function(e){
		egil.cellClearContent(e);	
	}); 
	$("#cellMerge").click(function(e){
		egil.cellMerge(e);	
	}); 
	$("#cellUnmerge").click(function(e){
		egil.cellUnmerge(e);	
	}); 
	$("#formFreeze").click(function(e){
		egil.freezeForm(e);	
	}); 
	$("#driveToNextBtnId").click(function(e){
		egil.showDriveToNextWindow({
			contentDivId: "driveToNextSelectUserDivId" 
		});	
	});
	$("#bringBackBtnId").click(function(e){
		egil.showBringBackWindow({
			contentDivId: "bringBackDivId"
		});	
	});
	$("#showFlowBtnId").click(function(e){
		egil.showFlowWindow({
			contentDivId: "showFlowDivId"
		});	
	});
});  

function showTitle(){
	$("#" + egil.titleContainerId).text(egil.stepRowJson.title);
	var subTitle = cmnPcr.html_encode(egil.instanceRowJson.statusNote);
	$("#" + egil.subTitleContainerId).html(subTitle); 
	$("title").html("历史经办-" + egil.stepRowJson.title); 
}