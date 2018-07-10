var egil = null; 
$(document).ready(function(){
	var queryStrings = cmnPcr.getQueryStringArgs(); 
	fileId = queryStrings["did"];   
	
	egil = new DataFileExcelGridLayout({
			bodyId: "bodyContainerId",
			currentCellInfoDivId: "currentCellInfoDivId",
			editExpressionButtonId: "editExpressionButtonId",
			cellOutEditorId: "cellOutEditorId",
			containerId: "excelSheetListId",
			toolbarContainerId: "toolbarContainerId",
			titleContainerId: "titleContainerId"
		});
	egil.loadFromServer({
		fileId: fileId,  
		afterLoadFunc: function(){ 
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
	$("#sheetToPrevious").click(function(e){
		egil.sheetToPrevious(e);
	});
	$("#sheetToNext").click(function(e){
		egil.sheetToNext(e);
	}); 
	$("#sheetRename").click(function(e){
		egil.sheetRename(e);
	});
	$("#sheetInsert").click(function(e){
		egil.sheetInsert(e);
	});
	$("#sheetAllInsert").click(function(e){
		egil.sheetInsert(e);
	});
	$("#sheetDelete").click(function(e){
		egil.sheetDelete(e);
	});
	$("#saveInstanceBtnId").click(function(){ 
		egil.saveToServer({
			afterSaveFunc:function(){
				showTitle();
			}
		}); 
	}); 
	
	$("#styleBtnId").click(function(){
		egil.showCssEditorWindow({
			contentDivId: "cssEditorDivId",
			afterOkFunction: function(p){
				egil.setCellCssStyle(p);
			}
		});
	});
	
	$("#viewBtnId").click(function(){
		egil.showViewEditorWindow({
			contentDivId: "viewEditorDivId",
			afterOkFunction: function(p){
				egil.setView(p);
			}
		});
	});
	
	$("#titleBtnId").click(function(){
		msgBox.htmlWindow({
			title: "标题",
			label: "请输入表格标题",
			text: egil.file.name == null ? "" : egil.file.name,
			type: "oneInputText",
			okFunction: function(p){
				egil.file.name = p.text;
				showTitle();
				p.closeWin();
			} 
		});
	});
});  

function showTitle(){
	$("#" + egil.titleContainerId).text(egil.file.name); 
}