//excel表格显示，此类实现的功能方法，解决展示效果
function ExcelGridLayout(p){
	var that = this;
	
	//当前正在编辑的sheet的id
	this.currentSheetId = null;
		
	//默认列标行的高度 、行标列的宽度 
	this.borderWidth = 1;
	
	//excelGrid
	this.eg = null;
	
	this.bodyId = null;
	
	//container document element
	this.containerId = null;
	
	//展示模板
	this.sheetlayoutModuleId = null;
	
	//单元格外部编辑框
	this.cellOutEditor = null; 
	
	//显示当前选中单元格名称的DIV
	this.currentCellInfoDiv = null;
		
	//当前单元格id
	this.currentCellId = null;
	
	//工具栏容器id
	this.toolbarContainerId = null;
	
	//标题容器id
	this.titleContainerId = null;
	
	//副标题容器id
	this.subTitleContainerId = null;
	
	//最后一个被选中的单元格
	this.lastClickTdId = null;
	this.lastShiftClickTdId = null;	
	
	this.isTouchMoving = false;
	
	this.titleRowHeight = 22;
	this.getTitleRowHeight = function(){
		return this.eg.hasColumnRowTitle ? this.titleRowHeight : 0;
	}
	this.titleColumnWidth = 40;
	this.getTitleColumnWidth = function(){
		return this.eg.hasColumnRowTitle ? this.titleColumnWidth : 0;
	}
	
	this.allSheetColRows = null;
	//构造用户验证时需要的行列信息
	this.getSheetColRows = function(){
		return this.allSheetColRows;
	}
	//构造用户验证时需要的行列信息
	this.refreshSheetColRows = function(){
		var allSheetColRows = {};
		for(var sheetId in this.eg.allSheets){			
			var sheet = this.eg.allSheets[sheetId]; 
			
			var allColumnIds = new Array();  
			for(var i = 0; i < sheet.allColumns.length; i++){	
				var column = sheet.allColumns[i]; 
				allColumnIds.push(column.id);
			} 		
			var columns = new ExcelGridColumns(allColumnIds);
			
			
			var allRowIds = new Array();
			for(var i = 0; i < sheet.allRows.length; i++){ 
				var row = sheet.allRows[i]; 
				allRowIds.push(row.id);
			} 
			var rows = new ExcelGridRows(allRowIds);
			
			allSheetColRows[sheetId] = {
				columns: columns,
				rows: rows,
				name: sheet.name,
				id: sheetId
			};	
		}	
		this.allSheetColRows = allSheetColRows;
	}
	
	this.allCellValueTypes = null;
	this.getCellValueTypes = function(){
		return this.allCellValueTypes; 
	}
	
	this.refreshCellValueTypes = function(){ 
		var cellValueTypes = new Object();
		for(var cId in this.eg.allCells){
	 		var c = this.eg.getCell(cId); 
			cellValueTypes[cId] = c.cellValueType;
	 	}
	 	this.allCellValueTypes = cellValueTypes;
	}
	
	this.clientValidateAndCalcAllCells = function(){
		var modifiedCellIds = {};
		var allSheetColRows	= this.getSheetColRows();
		var cellValueTypes = this.getCellValueTypes(); 
		
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			cell.clearEffectCellId();
		}
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			if(cell.isExp){			
				var vd = new ExcelGridValidator();
				vd.compileCellExp(this.eg, cellValueTypes, allSheetColRows, cell.id, false);
			}
		}
		
		var allNoneRefCellIds = this.clientCalcAllNoneRefCells();
		
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			if(!cell.isExp || allNoneRefCellIds.contains(cellId)){
				modifiedCellIds[cellId] = "";
			}
		}
		
		this.updateEffectCellValues(modifiedCellIds, true, true); 		
	}    
	
	this.clientValidateAllCells = function(){
		var modifiedCellIds = new Array();
		this.refreshSheetColRows();
		this.refreshCellValueTypes();
		var allSheetColRows	= this.getSheetColRows();
		var cellValueTypes = this.getCellValueTypes(); 
		
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			cell.clearEffectCellId();
		}	
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			if(cell.isExp){			
				var vd = new ExcelGridValidator();
				vd.compileCellExp(this.eg, cellValueTypes, allSheetColRows, cell.id, false); 
			}
		}	
	}    
		
	//判断是否存在环引用
	this.refreshCircleRefer = function(cellId){
		var hasCircleRefer = false;
		var routeCellIds = new Array();
		var cell = this.eg.getCell(cellId);
		var effectCellIds = cell.effectCellIds;
		while(effectCellIds != null && effectCellIds.length > 0){
			var nextLevelEffectCellIds = new Array();
			for(var i = 0; i < effectCellIds.length; i++){
				var effectCellId = effectCellIds[i];
				if(effectCellId == cellId){
					hasCircleRefer = true;
					nextLevelEffectCellIds = null;
					break;
				}
				else{
					if(!routeCellIds.contains(effectCellId)){
						routeCellIds.push(effectCellId);
						var effectCell = this.eg.getCell(effectCellId);
						var nextEffectCellIds = effectCell.effectCellIds;
						if(nextEffectCellIds != null && nextEffectCellIds.length > 0){
							for(var j = 0; j < nextEffectCellIds.length; j++){
								var nextEffectCellId = nextEffectCellIds[j];
								nextLevelEffectCellIds.push(nextEffectCellId);
							}
						}
					}
				}
			}
			effectCellIds = nextLevelEffectCellIds;
		}
		
		cell.hasCircleRefer = hasCircleRefer;  
	}
	
	//更新引用了此单元格的单元格的值(递归执行下去)
	this.updateEffectCellValues = function(modifiedCellIds, hasExpChange, calcAllValue){
		var effectCellIds = {};
		for(var cellId in modifiedCellIds){ 
			var cell = this.eg.getCell(cellId);
			if(cell.effectCellIds != null){ 
				for(var effectCellId in cell.effectCellIds){ 		
					var effectCell = this.eg.getCell(effectCellId); 
					try{ 
					
						if(hasExpChange){
							this.refreshCircleRefer(effectCellId);
						}
					
						if(effectCell.hasCircleRefer){
							var cellName = this.getCellName(effectCellId);
							throw new Error(cellName + "存在循环引用");
						}
						
						var newValue = null;
						try{
							newValue = this.runExp(effectCell);
							effectCell.isError = false;
							effectCell.note = "";
						}
						catch(ex){
							effectCell.isError = true;
							effectCell.note = ex.message;
						}						
						if(newValue != effectCell.value || calcAllValue){
							effectCell.value = newValue;
							if(effectCellIds[effectCellId] == null){
								effectCellIds[effectCellId] = "";
							} 
						}	
						this.refreshCellShowValue(effectCellId);
					}
					catch(ex){
						effectCell.isError = true;
						effectCell.note = ex.message;
						this.refreshCellShowValue(effectCellId);
					}									
				}
			}
		}
		
		if(cmnPcr.checkJsonHasChild(effectCellIds)){ 
			this.updateEffectCellValues(effectCellIds, hasExpChange);
		}		
	}
	
	this.runExp = function(cell){
		try{
			window.runningEG = this.eg;
			window.runningEGSheetId = cell.sheetId;
			var runCode = cell.jsCode;
			var value = eval(runCode);
		}
		catch(ex){
			throw ex;
		}
		return value;
	}
	
	//计算没有引用表格的带有公式的单元格
	this.clientCalcAllNoneRefCells = function(){
		var allNoneRefCellIds = new Array();
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);	
			if(cell.isExp){
				var hasRef = this.eg.checkHasReferance(cell.expPartList);
				if(!hasRef){
					var newValue = null;
					try{
						newValue = this.runExp(cell);
						cell.isError = false;
						cell.note = "";
					}
					catch(ex){
						cell.isError = true;
						cell.note = ex.message;
					}						
					cell.value = newValue;
					this.refreshCellShowValue(cellId);
					
					allNoneRefCellIds.push(cellId);
				}
			}
		}
		return allNoneRefCellIds;		
	}
	 	
	//刷新所有的单元格引用，由于行列变化，单元格引用的名称要改变
	this.refreshAllCellReferance = function(){
		this.refreshSheetColRows();
		this.refreshCellValueTypes();
		var needRefreshCellIds = {};
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);
			cell.clearEffectCellId();
		}	
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);
			var newExp = this.eg.reBuildCellExpression(cell);
			if(newExp != null && newExp.length > 0){
				this.updateCellValue(cell, newExp, false);
				this.refreshCellShowValue(cellId);
				needRefreshCellIds[cellId] = "";
			}
		}
		this.updateEffectCellValues(needRefreshCellIds, true, true);
		this.refreshOutEditorText();
	}
	
	//更新完单元格引用后
	this.afterRefreshAllCellReferance = function(cellIds){				
		//刷新单元格的值
		for(var i = 0; i < needRefreshCellIds.length; i++){
			var cellId = needRefreshCellIds[i];
			this.refreshCellShowValue(cellId);			
		}	
	}
		
	this.setCurrentCell = function(sheetId, colId, rowId, isEditExp){  
		var cellId = sheetId + "_" + colId + "_" + rowId;
		this.setCurrentCellByCellId(cellId, isEditExp); 
	}
	
	this.setCurrentCellByCellId = function(cellId, isEditExp){				
		if(this.currentCellId != null && this.currentCellId != cellId){
			var currentEditorId = this.containerId  + "_" + this.currentCellId + "_editor";	
			var currentEditorFillId = this.containerId  + "_" + this.currentCellId + "_editor_fill";
			if(!isEditExp){	
				$("#" + currentEditorId).remove();
			}
			$("#" + currentEditorFillId).remove();
			
			$("#" + this.containerId + "_" + this.currentCellId).removeClass("gridCellInnerDivCurrent"); 
			$("#" + this.containerId + "_" + this.currentCellId).removeAttr("isCurrentCell");  
		}
		if(cellId != null){	
			var cellType = $("#" + this.containerId + "_" + cellId).attr("cellType");
			if(cellType == "normalCell") {
				this.currentCellId = cellId;
				$("#" + this.containerId + "_" + cellId).addClass("gridCellInnerDivCurrent"); 
				$("#" + this.containerId + "_" + cellId).attr("isCurrentCell", true); 
				
				if(!isEditExp){
					var cellElement = $("#" + this.containerId + "_" + cellId);
					var editorParent = $(cellElement);
					var editorId = this.containerId  + "_" + cellId + "_editor";
					var editorFillId = this.containerId  + "_" + cellId + "_editor_fill";
						
					var cellLayoutInfo = this.getCellLayoutInfo(cellId);
					
					if($("#" + editorId).length == 0){ 
						var editorHtml = "<textarea id=\"" + editorId + "\" cellId=\"" + cellId + "\" style=\"z-index:10;top:" + cellLayoutInfo.top +"px;left:" + cellLayoutInfo.left + "px;width:" + cellLayoutInfo.contentWidth + "px;height:" + cellLayoutInfo.contentHeight + "px;\" class=\"cellEditor\"></textarea>";
						$(cellLayoutInfo.parentDiv).append(editorHtml);
						$("#" + editorId).unbind("mousedown", that.moveMouseDown);
						$("#" + editorId).bind("mousedown", that.moveMouseDown);  
					}
					if($("#" + editorFillId).length == 0){
						var fillTop = cellLayoutInfo.top + cellLayoutInfo.contentHeight - 5;
						var fillLeft = cellLayoutInfo.left + cellLayoutInfo.contentWidth - 5;
						var editorFillHtml = "<div id=\"" + editorFillId + "\" cellId=\"" + cellId + "\" class=\"fillCellBtn\" style=\"top:" + fillTop + "px;left:" + fillLeft + "px;\"></div>";
						$(cellLayoutInfo.parentDiv).append(editorFillHtml);
						$("#" + editorFillId).unbind("mousedown", that.moveMouseDown);
						$("#" + editorFillId).bind("mousedown", that.moveMouseDown); 
					}
					$("#" + editorId).focus();
	
					if($("#" + this.containerId).find("div[editing='true']").length == 0){ 
						var cell = this.eg.getCell(cellId);
						var text = that.getCellShowText(cell);					
						$(this.cellOutEditor).val(text);
					}
					this.refreshCurrentName(cellId);
				}
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
	
	this.getCellLayoutInfo = function(cellId){
		var cell = this.eg.getCell(cellId);
		var sheetId = cell.sheetId;
		var sheet = this.eg.allSheets[sheetId]; 
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		var areaSize = this.getAllAeraSize(sheetId);
		var cellTop = this.getTitleRowHeight();
		var cellLeft = this.getTitleColumnWidth(); 
		var cellColIndex = sheet.getColumnIndexById(cell.columnId);
		var cellRowIndex = sheet.getRowIndexById(cell.rowId);
		var endCellRowFrozen = false;
		for(var i = 0; i <= cellRowIndex; i++){
			var row = sheet.allRows[i];  
			if(!row.isFrozen){
				endCellRowFrozen = true;
			}
			if(i < cellRowIndex){				
				cellTop += row.height;
			}
		}
		var endCellColumnFrozen = false;
		for(var j = 0; j <= cellColIndex; j++){
			var col = sheet.allColumns[j]; 
			if(!col.isFrozen){
				endCellColumnFrozen = true;
			}
			if(j < cellColIndex){				
				cellLeft += col.width;
			}
		}
			 
		var cellSize = this.getCellSize(cell, cellColIndex, cellRowIndex);
		var layoutInfo = {
			left: cellLeft - (endCellColumnFrozen ? areaSize.frozenWidth : 0),
			top: cellTop - (endCellRowFrozen ? areaSize.frozenHeight : 0),
			contentWidth: cellSize.contentWidth,
			contentHeight: cellSize.contentHeight,
			cellWidth: cellSize.cellWidth,
			cellHeight: cellSize.cellHeight
		}; 
		if(!endCellRowFrozen){
			if(!endCellColumnFrozen){
				layoutInfo.parentDiv = leftTopFrozenDiv;
			}
			else{
				layoutInfo.parentDiv = topFrozenDiv;
			}
		}
		else{
			if(!endCellColumnFrozen){
				layoutInfo.parentDiv = leftFrozenDiv;
			}
			else{
				layoutInfo.parentDiv = mainDiv;
			}
		} 
		return layoutInfo;
			 
	}
	
	this.refreshOutEditorText = function(){
		if($("#" + this.containerId).find("div[editing='true']").length == 0){ 
			var currentCellElements = $("#" + this.containerId).find("div[isCurrentCell='true']");
			if(currentCellElements.length > 0){
				var currentCellElement = currentCellElements[0];
				var sheetId = $(currentCellElement).attr("sheetId");
				var colId = $(currentCellElement).attr("colId");
				var rowId = $(currentCellElement).attr("rowId");
				var cellId = sheetId + "_" +colId + "_" + rowId;
				var cell = this.eg.getCell(cellId); 
				var text = that.getCellShowText(cell);
				$(this.cellOutEditor).val(text);
			}
		}
	}
			
	this.getCellName = function(cellId){
		var cell = this.eg.getCell(cellId);
		var sheetId = cell.sheetId;
		var sheet = this.eg.allSheets[sheetId];
		var colName = sheet.getColumnNameById($(cell).attr("columnId"));
		var rowIndex = sheet.getRowIndexById($(cell).attr("rowId")) + 1;
		return colName + rowIndex;
	}
			
	this.refreshCurrentName = function(cellId){
		if(cellId != null){
			var cellName = this.getCellName(cellId); 
			$(this.currentCellInfoDiv).text(cellName);
		}
		else{
			$(this.currentCellInfoDiv).text("");
		}
	}

	this.disSelectedAll = function(){ 
		$("#" + this.containerId).find("div[cellType='normalCell']").removeClass("selectedCell");
		$("#" + this.containerId).find("div[cellType='rowTitleCell']").removeClass("rowSelectedCell");
		$("#" + this.containerId).find("div[cellType='colTitleCell']").removeClass("colSelectedCell");
		$("#" + this.containerId).find("div[cellType='gridTitleCell']").removeClass("gridSelectedCell");
	 }
	
	this.checkSelected = function(tdId){ 
		var isSelected = $("#" + tdId).hasClass("selectedCell")
		|| $("#" + tdId).hasClass("rowSelectedCell")
		|| $("#" + tdId).hasClass("colSelectedCell")
		|| $("#" + tdId).hasClass("gridSelectedCell");  
		return isSelected;
	}

	this.getRangeRowIds = function(sheetId, fromRowId, toRowId){
		var sheet = this.eg.allSheets[sheetId];
		var fromRowIndex = sheet.getRowIndexById(fromRowId);
		var toRowIndex = sheet.getRowIndexById(toRowId);
		var allRowIds = new Array();
		if(fromRowIndex > toRowIndex){
			var temp = fromRowIndex;
			fromRowIndex = toRowIndex;
			toRowIndex = temp;
		}
		for(var i = fromRowIndex; i<=toRowIndex; i++){
			var row = sheet.getRowByIndex(i);
			allRowIds.push(row.id);
		}
		return allRowIds;
	}
		
	this.getRangeColumnIds = function(sheetId, fromColId, toColId){
		var sheet = this.eg.allSheets[sheetId];
		var fromColIndex = sheet.getColumnIndexById(fromColId);
		var toColIndex = sheet.getColumnIndexById(toColId);
		var allColIds = new Array();
		if(fromColIndex > toColIndex){
			var temp = fromColIndex;
			fromColIndex = toColIndex;
			toColIndex = temp;
		}
		for(var i = fromColIndex; i<=toColIndex; i++){
			var col = sheet.getColumnByIndex(i);
			allColIds.push(col.id);
		}
		return allColIds;
	}
		
	this.selectRows = function(sheetId, fromRowId, toRowId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		if(this.lastShiftClickTdId != null){
			var lastShiftClickRowId = $("#" + this.lastShiftClickTdId).attr("rowId");
			var lastSelectedRowIds = this.getRangeRowIds(sheetId, fromRowId, lastShiftClickRowId);
			for(var i = 0; i < lastSelectedRowIds.length; i++) {
				var rowId = lastSelectedRowIds[i];
				$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").removeClass("rowSelectedCell");
				$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").removeClass("selectedCell");
			}
		}

		var selectedRowIds = this.getRangeRowIds(sheetId, fromRowId, toRowId);
		for(var i = 0; i < selectedRowIds.length; i++) {
			var rowId = selectedRowIds[i]; 
			$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
			$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
		}
	}

	this.selectColumns = function(sheetId, fromColId, toColId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		if(this.lastShiftClickTdId != null){
			var lastShiftClickColId = $("#" + this.lastShiftClickTdId).attr("colId");
			var lastSelectedColIds = this.getRangeColumnIds(sheetId, fromColId, lastShiftClickColId);
			for(var i = 0; i < lastSelectedColIds.length; i++) {
				var colId = lastSelectedColIds[i];
				$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").removeClass("colSelectedCell");
				$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").removeClass("selectedCell");
			}
		}

		var selectedColIds = this.getRangeColumnIds(sheetId, fromColId, toColId);
		for(var i = 0; i < selectedColIds.length; i++) {
			var colId = selectedColIds[i];
			$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
			$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
		}
	}
	
	this.selectCells = function(sheetId, fromColId, fromRowId, toColId, toRowId){
		if(this.lastShiftClickTdId != null){
			var lastShiftClickColId = $("#" + this.lastShiftClickTdId).attr("colId");
			var lastShiftClickRowId = $("#" + this.lastShiftClickTdId).attr("rowId");
			var lastSelectedColIds = this.getRangeColumnIds(sheetId, fromColId, lastShiftClickColId);
			var lastSelectedRowIds = this.getRangeRowIds(sheetId, fromRowId, lastShiftClickRowId);
			for(var i = 0; i < lastSelectedColIds.length; i++) {
				var colId = lastSelectedColIds[i];
				for(var j = 0; j < lastSelectedRowIds.length; j++) {
					var rowId = lastSelectedRowIds[j];  
					var cellId = sheetId + "_" + colId + "_" + rowId;
					$("#" + this.containerId + "_" + cellId).removeClass("selectedCell");
				}
			}
		}

		var selectedColIds = this.getRangeColumnIds(sheetId, fromColId, toColId);
		var selectedRowIds = this.getRangeRowIds(sheetId, fromRowId, toRowId);
		for(var i = 0; i < selectedColIds.length; i++) {
			var colId = selectedColIds[i];
			for(var j = 0; j < selectedRowIds.length; j++) {
				var rowId = selectedRowIds[j];
				var cellId = sheetId + "_" + colId + "_" + rowId;
				$("#" + this.containerId + "_" + cellId).addClass("selectedCell");
			}
		}
	}
			
	this.selectCell = function(sheetId, tdElementId, shiftKey, ctrlKey, isEditExp){ 
		var colId = $("#" + tdElementId).attr("colId");
		var rowId = $("#" + tdElementId).attr("rowId");
		var cellType = $("#" + tdElementId).attr("cellType"); 
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var sheet = this.eg.allSheets[sheetId];		
		
		this.setCurrentCell(sheetId, colId, rowId, isEditExp);
		
		if(shiftKey){
			this.clearSelectedText();
			if(this.lastClickTdId == null || !this.checkSelected(this.lastClickTdId)){
				switch(cellType){
					case "rowTitleCell":
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
						break;
					case "colTitleCell":
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
						break;
					case "gridTitleCell":
						$("#" + sheetLayoutId).find("td").addClass("gridSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='normalCell']").addClass("selectedCell");
						$("#" + sheetLayoutId).find("div[cellType='colTitleCell']").addClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='rowTitleCell']").addClass("rowSelectedCell");
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
							var rowIndex = sheet.getRowIndexById(rowId);
							result.exp = (rowIndex + 1);
							break;
						case "colTitleCell": 
							var colName = sheet.getColumnNameById(colId);
							result.exp = colName;
							break; 
						case "normalCell": 
							var rowIndex = sheet.getRowIndexById(rowId);
							var colName = sheet.getColumnNameById(colId); 
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
								this.selectRows(sheetId, lastRowId, rowId);
								this.lastShiftClickTdId = tdElementId;
							}
							else if(lastCellType == "colTitleCell"){
								$("#" + sheetLayoutId).find("div[rowId='" + colId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
								$("#" + sheetLayoutId).find("div[rowId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
								this.lastClickTdId = tdElementId;
								this.lastShiftClickTdId = null;
							}
						}
						break;
					case "colTitleCell":
						{
							if(lastCellType == "colTitleCell" || lastCellType == "normalCell"){
								//选中 lastColId和colId之间所有的列
								this.selectColumns(sheetId, lastColId, colId);
								this.lastShiftClickTdId = tdElementId;
							}
							else if(lastCellType == "rowTitleCell"){
								$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
								$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
								this.lastClickTdId = tdElementId;
								this.lastShiftClickTdId = null;
							}
						}
						break; 
					case "normalCell":
						if(lastCellType == "colTitleCell"){
							//选中 lastColId和colId之间所有的列
							this.selectColumns(sheetId, lastColId, colId);
							this.lastShiftClickTdId = tdElementId;
						}
						else if(lastCellType == "rowTitleCell"){
							//选中lastRowId和rowId之间所有的行
							this.selectRows(sheetId, lastRowId, rowId);
							this.lastShiftClickTdId = tdElementId;
						}
						else if(lastCellType == "normalCell"){
							//二者间的所有单元格
							this.selectCells(sheetId, lastColId, lastRowId, colId, rowId);
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
									var lastRowIndex = sheet.getRowIndexById(lastRowId);
									var rowIndex = sheet.getRowIndexById(rowId);
									result.exp = (lastRowIndex + 1) + ":" + (rowIndex + 1);
								}
								else if(lastCellType == "colTitleCell"){
									var colName = sheet.getColumnNameById(colId);
									result.exp = colName + ":" + colName;
								}
							}
							break;
						case "colTitleCell": 
							{
								if(lastCellType == "colTitleCell" || lastCellType == "normalCell"){ 
									var lastColName = sheet.getColumnNameById(lastColId);
									var colName = sheet.getColumnNameById(colId);
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
								var lastColName = sheet.getColumnNameById(lastColId);
								var colName = sheet.getColumnNameById(colId);
								result.exp = lastColName + ":" + colName;
							}
							else if(lastCellType == "rowTitleCell"){
								var lastRowIndex = sheet.getRowIndexById(lastRowId);
								var rowIndex = sheet.getRowIndexById(rowId);
								result.exp = (lastRowIndex + 1) + ":" + (rowIndex + 1);
							}
							else if(lastCellType == "normalCell"){
								var lastColName = sheet.getColumnNameById(lastColId);
								var colName = sheet.getColumnNameById(colId);
								var lastRowIndex = sheet.getRowIndexById(lastRowId);
								var rowIndex = sheet.getRowIndexById(rowId);
								result.exp = (lastColName == colName && lastRowIndex == rowIndex)? (lastColName + (lastRowIndex + 1)) : (lastColName + (lastRowIndex + 1) + ":" + colName + (rowIndex + 1));
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
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").removeClass("rowSelectedCell");
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").removeClass("selectedCell");
						break;
					case "colTitleCell":
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").removeClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").removeClass("selectedCell");
						break;
					case "gridTitleCell":
						$("#" + sheetLayoutId).find("div[cellType='gridTitleCell']").removeClass("gridSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='normalCell']").removeClass("selectedCell");
						$("#" + sheetLayoutId).find("div[cellType='colTitleCell']").removeClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='rowTitleCell']").removeClass("rowSelectedCell");
						break;
					case "normalCell":
						$("#" + tdElementId).removeClass("selectedCell");
						break;
				} 
			}
			else {
				switch(cellType){
					case "rowTitleCell":
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
						$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
						break;
					case "colTitleCell":
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
						break;
					case "gridTitleCell":
						$("#" + sheetLayoutId).find("div[cellType='gridTitleCell']").addClass("gridSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='normalCell']").addClass("selectedCell");
						$("#" + sheetLayoutId).find("div[cellType='colTitleCell']").addClass("colSelectedCell");
						$("#" + sheetLayoutId).find("div[cellType='rowTitleCell']").addClass("rowSelectedCell");
						break;
					case "normalCell":
						$("#" + tdElementId).addClass("selectedCell");
						break;
				}
				if(isEditExp) {
					var result = {operateType: "appendExp", exp: ""};
					switch(cellType){
						case "rowTitleCell": 
							var rowIndex = sheet.getRowIndexById(rowId);
							result.exp = (rowIndex + 1) + ":" + (rowIndex + 1);
							break;
						case "colTitleCell": 
							var colName = sheet.getColumnNameById(colId);
							result.exp = colName + ":" + colName;
							break; 
						case "normalCell": 
							var rowIndex = sheet.getRowIndexById(rowId);
							var colName = sheet.getColumnNameById(colId); 
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
					$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='rowTitleCell']").addClass("rowSelectedCell");
					$("#" + sheetLayoutId).find("div[rowId='" + rowId + "'][cellType='normalCell']").addClass("selectedCell");
					break;
				case "colTitleCell":
					$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='colTitleCell']").addClass("colSelectedCell");
					$("#" + sheetLayoutId).find("div[colId='" + colId + "'][cellType='normalCell']").addClass("selectedCell");
					break;
				case "gridTitleCell":
					$("#" + sheetLayoutId).find("div[cellType='gridTitleCell']").addClass("gridSelectedCell");
					$("#" + sheetLayoutId).find("div[cellType='normalCell']").addClass("selectedCell");
					$("#" + sheetLayoutId).find("div[cellType='colTitleCell']").addClass("colSelectedCell");
					$("#" + sheetLayoutId).find("div[cellType='rowTitleCell']").addClass("rowSelectedCell");
					break;
				case "normalCell":
					$("#" + tdElementId).addClass("selectedCell"); 
					break;
			}
			if(isEditExp) {
				var result = {operateType: "replaceExp", exp: ""};
				switch(cellType){
					case "rowTitleCell": 
						var rowIndex = sheet.getRowIndexById(rowId);
						result.exp = (rowIndex + 1) + ":" + (rowIndex + 1);
						break;
					case "colTitleCell": 
						var colName = sheet.getColumnNameById(colId);
						result.exp = colName + ":" + colName;
						break; 
					case "normalCell": 
						var rowIndex = sheet.getRowIndexById(rowId);
						var colName = sheet.getColumnNameById(colId); 
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
		var sheetId = $(scrollDiv).parent().parent().parent().attr("sheetId");
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
	    var scrollLeft = scrollDiv.scrollLeft;   
	    $("#" + sheetLayoutId).find("div[name='topFrozenDiv']").css({left: 0 - scrollLeft});   
	    var scrollTop = scrollDiv.scrollTop; 
	    $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']").css({top: 0 - scrollTop});  
	} 
	
	//展示表格
	this.show = function(p){
		this.layout();
		
		this.setPageAndSheetTitleVisible(this.eg.hasSheetTitle, this.eg.hasEditBar, this.eg.hasPageTitle);
		
		//绑定滚动事件
		$("#" + this.containerId).find("div[name='mainContainerDiv']").scroll(function(){
			that.mainDivScroll(this);
		});
		
		this.bindEvent();
		
		//选中第一个sheet页
				
	}
	
	this.checkIsEditExpression = function(){				
		//判断当前正在编辑的单元格
		var editingCells = $("#" + that.containerId).find("div[editing='true']");
		if(editingCells.length > 0){
			var editingCell = editingCells[0];
			var sheetId = $(editingCell).attr("sheetId");
			var rowId = $(editingCell).attr("rowId");
			var colId = $(editingCell).attr("colId");
			var cellId = sheetId + "_" + colId + "_" + rowId;
			var inputElement = $("#" + that.containerId).find("textarea[cellId='" + cellId + "']");
			var editingValue = $(inputElement).val();
			if(editingValue.length > 0 && editingValue.substr(0, 1) == "="){
				//如果是以=开头，那么点击操作是为了引用
				if(	$(that.cellOutEditor).attr("prefixExp") == null){
					var currentInputElement = ($(that.cellOutEditor).attr("enableEditor") == "in") ? $("#" + that.containerId).find("textarea[cellId='" + cellId + "']")[0] : this.cellOutEditor;
					this.refreshEditingExpPosition(currentInputElement);
				}
				return true;
			}
			else {	
				//如果不是以=开头，那么结束编辑
				return false;
			}
		}
		else{
			return false;
		}
	}
	
	this.refreshEditingExpression = function(p){
		if(p.exp != null && p.exp.length != 0){
			var editingCells = $("#" + that.containerId).find("div[editing='true']");
			if(editingCells.length > 0){
				var editingCell = editingCells[0];
				var sheetId = $(editingCell).attr("sheetId");
				var rowId = $(editingCell).attr("rowId");
				var colId = $(editingCell).attr("colId");
				var cellId = sheetId + "_" + colId + "_" + rowId;
				var inInputElement = $("#" + that.containerId).find("textarea[cellId='" + cellId + "']"); 
				var inputElement = ($(that.cellOutEditor).attr("enableEditor") == "in") ? inInputElement[0] : this.cellOutEditor;
	           	var prefixExp = $(this.cellOutEditor).attr("prefixExp") == null ? "" : $(this.cellOutEditor).attr("prefixExp");
	           	var postfixExp = $(this.cellOutEditor).attr("postfixExp") == null ? "" : $(this.cellOutEditor).attr("postfixExp");
	            var clickedExp = $(this.cellOutEditor).attr("clickedExp") == null ? "" : $(this.cellOutEditor).attr("clickedExp");  

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
	            if (inputElement.createTextRange) {//IE 
	                var range = inputElement.createTextRange();  
	                range.collapse(true);  
	                range.moveStart('character', currentIndex);  
	                range.moveEnd('character', currentIndex);  
	                range.select();
	            } 
	            else if (inputElement.setSelectionRange) {  
	           		inputElement.setSelectionRange(currentIndex, currentIndex);  
	            }  
	           	$(inputElement).focus();  
	           	
	           	$(this.cellOutEditor).removeAttr("autoChange");  
			}
		}
	}
			
	this.bindEvent = function(){
	
		$("#" + this.containerId).tabs({
     		onSelect: function(title, index){
     			var tab = $("#" + that.containerId).tabs("getTab", index)[0];
     			var sheetId = $(tab).attr("sheetId");
     			that.currentSheetId = sheetId;
        	}
		}); 
		
		$(this.cellOutEditor).focus(function(e){
			$(that.cellOutEditor).attr("enableEditor","out");
		});
		
		$(this.cellOutEditor).change(function(e){
		/*
			var autoChange = $(that.cellOutEditor).attr("autoChange") == "true";
			if(!autoChange){
	           	$(that.cellOutEditor).removeAttr("prefixExp");
	           	$(that.cellOutEditor).removeAttr("postfixExp");	
	           	$(that.cellOutEditor).removeAttr("clickedExp");
			}
			*/
		});
		
		$(this.cellOutEditor).select(function(e){ 
			setTimeout(function(){
				that.refreshEditingExpPosition($(that.cellOutEditor)[0]);
			}, 100);
		}); 
			
		$(this.cellOutEditor).keyup(function(e){
			var text = $(this).val();
			var editingCells = $("#" + that.containerId).find("div[editing='true']");
			if(editingCells.length > 0){
				var editingCell = editingCells[0];
				var editingCellEditorId = $(editingCell).attr("id") + "_editor";
				$("#" + editingCellEditorId).val(text);
			}
		});
		$(this.cellOutEditor).keydown(function(e){
			var keyCode = e.keyCode > 127 ? e.keyCode - 127 : e.keyCode;
			var editingCells = $("#" + that.containerId).find("div[editing='true']");
			if(editingCells.length > 0){
				var editingCell = editingCells[0];
				var sheetId = $(editingCell).attr("sheetId");
				var rowId = $(editingCell).attr("rowId");
				var colId = $(editingCell).attr("colId");
				switch(keyCode){
					case 27:{
						//点击esc，取消编辑，值恢复到编辑前状态
						that.endCellEdit(false);
						that.cancelBubble(e);
						var cellCtrlId = that.containerId + "_" + sheetId + "_" + colId + "_" + rowId;
						that.selectCell(sheetId, cellCtrlId, false, false, false);
						return false;
					}
					break;
					case 13:{
						if(e.altKey){
							//点击alt+enter，那么换行; 
							var cellId = sheetId + "_" + colId + "_" + rowId; 
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
							that.selectDownCell(sheetId, colId, rowId);
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
					default:{
						var cellId = sheetId + "_" + colId + "_" + rowId; 
						var editorId = that.containerId  + "_" + cellId + "_editor";
						setTimeout(function(){
							that.refreshEditingExpPosition($("#" + editorId)[0]);
						}, 100);
						return true;
					}
				}
			}
			else{
				var currentCells = $("#" + that.containerId).find("div[isCurrentCell='true']");
				if(currentCells.length > 0){
					var currentCell = currentCells[0]; 
					var sheetId = $(currentCell).attr("sheetId");
					var rowId = $(currentCell).attr("rowId");
					var colId = $(currentCell).attr("colId");
					if(keyCode == 8 || keyCode == 13 || keyCode == 32 || keyCode == 46 || keyCode == 113 || (keyCode >=48 && keyCode <= 111)){		 							
						that.beginCellEdit(sheetId + "_" + colId + "_" + rowId, false);
					}
				}
			}
		});
		
		$("#" + this.containerId).click(function(e){
			var eTarget = e.target;		
			var eventElement = $(eTarget); 
			var isInCell = false;
			while(eventElement.length != 0){
				if($(eventElement).hasClass("normalCell") || $(eventElement).hasClass("titleCell")){
					isInCell = true;
					break;
				}
				else{
		  			eventElement = $(eventElement).parent();
	  			}
			} 
			if($(eventElement).find("div.gridCellInnerDivEditing").length == 0){				
				if(isInCell){ 
					var sheetId = that.currentSheetId;
					var rowId = eventElement.attr("rowid");
					var colId = eventElement.attr("colid");
					var cellId = sheetId + "_" + colId + "_" + rowId;
					if(that.currentCellId != cellId){				
						var isEditExp = that.checkIsEditExpression();	
						if(!isEditExp){
							that.endCellEdit(true);
						}			
						var id = $(eventElement).attr("id"); 						
						var resultExp = that.selectCell(sheetId, id, e.shiftKey, e.ctrlKey, isEditExp); 
						if(isEditExp){
							that.changeExpBySelect(sheetId, resultExp);
							/*
							var editingCellElements = $("#" + that.containerId).find("div[editing='true']");
							if(editingCellElements.length > 0){				
								var editingCellSheetId = $(editingCellElements[0]).attr("sheetId");
								if(sheetId != editingCellSheetId){
									var sheet = that.eg.allSheets[sheetId];
									var sheetNameInCell = that.eg.formatSheetNameInCellRef(sheet.name);
									result.exp = sheetNameInCell + "!" + result.exp;
								} 
							}
						
							//将本次选择得到的Cells信息放置到表达式中
							that.refreshEditingExpression(result);*/
						} 
					}
				}		
			}			
			return false;
		}); 
		
		$("#" + this.containerId).attr('tabindex', 1).keydown(function(e){
			var keyCode = e.keyCode > 127 ? e.keyCode - 127 : e.keyCode;
			if(that.currentCellId != null){
				var currentCells = $("#" + that.containerId + "_" + that.currentCellId);
				if(currentCells.length > 0){							
					var currentCell = currentCells[0];
					var sheetId = $(currentCell).attr("sheetId");
					var rowId = $(currentCell).attr("rowId");
					var colId = $(currentCell).attr("colId");			
					if(keyCode == 32 || keyCode == 113 || (keyCode >= 48 && keyCode <= 111)){
						//当前单元格不是编辑状态
						if($(currentCell).attr("editing") != "true"){									
							//没有其他的单元格处在编辑状态
							if($("#" + that.containerId).find("div[editing='true']").length == 0){									
								that.beginCellEdit(sheetId + "_" + colId + "_" + rowId, true);
								return true;
							}
							else{
								return true;
							}
						}
					}
					else {
						switch(keyCode){
							case 27:{
								//点击esc，取消编辑，值恢复到编辑前状态
								that.endCellEdit(false);
								var cellCtrlId = that.containerId + "_" + sheetId + "_" + colId + "_" + rowId;
								that.selectCell(sheetId, cellCtrlId, false, false, false);
							}
							break;
							case 38:{
								that.selectUpCell(sheetId, colId, rowId);
							}
							return false;
							case 40:{
								that.selectDownCell(sheetId, colId, rowId);
							}
							return false;
							case 39:{
								that.selectRightCell(sheetId, colId, rowId);
							}
							return false;
							case 37:{
								that.selectLeftCell(sheetId, colId, rowId);
							}
							return false;
							case 13:{
								if(e.shiftKey){
									that.selectUpCell(sheetId, colId, rowId);
								}
								else{
									that.selectDownCell(sheetId, colId, rowId);
								}
								
							}
							return false;
							case 9:{
								if(e.shiftKey){
									that.selectLeftCell(sheetId, colId, rowId);
								}
								else{
									that.selectRightCell(sheetId, colId, rowId);
								}
							}
							return false;
							case 46:{		
								if($(currentCell).attr("editing") != "true"){									
								//没有其他的单元格处在编辑状态
									if($("#" + that.containerId).find("div[editing='true']").length == 0){			
										that.cellClearContent();
										return false;
									}
								}
							}
							return true;
						}
					}
				}
			}
			else{
				//当前单元格为空时，即焦点不在单元格上，可能是选中的多行多列				
				switch(keyCode){
					case 46:{
							if($("#" + that.containerId).find("div[editing='true']").length == 0){			
								that.cellClearContent();
								return false;
							}
					} 
					return true;
				}				
			}
		}); 
		
		$("#" + this.containerId).dblclick(function(e){
			var eTarget = e.target;		
			var eventElement = $(eTarget); 
			var isInCell = false; 
			var cellId = "";
			var isEditorEditing = false;
			while(eventElement.length != 0){
				if($(eventElement).hasClass("cellEditor")){
					cellId = $(eventElement).attr("cellId");
					isEditorEditing = $(eventElement).hasClass("gridCellEditorEditing");					
					isInCell = true;
					break;
				}
				else if($(eventElement).hasClass("normalCell")){
					var sheetId = $(eventElement).attr("sheetId");
					var colId = $(eventElement).attr("colId");
					var rowId = $(eventElement).attr("rowId");
					var cellId = sheetId + "_" + colId + "_" + rowId;
					isInCell = true;
					break;
				}
				else{
		  			eventElement = $(eventElement).parent();
	  			}
			}
			if(isInCell){
				var isEditExp = that.checkIsEditExpression();
				if(!isEditorEditing && !isEditExp && isInCell){  
					that.endCellEdit(true);
					that.beginCellEdit(cellId, false);
				}   
				return false;
			}
			else{
				return true;
			}
		});
		
		$("#" + this.containerId).bind("touchstart", function(e){ 
			that.isTouchMoving = false; 
			return true;
		});
		
		$("#" + this.containerId).bind("touchmove", function(e){ 
			that.isTouchMoving = true; 
			return true;
		});
		
		$("#" + this.containerId).bind("touchend", function(e){  
			if(!that.isTouchMoving){			
				var eTarget = e.target;		
				var eventElement = $(eTarget); 
				var isInCell = false;
				var isEditing = false;
				var cellId = null;
				var sheetId = that.currentSheetId;
				while(eventElement.length != 0){				
					if($(eventElement).hasClass("cellEditor")){
						isEditing = $(eventElement).hasClass("gridCellEditorEditing");						
						cellId = $(eventElement).attr("cellId"); 				
						isInCell = true;
						break;
					}
					else if($(eventElement).hasClass("normalCell")){
						var rowId = eventElement.attr("rowid");
						var colId = eventElement.attr("colid");
						var cellId = sheetId + "_" + colId + "_" + rowId;
						isInCell = true;
						break;
					}
					else{
			  			eventElement = $(eventElement).parent();
		  			}
				}
				if(isInCell){
					if(that.currentCellId != cellId){				
						var isEditExp = that.checkIsEditExpression();	
						if(!isEditExp){
							that.endCellEdit(true);
						}	 	
						var id = $(eventElement).attr("id"); 						
						var resultExp = that.selectCell(sheetId, id, e.shiftKey, e.ctrlKey, isEditExp); 
						if(isEditExp){
							that.changeExpBySelect(sheetId, resultExp); 
						} 
						else{								
							that.beginCellEdit(cellId, false);
						}
					}
					else if(!isEditing){
						that.beginCellEdit(cellId, false);
					}
					return true;
				} 
			}
			return true;
		});
		
		$("#" + this.containerId).bind("contextmenu", function(e){ 
			if(cmnPcr.checkMouseRightButton(e)){		
				var eTarget = e.target;	
				var cellType = null;
				var tdId = null;				
				var eventElement = $(eTarget); 
				var isInCell = false; 
				var isEditorEditing = false;
				while(eventElement!=null && eventElement.length != 0){
					if($(eventElement[0]).hasClass("cellEditor")){
						tdId = that.containerId + "_" + $(eventElement[0]).attr("cellId"); 
						isEditorEditing = $(eventElement[0]).hasClass("gridCellEditorEditing");
						cellType = "normalCell";
						break;
					}
					else{
						cellType = $(eventElement[0]).attr("cellType");
						if(cellType != null && cellType != ""){ 
							tdId = $(eventElement[0]).attr("id"); 
							break;
						}
						else{
				  			eventElement = $(eventElement[0]).parent().length == 0 ? null : $(eventElement[0]).parent();
			  			}
		  			}
				}
				if(eventElement != null && eventElement.length != 0){
					if(tdId != null){
						var selected = that.checkSelected(tdId);
						if(!selected) {
							that.selectCell(that.currentSheetId, tdId, e.shiftKey, e.ctrlKey, false)
						}
						var menuDivId = "";
						if(!isEditorEditing){
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
							$("#" + menuDivId).menu('show', {
								left: e.clientX, 
								top: e.clientY 
							}); 
							return false;
						}
						else{
							return true; 
						}
					}
				}
			}
		});
		 
		$("#" + this.containerId).find("ul[class='tabs']").bind("contextmenu", function(e){ 
			if(cmnPcr.checkMouseRightButton(e)){
				var eTarget = e.target;
				var element = $(eTarget);
				$(element).click();
				var menuDivId = "";
				if($(element).hasClass("tabs")){
					menuDivId = "sheetAllMenu";
				}
				else{
					menuDivId = "sheetMenu";
				}  
				$("#" + menuDivId).menu('show', {
					left: e.clientX, 
					top: e.clientY 
				})
				return false; 
			} 
		});
		
		this.bindMouseResizeAndSelectEvent();
	}
	
	this.bindMouseResizeAndSelectEvent = function(){
		$("#" + that.containerId).find(".titleCellRightResize").unbind("mousedown", function(ev){ that.moveMouseDown(ev);});
		$("#" + that.containerId).find(".gridCellInnerDiv").unbind("mousedown", function(ev){ that.moveMouseDown(ev);}); 
		$("#" + that.containerId).find(".titleCellBottomResize").unbind("mousedown", function(ev){ that.moveMouseDown(ev);});
		$("#" + that.containerId).find(".titleCellRightResize").bind("mousedown", function(ev){ that.moveMouseDown(ev);}); 
		$("#" + that.containerId).find(".titleCellBottomResize").bind("mousedown", function(ev){ that.moveMouseDown(ev);}); 
		$("#" + that.containerId).find(".gridCellInnerDiv").bind("mousedown", function(ev){ that.moveMouseDown(ev);}); 
		$(document).unbind("mouseup", function(ev){ that.moveMouseUp(ev);});
		$(document).bind("mouseup", function(ev){ that.moveMouseUp(ev);}); 
		$(document).unbind("mousemove", function(ev){ that.moveMouseMove(ev);});
		$(document).bind("mousemove", function(ev){ that.moveMouseMove(ev);}); 
	}
	
	this.moveMouseDown = function(e){
		if(cmnPcr.checkMouseLeftButton(e)){
			var sheetId = that.currentSheetId;
			var sheet = that.eg.allSheets[sheetId];
			var resizeType = null; 
			var eTarget = e.target;
			if($(eTarget).hasClass("titleCellRightResize")){ 
				var colId = $(eTarget).parent().attr("colId");
				var col = sheet.getColumnById(colId);
				that.resizingInfo = {
					x: e.screenX, 
					element: this,
					sheet: sheet,
					column: col,
					newWidth: col.width,
					operateType: "columnResize"
				}; 
				
				if(that.resizingInfo != null){ 
					//防止文字选中
					eTarget.selectstart = function(){
						return false;
					}  
				} 
				return false;
			}
			else if($(eTarget).hasClass("titleCellBottomResize")){  
				var rowId = $(eTarget).parent().attr("rowId");
				var row = sheet.getRowById(rowId);
				that.resizingInfo = { 
					y: e.screenY,
					element: this,
					sheet: sheet,
					row: row,
					newHeight: row.height,
					operateType: "rowResize"
				}; 
				
				if(that.resizingInfo != null){ 
					//防止文字选中
					eTarget.selectstart = function(){
						return false;
					}  
				} 
				return false;
			}
			else if($(eTarget).hasClass("gridCellInnerDiv") || $(eTarget).parent().hasClass("gridCellInnerDiv") ){
				if($(eTarget).parent().hasClass("gridCellInnerDiv")){
					eTarget = $(eTarget).parent()[0];
				}
				var tdElementId = $(eTarget).parent().attr("id");
				var isEditExp = that.checkIsEditExpression();	
				var rowId = $(eTarget).parent().attr("rowid");
				var colId = $(eTarget).parent().attr("colid");
				var row = sheet.getRowById(rowId);
				that.resizingInfo = { 
					fromRowId: rowId,
					fromColId: colId,
					sheet: sheet,
					operateType: "cellSelect",
					isEditExp: isEditExp
				}; 		
				if(!isEditExp){
					that.endCellEdit(true);
				}			
				var resultExp = that.selectCell(sheetId, tdElementId, e.shiftKey, e.ctrlKey, isEditExp);
				if(isEditExp){
					//that.changeExpBySelect(sheetId, resultExp);
				}
				
				if(that.resizingInfo != null){ 
					//防止文字选中
					eTarget.selectstart = function(){
						return false;
					}  
				} 
				return true;
			}
			else if($(eTarget).hasClass("cellEditor") && !$(eTarget).hasClass("gridCellEditorEditing")){ 
				var cellId = $(eTarget).attr("cellid"); 
				var tdElementId = that.containerId + "_" + cellId;
				var cell = that.eg.getCell(cellId);		 
				that.resizingInfo = { 
					fromRowId: cell.rowId,
					fromColId: cell.columnId,
					sheet: sheet,
					operateType: "cellSelect",
					isEditExp: false
				}; 	
				that.selectCell(sheetId, tdElementId, e.shiftKey, e.ctrlKey, false); 
				return true;
			}
			else if($(eTarget).hasClass("fillCellBtn")){  
				var cellId = $(eTarget).attr("cellid");
				var tdElementId = that.containerId + "_" + cellId;
				var cell = that.eg.getCell(cellId);		   
				that.resizingInfo = {
					fromRowId: cell.rowId,
					fromColId: cell.columnId,
					fromCellId: cellId,
					x: e.screenX,
					y: e.screenY,
					sheet: sheet,
					operateType: "fillCell" 
				}; 	
				that.endCellEdit(true); 
				that.selectCell(sheetId, tdElementId, false, false, false);
				return true;
			} 
		} 
		that.resizingInfo = null; 
		e.bubbles = true;
		e.cancelable = false;
		return true; 
	}
	
	this.moveMouseUp = function(e){
		if(that.resizingInfo != null){ 
			var eTarget = e.target;
			switch(that.resizingInfo.operateType){
				case "cellSelect":{
					if(that.resizingInfo.isEditExp){
						var sheetId = that.resizingInfo.sheet.id;
						var toColId = that.resizingInfo.toColId;
						var toRowId = that.resizingInfo.toRowId;					
						var tdElementId = that.containerId + "_" + sheetId + "_" + toColId + "_" + toRowId;
						var resultExp = that.selectCell(that.resizingInfo.sheet.id, tdElementId, true, false, true);
						that.changeExpBySelect(sheetId, resultExp);
					}
					break;
				}
				case "fillCell":{
					$("#" + that.containerId).find(".lastFillValueDisplay").remove();
					that.fillCellsByMouse(that.resizingInfo.sheet, 
						that.resizingInfo.fromRowId, 
						that.resizingInfo.fromColId, 
						that.resizingInfo.toRowId, 
						that.resizingInfo.toColId, 
						that.resizingInfo.fillDirect, 
						e.ctrlKey);
					break;
				}
			}
			that.resizingInfo = null;	
			return false;
		}	
		else{
			return true;
		}	
	}
	
	this.fillCellsByMouse = function(sheet, fromRowId, fromColId, toRowId, toColId, fillDirect, ctrlKey){
		if(fromRowId != toRowId || fromColId != toColId){	
			var fromCell = that.eg.getCell(that.resizingInfo.fromCellId);
			var isForward = false;
			var filledCellObjArray = new Array();
			switch(fillDirect){
				case "horizontal":{
					var rowId = fromRowId;
					var rowIndex = sheet.getRowIndexById(rowId);
					var fromColIndex = sheet.getColumnIndexById(fromColId);
					var toColIndex = sheet.getColumnIndexById(toColId);
					isForward = toColIndex > fromColIndex;
					if(isForward){
						for(var colIndex = fromColIndex + 1; colIndex <= toColIndex; colIndex++){
							var colId = sheet.getColumnIdByIndex(colIndex);
							var cellId = sheet.id + "_" + colId + "_" + rowId;
							filledCellObjArray.push({
								cellId: cellId,
								rowIndex: rowIndex,
								colIndex: colIndex
							});
						}
					}
					else{
						for(var colIndex = fromColIndex - 1; colIndex >= toColIndex; colIndex--){
							var colId = sheet.getColumnIdByIndex(colIndex);
							var cellId = sheet.id + "_" + colId + "_" + rowId;
							filledCellObjArray.push({
								cellId: cellId,
								rowIndex: rowIndex,
								colIndex: colIndex
							});
						}
					}
				}
				break;
				case "vertical":{
					var colId = fromColId;
					var colIndex = sheet.getColumnIndexById(colId);
					var fromRowIndex = sheet.getRowIndexById(fromRowId);
					var toRowIndex = sheet.getRowIndexById(toRowId);
					isForward = toRowIndex > fromRowIndex;
					if(isForward){
						for(var rowIndex = fromRowIndex + 1; rowIndex <= toRowIndex; rowIndex++){
							var rowId = sheet.getRowIdByIndex(rowIndex);
							var cellId = sheet.id + "_" + colId + "_" + rowId;
							filledCellObjArray.push({
								cellId: cellId,
								rowIndex: rowIndex,
								colIndex: colIndex
							});
						}
					}
					else{
						for(var rowIndex = fromRowIndex - 1; rowIndex >= toRowIndex; rowIndex--){
							var rowId = sheet.getRowIdByIndex(rowIndex);
							var cellId = sheet.id + "_" + colId + "_" + rowId;
							filledCellObjArray.push({
								cellId: cellId,
								rowIndex: rowIndex,
								colIndex: colIndex
							});
						}
					}
				}
				break;
			}		
			
			var filledCellIdToValues = {}; 
			if(fromCell.isExp){
				var tempExpression = fromCell.expression;
				for(var i = 0; i < filledCellObjArray.length; i++){
					var filledCellObj = filledCellObjArray[i];  
					var rowStep = fillDirect == "horizontal" ? 0 : (isForward ? (i + 1) : (0 - i - 1));
					var colStep = fillDirect == "vertical" ? 0 : (isForward ? (i + 1) : (0 - i - 1));
					var newExp = this.eg.reBuildCellExpressionAfterPaste(fromCell, rowStep, colStep);
					filledCellObj.newExp = newExp;
					filledCellIdToValues[filledCellObj.cellId] = filledCellObj;
				}				
			}
			else{
				if(ctrlKey && fromCell.cellValueType == valueType.decimal && fromCell.value != null){
					//递增或递减
					var tempValue = cmnPcr.strToDecimal(fromCell.value.toString());
					for(var i = 0; i < filledCellObjArray.length; i++){
						var filledCellObj = filledCellObjArray[i];
						tempValue = (isForward) ? tempValue + 1 : tempValue - 1;
						filledCellObj.valueStr = cmnPcr.decimalToStr(tempValue);
						filledCellIdToValues[filledCellObj.cellId] = filledCellObj;
					}
				}
				else{
					//简单的值复制
					for(var i = 0; i < filledCellObjArray.length; i++){
						var filledCellObj = filledCellObjArray[i]; 
						filledCellObj.valueStr = fromCell.getShowText();
						filledCellIdToValues[filledCellObj.cellId] = filledCellObj;
					}
				}
			}
			
			
			that.refreshCellValueTypes();
			for(var cellId in filledCellIdToValues){
				var cell = this.eg.getCell(cellId); 
				cell.expression = "";
				cell.note = null;
				cell.isError = false;
				cell.value = null;
				cell.isExp = fromCell.isExp;
			}	
			
			if(fromCell.isExp){	 
				for(var cellId in filledCellIdToValues){
					var cell = this.eg.getCell(cellId);
					var filledCellObj = filledCellIdToValues[cellId]; 
					that.updateCellValue(cell, filledCellObj.newExp, false);
					that.refreshCellShowValue(cellId);  
					this.refreshCellDisplay(cellId, filledCellObj.colIndex, filledCellObj.rowIndex);
				}
			}
			else{	
				for(var cellId in filledCellIdToValues){
					var cell = this.eg.getCell(cellId);
					var filledCellObj = filledCellIdToValues[cellId];
					that.updateCellValue(cell, filledCellObj.valueStr, false);
					//cell.value = filledCellObj.value; 
					//cell.cellValueType = fromCell.cellValueType;
					that.refreshCellShowValue(cellId);  
					this.refreshCellDisplay(cellId, filledCellObj.colIndex, filledCellObj.rowIndex); 
				}
			}
			
			//that.refreshAllCellReferance();
			that.updateEffectCellValues(filledCellIdToValues, true, true);
			that.refreshOutEditorText();
		}
	} 
	
	this.moveMouseMove = function(e){ 
		if(that.resizingInfo != null && cmnPcr.checkMouseLeftButton(e)){
			var eTarget = e.target;
			if (e.preventDefault) {
				e.preventDefault();
			} 
			switch(that.resizingInfo.operateType){
				case "columnResize":{
		         	var xEnd = e.screenX - that.resizingInfo.x; 
		         	that.resizingInfo.x = e.screenX;
		         	if(xEnd != 0){
			         	var col = that.resizingInfo.column;
			         	var width = that.resizingInfo.newWidth + xEnd > 0 ? that.resizingInfo.newWidth + xEnd : 0;
			         	that.resizingInfo.newWidth = width;
			         	setTimeout(function(){
			     			that.resizeColumnAfterMouseMove();
		     			}, 100); 
		     		}
					return false; 
				}
				case "rowResize":{
		         	var yEnd = e.screenY - that.resizingInfo.y; 
		         	that.resizingInfo.y = e.screenY;
		         	if(yEnd != 0){
			         	var row = that.resizingInfo.row;
			         	var height = that.resizingInfo.newHeight + yEnd > 0 ? that.resizingInfo.newHeight + yEnd : 0;
			         	that.resizingInfo.newHeight = height;
			         	setTimeout(function(){
			     			that.resizeRowAfterMouseMove();
		     			}, 100); 
		     		}
					return false; 
				}
				case "cellSelect":{
					if($(eTarget).hasClass("gridCellInnerDiv")){
						var tdElementId = $(eTarget).parent().attr("id");
						var rowId = $(eTarget).parent().attr("rowid");
						var colId = $(eTarget).parent().attr("colid"); 
			         	if(that.resizingInfo.toRowId != rowId || that.resizingInfo.toColId != colId){
			         		that.resizingInfo.toRowId = rowId;
			         		that.resizingInfo.toColId = colId;  
			         		var sheetId = that.resizingInfo.sheet.id;
							var resultExp = that.selectCell(sheetId, tdElementId, true, false, that.resizingInfo.isEditExp);
							that.resizingInfo.toRowId = rowId;
							that.resizingInfo.toColId = colId;
							if(that.resizingInfo.isEditExp){
								//that.changeExpBySelect(sheetId, resultExp);
							}
			     		}
						return false; 
					}
					else{
						return true;
					}
				}	
				case "fillCell":{
					if($(eTarget).hasClass("gridCellInnerDiv")){
						var fillDirect =  (Math.abs(e.screenX - that.resizingInfo.x) > Math.abs(e.screenY - that.resizingInfo.y)) ? "horizontal" : "vertical";
						that.resizingInfo.fillDirect = fillDirect;
						var tdElementId = $(eTarget).parent().attr("id");
						var toRowId = $(eTarget).parent().attr("rowid");
						var toColId = $(eTarget).parent().attr("colid");  
						var sheet = that.resizingInfo.sheet;
						var lastFillValue = null;
						
						var fromCell = that.eg.getCell(that.resizingInfo.fromCellId);
						if(!fromCell.isExp && fromCell.value != null){
							if(fromCell.cellValueType == valueType.decimal && e.ctrlKey){
								var decimalValue = fromCell.value;
								var stepCount = "";
								switch(fillDirect){
									case "horizontal":{
										var fromColIndex = sheet.getColumnIndexById(fromCell.columnId);
										var toColIndex = sheet.getColumnIndexById(toColId);
										stepCount = toColIndex - fromColIndex;
										toRowId = fromCell.rowId;
									}
									break;
									case "vertical":{
										var fromRowIndex = sheet.getRowIndexById(fromCell.rowId);
										var toRowIndex = sheet.getRowIndexById(toRowId);
										stepCount = toRowIndex - fromRowIndex;
										toColId = fromCell.columnId;
									}
									break;
								}
								lastFillValue = fromCell.value + stepCount;
							}
							else{
								lastFillValue = fromCell.value;
							}
						}
						
						switch(fillDirect){
							case "horizontal":{ 
								toRowId = fromCell.rowId;
							}
							break;
							case "vertical":{ 
								toColId = fromCell.columnId;
							}
							break;
						}
						
						this.resizingInfo.toRowId = toRowId;
						this.resizingInfo.toColId = toColId; 
						
		         		var sheetId = that.resizingInfo.sheet.id;
		         		var toTdElementId = that.containerId + "_" +  sheetId + "_" + toColId + "_" + toRowId;
						that.selectCell(sheetId, toTdElementId, true, false, false);
						
						var lastFillValueDisplayElements = $("#" + that.containerId).find(".lastFillValueDisplay");
						if(lastFillValueDisplayElements.length == 0){
							var displayHtml = "<span class=\"lastFillValueDisplay\"></span>";
							$("#" + that.containerId).append(displayHtml);
							lastFillValueDisplayElements = $("#" + that.containerId).find(".lastFillValueDisplay");
						}
						var lastFillValueDisplayElement = lastFillValueDisplayElements[0];
						var containerOffset = $("#" + that.containerId).offset(); 
						$(lastFillValueDisplayElement).css({
							left: e.clientX - containerOffset.left + 10,
							top: e.clientY - containerOffset.top + 10
						});						
						
						$(lastFillValueDisplayElement).text(cmnPcr.objectToStr(lastFillValue, fromCell.cellValueType));
										
						/* 尚未实现
						先找到填充方向（根据起始和目前单元格的相对位置判断）
						再判断如果是水平填充（垂直填充），那么如果每行水平（垂直）方向上的单元格为一个，那么
							如果是常量，那么判断是否按下了ctrl键，来判断是否是递增的
							如果是公式，那么填充公式（记得判断$）
						再判断如果是水平填充（垂直填充），那么如果每行水平（垂直）方向上的单元格为相邻的两个或两个以上，那么
							如果都是常量，那么按照两个常量的差值递归填充（如果是起始位3个单元格，得找找excel的规律，或者只按照前两个值的递归方式来）
							如果是公式，那么填充公式（记得判断$）,且按照相对位置填充
							*/
						return false; 
					}	
					else{
						return true;
					}		
				}
			} 
		}	
		else{
			return true;
		}
	} 
	
	this.resizingInfo = null;
	
	this.resizeColumnAfterMouseMove = function(){
		var col = that.resizingInfo.column;
		var newWidth = that.resizingInfo.newWidth;
		if(newWidth != col.width){
 			that.resizeColumns(that.resizingInfo.sheet.id, [col.id], newWidth);
		}
	}
	
	this.resizeRowAfterMouseMove = function(){
		var row = that.resizingInfo.row;
		var newHeight = that.resizingInfo.newHeight;
		if(newHeight != row.height){
 			that.resizeRows(that.resizingInfo.sheet.id, [row.id], newHeight);
		}
	}
	
	this.changeExpBySelect = function(sheetId, resultExp){
		var editingCellElements = $("#" + that.containerId).find("div[editing='true']");
		if(editingCellElements.length > 0){				
			var editingCellSheetId = $(editingCellElements[0]).attr("sheetId");
			if(sheetId != editingCellSheetId){
				var sheet = that.eg.allSheets[sheetId];
				var sheetNameInCell = that.eg.formatSheetNameInCellRef(sheet.name);
				result.exp = sheetNameInCell + "!" + resultExp.exp;
			} 
		}
	
		//将本次选择得到的Cells信息放置到表达式中
		that.refreshEditingExpression(resultExp);
	}
	
	this.selectTextInElement = function(inputElement, position){
		if (inputElement.setSelectionRange) {  
       		inputElement.setSelectionRange(position, position);
        }
        else if (inputElement.createTextRange) {//IE 
            var range = inputElement.createTextRange();  
            range.collapse(true);  
            range.moveStart('character', position);  
            range.moveEnd('character', position);  
            range.select();
        } 
	}
			
	//计算各个区域的大小
	this.getAllAeraSize = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];	
		//计算各个区域的高度宽度
		var frozenHeight = this.getTitleRowHeight();
		var frozenWidth = this.getTitleColumnWidth();
		var totalHeight = frozenHeight;
		var totalWidth = frozenWidth;

		var endColFrozen = false;
		for(var i = 0; i < sheet.allColumns.length; i++){
			var col = sheet.allColumns[i];
			if(!col.isFrozen){
				endColFrozen = true;
			}
			if(!endColFrozen){
				frozenWidth = frozenWidth + col.width;
			} 
			totalWidth = totalWidth + col.width; 
		}
		
		var endRowFrozen = false;
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i];
			if(!row.isFrozen){
				endRowFrozen = true;
			}
			if(!endRowFrozen){
				frozenHeight = frozenHeight + row.height;
			} 
			totalHeight = totalHeight + row.height; 
		}
		return {
			frozenHeight: frozenHeight,
			frozenWidth: frozenWidth,
			totalHeight: totalHeight,
			totalWidth: totalWidth
		};
	}
				
	//重新命名所有的行名
	this.refreshAllRowNames = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var allRowTitleCells = $("#" + sheetLayoutId).find("div[cellType='rowTitleCell']");
		for(var i = 0; i < allRowTitleCells.length; i++) {
			var rowTitleCell = allRowTitleCells[i]; 
			var rowId = $(rowTitleCell).attr("rowId");
			var rowName = sheet.getRowNameById(rowId);
			$(rowTitleCell).find("span").text(rowName);
		}
	}
				
	//重新命名所有的列名
	this.refreshAllColumnNames = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var allColTitleCells = $("#" + sheetLayoutId).find("div[cellType='colTitleCell']");
		for(var i = 0; i < allColTitleCells.length; i++) {
			var colTitleCell = allColTitleCells[i];
			var colId = $(colTitleCell).attr("colId");
			var colName = sheet.getColumnNameById(colId);
			$(colTitleCell).find("span").text(colName);
		}
	}
	
	this.getSheetLayoutControlId = function(sheetId){
		return this.containerId + "_" + sheetId;
	}
						
	//重新设置宽度
	this.resizeGridLayout = function(sheetId){
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var areaSize = this.getAllAeraSize(sheetId);
					
		//计算各个区域的高度宽度
		var frozenHeight = areaSize.frozenHeight;
		var frozenWidth = areaSize.frozenWidth;
		var totalHeight = areaSize.totalHeight;
		var totalWidth = areaSize.totalWidth;
		
		var centerPanel = $("#" + sheetLayoutId).layout("panel", "center")[0];
		var panelWidth = $(centerPanel).width();
		var panelHeight = $(centerPanel).height();
		
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
 
		//leftTopFrozenContainerDiv 高度 宽度 
		var leftTopFrozenContainerDiv = $("#" + sheetLayoutId).find("div[name='leftTopFrozenContainerDiv']")[0];
		$(leftTopFrozenContainerDiv).css({
			height: frozenHeight + "px", 
			width: frozenWidth + "px"
		});
		
		//leftTopFrozenDiv 高度 宽度 
		var leftTopFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		$(leftTopFrozenDiv).css({
			height: frozenHeight + "px", 
			width: frozenWidth + "px"
		});
		 
		//topFrozenContainerDiv 高度 宽度 
		var topFrozenContainerDiv = $("#" + sheetLayoutId).find("div[name='topFrozenContainerDiv']")[0];
		$(topFrozenContainerDiv).css({
			left: frozenWidth + "px", 
			height: frozenHeight + "px", 
			width: (panelWidth - frozenWidth) + "px"
		});
		
		//topFrozenDiv 高度 宽度 
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		$(topFrozenDiv).css({
			height: frozenHeight + "px", 
			width: totalWidth + "px"
		});

		//leftFrozenContainerDiv 高度宽度
		var leftFrozenContainerDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenContainerDiv']")[0];
		$(leftFrozenContainerDiv).css({ 
			top: frozenHeight + "px", 
			height: (panelHeight - frozenHeight) + "px", 
			width: frozenWidth + "px"
		});
		
		//leftFrozenDiv 高度宽度
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		$(leftFrozenDiv).css({
			height: totalHeight + "px", 
			width: frozenWidth + "px"
		});
		
		//mainContainerDiv 高度宽度
		var mainContainerDiv = $("#" + sheetLayoutId).find("div[name='mainContainerDiv']")[0];
		$(mainContainerDiv).css({
			left: frozenWidth + "px", 
			top: frozenHeight + "px", 
			height: (panelHeight - frozenHeight) + "px", 
			width: (panelWidth - frozenWidth) + "px"
		});		
		
		//mainDiv 高度宽度
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		$(mainDiv).css({
			height: totalHeight + "px", 
			width: totalWidth + "px"
		});
		
		this.bindMouseResizeAndSelectEvent();
	}
	
	this.initSheetLayoutContainer = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var sheetTabId = sheetLayoutId + "_tab"; 
		var sheetLayoutHtml = this.getInitLayoutHtml(sheetId, sheetLayoutId); 
		
		$("#" + this.containerId).tabs('add',{
			id: sheetTabId,
			title: sheet.name, 	
			content: sheetLayoutHtml,
			closable:false
		});
		$("#" + sheetTabId).attr("sheetId", sheetId); 
		$("#" + sheetTabId).find("div[name='sheetLayout']").attr("id", sheetLayoutId);
		$("#" + sheetLayoutId).layout(); 
		var centerPanel = $("#" + sheetLayoutId).layout("panel", "center")[0];
		$(centerPanel).panel({onResize: function(width, height){
			var sheetId = $(this).parent().parent().attr("sheetId");
			var areaSize = that.getAllAeraSize(sheetId);
			var panelWidth = $(this).width();
			var panelHeight = $(this).height();
			$(this).find("div[name=\"mainContainerDiv\"]").css({
				left: areaSize.frozenWidth,
				top: areaSize.frozenHeight,
				width: panelWidth - areaSize.frozenWidth,
				height: panelHeight - areaSize.frozenHeight
			});
			$(this).find("div[name=\"leftFrozenContainerDiv\"]").css({
				top: areaSize.frozenHeight,
				width:areaSize.frozenWidth,
				height: panelHeight
			});
			$(this).find("div[name=\"topFrozenContainerDiv\"]").css({
				left: areaSize.frozenWidth,
				width: panelWidth,
				height: areaSize.frozenHeight
			});
			$(this).find("div[name=\"leftTopFrozenContainerDiv\"]").css({
				width: areaSize.frozenWidth,
				height: areaSize.frozenHeight
			});
		}});
	}
	
	this.getInitLayoutHtml = function(sheetId, sheetLayoutId){
		var html = "<div id=\"" + sheetLayoutId + "\" sheetId = \"" + sheetId + "\" name=\"sheetLayout\" class=\"easyui-layout\" data-options=\"fit:true\">"			 
			+"<div data-options=\"region:'center',border:false,split:false\" style=\"position:relative;overflow:hidden;\">"
			+"  <div name=\"mainContainerDiv\" style=\"position:absolute;width:100%;height:100%;overflow:auto;\">"
			+"    <div name=\"mainDiv\" style=\"position:relative;overflow:hidden;\"></div>"
			+"  </div>"
			+"  <div name=\"topFrozenContainerDiv\" style=\"position:absolute;width:100%;height:100%;overflow:hidden;\">"
			+"    <div name=\"topFrozenDiv\" style=\"position:absolute;overflow:hidden;\"></div>" 
			+"  </div>"
			+"  <div name=\"leftFrozenContainerDiv\" style=\"position:absolute;width:100%;height:100%;overflow:hidden;\">"
			+"    <div name=\"leftFrozenDiv\" style=\"position:absolute;overflow:hidden;\"></div>" 
			+"  </div>"
			+"  <div name=\"leftTopFrozenContainerDiv\" style=\"position:absolute;width:100%;height:100%;overflow:hidden;\">"
			+"    <div name=\"leftTopFrozenDiv\" style=\"position:relative;overflow:hidden;\"></div>" 
			+"  </div>" 
			+"</div>" 
		+"</div>";
		return html;
	}
	
	this.initSheetLayout = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var areaSize = this.getAllAeraSize(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		$(leftTopFrozenDiv).empty();
		$(topFrozenDiv).empty();
		$(leftFrozenDiv).empty();
		$(mainDiv).empty();
		
		//构造单元格
		var endColFrozen = false;  
		var hasColumnRowTitle = this.eg.hasColumnRowTitle;
		$(leftTopFrozenDiv).append("<div cellType=\"gridTitleCell\" class=\"titleCell\" style=\""+ (hasColumnRowTitle ? "" : "display:none;") + "width:" +  (this.titleColumnWidth - 1)  + "px;height:" +  (this.titleRowHeight - 1)  + "px;\"></div>");
		
		//列标题栏
		var left = this.getTitleColumnWidth(); 
		for(var i = 0; i < sheet.allColumns.length; i++){
			var col = sheet.allColumns[i]; 
			if(!col.isFrozen){
				endColFrozen = true;
			}
			var colName = sheet.getColumnNameByIndex(i);
			var colHtml = this.getColumnTitleHtml(sheetId, col, colName, left - (endColFrozen ? areaSize.frozenWidth : 0));
			if(!endColFrozen){
				$(leftTopFrozenDiv).append(colHtml);
			}
			else{
				$(topFrozenDiv).append(sheet, colHtml);
			} 		
			left += col.width;	
		}
		
		//行标题栏
		var endRowFrozen = false;
		var top = this.getTitleRowHeight();
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i]; 
			if(!row.isFrozen){
				endRowFrozen = true;
			}
			var rowName = (i + 1);
			var rowTitleHtml = this.getRowTitleHtml(sheetId, row, rowName, top - (endRowFrozen ? areaSize.frozenHeight : 0)); 
			if(!endRowFrozen){
				$(leftTopFrozenDiv).append(rowTitleHtml); 
			}
			else{
				$(leftFrozenDiv).append(rowTitleHtml);
			}
			top += row.height; 
		}		
		
		//单元格 
		var cellTop = this.getTitleRowHeight();
		var endCellRowFrozen = false;
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i]; 
			var cellLeft = this.getTitleColumnWidth(); 
			if(!row.isFrozen){
				endCellRowFrozen = true;
			}
			var endCellColumnFrozen = false;
			for(var j = 0; j < sheet.allColumns.length; j++){
				var col = sheet.allColumns[j];
				var cellId = sheet.id + "_" + col.id + "_" + row.id;
				var cell = this.eg.getCell(cellId);				
				var colIndex = sheet.getColumnIndexById(cell.columnId);
				var rowIndex = sheet.getRowIndexById(cell.rowId);
				if(!col.isFrozen){
					endCellColumnFrozen = true;
				}
				
				var cellHtml = this.getNormalCellHtml(sheetId, cell, j, i, cellLeft - (endCellColumnFrozen ? areaSize.frozenWidth : 0), cellTop - (endCellRowFrozen ? areaSize.frozenHeight : 0), col.width, row.height);
				if(!endCellRowFrozen){
					if(!endCellColumnFrozen){
						$(leftTopFrozenDiv).append(cellHtml);
					}
					else{
						$(topFrozenDiv).append(cellHtml);
					}
				}
				else{
					if(!endCellColumnFrozen){
						$(leftFrozenDiv).append(cellHtml);
					}
					else{
						$(mainDiv).append(cellHtml);
					}
				}				
				cellLeft += col.width;
		
				this.refreshCellShowStyle(cellId);
			}
			cellTop += row.height;
		}
	}
			
	//显示布局
	this.layout = function(){	
	
		$("#" + this.containerId).css({"display": "block"});
	
		var sheetArray = this.getSheetArrayByIndex();
		for(var i = 0; i < sheetArray.length; i++){
			var sheet = sheetArray[i];
			var sheetId = sheet.id;			
			var areaSize = this.getAllAeraSize(sheetId);
			this.initSheetLayoutContainer(sheetId);
			this.resizeGridLayout(sheetId);
			this.initSheetLayout(sheetId);
		}		
	}
	
	this.getSheetArrayByIndex = function(){
		var sheetArray = new Array();
		for(var sheetId in this.eg.allSheets){
			var tempArray = new Array();
			var sheet = this.eg.allSheets[sheetId];
			var index = sheet.index;
			var hasInsert = false;
			for(var i = 0; i < sheetArray.length; i++){
				var s = sheetArray[i];
				if(!hasInsert){
					if(s.index > index){ 
						tempArray.push(sheet);
						hasInsert = true; 
					}
					tempArray.push(s);
				}
				else {
					tempArray.push(s);
				}
			}
			if(!hasInsert){
				tempArray.push(sheet);
			}
			sheetArray = tempArray;
		}
		return sheetArray;
	}
			
	//获取单元格大小
	this.getCellSize = function(cell, colIndex, rowIndex){
		var sheetId = cell.sheetId;
		var sheet = this.eg.allSheets[sheetId];
		
		var contentWidth = -1;
		var contentHeight = -1; 
		if(cell.isGroupMain()){
			for(var k = colIndex; k < colIndex + cell.colSpan; k++){
				contentWidth = contentWidth + sheet.allColumns[k].width;
			}
			for(var k = rowIndex; k < rowIndex + cell.rowSpan; k++){
				contentHeight = contentHeight + sheet.allRows[k].height;
			} 
		}
		else{ 
			contentWidth = contentWidth + sheet.allColumns[colIndex].width;
			contentHeight = contentHeight + sheet.allRows[rowIndex].height; 
		}
		var cellWidth = sheet.allColumns[colIndex].width - 1;
		var cellHeight = sheet.allRows[rowIndex].height - 1;
	
		return {contentWidth: contentWidth, contentHeight: contentHeight, cellWidth: cellWidth, cellHeight: cellHeight};
	}
	
	//列头单元格的html
	this.getColumnTitleHtml = function(sheetId, col, colName, left){
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);	
		var colTitleId = sheetLayoutId + "_" + col.id + "_colTitleDiv";
		var hasColumnRowTitle = this.eg.hasColumnRowTitle;
		var colHtml = "<div id=\"" + colTitleId + "\" colId=\"" + col.id + "\" cellType=\"colTitleCell\" class=\"titleCell\" style=\"position:absolute;top:0px;left:" + left + "px;" + (hasColumnRowTitle ? "" : "display:none;") + "width:" + (col.width - 1) + "px;height:" +　(this.titleRowHeight - 1) +　"px;\"><span>" + colName + "</span><div class=\"titleCellRightResize\"></div></div>"
		return colHtml;
	}
	
	//构造行标题的html
	this.getRowTitleHtml = function(sheetId, row, rowName, top){
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);	
		var rowTitleTdId = sheetLayoutId + "_" + row.id + "_rowTitleDiv"; 
		var hasColumnRowTitle = this.eg.hasColumnRowTitle;
		var rowTitleHtml = "<div id=\"" + rowTitleTdId + "\" rowId=\"" + row.id + "\" cellType=\"rowTitleCell\"  class=\"titleCell\" style=\"position:absolute;left:0px;top:" + top + "px;" + (hasColumnRowTitle ? "" : "display:none;") + "width:" + (this.titleColumnWidth - 1) + "px;height:" + (row.height - 1) + "px;\"><span>" + rowName + "</span><div class=\"titleCellBottomResize\"></div></div>";
		return rowTitleHtml;
	} 
	
	//普通单元格的html
	this.getNormalCellHtml = function(sheetId, cell, colIndex, rowIndex, left, top, width, height){ 
		var cellCtrlId = this.containerId + "_" + cell.id;
		var cellSize = this.getCellSize(cell, colIndex, rowIndex);
		var divHtml = this.getNormalCellInnerHtml(cell, cellSize, colIndex, rowIndex);
		var cellHtml = "<div id=\"" + cellCtrlId + "\" style=\"position:absolute;width:" + cellSize.contentWidth+ "px;height:" + cellSize.contentHeight + "px;left:" + left + "px;top:" + top + "px;\" sheetId=\"" + sheetId + "\" colId=\"" + cell.columnId + "\" rowId=\"" + cell.rowId + "\" class=\"normalCell\" cellType=\"normalCell\">"
		+ divHtml + "</div>";
		return cellHtml;
	}
	
	//普通单元格的divhtml
	this.getNormalCellInnerHtml = function(cell, cellSize, colIndex, rowIndex){ 	
		var divHtml = "";
		
		if(!cell.isHidden()){ 
			var text = 	this.getCellShowHtml(cell); 
			if(cell.cssStyle == null || cell.cssStyle.textVAlign == null || cell.cssStyle.textVAlign == cssTextAlignType.middle){
				divHtml = "<div class=\"gridCellInnerDiv\" style=\"width:" + cellSize.contentWidth + "px;height:" + cellSize.contentHeight + "px;\"><div class=\"gridCellInnerTextDiv\" style=\"max-height:" + cellSize.contentHeight + "px;\">" + text + "</div></div>";
			}
			else{ 
				divHtml = "<div class=\"gridCellInnerDiv\" style=\"width:" + cellSize.contentWidth + "px;height:" + cellSize.contentHeight + "px;\"><div class=\"gridCellInnerTextDiv\" style=\"max-height:" + cellSize.contentHeight + "px;\">" + text + "</div></div>";
			}
		} 
		return divHtml;
	}
	
	//获取单元格显示的内容
	this.getCellShowHtml = function(cell){
		var html = ""; 
		if(cell.isExp && cell.isError){ 
			var text = cmnPcr.html_encode(cell.expression) + " #ERR:" + cell.note; 
			html = "<span style=\"color:red;\" title=\"" + text + "\">" + text + "</span>"; 
		}
		else{		
			var text = cell.getShowText(); 
			var componentJsonStr = cell.component;
			if(componentJsonStr == null || componentJsonStr.length == 0){
				html = cmnPcr.html_encode(text);
			}
			else{
				html = this.getComponentHtml(componentJsonStr, text);
				
			}
		}
		return html;
	}	
	
	this.getComponentHtml = function(componentJsonStr, value){		
		try{ 
			var componentJson = cmnPcr.strToJson(componentJsonStr);
			switch(componentJson.type){
				case "singleSelect":{
					var html = "";
					if(json.options != null){
						for(var i = 0; i < json.options.length; i++){
							var option = json.options[i];
							var oText = option.text;
							var checked = option.checked;
							//构造html，绑定修改选项后的事件，即修改选项后，重新构造此单元格的text值
						}
					}
					return html;
				} 
				default:
					throw "不存在此类型控件, type = " + json.type;
				break;
			}
		}
		catch(er){
			return "#错误的控件: " + text +" " + er;
		}
	}
	
	
		
	//获取被选中的所有列Id，从界面列头单元格的属性中获取
	this.getSelectedColumnIds = function(sheetId){	
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);			
		var selectedColIds = new Array();
		var tds = $("#" + sheetLayoutId).find("div[cellType='colTitleCell']");
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
	this.getSelectedRowIds = function(sheetId){	
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);	
		var selectedRowIds = new Array();
		var tds = $("#" + sheetLayoutId).find("div[cellType='rowTitleCell']");
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
	this.getSelectedCellIds = function(sheetId){	
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var sheet = this.eg.allSheets[sheetId];
		var selectedIds = new Array();
		var tds = $("#" + sheetLayoutId).find("div[cellType='normalCell']");
		for(var i = 0; i < tds.length; i++){
			var td = tds[i];
			if($(td).hasClass("selectedCell")){
				var rowId = $(td).attr("rowId");
				var colId = $(td).attr("colId");
				var cellId = sheetId + "_" + colId + "_" + rowId;
				if(!selectedIds.contains(cellId)){
					selectedIds.push(cellId);
				}
				
				//其被合并的节点，也放进来
				var cell = this.eg.getCell(cellId);
				if(cell.isGroupMain()){
					var rowIndex = sheet.getRowIndexById(rowId);
					var colIndex = sheet.getColumnIndexById(colId);
					for(var j = rowIndex; j < rowIndex + cell.rowSpan; j++){
						for(var k = colIndex; k < colIndex + cell.colSpan; k++){
							var rId = sheet.getRowIdByIndex(j);
							var cId = sheet.getColumnIdByIndex(k);
							var gCellId = sheetId + "_" + cId + "_" + rId;
							if(!selectedIds.contains(gCellId)){
								selectedIds.push(gCellId);
							}
						}
					}
				}
			}
		}
		return selectedIds;
	}  
	
	//删除行
	this.deleteRows = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var deletePositions = new Array();
		var allNewShowGroupCells= {};
		var allResizeGroupCells = {};
		var allDeleteCells = {};
		var rowIds = this.getSelectedRowIds(sheetId);
		if(rowIds.length == sheet.allRows.length){
			msgBox.alert({info: "不允许删除所有行."});
			return false;
		}
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var rowIndex = sheet.getRowIndexById(rowId);
			deletePositions.push(rowIndex);
			var results = this.eg.deleteRow(sheetId, rowIndex);
			
			//删除行
			$("#" + sheetLayoutId).find("div[rowId=\"" + rowId + "\"]").remove(); 
			
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
			//var cell = $("#" + cellCtrlId);
			//$(cell).attr("colspan", cellObj.colSpan);
			//$(cell).attr("rowspan", cellObj.rowSpan);
			var colIndex = sheet.getColumnIndexById(cellObj.columnId);
			var rowIndex = sheet.getRowIndexById(cellObj.rowId);
			var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
			this.refreshCellCtrlSize(cellObj.id, cellSize);
			
		} 
		for(var id in allNewShowGroupCells){
			var cellObj = allNewShowGroupCells[id];
			this.convertCellToGroupView(sheetId, cellObj);
		}
		this.refreshAllRowNames(sheetId);
		this.refreshAllCellPosition(sheetId);
		this.resizeGridLayout(sheetId);		
		this.refreshOutEditorText(sheetId);
		return deletePositions;		
	}
	
	this.refreshCellCtrlSize = function(cellId, cellSize){
		var cellCtrlId = this.containerId + "_" + cellId;
		//$("#" + cellCtrlId).css({width: cellSize.cellWidth , height: cellSize.cellHeight });	
		var cellElement = $("#" + cellCtrlId);
		$(cellElement).css({width: cellSize.contentWidth , height: cellSize.contentHeight });	
		$(cellElement).children(".gridCellInnerDiv").css({width: cellSize.contentWidth, height: cellSize.contentHeight});
		$(cellElement).children(".gridCellInnerDiv").children(".gridCellInnerTextDiv").css({"max-height": cellSize.contentHeight});	 
	}
			
	//删除列
	this.deleteColumns = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var deletePositions = new Array();
		var allNewShowGroupCells= {};
		var allResizeGroupCells = {};
		var allDeleteCells = {};
		var colIds = this.getSelectedColumnIds(sheetId);
		if(colIds.length == sheet.allColumns.length){
			msgBox.alert({info: "不允许删除所有列."});
			return false;
		}
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];
			var colIndex = sheet.getColumnIndexById(colId);
			deletePositions.push(colIndex);
			var results = this.eg.deleteColumn(sheetId, colIndex);
			
			//删除列头
			$("#" + this.containerId + "_" + sheetId + "_" + colId + "_colTitleDiv").remove();
			
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
			//$(cell).attr("colspan", cellObj.colSpan);
			//$(cell).attr("rowspan", cellObj.rowSpan);
			var colIndex = sheet.getColumnIndexById(cellObj.columnId);
			var rowIndex = sheet.getRowIndexById(cellObj.rowId);
			var cellSize = this.getCellSize(cellObj, colIndex, rowIndex); 
			this.refreshCellCtrlSize(cellObj.id, cellSize); 
			
		} 
		for(var id in allNewShowGroupCells){
			var cellObj = allNewShowGroupCells[id];
			this.convertCellToGroupView(sheetId, cellObj);
		}
		this.refreshAllColumnNames(sheetId);
		this.refreshAllCellPosition(sheetId);
		this.resizeGridLayout(sheetId);
		this.refreshOutEditorText();
		return deletePositions;
	}
	
	this.convertCellToGroupView = function(sheetId, cellObj){ 
		var sheetId = cellObj.sheetId;
		var sheet = this.eg.allSheets[cellObj.sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var rowIndex = sheet.getRowIndexById(cellObj.rowId);
		var colIndex = sheet.getColumnIndexById(cellObj.columnId);
		
		var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);  
		var cellDivHtml = this.getNormalCellInnerHtml(cellObj, cellSize, colIndex, rowIndex);
		var cellCtrlId = this.containerId + "_" + cellObj.id;
		
		$("#" + cellCtrlId).html(cellDivHtml); 
		this.refreshCellCtrlSize(cellObj.id, cellSize);
	}

	this.showCellAfterPrevious = function(sheetId, cellObj, areaSize){	 
		var sheetId = cellObj.sheetId;
		var sheet = this.eg.allSheets[cellObj.sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		
		var rowIndex = sheet.getRowIndexById(cellObj.rowId);
		var colIndex = sheet.getColumnIndexById(cellObj.columnId);
		var cellRow = sheet.allRows[rowIndex]; 
		var cellCol = sheet.allColumns[colIndex]; 
		
		var cellTop = this.getTitleRowHeight();
		var endCellRowFrozen = false;
		for(var i = 0; i <= rowIndex; i++){
			var row = sheet.allRows[i];  
			if(!row.isFrozen){
				endCellRowFrozen = true;
			}  
			if(i < rowIndex){
				cellTop += row.height;
			}
		}
		
		var cellLeft = this.getTitleColumnWidth(); 
		var endCellColumnFrozen = false;
		for(var j = 0; j <= colIndex; j++){
			var col = sheet.allColumns[j]; 
			if(!col.isFrozen){
				endCellColumnFrozen = true;
			} 
			if(j < colIndex){
				cellLeft += col.width;
			}
		}
		
		var cellHtml = this.getNormalCellHtml(sheetId, cellObj, colIndex, rowIndex, cellLeft - (endCellColumnFrozen ? areaSize.frozenWidth : 0), cellTop - (endCellRowFrozen ? areaSize.frozenHeight : 0), cellCol.width, cellRow.height);
		if(!endCellRowFrozen){
			if(!endCellColumnFrozen){
				$(leftTopFrozenDiv).append(cellHtml);
			}
			else{
				$(topFrozenDiv).append(cellHtml);
			}
		}
		else{
			if(!endCellColumnFrozen){
				$(leftFrozenDiv).append(cellHtml);
			}
			else{
				$(mainDiv).append(cellHtml);
			}
		}
		
		this.refreshCellShowStyle(cellObj.id);
	}

	this.showRowAfterPrevious = function(sheetId, newRow){	 
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var areaSize = this.getAllAeraSize(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		
		var sheet = this.eg.allSheets[sheetId]; 
		var top = this.getTitleRowHeight();
		var endRowFrozen = false;
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i]; 
			if(!row.isFrozen){
				endRowFrozen = true;
			}
			if(newRow == row){ 
				var rowName = (i + 1);
				var rowTitleHtml = this.getRowTitleHtml(sheetId, row, rowName, top - (endRowFrozen ? areaSize.frozenHeight : 0)); 
				if(!endRowFrozen){
					$(leftTopFrozenDiv).append(rowTitleHtml); 
				}
				else{
					$(leftFrozenDiv).append(rowTitleHtml);
				}
				break;
			}
			top += row.height; 
		}	
	}
	this.showColumnAfterPrevious = function(sheetId, newColumn){	
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var areaSize = this.getAllAeraSize(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		
		var sheet = this.eg.allSheets[sheetId]; 
		var left = this.getTitleColumnWidth();
		var endColFrozen = false;
		for(var i = 0; i < sheet.allColumns.length; i++){
			var col = sheet.allColumns[i]; 
			if(!col.isFrozen){
				endColFrozen = true;
			}
			if(newColumn == col){ 
				var colName = sheet.getColumnNameByIndex(i);
				var colTitleHtml = this.getColumnTitleHtml(sheetId, col, colName, left - (endColFrozen ? areaSize.frozenWidth : 0)); 
				if(!endColFrozen){
					$(leftTopFrozenDiv).append(colTitleHtml); 
				}
				else{
					$(topFrozenDiv).append(colTitleHtml);
				}
				break;
			}
			top += col.height; 
		}	
	}
	
	this.addRow = function(sheetId, isBefore){ 
		var sheet = this.eg.allSheets[sheetId];   
		var rowIds = this.getSelectedRowIds(sheetId);
		if(rowIds.length > 1){
			msgBox.alert({info: "请只选中一行."});
			return null;
		}
		else{
			var insertPosition = -1;
			var rowId = rowIds[0];
			var row = sheet.getRowById(rowId);
			var rowIndex = sheet.getRowIndexById(rowId);
			rowIndex = isBefore ? rowIndex : (rowIndex + 1);
			insertPosition = rowIndex;
			var result = this.eg.addRow(sheetId, rowIndex, row.isFrozen);
			var areaSize = this.getAllAeraSize(sheetId);

			for(var id in result.allResizeGroupCells){
				var cellObj = result.allResizeGroupCells[id];
				var cellId = this.containerId + "_" + cellObj.id;
				var cell = $("#" + cellId);
				//$(cell).attr("colspan", cellObj.colSpan);
				//$(cell).attr("rowspan", cellObj.rowSpan);
				var colIndex = sheet.getColumnIndexById(cellObj.columnId);
				var rowIndex = sheet.getRowIndexById(cellObj.rowId);
				var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
				this.refreshCellCtrlSize(cellObj.id, cellSize);
			}
								 
			this.showRowAfterPrevious(sheetId, result.row, areaSize);
			
			for(var id in result.allNewCells){
				var cellObj = result.allNewCells[id];
				this.showCellAfterPrevious(sheetId, cellObj, areaSize); 
			}
			this.refreshAllRowNames(sheetId);			
			this.refreshAllCellPosition(sheetId);
			this.resizeGridLayout(sheetId);
			return insertPosition;
		}
	}
			
	this.addColumn = function(sheetId, isBefore){
		var sheet = this.eg.allSheets[sheetId];   
		var columnIds = this.getSelectedColumnIds(sheetId);
		if(columnIds.length > 1){
			msgBox.alert({info: "请只选中一列."});
		}
		else{
			var colId = columnIds[0]; 
			var column = sheet.getColumnById(colId);
			var colIndex = sheet.getColumnIndexById(colId);
			colIndex = isBefore ? colIndex : (colIndex + 1);
			var result = this.eg.addColumn(sheetId, colIndex, column.isFrozen);
			var areaSize = this.getAllAeraSize(sheetId);

			for(var id in result.allResizeGroupCells){
				var cellObj = result.allResizeGroupCells[id];
				var cellId = this.containerId + "_" + cellObj.id;
				var cell = $("#" + cellId);
				//$(cell).attr("colspan", cellObj.colSpan);
				//$(cell).attr("rowspan", cellObj.rowSpan);
				var colIndex = sheet.getColumnIndexById(cellObj.columnId);
				var rowIndex = sheet.getRowIndexById(cellObj.rowId);
				var cellSize = this.getCellSize(cellObj, colIndex, rowIndex);
				this.refreshCellCtrlSize(cellObj.id, cellSize);
			}
			
			for(var id in result.allNewCells){
				var cellObj = result.allNewCells[id];
				this.showCellAfterPrevious(sheetId, cellObj, areaSize); 
			}
 
			this.showColumnAfterPrevious(sheetId, result.column, areaSize);	
			this.refreshAllColumnNames(sheetId);
			this.refreshAllCellPosition(sheetId);
			this.resizeGridLayout(sheetId);
		}
	}

	//判断是否可以在此行前粘贴插入行(移动行)
	this.checkCanMoveToBeforeRow = function(sheetId, rowIndex){
		var sheet = this.eg.allSheets[sheetId];   
		var rowId = sheet.getRowIdByIndex(rowIndex);
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);
			if(cell.rowId == rowId){
				if(cell.isHidden()) {
					var groupCell = this.eg.getCell(cell.groupCellId);
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
	this.checkCanMoveToBeforeColumn = function(sheetId, colIndex){
		var sheet = this.eg.allSheets[sheetId];   
		var colId = sheet.getColumnIdByIndex(colIndex);
		for(var cellId in this.eg.allCells){
			var cell = this.eg.getCell(cellId);
			if(cell.columnId == colId){
				if(cell.isHidden()) {
					var groupCell = this.eg.getCell(cell.groupCellId);
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
	this.checkAllGroupCellInRange = function( range){ 
		var sheetId = range.sheetId;
		var sheet = this.eg.allSheets[sheetId];   
		var left = range.left;
		var right = range.right;
		var top = range.top;
		var bottom = range.bottom;
		var allRangeCells = {};
		for(var i = left; i <= right; i++){
			var colId = sheet.getColumnIdByIndex(i);
			for(var j = top; j <= bottom; j++){
				var rowId = sheet.getRowIdByIndex(j);
				var cell = this.eg.getCell(sheetId + "_" + colId + "_" + rowId);
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
						var gColId = sheet.getColumnIdByIndex(x);
						for(var y = rowIndex; y < rowIndex + cell.rowSpan; y++){
							var gRowId = sheet.getRowIdByIndex(y);
							var gCellId = sheetId + "_" + gColId + "_" + gRowId;
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
		var sheetId = range.sheetId; 
		var sheet = this.eg.allSheets[sheetId];   
		var left = range.left;
		var right = range.right;
		var top = range.top;
		var bottom = range.bottom;
		var copyText = "";
		for(var i = top; i <= bottom; i++){
			var rowId = sheet.getRowIdByIndex(i);
			if(i != top){
				copyText += "\n";
			}
			for(var j = left; j <= right; j++){
				var colId = sheet.getColumnIdByIndex(j);
				var cell = this.eg.getCell(sheetId + "_" + colId + "_" + rowId);
				//var str = cell.isHidden() ? "" : cell.getShowText();
				var str = cell.isHidden() ? "" : this.getCellShowText(cell);
				if(j != left){
					copyText += "\t";
				}
				copyText += str;
			}			
		}
		return copyText;
	} 
	
	this.rowCut = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var selectedColumnIds = this.getSelectedColumnIds(sheetId);
		var selectedCellIds = this.getSelectedCellIds(sheetId);
		var selectedRowIds = this.getSelectedRowIds(sheetId);
		
		var allSelectedRowIndexs = {};
		var allSelectedRowIds = {};
		var maxRowIndex = -1;
		for(var i = 0; i < selectedRowIds.length; i++){
			var rowId = selectedRowIds[i];
			var rowIndex = sheet.getRowIndexById(rowId);
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
				var cell = this.eg.getCell(cellId);
				if(allSelectedRowIds[cell.rowId] == null){
					msgBox.alert({info:"请勿选择被选中行以外的单元格."});
					return false;
				}
			}
		}
		
		var range = {sheetId: sheetId, top: needMinRowIndex, bottom: maxRowIndex, left: 0, right: sheet.allColumns.length - 1};
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
				data: {
					sourceSheetId: sheetId,
					selectedRowIds: selectedRowIds
				},
				text: copyText
			};					

			//如果剪切后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
		}
	}
			
	this.colCut = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var selectedRowIds = this.getSelectedRowIds(sheetId);
		var selectedCellIds = this.getSelectedCellIds(sheetId);
		var selectedColumnIds = this.getSelectedColumnIds(sheetId);
		
		var allSelectedColIndexs = {};
		var allSelectedColIds = {};
		var maxColIndex = -1;
		for(var i = 0; i < selectedColumnIds.length; i++){
			var colId = selectedColumnIds[i];
			var colIndex = sheet.getColumnIndexById(colId);
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
				var cell = this.eg.getCell(cellId);
				if(allSelectedColIds[cell.columnId] == null){
					msgBox.alert({info:"请勿选择被选中列以外的单元格."});
					return false;
				}
			}
		}
		
		var range = {sheetId: sheetId, left: needMinColIndex, right: maxColIndex, top: 0, bottom: sheet.allRows.length - 1};
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
				data: {
					sourceSheetId: sheetId,
					selectedColumnIds: selectedColumnIds
				},
				text: copyText
			};					

			//如果剪切后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
		}
	}
	
	this.rowDelete = function(event){
		var sheetId = this.currentSheetId; 
		var deletePositions = this.deleteRows(sheetId);
		this.afterDeleteRows(sheetId, deletePositions);
	}
	
	this.afterDeleteRows = function(sheetId, deletePositions){
		this.refreshAllCellReferance();
	}
	
	this.colDelete = function(event){
		var sheetId = this.currentSheetId; 
		var deletePositions = this.deleteColumns(sheetId);
		this.afterDeleteColumns(sheetId, deletePositions);
	}
	
	this.afterDeleteColumns = function(sheetId, deletePositions){
		this.refreshAllCellReferance();
	}

	this.rowCopy = function(event){
		var sheetId = this.currentSheetId; 
		var sheet = this.eg.allSheets[sheetId];
		var selectedColumnIds = this.getSelectedColumnIds(sheetId);
		var selectedCellIds = this.getSelectedCellIds(sheetId);
		var selectedRowIds = this.getSelectedRowIds(sheetId);
		
		var allSelectedRowIndexs = {};
		var allSelectedRowIds = {};
		var maxRowIndex = -1;
		for(var i = 0; i < selectedRowIds.length; i++){
			var rowId = selectedRowIds[i];
			var rowIndex = sheet.getRowIndexById(rowId);
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
				var cell = this.eg.getCell(cellId);
				if(allSelectedRowIds[cell.rowId] == null){
					msgBox.alert({info:"请勿选择被选中行以外的单元格."});
					return false;
				}
			}
		}
		
		var range = {sheetId: sheetId, top: needMinRowIndex, bottom: maxRowIndex, left: 0, right: sheet.allColumns.length - 1};
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
				data: {
					sourceSheetId: sheetId,
					selectedRowIds: selectedRowIds
				},
				text: copyText
			};					

			//如果复制后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
		}
	}

	this.colCopy = function(event){
		var sheetId = this.currentSheetId; 
		var sheet = this.eg.allSheets[sheetId];
		var selectedRowIds = this.getSelectedRowIds(sheetId);
		var selectedCellIds = this.getSelectedCellIds(sheetId);
		var selectedColumnIds = this.getSelectedColumnIds(sheetId);
		
		var allSelectedColIndexs = {};
		var allSelectedColIds = {};
		var maxColIndex = -1;
		for(var i = 0; i < selectedColumnIds.length; i++){
			var colId = selectedColumnIds[i];
			var colIndex = sheet.getColumnIndexById(colId);
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
				var cell = this.eg.getCell(cellId);
				if(allSelectedColIds[cell.columnId] == null){
					msgBox.alert({info:"请勿选择被选中列以外的单元格."});
					return false;
				}
			}
		}
		
		var range = {sheetId: sheetId, left: needMinColIndex, right: maxColIndex, top: 0, bottom: sheet.allRows.length - 1};
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
				data: {
					sourceSheetId: sheetId, 
					selectedColumnIds: selectedColumnIds
				},
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
			var sourceSheetId = sourceRange.sheetId;
			var targetSheetId = targetRange.sheetId;
			var sourceSheet = this.eg.allSheets[sourceSheetId];
			var targetSheet = this.eg.allSheets[targetSheetId];
			for(var i = 0; i < colCount; i++){	
				var sourceColId = sourceSheet.getColumnIdByIndex(i + sourceRange.left);
				var targetColId = targetSheet.getColumnIdByIndex(i + targetRange.left);
				for(var j = 0; j < rowCount; j++){
					var sourceRowId = sourceSheet.getRowIdByIndex(j + sourceRange.top);
					var targetRowId = targetSheet.getRowIdByIndex(j + targetRange.top);
					
					var sourceCell = this.eg.getCell(sourceSheetId + "_" + sourceColId + "_" + sourceRowId);
					var targetCell = this.eg.getCell(targetSheetId + "_" + targetColId + "_" + targetRowId);
					
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
		var sourceSheetId = sourceRange.sheetId;
		var targetSheetId = targetRange.sheetId;
		var sourceSheet = this.eg.allSheets[sourceSheetId];
		var targetSheet = this.eg.allSheets[targetSheetId];
		for(var i = 0; i < colCount; i++){	
			var sourceColId = sourceSheet.getColumnIdByIndex(i + sourceRange.left);
			var targetColId = targetSheet.getColumnIdByIndex(i + targetRange.left);
			for(var j = 0; j < rowCount; j++){
				var sourceRowId = sourceSheet.getRowIdByIndex(j + sourceRange.top);
				var targetRowId = targetSheet.getRowIdByIndex(j + targetRange.top);
				var sourceCellId = sourceSheetId + "_" + sourceColId + "_" + sourceRowId;
				var targetCellId = targetSheetId + "_" + targetColId + "_" + targetRowId;
				sourceToTargetCellIds[sourceCellId] = targetCellId;
				var sourceCell = this.eg.getCell(sourceCellId);
				var targetCell = this.eg.getCell(targetCellId);
				sourceCell.copyTo(targetCell);
				targetCell.groupCellId = sourceToTargetCellIds[sourceCell.groupCellId];
				targetCell.isError = false;						
			}						
		} 
		
		var rowStep = targetRange.top - sourceRange.top;
		var colStep = targetRange.left - sourceRange.left; 

		var needRefreshCellIds = {};
		for(var i = 0; i < colCount; i++){
			var colIndex = i + targetRange.left;
			var targetColId = targetSheet.getColumnIdByIndex(colIndex);
			for(var j = 0; j < rowCount; j++){
				var rowIndex = j + targetRange.top;
				var targetRowId = targetSheet.getRowIdByIndex(rowIndex);
				var targetCellId = targetSheetId + "_" + targetColId + "_" + targetRowId;
				var cell = this.eg.getCell(targetCellId);
				if(!cell.isHidden()){
					var newExp = this.eg.reBuildCellExpressionAfterPaste(cell, rowStep, colStep);
					if(newExp != null && newExp.length > 0){
						this.updateCellValue(cell, newExp, true);
					}  
					needRefreshCellIds[targetCellId] = "";
				}
				this.refreshCellDisplay(targetCellId, colIndex, rowIndex); 
			}						
		} 
		this.refreshAllCellReferance();
		this.updateEffectCellValues(needRefreshCellIds, true, true);
	}
	
	this.refreshCellDisplay = function(cellId, colIndex, rowIndex){
		var targetCell = this.eg.getCell(cellId);
		var cellSize = this.getCellSize(targetCell, colIndex, rowIndex);  
		var innerHtml = this.getNormalCellInnerHtml(targetCell, cellSize, colIndex, rowIndex); 
		var cellElement = $("#" + this.containerId + "_" + cellId);
		$(cellElement).css({
			width: cellSize.contentWidth,
			height: cellSize.contentHeight
		});
		$(cellElement).html(innerHtml); 
		this.refreshCellShowStyle(cellId);
	}
	
	this.refreshCellShowValue = function(cellId){
		var targetCell = this.eg.getCell(cellId); 
		var cellElement = $("#" + this.containerId + "_" + cellId); 
		var innerHtml = ""; 
		if(!targetCell.isHidden()){
			innerHtml = this.getCellShowHtml(targetCell) 
		}  
		
		if(targetCell.isGroupMain()){
			$(cellElement).find(".gridCellInnerDiv").find(".gridCellInnerTextDiv").html(innerHtml);
		}
		else{
			$(cellElement).find(".gridCellInnerDiv").find(".gridCellInnerTextDiv").html(innerHtml);
		}
		this.refreshCellInnerShowStyle(targetCell);
	}
	
	this.refreshCellSize = function(cellId){
		var cell = this.eg.getCell(cellId);
		var sheet = this.eg.allSheets[cell.sheetId];
		if(cell.isHidden()){
			this.refreshCellSize(cell.groupCellId);
		} 
		var colIndex = sheet.getColumnIndexById(cell.columnId);
		var rowIndex = sheet.getRowIndexById(cell.rowId);
		var cellSize = this.getCellSize(cell, colIndex, rowIndex);  
		this.refreshCellCtrlSize(cell.id, cellSize); 
	}
	
	this.refreshAllCellPosition = function(sheetId){ 
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);	
		var areaSize = this.getAllAeraSize(sheetId);
		var mainDiv = $("#" + sheetLayoutId).find("div[name='mainDiv']")[0];
		var leftFrozenDiv = $("#" + sheetLayoutId).find("div[name='leftFrozenDiv']")[0];
		var topFrozenDiv = $("#" + sheetLayoutId).find("div[name='topFrozenDiv']")[0];
		var leftTopFrozenDiv =  $("#" + sheetLayoutId).find("div[name='leftTopFrozenDiv']")[0];
		
		//列标题栏
		var endColFrozen = false;
		var left = this.getTitleColumnWidth(); 
		for(var i = 0; i < sheet.allColumns.length; i++){
			var col = sheet.allColumns[i]; 
			if(!col.isFrozen){
				endColFrozen = true;
			}
			var colName = sheet.getColumnNameByIndex(i);
			var colTitleId = sheetLayoutId + "_" + col.id + "_colTitleDiv"; 
			$("#" + colTitleId).css({
				left:left - (endColFrozen ? areaSize.frozenWidth : 0)
			});
			if(!endColFrozen){
				if($("#" + colTitleId).parent()[0] != leftTopFrozenDiv){
					$("#" + colTitleId).appendTo(leftTopFrozenDiv);
				}
			}
			else{
				if($("#" + colTitleId).parent()[0] != topFrozenDiv){
					$("#" + colTitleId).appendTo(topFrozenDiv);
				}
			}
			
			left += col.width;	
		}
		
		//行标题栏
		var endRowFrozen = false;
		var top = this.getTitleRowHeight();
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i]; 
			if(!row.isFrozen){
				endRowFrozen = true;
			}
			var rowName = (i + 1);
			var rowTitleId = sheetLayoutId + "_" + row.id + "_rowTitleDiv"; 
			$("#" + rowTitleId).css({
				top: top - (endRowFrozen ? areaSize.frozenHeight : 0)
			});
			if(!endRowFrozen){
				if($("#" + rowTitleId).parent()[0] != leftTopFrozenDiv){
					$("#" + rowTitleId).appendTo(leftTopFrozenDiv);
				}
			}
			else{
				if($("#" + rowTitleId).parent()[0] != leftFrozenDiv){
					$("#" + rowTitleId).appendTo(leftFrozenDiv);
				}
			}
			top += row.height; 
		}		
		
		//单元格位置
		var cellTop = this.getTitleRowHeight();
		var endCellRowFrozen = false;
		for(var i = 0; i < sheet.allRows.length; i++){
			var row = sheet.allRows[i]; 
			var cellLeft = this.getTitleColumnWidth(); 
			if(!row.isFrozen){
				endCellRowFrozen = true;
			}
			var endCellColumnFrozen = false;
			for(var j = 0; j < sheet.allColumns.length; j++){
				var col = sheet.allColumns[j];
				var cellId = sheet.id + "_" + col.id + "_" + row.id;
				var cell = this.eg.getCell(cellId);				
				var colIndex = sheet.getColumnIndexById(cell.columnId);
				var rowIndex = sheet.getRowIndexById(cell.rowId);
				if(!col.isFrozen){
					endCellColumnFrozen = true;
				}
				
				var cellCtrlId = this.containerId + "_" + cellId;
				$("#" + cellCtrlId).css({
					left: cellLeft - (endCellColumnFrozen ? areaSize.frozenWidth : 0),
					top: cellTop - (endCellRowFrozen ? areaSize.frozenHeight : 0)
				}); 
				
				if(!endCellRowFrozen){
					if(!endCellColumnFrozen){
						if($("#" + cellCtrlId).parent()[0] != leftTopFrozenDiv){
							$("#" + cellCtrlId).appendTo(leftTopFrozenDiv);
						}
					}
					else{
						if($("#" + cellCtrlId).parent()[0] != topFrozenDiv){
							$("#" + cellCtrlId).appendTo(topFrozenDiv);
						}
					}
				}
				else{
					if(!endCellColumnFrozen){
						if($("#" + cellCtrlId).parent()[0] != leftFrozenDiv){
							$("#" + cellCtrlId).appendTo(leftFrozenDiv);
						}
					}
					else{
						if($("#" + cellCtrlId).parent()[0] != mainDiv){
							$("#" + cellCtrlId).appendTo(mainDiv);
						}
					}
				}
			
				cellLeft += col.width;
			}
			cellTop += row.height;
		}
	}

	this.rowPaste = function(event){
		var sheetId = this.currentSheetId;
		this.pasteRows(sheetId);
		this.afterPasteRows(this.clipBoardData.operateType);
	}
	
	this.afterPasteRows = function(operateType){
		if(operateType == "cutRow"){
			this.refreshAllCellReferance();
		}
	}

	this.pasteRows = function(sheetId){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		$("#copyPasteInputId").focus();
		$("#copyPasteInputId").select();
		document.execCommand("paste");
		var pasteText = $("#copyPasteInputId").val();
		if(pasteText == this.clipBoardData.text){
			//操作系统粘贴板和页面中的粘贴板数据一样，那么按照页面的来
			if(this.clipBoardData.operateType == "cutRow"){
				var targetRowIds = this.getSelectedRowIds(sheetId);
				var copyData = this.clipBoardData.data;
				var sourceSheetId = copyData.sourceSheetId;
				var selectedRowIds = copyData.selectedRowIds;
				var sourceSheet = this.eg.allSheets[sourceSheetId];

				if(sheetId != sourceSheetId){
					msgBox.alert({info: "暂不支持跨表剪切"});
				}
				else{
					var minRowIndex = 10000;
					for(var i = 0; i < targetRowIds.length; i++){
						var rowId = targetRowIds[i];
						var rowIndex = sheet.getRowIndexById(rowId); 
						if(rowIndex < minRowIndex){
							minRowIndex = rowIndex;
						}
					}
	 
					if(this.checkCanMoveToBeforeRow(sheetId, minRowIndex)){
						
						this.eg.moveRows(sheetId, selectedRowIds, minRowIndex);
	
						var areaSize = this.getAllAeraSize(sheetId);
						this.refreshAllCellPosition(sheetId);
						this.refreshAllRowNames(sheetId);
						this.resizeGridLayout(sheetId);
					}
				}
			}
			else if(this.clipBoardData.operateType == "copyRow"){
					var targetRowIds = this.getSelectedRowIds(sheetId);
					var copyData = this.clipBoardData.data;
					var sourceSheetId = copyData.sourceSheetId;
					var selectedRowIds = copyData.selectedRowIds;
					var sourceSheet = this.eg.allSheets[sourceSheetId];

					var minTargetRowIndex = 10000;
					for(var i = 0; i < targetRowIds.length; i++){
						var rowId = targetRowIds[i];
						var rowIndex = sheet.getRowIndexById(rowId); 
						if(rowIndex < minTargetRowIndex){
							minTargetRowIndex = rowIndex;
						}
					}
					var minSourceRowIndex = 10000;
					for(var i = 0; i < selectedRowIds.length; i++){
						var rowId = selectedRowIds[i];
						var rowIndex = sourceSheet.getRowIndexById(rowId); 
						if(rowIndex < minSourceRowIndex){
							minSourceRowIndex = rowIndex;
						}
					}
					if(minTargetRowIndex + selectedRowIds.length > sheet.allRows.length){
						msgBox.alert({info:"请选中" + selectedRowIds.length + "行目标区域."});
					}
					else {
						var targetRange = {sheetId: sheetId, top: minTargetRowIndex, bottom: minTargetRowIndex + selectedRowIds.length - 1, left: 0, right: sheet.allColumns.length - 1};
						if(this.checkAllGroupCellInRange(targetRange)){
							var sourceRange = {
									sheetId: sourceSheetId,
									top: minSourceRowIndex, 
									bottom: minSourceRowIndex + selectedRowIds.length - 1,
									left: 0,
									right: sourceSheet.allColumns.length - 1
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

	this.colPaste = function(event){
		var sheetId = this.currentSheetId;
		this.pasteColumns(sheetId);
		this.afterPasteColumns(this.clipBoardData.operateType);
	}
	
	this.afterPasteColumns = function(operateType){
		if(operateType == "cutColumn"){
			this.refreshAllCellReferance();
		}
	}

	this.pasteColumns = function(sheetId){
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var sheet = this.eg.allSheets[sheetId];
		$("#copyPasteInputId").focus();
		$("#copyPasteInputId").select();
		document.execCommand("paste");
		var pasteText = $("#copyPasteInputId").val();
		if(pasteText == this.clipBoardData.text){
			//操作系统粘贴板和页面中的粘贴板数据一样，那么按照页面的来
			if(this.clipBoardData.operateType == "cutColumn"){
				var targetColumnIds = this.getSelectedColumnIds(sheetId);
				var copyData = this.clipBoardData.data;
				var sourceSheetId = copyData.sourceSheetId;
				var selectedColumnIds = copyData.selectedColumnIds;
				var sourceSheet = this.eg.allSheets[sourceSheetId];
				
				if(sheetId != sourceSheetId){
					msgBox.alert({info: "暂不支持跨表剪切"});
				}
				else{
					var minColIndex = 10000;
					for(var i = 0; i < targetColumnIds.length; i++){
						var colId = targetColumnIds[i];
						var colIndex = sheet.getColumnIndexById(colId); 
						if(colIndex < minColIndex){
							minColIndex = colIndex;
						}
					}
	
					if(this.checkCanMoveToBeforeColumn(sheetId, minColIndex)){
						
						this.eg.moveColumns(sheetId, selectedColumnIds, minColIndex);
						var areaSize = this.getAllAeraSize(sheetId); 
						this.refreshAllColumnNames(sheetId);
						this.refreshAllCellPosition(sheetId);
						this.resizeGridLayout(sheetId);
					}
				}
			}
			else if(this.clipBoardData.operateType == "copyColumn"){
				var targetColumnIds = this.getSelectedColumnIds(sheetId);
				var copyData = this.clipBoardData.data;
				var sourceSheetId = copyData.sourceSheetId;
				var selectedColumnIds = copyData.selectedColumnIds;
				var sourceSheet = this.eg.allSheets[sourceSheetId];
				
				var minTargetColIndex = 10000;
				for(var i = 0; i < targetColumnIds.length; i++){
					var colId = targetColumnIds[i];
					var colIndex = sheet.getColumnIndexById(colId); 
					if(colIndex < minTargetColIndex){
						minTargetColIndex = colIndex;
					}
				}
				var minSourceColIndex = 10000;
				for(var i = 0; i < selectedColumnIds.length; i++){
					var colId = selectedColumnIds[i];
					var colIndex = sourceSheet.getColumnIndexById(colId); 
					if(colIndex < minSourceColIndex){
						minSourceColIndex = colIndex;
					}
				}
				if(minTargetColIndex + selectedColumnIds.length > sheet.allColumns.length){
					msgBox.alert({info:"请选中" + selectedColumnIds.length + "列目标区域."});
				}
				else {
					var targetRange = {sheetId: sheetId, left: minTargetColIndex, right: minTargetColIndex + selectedColumnIds.length - 1, top: 0, bottom: sheet.allRows.length - 1};
					if(this.checkAllGroupCellInRange(targetRange)){

						var sourceRange = {
								sheetId: sourceSheetId, 
								left: minSourceColIndex, 
								right: minSourceColIndex + selectedColumnIds.length - 1,
								top: 0,
								bottom: sourceSheet.allRows.length - 1
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
		var sheetId = this.currentSheetId;
		var insertPosition = this.addRow(sheetId, true);
		this.afterAddRow(insertPosition);
	}
		
	this.afterAddRow = function(insertPosition){
		this.refreshAllCellReferance();
	}

	this.colInsertBefore = function(event){
		var sheetId = this.currentSheetId;
		var insertPosition = this.addColumn(sheetId, true);
		this.afterAddColumn(insertPosition);
	}
	
	this.afterAddColumn = function(insertPosition){
		this.refreshAllCellReferance();	
	}

	this.rowInsertAfter = function(event){
		var sheetId = this.currentSheetId;
		var insertPosition = this.addRow(sheetId, false);
		this.afterAddRow(insertPosition);
	}

	this.colInsertAfter = function(event){
		var sheetId = this.currentSheetId;
		var insertPosition = this.addColumn(sheetId, false);
		this.afterAddColumn(insertPosition);
	}
	
	this.clearContentByCellIds = function(cellIds){
		var effectCellIds = {};
		for(var i = 0; i < cellIds.length; i++){
			var cellId = cellIds[i];
			var cell = this.eg.getCell(cellId);
			//cell.value = null;
			this.updateCellValue(cell, null, true);
			//var cellElement = $("#" + this.containerId + "_" + cellId);
			//$(cellElement).find("div[name='gridCellInnerDiv']").empty();
			this.refreshCellShowValue(cellId);
			effectCellIds[cellId] = "";
		}		
		
		this.updateEffectCellValues(effectCellIds, false);
		
		this.refreshOutEditorText();	
	}

	this.rowClearContent = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var allClearCellIds = new Array();
		var rowIds = this.getSelectedRowIds(sheetId);
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];  
			for(var j = 0; j < sheet.allColumns.length; j++){
				var colId = sheet.getColumnIdByIndex(j);  
				var cellId = sheetId + "_" + colId + "_" + rowId;
				allClearCellIds.push(cellId);
			}
		}
		this.clearContentByCellIds(allClearCellIds);
	}

	this.colClearContent = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var allClearCellIds = new Array();
		var colIds = this.getSelectedColumnIds(sheetId);
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];  
			for(var j = 0; j < sheet.allRows.length; j++){
				var rowId = sheet.getRowIdByIndex(j);  
				var cellId = sheetId + "_" + colId + "_" + rowId;
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
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var height = null;
		var rowIds = this.getSelectedRowIds(sheetId);
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var row = sheet.getRowById(rowId);
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
				var rowIds = that.getSelectedRowIds(sheetId);
				that.resizeRows(sheetId, rowIds, p.value);
			}
		});
	}

	this.colSetWidth = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var width = null;
		var colIds = this.getSelectedColumnIds(sheetId);
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];
			var col = sheet.getColumnById(colId);
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
				var colIds = that.getSelectedColumnIds(sheetId);
				that.resizeColumns(sheetId, colIds, p.value);
			}
		});
	}
			
	this.resizeRows = function(sheetId, rowIds, height){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var row = sheet.getRowById(rowId);
			row.height = height;

			var rowTitleId = sheetLayoutId + "_" + row.id + "_rowTitleDiv";   
			$("#" + rowTitleId).css({height: row.height - 1});

			for(var j = 0; j < sheet.allColumns.length; j++){ 
				var colId = sheet.getColumnIdByIndex(j);
				var cellId = sheetId + "_" + colId + "_" + rowId;
				this.refreshCellSize(cellId);
			}
		}
		
		//修改编辑控件的大小 added by lixin 20170424
		this.resizeEditingControl();
		this.refreshAllCellPosition(sheetId);
		this.resizeGridLayout(sheetId);
	}
			
	this.resizeColumns = function(sheetId, colIds, width){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];
			var col = sheet.getColumnById(colId);
			col.width = width;
 
			var colTitleId = sheetLayoutId + "_" + col.id + "_colTitleDiv";
			$("#" + colTitleId).css({width: col.width - 1});
		
			for(var j = 0; j < sheet.allRows.length; j++){ 
				var rowId = sheet.getRowIdByIndex(j);
				var cellId = sheetId + "_" + colId + "_" + rowId;
				this.refreshCellSize(cellId);
			}	
		}	
		
		//修改编辑控件的大小 added by lixin 20170424
		this.resizeEditingControl();	
		this.refreshAllCellPosition(sheetId);
		this.resizeGridLayout(sheetId);
	}

	//修改编辑控件的大小 added by lixin 20170424
	this.resizeEditingControl = function(){
		var editorParents = $("#" + that.containerId).find(".gridCellInnerDivEditing");
		if(editorParents.length != 0){
			var editorParent = editorParents[0];
			var width = $(editorParent).width() - 2;
			var height = $(editorParent).height() - 2;
			var editCtrls = $(editorParent).children("textarea");
			if(editCtrls.length > 0){
				var editCtrl = editCtrls[0];		
				$(editCtrl).css({
					width: width,
					height: height
				});
				
				var fillCtrl = $(editorParent).children(".fillCellBtn")[0];
				var editCtrlOffset = $(editCtrl).offset();
				$(fillCtrl).css({
					width: editCtrlOffset.left + width -5,
					height: editCtrlOffset.top + height - 5
				});				
			}
		}
		
		var editorFillCtrls = $("#" + that.containerId).find(".fillCellBtn");
		if(editorFillCtrls.length != 0){
			var editorFillCtrl = editorFillCtrls[0];
			var cellId = $(editorFillCtrl).attr("cellId");
			var cellLayoutInfo = that.getCellLayoutInfo(cellId);   
			var editCtrlOffset = $(editCtrl).offset();
			$(editorFillCtrl).css({
				left: cellLayoutInfo.left + cellLayoutInfo.contentWidth -5,
				top: cellLayoutInfo.top + cellLayoutInfo.contentHeight - 5
			});		 
		}
	}

	this.cellCopy = function(event){ 
		var sheetId= this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId]; 
		var selectedCellIds = this.getSelectedCellIds(sheetId); 
		var copyCellIds = new Array();		
		var allSelectedCellIds = {};
		var maxRowIndex = -1;
		var maxColIndex = -1;
		var minRowIndex = 10000;
		var minColIndex = 10000; 
		for(var i = 0; i < selectedCellIds.length; i++){
			var cellId = selectedCellIds[i];
			allSelectedCellIds[cellId] = cellId;
			var cell = this.eg.getCell(cellId);
			var rowIndex = sheet.getRowIndexById(cell.rowId);
			var colIndex = sheet.getColumnIndexById(cell.columnId);
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
			if(cell.rowSpan > 1 || cell.colSpan　> 1){
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
			var rowId = sheet.getRowIdByIndex(i);
			for(var j = minColIndex; j <= maxColIndex; j++){
				var colId = sheet.getColumnIdByIndex(j);
				var cellId = sheetId + "_" + colId + "_" + rowId;
				var cell = this.eg.getCell(cellId);
				copyCellIds.push(cellId);
				if(!cell.isHidden()){
					if(allSelectedCellIds[cellId] == null){
						msgBox.alert({info:"不能复制多重区域."});
						return false;
					}
				}
			}
		}
		
		var range = {sheetId: sheetId, top: minRowIndex, bottom: maxRowIndex, left: minColIndex, right: maxColIndex};
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
				data: {
					sourceSheetId: sheetId,
					selectedCellIds: copyCellIds
				}, 
				text: copyText
			};					

			//如果复制后，粘贴前进行了以下操作，clipBoardData清空：合并、拆分单元格、删除插入列、删除插入行（尚未实现）
		}
	}

	this.cellPaste = function(event){
		var sheetId= this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId]; 
		$("#copyPasteInputId").focus();
		$("#copyPasteInputId").select();
		document.execCommand("paste");
		var pasteText = $("#copyPasteInputId").val();
		if(pasteText == this.clipBoardData.text){
			if(this.clipBoardData.operateType == "copyCell"){
				var targetCellIds = this.getSelectedCellIds(sheetId);
				var copyData = this.clipBoardData.data;
				var selectedCellIds = copyData.selectedCellIds;
				var sourceSheetId = copyData.sourceSheetId;
				var sourceSheet = this.eg.allSheets[sourceSheetId];

				var minTargetRowIndex = 10000;
				var minTargetColIndex = 10000;
				for(var i = 0; i < targetCellIds.length; i++){
					var cellId = targetCellIds[i]; 
					var cell = this.eg.getCell(cellId);
					var rowIndex = sheet.getRowIndexById(cell.rowId);
					var colIndex = sheet.getColumnIndexById(cell.columnId); 
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
					var cell = this.eg.getCell(cellId);
					var rowIndex = sourceSheet.getRowIndexById(cell.rowId);
					var colIndex = sourceSheet.getColumnIndexById(cell.columnId);
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

				if(minTargetColIndex + sourceColCount > sheet.allColumns.length){
					msgBox.alert({info:"目标区域列数不足"}); 
				}
				else if(minTargetRowIndex + sourceRowCount > sheet.allRows.length){
					msgBox.alert({info:"目标区域行数不足"}); 
				}
				else {
					var targetRange = {sheetId: sheetId, left: minTargetColIndex, right: minTargetColIndex + sourceColCount - 1, top: minTargetRowIndex, bottom: minTargetRowIndex + sourceRowCount - 1};
					if(this.checkAllGroupCellInRange(targetRange)){
						var sourceRange = {
								sheetId: sourceSheetId,
								left: minSourceColIndex, 
								right: maxSourceColIndex,
								top: minSourceRowIndex,
								bottom: maxSourceRowIndex
							}; 
						if(this.checkCanPasteToSameRange(sourceRange, targetRange)){
							this.pasteRangeFromRange(sourceRange, targetRange);
							this.setCurrentCellByCellId(this.currentCellId);
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
		var sheetId= this.currentSheetId; 
		var allClearCellIds = this.getSelectedCellIds(sheetId); 
		this.clearContentByCellIds(allClearCellIds);
	}
			
	//合并单元格
	this.cellMerge = function(event){ 
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var selectedCellIds = this.getSelectedCellIds(sheetId);
		
		var allSelectedCellIds = {};
		var maxRowIndex = -1;
		var maxColIndex = -1;
		var minRowIndex = 10000;
		var minColIndex = 10000;
		for(var i = 0; i < selectedCellIds.length; i++){
			var cellId = selectedCellIds[i];
			allSelectedCellIds[cellId] = cellId;
			var cell = this.eg.getCell(cellId);
						
			var rowIndex = sheet.getRowIndexById(cell.rowId);
			var colIndex = sheet.getColumnIndexById(cell.columnId);
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
			if(cell.isGroupMain()){
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
		
		//判断是否都是冻结的，或者都是非冻结的
		var minRow = sheet.allRows[minRowIndex];
		var maxRow = sheet.allRows[maxRowIndex];
		var minCol = sheet.allColumns[minColIndex];
		var maxCol = sheet.allColumns[maxColIndex];
		if((minRow.isFrozen != maxRow.isFrozen) || (minCol.isFrozen != maxCol.isFrozen)){
			msgBox.alert({info:"选中区域单元格有些为冻结，有些为非冻结."});
			return false;
		}
		
		for(var i = minRowIndex; i <= maxRowIndex; i++){
			var rowId = sheet.getRowIdByIndex(i);
			for(var j = minColIndex; j <= maxColIndex; j++){
				var colId = sheet.getColumnIdByIndex(j);
				var cellId = sheetId + "_" + colId + "_" + rowId;
				var cell = this.eg.getCell(cellId);
				if(!cell.isHidden()){
					if(allSelectedCellIds[cellId] == null){
						msgBox.alert({info:"不能合并多重区域."});
						return false;
					}
				}
			}
		}
		
		var range = {sheetId: sheetId, top: minRowIndex, bottom: maxRowIndex, left: minColIndex, right: maxColIndex};
		if(this.checkAllGroupCellInRange(range)) {
			
			this.eg.mergeCells(sheetId, range);

			for(var i = minRowIndex; i <= maxRowIndex; i++){ 
				var rowId = sheet.getRowIdByIndex(i);
				for(var j = minColIndex; j <= maxColIndex; j++){ 
					var colId = sheet.getColumnIdByIndex(j);
					var cellId = sheetId + "_" + colId + "_" + rowId;
					this.refreshCellDisplay(cellId, j, i);
				}						
			} 
			
			var groupCellId = sheetId + "_" + minCol.id + "_" + minRow.id;
			var groupCellElementId = that.containerId + "_" + groupCellId;
			that.selectCell(sheetId, groupCellElementId, false, false, false);			 
		}
	}
			
	//取消合并单元格
	this.cellUnmerge = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];
		var selectedCellIds = this.getSelectedCellIds(sheetId); 
		for(var i = 0; i < selectedCellIds.length; i++){
			var cellId = selectedCellIds[i];
			var needRefreshCells = this.eg.unmergeCells(cellId);
			if(needRefreshCells != null){ 
				for(var j = 0; j < needRefreshCells.length; j++){ 
					var refreshCell = needRefreshCells[j]; 
					var colIndex = sheet.getColumnIndexById(refreshCell.columnId);
					var rowIndex = sheet.getRowIndexById(refreshCell.rowId); 
					this.refreshCellDisplay(refreshCell.id, colIndex, rowIndex);
					var cellElementId = this.containerId + "_" + refreshCell.id;
					$("#" + cellElementId).addClass("selectedCell");
				}
			}
		} 
		this.setCurrentCellByCellId(null);
	}
	
	this.freezeRows = function(sheetId, rowIds, isFrozen){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var row = sheet.getRowById(rowId);
			row.isFrozen = isFrozen;				
		}
		for(var i = 0; i < rowIds.length; i++){			
			var rowId = rowIds[i]; 
			$("#" + sheetLayoutId).find("div[rowId='" + rowId + "']").remove(); 
		}					
		var areaSize = this.getAllAeraSize(sheetId);
		
		for(var i = 0; i < rowIds.length; i++){
			var rowId = rowIds[i];
			var row = sheet.getRowById(rowId);
			
			this.showRowAfterPrevious(sheetId, row);	
			
			for(var j = 0; j < sheet.allColumns.length; j++){
				var colId = sheet.getColumnIdByIndex(j);
				var cell = this.eg.getCell(sheetId + "_" +colId + "_" + rowId);
				this.showCellAfterPrevious(sheetId, cell, areaSize); 
			} 
		}	
	}
	
	this.freezeColumns = function(sheetId, colIds, isFrozen){
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];
			var col = sheet.getColumnById(colId);
			col.isFrozen = isFrozen;				
		}
		for(var i = 0; i < colIds.length; i++){			
			var colId = colIds[i]; 
			$("#" + sheetLayoutId).find("div[colId='" + colId + "']").remove();
		}					
		var areaSize = this.getAllAeraSize(sheetId);
		
		for(var i = 0; i < colIds.length; i++){
			var colId = colIds[i];
			var col = sheet.getColumnById(colId);
			
			this.showColumnAfterPrevious(sheetId, col);	
			
			for(var j = 0; j < sheet.allRows.length; j++){
				var rowId = sheet.getRowIdByIndex(j);
				var cell = this.eg.getCell(sheetId + "_" + colId + "_" + rowId);
				this.showCellAfterPrevious(sheetId, cell, areaSize); 
			} 
		}
	}
			
	//冻结窗格
	this.freezeForm = function(event){
		var currentCellId = this.currentCellId;
		var currentCell = this.eg.getCell(currentCellId);
		var sheetId = currentCell.sheetId;
		var checkResult = this.checkFreeze(sheetId, currentCell.columnId, currentCell.rowId);
		
		if(checkResult.succeed){
			if(checkResult.unFrozenRowIds != null && checkResult.unFrozenRowIds.length > 0){
				this.freezeRows(sheetId, checkResult.unFrozenRowIds, false);
			}
			if(checkResult.frozenRowIds != null && checkResult.frozenRowIds.length > 0){
				this.freezeRows(sheetId, checkResult.frozenRowIds, true);
			} 
			if(checkResult.unFrozenColIds != null && checkResult.unFrozenColIds.length > 0){
				this.freezeColumns(sheetId, checkResult.unFrozenColIds, false);
			}
			if(checkResult.frozenColIds != null && checkResult.frozenColIds.length > 0){
				this.freezeColumns(sheetId, checkResult.frozenColIds, true);
			}
			this.refreshAllColumnNames(sheetId);
			this.refreshAllCellPosition(sheetId);
			this.resizeGridLayout(sheetId);		
		}
		else{
			var errorStr = cmnPcr.arrayToString(checkResult.errors, "。");
			msgBox.alert({info: errorStr});
		} 
	}
	
	this.checkFreeze = function(sheetId, unFrozenColId, unFrozenRowId){
		var sheet = this.eg.allSheets[sheetId];
		var checkResult = {
			succeed: true, 
			errors: new Array()
		};
		
		var unFrozenColIndex = sheet.getColumnIndexById(unFrozenColId);
		var unFrozenRowIndex = sheet.getRowIndexById(unFrozenRowId); 
		if(unFrozenColIndex == 0 && unFrozenRowIndex == 0){
			checkResult.succeed = true;
		}
		if(unFrozenColIndex > 0){
			for(var rowIndex = 0; rowIndex < sheet.allRows.length; rowIndex++){
				var rowId = sheet.getRowIdByIndex(rowIndex);
				var cellId = sheetId + "_" + unFrozenColId + "_" + rowId;
				var cell = this.eg.getCell(cellId);
				if(cell.isHidden()){
					var groupCell = that.eg.getCell(cell.groupCellId);
					if(groupCell.columnId != unFrozenColId){
						var groupCellName = this.getCellName(cell.groupCellId);
						checkResult.errors.push("不能冻结合并单元格" + groupCellName + "的一部分");
						checkResult.succeed = false;
					}
				}
			}
		}
		if(unFrozenRowIndex > 0){
			for(var colIndex = 0; colIndex < sheet.allColumns.length; colIndex++){
				var colId = sheet.getColumnIdByIndex(colIndex);
				var cellId = sheetId + "_" + colId + "_" + unFrozenRowId;
				var cell = this.eg.getCell(cellId);
				if(cell.isHidden()){
					var groupCell = that.eg.getCell(cell.groupCellId);
					if(groupCell.rowId != unFrozenRowId){
						var groupCellName = this.getCellName(cell.groupCellId);
						checkResult.errors.push("不能冻结合并单元格" + groupCellName + "的一部分");
						checkResult.succeed = false;
					}
				}
			}
		}	

		if(checkResult.succeed){
			var unFrozenCol = sheet.allColumns[unFrozenColIndex];
			if(unFrozenCol.isFrozen){
				//其之后的且已经被冻结的，都需要被解冻
				var unFrozenColIds = new Array(); 
				for(var colIndex = unFrozenColIndex; colIndex < sheet.allColumns.length; colIndex++){
					var column = sheet.getColumnByIndex(colIndex);
					if(column.isFrozen){
						unFrozenColIds.push(column.id);
					} 
				}
				checkResult.unFrozenColIds = unFrozenColIds;				
			}
			else{
				//其之前的且没有被冻结的，都需要被冻结
				var frozenColIds = new Array(); 
				for(var colIndex = 0; colIndex < unFrozenColIndex; colIndex++){
					var column = sheet.getColumnByIndex(colIndex);
					if(!column.isFrozen){
						frozenColIds.push(column.id);
					} 
				}
				checkResult.frozenColIds = frozenColIds;
			}
			
			var unFrozenRow = sheet.allRows[unFrozenRowIndex];
			if(unFrozenRow.isFrozen){
				//其之后的且已经被冻结的，都需要被解冻
				var unFrozenRowIds = new Array(); 
				for(var rowIndex = unFrozenRowIndex; rowIndex < sheet.allRows.length - 1; rowIndex++){
					var row = sheet.getRowByIndex(rowIndex);
					if(row.isFrozen){
						unFrozenRowIds.push(row.id);
					} 
				}
				checkResult.unFrozenRowIds = unFrozenRowIds;				
			}
			else{
				//其之前的且没有被冻结的，都需要被冻结
				var frozenRowIds = new Array(); 
				for(var rowIndex = 0; rowIndex < unFrozenRowIndex; rowIndex++){
					var row = sheet.getRowByIndex(rowIndex);
					if(!row.isFrozen){
						frozenRowIds.push(row.id);
					} 
				}
				checkResult.frozenRowIds = frozenRowIds;
			}		
		}	
		
		return checkResult;
	}
			
	//选定下一个单元格
	this.selectUpCell = function(sheetId, colId, rowId){
		var sheet = this.eg.allSheets[sheetId];
		var rowIndex = sheet.getRowIndexById(rowId);
		while(rowIndex > 0){
			var upRowId = sheet.getRowIdByIndex(rowIndex - 1);
			var cellId = sheetId + "_" + colId + "_" + upRowId;
			var cell = this.eg.getCell(cellId);
			if(!cell.isHidden()){
				var upCellElementId = that.containerId + "_" + cellId;
				that.selectCell(sheetId, upCellElementId, false, false, false);
				break;
			}
			else{
				rowIndex = rowIndex - 1;
			}
		}				
		//$("#" + this.containerId).focus();
	}
			
	//选择上一个单元格
	this.selectDownCell = function(sheetId, colId, rowId){
		var sheet = this.eg.allSheets[sheetId];
		var rowIndex = sheet.getRowIndexById(rowId);
		var downCellId = null; 
		while(rowIndex + 1 < sheet.allRows.length){
			var downRowId = sheet.getRowIdByIndex(rowIndex + 1);
			var cellId = sheetId + "_" + colId + "_" + downRowId;
			var cell = this.eg.getCell(cellId);
			if(!cell.isHidden()){
				downCellId = cellId; 
				break;
			}
			else{
				rowIndex = rowIndex + 1;
			}
		}
		if(downCellId == null){
			downCellId = sheetId + "_" + colId + "_" + rowId;
		} 
		var downCellElementId = that.containerId + "_" + downCellId;
		that.selectCell(sheetId, downCellElementId, false, false, false);
		
		//$("#" + this.containerId).focus();
	}
	
	//选择前一个单元格
	this.selectLeftCell = function(sheetId, colId, rowId){
		var sheet = this.eg.allSheets[sheetId];
		var colIndex = sheet.getColumnIndexById(colId);
		while(colIndex > 0){
			var leftColId = sheet.getColumnIdByIndex(colIndex - 1);
			var cellId = sheetId + "_" + leftColId + "_" + rowId;
			var cell = this.eg.getCell(cellId);
			if(!cell.isHidden()){
				var leftCellElementId = that.containerId + "_" + cellId;
				that.selectCell(sheetId, leftCellElementId, false, false, false);
				break;
			}
			else{
				colIndex = colIndex - 1;
			}
		}		
		//$("#" + this.containerId).focus();		
	}
			
	//选择后一个单元格
	this.selectRightCell = function(sheetId, colId, rowId){
		var sheet = this.eg.allSheets[sheetId];
		var colIndex = sheet.getColumnIndexById(colId);
		while(colIndex + 1 < sheet.allColumns.length){
			var rightColId = sheet.getColumnIdByIndex(colIndex + 1);
			var cellId = sheetId + "_" + rightColId + "_" + rowId;
			var cell = this.eg.getCell(cellId);
			if(!cell.isHidden()){
				var rightCellElementId = that.containerId + "_" + cellId;
				that.selectCell(sheetId, rightCellElementId, false, false, false);
				break;
			}
			else{
				colIndex = colIndex + 1;
			}
		}
		//$("#" + this.containerId).focus();
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
       	var prefixExp = startPos == null ? text : text.substr(0, startPos);
       	var postfixExp = endPos == null ? "" : text.substr(endPos); 
       	$(that.cellOutEditor).attr("prefixExp", prefixExp);
       	$(that.cellOutEditor).attr("postfixExp", postfixExp);	
       	$(that.cellOutEditor).attr("clickedExp", "");				
	}
	
	//将单元格改为编辑状态
	this.beginCellEdit = function(cellId, needFocus){ 
		var cell = this.eg.getCell(cellId);
		var sheetId = cell.sheetId;
		var sheet = this.eg.allSheets[sheetId];
		var sheetLayoutId = this.getSheetLayoutControlId(sheetId);
		var cellElement = $("#" + this.containerId + "_" + cellId);
		var editorParent = $(cellElement);
		var editorId = this.containerId  + "_" + cellId + "_editor";
		var colIndex = sheet.getColumnIndexById(cell.columnId);
		var rowIndex = sheet.getRowIndexById(cell.rowId);
		var cellSize = this.getCellSize(cell, colIndex, rowIndex);	
		var width = cellSize.contentWidth - 1;
		var height = cellSize.contentHeight - 1;
		var cellLayoutInfo = that.getCellLayoutInfo(cellId);
		var editorId = this.containerId  + "_" + cellId + "_editor"; 
		$("#" + editorId).addClass("gridCellEditorEditing");
		$(editorParent).addClass("gridCellInnerDivEditing");
		$(cellElement).attr("editing", true);
		
		var cellSize = this.getCellSize(cell, colIndex, rowIndex); 
		$("#" + editorId).css({
			"border-width":1 + "px",
			left: cellLayoutInfo.left,
			top: cellLayoutInfo.top,
			width:(cellSize.contentWidth - 2) + "px",
			height:(cellSize.contentHeight - 2) + "px"
		}); 
		$("#" + editorId).val(that.getCellShowText(cell)); 
 		
		that.refreshEditingExpPosition($("#" + editorId)[0]); 
		$("#" + editorId).select(function(e){
			setTimeout(function(){
				that.refreshEditingExpPosition($("#" + editorId)[0]);
			}, 100); 
		});
		
		$("#" + editorId).focus(function(e){
			$(that.cellOutEditor).attr("enableEditor","in");
		});
		
		$("#" + editorId).change(function(e){
		/*
			var autoChange = $(that.cellOutEditor).attr("autoChange") == "true";
			if(!autoChange){
	           	$(that.cellOutEditor).removeAttr("prefixExp");
	           	$(that.cellOutEditor).removeAttr("postfixExp");	
	           	$(that.cellOutEditor).removeAttr("clickedExp");
			}
			*/
		});
		
		$("#" + editorId).keyup(function(e){
			var text = $(this).val();
			$(that.cellOutEditor).val(text);
		}); 
		$("#" + editorId).keydown(function(e){
			var sheetId = that.currentSheetId;
			var inputElmenent = $(this);
			var cellId = $(inputElmenent).attr("cellId");
			var cell = that.eg.getCell(cellId);
			var rowId = cell.rowId
			var colId = cell.columnId;
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
					var cellCtrlId = that.containerId + "_" + cellId;
					that.selectCell(sheetId, cellCtrlId, false, false, false);
					return false;
				}
				break;
				case 13:{
					if(e.altKey){
						//点击alt+enter，那么换行; 
						var cellId = sheetId + "_" + colId + "_" + rowId; 
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
						that.selectUpCell(sheetId, colId, rowId);
						that.cancelBubble(e);
					}
					else{
						//如果enter，那么接受编辑endEdit，然后定位到下一个单元格；
						that.endCellEdit(true); 
						that.selectDownCell(sheetId, colId, rowId);
						that.cancelBubble(e);
					}
					return false;
				}
				break;
				case 9:{
					if(e.shiftKey){
						//如果shift+tab，那么接受编辑endEdit，定位到前一个单元格。
						that.endCellEdit(true); 
						that.selectLeftCell(sheetId, colId, rowId);
						that.cancelBubble(e);
					}
					else{
						//如果tab，那么接受编辑endEdit，定位到后一个单元格；
						that.endCellEdit(true); 
						that.selectRightCell(sheetId, colId, rowId);
						that.cancelBubble(e);
					}
					return false;
				}
				break;
				default:{
					setTimeout(function(){
						that.refreshEditingExpPosition($("#" + editorId)[0]);
					}, 100);
					return true;
				}
			}
		});
		
		if(needFocus){
			$("#" + editorId).select();
		}
		else{
			var inputElement = $("#" + editorId)[0];
			var textLength = $(inputElement).val().length;
			that.selectTextInElement(inputElement, textLength);
		}
	}

	//跟新单元格值
	this.updateCellValue = function(cell, valueStr, needRemoveEffectCellsInCell){ 
		var hasValueChange = false;
		
		//如果是直接赋值
		if(valueStr == null || valueStr.length == 0 || valueStr[0] != "="){			
			//如果原来有公式，改为直接赋值了	
			if(cell.isExp){
				cell.isError = false;
				cell.note = "";	
				cell.expression = "";
				cell.isExp = false;
				if(needRemoveEffectCellsInCell){
					this.eg.removeEffectFromAllRefered(cell.id);
				} 
			}
			
			//重新判断一下输入的常量值的类型
			if(cmnPcr.isDecimal(valueStr)){
				cell.cellValueType = valueType.decimal;
			}
			else{
				cell.cellValueType = valueType.string;
			}
			var cellValueTypes = this.getCellValueTypes(); 
			cellValueTypes[cell.id] = cell.cellValueType;
			
			var newValue = cell.getValueObject(valueStr, cell.cellValueType);
			if(cell.value != newValue){
				cell.value = newValue;
				hasValueChange = true;
			}
		}
		else{		
			//如果公式改变了
			if(cell.expression != valueStr){
				cell.expression = valueStr;	
				cell.isExp = true;		
				var oldValue = cell.value;		
				cell.value = null;
				
				var allSheetColRows	= this.getSheetColRows();
				var cellValueTypes = this.getCellValueTypes(); 
				var vd = new ExcelGridValidator();
				var compileSucceed = vd.compileCellExp(this.eg, cellValueTypes, allSheetColRows, cell.id, needRemoveEffectCellsInCell);
				if(compileSucceed){						
					var newValue = null;
					try{
						newValue = this.runExp(cell);
						cell.isError = false;
						cell.note = "";
					}
					catch(ex){
						cell.isError = true;
						cell.note = ex.message;
					}					
					cell.value = newValue;
					hasValueChange = newValue != oldValue;
				}
			}
		}
		return hasValueChange;
	}
		
	//更新单元格显示
	this.getCellShowText = function(cell){
		if(cell.isExp){
			return cell.expression;
		}
		else{
			return cell.getShowText();
		}
	}
	
	this.afterEndCellEdit = function(cell){
	}	
	
	this.checkHasExpChange = function(cell, valueStr){
		if(valueStr.length == 0 || valueStr[0] != "="){		
			return cell.isExp;
		}
		else{
			return cell.expression != valueStr;
		}		
	}

	//将单元格改为浏览状态
	this.endCellEdit = function(aceptNewValue){
		var cellElements = $("#" + this.containerId).find("div[editing='true']");
		if(cellElements.length > 0){
			var cellElement = cellElements[0];
			var editorParent = $(cellElement);
			var sheetId = $(editorParent).attr("sheetId");
			var colId = $(editorParent).attr("colId");
			var rowId = $(editorParent).attr("rowId");
			var cellId = sheetId + "_" + colId + "_" + rowId;
			var inputElements = $("#" + this.containerId).find("textarea[cellId='" + cellId + "']");
			if(inputElements.length > 0) {
				var inputElement = inputElements[0]; 
				var sheet = this.eg.allSheets[sheetId];		 
				var cell = this.eg.getCell(cellId);
				
				if(aceptNewValue) {
					var value = $(inputElement).val();
					//cell.value = value;
					var hasExpChange = this.checkHasExpChange(cell, value);
					var hasValueChange = this.updateCellValue(cell, value, true);
							
					if(hasValueChange){			
						var effectCellIds = {};
						effectCellIds[cellId] = "";
						this.updateEffectCellValues(effectCellIds, hasExpChange);
					}
					
					this.afterEndCellEdit(cell);
				}
				
				
				var colIndex = sheet.getColumnIndexById(cell.columnId);
				var rowIndex = sheet.getRowIndexById(cell.rowId);
				var cellSize = this.getCellSize(cell, colIndex, rowIndex); 
				$(inputElement).css({
					left:-2 + "px",
					top:0 + "px",
					"border-width":0 + "px",
					width:(cellSize.contentWidth + 1) + "px",
					height:(cellSize.contentHeight - 1) + "px"
				});
				 
				$(inputElement).removeClass("gridCellEditorEditing");
				$(editorParent).removeClass("gridCellInnerDivEditing");
				$(cellElement).removeAttr("editing");
				this.refreshCellShowValue(cellId);
				$(inputElement).focus();
			}
			
			//外部编辑框显示当前单元格的内容
			var currentCells = $("#" + this.containerId).find("div[isCurrentCell='true']");
			if(currentCells.length > 0){
				var currentCell = currentCells[0]; 
				var sheetId = $(currentCell).attr("sheetId");
				var rowId = $(currentCell).attr("rowId");
				var colId = $(currentCell).attr("colId");
				var cell = this.eg.getCell(sheetId + "_" + colId + "_" + rowId);
				//$(that.cellOutEditor).val(cell.getShowText());
				$(that.cellOutEditor).val(that.getCellShowText(cell));
			}
			else{
				$(that.cellOutEditor).val("");
			}
		} 
	}
	
	this.getEventSheetId = function(event){
		var tabTitleElements = $(event.target).find("span[class='tabs-title']");
		if(tabTitleElements.length > 1){
			return null;
		}
		else{
			var sheetName = $(tabTitleElements[0]).text();
			for(var sheetId in this.eg.allSheets){
				var sheet = this.eg.allSheets[sheetId];
				if(sheet.name == sheetName){
					return sheet.id;
				}
			}
			return null;
		}		
	} 
	
	this.sheetToPrevious = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];		
		var prevousSheetIndex = -1;
		var prevousSheet= null;
		for(var sId in this.eg.allSheets){
			var s = this.eg.allSheets[sId];
			if(s.index > prevousSheetIndex && s.index < sheet.index){
				prevousSheetIndex = s.index;
				prevousSheet = s;
			}
		} 		
		if(prevousSheet != null){
			var tempIndex = prevousSheet.index;
			prevousSheet.index = sheet.index;
			sheet.index = tempIndex;			
			var currentSheetLi = $("#" + that.containerId).find("li[class='tabs-selected']");  
			var preSheetLi = $(currentSheetLi).prev();			 
			$(preSheetLi).insertAfter(currentSheetLi);		
		}	
	}
	
	this.sheetToNext = function(event){
		var sheetId = this.currentSheetId;
		var sheet = this.eg.allSheets[sheetId];		
		var nextSheetIndex = 10000;
		var nextSheet= null;
		for(var sId in this.eg.allSheets){
			var s = this.eg.allSheets[sId];
			if(s.index < nextSheetIndex && s.index > sheet.index){
				nextSheetIndex = s.index;
				nextSheet = s;
			}
		} 		
		if(nextSheet != null){
			var tempIndex = nextSheet.index;
			nextSheet.index = sheet.index;
			sheet.index = tempIndex;			
			var currentSheetLi = $("#" + that.containerId).find("li[class='tabs-selected']");  
			var nextSheetLi = $(currentSheetLi).next();			 
			$(nextSheetLi).insertBefore(currentSheetLi);		
		}	
	}
	
	this.sheetRename = function(event){
		var sheetId = that.currentSheetId;		
		var sheet = that.eg.allSheets[sheetId];
		msgBox.htmlWindow({
			title: "重命名 - 工作表",
			label: "请输入新的名称",
			text: sheet.name,
			type: "oneInputText",
			okFunction: function(p){
				if(that.renameSheet(sheetId, p.text)){
					p.closeWin();
				}
			}
		});
	}
	
	this.renameSheet = function(sheetId, newName){
		var newName = cmnPcr.trim(newName);
		if(newName.length == 0){
			msgBox.alert({info: "请输入名称"});
			return false;
		}
		else if(newName.startWith("'") || newName.endWith("'")){
			msgBox.alert({info: "表名不能用'开头或结尾"});
			return false;
		}
		else{		
			//判断重名
			for(var sId in this.eg.allSheets){
				if(sId != sheetId){
					var s = this.eg.allSheets[sId];
					if(s.name == newName){
						msgBox.alert({info: "重名"});
						return false;
					}
				}
			}
			
			var sheet = this.eg.allSheets[sheetId];
			if(sheet.name != newName){
				sheet.name = newName;
				
				//所有对此sheet的单元格的公式引用，都需要修改公式
				this.refreshAllCellReferance();				 
				$("#" + this.containerId).find("li[class='tabs-selected']").find("span[class='tabs-title']").text(newName);			
			}
			return true;
		}
	}
	
	this.sheetInsert = function(event){
		var sheetId = that.eg.createSheet({});
		that.initSheetLayoutContainer(sheetId);
		that.resizeGridLayout(sheetId);
		that.initSheetLayout(sheetId);
		this.refreshSheetColRows();
		this.refreshCellValueTypes();
		that.currentSheetId = sheetId;
	}
	
	this.sheetDelete = function(event){
		var sheetId = that.currentSheetId;
		var sheet = that.eg.allSheets[sheetId];
		if(msgBox.confirm({info: "确定删除'" + sheet.name + "'吗?"})){
			that.eg.deleteSheet(sheetId);
			
			this.refreshAllCellReferance();	
        	var currentTab = $("#" + that.containerId).tabs("getSelected"),
            currentTabIndex = $("#" + that.containerId).tabs("getTabIndex",currentTab);
         	$("#" + that.containerId).tabs("close",currentTabIndex);
		}
	}
	
	this.setCellBorderStyleByCellId = function(sheet, borderStyle, borderPosition, cellId){
		var cell = this.eg.getCell(cellId); 
		var cellBorderStyle = borderStyle == null ? null : cell.cssStyle["border" + borderPosition] == null ? (new ExcelGridBorderStyle()) : cell.cssStyle["border" + borderPosition];
		if(borderStyle != null){ 
			if(borderStyle.color != null){
				cellBorderStyle.color = borderStyle.color;
			} 
			if(borderStyle.width != null){
				cellBorderStyle.width = borderStyle.width; 
			} 
			if(borderStyle.style != null){
				cellBorderStyle.style = borderStyle.style; 
			}  
		}
		cell.cssStyle["border" + borderPosition]  = cellBorderStyle;
		
		if(borderPosition == "Right" || borderPosition == "Bottom"){
			var backgroundColor = cell.cssStyle.backgroundColor;
			var sizeValue = borderPosition == "Right" ? sheet.getColumnById(cell.columnId).width :  sheet.getRowById(cell.rowId).height;
			this.refreshCellBorderStyle(cellId, backgroundColor, cellBorderStyle, borderPosition, sizeValue);
		}
	}
	
	this.setCellBorderStyleByCellIds = function(sheet, borderStyle, cellPositions){
		for(var i = 0; i < cellPositions.length; i++){
			var cellPos = cellPositions[i];
			var cellId = cellPos.cellId;
			var position = cellPos.position;
			var cell = this.eg.getCell(cellId);
			if(cell.cssStyle == null){
				cell.cssStyle = new ExcelGridCssStyle();
			}			
			this.setCellBorderStyleByCellId(sheet, borderStyle, position, cellId); 
		}
	}
	
	
	this.setCellCssStyle = function(p){
		var sheetId = this.currentSheetId; 
		var sheet = this.eg.allSheets[sheetId]; 
		var cellIds = this.getSelectedCellIds(sheetId);
		
		for(var i = 0; i < cellIds.length; i++){
			var cellId = cellIds[i];
			var cell = this.eg.getCell(cellId);
			cell.cssStyle = new ExcelGridCssStyle();
			if(p.fontFamily != null){
				cell.cssStyle.fontFamily = p.fontFamily;
			}
			if(p.fontSize != null){
				cell.cssStyle.fontSize = p.fontSize;
			}
			if(p.fontStyle != null){
				cell.cssStyle.fontStyle = p.fontStyle;
			}
			if(p.textHAlign != null){
				cell.cssStyle.textHAlign = p.textHAlign;
			}
			if(p.textVAlign != null){
				cell.cssStyle.textVAlign = p.textVAlign;
			}
			if(p.color != null){
				cell.cssStyle.color = p.color;
			}
			if(p.backgroundColor != null){
				cell.cssStyle.backgroundColor = p.backgroundColor;
			} 
			 
			this.refreshCellInnerShowStyle(cell);
		}	
		
		var borderCellPositions = this.getBorderCellPos(cellIds, sheetId);
		this.setCellBorderStyleByCellIds(sheet, p.topBorderStyle, borderCellPositions.topBorderCellPos);
		this.setCellBorderStyleByCellIds(sheet, p.bottomBorderStyle, borderCellPositions.bottomBorderCellPos);
		this.setCellBorderStyleByCellIds(sheet, p.leftBorderStyle, borderCellPositions.leftBorderCellPos);
		this.setCellBorderStyleByCellIds(sheet, p.rightBorderStyle, borderCellPositions.rightBorderCellPos);
		this.setCellBorderStyleByCellIds(sheet, p.innerBorderStyle, borderCellPositions.innerBorderCellPos);
		this.setCellBorderStyleByCellIds(sheet, null, borderCellPositions.noneBorderCellPos);
	}

	this.refreshCellInnerShowStyle = function(cell){  
		var cssStyle = cell.cssStyle; 
		var backgroundColor = cssStyle == null || cssStyle.backgroundColor == null  || cssStyle.backgroundColor == "" ? "" : ("#" + cssStyle.backgroundColor);  
		
		var textVAlign = "";
		if (cssStyle == null || cssStyle.textVAlign == null) {
			 textVAlign = "middle";
		}
		else{
			switch(cssStyle.textVAlign){
				case cssTextAlignType.top:
					textVAlign = "top";
					break;
				case cssTextAlignType.middle:
					textVAlign = "middle";
					break;
				case cssTextAlignType.bottom:
					textVAlign = "bottom";
					break;
				default:
					textVAlign = "middle";
					break;
			}
		}
		
		var cellStyleJson = {
			"background-color": backgroundColor,
			"color": (cssStyle == null || cssStyle.color == null || cssStyle.color == "" ? "#000000" : ("#" + cssStyle.color)),
			"font-size": (cssStyle == null || cssStyle.fontSize == null ? "12px" : cssStyle.fontSize + "px"),
			"font-family": (cssStyle == null || cssStyle.fontFamily == null ? "'SimSun'" : cssStyle.fontFamily),
			"font-style": (cssStyle == null || cssStyle.fontStyle == null || cssStyle.fontStyle == cssFontStyle.bold ? "" : (cssStyle.fontStyle == cssFontStyle.italicBold ? cssFontStyle.italic : cssStyle.fontStyle)),
			"font-weight": (cssStyle == null || cssStyle.fontStyle == null ? "" : (cssStyle.fontStyle == cssFontStyle.italicBold || cssStyle.fontStyle == cssFontStyle.bold ? "600" : "400")),
			"vertical-align": textVAlign
		};
		var cellElement = $("#" + this.containerId + "_" + cell.id);
		
		var textHAlign = (cssStyle == null || cssStyle.textHAlign == null) ? cssTextAlignType.general : cssStyle.textHAlign; 
		var innerDivTextHAlign = ""; 
		switch(textHAlign){
			case cssTextAlignType.left: 
				innerDivTextHAlign = "left";
				break;
			case cssTextAlignType.center:
				innerDivTextHAlign = "center";
				break;
			case cssTextAlignType.right:
				innerDivTextHAlign = "right";
				break;
			case cssTextAlignType.general:
				innerDivTextHAlign = cell.cellValueType == valueType.decimal ? "right" : "left";
				break; 
		}
		var cellDiv = $(cellElement).children(".gridCellInnerDiv")[0];
		$(cellDiv).css(cellStyleJson);
		$(cellDiv).children("div").css({margin: "0 auto", "text-align": innerDivTextHAlign});
	}

	this.refreshCellShowStyle = function(cellId){
		var cell = this.eg.getCell(cellId);
		this.refreshCellInnerShowStyle(cell);
		
		var sheetId = cell.sheetId;
		var sheet = this.eg.allSheets[cell.sheetId];
		var cssStyle = cell.cssStyle;
		var bottomBorderStyle = cssStyle == null ? null : cssStyle.borderBottom;
		var rightBorderStyle = cssStyle == null ? null : cssStyle.borderRight;
		var backgroundColor = cssStyle == null || cssStyle.backgroundColor == null ? "" : cssStyle.backgroundColor;
		this.refreshCellBorderStyle(cellId, backgroundColor, rightBorderStyle, "Right");
		this.refreshCellBorderStyle(cellId, backgroundColor, bottomBorderStyle, "Bottom");
	}
	
	this.refreshCellBorderStyle = function(cellId, backgroundColor, borderStyle, borderPosition){
		var cellElement = $("#" + this.containerId + "_" + cellId);
		var defaultBorderColor = this.eg.hasGridLine ? "#CCCCCC" : "transparent";
		var borderColor = defaultBorderColor;
		if(borderStyle == null){
			backgroundColor = "transparent";
		}
		else{
			if(borderStyle.style == null || borderStyle.style == null){
				borderColor = defaultBorderColor;
			}
			else if(borderStyle.style == cssBorderStyleType.none){
				if(backgroundColor == null || backgroundColor == ""){
					borderColor = defaultBorderColor;
				}
				else{
					borderColor = "#" + backgroundColor;
				}
			}
			else{
				if(borderStyle.color == null || borderStyle.color == ""){
					borderColor = "#000000";
				}
				else{
					borderColor = "#" + borderStyle.color;
				}
			}
		}
		
		var borderType = (borderStyle == null || borderStyle.style == null || borderStyle.style == cssBorderStyleType.none) ? "solid" : borderStyle.style;
				
		var borderStyleStr = "1px " + borderColor + " " + borderType;
		$(cellElement).css("border-" + borderPosition, borderStyleStr);	
		var borderWidth = 1;	
		var sizePos = borderPosition == "Right" ? "width" : "height"; 
	}

	this.getBorderCellPos = function(cellIds, sheetId){
		var sheet = this.eg.allSheets[sheetId]; 
		//编辑所有的单元格，分别找到左、右、上、下、内框的值
		var topBorderCellPos = new Array();
		var bottomBorderCellPos = new Array();
		var leftBorderCellPos = new Array();
		var rightBorderCellPos = new Array(); 
		var innerBorderCellPos = new Array(); 
		var noneBorderCellPos = new Array(); 
		for(var i = 0; i < cellIds.length; i++){
			var cellId = cellIds[i];
			var cell = this.eg.getCell(cellId);
			
			var rowIndex = sheet.getRowIndexById(cell.rowId);
			var colIndex = sheet.getColumnIndexById(cell.columnId); 
			if(rowIndex != 0){
				var upRowIndex = rowIndex - 1;
				var upCell = this.eg.getCellByIndex(sheetId, colIndex, upRowIndex);
				if(!cellIds.contains(upCell.id)){
					topBorderCellPos.push({cellId: cellId, position: "Top"}); 
					topBorderCellPos.push({cellId: upCell.id, position: "Bottom"}); 
				}
				else{
					if(cell.isHidden() && (cell.groupCellId == upCell.id || cell.groupCellId == upCell.groupCellId)){
						noneBorderCellPos.push({cellId: cellId, position: "Top"});
					}
					else{
						innerBorderCellPos.push({cellId: cellId, position: "Top"});
					} 
				}
			}
			else{
				topBorderCellPos.push({cellId: cellId, position: "Top"}); 
			}
			if(colIndex != 0){
				var leftColIndex = colIndex - 1;
				var leftCell = this.eg.getCellByIndex(sheetId, leftColIndex, rowIndex);
				if(!cellIds.contains(leftCell.id)){
					leftBorderCellPos.push({cellId: cellId, position: "Left"}); 
					leftBorderCellPos.push({cellId: leftCell.id, position: "Right"}); 
				}
				else{
					if(cell.isHidden() && (cell.groupCellId == leftCell.id || cell.groupCellId == leftCell.groupCellId)){
						noneBorderCellPos.push({cellId: cellId, position: "Left"});
					}
					else{
						innerBorderCellPos.push({cellId: cellId, position: "Left"});
					} 
				}
			}
			else{
				leftBorderCellPos.push({cellId: cellId, position: "Left"}); 
			}
			if(rowIndex == sheet.allRows.length - 1){
				bottomBorderCellPos.push({cellId: cellId, position: "Bottom"}); 
			}
			else{
				var downRowIndex = rowIndex + 1;
				var downCell = this.eg.getCellByIndex(sheetId, colIndex, downRowIndex);
				if(!cellIds.contains(downCell.id)){
					bottomBorderCellPos.push({cellId: cellId, position: "Bottom"});
					bottomBorderCellPos.push({cellId: downCell.id, position: "Top"});
				}
				else{
					if(downCell.isHidden() && (cell.id == downCell.groupCellId || cell.groupCellId == downCell.groupCellId)){
						noneBorderCellPos.push({cellId: cellId, position: "Bottom"});
					}
					else{
						innerBorderCellPos.push({cellId: cellId, position: "Bottom"}); 
					}
				}
			}
			if(colIndex == sheet.allColumns.length - 1){
				rightBorderCellPos.push({cellId: cellId, position: "Right"}); 
			}
			else{
				var rightColIndex = colIndex + 1;
				var rightCell = this.eg.getCellByIndex(sheetId, rightColIndex, rowIndex);
				if(!cellIds.contains(rightCell.id)){
					rightBorderCellPos.push({cellId: cellId, position: "Right"}); 
					rightBorderCellPos.push({cellId: rightCell.id, position: "Left"}); 
				}
				else{
					if(rightCell.isHidden() && (cell.id == rightCell.groupCellId || cell.groupCellId == rightCell.groupCellId)){
						noneBorderCellPos.push({cellId: cellId, position: "Right"});
					}
					else{
						innerBorderCellPos.push({cellId: cellId, position: "Right"});
					}	 
				}
			} 
		}
		return {
			topBorderCellPos: topBorderCellPos,
			bottomBorderCellPos: bottomBorderCellPos,
			leftBorderCellPos: leftBorderCellPos,
			rightBorderCellPos: rightBorderCellPos,
			innerBorderCellPos: innerBorderCellPos,
			noneBorderCellPos: noneBorderCellPos
		};
	}
	
	this.getSameBorderStyle = function(borderCellPositions){
		var borderStyle = new ExcelGridBorderStyle({color: null, width: null, style: null});
		if(borderCellPositions.length > 0){
			var isSameColor = true;
			var isSameWidth = true;
			var isSameStyle = true;
			for(var i = 0; i < borderCellPositions.length; i++){
				var borderCellPosition = borderCellPositions[i]; 
				var cellId = borderCellPosition.cellId;
				var borderPosition = borderCellPosition.position;
				var cell = this.eg.getCell(cellId);
				if(cell.cssStyle != null && cell.cssStyle["border" + borderPosition] != null){
					var oneBorderStyle = cell.cssStyle["border" + borderPosition];
					if(isSameColor && oneBorderStyle.color != null){
						if(borderStyle.color == null){
							borderStyle.color = oneBorderStyle.color;
						}
						else{
							if(oneBorderStyle.color != borderStyle.color){
								borderStyle.color = "";
								isSameColor = false;
							}
						}
					}
					if(isSameWidth && oneBorderStyle.width != null){
						if(borderStyle.width == null){
							borderStyle.width = oneBorderStyle.width;
						}
						else{
							if(oneBorderStyle.width != borderStyle.width){
								borderStyle.width = null;
								isSameWidth = false;
							}
						}
					}
					if(isSameStyle && oneBorderStyle.style != null){
						if(borderStyle.style == null){
							borderStyle.style = oneBorderStyle.style;
						}
						else{
							if(oneBorderStyle.style != borderStyle.style){
								borderStyle.style = null;
								isSameStyle = false;
							}
						}
					}
				}
				if(!isSameColor && !isSameWidth && !isSameStyle){
					return borderStyle;
				}
			}
		}
		return borderStyle;
	} 
	
	this.getSelectedCellCssStyle = function(){
		var sheetId = this.currentSheetId; 
		var sheet = this.eg.allSheets[sheetId]; 
		var cellIds = this.getSelectedCellIds(sheetId);
		var borderCellPos = this.getBorderCellPos(cellIds, sheetId);
		
		var topBorderStyle = this.getSameBorderStyle(borderCellPos.topBorderCellPos);
		var bottomBorderStyle = this.getSameBorderStyle(borderCellPos.bottomBorderCellPos);
		var leftBorderStyle = this.getSameBorderStyle(borderCellPos.leftBorderCellPos);
		var rightBorderStyle = this.getSameBorderStyle(borderCellPos.rightBorderCellPos);
		var innerBorderStyle = this.getSameBorderStyle(borderCellPos.innerBorderCellPos);
		
		var outerBorderStyle = new ExcelGridBorderStyle({color: null, width: null, style: null});
		if(topBorderStyle.color == bottomBorderStyle.color 
			&& topBorderStyle.color == bottomBorderStyle.color 
			&& topBorderStyle.color == bottomBorderStyle.color 
			&& topBorderStyle.color == bottomBorderStyle.color){
			outerBorderStyle.color = topBorderStyle.color;
		}
		if(topBorderStyle.style == bottomBorderStyle.style 
			&& topBorderStyle.style == bottomBorderStyle.style 
			&& topBorderStyle.style == bottomBorderStyle.style 
			&& topBorderStyle.style == bottomBorderStyle.style){
			outerBorderStyle.style = topBorderStyle.style;
		}
		if(topBorderStyle.width == bottomBorderStyle.width 
			&& topBorderStyle.width == bottomBorderStyle.width 
			&& topBorderStyle.width == bottomBorderStyle.width 
			&& topBorderStyle.width == bottomBorderStyle.width){
			outerBorderStyle.width = topBorderStyle.width;
		}
				
		var fontFamily = null;
		var fontSize = null;
		var fontStyle = null;
		var color = null;
		var backgroundColor = null;
		var textHAlign = null;
		var textVAlign = null;
		var isSameFontFamily = true;
		var isSameFontSize = true;
		var isSameFontStyle = true;
		var isSameColor = true;
		var isSameBackgroundColor = true;
		var isSameTextHAlign = true;
		var isSameTextVAlign = true;
		
		for(var i = 0; i < cellIds.length; i++){
			var cellId = cellIds[i];
			var cell = this.eg.getCell(cellId);
			var cellCssStyle = cell.cssStyle;
			if(isSameFontFamily && cellCssStyle != null && cellCssStyle.fontFamily != null){
				if(fontFamily == null){
					fontFamily = cellCssStyle.fontFamily;
				}
				else{
					if(cellCssStyle.fontFamily != fontFamily){
						fontFamily = null;
						isSameFontFamily = false;
					}
				}
			}
			if(isSameFontSize && cellCssStyle != null && cellCssStyle.fontSize != null){
				if(fontSize == null){
					fontSize = cellCssStyle.fontSize;
				}
				else{
					if(cellCssStyle.fontSize != fontSize){
						fontSize = null;
						isSameFontSize = false;
					}
				}
			}
			if(isSameFontStyle && cellCssStyle != null && cellCssStyle.fontStyle != null){
				if(fontStyle == null){
					fontStyle = cellCssStyle.fontStyle;
				}
				else{
					if(cellCssStyle.fontStyle != fontStyle){
						fontStyle = null;
						isSameFontStyle = false;
					}
				}
			}
			if(isSameColor && cellCssStyle != null && cellCssStyle.color != null){
				if(color == null){
					color = cellCssStyle.color;
				}
				else{
					if(cellCssStyle.color != color){
						color = "";
						isSameColor = false;
					}
				}
			}
			if(isSameBackgroundColor && cellCssStyle != null && cellCssStyle.backgroundColor != null){
				if(backgroundColor == null){
					backgroundColor = cellCssStyle.backgroundColor;
				}
				else{
					if(cellCssStyle.backgroundColor != backgroundColor){
						backgroundColor = "";
						isSameBackgroundColor = false;
					}
				}
			}
			if(isSameTextHAlign && cellCssStyle != null && cellCssStyle.textHAlign != null){
				if(textHAlign == null){
					textHAlign = cellCssStyle.textHAlign;
				}
				else{
					if(cellCssStyle.textHAlign != textHAlign){
						textHAlign = null;
						isSameTextHAlign = false;
					}
				}
			}
			if(isSameTextVAlign && cellCssStyle != null && cellCssStyle.textVAlign != null){
				if(textVAlign == null){
					textVAlign = cellCssStyle.textVAlign;
				}
				else{
					if(cellCssStyle.textVAlign != textVAlign){
						textVAlign = null;
						isSameTextVAlign = false;
					}
				}
			}
		}
		return {		
			topBorderStyle: topBorderStyle,
			bottomBorderStyle: bottomBorderStyle,
			leftBorderStyle: leftBorderStyle,
			rightBorderStyle: rightBorderStyle,
			innerBorderStyle: innerBorderStyle,
			outerBorderStyle: outerBorderStyle,
			fontFamily: fontFamily,
			fontSize: fontSize,
			fontStyle: fontStyle,
			color: color,
			backgroundColor:backgroundColor,
			textHAlign:textHAlign,
			textVAlign:textVAlign
		};		
	}
	
	this.cssEditorWindow = null;
	this.showCssEditorWindow = function(p){
		if(this.cssEditorWindow == null){			
			this.cssEditorWindow = new CssEditorWindow({
				contentDivId: p.contentDivId,
				afterOkFunction: p.afterOkFunction
			});
		}
		var cellCssStyle = this.getSelectedCellCssStyle();
		this.cssEditorWindow.show(cellCssStyle);
	}
	
	this.setView = function(p){
		this.eg.hasGridLine = p.hasGridLine;
		this.eg.hasEditBar = p.hasEditBar;
		this.eg.hasSheetTitle = p.hasSheetTitle;
		this.eg.hasColumnRowTitle = p.hasColumnRowTitle;
		this.eg.hasPageTitle = p.hasPageTitle;
		this.setPageAndSheetTitleVisible(this.eg.hasSheetTitle, this.eg.hasEditBar, this.eg.hasPageTitle);
		
		this.setColumnRowTitleVisible(this.eg.hasColumnRowTitle);
		
		this.refreshGridLineVisible();
	} 
	
	this.setPageAndSheetTitleVisible = function(hasSheetTitle, hasEditBar, hasPageTitle){
		var pageTitleHeight = $("#" + that.bodyId).find(".headerBottom").height();
		var editBarHeight = $("#" + that.bodyId).find(".gridEditbar").height();
		var headerTopBarHeight = $("#" + that.bodyId).find(".headerTop").height(); 
		var tabHeight = $("#" + that.bodyId).find(".tabs-header").height() + 2;
		
		var editBarTop = !hasPageTitle ? headerTopBarHeight : (headerTopBarHeight + pageTitleHeight);
		var editBar = $("#" + this.bodyId).find(".gridEditbar")[0];
		$(editBar).css({"display": hasEditBar ? "block" : "none", "top": editBarTop});
		
		var pageTitleBar = $("#" + this.bodyId).find(".headerBottom")[0];
		$(pageTitleBar).css({"display": hasPageTitle ? "block" : "none"});
		
		var height = (!hasSheetTitle && !hasEditBar && !hasPageTitle) ? (headerTopBarHeight - tabHeight) : ((hasSheetTitle ? headerTopBarHeight : (headerTopBarHeight - tabHeight)) + (hasEditBar ? editBarHeight : 0) + (hasPageTitle ? pageTitleHeight : 0)) - 1; 
		$("#" + this.bodyId).layout("panel", "north").panel("resize", {height: height});
		$("#" + this.bodyId).layout("resize");
		
		$("#" + this.bodyId).find(".tabs-panels").css("border-style", hasSheetTitle ? "solid" : "none");
	}
	
	this.setColumnRowTitleVisible = function(hasColumnRowTitle){
		$("#" + this.bodyId).find(".titleCell").css("display", hasColumnRowTitle ? "" : "none");
		for(var sheetId in this.eg.allSheets){
			this.resizeGridLayout(sheetId);
		}
	}
	
	this.refreshGridLineVisible = function(){
		for(var cellId in this.eg.allCells){
			this.refreshCellShowStyle(cellId);
		}
	}
	
	this.viewEditorWindow = null;
	this.showViewEditorWindow = function(p){
		if(this.viewEditorWindow == null){			
			this.viewEditorWindow = new ViewEditorWindow({
				contentDivId: p.contentDivId,
				afterOkFunction: p.afterOkFunction
			});
		} 
		this.viewEditorWindow.show({
			hasGridLine: this.eg.hasGridLine,
			hasEditBar: this.eg.hasEditBar,
			hasSheetTitle: this.eg.hasSheetTitle,
			hasColumnRowTitle: this.eg.hasColumnRowTitle,
			hasPageTitle: this.eg.hasPageTitle
		});
	}
	
	this.init = function(p){
		this.bodyId = p.bodyId;
		this.containerId = p.containerId;	
		this.sheetlayoutModuleId = p.sheetlayoutModuleId;	
		this.toolbarContainerId = p.toolbarContainerId;	
		this.titleContainerId = p.titleContainerId;	
		this.subTitleContainerId = p.subTitleContainerId;	
		
		this.cellOutEditor = $("#" + p.cellOutEditorId)[0];
		this.currentCellInfoDiv = $("#" + p.currentCellInfoDivId)[0];
	}
	
	this.init(p);
}