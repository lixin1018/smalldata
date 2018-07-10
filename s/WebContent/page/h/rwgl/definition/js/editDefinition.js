var egl = null; 
$(document).ready(function(){	
	var queryStrings = cmnPcr.getQueryStringArgs();
	var excelGridId = queryStrings["excelgrid"];
	var versionId = queryStrings["version"];  
	
	egl = new ExcelGridDefinitionLayout({
			bodyId: "bodyContainerId",
			currentCellInfoDivId: "currentCellInfoDivId",
			editExpressionButtonId: "editExpressionButtonId",
			cellOutEditorId: "cellOutEditorId",
			containerId: "excelSheetListId",
			sheetlayoutModuleId: "sheetlayoutModuleId",
			toolbarContainerId: "toolbarContainerId",
			titleContainerId: "excelGridTitleContainerId",
			subTitleContainerId: "excelGridSubTitleContainerId"
		});	
	egl.loadFromServer({
		excelGridId: excelGridId,
		versionId:versionId,
		afterLoadFunc: function(){ 
			egl.show({});
			showTitle(); 
		}
	});
		
	$("#colCut").click(function(e){
		egl.colCut(e);
	});
	$("#colCopy").click(function(e){
		egl.colCopy(e);				
	});
	$("#colPaste").click(function(e){
		egl.colPaste(e);	
	});
	$("#colDelete").click(function(e){
		egl.colDelete(e);	
	});
	$("#colInsertBefore").click(function(e){
		egl.colInsertBefore(e);	
	});
	$("#colInsertAfter").click(function(e){
		egl.colInsertAfter(e);	
	});
	$("#colClearContent").click(function(e){
		egl.colClearContent(e);	
	});
	$("#colSetWidth").click(function(e){
		egl.colSetWidth(e);	
	});
	$("#rowCut").click(function(e){
		egl.rowCut(e);	
	});
	$("#rowCopy").click(function(e){
		egl.rowCopy(e);	
	});
	$("#rowPaste").click(function(e){
		egl.rowPaste(e);	
	});
	$("#rowDelete").click(function(e){
		egl.rowDelete(e);	
	});
	$("#rowInsertBefore").click(function(e){
		egl.rowInsertBefore(e);	
	});
	$("#rowInsertAfter").click(function(e){
		egl.rowInsertAfter(e);	
	});
	$("#rowClearContent").click(function(e){
		egl.rowClearContent(e);	
	});
	$("#rowSetHeight").click(function(e){
		egl.rowSetHeight(e);	
	});
	$("#cellCopy").click(function(e){
		egl.cellCopy(e);	
	});
	$("#cellPaste").click(function(e){
		egl.cellPaste(e);	
	});
	$("#cellClearContent").click(function(e){
		egl.cellClearContent(e);	
	}); 
	$("#cellMerge").click(function(e){
		egl.cellMerge(e);	
	}); 
	$("#cellUnmerge").click(function(e){
		egl.cellUnmerge(e);	
	}); 
	$("#formFreeze").click(function(e){
		egl.freezeForm(e);	
	});	
	$("#sheetToPrevious").click(function(e){
		egl.sheetToPrevious(e);
	});
	$("#sheetToNext").click(function(e){
		egl.sheetToNext(e);
	}); 
	$("#sheetRename").click(function(e){
		egl.sheetRename(e);
	});
	$("#sheetInsert").click(function(e){
		egl.sheetInsert(e);
	});
	$("#sheetAllInsert").click(function(e){
		egl.sheetInsert(e);
	});
	$("#sheetDelete").click(function(e){
		egl.sheetDelete(e);
	});
	
	$("#saveDefinitionBtnId").click(function(){
		egl.saveToServer({
			afterSaveFunc:function(){
				showTitle();
			}
		});
	}); 
	
	$("#styleBtnId").click(function(){
		egl.showCssEditorWindow({
			contentDivId: "cssEditorDivId",
			afterOkFunction: function(p){
				egl.setCellCssStyle(p);
			}
		});
	});
	
	$("#viewBtnId").click(function(){
		egl.showViewEditorWindow({
			contentDivId: "viewEditorDivId",
			afterOkFunction: function(p){
				egl.setView(p);
			}
		});
	});
	
	$("#activateDefinitionBtnId").click(function(){ 
		egl.activiteOnServer({
			afterActiviteFunc:function(){
				showTitle();
				msgBox.alert({info: "此版本已经启用"});
			}});
		return false;
	});
	
	$("#propertyBtnId").click(function(){
		msgBox.htmlWindow({
			title: "属性",
			label: "备注",
			text: egl.excelGridRowJson.description == null ? "" : egl.excelGridRowJson.description,
			type: "oneInputTextarea",
			okFunction: function(p){
				egl.excelGridRowJson.description = p.text;
				p.closeWin();
			}
		});
	});
});

function showTitle(){
	$("#" + egl.titleContainerId).text(egl.excelGridRowJson.definitionName);
	$("#" + egl.subTitleContainerId).text((egl.excelGridRowJson.enable == "Y" ? "已启用" : "未启用") + ", 创建时间: " + egl.excelGridRowJson.createTime);
}