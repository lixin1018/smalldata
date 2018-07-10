function ExcelGrid(){

	this.defaultColumnWidth = 80;
	this.defaultRowHeight = 20;
	
	//显示网格线
	this.hasGridLine = true;
	
	//显示编辑栏
	this.hasEditBar = true;
	
	//显示行列标题
	this.hasColumnRowTitle = true;
	
	//显示Sheet标题
	this.hasSheetTitle = true;
	
	//显示Page标题
	this.hasPageTitle = true;
	
	//所有sheet页
	this.allSheets = {};
	
	//所有单元格
	this.allCells = {};
	
	this.setCell = function(cellId, cellObj){
		this.allCells[cellId] = cellObj;
	}
	this.deleteCell = function(cellId){
		delete this.allCells[cellId];
	}
	
	this.getCell = function(cellId){ 
		return this.allCells[cellId]; 
	}
	
	this.getSheetByName = function(name){
		for(var sheetId in this.allSheets){
			var sheet = this.allSheets[sheetId];
			if(sheet.name == name){
				return sheet;
			}
		}
		return null;
	}
	
	
	//根据行列序号获取单元格
	this.getCellByIndex = function(sheetId, columnIndex, rowIndex){
		var sheet = this.allSheets[sheetId];
		var allColumns = sheet.getAllColumns();
		var allRows = sheet.getAllRows();
		if(columnIndex >= 0 && columnIndex < allColumns.length
			&& rowIndex >=0 && rowIndex < allRows.length){					
			var column = sheet.getColumnByIndex(columnIndex);
			var row = sheet.getRowByIndex(rowIndex);
			var cell = this.getCell(sheetId + "_" + column.id + "_" + row.id);
			return cell;
		}
		else{
			return null;
		}
	}
	
	//获取单元格值
	this.getCellValue = function(sheetId, columnId, rowId){
		var cellId = sheetId + "_" + columnId + "_" + rowId;		
		var cell = this.getCell(cellId);
		return cell == null ? null : cell.value;
	}
	
	this.getRangeValue = function(sheetId, fromColId, fromRowId, toColId, toRowId){
		var rangeValue = new ExcelGridRangeValue();
		rangeValue.init(this, sheetId, fromColId, fromRowId, toColId, toRowId);
		return rangeValue;
	}
	
		
	//粘贴后的单元格，更新其表达式
	this.reBuildCellExpressionAfterPaste = function(cell, rowStep, colStep){
		var hasRefChange = false;
		if(cell.isExp){
			if(cell.expPartList != null){
				var sheetId = cell.sheetId; 
				var newExp = this.reBuildCellExpressionAfterPasteByExpParts(sheetId, cell.expPartList, rowStep, colStep); 
				return newExp; 
			}
		} 
		return null;
	}
	
	//根据expParts重新构造单元格表达式
	this.reBuildCellExpressionAfterPasteByExpParts = function(sheetId, expPartList, rowStep, colStep){ 
		var newExp = null;
		if(expPartList != null && expPartList.length > 0){
			newExp = "=";
			for(var i = 0; i< expPartList.length; i++){
				var expPart = expPartList[i];
				var partStr = "";
				switch(expPart.getPartType()){
					case partType.Constant: 
						if(expPart.getResultType().toLowerCase() == valueType.string){
							partStr = "\"" + expPart.getText() + "\"";
						}
						else{
							partStr = expPart.getText();
						}
						break;
					case partType.Unknown:  
					case partType.Number:  
					case partType.Function:
					case partType.Operator:
					case partType.Bracket:
						partStr = expPart.getText();
					break;
					case partType.CellReferance:						
						var refSheetId = expPart.getCRefSheetId();
						var refSheet = this.allSheets[refSheetId]; 
						if(sheetId == refSheetId){
							partStr = this.reBuildCellReferanceAfterPaste(refSheetId, expPart.cellRefInfo, rowStep, colStep);
						}
						else{
							partStr = this.formatSheetNameInCellRef(refSheet.name) + "!" + this.reBuildCellReferanceAfterPaste(refSheetId, expPart.cellRefInfo, 0, 0);
						}
					break;
					case partType.RangeReferance:					
						var refSheetId = expPart.getCRefSheetId(); 
						var refSheet = this.allSheets[refSheetId]; 
						if(sheetId == refSheetId){
							partStr = this.reBuildCellReferanceAfterPaste(expPart.fromCellRefInfo, rowStep, colStep)
								+ ":" 
								+ this.reBuildCellReferanceAfterPaste(expPart.toCellRefInfo, rowStep, colStep);		
						}				 
						else {
							partStr = this.formatSheetNameInCellRef(refSheet.name) + "!"
								+ this.reBuildCellReferanceAfterPaste(expPart.fromCellRefInfo, 0, 0)
								+ ":" 
								+ this.reBuildCellReferanceAfterPaste(expPart.toCellRefInfo, 0, 0);		
						}				 
					break;
				}
				newExp += partStr;
			} 
		}
		return newExp;
	}
	
	//判断是否包含引用
	this.checkHasReferance = function(expPartList){ 
		var hasRef = false;
		if(expPartList != null && expPartList.length > 0){
			for(var i = 0; i< expPartList.length; i++){
				var expPart = expPartList[i];
				switch(expPart.getPartType()){
					case partType.Constant: 
					case partType.Unknown:  
					case partType.Number:  
					case partType.Function:
					case partType.Operator:
					case partType.Bracket:
						break;						
					case partType.CellReferance:
					case partType.RangeReferance:
						return true;
				}
			} 
		}
		return false;
	}
	
	this.reBuildCellReferanceAfterPaste = function(refSheetId, cellRefInfo, rowStep, colStep){
		var sheet = this.allSheets[refSheetId];						
		var newColName = cellRefInfo.colName == "" 
						? "" 
						: (cellRefInfo.colAbsolute 
							? ("$" + cellRefInfo.colName) 
							: sheet.getColumnNameByIndex(sheet.getColumnIndexById(cellRefInfo.colId) + colStep));
		var newRowName = cellRefInfo.rowName == "" 
						? "" 
						: (cellRefInfo.rowAbsolute 
							? ("$" + cellRefInfo.rowName) 
							: (sheet.getRowIndexById(cellRefInfo.rowId) + rowStep + 1).toString());
	
		return newColName + newRowName;
	}
	
	this.formatSheetNameInCellRef = function(sheetName){
		//增加引号
		if(sheetName[0] =="'"){
			sheetName = sheetName.subStr(1);
		}
		if(sheetName[sheetName.length - 1] == "'"){
			sheetName = sheetName.subStr(0, sheetName.length - 1);
		}
		sheetName = "'" + cmnPcr.replace(sheetName, "'", "''") + "'";
		return sheetName;
	}
	
	this.getSheetNameFromCellRef = function(sheetName){
		//增加引号
		if(sheetName[0] =="'"){
			sheetName = sheetName.subStr(1);
		}
		if(sheetName[sheetName.length - 1] == "'"){
			sheetName = sheetName.subStr(0, sheetName.length - 1);
		}
		sheetName = cmnPcr.replace(sheetName, "''", "'");
		return sheetName;
	}
		
	//刷新所有的单元格引用，由于行列变化，单元格引用的名称要改变，表达式也变化
	this.reBuildCellExpression = function(cell){
		var hasRefChange = false;
		if(cell.isExp){
			if(cell.expPartList != null){ 
				var sheetId = cell.sheetId;
				if(this.reCheckCellRefNameByExpParts(sheetId, cell.expPartList)){ 
					var newExp = this.reBuildCellExpressionByExpParts(sheetId, cell.expPartList); 
					return newExp;
				}
			}
		} 
		return null;
	} 
	
	//根据expParts重新构造单元格表达式
	this.reBuildCellExpressionByExpParts = function(sheetId, expPartList){ 
		var newExp = null;
		if(expPartList != null && expPartList.length > 0){
			newExp = "=";
			for(var i = 0; i< expPartList.length; i++){
				var expPart = expPartList[i];
				var partStr = "";
				switch(expPart.getPartType()){
					case partType.Constant: 
						if(expPart.getResultType().toLowerCase() == valueType.string){
							partStr = "\"" + expPart.getText() + "\"";
						}
						else{
							partStr = expPart.getText();
						}
						break;
					case partType.Unknown:  
					case partType.Number:  
					case partType.Function:
					case partType.Operator:
					case partType.Bracket:
					case partType.Comma:
						partStr = expPart.getText();
					break;
					case partType.CellReferance:
						var refSheetId = expPart.getCRefSheetId();
						var refSheet = this.allSheets[refSheetId]; 
						if(refSheet == null){
							partStr = "#REF!";
						}
						else{
							partStr = (sheetId == refSheetId ? "" : (this.formatSheetNameInCellRef(refSheet.name) + "!")) 
								+ ((expPart.cellRefInfo.colId == "") ? "" : ((expPart.cellRefInfo.colAbsolute ? "$" : "") + expPart.cellRefInfo.colName))
								+ ((expPart.cellRefInfo.rowId == "") ? "" : ((expPart.cellRefInfo.rowAbsolute ? "$" : "") + expPart.cellRefInfo.rowName));
						}
					break;
					case partType.RangeReferance:
						var refSheetId = expPart.getCRefSheetId();
						var refSheet = this.allSheets[refSheetId]; 
						if(refSheet == null){
							partStr = "#REF!";
						}
						else{
							partStr = (sheetId == refSheetId ? "" : (this.formatSheetNameInCellRef(refSheet.name) + "!"))  
								+ ((expPart.fromCellRefInfo.colId == "") ? "" : ((expPart.fromCellRefInfo.colAbsolute ? "$" : "") + expPart.fromCellRefInfo.colName))
								+ ((expPart.fromCellRefInfo.rowId == "") ? "" : ((expPart.fromCellRefInfo.rowAbsolute ? "$" : "") + expPart.fromCellRefInfo.rowName))
								+ ":"
								+ ((expPart.toCellRefInfo.colId == "") ? "" : ((expPart.toCellRefInfo.colAbsolute ? "$" : "") + expPart.toCellRefInfo.colName))
								+ ((expPart.toCellRefInfo.rowId == "") ? "" : ((expPart.toCellRefInfo.rowAbsolute ? "$" : "") + expPart.toCellRefInfo.rowName));
						}
					break;
				}
				newExp += partStr;
			} 
		}
		return newExp;
	}
	
	this.reBuildCellRefName = function(refSheetId, cellRefInfo){
		var sheet = this.allSheets[refSheetId];
		var errorRefText = "#REF!";
		var colId = cellRefInfo.colId;
		var oldColName = cellRefInfo.colName;
		var rowId = cellRefInfo.rowId;
		var oldRowName = cellRefInfo.rowName;
		
		var hasError = false;
		var hasChange = false;
		var newColName = sheet ==null ? "" : sheet.getColumnNameById(cellRefInfo.colId);  
		var rowIndex = sheet ==null ? -1 : sheet.getRowIndexById(cellRefInfo.rowId);
		if(newColName == "" && cellRefInfo.colId != ""){
			newColName = errorRefText;
			hasChange = true;
			hasError = true;
		}
		if(rowIndex < 0 && cellRefInfo.rowId != ""){
			newRowName = errorRefText;
			hasChange = true;
			hasError = true;
		}
		else{
			var newRowName = (rowIndex + 1).toString();
			if(newColName != oldColName || newRowName != oldRowName){
				hasChange = true;
			}				
		}	
		return {hasChange: hasChange, rowName: newRowName, colName: newColName, hasError: hasError};		
	} 
	
	//刷新此个单元格名称引用cellRefInfo，由于行列变化，单元格引用的名称要改变
	this.reCheckCellRefNameByExpParts = function(sheetId, expPartList){
		var hasChange = false;
		for(var i = 0; i < expPartList.length; i++){
			var expPart = expPartList[i];
			if(this.reCheckCellRefNameByExpPart(sheetId, expPart)){
				hasChange = true;
			}
		}
		return hasChange;
	} 
	
	//刷新此个单元格名称引用cellRefInfo，由于行列变化，单元格引用的名称要改变
	this.reCheckCellRefNameByExpPart = function(sheetId, expPart){
		var hasChange = false;
		if(expPart.getPartType() == partType.CellReferance){
			var refSheetId = expPart.getCRefSheetId();
			var refSheet = this.allSheets[refSheetId];
			var cellRefCheckInfo = this.reBuildCellRefName(refSheetId, expPart.cellRefInfo);
			if(cellRefCheckInfo.hasError){
				expPart.cellRefInfo.rowName = cellRefCheckInfo.rowName;
				expPart.cellRefInfo.colName = cellRefCheckInfo.colName;
				expPart.text = "#REF!";
				hasChange = true;
			}
			else if(expPart.getCRefSheetName() != refSheet.name || cellRefCheckInfo.hasChange){
				expPart.cellRefInfo.rowName = cellRefCheckInfo.rowName;
				expPart.cellRefInfo.colName = cellRefCheckInfo.colName;
				expPart.text = (sheetId == refSheetId ? "" : (this.formatSheetNameInCellRef(refSheet.name) + "!")) 
					+ cellRefCheckInfo.colName + cellRefCheckInfo.rowName;
				hasChange = true;
			}		
		}
		else if(expPart.getPartType() == partType.RangeReferance){
			var refSheetId = expPart.getCRefSheetId();
			var refSheet = this.allSheets[refSheetId];
			var fromCellRefCheckInfo = this.reBuildCellRefName(refSheetId, expPart.fromCellRefInfo); 
			
			if(fromCellRefCheckInfo.hasError){
				expPart.fromCellRefInfo.rowName = fromCellRefCheckInfo.rowName;
				expPart.fromCellRefInfo.colName = fromCellRefCheckInfo.colName; 
			}
			else if(fromCellRefCheckInfo.hasChange){
				expPart.fromCellRefInfo.rowName = fromCellRefCheckInfo.rowName;
				expPart.fromCellRefInfo.colName = fromCellRefCheckInfo.colName;
			}		
			var toCellRefCheckInfo = this.reBuildCellRefName(refSheetId, expPart.toCellRefInfo); 
			if(toCellRefCheckInfo.hasError){
				expPart.toCellRefInfo.rowName = toCellRefCheckInfo.rowName;
				expPart.toCellRefInfo.colName = toCellRefCheckInfo.colName; 
			}
			else if(toCellRefCheckInfo.hasChange){
				expPart.toCellRefInfo.rowName = toCellRefCheckInfo.rowName;
				expPart.toCellRefInfo.colName = toCellRefCheckInfo.colName;
			}		
			
			if(fromCellRefCheckInfo.hasError || toCellRefCheckInfo.hasError){
				expPart.text = "#REF!";
				hasChange = true;
			}
			else if(expPart.getCRefSheetName() != refSheet.name || fromCellRefCheckInfo.hasChange || toCellRefCheckInfo.hasChange){
				expPart.text = (sheetId == refSheetId ? "" : (this.formatSheetNameInCellRef(refSheet.name) + "!")) 
					+ fromCellRefCheckInfo.colName + fromCellRefCheckInfo.rowName + ":" + toCellRefCheckInfo.colName + toCellRefCheckInfo.rowName;
				hasChange = true;
			}
		} 
		return hasChange; 
	}
	
	//获取区域内的所有单元格Id
	this.rangeCellIds = function(cellAId, cellBId){
		var cellA = this.getCell(cellAId);
		var cellAColumnIndex = this.getColumnIndexById(cellA.columnId);
		var cellARowIndex = this.getRowIndexById(cellA.rowId);
		
		var cellB = this.getCell(cellBId);
		var cellBRowIndex = this.getRowIndexById(cellB.rowId);
		
		var sheetId = cellA.sheetId;
		var sheet = this.allSheets[sheetId];

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
		
		var allColumns = sheet.getAllColumns();
		var allRows = sheet.getAllRows();
		
		var allRowIds = new Array();
		var allColumnIds = new Array();
		for(var i = fromColumnIndex; i <= toColumnIndex; i++){
			var columnId = allColumns[i].id;
			allColumnIds.push(columnId);
		}
		for(var i = fromRowIndex; i <= toRowIndex; i++){
			var rowId = allRows[i].id;
			allRowIds.push(rowId);
		}
		
		var allRangeCellIds = new Array();
		for(var i = 0; i < allColumnIds.length; i++){
			var columnId = allColumnIds[i];
			for(var j = 0; j < allRowIds.length; j++){
				var rowId = allRowIds[j];
				allRangeCellIds.push(sheetId + "_" + columnId + "_" + rowId);
			}
		}
		return allRangeCellIds;
	}
			
	//合并单元格
	this.mergeCells = function(sheetId, range){	
		var sheet = this.allSheets[sheetId];
		
		var left = range.left;	
		var right = range.right;	
		var top = range.top;	
		var bottom = range.bottom;

		var groupCellId = sheetId + "_" + sheet.getColumnIdByIndex(left) + "_" + sheet.getRowIdByIndex(top);
		var groupCell = this.getCell(groupCellId);
		groupCell.rowSpan = bottom - top + 1;
		groupCell.colSpan = right - left + 1;
		for(var i = left; i <= right; i++){
			var colId = sheet.getColumnIdByIndex(i);
			for(var j = top; j <= bottom; j++){
				var rowId = sheet.getRowIdByIndex(j);
				var cellId = sheetId + "_" + colId + "_" + rowId; 						
				var cell = this.getCell(cellId);
				cell.groupCellId = groupCellId;
			}
		}
	}
	
	//取消合并
	this.unmergeCells = function(groupCellId){ 
		var groupMainCell = this.getCell(groupCellId);
		var sheetId = groupMainCell.sheetId;
		var sheet = this.allSheets[sheetId];
		var colSpan = groupMainCell.colSpan;
		var rowSpan = groupMainCell.rowSpan;
		if(groupMainCell.colSpan > 1 || groupMainCell.rowSpan > 1) { 
			var needRefreshCells = new Array();
			needRefreshCells.push(groupMainCell);
			groupMainCell.groupCellId = null;
			groupMainCell.colSpan = 1;
			groupMainCell.rowSpan = 1;
			
			var groupColIndex = sheet.getColumnIndexById(groupMainCell.columnId);
			var groupRowIndex = sheet.getRowIndexById(groupMainCell.rowId);
			
			for(var i = 0; i < colSpan; i++){
				var umColId = sheet.getColumnIdByIndex(groupColIndex + i);
				for(var j = 0; j < rowSpan; j++){
					if(i != 0 || j != 0){
						var umRowId = sheet.getRowIdByIndex(groupRowIndex + j);
						var umCellId = sheetId + "_" + umColId + "_" + umRowId;
						var umCell = this.getCell(umCellId);
						if(umCell.groupCellId == groupCellId){ 
							umCell.groupCellId = null;
							umCell.colSpan = 1;
							umCell.rowSpan = 1;
							needRefreshCells.push(umCell);
						}
					}
				}				
			}
			return needRefreshCells;
		}
		else{
			return null;
		}
	}
	
	//添加行
	this.addRow = function(sheetId, index, isFrozen){
		var sheet = this.allSheets[sheetId];
		var allRows = sheet.getAllRows();
		var allColumns = sheet.getAllColumns();
		var rowCount = allRows.length;
		var newAllRows = new Array();
		for(var i = 0; i < index; i++){
			var row = allRows[i];
			newAllRows.push(row);
		}
		
		var newRow = new ExcelGridRow();
		newRow.init({height: this.defaultRowHeight, sheetId: sheetId, isFrozen: isFrozen});
		newAllRows.push(newRow);
		
		for(var i = index; i < rowCount; i++){
			var row = allRows[i];
			newAllRows.push(row);
		}			
		
		//在所有列中增加此列对应的单元格
		var newRowId = newRow.id;
		var colCount = allColumns.length; 
		var allResizeGroupCells = {};
		var allNewCells = {};
		for(var colIndex = 0; colIndex < colCount; colIndex++){
			var col = allColumns[colIndex];
			var colId = col.id;
			var newCell = new ExcelGridCell();
			newCell.init({columnId:colId, rowId:newRowId, colSpan: 1, rowSpan: 1, sheetId: sheetId});
			this.setCell(newCell.id, newCell);
			allNewCells[newCell.id] = newCell;

			var leftCell = this.getCellByIndex(sheetId, colIndex, index - 1);
			var rightCell = this.getCellByIndex(sheetId, colIndex, index);
			if(leftCell != null && rightCell != null && leftCell.isInGroup() && rightCell.isInGroup() && (leftCell.groupCellId == rightCell.groupCellId || leftCell.id == rightCell.groupCellId)){ 
				newCell.groupCellId = rightCell.groupCellId;
				if(allResizeGroupCells[newCell.groupCellId] == null) {
					allResizeGroupCells[newCell.groupCellId] = this.getCell(newCell.groupCellId);
				}
			}					
		}
		for(var groupCellId in allResizeGroupCells){
			var groupCell = allResizeGroupCells[groupCellId];
			groupCell.rowSpan = groupCell.rowSpan + 1;
		}
		
		sheet.setAllRows(newAllRows);				
		return {row: newRow, allNewCells: allNewCells, allResizeGroupCells: allResizeGroupCells};
	}
			
	//添加列
	this.addColumn = function(sheetId, index, isFrozen){
		var sheet = this.allSheets[sheetId];
		var allRows = sheet.getAllRows();
		var allColumns = sheet.getAllColumns();
		var columnCount = allColumns.length;
		var newAllColumns = new Array();
		for(var i = 0; i < index; i++){
			var column = allColumns[i];
			newAllColumns.push(column);
		}
		
		var newColumn = new ExcelGridColumn();
		newColumn.init({width: this.defaultColumnWidth, sheetId: sheetId, isFrozen: isFrozen});
		newAllColumns.push(newColumn);
		
		for(var i = index; i < columnCount; i++){
			var column = allColumns[i];
			newAllColumns.push(column);
		}			
		
		//在所有行中增加此列对应的单元格
		var newColumnId = newColumn.id;
		var rowCount = allRows.length; 
		var allResizeGroupCells = {};
		var allNewCells = {};
		for(var rowIndex = 0; rowIndex < rowCount; rowIndex++){
			var row = allRows[rowIndex];
			var rowId = row.id;
			var newCell = new ExcelGridCell();
			newCell.init({columnId:newColumnId, rowId:rowId, colSpan: 1, rowSpan: 1, sheetId: sheetId});
			this.setCell(newCell.id, newCell);
			allNewCells[newCell.id] = newCell;

			var leftCell = this.getCellByIndex(sheetId, index - 1, rowIndex);
			var rightCell = this.getCellByIndex(sheetId, index, rowIndex);
			if(leftCell != null && rightCell != null && leftCell.isInGroup() && rightCell.isInGroup() && (leftCell.groupCellId == rightCell.groupCellId || leftCell.id == rightCell.groupCellId)){ 
				newCell.groupCellId = rightCell.groupCellId;
				if(allResizeGroupCells[newCell.groupCellId] == null) {
					allResizeGroupCells[newCell.groupCellId] = this.getCell(newCell.groupCellId);
				}
			}					
		}
		for(var groupCellId in allResizeGroupCells){
			var groupCell = allResizeGroupCells[groupCellId];
			groupCell.colSpan = groupCell.colSpan + 1;
		}
		
		sheet.setAllColumns(newAllColumns);				
		return {column: newColumn, allNewCells: allNewCells, allResizeGroupCells: allResizeGroupCells};
	} 
	
	//删除行
	this.deleteRow = function(sheetId, index){
		var sheet = this.allSheets[sheetId];
		var allRows = sheet.getAllRows();
		var allColumns = sheet.getAllColumns();
		var rowCount = allRows.length;
		var newAllRows = new Array();
		for(var i = 0; i < index; i++) {
			var row = allRows[i];
			newAllRows.push(row);
		}

		for(var i = index + 1; i < rowCount; i++) {
			var row = allRows[i];
			newAllRows.push(row);
		}			

		var delRow = allRows[index];
		delRow.isDeleted = true;
		
		var allNewShowGroupCells = {};
		var allResizeGroupCells = {};
		var allDeleteCells = {};
		var colCount = allColumns.length;
		for(var colIndex = 0; colIndex < colCount; colIndex++){
			var col = allColumns[colIndex];
			var allGroupCells = {};
			var delCellId = sheet.getCellIdByIndex(colIndex, index); 
			var delCell = this.getCell(delCellId);
			if(delCell.isInGroup()) {
				if(delCell.isGroupMain()){
					var downCell = this.getCellByIndex(sheetId, colIndex, index + 1);
					if(downCell != null && downCell.groupCellId == delCell.id){
						for(var cellId in this.allCells){
							var cell = this.getCell(cellId);
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
					var groupCell = this.getCell(delCell.groupCellId);
					if(groupCell != null && allResizeGroupCells[groupCell.id] == null && groupCell.columnId == delCell.columnId) {
						groupCell.rowSpan = groupCell.rowSpan - 1;
						allResizeGroupCells[groupCell.id] = groupCell;
					}
				}	 
			}
			allDeleteCells[delCell.id] = delCell; 
			delCell.isDeleted = true;
			this.deleteCell(delCellId); 
		} 
		
		sheet.setAllRows(newAllRows); 
		return {
			allNewShowGroupCells: allNewShowGroupCells,
			allResizeGroupCells: allResizeGroupCells,
			allDeleteCells: allDeleteCells
		}
	}
			
	//删除列
	this.deleteColumn = function(sheetId, index) {
		var sheet = this.allSheets[sheetId];
		var allColumns = sheet.getAllColumns();
		var allRows = sheet.getAllRows();
		var columnCount = allColumns.length;
		var newAllColumns = new Array();
		for(var i = 0; i < index; i++) {
			var column = allColumns[i];
			newAllColumns.push(column);
		}

		for(var i = index + 1; i < columnCount; i++) {
			var column = allColumns[i];
			newAllColumns.push(column);
		}			

		var delColumn = allColumns[index];
		delColumn.isDeleted = true;
		
		var allNewShowGroupCells = {};
		var allResizeGroupCells = {};
		var allDeleteCells = {};
		var rowCount = allRows.length;
		for(var rowIndex = 0; rowIndex < rowCount; rowIndex++){
			var row = allRows[rowIndex];
			var allGroupCells = {};
			var delCellId = sheet.getCellIdByIndex(index, rowIndex); 
			var delCell = this.getCell(delCellId);
			if(delCell.isInGroup()) {
				if(delCell.isGroupMain()){
					var rightCell = this.getCellByIndex(sheetId, index + 1, rowIndex);
					if(rightCell != null && rightCell.groupCellId == delCell.id){
						for(var cellId in this.allCells){
							var cell = this.getCell(cellId);
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
					var groupCell = this.getCell(delCell.groupCellId);
					if(groupCell != null && allResizeGroupCells[groupCell.id] == null && groupCell.rowId == delCell.rowId) {
						groupCell.colSpan = groupCell.colSpan - 1;
						allResizeGroupCells[groupCell.id] = groupCell;
					}
				}	 
			}
			allDeleteCells[delCell.id] = delCell; 
			delCell.isDeleted = true;
			this.deleteCell(delCellId); 
		} 
		
		sheet.setAllColumns(newAllColumns); 
		return {
			allNewShowGroupCells: allNewShowGroupCells,
			allResizeGroupCells: allResizeGroupCells,
			allDeleteCells: allDeleteCells
		}
	}
			
	this.moveRows = function(sheetId, selectedRowIds, toRowIndex){
		var sheet = this.allSheets[sheetId];
		var allRows = sheet.getAllRows();
		var toRow = allRows[toRowIndex];
		var isFrozen = toRow.isFrozen;
		var allSelectedRowIds = {};
		for(var i = 0; i < selectedRowIds.length; i++){
			var rowId = selectedRowIds[i]; 
			allSelectedRowIds[rowId] = rowId; 
		} 
						
		var rowCount = sheet.allRows.length;
		var newAllRows = new Array();
		for(var i = 0; i < toRowIndex; i++){
			var row = allRows[i]; 
			if(allSelectedRowIds[row.id] == null){
				newAllRows.push(row);
			}
		}
		for(var i = 0; i < selectedRowIds.length; i++){
			var rowId = selectedRowIds[i];
			var row = sheet.getRowById(rowId);
			newAllRows.push(row);
			row.isFrozen = isFrozen;
		} 
		
		for(var i = toRowIndex; i < rowCount; i++){
			var row = sheet.allRows[i]; 
			if(allSelectedRowIds[row.id] == null){
				newAllRows.push(row);
			}
		}			
		sheet.setAllRows(newAllRows);
	}
			
	this.moveColumns = function(sheetId, selectedColumnIds, toColIndex){
		var sheet = this.allSheets[sheetId];
		var allColumns = sheet.getAllColumns();
		var toCol = allColumns[toColIndex];
		var isFrozen = toCol.isFrozen;
		var allSelectedColIds = {};
		for(var i = 0; i < selectedColumnIds.length; i++){
			var colId = selectedColumnIds[i]; 
			allSelectedColIds[colId] = colId; 
		} 
						
		var columnCount = allColumns.length;
		var newAllColumns = new Array();
		for(var i = 0; i < toColIndex; i++){
			var column = allColumns[i]; 
			if(allSelectedColIds[column.id] == null){
				newAllColumns.push(column);
			}
		}
		for(var i = 0; i < selectedColumnIds.length; i++){
			var colId = selectedColumnIds[i];
			var col = sheet.getColumnById(colId);
			newAllColumns.push(col);
			col.isFrozen = isFrozen;
		} 
		
		for(var i = toColIndex; i < columnCount; i++){
			var column = allColumns[i]; 
			if(allSelectedColIds[column.id] == null){
				newAllColumns.push(column);
			}
		}			
		sheet.setAllColumns(newAllColumns);
	}
			
	//初始化表格
	this.load = function(initParam){
		
		this.defaultColumnWidth = initParam.dcw == null ? this.dcw : initParam.dcw;
		this.defaultRowHeight = initParam.drh == null ? this.drh : initParam.drh;
		
	    this.hasGridLine = initParam.hgl == null ? this.hasGridLine : (initParam.hgl == "Y" ? true : false);
		this.hasEditBar = initParam.heb == null ? this.hasEditBar : (initParam.heb == "Y" ? true : false);
		this.hasSheetTitle = initParam.hst == null ? this.hasSheetTitle : (initParam.hst == "Y" ? true : false);
		this.hasColumnRowTitle = initParam.hcrt == null ? this.hasColumnRowTitle : (initParam.hcrt == "Y" ? true : false);
		this.hasPageTitle = initParam.hpt == null ? this.hasPageTitle : (initParam.hpt == "Y" ? true : false);
		 
		var sheetIndexToSheetId = {};
		var sheetIdToColumnNameIds = {};
		var sheetIdToRowNameIds = {};
		for(var sheetId in initParam.allSheets){	
			var pSheetObj = initParam.allSheets[sheetId];
			var newSheet = new ExcelGridSheet();
			var allColumns = new Array();
			var allRows = new Array();
			newSheet.init({id: sheetId, 
				name: decodeURIComponent(pSheetObj.n),
				index: pSheetObj.i
			});
			var sheetId = newSheet.id;
			sheetIndexToSheetId[newSheet.index] = sheetId;
			var columnNameToIds = {};
			var rowNameToIds = {};
			sheetIdToColumnNameIds[sheetId] = columnNameToIds;
			sheetIdToRowNameIds[sheetId] = rowNameToIds;
			
			for(var i = 0; i < pSheetObj.allColumns.length; i++){
				var pColObj = pSheetObj.allColumns[i];
				var newCol = new ExcelGridColumn();
				newCol.init({id: pColObj.id, 
					sheetId: sheetId, 
					width: pColObj.w, 
					isFrozen: pColObj.f
				});
				allColumns.push(newCol); 
				columnNameToIds[pColObj.n] = pColObj.id;
			}
			newSheet.setAllColumns(allColumns);
			 
			for(var i = 0; i < pSheetObj.allRows.length; i++){ 
				var pRowObj = pSheetObj.allRows[i];
				var newRow = new ExcelGridRow();
				newRow.init({id: pRowObj.id, 
					height: pRowObj.h, 
					isFrozen: pRowObj.f
				});
				allRows.push(newRow); 
				rowNameToIds[pRowObj.n] = pRowObj.id;
			}
			newSheet.setAllRows(allRows);
			this.allSheets[newSheet.id] = newSheet; 
		}
		
		//构造所有的单元格 
		for(var sheetId in this.allSheets){
			var sheet = this.allSheets[sheetId];
			var columns = sheet.allColumns;
			var rows = sheet.allRows;
			for(var i = 0; i < columns.length; i++){
				var column = columns[i];
				for(var j = 0; j < rows.length; j++){
					var row = rows[j];				
					var cellId = sheetId + "_" + column.id + "_" + row.id; 
					var cell = new ExcelGridCell();
					cell.id = cellId;				
					cell.sheetId = sheetId;				
					cell.columnId = column.id;				
					cell.rowId =  row.id;			
					this.allCells[cellId] = cell;
				}
			}
		} 
		
		for(var cellFullName in initParam.allCells){
			var pCellObj = initParam.allCells[cellFullName];
			var sheetIndex = pCellObj.si;
			var sheetId = sheetIndexToSheetId[sheetIndex];
			var columnNameToIds = sheetIdToColumnNameIds[sheetId];
			var rowNameToIds = sheetIdToRowNameIds[sheetId]; 
			var colId =  columnNameToIds[pCellObj.cn];	
			var rowId =  rowNameToIds[pCellObj.rn];
			var cellId = sheetId + "_" + colId + "_" + rowId;
			var cell = this.allCells[cellId];
			
			cell.init({
				id: cellId,
				columnId: colId,
				sheetId: sheetId,
				rowId: rowId,
				cellValueType: pCellObj.vt == null ? "s" : pCellObj.vt,
				cellShowType: pCellObj.st == null ? "t" : pCellObj.st,
				expression: pCellObj.x == null ? "" : decodeURIComponent(pCellObj.x),
				isExp: pCellObj.ix == null ? "N" : pCellObj.ix,
				formatString: pCellObj.fs == null ? "" : decodeURIComponent(pCellObj.fs),
				colSpan: pCellObj.cs == null ? 1 : pCellObj.cs,
				rowSpan: pCellObj.rs == null ? 1 : pCellObj.rs,
				groupCellId: pCellObj.gid == null ? null : pCellObj.gid,  
				isError: pCellObj.er == null ? "N" : pCellObj.er,
				note: pCellObj.nt == null ? "" : pCellObj.nt
			}); 
			cell.value = pCellObj.v == null || pCellObj.v == "" ? null : cell.getValueObject(decodeURIComponent(pCellObj.v), pCellObj.vt);
			if(pCellObj.css != null){
				cell.cssStyle = new ExcelGridCssStyle();
				cell.cssStyle.fromJson(pCellObj.css);
			}			
		}
	}
			
	this.deleteSheet = function(sheetId){
		var sheet = this.allSheets[sheetId];
		var columns = sheet.allColumns;
		var rows = sheet.allRows;
		for(var i = 0; i < columns.length; i++){
			var column = columns[i];
			for(var j = 0; j < rows.length; j++){
				var row = rows[j];
				var cellId = sheetId + "_" + column.id + "_" + row.id;
				this.deleteCell(cellId);
			}
		}
		delete this.allSheets[sheetId];
	}
			
	this.createSheet = function(initParam){
		
		var sheetNamePrefix = "Sheet";
		var postfix = 1;
		var sheetName = sheetNamePrefix + postfix;
		while(this.getSheetByName(sheetName) != null){
			postfix++;
			sheetName = sheetNamePrefix + postfix;
		}
		
		var sheetIndex = 0;
		for(var sId in this.allSheets){
			var s = this.allSheets[sId];
			if(sheetIndex <= s.index){
				sheetIndex = s.index + 1;
			}
		}
			
		var sheetId = cmnPcr.createGuid();
		var columnCount =  initParam.columnCount;
		initParam.defaultColumnWidth = initParam.defaultColumnWidth == null ? this.defaultColumnWidth : initParam.defaultColumnWidth;
		var rowCount = initParam.rowCount;
		initParam.defaultRowHeight = initParam.defaultRowHeight == null ? this.defaultRowHeight : initParam.defaultRowHeight;
		
		var newSheet = new ExcelGridSheet();
		newSheet.init({id: sheetId, 
			name: sheetName,
			index: sheetIndex
		});
		this.allSheets[sheetId] = newSheet; 
		
		var allColumns = new Array();
		var allRows = new Array();
		var columnCount = 10;
		var rowCount = 10;

		for(var i = 0; i < columnCount; i++){ 
			var newCol = new ExcelGridColumn();
			var colId = cmnPcr.createGuid();
			newCol.init({id: colId, 
					sheetId: sheetId, 
					width: initParam.defaultColumnWidth, 
					isFrozen: false});
			allColumns.push(newCol); 
		}
		newSheet.setAllColumns(allColumns);
		 
		for(var i = 0; i < rowCount; i++){  
			var newRow = new ExcelGridRow();
			var rowId = cmnPcr.createGuid();
			newRow.init({id: rowId, 
					sheetId: sheetId, 
					height: initParam.defaultRowHeight, 
					isFrozen: false});
			allRows.push(newRow); 
		}
		newSheet.setAllRows(allRows);

		for(var i = 0; i < columnCount; i++){ 
			var column = allColumns[i]; 
			for(var j = 0; j < rowCount; j++){    
				var row = allRows[j]; 				
				var newCell = new ExcelGridCell();
				var cellId = sheetId + "_" + column.id + "_" + row.id;  
				newCell.id = cellId;				
				newCell.sheetId = sheetId;				
				newCell.columnId = column.id;				
				newCell.rowId =  row.id;			 
				this.setCell(newCell.id, newCell);
			}
		}
		return sheetId;
	} 
	
	this.toJson = function(){
		var jsonObj = {};
		
		jsonObj.dcw = this.defaultColumnWidth; 
		jsonObj.drh = this.defaultRowHeight;

	    jsonObj.hgl = this.hasGridLine ? "Y" : "N";
		jsonObj.heb = this.hasEditBar ? "Y" : "N";
		jsonObj.hst = this.hasSheetTitle ? "Y" : "N";
		jsonObj.hcrt = this.hasColumnRowTitle ? "Y" : "N";
		jsonObj.hpt = this.hasPageTitle ? "Y" : "N";
		
		jsonObj.allSheets = {};
		jsonObj.allCells = {};		

		for(var sheetId in this.allSheets){
			var sheet = this.allSheets[sheetId];
			var sheetIndex = sheet.index;
			var sheetObj = { 
				n: sheet.name,
				i: sheetIndex
			};

			sheetObj.allColumns = new Array();
			sheetObj.allRows = new Array();
			var allColumns = sheet.getAllColumns();
			var allRows = sheet.getAllRows();
			var columnCount =  allColumns.length;
			var rowCount = allRows.length;
			for(var i = 0; i < columnCount; i++){ 
				var col = allColumns[i];
				sheetObj.allColumns.push({
					id: col.id, 
					w: col.width,
					f: col.isFrozen,
					n: sheet.getColumnNameById(col.id)
				}); 
			}			 
			for(var i = 0; i < rowCount; i++){  
				var row = allRows[i];
				sheetObj.allRows.push({
					id: row.id, 
					h: row.height,
					f: row.isFrozen,
					n: sheet.getRowNameById(row.id)
				}); 
			}			
			jsonObj.allSheets[sheetId] = sheetObj;
			for(var i = 0; i < columnCount; i++){ 
				var col = allColumns[i];
				var colName = sheet.getColumnNameById(col.id);
				for(var j = 0; j < rowCount; j++){    
					var row = allRows[j]; 
					var rowName = sheet.getRowNameById(row.id);
					var cellFullName = sheetIndex + colName + rowName;
					var cellId = sheetId + "_" + col.id + "_" + row.id;
					var cell = this.getCell(cellId);
					if(!cell.isBlankCell()){
						var cellObj = {
							rn: rowName,
							cn: colName,
							si: sheetIndex};
						if(cell.value != null && cell.value != ""){
							cellObj["v"] = encodeURIComponent(cell.getValueString(cell.value));
						}
						if(cell.cellValueType != valueType.string){
							cellObj["vt"] = cell.toSimpleValueType(cell.cellValueType);
						}
						if(cell.cellShowType != "text"){
							cellObj["st"] = cell.toSimpleShowType(cell.cellShowType);
						}
						if(cell.isExp){
							cellObj["x"] = encodeURIComponent(cell.expression);
							cellObj["ix"] = "Y";
						} 
						if(cell.formatString != null && cell.formatString != ""){
							cellObj["fs"] = encodeURIComponent(cell.formatString);
						}						
						if(cell.colSpan > 1){
							cellObj["cs"] = cell.colSpan;
						}
						if(cell.rowSpan > 1){
							cellObj["rs"] = cell.rowSpan;
						}
						if(cell.groupCellId != null && cell.groupCellId != "" && cell.groupCellId != cell.id){
							cellObj["gid"] = cell.groupCellId;
						}
						jsonObj.allCells[cellFullName] = cellObj;
						if(cell.cssStyle != null){
							cellObj["css"] = cell.cssStyle.toJson();
						}
					}
				}
			}
		}
		
		return jsonObj;
	}
		
	//取消所有前置单元格对此单元格的引用
	this.removeEffectFromAllRefered = function(referedCellId){ 
		for(var cellId in this.allCells){ 
			var cell = this.getCell(cellId);
			cell.removeEffectCellId(referedCellId); 
		} 
	}
	
	this.addEffectToAllReferedCells = function(cellId, referedCellIds){
		if(referedCellIds != null && cmnPcr.getObjectPropertyCount(referedCellIds) > 0){
			for(var referedCellId in referedCellIds){ 
				var refreedCell = this.getCell(referedCellId);
				if(refreedCell == null){
					var ss = 0 ;
				}
				refreedCell.addEffectCellId(cellId);
			}
		}
	}
}