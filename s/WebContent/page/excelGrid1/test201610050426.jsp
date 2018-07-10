<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Data模型列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
	<style>		
		.gridToolbar{
		    width: 100%;
		    height:27px;
		}
		.gridEditbar{
	        font-size: 13px; 
		    width: 100%;
		    height:29px;
		}
		.gridEditor{
	        font-size: 13px;
		    width: 100%; 
		    height: 100%;  
		} 
	 	.gridCellDiv {
	 	}
	 	.gridCellInnerDiv {
	 		padding:1px;
	 		width:100%;
	 		height:100%;
	 	}
	 	.gridCellInnerDivCurrent {
			background-color:#68C5FF;
	 	}
	 	.gridCellInnerDivEditing {
	 		padding:0px; 
	 	}
		.cellEditor { 
			width:100%;
			height:100%;
			border-width:2px;
			padding:0px;
			resize:none;
			border-color:#217346;
			font-size: 15px;
			overflow-x:auto;
			overflow-y:auto;
		}
		.normalTable { 
			border-collapse:collapse;
			border-left-width:0px;
			border-top-width:0px; 
			border-bottom-width:0px;
			border-right-width:0px;
			border-style:solid;
			border-color:#000000; 
			font-size: 11px;
			font-family:SimSun;
			padding:0px;
		}
		
		.titleCell {
			border-style:solid;
			border-color:#cccccc;
			border-left-width:0px;
			border-top-width:0px; 
			border-bottom-width:1px;
			border-right-width:1px;
			overflow:hidden;  
			padding:0px;
			background-color:#F4F4F4;
			text-align:center;
			display:table-cell;
			font-size: 12px;
		}		
		.selectedCell {
			background-color: #BFE5FF;
		}		
		.gridSelectedCell {
			background-color: #cccccc;
		}		
		.rowSelectedCell {
			background-color: #dddddd;
		}		
		.colSelectedCell {
			background-color: #dddddd;
		}		
		.normalCell {
			border-style:solid;
			border-color:#cccccc;
			border-left-width:0px;
			border-top-width:0px; 
			border-bottom-width:1px;
			border-right-width:1px;
			overflow:hidden;  
			padding:0px;
			font-size: 15px;
		}
	</style>
	<script type="text/javascript"> 
		$(document).ready(function(){
			bindMenuEvent();
			var egl = new excelGridLayout();
			egl.create({
				columnCount: 40,
				columnWidth: 80,
				rowCount:40,
				rowHeight:25
			});

			/*
			for(var i=0;i<egl.eg.allColumns.length;i++){
				var col = egl.eg.allColumns[i];
				for(var j=0;j<egl.eg.allRows.length;j++){
					var row = egl.eg.allRows[j];
					var cell = egl.eg.allCells[col.id + "_" + row.id];
					cell.value = j+","+i;
				}	
			}
			
			egl.eg.mergeCells({left: 2, right: 2, top: 2, bottom: 3}); 
			egl.eg.mergeCells({left: 5, right: 9, top: 6, bottom: 8});
			*/
			egl.show({
				containerId: "excelGridlayoutContainerId",
				toolbarContainerId: "toolbarContainerId"
			});
		});
		
		var currentGridLayoutObject = null;
		
		function bindMenuEvent(){
			$("#colCut").click(function(e){
				currentGridLayoutObject.colCut(e);
			});
			$("#colCopy").click(function(e){
				currentGridLayoutObject.colCopy(e);				
			});
			$("#colPaste").click(function(e){
				currentGridLayoutObject.colPaste(e);	
			});
			$("#colDelete").click(function(e){
				currentGridLayoutObject.colDelete(e);	
			});
			$("#colInsertBefore").click(function(e){
				currentGridLayoutObject.colInsertBefore(e);	
			});
			$("#colInsertAfter").click(function(e){
				currentGridLayoutObject.colInsertAfter(e);	
			});
			$("#colClearContent").click(function(e){
				currentGridLayoutObject.colClearContent(e);	
			});
			$("#colSetWidth").click(function(e){
				currentGridLayoutObject.colSetWidth(e);	
			});
			$("#rowCut").click(function(e){
				currentGridLayoutObject.rowCut(e);	
			});
			$("#rowCopy").click(function(e){
				currentGridLayoutObject.rowCopy(e);	
			});
			$("#rowPaste").click(function(e){
				currentGridLayoutObject.rowPaste(e);	
			});
			$("#rowDelete").click(function(e){
				currentGridLayoutObject.rowDelete(e);	
			});
			$("#rowInsertBefore").click(function(e){
				currentGridLayoutObject.rowInsertBefore(e);	
			});
			$("#rowInsertAfter").click(function(e){
				currentGridLayoutObject.rowInsertAfter(e);	
			});
			$("#rowClearContent").click(function(e){
				currentGridLayoutObject.rowClearContent(e);	
			});
			$("#rowSetHeight").click(function(e){
				currentGridLayoutObject.rowSetHeight(e);	
			});
			$("#cellCopy").click(function(e){
				currentGridLayoutObject.cellCopy(e);	
			});
			$("#cellPaste").click(function(e){
				currentGridLayoutObject.cellPaste(e);	
			});
			$("#cellClearContent").click(function(e){
				currentGridLayoutObject.cellClearContent(e);	
			}); 
			$("#cellMerge").click(function(e){
				currentGridLayoutObject.cellMerge(e);	
			}); 
			$("#cellUnmerge").click(function(e){
				currentGridLayoutObject.cellUnmerge(e);	
			}); 
		}

		//excel表格显示，此类实现的功能方法，解决展示效果
		function excelGridLayout(){
			var that = this;
				
			//默认列标行的高度 、行标列的宽度
			this.titleRowHeight = 22;
			this.titleColumnWidth = 40;
			this.borderWidth = 1;
			
			//excelGrid
			this.eg = null;
			
			//container document element
			this.containerId = null;
			
			//单元格外部编辑框
			this.cellOutEditor = null; 
			
			//显示当前选中单元格名称的DIV
			this.currentCellInfoDiv = null;
						
			/*
			单元格表达式存在两种形式：
			1. 以单元格名称方式引用单元格，例如D3、D3:E5、$D$3；
			2. 以单元格Id方式引用单元格，例如guid列_guid行、guidA列_guidA行:guidB列_guidB行、$guid列_$guid行；
			处理逻辑：
			1. 编辑表达式后，表达式被传输到服务器端，由服务器解析，并返回解析后得到的包含单元格Id方式引用的公式；
			2. 保存设计时，批量验证表达式中出现的guid是否还有效，有可能引用的行列被删除了；
			3. 批量填充序列时，如果是绝对位置引用，那么引用的guid位置不变，如果是相对引用，那么需要请求服务器端，处理一下两种形式的表达式。
			*/
				
			//当前单元格id
			this.currentCellId = null;
			
			//工具栏容器id
			this.toolbarContainerId = null;
			
			//最后一个被选中的单元格
			this.lastClickTdId = null;
			this.lastShiftClickTdId = null;
			
			//调用服务器端，保存当前编辑的表格
			this.saveToServer = function(p){
				~~~~~~~~~~~~~~~~~~~~~~~
			}
			
			//调用服务器端，验证表达式
			this.checkExpression = function(p){
				//p.expText 表达式文本
				//p.currentRowId当前行Id
				//p.currentColId当前列Id
				//p.allRowIds所有行Id
				//p.allColumnIds所有列Id
				
				~~~~~~~~~~~~~~~~~~~~~~~~~~~
			}

			//创建新的
			this.create = function(p){
				var eg = new excelGrid();
				eg.create(p);
				this.eg = eg;
			}
			
			//加载已存在的
			this.load = function(p){
				
			}
			
			this.setCurrentCell = function(colId, rowId){				
				if(this.currentCellId != null){
					$("#" + this.containerId + "_" + this.currentCellId).children("div").children("div").removeClass("gridCellInnerDivCurrent");
					$("#" + this.containerId + "_" + this.currentCellId).removeAttr("isCurrentCell");
				}
				if(colId != null && rowId != null){
					var cellId = colId + "_" + rowId;
					var cellType = $("#" + this.containerId + "_" + cellId).attr("cellType");
					if(cellType == "normalCell") {
						this.currentCellId = cellId;
						$("#" + this.containerId + "_" + cellId).children("div").children("div").addClass("gridCellInnerDivCurrent");
						$("#" + this.containerId + "_" + cellId).attr("isCurrentCell", true);
	
						if($("#" + this.containerId).find("td[editing='true']").length == 0){ 
							var cell = this.eg.allCells[cellId];
							var text = cell.getShowText();
							$(this.cellOutEditor).val(text);
						}
						this.refreshCurrentName(cellId);
					}
					else{
						this.currentCellId = null;
						this.refreshCurrentName(null);
					}
				}
				else{
					this.currentCellId = null;
					this.refreshCurrentName(null);
				}
			}
			
			this.refreshOutEditorText = function(){
				if($("#" + this.containerId).find("td[editing='true']").length == 0){ 
					var currentCellElements = $("#" + this.containerId).find("td[isCurrentCell='true']");
					if(currentCellElements.length > 0){
						var currentCellElement = currentCellElements[0];
						var colId = $(currentCellElement).attr("colId");
						var rowId = $(currentCellElement).attr("rowId");
						var cell = this.eg.allCells[colId + "_" + rowId];
						var text = cell.getShowText();
						$(this.cellOutEditor).val(text);
					}
				}
			}
			
			this.refreshCurrentName = function(cellId){
				if(cellId != null){
					var cell = this.eg.allCells[cellId];
					var colName = this.eg.getColumnNameById($(cell).attr("columnId"));
					var rowIndex = this.eg.getRowIndexById($(cell).attr("rowId")) + 1;
					$(this.currentCellInfoDiv).text(colName + rowIndex);
				}
				else{
					$(this.currentCellInfoDiv).text("");
				}
			}

			this.disSelectedAll = function(){ 
				$("#" + this.containerId).find("td[cellType='normalCell']").removeClass("selectedCell");
				$("#" + this.containerId).find("td[cellType='rowTitleCell']").removeClass("rowSelectedCell");
				$("#" + this.containerId).find("td[cellType='colTitleCell']").removeClass("colSelectedCell");
				$("#" + this.containerId).find("td[cellType='gridTitleCell']").removeClass("gridSelectedCell");

				/*
				$("#" + this.containerId).find("td").removeClass("selectedCell").removeClass("rowSelectedCell").removeClass("colSelectedCell").removeClass("gridSelectedCell");*/
			}
			
			this.checkSelected = function(tdId){ 
				var isSelected = $("#" + tdId).hasClass("selectedCell")
				|| $("#" + tdId).hasClass("rowSelectedCell")
				|| $("#" + tdId).hasClass("colSelectedCell")
				|| $("#" + tdId).hasClass("gridSelectedCell");  
				return isSelected;
			}
		
			this.getRangeRowIds = function(fromRowId, toRowId){
				var fromRowIndex = this.eg.getRowIndexById(fromRowId);
				var toRowIndex = this.eg.getRowIndexById(toRowId);
				var allRowIds = new Array();
				if(fromRowIndex > toRowIndex){
					var temp = fromRowIndex;
					fromRowIndex = toRowIndex;
					toRowIndex = temp;
				}
				for(var i = fromRowIndex; i<=toRowIndex; i++){
					var row = this.eg.getRowByIndex(i);
					allRowIds.push(row.id);
				}
				return allRowIds;
			}
		
			this.getRangeColumnIds = function(fromColId, toColId){
				var fromColIndex = this.eg.getColumnIndexById(fromColId);
				var toColIndex = this.eg.getColumnIndexById(toColId);
				var allColIds = new Array();
				if(fromColIndex > toColIndex){
					var temp = fromColIndex;
					fromColIndex = toColIndex;
					toColIndex = temp;
				}
				for(var i = fromColIndex; i<=toColIndex; i++){
					var col = this.eg.getColumnByIndex(i);
					allColIds.push(col.id);
				}
				return allColIds;
			}
		
			this.selectRows = function(fromRowId, toRowId){
				if(this.lastShiftClickTdId != null){
					var lastShiftClickRowId = $("#" + this.lastShiftClickTdId).attr("rowId");
					var lastSelectedRowIds = this.getRangeRowIds(fromRowId, lastShiftClickRowId);
					for(var i = 0; i < lastSelectedRowIds.length; i++) {
						var rowId = lastSelectedRowIds[i];
						$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").removeClass("rowSelectedCell");
						$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").removeClass("selectedCell");
					}
				}

				var selectedRowIds = this.getRangeRowIds(fromRowId, toRowId);
				for(var i = 0; i < selectedRowIds.length; i++) {
					var rowId = selectedRowIds[i]; 
					$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
					$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
				}
			}

			this.selectColumns = function(fromColId, toColId){
				if(this.lastShiftClickTdId != null){
					var lastShiftClickColId = $("#" + this.lastShiftClickTdId).attr("colId");
					var lastSelectedColIds = this.getRangeColumnIds(fromColId, lastShiftClickColId);
					for(var i = 0; i < lastSelectedColIds.length; i++) {
						var colId = lastSelectedColIds[i];
						$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").removeClass("colSelectedCell");
						$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").removeClass("selectedCell");
					}
				}

				var selectedColIds = this.getRangeColumnIds(fromColId, toColId);
				for(var i = 0; i < selectedColIds.length; i++) {
					var colId = selectedColIds[i];
					$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
					$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
				}
			}
			
			this.selectCells = function(fromColId, fromRowId, toColId, toRowId){
				if(this.lastShiftClickTdId != null){
					var lastShiftClickColId = $("#" + this.lastShiftClickTdId).attr("colId");
					var lastShiftClickRowId = $("#" + this.lastShiftClickTdId).attr("rowId");
					var lastSelectedColIds = this.getRangeColumnIds(fromColId, lastShiftClickColId);
					var lastSelectedRowIds = this.getRangeRowIds(fromRowId, lastShiftClickRowId);
					for(var i = 0; i < lastSelectedColIds.length; i++) {
						var colId = lastSelectedColIds[i];
						for(var j = 0; j < lastSelectedRowIds.length; j++) {
							var rowId = lastSelectedRowIds[j];  
							$("#" + this.containerId + "_" + colId + "_" + rowId).removeClass("selectedCell");
						}
					}
				}

				var selectedColIds = this.getRangeColumnIds(fromColId, toColId);
				var selectedRowIds = this.getRangeRowIds(fromRowId, toRowId);
				for(var i = 0; i < selectedColIds.length; i++) {
					var colId = selectedColIds[i];
					for(var j = 0; j < selectedRowIds.length; j++) {
						var rowId = selectedRowIds[j];  
						$("#" + this.containerId + "_" + colId + "_" + rowId).addClass("selectedCell");
					}
				}
			}
			
			this.selectCell = function(tdElementId, shiftKey, ctrlKey, isEditExp){
				var colId = $("#" + tdElementId).attr("colId");
				var rowId = $("#" + tdElementId).attr("rowId");
				var cellType = $("#" + tdElementId).attr("cellType"); 
				
				this.setCurrentCell(colId, rowId);
				
				if(shiftKey){
					this.clearSelectedText();
					if(this.lastClickTdId == null || !this.checkSelected(this.lastClickTdId)){
						switch(cellType){
							case "rowTitleCell":
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
								break;
							case "colTitleCell":
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
								break;
							case "gridTitleCell":
								$("#" + this.containerId).find("td").addClass("gridSelectedCell");
								$("#" + this.containerId).find("td[cellType='normalCell']").addClass("selectedCell");
								$("#" + this.containerId).find("td[cellType='colTitleCell']").addClass("colSelectedCell");
								$("#" + this.containerId).find("td[cellType='rowTitleCell']").addClass("rowSelectedCell");
								break;
							case "normalCell":
								$("#" + tdElementId).addClass("selectedCell");
								break;
						}
						this.lastClickTdId = tdId;
						this.lastShiftClickTdId = null;

						if(isEditExp) {
							var result = {operateType: "appendExp", exp: ""};
							switch(cellType){
								case "rowTitleCell": 
									var rowIndex = this.eg.getRowIndexById(rowId);
									result.exp = (rowIndex + 1);
									break;
								case "colTitleCell": 
									var colName = this.eg.getColumnNameById(colId);
									result.exp = colName;
									break; 
								case "normalCell": 
									var rowIndex = this.eg.getRowIndexById(rowId);
									var colName = this.eg.getColumnNameById(colId); 
									result.exp = colName + (rowIndex + 1);
									break;
							}
							return result;
						}
					}
					else{
						var lastColId = $("#" + this.lastClickTdId).attr("colId");
						var lastRowId = $("#" + this.lastClickTdId).attr("rowId");
						var lastCellType = $("#" + this.lastClickTdId).attr("cellType");  
						switch(cellType){
							case "rowTitleCell":
								{
									if(lastCellType == "rowTitleCell" || lastCellType == "normalCell"){
										//选中lastRowId和rowId之间所有的行
										this.selectRows(lastRowId, rowId);
										this.lastShiftClickTdId = tdElementId;
									}
									else if(lastCellType == "colTitleCell"){
										$("#" + this.containerId).find("td[rowId='" + colId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
										$("#" + this.containerId).find("td[rowId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
										this.lastClickTdId = tdElementId;
										this.lastShiftClickTdId = null;
									}
								}
								break;
							case "colTitleCell":
								{
									if(lastCellType == "colTitleCell" || lastCellType == "normalCell"){
										//选中 lastColId和colId之间所有的列
										this.selectColumns(lastColId, colId);
										this.lastShiftClickTdId = tdElementId;
									}
									else if(lastCellType == "rowTitleCell"){
										$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
										$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
										this.lastClickTdId = tdElementId;
										this.lastShiftClickTdId = null;
									}
								}
								break; 
							case "normalCell":
								if(lastCellType == "colTitleCell"){
									//选中 lastColId和colId之间所有的列
									this.selectColumns(lastColId, colId);
									this.lastShiftClickTdId = tdElementId;
								}
								else if(lastCellType == "rowTitleCell"){
									//选中lastRowId和rowId之间所有的行
									this.selectRows(lastRowId, rowId);
									this.lastShiftClickTdId = tdElementId;
								}
								else if(lastCellType == "normalCell"){
									//二者间的所有单元格
									this.selectCells(lastColId, lastRowId, colId, rowId);
									this.lastShiftClickTdId = tdElementId;
								}
								break;
						}
						
						if(isEditExp) {
							var result = {operateType: "replaceExp", exp: ""};
							switch(cellType){
								case "rowTitleCell": 
									{
										if(lastCellType == "rowTitleCell" || lastCellType == "normalCell"){ 
											var lastRowIndex = this.eg.getRowIndexById(lastRowId);
											var rowIndex = this.eg.getRowIndexById(rowId);
											result.exp = (lastRowIndex + 1) + ":" + (rowIndex + 1);
										}
										else if(lastCellType == "colTitleCell"){
											var colName = this.eg.getColumnNameById(colId);
											result.exp = colName + ":" + colName;
										}
									}
									break;
								case "colTitleCell": 
									{
										if(lastCellType == "colTitleCell" || lastCellType == "normalCell"){ 
											var lastColName = this.eg.getColumnNameById(lastColId);
											var colName = this.eg.getColumnNameById(colId);
											result.exp = lastColName + ":" + colName;
										}
										else if(lastCellType == "rowTitleCell"){
											var rowIndex = this.eg.getRowIndexById(rowId);
											result.exp = (rowIndex + 1);
										}
									}
									break; 
								case "normalCell": 
									if(lastCellType == "colTitleCell"){
										var lastColName = this.eg.getColumnNameById(lastColId);
										var colName = this.eg.getColumnNameById(colId);
										result.exp = lastColName + ":" + colName;
									}
									else if(lastCellType == "rowTitleCell"){
										var lastRowIndex = this.eg.getRowIndexById(lastRowId);
										var rowIndex = this.eg.getRowIndexById(rowId);
										result.exp = (lastRowIndex + 1) + ":" + (rowIndex + 1);
									}
									else if(lastCellType == "normalCell"){
										var lastColName = this.eg.getColumnNameById(lastColId);
										var colName = this.eg.getColumnNameById(colId);
										var lastRowIndex = this.eg.getRowIndexById(lastRowId);
										var rowIndex = this.eg.getRowIndexById(rowId);
										result.exp = lastColName + (lastRowIndex + 1) + ":" + colName + (rowIndex + 1);
									} 
									break;
							}
							return result;
						}
					}
				}
				else if(ctrlKey){
					this.lastClickTdId = tdElementId;
					this.lastShiftClickTdId = null;
					var isSelected = this.checkSelected(tdElementId);
					if(isSelected){
						switch(cellType){
							case "rowTitleCell":
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").removeClass("rowSelectedCell");
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").removeClass("selectedCell");
								break;
							case "colTitleCell":
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").removeClass("colSelectedCell");
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").removeClass("selectedCell");
								break;
							case "gridTitleCell":
								$("#" + this.containerId).find("td[cellType='gridTitleCell']").removeClass("gridSelectedCell");
								$("#" + this.containerId).find("td[cellType='normalCell']").removeClass("selectedCell");
								$("#" + this.containerId).find("td[cellType='colTitleCell']").removeClass("colSelectedCell");
								$("#" + this.containerId).find("td[cellType='rowTitleCell']").removeClass("rowSelectedCell");
								break;
							case "normalCell":
								$("#" + tdElementId).removeClass("selectedCell");
								break;
						} 
					}
					else {
						switch(cellType){
							case "rowTitleCell":
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
								$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
								break;
							case "colTitleCell":
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
								$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
								break;
							case "gridTitleCell":
								$("#" + this.containerId).find("td[cellType='gridTitleCell']").addClass("gridSelectedCell");
								$("#" + this.containerId).find("td[cellType='normalCell']").addClass("selectedCell");
								$("#" + this.containerId).find("td[cellType='colTitleCell']").addClass("colSelectedCell");
								$("#" + this.containerId).find("td[cellType='rowTitleCell']").addClass("rowSelectedCell");
								break;
							case "normalCell":
								$("#" + tdElementId).addClass("selectedCell");
								break;
						}
						if(isEditExp) {
							var result = {operateType: "appendExp", exp: ""};
							switch(cellType){
								case "rowTitleCell": 
									var rowIndex = this.eg.getRowIndexById(rowId);
									result.exp = (rowIndex + 1) + ":" + (rowIndex + 1);
									break;
								case "colTitleCell": 
									var colName = this.eg.getColumnNameById(colId);
									result.exp = colName + ":" + colName;
									break; 
								case "normalCell": 
									var rowIndex = this.eg.getRowIndexById(rowId);
									var colName = this.eg.getColumnNameById(colId); 
									result.exp = colName + (rowIndex + 1);
									break;
							}
							return result;
						}
					}
				}
				else {					
					this.lastClickTdId = tdElementId;	
					this.lastShiftClickTdId = null;	
					this.disSelectedAll();
					switch(cellType){
						case "rowTitleCell":
							$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
							$("#" + this.containerId).find("td[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
							break;
						case "colTitleCell":
							$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
							$("#" + this.containerId).find("td[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
							break;
						case "gridTitleCell":
							$("#" + this.containerId).find("td[cellType='gridTitleCell']").addClass("gridSelectedCell");
							$("#" + this.containerId).find("td[cellType='normalCell']").addClass("selectedCell");
							$("#" + this.containerId).find("td[cellType='colTitleCell']").addClass("colSelectedCell");
							$("#" + this.containerId).find("td[cellType='rowTitleCell']").addClass("rowSelectedCell");
							break;
						case "normalCell":
							$("#" + tdElementId).addClass("selectedCell"); 
							break;
					}
					if(isEditExp) {
						var result = {operateType: "replaceExp", exp: ""};
						switch(cellType){
							case "rowTitleCell": 
								var rowIndex = this.eg.getRowIndexById(rowId);
								result.exp = (rowIndex + 1) + ":" + (rowIndex + 1);
								break;
							case "colTitleCell": 
								var colName = this.eg.getColumnNameById(colId);
								result.exp = colName + ":" + colName;
								break; 
							case "normalCell": 
								var rowIndex = this.eg.getRowIndexById(rowId);
								var colName = this.eg.getColumnNameById(colId); 
								result.exp = colName + (rowIndex + 1);
								break;
						}
						return result;
					}
				}
			}
			
			//清除被选中的文本
			this.clearSelectedText = function () {
			    if (document.selection && document.selection.empty) {
			       // 兼容 IE8 以下，但 IE9+ 以上同样可用
			        document.selection.empty();
			        // 或使用 clear() 方法
			        // document.selection.clear();
			    }       
			    else{
			        // 获取选中
			        var selection = window.getSelection();
			        // 清除选中
			        selection.removeAllRanges();
			    }
			}
			
			this.mainDivScroll = function(scrollDiv){
			    var scrollLeft = scrollDiv.scrollLeft;
			    $("#" + this.containerId).find("div[name='topFrozenDiv']").scrollLeft(scrollLeft);   
			    var scrollTop = scrollDiv.scrollTop;
			    $("#" + this.containerId).find("div[name='leftFrozenDiv']").scrollTop(scrollTop);   
			    //document.getElementById("leftFrozenDivId").scrollTop = scrollTop;    
			} 
			
			//展示表格
			this.show = function(p){
				this.containerId = p.containerId;	
				this.toolbarContainerId = p.toolbarContainerId;	
				this.layout();
				
				this.cellOutEditor = $("#" + this.toolbarContainerId).find("textarea[name='cellOutEditor']")[0];
				this.currentCellInfoDiv = $("#" + this.toolbarContainerId).find("div[name='currentCellInfoDiv']")[0];
				
				//绑定滚动事件
				$("#" + this.containerId).find("table[name='mainTable']").parent().scroll(function(){that.mainDivScroll(this);});
				
				this.bindEvent();
				
			}
			
			this.checkIsEditExpression = function(){				
				//判断当前正在编辑的单元格
				var editingCells = $("#" + that.containerId).find("td[editing='true']");
				if(editingCells.length > 0){
					var editingCell = editingCells[0];
					var inputElement = $(editingCell).find("textarea");
					var editingValue = $(inputElement).val();
					if(editingValue.length > 0 && editingValue.substr(0, 1) == "="){
						//如果是以=开头，那么点击操作是为了引用
						if(	$(that.cellOutEditor).attr("prefixExp") == null){
							var currentInputElement = ($(that.cellOutEditor).attr("enableEditor") == "in") ? $(editingCell).find("textarea")[0] : this.cellOutEditor;
							this.refreshEditingExpPosition(currentInputElement);
						}
						return true;
					}
					else {	
						//如果不是以=开头，那么结束编辑
						that.endCellEdit(true);
						return false;
					}
				}
				else{
					return false;
				}
			}
			
			this.refreshEditingExpression = function(p){
				if(p.exp != null && p.exp.length != 0){
					var editingCells = $("#" + that.containerId).find("td[editing='true']");
					if(editingCells.length > 0){
						var editingCell = editingCells[0];
						var inInputElement = $(editingCell).find("textarea")[0];
						var inputElement = ($(that.cellOutEditor).attr("enableEditor") == "in") ? inInputElement : this.cellOutEditor;
			           	var prefixExp = $(this.cellOutEditor).attr("prefixExp");
			           	var postfixExp = $(this.cellOutEditor).attr("postfixExp");
			            var clickedExp = $(this.cellOutEditor).attr("clickedExp");  

			            if(prefixExp.length == 0){
			            	prefixExp = "=";
			            }
			            
			           	$(this.cellOutEditor).attr("autoChange", true); 
			            
			           	if(p.operateType == "appendExp"){ 
			           		clickedExp = clickedExp + ", " + p.exp;
			           		var text = prefixExp + clickedExp + postfixExp;
			           		$(inInputElement).val(text); 
			           		$(this.cellOutEditor).val(text);
				           	$(this.cellOutEditor).attr("clickedExp", clickedExp); 
			           	}
			           	else if(p.operateType == "replaceExp"){
			           		clickedExp = p.exp;
			           		var text = prefixExp + clickedExp + postfixExp;
			           		$(inInputElement).val(text); 
			           		$(this.cellOutEditor).val(text); 
				           	$(this.cellOutEditor).attr("clickedExp", clickedExp); 
			           	}
			           	
			           	var currentIndex = (prefixExp + clickedExp).length;
			           	if (inputElement.setSelectionRange) {  
			           		inputElement.setSelectionRange(currentIndex, currentIndex);  
			            }   
			            else if (inputElement.createTextRange) {//IE 
			                var range = inputElement.createTextRange();  
			                range.collapse(true);  
			                range.moveStart('character', currentIndex);  
			                range.moveEnd('character', currentIndex);  
			                range.select();
			            } 
			           	 
			           	$(inputElement).focus(); 
			           	
			           	$(this.cellOutEditor).removeAttr("autoChange");  
					}
				}
			}
			
			this.bindEvent = function(){
				
				$(this.cellOutEditor).focus(function(e){
					$(that.cellOutEditor).attr("enableEditor","out");
				});
				
				$(this.cellOutEditor).change(function(e){
					var autoChange = $(that.cellOutEditor).attr("autoChange") == "true";
					if(!autoChange){
			           	$(that.cellOutEditor).removeAttr("prefixExp");
			           	$(that.cellOutEditor).removeAttr("postfixExp");	
			           	$(that.cellOutEditor).removeAttr("clickedExp");
					}
				});
				
				$(this.cellOutEditor).click(function(e){ 
					that.refreshEditingExpPosition(this);
				});
					
				$(this.cellOutEditor).keyup(function(e){
					var text = $(this).val();
					var editingCells = $("#" + that.containerId).find("td[editing='true']");
					if(editingCells.length > 0){
						var editingCell = editingCells[0];
						var editingCellEditorId = $(editingCell).attr("id") + "_editor";
						$("#" + editingCellEditorId).val(text);
					}
				});
				$(this.cellOutEditor).keydown(function(e){
					var keyCode = e.keyCode > 127 ? e.keyCode - 127 : e.keyCode;
					var editingCells = $("#" + that.containerId).find("td[editing='true']");
					if(editingCells.length > 0){
						var editingCell = editingCells[0];
						var rowId = $(editingCell).attr("rowId");
						var colId = $(editingCell).attr("colId");
						switch(keyCode){
							case 27:{
								//点击esc，取消编辑，值恢复到编辑前状态
								that.endCellEdit(false);
								that.cancelBubble(e);
								return false;
							}
							break;
							case 13:{
								if(e.altKey){
									//点击alt+enter，那么换行; 
									var cellId = colId + "_" + rowId; 
									var startPos = this.selectionStart;
						           	var endPos = this.selectionEnd;
						           	
						           	var text = $(this).val();
						            var prefix = text.substr(0, startPos);
						            var postfix = text.substr(endPos);
						            
						            $(this).val(prefix + "\r\n" + postfix);
						            
						           	var newPos = prefix.length + 1;
						           	if (this.setSelectionRange) {  
						           		this.setSelectionRange(newPos, newPos);
						            }   
						            else if (this.createTextRange) {//IE 
						                var range = this.createTextRange();  
						                range.collapse(true);  
						                range.moveStart('character', newPos);  
						                range.moveEnd('character', newPos);  
						                range.select();
						            } 
									that.cancelBubble(e);
								}
								else if(e.shiftKey){
									//如果shift+enter，那么接受编辑endEdit，定位到上一个单元格；
									that.endCellEdit(true); 
									that.selectUpCell(colId, rowId);
									that.cancelBubble(e);
								}
								else{
									//如果enter，那么接受编辑endEdit，然后定位到下一个单元格；
									that.endCellEdit(true); 
									that.selectDownCell(colId, rowId);
									that.cancelBubble(e);
								}
								return false;
							}
							break;
							case 9:{
								if(e.shiftKey){
									//如果shift+tab，那么接受编辑endEdit，定位到前一个单元格。
									that.endCellEdit(true); 
									that.selectLeftCell(colId, rowId);
									that.cancelBubble(e);
								}
								else{
									//如果tab，那么接受编辑endEdit，定位到后一个单元格；
									that.endCellEdit(true); 
									that.selectRightCell(colId, rowId);
									that.cancelBubble(e);
								}
								return false;
							}
							break;
						}
					}
					else{
						var currentCells = $("#" + that.containerId).find("td[isCurrentCell='true']");
						if(currentCells.length > 0){
							var currentCell = currentCells[0]; 
							var rowId = $(currentCell).attr("rowId");
							var colId = $(currentCell).attr("colId");
							if(keyCode == 8 ||keyCode == 13 || keyCode == 32 || keyCode == 46 || keyCode == 113 || (keyCode >=48 && keyCode <= 111)){ 			 							
								that.beginCellEdit(colId + "_" + rowId, false);
							}
						}
					}
				});
				
				$("#" + this.containerId).click(function(e){ 
					var tagName = $(e.target)[0].tagName;
					if(tagName == "DIV"){
						var isEditExp = that.checkIsEditExpression();
						
						var id = $(e.target).parent().parent().attr("id"); 						
						var result = that.selectCell(id, e.shiftKey, e.ctrlKey, isEditExp);
						if(isEditExp){
							//将本次选择得到的Cells信息放置到表达式中
							that.refreshEditingExpression(result);
						}
					}					
					return false;
				}); 
				
				$("#" + this.containerId).attr('tabindex', 1).keydown(function(e){
					if(that.currentCellId != null){
						var currentCells = $("#" + that.containerId + "_" + that.currentCellId);
						if(currentCells.length > 0){							
							var keyCode = e.keyCode > 127 ? e.keyCode - 127 : e.keyCode;
							var currentCell = currentCells[0];
							var rowId = $(currentCell).attr("rowId");
							var colId = $(currentCell).attr("colId");			
							if(keyCode == 32 || keyCode == 113 || (keyCode >=48 && keyCode <= 111)){
								//当前单元格不是编辑状态
								if($(currentCell).attr("editing") != "true"){									
									//没有其他的单元格处在编辑状态
									if($("#" + that.containerId).find("td[editing='true']").length == 0){									
										that.beginCellEdit(colId + "_" + rowId, true);
									}
								}
							}
							else {
								switch(keyCode){
									case 27:{
										//点击esc，取消编辑，值恢复到编辑前状态
										that.endCellEdit(false);
									}
									break;
									case 38:{
										that.selectUpCell(colId, rowId);
									}
									return false;
									case 40:{
										that.selectDownCell(colId, rowId);
									}
									return false;
									case 39:{
										that.selectRightCell(colId, rowId);
									}
									return false;
									case 37:{
										that.selectLeftCell(colId, rowId);
									}
									return false;
									case 13:{
										if(e.shiftKey){
											that.selectUpCell(colId, rowId);
										}
										else{
											that.selectDownCell(colId, rowId);
										}
										
									}
									return false;
									case 9:{
										if(e.shiftKey){
											that.selectLeftCell(colId, rowId);
										}
										else{
											that.selectRightCell(colId, rowId);
										}
									}
									return false;
								}
							}
						}
					}
				}); 
				
				$("#" + this.containerId).dblclick(function(e){
					var tagName = $(e.target)[0].tagName;
					if(tagName == "DIV"){
						var isEditExp = that.checkIsEditExpression();
						if(!isEditExp){
							var cellEmement = $(e.target).parent().parent();  
							var rowId = $(cellEmement).attr("rowId");
							var colId = $(cellEmement).attr("colId"); 
							that.beginCellEdit(colId + "_" + rowId, true);
						}
					}
					return false;
				});
				
				$("#" + this.containerId).bind("contextmenu", function(e){ 
					if(e.button == 2){
						var id = $(e.target).parent().parent().attr("id");  
						var cellType = $("#" + id).attr("cellType");
						if(cellType != null){
							var selected = that.checkSelected(id);
							if(!selected) {
								that.selectCell(id, e.shiftKey, e.ctrlKey, false)
							}
							var menuDivId = "";
							switch(cellType) {
								case "normalCell":
									menuDivId = "cellMenu";
									break;
								case "rowTitleCell":
									menuDivId = "rowMenu";
									break;
								case "colTitleCell":
									menuDivId = "colMenu";
									break;
							}
							currentGridLayoutObject = that;
							$("#" + menuDivId).menu('show', {
								left: e.clientX, 
								top: e.clientY 
							}); 
							return false; 
						}
					}
				});		
			}
			
			//计算各个区域的大小
			this.getAllAeraSize = function(){	
				//计算各个区域的高度宽度
				var frozenHeight = this.titleRowHeight + this.borderWidth;
				var frozenWidth = this.titleColumnWidth + this.borderWidth;
				var mainHeight = 0;
				var mainWidth = 0;

				var endColFrozen = false;
				for(var i = 0; i < this.eg.allColumns.length; i++){
					var col = this.eg.allColumns[i];
					if(!col.isFrozen){
						endColFrozen = true;
					}
					if(!endColFrozen){
						frozenWidth = frozenWidth + col.width + this.borderWidth;
					}
					else{
						mainWidth = mainWidth + col.width + this.borderWidth;
					}
				}
				
				var endRowFrozen = false;
				for(var i = 0; i < this.eg.allRows.length; i++){
					var row = this.eg.allRows[i];
					if(!row.isFrozen){
						endRowFrozen = true;
					}
					if(!endRowFrozen){
						frozenHeight = frozenHeight + row.height + this.borderWidth;
					}
					else{
						mainHeight = mainHeight + row.height + this.borderWidth;
					}
				}
				return {
					frozenHeight: frozenHeight,
					frozenWidth: frozenWidth,
					mainHeight: mainHeight,
					mainWidth: mainWidth
				};
			}
						
			//重新命名所有的行名
			this.refreshAllRowNames = function(){
				var allRowTitleCells = $("#" + this.containerId).find("td[cellType='rowTitleCell']");
				for(var i = 0; i < allRowTitleCells.length; i++) {
					var rowTitleCell = allRowTitleCells[i]; 
					$(rowTitleCell).find("div[name='gridCellInnerDiv']").text(i + 1);
				}
			}
						
			//重新命名所有的列名
			this.refreshAllColumnNames = function(){
				var allColTitleCells = $("#" + this.containerId).find("td[cellType='colTitleCell']");
				for(var i = 0; i < allColTitleCells.length; i++) {
					var colTitleCell = allColTitleCells[i];
					var colName = this.eg.getColumnNameByIndex(i);
					$(colTitleCell).find("div[name='gridCellInnerDiv']").text(colName);
				}
			}
						
			//重新设置宽度
			this.resizeGridLayout = function(){			
				//计算各个区域的高度宽度
				var areaSize = this.getAllAeraSize();
				var frozenHeight = areaSize.frozenHeight;
				var frozenWidth = areaSize.frozenWidth;
				var mainHeight = areaSize.mainHeight;
				var mainWidth = areaSize.mainWidth;

				//topDiv 高度
				$("#" + this.containerId).layout('panel', 'north').panel('resize', {height: frozenHeight});
				$("#" + this.containerId).layout('resize'); 

				//topLayoutDiv中leftTopFrozenDiv宽度
				var topLayoutDiv = $("#" + this.containerId).find("div[name='topLayoutDiv']")[0];
				$(topLayoutDiv).layout('panel', 'west').panel('resize', {width: frozenWidth});
				$(topLayoutDiv).layout('resize'); 
		
				//leftTopFrozenDiv 高度
				var leftTopFrozenDiv = $("#" + this.containerId).find("div[name='leftTopFrozenDiv']")[0];
				$(leftTopFrozenDiv).css({height: (frozenHeight + 1) + "px", width: frozenWidth + "px"});
				
				//leftTopFrozenTable宽度，高度
				var leftTopFrozenTable =  $("#" + this.containerId).find("table[name='leftTopFrozenTable']")[0];
				$(leftTopFrozenTable).css({height: frozenHeight + "px", width: frozenWidth + "px"});
				
				//topFrozenTableContainerDiv、topFrozenTable 高度 宽度
				var topFrozenTableContainerDiv = $("#" + this.containerId).find("div[name='topFrozenTableContainerDiv']")[0]; 
				$(topFrozenTableContainerDiv).css({height: frozenHeight + "px", width: (mainWidth + 20) + "px"});
				var topFrozenTable = $("#" + this.containerId).find("table[name='topFrozenTable']")[0];
				$(topFrozenTable).css({height: frozenHeight + "px", width: mainWidth + "px"});
 
				//bottomLayoutDiv中leftFrozenDiv宽度
				var bottomLayoutDiv = $("#" + this.containerId).find("div[name='bottomLayoutDiv']")[0];
				$(bottomLayoutDiv).layout('panel', 'west').panel('resize', {width: frozenWidth});
				$(bottomLayoutDiv).layout('resize'); 

				//leftFrozenTable 高度宽度
				var leftFrozenTable = $("#" + this.containerId).find("table[name='leftFrozenTable']")[0];
				$(leftFrozenTable).css({height: mainHeight + "px", width: frozenWidth + "px"});
				
				//mainTable 高度宽度
				var mainTable = $("#" + this.containerId).find("table[name='mainTable']")[0];
				$(mainTable).css({height: mainHeight + "px", width: mainWidth + "px"}); 
			}
			
			//显示布局
			this.layout = function(){
				
				this.resizeGridLayout();

				var mainTable = $("#" + this.containerId).find("table[name='mainTable']")[0];
				var leftFrozenTable = $("#" + this.containerId).find("table[name='leftFrozenTable']")[0];
				var topFrozenTable = $("#" + this.containerId).find("table[name='topFrozenTable']")[0];
				var leftTopFrozenTable =  $("#" + this.containerId).find("table[name='leftTopFrozenTable']")[0];
				$(leftTopFrozenTable).empty();
				$(topFrozenTable).empty();
				$(leftFrozenTable).empty();
				$(mainTable).empty();
				
				//构造单元格
				var endColFrozen = false;
				var leftTitleRowTrId = this.containerId + "_leftTitleRow";
				var rightTitleRowTrId = this.containerId + "_rightTitleRow";
				var tdId = this.containerId+ "_gridTitleId";
				$(leftTopFrozenTable).append("<tr id=\"" + leftTitleRowTrId + "\" style=\"height:" + this.titleRowHeight + "px;\"><td id=\"" + tdId + "\" cellType=\"gridTitleCell\" class=\"titleCell\" style=\"width:" +  this.titleColumnWidth  + "px;\"><div class=\"gridCellDiv\" style=\"width:" + this.titleColumnWidth + "px;height:" + this.titleRowHeight + "px;\"><div name=\"gridCellInnerDiv\" class=\"gridCellInnerDiv\"></div></div></td></tr>")
				$(topFrozenTable).append("<tr id=\"" + rightTitleRowTrId + "\" style=\"height:" +   this.titleRowHeight   + "px;\"></tr>")
				
				for(var i = 0; i < this.eg.allColumns.length; i++){
					var col = this.eg.allColumns[i]; 
					if(!col.isFrozen){
						endColFrozen = true;
					}
					var colName = this.eg.getColumnNameByIndex(i);
					var colHtml = this.getColumnCellHtml(col, colName);
					if(!endColFrozen){
						$("#" + leftTitleRowTrId).append(colHtml);
					}
					else{
						$("#" + rightTitleRowTrId).append(colHtml);
					} 			
				}
				
				var endRowFrozen = false;
				for(var i = 0; i < this.eg.allRows.length; i++){
					var row = this.eg.allRows[i]; 
					if(!row.isFrozen){
						endRowFrozen = true;
					} 
					var leftTrId = this.containerId + "_" + row.id + "_leftRow"; 
					var rightTrId = this.containerId + "_" + row.id + "_rightRow"; 
					var rowName = (i + 1);
					if(!endRowFrozen){
						var leftRowHtml = this.getLeftRowHtml(row, rowName);
						var rightRowHtml = this.getRightRowHtml(row, rowName);
						$(leftTopFrozenTable).append(leftRowHtml);
						$(topFrozenTable).append(rightRowHtml);
					}
					else{
						var leftRowHtml = this.getLeftRowHtml(row, rowName);
						var rightRowHtml = this.getRightRowHtml(row, rowName);
						$(leftFrozenTable).append(leftRowHtml);
						$(mainTable).append(rightRowHtml);
					}

					var leftTrInnerHtml = "";
					var rightTrInnerHtml = "";
					
					var endCellFrozen = false;
					for(var j = 0; j < this.eg.allColumns.length; j++){
						var col = this.eg.allColumns[j];
						var cell = this.eg.allCells[col.id + "_" + row.id];
						if(!col.isFrozen){
							endCellFrozen = true;
						}
						if(!cell.isHidden()){ 
							if(!endColFrozen){
								//$("#" + leftTrId).append("<td id=\"" + cell.id + "\" cellIndex=\"" + i + "," + j + "\" colspan=\"" + cell.colSpan + "\" rowspan=\"" + cell.rowSpan + "\" colId=\"" + col.id + "\" rowId=\"" + row.id + "\" class=\"normalCell\" cellType=\"normalCell\" style=\"width:" + (cellWidth + this.borderWidth) + "px;height:" + (cellHeight + this.borderWidth) + "px;\"><div style=\"width:" + cellWidth + "px;height:" + cellHeight + "px;\">&nbsp;</div></td>");
								leftTrInnerHtml += this.getNormalCellHtml(cell, j, i);
							}
							else{
								//$("#" + rightTrId).append("<td id=\"" + cell.id + "\" cellIndex=\"" + i + "," + j + "\" colspan=\"" + cell.colSpan + "\" rowspan=\"" + cell.rowSpan + "\" colId=\"" + col.id + "\" rowId=\"" + row.id + "\" class=\"normalCell\" cellType=\"normalCell\" style=\"width:" + (cellWidth + this.borderWidth) + "px;height:" + (cellHeight + this.borderWidth) + "px;\"><div style=\"width:" + cellWidth + "px;height:" + cellHeight + "px;\">&nbsp;</div></td>");
								rightTrInnerHtml += this.getNormalCellHtml(cell, j, i);
							}
						} 
					}
					
					$("#" + leftTrId).append(leftTrInnerHtml);					
					$("#" + rightTrId).append(rightTrInnerHtml); 
				}				
			}
			
			//获取单元格大小
			this.getCellSize = function(cell, colIndex, rowIndex){
				var cellWidth = 0;
				var cellHeight = 0;
				if(cell.isInGroup()){
					for(var k = colIndex; k < colIndex + cell.colSpan; k++){
						cellWidth = cellWidth + this.eg.allColumns[k].width + (k == colIndex ? 0 : this.borderWidth);
					}
					for(var k = rowIndex; k < rowIndex + cell.rowSpan; k++){
						cellHeight = cellHeight + this.eg.allRows[k].height + (k == rowIndex ? 0 : this.borderWidth);
					}
				}
				else{
					cellWidth = this.eg.allColumns[colIndex].width;
					cellHeight = this.eg.allRows[rowIndex].height;
				}
				return {width: cellWidth, height: cellHeight};
			}
			
			//列头单元格的html
			this.getColumnCellHtml = function(col, colName){
				var tdId = this.containerId + "_" + col.id + "_colTitleTd";
				var colHtml = "<td id=\"" + tdId + "\" colId=\"" + col.id + "\" cellType=\"colTitleCell\" class=\"titleCell\" style=\"width:" + col.width + "px;\"><div class=\"gridCellDiv\" style=\"width:" + col.width + "px;\"><div name=\"gridCellInnerDiv\" class=\"gridCellInnerDiv\">" + colName + "</div></div></td>"
				return colHtml;
			}
			
			//构造左侧冻结列对应的行的html
			this.getLeftRowHtml = function(row, rowName){
				var rowTitleTdId = row.id + "_rowTitleTd";
				var leftTrId = this.containerId + "_" + row.id + "_leftRow"; 
				var leftRowHtml = "<tr id=\"" + leftTrId + "\" rowId=\"" + row.id + "\" style=\"height:" +  row.height + "px;\"><td id=\"" + rowTitleTdId + "\" rowId=\"" + row.id + "\" cellType=\"rowTitleCell\"  class=\"titleCell\" style=\"width:" + this.titleColumnWidth + "px;\"><div class=\"gridCellDiv\" style=\"width:" + this.titleColumnWidth + "px;height:" +  row.height + "px;\"><div name=\"gridCellInnerDiv\" class=\"gridCellInnerDiv\">" + rowName + "</div></div></td></tr>";
				return leftRowHtml;
			}
			
			//构造右侧非冻结列对应的行的html
			this.getRightRowHtml = function(row, rowName){
				var rightTrId = this.containerId + "_" + row.id + "_rightRow"; 
				var rightRowHtml = "<tr id=\"" + rightTrId + "\" rowId=\"" + row.id + "\" style=\"height:" + row.height + "px;\"></tr>";
				return rightRowHtml;
			}
			
			//普通单元格的html
			this.getNormalCellHtml = function(cell, colIndex, rowIndex){
				var cellSize = this.getCellSize(cell, colIndex, rowIndex);
				var cellId = this.containerId + "_" + cell.id;
				var text = cell.getShowHtml();
				var cellHtml = "<td id=\"" + cellId + "\" cellIndex=\"" + colIndex + "," + rowIndex + "\" colspan=\"" + cell.colSpan + "\" rowspan=\"" + cell.rowSpan + "\" colId=\"" + cell.columnId + "\" rowId=\"" + cell.rowId + "\" class=\"normalCell\" cellType=\"normalCell\" style=\"width:" + cellSize.width + "px;height:" + cellSize.height + "px;\"><div class=\"gridCellDiv\" style=\"width:" + cellSize.width + "px;height:" + cellSize.height + "px;\"><div name=\"gridCellInnerDiv\" class=\"gridCellInnerDiv\">" + text + "</div></div></td>";
				return cellHtml;
			}
			
				
			//获取被选中的所有列Id，从界面列头单元格的属性中获取
			this.getSelectedColumnIds = function(){				
				var selectedColIds = new Array();
				var tds = $("#" + this.containerId).find("td[cellType='colTitleCell']");
				for(var i = 0; i < tds.length; i++){
					var td = tds[i];
					if($(td).hasClass("colSelectedCell")){
						var colId = $(td).attr("colId");
						selectedColIds.push(colId);
					}
				}
				return selectedColIds;
			}
				
			//被选中的所有行Id
			this.getSelectedRowIds = function(){	
				var selectedRowIds = new Array();
				var tds = $("#" + this.containerId).find("td[cellType='rowTitleCell']");
				for(var i = 0; i < tds.length; i++){
					var td = tds[i];
					if($(td).hasClass("rowSelectedCell")){
						var rowId = $(td).attr("rowId");
						selectedRowIds.push(rowId);
					}
				}
				return selectedRowIds;				
			}
			
			//获取选中的单元格
			this.getSelectedCellIds = function(){	
				var selectedIds = new Array();
				var tds = $("#" + this.containerId).find("td[cellType='normalCell']");
				for(var i = 0; i < tds.length; i++){
					var td = tds[i];
					if($(td).hasClass("selectedCell")){
						var rowId = $(td).attr("rowId");
						var colId = $(td).attr("colId");
						var cellId = colId + "_" + rowId;
						selectedIds.push(cellId);
					}
				}
				return selectedIds;
			}  
			
			//删除行
			this.deleteRows = function(){
				var allNewShowGroupCells= {};
				var allResizeGroupCells = {};
				var allDeleteCells = {};
				var rowIds = this.getSelectedRowIds();
				if(rowIds.length == this.eg.allRows.length){
					msgBox.alert({info: "不允许删除所有行."});
					return false;
				}
				for(var i = 0; i < rowIds.length; i++){
					var rowId = rowIds[i];
					var rowIndex = this.eg.getRowIndexById(rowId);
					var results = this.eg.deleteRow(rowIndex);
					
					//删除行
					$("#" + this.containerId + "_" + rowId + "_leftRow").remove();
					$("#" + this.containerId + "_" + rowId + "_rightRow").remove();
					
					for(var id in results.allNewShowGroupCells){
						if(allNewShowGroupCells[id] == null){
							allNewShowGroupCells[id] = results.allNewShowGroupCells[id];
						}
					}
					for(var id in results.allResizeGroupCells){
						if(allResizeGroupCells[id] == null){
							allResizeGroupCells[id] = results.allResizeGroupCells[id];
						}
					}
					for(var id in results.allDeleteCells){
						if(allDeleteCells[id] == null){
							allDeleteCells[id] = results.allDeleteCells[id];
						}
					}
				}
				for(var id in allDeleteCells){
					if(allNewShowGroupCells[id] != null){
						delete allNewShowGroupCells[id]; 
					}
					if(allResizeGroupCells[id] != null){
						delete allResizeGroupCells[id]; 
					}
				} 
				
				//处理展示 
				for(var id in allDeleteCells){
					if(allNewShowGroupCells[id] != null){
						delete allNewShowGroupCells[id]; 
					}
					if(allResizeGroupCells[id] != null){
						delete allResizeGroupCells[id]; 
					} 
				} 
				for(var id in allResizeGroupCells){
					var cellObj = allResizeGroupCells[id];
					var cellId = this.containerId + "_" + cellObj.id;
					var cell = $("#" + cellId);
					$(cell).attr("colspan", cellObj.colSpan);
					$(cell).attr("rowspan", cellObj.rowSpan);
					var colIndex = this.eg.getColumnIndexById(cellObj.columnId);
					var rowIndex = this.eg.getRowIndexById(cellObj.rowId);
					var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
					$("#" + cellId).css({width: cellSize.width , height: cellSize.height });
					$("#" + cellId).children("div").css({width: cellSize.width, height: cellSize.height});
					
				} 
				for(var id in allNewShowGroupCells){
					var cellObj = allNewShowGroupCells[id];
					this.showCellAfterPrevious(cellObj);
				}
				this.refreshAllRowNames();
				this.resizeGridLayout();		
				this.refreshOutEditorText();		
			}
			
			//删除列
			this.deleteColumns = function(){
				var allNewShowGroupCells= {};
				var allResizeGroupCells = {};
				var allDeleteCells = {};
				var colIds = this.getSelectedColumnIds();
				if(colIds.length == this.eg.allColumns.length){
					msgBox.alert({info: "不允许删除所有列."});
					return false;
				}
				for(var i = 0; i < colIds.length; i++){
					var colId = colIds[i];
					var colIndex = this.eg.getColumnIndexById(colId);
					var results = this.eg.deleteColumn(colIndex);
					
					//删除列头
					$("#" + this.containerId + "_" + colId + "_colTitleTd").remove();
					
					for(var id in results.allNewShowGroupCells){
						if(allNewShowGroupCells[id] == null){
							allNewShowGroupCells[id] = results.allNewShowGroupCells[id];
						}
					}
					for(var id in results.allResizeGroupCells){
						if(allResizeGroupCells[id] == null){
							allResizeGroupCells[id] = results.allResizeGroupCells[id];
						}
					}
					for(var id in results.allDeleteCells){
						if(allDeleteCells[id] == null){
							allDeleteCells[id] = results.allDeleteCells[id];
						}
					}
				}
				for(var id in allDeleteCells){
					if(allNewShowGroupCells[id] != null){
						delete allNewShowGroupCells[id]; 
					}
					if(allResizeGroupCells[id] != null){
						delete allResizeGroupCells[id]; 
					}
				} 
				
				//处理展示 
				for(var id in allDeleteCells){
					if(allNewShowGroupCells[id] != null){
						delete allNewShowGroupCells[id]; 
					}
					if(allResizeGroupCells[id] != null){
						delete allResizeGroupCells[id]; 
					}
					$("#" + this.containerId + "_" + id).remove();
				} 
				for(var id in allResizeGroupCells){
					var cellObj = allResizeGroupCells[id];
					var cellId = this.containerId + "_" + cellObj.id;
					var cell = $("#" + cellId);
					$(cell).attr("colspan", cellObj.colSpan);
					$(cell).attr("rowspan", cellObj.rowSpan);
					var colIndex = this.eg.getColumnIndexById(cellObj.columnId);
					var rowIndex = this.eg.getRowIndexById(cellObj.rowId);
					var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
					$("#" + cellId).css({width: cellSize.width, height: cellSize.height });
					$("#" + cellId).children("div").css({width: cellSize.width, height: cellSize.height});
					
				} 
				for(var id in allNewShowGroupCells){
					var cellObj = allNewShowGroupCells[id];
					this.showCellAfterPrevious(cellObj);
				}
				this.refreshAllColumnNames();
				this.resizeGridLayout();
				this.refreshOutEditorText();
			}

			this.showCellAfterPrevious = function(cellObj){			
				if(!cellObj.isHidden()) {
					var rowIndex = this.eg.getRowIndexById(cellObj.rowId);
					var colIndex = this.eg.getColumnIndexById(cellObj.columnId);
					var column = this.eg.getColumnByIndex(colIndex);
					var isFrozen = column.isFrozen;
					var previousColIndex = 0;
					var isFristCell = false;
					var preColIndex = colIndex;
					if(preColIndex == 0){
						isFristCell = true;
					}
					else {
						while(preColIndex > 0){
							preColIndex = preColIndex - 1;
							var previousCellObj = this.eg.getCellByIndex(preColIndex, rowIndex);
							if(!isFrozen){
								var column = this.eg.getColumnByIndex(preColIndex); 
								if(column.isFrozen){
									isFristCell = true;
									break;
								}
								else if(!previousCellObj.isHidden()){
									var previousCellElementId = this.containerId + "_" + previousCellObj.id;
									if($("#" + previousCellElementId).length > 0){
										break;
									}
								}
							}
							else if(!previousCellObj.isHidden()){
								break;
							}
							else if(preColIndex == 0){
								isFristCell = true;
								break;
							}
						} 
					}
					if(isFristCell){ 
						var trId = isFrozen ? (this.containerId + "_" + cellObj.rowId + "_leftRow") : (this.containerId + "_" + cellObj.rowId + "_rightRow");
						var cellHtml = this.getNormalCellHtml(cellObj, colIndex, rowIndex);
						$("#" + trId).prepend(cellHtml);
					}
					else{
						var previousCell = this.eg.getCellByIndex(preColIndex, rowIndex);
						var previousCellId = this.containerId + "_" + previousCell.id;
						var cellHtml = this.getNormalCellHtml(cellObj, colIndex, rowIndex);
						$("#" + previousCellId).after(cellHtml);
					}
				}
			}

			this.showRowAfterPrevious = function(row){	  
				var rowIndex = this.eg.getRowIndexById(row.id); 
				var isFrozen = row.isFrozen;
				var previousRowIndex = 0;
				var isFristRow = false;
				if(rowIndex > 0){ 
					var previousRow = this.eg.getRowByIndex(rowIndex - 1);
					if(!isFrozen){ 
						if(previousRow.isFrozen){
							isFristRow= true; 
						} 
					} 
				} 
				if(rowIndex == 0 || isFristRow){
					var leftTable =isFrozen ? $("#" + this.containerId).find("table[name='leftTopFrozenTable']")[0] : $("#" + this.containerId).find("table[name='leftFrozenTable']")[0];
					var rightTable = isFrozen ?  $("#" + this.containerId).find("table[name='topFrozenTable']")[0] : $("#" + this.containerId).find("table[name='mainTable']")[0];
					var leftRowHtml = this.getLeftRowHtml(row, "");
					var rightRowHtml = this.getRightRowHtml(row, "");
					$(leftTable).prepend(leftRowHtml);
					$(rightTable).prepend(rightRowHtml);
				}
				else{
					var previousRow = this.eg.getRowByIndex(rowIndex - 1);
					var leftRowHtml = this.getLeftRowHtml(row, "");
					var rightRowHtml = this.getRightRowHtml(row, "");
					var preLeftTrId = this.containerId + "_" + previousRow.id + "_leftRow"; 
					var preRightTrId = this.containerId + "_" + previousRow.id + "_rightRow";  
					$("#" + preLeftTrId).after(leftRowHtml);
					$("#" + preRightTrId).after(rightRowHtml);
				}
			}
			this.showColumnAfterPrevious = function(column){	  
				var colIndex = this.eg.getColumnIndexById(column.id); 
				var isFrozen = column.isFrozen;
				var previousColIndex = 0;
				var isFristColumn = false;
				if(colIndex > 0){ 
					var previousColumn = this.eg.getColumnByIndex(colIndex - 1);
					if(!isFrozen){ 
						if(previousColumn.isFrozen){
							isFristColumn = true; 
						} 
					} 
				} 
				if(colIndex == 0 || isFristColumn){  
					var trId = isFrozen ? (this.containerId + "_leftTitleRow") : (this.containerId + "_rightTitleRow");
					var colHtml = this.getColumnCellHtml(column, "");
					$("#" + trId).prepend(colHtml);
				}
				else{
					var previousColumn = this.eg.getColumnByIndex(colIndex - 1);
					var colHtml = this.getColumnCellHtml(column, "");
					var tdId = this.containerId + "_" + previousColumn.id + "_colTitleTd";
					$("#" + tdId).after(colHtml);
				}
			}
			
			this.addRow = function(isBefore){
				var rowIds = this.getSelectedRowIds();
				if(rowIds.length > 1){
					msgBox.alert({info: "请只选中一行."});
				}
				else{
					var rowId = rowIds[0]; 
					var rowIndex = this.eg.getRowIndexById(rowId);
					rowIndex = isBefore ? rowIndex : (rowIndex + 1);
					var result = this.eg.addRow(rowIndex);

					for(var id in result.allResizeGroupCells){
						var cellObj = result.allResizeGroupCells[id];
						var cellId = this.containerId + "_" + cellObj.id;
						var cell = $("#" + cellId);
						$(cell).attr("colspan", cellObj.colSpan);
						$(cell).attr("rowspan", cellObj.rowSpan);
						var colIndex = this.eg.getColumnIndexById(cellObj.columnId);
						var rowIndex = this.eg.getRowIndexById(cellObj.rowId);
						var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
						$("#" + cellId).css({width: cellSize.width, height: cellSize.height});
						$("#" + cellId).children("div").css({width: cellSize.width, height: cellSize.height});
					}
										 
					this.showRowAfterPrevious(result.row);
					
					for(var id in result.allNewCells){
						var cellObj = result.allNewCells[id];
						this.showCellAfterPrevious(cellObj); 
					}
					this.refreshAllRowNames();
					this.resizeGridLayout();
				}
			}
			
			this.addColumn = function(isBefore){
				var columnIds = this.getSelectedColumnIds();
				if(columnIds.length > 1){
					msgBox.alert({info: "请只选中一列."});
				}
				else{
					var colId = columnIds[0]; 
					var colIndex = this.eg.getColumnIndexById(colId);
					colIndex = isBefore ? colIndex : (colIndex + 1);
					var result = this.eg.addColumn(colIndex);

					for(var id in result.allResizeGroupCells){
						var cellObj = result.allResizeGroupCells[id];
						var cellId = this.containerId + "_" + cellObj.id;
						var cell = $("#" + cellId);
						$(cell).attr("colspan", cellObj.colSpan);
						$(cell).attr("rowspan", cellObj.rowSpan);
						var colIndex = this.eg.getColumnIndexById(cellObj.columnId);
						var rowIndex = this.eg.getRowIndexById(cellObj.rowId);
						var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
						$("#" + cellId).css({width: cellSize.width, height: cellSize.height});
						$("#" + cellId).children("div").css({width: cellSize.width, height: cellSize.height});
					}
					
					for(var id in result.allNewCells){
						var cellObj = result.allNewCells[id];
						this.showCellAfterPrevious(cellObj); 
					}
 
					this.showColumnAfterPrevious(result.column);
					this.refreshAllColumnNames();
					this.resizeGridLayout();
				}
			}

			//判断是否可以在此行前粘贴插入行(移动行)
			this.checkCanMoveToBeforeRow = function(rowIndex){
				var rowId = this.eg.getColumnIdByIndex(rowIndex);
				for(var cellId in this.eg.allCells){
					var cell = this.eg.allCells[cellId];
					if(cell.rowId == rowId){
						if(cell.isHidden()) {
							var groupCell = this.eg.allCells[cell.groupCellId];
							if(groupCell.rowId != cell.rowId){
								//此单元格已经被合并，且合并后的主单元格不此行
								msgBox.alert({info: "存在合并单元格，不能将列移动到此处"});
								return false;
							}
						}
					}
				}
				return true;
			}
			//判断是否可以在此列前粘贴插入列(移动列)
			this.checkCanMoveToBeforeColumn = function(colIndex){
				var colId = this.eg.getColumnIdByIndex(colIndex);
				for(var cellId in this.eg.allCells){
					var cell = this.eg.allCells[cellId];
					if(cell.columnId == colId){
						if(cell.isHidden()) {
							var groupCell = this.eg.allCells[cell.groupCellId];
							if(groupCell.columnId != cell.columnId){
								//此单元格已经被合并，且合并后的主单元格不此列
								msgBox.alert({info: "存在合并单元格，不能将列移动到此处"});
								return false;
							}
						}
					}
				}
				return true;
			}
			
			//判断这个区域内的所有单元格相关的合并单元格都在这个区域内
			this.checkAllGroupCellInRange = function(range){ 
				var left = range.left;
				var right = range.right;
				var top = range.top;
				var bottom = range.bottom;
				var allRangeCells = {};
				for(var i = left; i <= right; i++){
					var colId = this.eg.getColumnIdByIndex(i);
					for(var j = top; j <= bottom; j++){
						var rowId = this.eg.getRowIdByIndex(j);
						var cell = this.eg.allCells[colId + "_" + rowId];
						allRangeCells[cell.id] = {cell: cell, colIndex: i, rowIndex: j};
					}					
				}
				for(var cellId in allRangeCells){
					var cellJson = allRangeCells[cellId];
					var cell = cellJson.cell;
					if(cell.groupCellId != null) {
						if(cell.groupCellId == cell.id) {
							//合并了其他单元格，看看其他单元格实在范围内吗
							var colIndex = cellJson.colIndex;
							var rowIndex = cellJson.rowIndex;
							for(var x = colIndex; x < colIndex + cell.colSpan; x++){
								var gColId = this.eg.getColumnIdByIndex(x);
								for(var y = rowIndex; y < rowIndex + cell.rowSpan; y++){
									var gRowId = this.eg.getRowIdByIndex(y);
									var gCellId = gColId + "_" + gRowId;
									if(allRangeCells[gCellId] == null){
										msgBox.alert({info:"无法对合并单元格进行此操作。 合并的单元格已超出此区域"});
										return false;
									}
								}
							}
						}
						else {
							//被其他单元格合并，看看主单元格是否在范围内
							if(allRangeCells[cell.groupCellId] == null){
								msgBox.alert({info:"无法对合并单元格进行此操作。 合并的单元格已超出此区域"});
								return false;
							}
						}
					}					
				}
				return true;
			}
			
			//剪贴板数据，包含剪切板操作方式operateType（cutRow/cutColumn/copyRow/copyColumn/copyRange），data（json对象）、text（文本）
			this.clipBoardData = null;
			
			//获取区域内的文本，同行用tab隔开，换行用\n隔开
			this.getRangeText = function(range){ 
				var left = range.left;
				var right = range.right;
				var top = range.top;
				var bottom = range.bottom;
				var copyText = "";
				for(var i = top; i <= bottom; i++){
					var rowId = this.eg.getRowIdByIndex(i);
					if(i != top){
						copyText += "\n";
					}
					for(var j = left; j <= right; j++){
						var colId = this.eg.getColumnIdByIndex(j);
						var cell = this.eg.allCells[colId + "_" + rowId];
						var str = cell.isHidden() ? "" : cell.getShowText();
						if(j != left){
							copyText += "\t";
						}
						copyText += str;
					}			
				}
				return copyText;
			} 
			
			this.rowCut = function(event){
				var selectedColumnIds = this.getSelectedColumnIds();
				var selectedCellIds = this.getSelectedCellIds();
				var selectedRowIds = this.getSelectedRowIds();
				
				var allSelectedRowIndexs = {};
				var allSelectedRowIds = {};
				var maxRowIndex = -1;
				for(var i = 0; i < selectedRowIds.length; i++){
					var rowId = selectedRowIds[i];
					var rowIndex = this.eg.getRowIndexById(rowId);
					allSelectedRowIndexs[rowIndex] = rowId;
					allSelectedRowIds[rowId] = rowIndex;
					if(rowIndex > maxRowIndex){
						maxRowIndex = rowIndex;
					}
				}
				
				var needMinRowIndex = maxRowIndex - selectedRowIds.length + 1;
				for(var rowIndex in allSelectedRowIndexs){
					if(needMinRowIndex > rowIndex){
						msgBox.alert({info:"请选择相邻的行."});
						return false;
					}
				}				
				
				if(selectedColumnIds.length > 0){
					//剪切行时，不能选中列
					msgBox.alert({info:"正在进行行的剪切，请勿选中列."});
					return false;
				}
				if(selectedCellIds.length > 0){
					//判断这些单元格是否在被剪切的列中
					for(var i = 0; i < selectedCellIds.length; i++){
						var cellId = selectedCellIds[i];
						var cell = this.eg.allCells[cellId];
						if(allSelectedRowIds[cell.rowId] == null){
							msgBox.alert({info:"请勿选择被选中行以外的单元格."});
							return false;
						}
					}
				}
				
				var range = {top: needMinRowIndex, bottom: maxRowIndex, left: 0, right: this.eg.allColumns.length - 1};
				if(this.checkAllGroupCellInRange(range)) {
					var copyText = this.getRangeText(range);

					//放置到操作系统粘贴板
					$("#copyPasteInputId").val(copyText);
					$("#copyPasteInputId").focus();
					$("#copyPasteInputId").select();
					document.execCommand("copy");
					
					//放置到本页面的粘贴板
					this.clipBoardData = {
						operateType: "cutRow",
						data: selectedRowIds,
						text: copyText
					};					

					//如果剪切后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
				}
			}
			
			this.colCut = function(event){
				var selectedRowIds = this.getSelectedRowIds();
				var selectedCellIds = this.getSelectedCellIds();
				var selectedColumnIds = this.getSelectedColumnIds();
				
				var allSelectedColIndexs = {};
				var allSelectedColIds = {};
				var maxColIndex = -1;
				for(var i = 0; i < selectedColumnIds.length; i++){
					var colId = selectedColumnIds[i];
					var colIndex = this.eg.getColumnIndexById(colId);
					allSelectedColIndexs[colIndex] = colId;
					allSelectedColIds[colId] = colIndex;
					if(colIndex > maxColIndex){
						maxColIndex = colIndex;
					}
				}
				
				var needMinColIndex = maxColIndex - selectedColumnIds.length + 1;
				for(var colIndex in allSelectedColIndexs){
					if(needMinColIndex > colIndex){
						msgBox.alert({info:"请选择相邻的列."});
						return false;
					}
				}				
				
				if(selectedRowIds.length > 0){
					//剪切列时，不能选中行
					msgBox.alert({info:"正在进行列的剪切，请勿选中行."});
					return false;
				}
				if(selectedCellIds.length > 0){
					//判断这些单元格是否在被剪切的列中
					for(var i = 0; i < selectedCellIds.length; i++){
						var cellId = selectedCellIds[i];
						var cell = this.eg.allCells[cellId];
						if(allSelectedColIds[cell.columnId] == null){
							msgBox.alert({info:"请勿选择被选中列以外的单元格."});
							return false;
						}
					}
				}
				
				var range = {left: needMinColIndex, right: maxColIndex, top: 0, bottom: this.eg.allRows.length - 1};
				if(this.checkAllGroupCellInRange(range)) {
					var copyText = this.getRangeText(range);

					//放置到操作系统粘贴板
					$("#copyPasteInputId").val(copyText);
					$("#copyPasteInputId").focus();
					$("#copyPasteInputId").select();
					document.execCommand("copy");
					
					//放置到本页面的粘贴板
					this.clipBoardData = {
						operateType: "cutColumn",
						data: selectedColumnIds,
						text: copyText
					};					

					//如果剪切后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
				}
			}
			
			this.rowDelete = function(){
				this.deleteRows();
			}
			
			this.colDelete = function(){
				this.deleteColumns();
			}

			this.rowCopy = function(){
				var selectedColumnIds = this.getSelectedColumnIds();
				var selectedCellIds = this.getSelectedCellIds();
				var selectedRowIds = this.getSelectedRowIds();
				
				var allSelectedRowIndexs = {};
				var allSelectedRowIds = {};
				var maxRowIndex = -1;
				for(var i = 0; i < selectedRowIds.length; i++){
					var rowId = selectedRowIds[i];
					var rowIndex = this.eg.getRowIndexById(rowId);
					allSelectedRowIndexs[rowIndex] = rowId;
					allSelectedRowIds[rowId] = rowIndex;
					if(rowIndex > maxRowIndex){
						maxRowIndex = rowIndex;
					}
				}
				
				var needMinRowIndex = maxRowIndex - selectedRowIds.length + 1;
				for(var rowIndex in allSelectedRowIndexs){
					if(needMinRowIndex > rowIndex){
						msgBox.alert({info:"请选择相邻的列."});
						return false;
					}
				}				
				
				if(selectedColumnIds.length > 0){
					//复制行时，不能选中列
					msgBox.alert({info:"正在进行行的复制，请勿选中列."});
					return false;
				}
				if(selectedCellIds.length > 0){
					//判断这些单元格是否在被剪切的行中
					for(var i = 0; i < selectedCellIds.length; i++){
						var cellId = selectedCellIds[i];
						var cell = this.eg.allCells[cellId];
						if(allSelectedRowIds[cell.rowId] == null){
							msgBox.alert({info:"请勿选择被选中行以外的单元格."});
							return false;
						}
					}
				}
				
				var range = {top: needMinRowIndex, bottom: maxRowIndex, left: 0, right: this.eg.allColumns.length - 1};
				if(this.checkAllGroupCellInRange(range)) {
					var copyText = this.getRangeText(range);

					//放置到操作系统粘贴板
					$("#copyPasteInputId").val(copyText);
					$("#copyPasteInputId").focus();
					$("#copyPasteInputId").select();
					document.execCommand("copy");
					
					//放置到本页面的粘贴板
					this.clipBoardData = {
						operateType: "copyRow",
						data: selectedRowIds,
						text: copyText
					};					

					//如果复制后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
				}
			}

			this.colCopy = function(){
				var selectedRowIds = this.getSelectedRowIds();
				var selectedCellIds = this.getSelectedCellIds();
				var selectedColumnIds = this.getSelectedColumnIds();
				
				var allSelectedColIndexs = {};
				var allSelectedColIds = {};
				var maxColIndex = -1;
				for(var i = 0; i < selectedColumnIds.length; i++){
					var colId = selectedColumnIds[i];
					var colIndex = this.eg.getColumnIndexById(colId);
					allSelectedColIndexs[colIndex] = colId;
					allSelectedColIds[colId] = colIndex;
					if(colIndex > maxColIndex){
						maxColIndex = colIndex;
					}
				}
				
				var needMinColIndex = maxColIndex - selectedColumnIds.length + 1;
				for(var colIndex in allSelectedColIndexs){
					if(needMinColIndex > colIndex){
						msgBox.alert({info:"请选择相邻的列."});
						return false;
					}
				}				
				
				if(selectedRowIds.length > 0){
					//复制列时，不能选中行
					msgBox.alert({info:"正在进行列的复制，请勿选中行."});
					return false;
				}
				if(selectedCellIds.length > 0){
					//判断这些单元格是否在被剪切的列中
					for(var i = 0; i < selectedCellIds.length; i++){
						var cellId = selectedCellIds[i];
						var cell = this.eg.allCells[cellId];
						if(allSelectedColIds[cell.columnId] == null){
							msgBox.alert({info:"请勿选择被选中列以外的单元格."});
							return false;
						}
					}
				}
				
				var range = {left: needMinColIndex, right: maxColIndex, top: 0, bottom: this.eg.allRows.length - 1};
				if(this.checkAllGroupCellInRange(range)) {
					var copyText = this.getRangeText(range);

					//放置到操作系统粘贴板
					$("#copyPasteInputId").val(copyText);
					$("#copyPasteInputId").focus();
					$("#copyPasteInputId").select();
					document.execCommand("copy");
					
					//放置到本页面的粘贴板
					this.clipBoardData = {
						operateType: "copyColumn",
						data: selectedColumnIds,
						text: copyText
					};					

					//如果复制后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
				}
			}

			//判断是否可将数据粘贴到目标区域，需要判断源区域和目标区域的大小是否一致，合并单元格情况是否一致（允许目标没有合并单元格）
			this.checkCanPasteToSameRange = function(sourceRange, targetRange){
				if(sourceRange.right - sourceRange.left == targetRange.right - targetRange.left
					&&sourceRange.bottom - sourceRange.top == targetRange.bottom - targetRange.top){
					var colCount = sourceRange.right - sourceRange.left + 1;
					var rowCount = sourceRange.bottom - sourceRange.top + 1;
					for(var i = 0; i < colCount; i++){	
						var sourceColId = this.eg.getColumnIdByIndex(i + sourceRange.left);
						var targetColId = this.eg.getColumnIdByIndex(i + targetRange.left);
						for(var j = 0; j < rowCount; j++){
							var sourceRowId = this.eg.getRowIdByIndex(j + sourceRange.top);
							var targetRowId = this.eg.getRowIdByIndex(j + targetRange.top);
							
							var sourceCell = this.eg.allCells[sourceColId + "_" + sourceRowId];
							var targetCell = this.eg.allCells[targetColId + "_" + targetRowId];
							
							if(targetCell.isHidden()){
								if(!sourceCell.isHidden()){
									//目标区域不显示，但是源区域显示了，不允许
									msgBox.alert({info:"无法对合并单元格进行此操作"});
									return false;									
								}
							}
							if(sourceCell.rowSpan > 1 || sourceCell.colSpan >1){
								//源区域为合并单元格的主单元格，需要验证目标区域的单元格的colSpan和rowSpan是否和源相同，如果相同才能继续粘贴。
							  	//如果不相同，那么判断目标区域的colSpan和rowSpan是否都为1，如果是，真正实现粘贴数据的说，要执行合并单元格操作
							  	if(targetCell.rowSpan > 1 || targetCell.colSpan > 1){
							  		if(sourceCell.rowSpan != targetCell.rowSpan || sourceCell.colSpan != targetCell.colSpan){
										msgBox.alert({info:"无法对合并单元格进行此操作"});
										return false;				
							  		}
							  	}
							}				
						}						
					}
					return true;
				}
				else{
					msgBox.alert({info: "目标区域大小和源不一致。"});
				}
			}


			//粘贴到目标区域
			this.pasteRangeFromRange = function(sourceRange, targetRange){ 
				var colCount = sourceRange.right - sourceRange.left + 1;
				var rowCount = sourceRange.bottom - sourceRange.top + 1;
				var sourceToTargetCellIds = {};
				for(var i = 0; i < colCount; i++){	
					var sourceColId = this.eg.getColumnIdByIndex(i + sourceRange.left);
					var targetColId = this.eg.getColumnIdByIndex(i + targetRange.left);
					for(var j = 0; j < rowCount; j++){
						var sourceRowId = this.eg.getRowIdByIndex(j + sourceRange.top);
						var targetRowId = this.eg.getRowIdByIndex(j + targetRange.top);
						var sourceCellId = sourceColId + "_" + sourceRowId;
						var targetCellId = targetColId + "_" + targetRowId;
						sourceToTargetCellIds[sourceCellId] = targetCellId;
						var sourceCell = this.eg.allCells[sourceCellId];
						var targetCell = this.eg.allCells[targetCellId];
						sourceCell.copyTo(targetCell);
						targetCell.groupCellId = sourceToTargetCellIds[sourceCell.groupCellId];						
					}						
				} 

				for(var i = 0; i < colCount; i++){
					var colIndex = i + targetRange.left;
					var targetColId = this.eg.getColumnIdByIndex(colIndex);
					for(var j = 0; j < rowCount; j++){
						var rowIndex = j + targetRange.top;
						var targetRowId = this.eg.getRowIdByIndex(rowIndex);
						var targetCellId = targetColId + "_" + targetRowId;
						this.refreshCellDisplay(targetCellId, colIndex, rowIndex);
					}						
				} 
			}
			
			this.refreshCellDisplay = function(cellId, colIndex, rowIndex){
				var targetCell = this.eg.allCells[cellId];
				if(targetCell.isHidden()){
					$("#" + this.containerId + "_" + cellId).remove();
				}
				else{
					var cellElement = $("#" + this.containerId + "_" + cellId);
					if(cellElement.length == 0){
						this.showCellAfterPrevious(targetCell);
					}
					else {
						var cellSize = this.getCellSize(targetCell, colIndex, rowIndex);
						$(cellElement).attr("rowspan", targetCell.rowSpan);
						$(cellElement).attr("colspan", targetCell.colSpan);
						$(cellElement).css({
							width: cellSize.width + "px", 
							height: cellSize.height + "px"});
						$(cellElement).children("div").css({
							width: cellSize.width + "px", 
							height: cellSize.height + "px"});
						var html = targetCell.getShowHtml();
						$(cellElement).find("div[name='gridCellInnerDiv']").html(html);
					}
				}
			}
			
			this.refreshCellShowValue = function(cellId){
				var targetCell = this.eg.allCells[cellId]; 
				var cellElement = $("#" + this.containerId + "_" + cellId); 
				var html = targetCell.getShowHtml();
				$(cellElement).children("div").children("div").html(html); 
			}
			
			this.refreshCellSize = function(cellId){
				var cell = this.eg.allCells[cellId];
				if(cell.isHidden()){
					this.refreshCellSize(cell.groupCellId);
				}
				else {
					var colIndex = this.eg.getColumnIndexById(cell.columnId);
					var rowIndex = this.eg.getRowIndexById(cell.rowId);
					var cellSize = this.getCellSize(cell, colIndex, rowIndex); 
					var cellElement = $("#" + this.containerId + "_" + cellId);
					$(cellElement).css({
						width: cellSize.width + "px", 
						height: cellSize.height + "px"});
					$(cellElement).children("div").css({
						width: cellSize.width + "px", 
						height: cellSize.height + "px"}); 
				}
			}

			this.rowPaste = function(){
				$("#copyPasteInputId").focus();
				$("#copyPasteInputId").select();
				document.execCommand("paste");
				var pasteText = $("#copyPasteInputId").val();
				if(pasteText == this.clipBoardData.text){
					//操作系统粘贴板和页面中的粘贴板数据一样，那么按照页面的来
					if(this.clipBoardData.operateType == "cutRow"){
						var targetRowIds = this.getSelectedRowIds();
	
						var minRowIndex = 10000;
						for(var i = 0; i < targetRowIds.length; i++){
							var rowId = targetRowIds[i];
							var rowIndex = this.eg.getRowIndexById(rowId); 
							if(rowIndex < minRowIndex){
								minRowIndex = rowIndex;
							}
						}
	
						var selectedRowIds = this.clipBoardData.data;
						if(this.checkCanMoveToBeforeRow(minRowIndex)){
							
							this.eg.moveRows(selectedRowIds, minRowIndex);

							for(var i = 0; i < selectedRowIds.length; i++){
								var rowId = selectedRowIds[i];
								var leftTrId = this.containerId + "_" + rowId + "_leftRow"; 
								var rightTrId = this.containerId + "_" + rowId + "_rightRow"; 
								$("#" + leftTrId).remove();
								$("#" + rightTrId).remove();	
							}					
							
							for(var i = 0; i < selectedRowIds.length; i++){
								var rowId = selectedRowIds[i];
								var row = this.eg.getRowById(rowId);
								
								this.showRowAfterPrevious(row);	
								
								for(var j = 0; j < this.eg.allColumns.length; j++){
									var colId = this.eg.getColumnIdByIndex(j);
									var cell = this.eg.allCells[colId + "_" + rowId];
									this.showCellAfterPrevious(cell); 
								} 
							}
							this.refreshAllRowNames();
						}
					}
					else if(this.clipBoardData.operateType == "copyRow"){
							var targetRowIds = this.getSelectedRowIds();
							var selectedRowIds = this.clipBoardData.data;
							

							var minTargetRowIndex = 10000;
							for(var i = 0; i < targetRowIds.length; i++){
								var rowId = targetRowIds[i];
								var rowIndex = this.eg.getRowIndexById(rowId); 
								if(rowIndex < minTargetRowIndex){
									minTargetRowIndex = rowIndex;
								}
							}
							var minSourceRowIndex = 10000;
							for(var i = 0; i < selectedRowIds.length; i++){
								var rowId = selectedRowIds[i];
								var rowIndex = this.eg.getRowIndexById(rowId); 
								if(rowIndex < minSourceRowIndex){
									minSourceRowIndex = rowIndex;
								}
							}
							if(minTargetRowIndex + selectedRowIds.length > this.eg.allRows.length){
								msgBox.alert({info:"请选中" + selectedRowIds.length + "行目标区域."});
							}
							else {
								var targetRange = {top: minTargetRowIndex, bottom: minTargetRowIndex + selectedRowIds.length - 1, left: 0, right: this.eg.allColumns.length - 1};
								if(this.checkAllGroupCellInRange(targetRange)){

									var sourceRange = {
											top: minSourceRowIndex, 
											bottom: minSourceRowIndex + selectedRowIds.length - 1,
											left: 0,
											right: this.eg.allRows.length - 1
										}; 
									if(this.checkCanPasteToSameRange(sourceRange, targetRange)){
										this.pasteRangeFromRange(sourceRange, targetRange)
									}
								}
							} 
						}
					else{
						msgBox.alert({info: "无法粘贴，因为复制区域和粘贴区域的大小不一致."});
					}
				}
				else{
					//从文本中粘贴（尚未实现）
				}
			}

			this.colPaste = function(){
				$("#copyPasteInputId").focus();
				$("#copyPasteInputId").select();
				document.execCommand("paste");
				var pasteText = $("#copyPasteInputId").val();
				if(pasteText == this.clipBoardData.text){
					//操作系统粘贴板和页面中的粘贴板数据一样，那么按照页面的来
					if(this.clipBoardData.operateType == "cutColumn"){
						var targetColumnIds = this.getSelectedColumnIds();
	
						var minColIndex = 10000;
						for(var i = 0; i < targetColumnIds.length; i++){
							var colId = targetColumnIds[i];
							var colIndex = this.eg.getColumnIndexById(colId); 
							if(colIndex < minColIndex){
								minColIndex = colIndex;
							}
						}
	
						var selectedColumnIds = this.clipBoardData.data;
						if(this.checkCanMoveToBeforeColumn(minColIndex)){
							
							this.eg.moveColumns(selectedColumnIds, minColIndex);
							
							for(var i = 0; i < selectedColumnIds.length; i++){
								var colId = selectedColumnIds[i];
								$("#" + this.containerId).find("td[colId='" + colId + "']").remove();
							}
							
							
							for(var i = 0; i < selectedColumnIds.length; i++){
								var colId = selectedColumnIds[i];
								var col = this.eg.getColumnById(colId);
								
								this.showColumnAfterPrevious(col);	
								
								for(var j = 0; j < this.eg.allRows.length; j++){
									var rowId = this.eg.getRowIdByIndex(j);
									var cell = this.eg.allCells[colId + "_" + rowId];
									this.showCellAfterPrevious(cell); 
								} 
							}
							this.refreshAllColumnNames();
						}
					}
					else if(this.clipBoardData.operateType == "copyColumn"){
						var targetColumnIds = this.getSelectedColumnIds();
						var selectedColumnIds = this.clipBoardData.data;
						

						var minTargetColIndex = 10000;
						for(var i = 0; i < targetColumnIds.length; i++){
							var colId = targetColumnIds[i];
							var colIndex = this.eg.getColumnIndexById(colId); 
							if(colIndex < minTargetColIndex){
								minTargetColIndex = colIndex;
							}
						}
						var minSourceColIndex = 10000;
						for(var i = 0; i < selectedColumnIds.length; i++){
							var colId = selectedColumnIds[i];
							var colIndex = this.eg.getColumnIndexById(colId); 
							if(colIndex < minSourceColIndex){
								minSourceColIndex = colIndex;
							}
						}
						if(minTargetColIndex + selectedColumnIds.length > this.eg.allColumns.length){
							msgBox.alert({info:"请选中" + selectedColumnIds.length + "列目标区域."});
						}
						else {
							var targetRange = {left: minTargetColIndex, right: minTargetColIndex + selectedColumnIds.length - 1, top: 0, bottom: this.eg.allRows.length - 1};
							if(this.checkAllGroupCellInRange(targetRange)){

								var sourceRange = {
										left: minSourceColIndex, 
										right: minSourceColIndex + selectedColumnIds.length - 1,
										top: 0,
										bottom: this.eg.allRows.length - 1
									}; 
								if(this.checkCanPasteToSameRange(sourceRange, targetRange)){
									this.pasteRangeFromRange(sourceRange, targetRange)
								}
							}
						} 
					}
					else{
						msgBox.alert({info: "无法粘贴，因为复制区域和粘贴区域的大小不一致."});
					}
				}
				else{
					//从文本中粘贴（尚未实现）
				}
			}

			this.rowInsertBefore = function(event){
				this.addRow(true);
			}

			this.colInsertBefore = function(event){
				this.addColumn(true);
			}

			this.rowInsertAfter = function(event){
				this.addRow(false);
			}

			this.colInsertAfter = function(event){
				this.addColumn(false);
			}
			
			this.clearContentByCellIds = function(cellIds){
				for(var i = 0; i < cellIds.length; i++){
					var cellId = cellIds[i];
					var cell = this.eg.allCells[cellId];
					cell.value = null;
					var cellElement = $("#" + this.containerId + "_" + cellId);
					$(cellElement).find("div[name='gridCellInnerDiv']").empty();
				}
				this.refreshOutEditorText();	
			}

			this.rowClearContent = function(event){
				var allClearCellIds = new Array();
				var rowIds = this.getSelectedRowIds();
				for(var i = 0; i < rowIds.length; i++){
					var rowId = rowIds[i];  
					for(var j = 0; j < this.eg.allColumns.length; j++){
						var colId = this.eg.getColumnIdByIndex(j);  
						var cellId = colId + "_" + rowId;
						allClearCellIds.push(cellId);
					}
				}
				this.clearContentByCellIds(allClearCellIds);
			}

			this.colClearContent = function(event){
				var allClearCellIds = new Array();
				var colIds = this.getSelectedColumnIds();
				for(var i = 0; i < colIds.length; i++){
					var colId = colIds[i];  
					for(var j = 0; j < this.eg.allRows.length; j++){
						var rowId = this.eg.getRowIdByIndex(j);  
						var cellId = colId + "_" + rowId;
						allClearCellIds.push(cellId);
					}
				}
				this.clearContentByCellIds(allClearCellIds);
			}
			
			this.showEditSizeDialog = function(p){
				//p.title
				//p.label
				//p.value
				//p.okFunction
				var popContainer = new PopupContainer( {
					width : 200,
					height : 130,
					top : 100
				});
				
				popContainer.show();
		  
				var frameId = cmnPcr.getRandomValue();
				var titleId = frameId + "_title";
				var labelId = frameId + "_label";
				var valueId = frameId + "_value";
				var buttonContainerId = frameId + "_buttonContainer";
				var okBtnId = frameId + "_ok";
				var cancelBtnId = frameId + "_cancel";
				var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
				 	+ "<div id=\"" + labelId + "\" style=\"witdh:100%;height:30px;font-size:11px;\"></div>"
				 	+ "<div style=\"witdh:100%;height:30px;font-size:11px;text-align:center;\"><input id=\"" + valueId + "\" type=\"text\" style=\"width:100%;height:20px;\" /></div>"
				 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:center;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:20px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:20px;\" /></div>";
				$("#" + popContainer.containerId).html(innerHtml);
				$("#" + titleId).text(p.title);
				$("#" + labelId).text(p.label);
				$("#" + valueId).val(p.value);
				
				$("#" + valueId).decimalDispunit({  
					options : {},
					style : {}
				});
				
				$("#" + valueId).decimalDispunit("setValue", p.value);
				
				$("#" + okBtnId).click(function(){
					var value = $("#" + valueId).decimalDispunit("getValue");
					if(value < 0 || value > 2000){
						msgBox.alert({info: "请录入1到2000之间的数值."});
					}
					else {
						var succeed = p.okFunction({
							value : value,
							closeWin : function(){
								popContainer.close();
							}
						}); 	
					}
				});
				$("#" + cancelBtnId).click(function(){
					var value = $("#" + valueId).val();
					var succeed = p.cancelFunction == null || p.cancelFunction({value : value});
					if(succeed){
						popContainer.close();
					}					
				});
			}

			this.rowSetHeight = function(event){
				var height = null;
				var rowIds = this.getSelectedRowIds();
				for(var i = 0; i < rowIds.length; i++){
					var rowId = rowIds[i];
					var row = this.eg.getRowById(rowId);
					if(height == null){
						height = row.height;
					}
					else{
						if(height != row.height){
							height = null;
							break;
						}
					}
				}
				
				this.showEditSizeDialog({
					title: "设置行高",
					label: "请输入行高值",
					value: height, 
					okFunction: function(p){
						p.closeWin();
						var rowIds = that.getSelectedRowIds();
						that.resizeRows(rowIds, p.value);
					}
				});
			}

			this.colSetWidth = function(event){
				var width = null;
				var colIds = this.getSelectedColumnIds();
				for(var i = 0; i < colIds.length; i++){
					var colId = colIds[i];
					var col = this.eg.getColumnById(colId);
					if(width == null){
						width = col.width;
					}
					else{
						if(width != col.width){
							width = null;
							break;
						}
					}
				}
				
				this.showEditSizeDialog({
					title: "设置列宽",
					label: "请输入列宽值",
					value: width, 
					okFunction: function(p){
						p.closeWin();
						var colIds = that.getSelectedColumnIds();
						that.resizeColumns(colIds, p.value);
					}
				});
			}
			
			this.resizeRows = function(rowIds, height){
				for(var i = 0; i < rowIds.length; i++){
					var rowId = rowIds[i];
					var row = this.eg.getRowById(rowId);
					row.height = height;

					var leftTrId = this.containerId + "_" + row.id + "_leftRow"; 
					var rightTrId = this.containerId + "_" + row.id + "_rightRow"; 
					$("#" + leftTrId).css({height: row.height});
					$("#" + leftTrId).children("td[cellType='rowTitleCell']").children("div").css({height: row.height});
					$("#" + rightTrId).css({height: row.height});

					for(var j = 0; j < this.eg.allColumns.length; j++){ 
						var colId = this.eg.getColumnIdByIndex(j);
						var cellId = colId + "_" + rowId;
						this.refreshCellSize(cellId);
					}
				}

				this.resizeGridLayout();
			}
			
			this.resizeColumns = function(colIds, width){
				for(var i = 0; i < colIds.length; i++){
					var colId = colIds[i];
					var col = this.eg.getColumnById(colId);
					col.width = width;
 
					var colTdId = this.containerId + "_" + col.id + "_colTitleTd";
					$("#" + colTdId).css({width: col.width});
					$("#" + colTdId).children("div").css({width: col.width});

					for(var j = 0; j < this.eg.allRows.length; j++){ 
						var rowId = this.eg.getRowIdByIndex(j);
						var cellId = colId + "_" + rowId;
						this.refreshCellSize(cellId);
					}					
				}				

				this.resizeGridLayout();
			}

			this.cellCopy = function(event){ 
				var selectedCellIds = this.getSelectedCellIds(); 
				
				var allSelectedCellIds = {};
				var maxRowIndex = -1;
				var maxColIndex = -1;
				var minRowIndex = 10000;
				var minColIndex = 10000;
				for(var i = 0; i < selectedCellIds.length; i++){
					var cellId = selectedCellIds[i];
					allSelectedCellIds[cellId] = cellId;
					var cell = this.eg.allCells[cellId];
					var rowIndex = this.eg.getRowIndexById(cell.rowId);
					var colIndex = this.eg.getColumnIndexById(cell.columnId);
					if(rowIndex > maxRowIndex){
						maxRowIndex = rowIndex;
					}
					if(rowIndex < minRowIndex){
						minRowIndex = rowIndex;
					}
					if(colIndex > maxColIndex){
						maxColIndex = colIndex;
					}
					if(colIndex < minColIndex){
						minColIndex = colIndex;
					}
					if(cell.groupCellId != null && cell.groupCellId == cellId){
						var rowIndex = rowIndex + cell.rowSpan -1;
						var colIndex = colIndex + cell.colSpan -1;

						if(rowIndex > maxRowIndex){
							maxRowIndex = rowIndex;
						}
						if(colIndex > maxColIndex){
							maxColIndex = colIndex;
						}
					}
				}
				for(var i = minRowIndex; i <= maxRowIndex; i++){
					var rowId = this.eg.getRowIdByIndex(i);
					for(var j = minColIndex; j <= maxColIndex; j++){
						var colId = this.eg.getColumnIdByIndex(j);
						var cellId = colId + "_" + rowId;
						var cell = this.eg.allCells[cellId];
						if(!cell.isHidden()){
							if(allSelectedCellIds[cellId] == null){
								msgBox.alert({info:"不能复制多重区域."});
								return false;
							}
						}
					}
				}
				
				var range = {top: minRowIndex, bottom: maxRowIndex, left: minColIndex, right: maxColIndex};
				if(this.checkAllGroupCellInRange(range)) {
					var copyText = this.getRangeText(range);

					//放置到操作系统粘贴板
					$("#copyPasteInputId").val(copyText);
					$("#copyPasteInputId").focus();
					$("#copyPasteInputId").select();
					document.execCommand("copy");
					
					//放置到本页面的粘贴板
					this.clipBoardData = {
						operateType: "copyCell",
						data: selectedCellIds,
						text: copyText
					};					

					//如果复制后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
				}
			}

			this.cellPaste = function(event){
				$("#copyPasteInputId").focus();
				$("#copyPasteInputId").select();
				document.execCommand("paste");
				var pasteText = $("#copyPasteInputId").val();
				if(pasteText == this.clipBoardData.text){
					if(this.clipBoardData.operateType == "copyCell"){
						var targetCellIds = this.getSelectedCellIds();
						var selectedCellIds = this.clipBoardData.data;

						var minTargetRowIndex = 10000;
						var minTargetColIndex = 10000;
						for(var i = 0; i < targetCellIds.length; i++){
							var cellId = targetCellIds[i]; 
							var cell = this.eg.allCells[cellId];
							var rowIndex = this.eg.getRowIndexById(cell.rowId);
							var colIndex = this.eg.getColumnIndexById(cell.columnId); 
							if(rowIndex < minTargetRowIndex){
								minTargetRowIndex = rowIndex;
							} 
							if(colIndex < minTargetColIndex){
								minTargetColIndex = colIndex;
							}
						}
						
						var maxSourceRowIndex = -1;
						var maxSourceColIndex = -1;
						var minSourceRowIndex = 10000;
						var minSourceColIndex = 10000;
						for(var i = 0; i < selectedCellIds.length; i++){
							var cellId = selectedCellIds[i]; 
							var cell = this.eg.allCells[cellId];
							var rowIndex = this.eg.getRowIndexById(cell.rowId);
							var colIndex = this.eg.getColumnIndexById(cell.columnId);
							if(rowIndex > maxSourceRowIndex){
								maxSourceRowIndex = rowIndex;
							}
							if(rowIndex < minSourceRowIndex){
								minSourceRowIndex = rowIndex;
							}
							if(colIndex > maxSourceColIndex){
								maxSourceColIndex = colIndex;
							}
							if(colIndex < minSourceColIndex){
								minSourceColIndex = colIndex;
							}
							if(cell.groupCellId != null && cell.groupCellId == cellId){
								var rowIndex = rowIndex + cell.rowSpan -1;
								var colIndex = colIndex + cell.colSpan -1;

								if(rowIndex > maxSourceRowIndex){
									maxSourceRowIndex = rowIndex;
								}
								if(colIndex > maxSourceColIndex){
									maxSourceColIndex = colIndex;
								}
							}
						}

						var sourceRowCount =  maxSourceRowIndex - minSourceRowIndex + 1;
						var sourceColCount =  maxSourceColIndex - minSourceColIndex + 1;

						if(minTargetColIndex + sourceColCount > this.eg.allColumns.length){
							msgBox.alert({info:"目标区域列数不足"}); 
						}
						else if(minTargetRowIndex + sourceRowCount > this.eg.allRows.length){
							msgBox.alert({info:"目标区域行数不足"}); 
						}
						else {
							var targetRange = {left: minTargetColIndex, right: minTargetColIndex + sourceColCount - 1, top: minTargetRowIndex, bottom: minTargetRowIndex + sourceRowCount - 1};
							if(this.checkAllGroupCellInRange(targetRange)){

								var sourceRange = {
										left: minSourceColIndex, 
										right: maxSourceColIndex,
										top: minSourceRowIndex,
										bottom: maxSourceRowIndex
									}; 
								if(this.checkCanPasteToSameRange(sourceRange, targetRange)){
									this.pasteRangeFromRange(sourceRange, targetRange)
								}
							}
						} 
					}
					else{
						msgBox.alert({info: "无法粘贴，因为复制区域和粘贴区域的大小不一致."});
					}
				}
				else{
					//从文本中粘贴（尚未实现）
				}
			}

			this.cellClearContent = function(event){
				var allClearCellIds = this.getSelectedCellIds(); 
				this.clearContentByCellIds(allClearCellIds);
			}
			
			//合并单元格
			this.cellMerge = function(event){
				var selectedCellIds = this.getSelectedCellIds(); 
				
				var allSelectedCellIds = {};
				var maxRowIndex = -1;
				var maxColIndex = -1;
				var minRowIndex = 10000;
				var minColIndex = 10000;
				for(var i = 0; i < selectedCellIds.length; i++){
					var cellId = selectedCellIds[i];
					allSelectedCellIds[cellId] = cellId;
					var cell = this.eg.allCells[cellId];
					var rowIndex = this.eg.getRowIndexById(cell.rowId);
					var colIndex = this.eg.getColumnIndexById(cell.columnId);
					if(rowIndex > maxRowIndex){
						maxRowIndex = rowIndex;
					}
					if(rowIndex < minRowIndex){
						minRowIndex = rowIndex;
					}
					if(colIndex > maxColIndex){
						maxColIndex = colIndex;
					}
					if(colIndex < minColIndex){
						minColIndex = colIndex;
					}
					if(cell.groupCellId != null && cell.groupCellId == cellId){
						var rowIndex = rowIndex + cell.rowSpan -1;
						var colIndex = colIndex + cell.colSpan -1;

						if(rowIndex > maxRowIndex){
							maxRowIndex = rowIndex;
						}
						if(colIndex > maxColIndex){
							maxColIndex = colIndex;
						}
					}
				}
				for(var i = minRowIndex; i <= maxRowIndex; i++){
					var rowId = this.eg.getRowIdByIndex(i);
					for(var j = minColIndex; j <= maxColIndex; j++){
						var colId = this.eg.getColumnIdByIndex(j);
						var cellId = colId + "_" + rowId;
						var cell = this.eg.allCells[cellId];
						if(!cell.isHidden()){
							if(allSelectedCellIds[cellId] == null){
								msgBox.alert({info:"不能合并多重区域."});
								return false;
							}
						}
					}
				}
				
				var range = {top: minRowIndex, bottom: maxRowIndex, left: minColIndex, right: maxColIndex};
				if(this.checkAllGroupCellInRange(range)) {
					
					this.eg.mergeCells(range);

					for(var i = minRowIndex; i <= maxRowIndex; i++){ 
						var rowId = this.eg.getRowIdByIndex(i);
						for(var j = minColIndex; j <= maxColIndex; j++){ 
							var colId = this.eg.getColumnIdByIndex(j);
							var cellId = colId + "_" + rowId;
							this.refreshCellDisplay(cellId, j, i);
						}						
					} 
				}
			}
			
			//取消合并单元格
			this.cellUnmerge = function(event){
				var selectedCellIds = this.getSelectedCellIds(); 
				for(var i = 0; i < selectedCellIds.length; i++){
					var cellId = selectedCellIds[i];
					var needRefreshCells = this.eg.unmergeCells(cellId);
					if(needRefreshCells != null){ 
						for(var j = 0; j < needRefreshCells.length; j++){ 
							var refreshCell = needRefreshCells[j]; 
							var colIndex = this.eg.getColumnIndexById(refreshCell.columnId);
							var rowIndex = this.eg.getRowIndexById(refreshCell.rowId); 
							this.refreshCellDisplay(refreshCell.id, colIndex, rowIndex);
							var cellElementId = this.containerId + "_" + refreshCell.id;
							$("#" + cellElementId).addClass("selectedCell");
						}
					}
				} 
			}
			
			//选定下一个单元格
			this.selectUpCell = function(colId, rowId){
				var rowIndex = that.eg.getRowIndexById(rowId);
				while(rowIndex > 0){
					var upRowId = that.eg.getRowIdByIndex(rowIndex - 1);
					var cellId = colId + "_" + upRowId;
					var cell = this.eg.allCells[cellId];
					if(!cell.isHidden()){
						var upCellElementId = that.containerId + "_" + cellId;
						that.selectCell(upCellElementId, false, false, false);
						break;
					}
					else{
						rowIndex = rowIndex - 1;
					}
				}				
				$("#" + this.containerId).focus();
			}
			
			//选择上一个单元格
			this.selectDownCell = function(colId, rowId){
				var rowIndex = that.eg.getRowIndexById(rowId);
				while(rowIndex + 1 < that.eg.allRows.length){
					var downRowId = that.eg.getRowIdByIndex(rowIndex + 1);
					var cellId = colId + "_" + downRowId;
					var cell = this.eg.allCells[cellId];
					if(!cell.isHidden()){
						var downCellElementId = that.containerId + "_" + cellId;
						that.selectCell(downCellElementId, false, false, false);
						break;
					}
					else{
						rowIndex = rowIndex + 1;
					}
				}
				$("#" + this.containerId).focus();
			}
			
			//选择前一个单元格
			this.selectLeftCell = function(colId, rowId){
				var colIndex = that.eg.getColumnIndexById(colId);
				while(colIndex > 0){
					var leftColId = that.eg.getColumnIdByIndex(colIndex - 1);
					var cellId = leftColId + "_" + rowId;
					var cell = this.eg.allCells[cellId];
					if(!cell.isHidden()){
						var leftCellElementId = that.containerId + "_" + cellId;
						that.selectCell(leftCellElementId, false, false, false);
						break;
					}
					else{
						colIndex = colIndex - 1;
					}
				}		
				$("#" + this.containerId).focus();		
			}
			
			//选择后一个单元格
			this.selectRightCell = function(colId, rowId){
				var colIndex = that.eg.getColumnIndexById(colId);
				while(colIndex + 1 < that.eg.allColumns.length){
					var rightColId = that.eg.getColumnIdByIndex(colIndex + 1);
					var cellId = rightColId + "_" + rowId;
					var cell = this.eg.allCells[cellId];
					if(!cell.isHidden()){
						var rightCellElementId = that.containerId + "_" + cellId;
						that.selectCell(rightCellElementId, false, false, false);
						break;
					}
					else{
						colIndex = colIndex + 1;
					}
				}
				$("#" + this.containerId).focus();
			}
			
			this.cancelBubble = function(e){
				e.bubbles = false;	
				if(window.event != null){
					window.event.cancelBubble = true;
				}				
			}
			
			this.refreshEditingExpPosition = function(tElement){
				var startPos = tElement.selectionStart;
	           	var endPos = tElement.selectionEnd;
	           	var text = $(tElement).val();
	           	var prefixExp = text.substr(0, startPos);
	           	var postfixExp = text.substr(endPos); 
	           	$(that.cellOutEditor).attr("prefixExp", prefixExp);
	           	$(that.cellOutEditor).attr("postfixExp", postfixExp);	
	           	$(that.cellOutEditor).attr("clickedExp", "");				
			}
			
			//将单元格改为编辑状态
			this.beginCellEdit = function(cellId, needFocus){ 
				var cell = this.eg.allCells[cellId];
				var cellElement = $("#" + this.containerId + "_" + cellId);
				var editorParent = $(cellElement).children("div").children("div");
				var editorId = this.containerId + "_" + cellId + "_editor";
				var width = $(editorParent).width() - 4;
				var height = $(editorParent).height() - 4;
				var editorHtml = "<textarea id=\"" + editorId + "\" style=\"width:" + width + "px;height:" + height + "px;\" class=\"cellEditor\"></textarea>"
				$(editorParent).html(editorHtml);
				$(editorParent).addClass("gridCellInnerDivEditing");
				$(cellElement).attr("editing", true);
				$("#" + editorId).val(cell.getShowText()); 
				$("#" + editorId).css({});
				
				if(needFocus){
					$("#" + editorId).select();
				}
				
				$("#" + editorId).click(function(e){
					that.refreshEditingExpPosition(this); 
				});
				
				$("#" + editorId).focus(function(e){
					$(that.cellOutEditor).attr("enableEditor","in");
				});
				
				$("#" + editorId).change(function(){
					var autoChange = $(that.cellOutEditor).attr("autoChange") == "true";
					if(!autoChange){
			           	$(that.cellOutEditor).removeAttr("prefixExp");
			           	$(that.cellOutEditor).removeAttr("postfixExp");	
			           	$(that.cellOutEditor).removeAttr("clickedExp");
					}
				});
				
				$("#" + editorId).keyup(function(e){
					var text = $(this).val();
					$(that.cellOutEditor).val(text);
				});
				
				$("#" + editorId).keydown(function(e){
					var tdElmenent = $(this).parent().parent().parent();
					var rowId = $(tdElmenent).attr("rowId");
					var colId = $(tdElmenent).attr("colId");
					var keyCode = e.keyCode; 
					switch(keyCode){
						case 38: 
						case 40: 
						case 39: 
						case 37:{
							that.cancelBubble(e);
						}							
						break;
						case 27:{
							//点击esc，取消编辑，值恢复到编辑前状态
							that.endCellEdit(false);
							that.cancelBubble(e);
							return false;
						}
						break;
						case 13:{
							if(e.altKey){
								//点击alt+enter，那么换行; 
								var cellId = colId + "_" + rowId; 
								var startPos = this.selectionStart;
					           	var endPos = this.selectionEnd;
					           	
					           	var text = $(this).val();
					            var prefix = text.substr(0, startPos);
					            var postfix = text.substr(endPos);
					            
					            $(this).val(prefix + "\r\n" + postfix);
					            
					           	var newPos = prefix.length + 1;
					           	if (this.setSelectionRange) {  
					           		this.setSelectionRange(newPos, newPos);  
					            }   
					            else if (this.createTextRange) {//IE 
					                var range = this.createTextRange();  
					                range.collapse(true);  
					                range.moveStart('character', newPos);  
					                range.moveEnd('character', newPos);  
					                range.select();
					            } 
								that.cancelBubble(e);
							}
							else if(e.shiftKey){
								//如果shift+enter，那么接受编辑endEdit，定位到上一个单元格；
								that.endCellEdit(true); 
								that.selectUpCell(colId, rowId);
								that.cancelBubble(e);
							}
							else{
								//如果enter，那么接受编辑endEdit，然后定位到下一个单元格；
								that.endCellEdit(true); 
								that.selectDownCell(colId, rowId);
								that.cancelBubble(e);
							}
							return false;
						}
						break;
						case 9:{
							if(e.shiftKey){
								//如果shift+tab，那么接受编辑endEdit，定位到前一个单元格。
								that.endCellEdit(true); 
								that.selectLeftCell(colId, rowId);
								that.cancelBubble(e);
							}
							else{
								//如果tab，那么接受编辑endEdit，定位到后一个单元格；
								that.endCellEdit(true); 
								that.selectRightCell(colId, rowId);
								that.cancelBubble(e);
							}
							return false;
						}
						break;
					}
				});
			}
			
			//将单元格改为浏览状态
			this.endCellEdit = function(aceptNewValue){
				var cellElements = $("#" + this.containerId).find("td[editing='true']");
				if(cellElements.length > 0){
					var cellElement = cellElements[0];
					var editorParent = $(cellElement).children("div").children("div");
					var inputElements = $(editorParent).children("textarea");
					if(inputElements.length > 0) {
						var inputElement = inputElements[0];
						
						var colId = $(cellElement).attr("colId");
						var rowId = $(cellElement).attr("rowId");
						var cellId = colId + "_" + rowId;
						
						if(aceptNewValue) {
							var value = $(inputElement).val();
							var cell = this.eg.allCells[cellId];
							cell.value = value;
						}
						
						$(editorParent).empty();
						$(editorParent).removeClass("gridCellInnerDivEditing");
						$(cellElement).removeAttr("editing");
						this.refreshCellShowValue(cellId);
					}
					
					//外部编辑框显示当前单元格的内容
					var currentCells = $("#" + this.containerId).find("td[isCurrentCell='true']");
					if(currentCells.length > 0){
						var currentCell = currentCells[0]; 
						var rowId = $(currentCell).attr("rowId");
						var colId = $(currentCell).attr("colId");
						var cell = this.eg.allCells[colId + "_" + rowId];
						$(that.cellOutEditor).val(cell.getShowText());
					}
					else{
						$(that.cellOutEditor).val("");
					}
				}
				$("#" + this.containerId).focus();
			}
		}
		
		function excelGrid(){

			this.defaultColumnWidth = 80;
			this.defaultRowHeight = 20;
			
			//所有列
			this.allColumns = new Array();
			
			//所有行
			this.allRows = new Array();
			
			//所有单元格
			this.allCells = {};
			
			//列名称和列序号的对照
			this.allIndexToColumnName = {};
			this.allColumnNameToIndex = {};
			
			//初始化列名称字典
			this.initColumnNameDic = function(){
				var columnIndex =  0;
				for(var i = -1; i < 26; i++){
					var chr1 = (i == -1) ? "" : String.fromCharCode(i + 65);
					for(var j = 0; j < 26; j++){
						var chr2 = String.fromCharCode(j + 65);
						var columnName = chr1 + chr2;
						this.allIndexToColumnName[columnIndex] = columnName;
						this.allColumnNameToIndex[columnName] = columnIndex;
						columnIndex++;
					}		
				}
			}			 

			//根据行Id获取行
			this.getRowById = function(rowId){ 
				var rowCount = this.allRows.length;
				for(var i = 0; i < rowCount; i++){
					var row = this.allRows[i];
					if(rowId == row.id){
						return row;
					}
				}
				return null;
			}

			//根据列Id获取列
			this.getColumnById = function(columnId){ 
				var columnCount = this.allColumns.length;
				for(var i = 0; i < columnCount; i++){
					var col = this.allColumns[i];
					if(columnId == col.id){
						return col;
					}
				}
				return null;
			}
			//根据列id获取序号
			this.getColumnIndexById = function(columnId){ 
				var columnCount = this.allColumns.length;
				for(var i = 0; i < columnCount; i++){
					if(columnId == this.allColumns[i].id){
						return i;
					}
				}
				return -1;
			}

			//根据列序号获取id
			this.getColumnIdByIndex = function(index){ 
				return this.allColumns[index].id;
			}
			
			//根据列序号
			this.getColumnIndex = function(column){
				var columnCount = this.allColumns.length;
				for(var i = 0; i < columnCount; i++){
					if(column == this.allColumns[i]){
						return i;
					}
				}
				return -1;
			}
			
			//根据行序号
			this.getRowIndexById = function(rowId){
				var rowCount = this.allRows.length;
				for(var i = 0; i < rowCount; i++){
					if(rowId == this.allRows[i].id){
						return i;
					}
				}
				return -1;
			}

			//根据行序号获取id
			this.getRowIdByIndex = function(index){ 
				return this.allRows[index].id;
			}
			
			//根据行序号
			this.getRowIndex = function(row){
				var rowCount = this.allRows.length;
				for(var i = 0; i < rowCount; i++){
					if(row == this.allRows[i]){
						return i;
					}
				}
				return -1;
			}
			
			//根据id获取列名称
			this.getColumnNameById = function(colId){
				var colIndex = this.getColumnIndexById(colId);
				return this.allIndexToColumnName[colIndex];
			}
			
			//根据序号获取列名称
			this.getColumnNameByIndex = function(index){
				return this.allIndexToColumnName[index];
			}
			
			//根据名称获取列序号
			this.getColumnIndexByName = function(name){
				return this.allColumnNameToIndex[name];
			}
			
			//根据行列序号获取单元格
			this.getCellByIndex = function(columnIndex, rowIndex){
				if(columnIndex >= 0 && columnIndex < this.allColumns.length
					&& rowIndex >=0 && rowIndex < this.allRows.length){					
					var column = this.getColumnByIndex(columnIndex);
					var row = this.getRowByIndex(rowIndex);
					var cell = this.allCells[column.id + "_" + row.id];
					return cell;
				}
				else{
					return null;
				}
			}
			
			//根据行列序号获取单元格Id
			this.getCellIdByIndex = function(columnIndex, rowIndex){
				if(columnIndex >= 0 && columnIndex < this.allColumns.length
					&& rowIndex >=0 && rowIndex < this.allRows.length){					
					var column = this.getColumnByIndex(columnIndex);
					var row = this.getRowByIndex(rowIndex);
					var cellId = column.id + "_" + row.id;
					return cellId;
				}
				else{
					return null;
				}
			}
			
			//获取区域内的所有单元格Id
			this.rangeCellIds = function(cellAId, cellBId){
				var cellA = this.allCells[cellAId];
				var cellAColumnIndex = this.getColumnIndexById(cellA.columnId);
				var cellARowIndex = this.getRowIndexById(cellA.rowId);
				
				var cellB = this.allCells[cellBId];
				var cellBRowIndex = this.getRowIndexById(cellB.rowId);

				var fromColumnIndex = -1; 
				var toColumnIndex = -1;
				var fromRowIndex = -1;
				var toRowIndex = -1;
				
				if(cellAColumnIndex > cellBColumnIndex){
					fromColumnIndex = cellBColumnIndex;
					toColumnIndex = cellAColumnIndex;
				}
				else{
					fromColumnIndex = cellAColumnIndex;
					toColumnIndex = cellBColumnIndex;
				}
				
				if(cellARowIndex > cellBRowIndex){
					fromRowIndex = cellBRowIndex;
					toRowIndex = cellARowIndex;
				}
				else{
					fromRowIndex = cellARowIndex;
					toRowIndex = cellBRowIndex;
				}
				
				var allRowIds = new Array();
				var allColumnIds = new Array();
				for(var i = fromColumnIndex; i <= toColumnIndex; i++){
					var columnId = this.allColumns[i].id;
					allColumnIds.push(columnId);
				}
				for(var i = fromRowIndex; i <= toRowIndex; i++){
					var rowId = this.allRows[i].id;
					allRowIds.push(rowId);
				}
				
				var allRangeCellIds = new Array();
				for(var i = 0; i < allColumnIds.length; i++){
					var columnId = allColumnIds[i];
					for(var j = 0; j < allRowIds.length; j++){
						var rowId = allRowIds[j];
						allRangeCellIds.push(columnId + "_" + rowId);
					}
				}
				return allRangeCellIds;
			}
			
			//合并单元格
			this.mergeCells = function(range){	
				var left = range.left;	
				var right = range.right;	
				var top = range.top;	
				var bottom = range.bottom;

				var groupCellId = this.getColumnIdByIndex(left) + "_" + this.getRowIdByIndex(top);
				var groupCell = this.allCells[groupCellId];
				groupCell.rowSpan = bottom - top + 1;
				groupCell.colSpan = right - left + 1;
				for(var i = left; i <= right; i++){
					var colId = this.getColumnIdByIndex(i);
					for(var j = top; j <= bottom; j++){
						var rowId = this.getRowIdByIndex(j);
						var cellId = colId + "_" + rowId; 						
						var cell = this.allCells[cellId];
						cell.groupCellId = groupCellId;
					}
				}
			}
			
			//取消合并
			this.unmergeCells = function(groupCellId){
				var groupMainCell = this.allCells[groupCellId];
				if(groupMainCell.colSpan > 1 || groupMainCell.rowSpan > 1) { 
					var needRefreshCells = new Array();
					needRefreshCells.push(groupMainCell);
					groupMainCell.groupCellId = null;
					groupMainCell.colSpan = 1;
					groupMainCell.rowSpan = 1;
										
					//记录下所有同组的单元格id 
					for(var cellId in this.allCells){
						var cell = this.allCells[cellId];
						if(cell.groupCellId == groupCellId){ 
							cell.groupCellId = null;
							cell.colSpan = 1;
							cell.rowSpan = 1;
							needRefreshCells.push(cell);
						}
					}
					return needRefreshCells;
				}
				else{
					return null;
				}
			}
			
			//添加行
			this.addRow = function(index){
				var rowCount = this.allRows.length;
				var newAllRows = new Array();
				for(var i = 0; i < index; i++){
					var row = this.allRows[i];
					newAllRows.push(row);
				}
				
				var newRow = new excelGridRow();
				newRow.init({height: this.defaultRowHeight});
				newAllRows.push(newRow);
				
				for(var i = index; i < rowCount; i++){
					var row = this.allRows[i];
					newAllRows.push(row);
				}			
				
				//在所有列中增加此列对应的单元格
				var newRowId = newRow.id;
				var colCount = this.allColumns.length; 
				var allResizeGroupCells = {};
				var allNewCells = {};
				for(var colIndex = 0; colIndex < colCount; colIndex++){
					var col = this.allColumns[colIndex];
					var colId = col.id;
					var newCell = new excelGridCell();
					newCell.init({columnId:colId, rowId:newRowId, colSpan: 1, rowSpan: 1});
					this.allCells[newCell.id] = newCell;
					allNewCells[newCell.id] = newCell;

					var leftCell = this.getCellByIndex(colIndex, index - 1);
					var rightCell = this.getCellByIndex(colIndex, index);
					if(leftCell != null && rightCell != null && leftCell.isInGroup() && rightCell.isInGroup() && leftCell.groupCellId == rightCell.groupCellId){ 
						newCell.groupCellId = leftCell.groupCellId;
						if(allResizeGroupCells[newCell.groupCellId] == null) {
							allResizeGroupCells[newCell.groupCellId] = this.allCells[newCell.groupCellId];
						}
					}					
				}
				for(var groupCellId in allResizeGroupCells){
					var groupCell = allResizeGroupCells[groupCellId];
					groupCell.rowSpan = groupCell.rowSpan + 1;
				}
				
				this.allRows = newAllRows;				
				return {row: newRow, allNewCells: allNewCells, allResizeGroupCells: allResizeGroupCells};
			}
			
			//添加列
			this.addColumn = function(index){
				var columnCount = this.allColumns.length;
				var newAllColumns = new Array();
				for(var i = 0; i < index; i++){
					var column = this.allColumns[i];
					newAllColumns.push(column);
				}
				
				var newColumn = new excelGridColumn();
				newColumn.init({width: this.defaultColumnWidth});
				newAllColumns.push(newColumn);
				
				for(var i = index; i < columnCount; i++){
					var column = this.allColumns[i];
					newAllColumns.push(column);
				}			
				
				//在所有行中增加此列对应的单元格
				var newColumnId = newColumn.id;
				var rowCount = this.allRows.length; 
				var allResizeGroupCells = {};
				var allNewCells = {};
				for(var rowIndex = 0; rowIndex < rowCount; rowIndex++){
					var row = this.allRows[rowIndex];
					var rowId = row.id;
					var newCell = new excelGridCell();
					newCell.init({columnId:newColumnId, rowId:rowId, colSpan: 1, rowSpan: 1});
					this.allCells[newCell.id] = newCell;
					allNewCells[newCell.id] = newCell;

					var leftCell = this.getCellByIndex(index - 1, rowIndex);
					var rightCell = this.getCellByIndex(index, rowIndex);
					if(leftCell != null && rightCell != null && leftCell.isInGroup() && rightCell.isInGroup() && leftCell.groupCellId == rightCell.groupCellId){ 
						newCell.groupCellId = leftCell.groupCellId;
						if(allResizeGroupCells[newCell.groupCellId] == null) {
							allResizeGroupCells[newCell.groupCellId] = this.allCells[newCell.groupCellId];
						}
					}					
				}
				for(var groupCellId in allResizeGroupCells){
					var groupCell = allResizeGroupCells[groupCellId];
					groupCell.colSpan = groupCell.colSpan + 1;
				}
				
				this.allColumns = newAllColumns;				
				return {column: newColumn, allNewCells: allNewCells, allResizeGroupCells: allResizeGroupCells};
			} 
			
			//删除行
			this.deleteRow = function(index){
				var rowCount = this.allRows.length;
				var newAllRows = new Array();
				for(var i = 0; i < index; i++) {
					var row = this.allRows[i];
					newAllRows.push(row);
				}

				for(var i = index + 1; i < rowCount; i++) {
					var row = this.allRows[i];
					newAllRows.push(row);
				}			

				var delRow = this.allRows[index];
				delRow.isDeleted = true;
				
				var allNewShowGroupCells = {};
				var allResizeGroupCells = {};
				var allDeleteCells = {};
				var colCount = this.allColumns.length;
				for(var colIndex = 0; colIndex < colCount; colIndex++){
					var col = this.allColumns[colIndex];
					var allGroupCells = {};
					var delCellId = this.getCellIdByIndex(colIndex, index); 
					var delCell = this.allCells[delCellId];
					if(delCell.isInGroup()) {
						if(delCell.groupCellId == delCell.id){
							var downCell = this.getCellByIndex(colIndex, index + 1);
							if(downCell != null && downCell.groupCellId == delCell.id){
								for(var cellId in this.allCells){
									var cell = this.allCells[cellId];
									if(cell.groupCellId == delCell.id){
										cell.groupCellId = downCell.id; 
									}
								}
								downCell.colSpan = delCell.colSpan;
								downCell.rowSpan = delCell.rowSpan - 1;
								allNewShowGroupCells[downCell.id] = downCell;
							}
						}
						else{ 
							var groupCell = this.allCells[delCell.groupCellId];
							if(groupCell != null && allResizeGroupCells[groupCell.id] == null && groupCell.columnId == delCell.columnId) {
								groupCell.rowSpan = groupCell.rowSpan - 1;
								allResizeGroupCells[groupCell.id] = groupCell;
							}
						}	 
					}
					allDeleteCells[delCell.id] = delCell; 
					delCell.isDeleted = true;
					delete this.allCells[delCellId]; 
				} 
				
				this.allRows = newAllRows; 
				return {
					allNewShowGroupCells: allNewShowGroupCells,
					allResizeGroupCells: allResizeGroupCells,
					allDeleteCells: allDeleteCells
				}
			}
			
			//删除列
			this.deleteColumn = function(index) {
				var columnCount = this.allColumns.length;
				var newAllColumns = new Array();
				for(var i = 0; i < index; i++) {
					var column = this.allColumns[i];
					newAllColumns.push(column);
				}

				for(var i = index + 1; i < columnCount; i++) {
					var column = this.allColumns[i];
					newAllColumns.push(column);
				}			

				var delColumn = this.allColumns[index];
				delColumn.isDeleted = true;
				
				var allNewShowGroupCells = {};
				var allResizeGroupCells = {};
				var allDeleteCells = {};
				var rowCount = this.allRows.length;
				for(var rowIndex = 0; rowIndex < rowCount; rowIndex++){
					var row = this.allRows[rowIndex];
					var allGroupCells = {};
					var delCellId = this.getCellIdByIndex(index, rowIndex); 
					var delCell = this.allCells[delCellId];
					if(delCell.isInGroup()) {
						if(delCell.groupCellId == delCell.id){
							var rightCell = this.getCellByIndex(index + 1, rowIndex);
							if(rightCell != null && rightCell.groupCellId == delCell.id){
								for(var cellId in this.allCells){
									var cell = this.allCells[cellId];
									if(cell.groupCellId == delCell.id){
										cell.groupCellId = rightCell.id; 
									}
								}
								rightCell.rowSpan = delCell.rowSpan;
								rightCell.colSpan = delCell.colSpan - 1;
								allNewShowGroupCells[rightCell.id] = rightCell;
							}
						}
						else{ 
							var groupCell = this.allCells[delCell.groupCellId];
							if(groupCell != null && allResizeGroupCells[groupCell.id] == null && groupCell.rowId == delCell.rowId) {
								groupCell.colSpan = groupCell.colSpan - 1;
								allResizeGroupCells[groupCell.id] = groupCell;
							}
						}	 
					}
					allDeleteCells[delCell.id] = delCell; 
					delCell.isDeleted = true;
					delete this.allCells[delCellId]; 
				} 
				
				this.allColumns = newAllColumns; 
				return {
					allNewShowGroupCells: allNewShowGroupCells,
					allResizeGroupCells: allResizeGroupCells,
					allDeleteCells: allDeleteCells
				}
			}
			
			this.moveRows = function(selectedRowIds, toRowIndex){
				var allSelectedRowIds = {};
				for(var i = 0; i < selectedRowIds.length; i++){
					var rowId = selectedRowIds[i]; 
					allSelectedRowIds[rowId] = rowId; 
				} 
								
				var rowCount = this.allRows.length;
				var newAllRows = new Array();
				for(var i = 0; i < toRowIndex; i++){
					var row = this.allRows[i]; 
					if(allSelectedRowIds[row.id] == null){
						newAllRows.push(row);
					}
				}
				for(var i = 0; i < selectedRowIds.length; i++){
					var rowId = selectedRowIds[i];
					var row = this.getRowById(rowId);
					newAllRows.push(row);
				} 
				
				for(var i = toRowIndex; i < rowCount; i++){
					var row = this.allRows[i]; 
					if(allSelectedRowIds[row.id] == null){
						newAllRows.push(row);
					}
				}			
				this.allRows = newAllRows;
			}
			
			this.moveColumns = function(selectedColumnIds, toColIndex){
				var allSelectedColIds = {};
				for(var i = 0; i < selectedColumnIds.length; i++){
					var colId = selectedColumnIds[i]; 
					allSelectedColIds[colId] = colId; 
				} 
								
				var columnCount = this.allColumns.length;
				var newAllColumns = new Array();
				for(var i = 0; i < toColIndex; i++){
					var column = this.allColumns[i]; 
					if(allSelectedColIds[column.id] == null){
						newAllColumns.push(column);
					}
				}
				for(var i = 0; i < selectedColumnIds.length; i++){
					var colId = selectedColumnIds[i];
					var col = this.getColumnById(colId);
					newAllColumns.push(col);
				} 
				
				for(var i = toColIndex; i < columnCount; i++){
					var column = this.allColumns[i]; 
					if(allSelectedColIds[column.id] == null){
						newAllColumns.push(column);
					}
				}			
				this.allColumns = newAllColumns;
			}
 
			//根据名称获取列
			this.getColumnByName  = function(name){
				var index = this.getColumnIndexByName(name);
				return this.allColumns[index];
			}
			
			//根据序号获取列
			this.getColumnByIndex = function(index){ 
				return this.allColumns[index];
			}
			
			//根据序号获取行
			this.getRowByIndex = function(index){
				return this.allRows[index];
			}
			
			//初始化表格
			this.load = function(initParam){
				
				this.initColumnNameDic();
				
				/*
				传递过来json对象，根据json对象，初始化excelGrid对象，json对象的内容包括：
				obj.columns数组
				col.id
				col.width数值
				col.isFrozen布尔
				
				obj.rows数组
				row.id
				row.height数值
				row.isFrozen布尔
				
				obj.cells键值对
				cell.id
				cell.columnId
				cell.rowId
				cell.value
				cell.cellValueType 是valueType枚举值，例如valueType.string
				cell.expression
				cell.formatString
				cell.colSpan数值
				cell.rowSpan数值
				cell.groupCellId				
				*/
				for(var i = 0; i < obj.columns.length; i++){
					var pColObj = obj.columns[i];
					var newCol = new excelGridColumn();
					newColumn.init({id: pColObj.id, 
						width: pColObj.width, 
						isFrozen: pColObj.isFrozen
					});
					this.allColumns.push(newColumn); 
				}
				 
				for(var i = 0; i < obj.rows.length; i++){ 
					var pRowObj = obj.rows[i];
					var newCol = new excelGridColumn();
					newRow.init({id: pRowObj.id, 
						height: pRowObj.height, 
						isFrozen: pRowObj.isFrozen
					});
					this.allRows.push(newRow); 
				}
				
				for(var cellId in obj.cells){
					var pCellObj = obj.cells[cellId];
					var newCell = new excelGridCell();
					newCell.init({
						id: pCellObj.id,
						columnId: pCellObj.columnId,
						rowId: pCellObj.rowId,
						value: pCellObj.value,
						cellValueType: pCellObj.cellValueType,
						cellShowType: pCellObj.cellShowType,
						expression: pCellObj.expression,
						formatString: pCellObj.formatString,
						colSpan: pCellObj.colSpan,
						rowSpan: pCellObj.rowSpan,
						groupCellId: pCellObj.groupCellId
					});
					this.allCells[newCell.id] = newCell;
				}
			}
			
			this.create = function(initParam){
				
				this.initColumnNameDic();
				
				var columnCount =  initParam.columnCount;
				this.defaultColumnWidth = initParam.columnWidth == null ? this.defaultColumnWidth : initParam.columnWidth;
				var rowCount = initParam.rowCount;
				this.defaultRowHeight = initParam.rowHeight == null ? this.defaultRowHeight : initParam.rowHeight;

				for(var i = 0; i < columnCount; i++){ 
					var newCol = new excelGridColumn();
					newCol.init({width: this.defaultColumnWidth});
					this.allColumns.push(newCol); 
				}
				 
				for(var i = 0; i < rowCount; i++){  
					var newRow = new excelGridRow();
					newRow.init({height: this.defaultRowHeight});
					this.allRows.push(newRow); 
				}

				for(var i = 0; i < columnCount; i++){ 
					var col = this.allColumns[i];
					for(var j = 0; j < rowCount; j++){    
						var row = this.allRows[j];						
						var newCell = new excelGridCell();
						newCell.init({ 
							columnId: col.id,
							rowId: row.id,
							cellValueType: valueType.String,
							colSpan: 1,
							rowSpan: 1
						});
						this.allCells[newCell.id] = newCell;
					}
				}
			} 
		}
		
		function excelGridColumn(){
			this.width = 80;
			this.isFrozen = false;
			this.id = null;
			this.isDeleted = false;
			
			this.init = function(initParam){
				if(initParam.id == null){
					this.id = cmnPcr.createGuid();
				}
				else{
					this.id = initParam.id;
				}
				this.width = initParam.width;
				this.isFrozen = initParam.isFrozen == null ? false : initParam.isFrozen;
			}
		}
		
		function excelGridRow(){
			this.height = 20;
			this.isFrozen = false;
			this.id = null;
			this.isDeleted = false;
			
			this.init = function(initParam){
				if(initParam.id == null){
					this.id = cmnPcr.createGuid();
				}
				else{
					this.id = initParam.id;
				}
				this.height = initParam.height;
				this.isFrozen = initParam.isFrozen == null ? false : initParam.isFrozen;
			}
		}
		
		function excelGridCell(){
			this.id = null;
			this.columnId = null;
			this.rowId = null;
			this.value = null;
			this.cellValueType = valueType.string;
			this.cellShowType = "text";//text/htmlElement/link
			this.expression = "";
			this.formatString = "";
			this.colSpan = 1;
			this.rowSpan = 1;
			this.groupCellId = null;
			this.isDeleted = false;
			
			this.clone = function(colId, rowId, groupCellId){
				var newCell = new excelGridCell();
				newCell.init({
					columnId: colId,
					rowId: rowId,
					groupCellId: groupCellId,
					value: this.value,
					cellValueType: this.cellValueType,
					cellShowType: this.cellShowType,
					expression: this.expression,
					formatString: this.formatString,
					colSpan: this.colSpan,
					rowSpan: this.rowSpan
				});
				return newCell;
			}
			
			//复制内容值目标单元格
			this.copyTo = function(toCell){
				toCell.value = this.value;
				toCell.cellValueType = this.cellValueType;
				toCell.cellShowType = this.cellShowType;
				toCell.expression = this.expression;
				toCell.formatString = this.formatString;
				toCell.colSpan = this.colSpan;
				toCell.rowSpan = this.rowSpan;
			}
			
			this.isHidden = function(){
				return this.groupCellId !=null && this.groupCellId != this.id;
			}
			
			this.isInGroup = function(){
				return this.groupCellId != null;
			}
			
			this.getShowHtml = function(){
				var html = "";
				switch(this.cellShowType){
					case "text": {
						var text = this.getShowText();
						html = cmnPcr.html_encode(text);
					}
					break;
					case "htmlElement": { 
						html = "htmlElement";
					}
					break;
					case "link": { 
						html = "link";
					}
					break;
				} 
				return html;
			}
			
			this.getShowText = function(){
				if (this.value == undefined || this.value == null) {
					return "";
				} 
				else {
					switch (this.cellValueType) {
					case valueType.string:
						return this.value.toString();
					case valueType.decimal:
						return cmnPcr.decimalToStr(this.value);
					case valueType.boolean:
						return cmnPcr.booleanToStr(this.value);
					case valueType.time:
						return cmnPcr.datetimeToStr(this.value, this.formatString == null ? "yyyy-MM-dd HH:mm:ss" : this.formatString);
					case valueType.date:
						return cmnPcr.datetimeToStr(this.value, this.formatString == null ? "yyyy-MM-dd HH:mm:ss" : this.formatString);
					default:
						return "Error, type=" + this.cellValueType + ", obj=" + this.value.toString(); 
					}
				}
			}
			
			//字符串转简单类型对象
			this.getValueObject = function(str, type) {
				if (str == "" || str == undefined || str == null) {
					return null;
				} 
				else {
					switch (this.cellValueType) {
					case valueType.string:
						return str;
					case valueType.decimal:
						return cmnPcr.strToDecimal(str);
					case valueType.boolean:
						return cmnPcr.strToBoolean(str);
					case valueType.time:
						return cmnPcr.strToTime(str);
					case valueType.date:
						return cmnPcr.strToDate(str);
					default:
						alert("strToObject, type=" + this.cellValueType + ", str=" + str);
						return null;
					}
				}
			}
			
			this.init = function(initParam){
				if(initParam.id == null){
					this.id = initParam.columnId + "_" + initParam.rowId;
				}
				else{
					this.id = initParam.id;
				}
				this.columnId = initParam.columnId;
				this.rowId = initParam.rowId; 
				this.value = initParam.value;
				this.cellValueType = initParam.cellValueType == null ? valueType.string : initParam.cellValueType;
				this.cellShowType = initParam.cellShowType == null ? "text" : initParam.cellShowType;
				this.expression = initParam.expression;
				this.formatString = initParam.formatString;
				this.colSpan = initParam.colSpan;
				this.rowSpan = initParam.rowSpan;
				this.groupCellId = initParam.groupCellId;
			}		
		}
	</script> 
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">

	<div id="colMenu" class="easyui-menu" style="width:120px;">
		<div id="colCut">剪切</div>		
		<div id="colCopy">复制</div>	
		<div id="colPaste">粘贴</div>		
		<div id="colInsertBefore">此前插入</div>		
		<div id="colInsertAfter">此后插入</div>	
		<div id="colDelete">删除</div>	
		<div id="colClearContent">清除内容</div>	
		<div id="colSetWidth">设置列宽</div>
	</div> 
	<div id="rowMenu" class="easyui-menu" style="width:120px;">
		<div id="rowCut">剪切</div>		
		<div id="rowCopy">复制</div>	
		<div id="rowPaste">粘贴</div>		
		<div id="rowInsertBefore">此前插入</div>		
		<div id="rowInsertAfter">此后插入</div>	
		<div id="rowDelete">删除</div>	
		<div id="rowClearContent">清除内容</div>	
		<div id="rowSetHeight">设置行高</div>
	</div> 
	<div id="cellMenu" class="easyui-menu" style="width:120px;">
		<div id="cellCopy">复制</div>	
		<div id="cellPaste">粘贴</div>		
		<div id="cellClearContent">清除内容</div>
		<div id="cellMerge">合并单元格</div>
		<div id="cellUnmerge">取消合并单元格</div>
	</div> 
	<div style="width:0px;height:0px;">
		<textarea id="copyPasteInputId" style="display:block;width:0px;height:0px;"></textarea>
	</div>
						
	<div id="toolbarContainerId" data-options="region:'north',border:false" style="height:56px;overflow:hidden;">	 
		<div class="gridToolbar"> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</div>
		<div class="gridEditbar">
			<table style="width:100%;height:27px;" cellpadding="0" cellspacing="0">
				<tr>
					<td style="width: 7px;"></td>
					<td style="width: 65px;vertical-align: top;">
						<div name="currentCellInfoDiv" style="height:25px;width:60px;line-height:25px;text-align:center;border:solid 1px #cccccc;"></div>
					</td>
					<td style="width: 30px;vertical-align: top;">
						<div name="editExpressionButton" style="width:25px;height:25px;border:solid 1px #cccccc;line-height:25px;text-align:center;cursor:default;">fx</div> 
					</td>
					<td style="vertical-align: top;"> 
						<textarea name="cellOutEditor" class="gridEditor" style="border-width:1px;border-color:#cccccc;padding:0px;resize:none;"></textarea> 
					</td>
					<td style="width: 9px;"></td>
				</tr>
			</table>
		</div>  
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		<div id="excelGridlayoutContainerId" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">			
			<div name="topDiv" data-options="region:'north',border:false,split:false" style="height:100px;">
				<div name="topLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true"> 
					<div name="leftTopFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftTopFrozenTable" class="normalTable" style="height:100px;width:100px;">
						<!--
							<tr>
								<td style="width:100px;" class="normalCell">左上</td>
							</tr>
						--> 
						</table>
					</div> 
					<div name="topFrozenDiv" data-options="region:'center',border:false,split:false" style="overflow:hidden;">
						<div name="topFrozenTableContainerDiv" style="width:20px;height:100px;">
							<table name="topFrozenTable" class="normalTable" style="height:100px;width:500px;">
							<!--
								<tr>
									<td style="width:100px;" class="normalCell">列1</td>
									<td style="width:100px;" class="normalCell">列2</td>
									<td style="width:100px;" class="normalCell">列3</td>
									<td style="width:100px;" class="normalCell">列4</td>
									<td style="width:100px;" class="normalCell">列5</td>
									<td style="width:20px;" class="blankCell">&nbsp;</td>
								</tr>
							-->
							</table> 
						</div>
					</div>	 
				</div> 
			</div>
			<div data-options="region:'center',border:false,split:false">  
				<div name="bottomLayoutDiv" class="easyui-layout" style="width:100%;height:100%;" data-options="fit:true">  
					<div name="leftFrozenDiv" data-options="region:'west',border:false,split:false" style="overflow:hidden;width:100px;">
						<table name="leftFrozenTable" class="normalTable" style="width:100px;height:520px;">
						<!-- 
							<tr style="height:100px;">
								<td class="normalCell">行1</td>
							</tr>
							<tr style="height:100px;">
								<td class="normalCell">行2</td>
							</tr>
							<tr style="height:100px;">
								<td class="normalCell">行3</td>
							</tr>
							<tr style="height:100px;">
								<td class="normalCell">行4</td>
							</tr>
							<tr style="height:100px;">
								<td class="normalCell">行5</td>
							</tr>
							<tr style="height:20px;">
								<td class="blankCell">&nbsp;</td>
							</tr> 
						-->
						</table>
						<div style="height:20px;"></div>
					</div> 
					<div name="mainDiv"  data-options="region:'center',border:false,split:false" id="rightBottomDivId" style="overflow:auto;"">
						<table name="mainTable"  class="normalTable" style="width:500px;height:500px;" cellspacing="0" cellpadding="0" >
							<!-- 
							<tr style="height:100px;">
								<td style="width:200px;" class="normalCell" colspan="2" rowspan = "2">c11</td>  
								<td style="width:100px;" class="normalCell">c13</td> 
								<td style="width:100px;" class="normalCell">c14</td> 
								<td style="width:100px;" class="normalCell">c15</td> 
							</tr>
							<tr style="height:100px;">  
								<td style="width:100px;" class="normalCell" rowspan = "2">c23</td> 
								<td style="width:100px;" class="normalCell">c24</td> 
								<td style="width:100px;" class="normalCell">c25</td> 
							</tr>
							<tr style="height:100px;">
								<td style="width:100px;" class="normalCell">c31</td> 
								<td style="width:100px;" class="normalCell">c32</td>  
								<td style="width:100px;" class="normalCell">c34</td> 
								<td style="width:100px;" class="normalCell">c35</td> 
							</tr>
							<tr style="height:100px;">
								<td style="width:100px;" class="normalCell">c41</td> 
								<td style="width:100px;" class="normalCell">c42</td> 
								<td style="width:100px;" class="normalCell">c43</td> 
								<td style="width:100px;" class="normalCell">c44</td> 
								<td style="width:100px;" class="normalCell">c45</td> 
							</tr>
							<tr style="height:100px;">
								<td style="width:100px;" class="normalCell">c51</td> 
								<td style="width:100px;" class="normalCell">c52</td> 
								<td style="width:100px;" class="normalCell">c53</td> 
								<td style="width:100px;" class="normalCell">c54</td> 
								<td style="width:100px;" class="normalCell">c55</td> 
							</tr>
							-->
						</table>
					</div>
				</div>
			</div> 
		</div>
	</div>
</body>	 
</html>