function ExcelGrid(){

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
		if(colIndex < 0){
			return "";
		}
		else{
			return this.allIndexToColumnName[colIndex];
		}
		
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
	
	//获取单元格值
	this.getCellValue = function(columnId, rowId){
		var cellId = columnId + "_" + rowId;		
		var cell = this.allCells[cellId];
		return cell == null ? null : cell.value;
	}
	
	this.getRangeValue = function(fromColId, fromRowId, toColId, toRowId){
		var rangeValue = new ExcelGridRangeValue();
		rangeValue.init(this, fromColId, fromRowId, toColId, toRowId);
		return rangeValue;
	}
	
		
	//粘贴后的单元格，更新其表达式
	this.reBuildCellExpressionAfterPaste = function(cell, rowStep, colStep){
		var hasRefChange = false;
		if(cell.isExp()){
			if(cell.expPartList != null){  
				var newExp = this.reBuildCellExpressionAfterPasteByExpParts(cell.expPartList, rowStep, colStep); 
				return newExp; 
			}
		} 
		return null;
	}
	
	//根据expParts重新构造单元格表达式
	this.reBuildCellExpressionAfterPasteByExpParts = function(expPartList, rowStep, colStep){ 
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
						if(expPart.cReferSourceType == "CurrentSheet"){ 
							partStr = this.reBuildCellReferanceAfterPaste(expPart.cellRefInfo, rowStep, colStep);
						}
						else{
							//暂时未实现跨sheet引用
							partStr = expPart.getText();
						}
					break;
					case partType.RangeReferance:
						if(expPart.cReferSourceType == "CurrentSheet"){
							partStr = this.reBuildCellReferanceAfterPaste(expPart.fromCellRefInfo, rowStep, colStep)
								+ ":" 
								+ this.reBuildCellReferanceAfterPaste(expPart.toCellRefInfo, rowStep, colStep); 
						}
						else{
							//暂时未实现跨sheet引用
							partStr = expPart.getText();
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
	
	this.reBuildCellReferanceAfterPaste = function(cellRefInfo, rowStep, colStep){
		var newColName = cellRefInfo.colName == "" 
						? "" 
						: (cellRefInfo.colAbsolute 
							? ("$" + cellRefInfo.colName) 
							: this.getColumnNameByIndex(this.getColumnIndexById(cellRefInfo.colId) + colStep));
		var newRowName = cellRefInfo.rowName == "" 
						? "" 
						: (cellRefInfo.rowAbsolute 
							? ("$" + cellRefInfo.rowName) 
							: (this.getRowIndexById(cellRefInfo.rowId) + rowStep + 1).toString());
	
		return newColName + newRowName;
	}
		
	//刷新所有的单元格引用，由于行列变化，单元格引用的名称要改变，表达式也变化
	this.reBuildCellExpression = function(cell){
		var hasRefChange = false;
		if(cell.isExp()){
			if(cell.expPartList != null){ 
				if(this.reCheckCellRefNameByExpParts(cell.expPartList)){ 
					var newExp = this.reBuildCellExpressionByExpParts(cell.expPartList); 
					return newExp;
				}
			}
		} 
		return null;
	} 
	
	//根据expParts重新构造单元格表达式
	this.reBuildCellExpressionByExpParts = function(expPartList){ 
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
						if(expPart.cReferSourceType == "CurrentSheet"){
							partStr = ((expPart.cellRefInfo.colName == "") ? "" : ((expPart.cellRefInfo.colAbsolute ? "$" : "") + expPart.cellRefInfo.colName))
							+ ((expPart.cellRefInfo.rowName == "") ? "" : ((expPart.cellRefInfo.rowAbsolute ? "$" : "") + expPart.cellRefInfo.rowName));
						}
						else{
							//暂时未实现跨sheet引用
							partStr = expPart.getText();
						}
					break;
					case partType.RangeReferance:
						if(expPart.cReferSourceType == "CurrentSheet"){
							partStr = ((expPart.fromCellRefInfo.colName == "") ? "" : ((expPart.fromCellRefInfo.colAbsolute ? "$" : "") + expPart.fromCellRefInfo.colName))
							+ ((expPart.fromCellRefInfo.rowName == "") ? "" : ((expPart.fromCellRefInfo.rowAbsolute ? "$" : "") + expPart.fromCellRefInfo.rowName))
							+ ":"
							+ ((expPart.toCellRefInfo.colName == "") ? "" : ((expPart.toCellRefInfo.colAbsolute ? "$" : "") + expPart.toCellRefInfo.colName))
							+ ((expPart.toCellRefInfo.rowName == "") ? "" : ((expPart.toCellRefInfo.rowAbsolute ? "$" : "") + expPart.toCellRefInfo.rowName));
						}
						else{
							//暂时未实现跨sheet引用
							partStr = expPart.getText();
						}
					break;
				}
				newExp += partStr;
			} 
		}
		return newExp;
	}
	
	this.reBuildCellRefName = function(cellRefInfo){
		var errorRefText = "#REF!";
		var colId = cellRefInfo.colId;
		var oldColName = cellRefInfo.colName;
		var rowId = cellRefInfo.rowId;
		var oldRowName = cellRefInfo.rowName;
		
		var hasChange = false;
		var newColName = this.getColumnNameById(cellRefInfo.colId);  
		var rowIndex = this.getRowIndexById(cellRefInfo.rowId);
		if(newColName == ""){
			newColName = errorRefText;
			hasChange = true;
		}
		if(rowIndex < 0){
			newRowName = errorRefText;
			hasChange = true;
		}
		else{
			var newRowName = (rowIndex + 1).toString();
			if(newColName != oldColName || newRowName != oldRowName){
				hasChange = true;
			}				
		}	
		return {hasChange: hasChange, rowName: newRowName, colName: newColName};		
	} 
	
	//刷新此个单元格名称引用cellRefInfo，由于行列变化，单元格引用的名称要改变
	this.reCheckCellRefNameByExpParts = function(expPartList){
		var hasChange = false;
		for(var i = 0; i < expPartList.length; i++){
			var expPart = expPartList[i];
			if(this.reCheckCellRefNameByExpPart(expPart)){
				hasChange = true;
			}
		}
		return hasChange;
	} 
	
	//刷新此个单元格名称引用cellRefInfo，由于行列变化，单元格引用的名称要改变
	this.reCheckCellRefNameByExpPart = function(expPart){
		var hasChange = false;
		if(expPart.getPartType() == partType.CellReferance){
			var cellRefCheckInfo = this.reBuildCellRefName(expPart.cellRefInfo); 
			if(cellRefCheckInfo.hasChange){
				expPart.cellRefInfo.rowName = cellRefCheckInfo.rowName;
				expPart.cellRefInfo.colName = cellRefCheckInfo.colName;
				expPart.text = cellRefCheckInfo.colName + cellRefCheckInfo.rowName;
				hasChange = true;
			}		
		}
		else if(expPart.getPartType() == partType.RangeReferance){
			var fromCellRefCheckInfo = this.reBuildCellRefName(expPart.fromCellRefInfo); 
			if(fromCellRefCheckInfo.hasChange){
				expPart.fromCellRefInfo.rowName = fromCellRefCheckInfo.rowName;
				expPart.fromCellRefInfo.colName = fromCellRefCheckInfo.colName;
			}		
			var toCellRefCheckInfo = this.reBuildCellRefName(expPart.toCellRefInfo); 
			if(toCellRefCheckInfo.hasChange){
				expPart.toCellRefInfo.rowName = toCellRefCheckInfo.rowName;
				expPart.toCellRefInfo.colName = toCellRefCheckInfo.colName;
			}		
			if(fromCellRefCheckInfo.hasChange || toCellRefCheckInfo.hasChange){
				expPart.text = fromCellRefCheckInfo.colName + fromCellRefCheckInfo.rowName + ":" + toCellRefCheckInfo.colName + toCellRefCheckInfo.rowName;
				hasChange = true;
			}
		} 
		return hasChange; 
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
		var colSpan = groupMainCell.colSpan;
		var rowSpan = groupMainCell.rowSpan;
		if(groupMainCell.colSpan > 1 || groupMainCell.rowSpan > 1) { 
			var needRefreshCells = new Array();
			needRefreshCells.push(groupMainCell);
			groupMainCell.groupCellId = null;
			groupMainCell.colSpan = 1;
			groupMainCell.rowSpan = 1;
			
			var groupColIndex = this.getColumnIndexById(groupMainCell.columnId);
			var groupRowIndex = this.getRowIndexById(groupMainCell.rowId);
			
			for(var i = 0; i < colSpan; i++){
				var umColId = this.getColumnIdByIndex(groupColIndex + i);
				for(var j = 0; j < rowSpan; j++){
					if(i != 0 || j != 0){
						var umRowId = this.getRowIdByIndex(groupRowIndex + j);
						var umCellId = umColId + "_" + umRowId;
						var umCell = this.allCells[umCellId];
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
	this.addRow = function(index){
		var rowCount = this.allRows.length;
		var newAllRows = new Array();
		for(var i = 0; i < index; i++){
			var row = this.allRows[i];
			newAllRows.push(row);
		}
		
		var newRow = new ExcelGridRow();
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
			var newCell = new ExcelGridCell();
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
		
		var newColumn = new ExcelGridColumn();
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
			var newCell = new ExcelGridCell();
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
		var toRow = this.allRows[toRowIndex];
		var isFrozen = toRow.isFrozen;
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
			row.isFrozen = isFrozen;
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
		var toCol = this.allColumns[toColIndex];
		var isFrozen = toCol.isFrozen;
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
			col.isFrozen = isFrozen;
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
		return index == null ? null : this.allColumns[index];
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
		
		this.defaultColumnWidth = initParam.defaultColumnWidth == null ? this.defaultColumnWidth : initParam.defaultColumnWidth;
		this.defaultRowHeight = initParam.defaultRowHeight == null ? this.defaultRowHeight : initParam.defaultRowHeight;
		
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
		for(var i = 0; i < initParam.allColumns.length; i++){
			var pColObj = initParam.allColumns[i];
			var newCol = new ExcelGridColumn();
			newCol.init({id: pColObj.id, 
				width: pColObj.width, 
				isFrozen: pColObj.isFrozen
			});
			this.allColumns.push(newCol); 
		}
		 
		for(var i = 0; i < initParam.allRows.length; i++){ 
			var pRowObj = initParam.allRows[i];
			var newRow = new ExcelGridRow();
			newRow.init({id: pRowObj.id, 
				height: pRowObj.height, 
				isFrozen: pRowObj.isFrozen
			});
			this.allRows.push(newRow); 
		}
		
		for(var cellId in initParam.allCells){
			var pCellObj = initParam.allCells[cellId];
			var newCell = new ExcelGridCell();
			newCell.init({
				id: pCellObj.id,
				columnId: pCellObj.columnId,
				rowId: pCellObj.rowId,
				cellValueType: pCellObj.cellValueType,
				cellShowType: pCellObj.cellShowType,
				expression: decodeURIComponent(pCellObj.expression),
				formatString:pCellObj.formatString == null ? "" : decodeURIComponent(pCellObj.formatString),
				colSpan: pCellObj.colSpan,
				rowSpan: pCellObj.rowSpan,
				groupCellId: pCellObj.groupCellId,
				jsCode: decodeURIComponent(pCellObj.jsCode),
				effectCellIds: pCellObj.effectCellIds,
				isError: pCellObj.isError,
				note: pCellObj.note
			}); 
			newCell.value = pCellObj.value == null || pCellObj.value == "" ? null : newCell.getValueObject(decodeURIComponent(pCellObj.value), pCellObj.cellValueType);
			this.allCells[newCell.id] = newCell;
		}
	}
			
	this.create = function(initParam){
		
		this.initColumnNameDic();
		
		var columnCount =  initParam.columnCount;
		this.defaultColumnWidth = initParam.defaultColumnWidth == null ? this.defaultColumnWidth : initParam.defaultColumnWidth;
		var rowCount = initParam.rowCount;
		this.defaultRowHeight = initParam.defaultRowHeight == null ? this.defaultRowHeight : initParam.defaultRowHeight;

		for(var i = 0; i < columnCount; i++){ 
			var newCol = new ExcelGridColumn();
			newCol.init({width: this.defaultColumnWidth});
			this.allColumns.push(newCol); 
		}
		 
		for(var i = 0; i < rowCount; i++){  
			var newRow = new ExcelGridRow();
			newRow.init({height: this.defaultRowHeight});
			this.allRows.push(newRow); 
		}

		for(var i = 0; i < columnCount; i++){ 
			var col = this.allColumns[i];
			for(var j = 0; j < rowCount; j++){    
				var row = this.allRows[j];						
				var newCell = new ExcelGridCell();
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
	
	this.toJson = function(){
		var jsonObj = {};
		
		jsonObj.defaultColumnWidth = this.defaultColumnWidth; 
		jsonObj.defaultRowHeight = this.defaultRowHeight;
		jsonObj.allColumns = new Array();
		jsonObj.allRows = new Array();
		jsonObj.allCells = {};
		var columnCount =  this.allColumns.length;
		var rowCount = this.allRows.length;

		for(var i = 0; i < columnCount; i++){ 
			var col = this.allColumns[i];
			jsonObj.allColumns.push(col.toJson()); 
		}
		 
		for(var i = 0; i < rowCount; i++){  
			var row = this.allRows[i];
			jsonObj.allRows.push(row.toJson()); 
		}

		for(var i = 0; i < columnCount; i++){ 
			var col = this.allColumns[i];
			for(var j = 0; j < rowCount; j++){    
				var row = this.allRows[j];	
				var cellId = col.id + "_" + row.id;
				var cell = this.allCells[cellId];
				jsonObj.allCells[cellId] = cell.toJson();
			}
		}
		return jsonObj;
	}
		
	//取消所有前置单元格对此单元格的引用
	this.removeEffectFromAllRefered = function(referedCellId){
		for(var cellId in this.allCells){
			var cell = this.allCells[cellId];
			if(cell.effectCellIds != null){
				if(cell.effectCellIds.contains(referedCellId)){
					var newEffectCellIds = new Array();
					for(var i = 0; i < cell.effectCellIds.length; i++){
						var effectCellId = cell.effectCellIds[i];
						if(effectCellId != referedCellId){
							newEffectCellIds.push(effectCellId);
						}
					}
					cell.effectCellIds = newEffectCellIds;
				}
			}
		}
	}
	
	this.addEffectToAllReferedCells = function(cellId, referedCellIds){
		if(referedCellIds != null && cmnPcr.getObjectPropertyCount(referedCellIds) > 0){
			for(var referedCellId in referedCellIds){ 
				var refreedCell = this.allCells[referedCellId];
				refreedCell.addEffectCellId(cellId);
			}
		}
	}
}

function ExcelGridColumn(){
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
	
	this.toJson = function(){
		var jsonObj = {
			id: this.id,
			width: this.width,
			isFrozen: this.isFrozen
		};
		return jsonObj;
	}
}

function ExcelGridRow(){
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
	
	this.toJson = function(){
		var jsonObj = {
			id: this.id,
			height: this.height,
			isFrozen: this.isFrozen
		};
		return jsonObj;
	}
}
		
function ExcelGridCell(){
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
	
	this.jsCode = "";
	this.effectCellIds = null;
	this.isError = false;
	this.note = "";
	
	//是否存在循环引用
	this.hasCircleRefer = false;
	
	this.expTreePart = null; 
	
	this.addEffectCellId = function(effectCellId){
		if(this.effectCellIds == null){
			this.effectCellIds = new Array();
			this.effectCellIds.push(effectCellId);
		}
		else if(!this.effectCellIds.contains(effectCellId)){
			this.effectCellIds.push(effectCellId);
		}		
	}
	
	this.isExp = function(){
		return this.expression.length > 0 && this.expression[0] == "=";
	}
	
	this.clone = function(colId, rowId, groupCellId){
		var newCell = new ExcelGridCell();
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
		if(!this.isHidden()){
			toCell.value = this.value;
			toCell.cellValueType = this.cellValueType;
			toCell.cellShowType = this.cellShowType;
			toCell.expression = this.expression;
			toCell.formatString = this.formatString;
			if(this.expPartList != null && this.expPartList.length > 0){
				toCell.expPartList = this.clonePartLists();
			}
		}
		toCell.colSpan = this.colSpan;
		toCell.rowSpan = this.rowSpan;
	}
	
	this.clonePartLists = function(){
		var expPartList = this.expPartList;
		var newPartList = new Array();
		for(var i = 0; i < expPartList.length; i++){
			var part = expPartList[i];
			newPartList.push(part.clone());
		}
		return newPartList;
	}
	
	this.toJson = function(){
		var jsonObj = {
			value: this.value == null ? "" : encodeURIComponent(this.getValueString(this.value)),
			cellValueType: this.cellValueType,
			cellShowType: this.cellShowType,
			expression: this.expression == "" || this.expression == null ? "" :encodeURIComponent(this.expression),
			formatString: this.formatString,
			colSpan: this.colSpan,
			rowSpan: this.rowSpan,
			rowId: this.rowId,
			columnId: this.columnId,
			groupCellId: this.groupCellId,
			jsCode: this.jsCode,
			effectCellIds: this.effectCellIds
		};
		return jsonObj;
	}
	
	this.isHidden = function(){
		return this.groupCellId !=null && this.groupCellId != this.id;
	}
	
	this.isInGroup = function(){
		return this.groupCellId != null;
	}
	
	this.getShowHtml = function(){
		var html = "";
		if(this.isError){
			var text = "#Error:" + this.note;
			html = cmnPcr.html_encode(text);
		}
		else{
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
		}
		return html;
	}
	
	this.getShowText = function(){
		if (this.value == undefined || this.value == null) {
			return "";
		}
		else {
			switch (this.cellValueType) {
			case valueType.object:
				return this.value.toString();
			case valueType.string:
				return this.value.toString();
			case valueType.decimal:
				return cmnPcr.decimalToStr(this.value);
			case valueType.boolean:
				return cmnPcr.booleanToStr(this.value);
			case valueType.time:
				return cmnPcr.datetimeToStr(this.value, this.formatString == null || this.formatString == "" ? "yyyy-MM-dd HH:mm:ss" : this.formatString);
			case valueType.date:
				return cmnPcr.datetimeToStr(this.value, this.formatString == null || this.formatString == ""  ? "yyyy-MM-dd HH:mm:ss" : this.formatString);
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
			case valueType.object:
				return str;
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
	//字符串转简单类型对象
	this.getValueString = function(obj, type) {
		if (obj == "" || obj == undefined || obj == null) {
			return "";
		} 
		else {
			switch (this.cellValueType) { 
				case valueType.object:
					return obj.toString();
				case valueType.string:
					return obj;
				case valueType.decimal:
					return cmnPcr.decimalToStr(obj);
				case valueType.boolean:
					return cmnPcr.booleanToStr(obj);
				case valueType.time:
					return cmnPcr.datetimeToStr(obj, "yyyy-MM-dd HH:mm:ss");
				case valueType.date:
					return cmnPcr.datetimeToStr(obj, "yyyy-MM-dd");
				default:
					alert("getValueString, type=" + type + ", obj=" + obj.toString());
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
		this.value = initParam.value == null || initParam.value == "" ? null : this.getValueObject(decodeURIComponent(initParam.value), initParam.cellValueType);
		this.cellValueType = initParam.cellValueType == null ? valueType.string : initParam.cellValueType;
		this.cellShowType = initParam.cellShowType == null ? "text" : initParam.cellShowType;
		this.expression = initParam.expression == null ? "" : decodeURIComponent(initParam.expression);
		this.formatString = initParam.formatString;
		this.colSpan = initParam.colSpan;
		this.rowSpan = initParam.rowSpan;
		this.groupCellId = initParam.groupCellId;
		
		this.jsCode = initParam.jsCode;
		this.effectCellIds = initParam.effectCellIds;
		this.isError = initParam.isError;
		this.note = decodeURIComponent(initParam.note);
		
	}		
}

//ExcelGrid某个区域的数据
function ExcelGridRangeValue(){

	this.eg = null;
	
	//object[][]
	this.values = null;
		
	this.colNameToIndex = null;
	
	this.rowNameToIndex = null;
	
	this.init = function(eg, fromColId, fromRowId, toColId, toRowId){
		this.eg = eg;
		var fromColIndex =  eg.getColumnIndexById(fromColId);
		var toColIndex = eg.getColumnIndexById(toColId);
		var fromRowIndex = eg.getRowIndexById(fromRowId);
		var toRowIndex = eg.getRowIndexById(toRowId);

		if(fromColIndex > toColIndex){
			var tempColIndex = toColIndex;
			toColIndex = fromColIndex;
			fromColIndex = tempColIndex;
		}
		if(fromRowIndex > toRowIndex){
			var tempRowIndex = toRowIndex;
			toRowIndex = fromRowIndex;
			fromRowIndex = tempRowIndex;
		}
		this.colNameToIndex = new Object();
		for(var colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
			var colId = eg.getColumnIdByIndex(colIndex);
			var colName = eg.getColumnNameById(colId);
			this.colNameToIndex[colName] = colIndex - fromColIndex;
		}

		this.rowNameToIndex = new Object();
		for(var rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			var rowId = eg.getRowIdByIndex(rowIndex);
			var rowName = eg.getRowIndexById(rowId);
			this.rowNameToIndex[rowName] = rowIndex - fromRowIndex;
		}
		
		this.values = new Array(); 
		for(var rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			
			var rowValues = new Array();
			this.values.push(rowValues);
			var rowId = eg.getRowIdByIndex(rowIndex);
			for(var colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
				var colId = eg.getColumnIdByIndex(colIndex); 
				var cellId = colId + "_" + rowId;
				var value = eg.allCells[cellId].value;
				rowValues.push(value);
			} 
		}		 
	}
	
	this.getValue = function(colName, rowName){
		if(this.colNameToIndex[colName] == null){
			throw "Can not get value from cell range, colName = " + colName;
		}
		if(this.rowNameToIndex[rowName] == null){
			throw "Can not get value from cell range, rowName = " + rowName;
		}
		var colIndex = this.colNameToIndex[colName]
		var rowIndex = this.rowNameToIndex[rowName];
		return this.values[rowIndex][colIndex];
	}
	
	this.getValues = function(){
		return this.values;
	}
}
