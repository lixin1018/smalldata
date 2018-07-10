var egil = null; 
var instanceId;  
var stepId;
$(document).ready(function(){	
	var queryStrings = cmnPcr.getQueryStringArgs(); 
	instanceId = queryStrings["instance"];  
	stepId = queryStrings["step"];  
	
	egil = new ExcelGridInstanceLayout();
	egil.loadFromServer({
		instanceId: instanceId, 
		stepId: stepId, 
		afterLoadFunc: function(){
			egil.canEdit = egil.stepRowJson.resultType == "waitingProcess";
			egil.show({
				currentCellInfoDivId: "currentCellInfoDivId",
				editExpressionButtonId: "editExpressionButtonId",
				cellOutEditorId: "cellOutEditorId",
				containerId: "instancelayoutContainerId",
				toolbarContainerId: "toolbarContainerId",
				titleContainerId: "instanceTitleContainerId",
				subTitleContainerId: "instanceSubTitleContainerId" 
			});
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
	$("#endBtnId").click(function(e){
		egil.showEndWindow({ 
		});	
	});
	$("#showFlowBtnId").click(function(e){
		egil.showFlowWindow({
			contentDivId: "showFlowDivId"
		});	
	});
	$("#saveInstanceBtnId").click(function(){
		if(egil.canEdit){
		egil.saveToServer({
			afterSaveFunc:function(){
				showTitle();
			}
		});
		}
		else{
			msgBox.alert({info: "不允许保存. \r\n当前表格的状态为 " + egil.stepRow.statusNote});
		}
	}); 
	
	$("#titleBtnId").click(function(){
		msgBox.htmlWindow({
			title: "标题",
			label: "请输入表格标题",
			text: egil.stepRowJson.title == null ? "" : egil.stepRowJson.title,
			type: "oneInputTextarea",
			okFunction: function(p){
				egil.stepRowJson.title = p.text;
				showTitle();
				p.closeWin();
			}
		});
	});
	
	$("#convergeBtnId").click(function(){
		var selectStepIds = getSelectStepIds();
		if(selectStepIds.length <= 1){
			msgBox.alert({info: "请选中多个任务"});
		}
		else{
			if(msgBox.confirm({info: "确定要进行合并处理吗?"})){
				converge(instanceId, selectStepIds)
			}
		}
	});
	
	$("#selectAllStepBtnId").click(function(){
		var isSelectAll = $("#selectAllStepBtnId").is(":checked");
		selectAllSteps(isSelectAll);
	});
	
	$(".stepListItemSelectButton").click(function(){
		checkNeedSelectAll(); 
	});
});  

function showTitle(){
	$("#" + egil.titleContainerId).text(egil.stepRowJson.title);
	var subTitle = cmnPcr.html_encode(egil.instanceRowJson.statusNote) + (egil.canEdit ?  "" : "&nbsp;<span style='color:#FF0000;font-weight:600;'>(不能编辑)</span>");
	$("#" + egil.subTitleContainerId).html(subTitle); 
	$("title").html("任务处理-" + egil.stepRowJson.title); 
	$("#saveInstanceBtnId").css("display", egil.canEdit ? "block" : "none");
	$("#driveToNextBtnId").css("display", egil.canEdit ? "block" : "none");
	$("#endBtnId").css("display", egil.canEdit ? "block" : "none");
	$("#titleBtnId").css("display", egil.canEdit ? "block" : "none");
}

function converge(instanceId, stepIds){	
	var title = $("#instanceTitleHiddenInputId").val(); 
	
	var requestParam = {
		instanceId: instanceId,
		fromStepArray: [],
		title: title,
		note: ""
	};
	
	for(var i = 0; i < stepIds.length; i++){ 
		requestParam.fromStepArray.push({
			fromStepId: stepIds[i]
		});
	}	
	
	serverAccess.request({
		waitingBarParentId: "bodyId",
		serviceName:"excelGridInstanceNcpService", 
		funcName:"converge", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			var toStepId = obj.result.toStepId;
			msgBox.alert({info: "系统将跳转至合并处理页面"});
			window.location = "processInstance.jsp?instance=" + instanceId + "&step=" + toStepId;
		}
	});
}

function checkNeedSelectAll(){
	var needSelctAll = true;
	var allCheckBoxes = $(".stepListItemSelectButton");
	for(var i = 0; i < allCheckBoxes.length; i++){
		var checkbox = allCheckBoxes[i];
		if(!$(checkbox).is(":checked")){
			needSelctAll = false;
			break;
		}
	}
	if(needSelctAll){
		$("#selectAllStepBtnId").attr("checked", "checked");
	}
	else{
		$("#selectAllStepBtnId").removeAttr("checked");
	} 
}

function selectAllSteps(isSelectAll){
	var allCheckBoxes = $(".stepListItemSelectButton");
	for(var i = 0; i < allCheckBoxes.length; i++){
		var checkbox = allCheckBoxes[i];
		if(isSelectAll){
			$(checkbox).attr("checked", "checked");
		}
		else{
			$(checkbox).removeAttr("checked");
		}
	}
}

function getSelectStepIds(){
	var stepIds = new Array();
	var stepCheckBoxs = $(".stepListItemSelectButton");
	for(var i = 0; i < stepCheckBoxs.length; i++){
		var stepCheckBox = stepCheckBoxs[i];
		if($(stepCheckBox).is(":checked")){ 
			var stepId = $(stepCheckBox).attr("stepId");
			stepIds.push(stepId);
		}
	}
	return stepIds;
}