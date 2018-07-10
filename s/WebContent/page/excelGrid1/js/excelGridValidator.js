function ExcelGridValidator(){
	
	this.eg = null;

	//记录下每个单元格的变化，影响了哪些单元格
	this.setAllCellEffects = function(cellIdToCellReferNodes){ 
		for(var cellId in cellIdToCellReferNodes){
			var refNode = cellIdToCellReferNodes[cellId];
	 		this.setOneCellEffects(cellId, refNode);	 		
		}
	}
	
	this.setOneCellEffects = function(destCellId, refNode){   
		for(var refCellId in refNode.getReferCellIds()){
			this.setCellRefEffects(destCellId, refCellId);
		}
	}
	
	this.setCellRefEffects = function(destCellId, refCellId){
 		var cell = this.eg.allCells[refCellId]; 
 		cell.addEffectCellId(destCellId);
	} 
	
	this.compileCellExp = function(eg, cellId){
		this.eg = eg;
		var cell = this.eg.allCells[cellId];
		if(cell.isExp()){
			
			var exp = cell.expression.substr(1); 
		
			//HashMap<String, ValueType>
			var cellValueTypes = new Object();
			for(var cId in this.eg.allCells){
		 		var c = this.eg.allCells[cId]; 
				cellValueTypes[cId] = c.cellValueType;
		 	}
			
			//List<String>
			var allColumnIds = new Array();  
			for(var i = 0; i < this.eg.allColumns.length; i++){	
				var column = this.eg.allColumns[i]; 
				allColumnIds.push(column.id);
			} 		
			var columns = new ExcelGridColumns(allColumnIds);
			
			var allRowIds = new Array();
			for(var i = 0; i < this.eg.allRows.length; i++){ 
				var row = this.eg.allRows[i]; 
				allRowIds.push(row.id);
			} 
			var rows = new ExcelGridRows(allRowIds);
		
			//HashMap<String, List<ExpTreePart>>
			var cellIdToExpParts = new Object();
			
			//HashMap<String, ExpTreePart>
			var cellIdToRootParts = new Object();		
				
			//HashMap<String, CellReferanceNode>
			var cellIdToCellReferNodes = new Object();	 
					 
			
			try{			
				cell.isError = false;
				cell.note = "";	
				this.eg.removeEffectFromAllRefered(cellId); 
				
				var vd = new ExcelGridExpressionValidator(); 
				
				//List<ExpTreePart>
				var expParts = vd.getExpTreeParts(exp, cellValueTypes, columns, rows); 
				var referNode = new CellReferanceNode(); 
				referNode.setCellId(cellId);
				this.checkReferance(referNode, expParts, columns, rows);				
				
				cell.expPartList = this.clonePartLists(expParts); 
				
				var rootPart = vd.getRootPart(expParts, cellValueTypes, null, runAt.All);
				var resultValueTypeStr = vd.getExpResultValueType(rootPart, null);
				var resultValueType = resultValueTypeStr.toLowerCase(); 
				cell.cellValueType = resultValueType;
				cell.expTreePart = rootPart;
				
				var referedCellIds = referNode.getReferCellIds();
				this.eg.addEffectToAllReferedCells(cellId, referedCellIds);
				
				var jsCode = vd.toExpPartJsCode(rootPart);
				cell.jsCode = jsCode; 
				return true;
			}
			catch(err){
				//记录下编译验证表达式失败
				cell.isError = true;
				cell.note = err.message;
				cell.expTreePart = null;
				cell.expPartList = null;
				cell.cellValueType = valueType.string;
				cell.jsCode = "";
				cell.cellValueType = valueType.string;
				this.eg.removeEffectFromAllRefered(cellId);
				return false;
			}
		}
	}
	
	this.clonePartLists = function(expPartList){
		var newPartList = new Array();
		for(var i = 0; i < expPartList.length; i++){
			var part = expPartList[i];
			newPartList.push(part.clone());
		}
		return newPartList;
	}
	
	this.checkReferance = function(referNode, expParts, columns, rows){
		for(var i = 0; i < expParts.length; i++){
			var expPart = expParts[i];
			if(expPart.getPartType() == partType.CellReferance){
				if(expPart.getCellReferSourceType() == cellReferanceSourceType.CurrentSheet){
					var cellRefInfo = expPart.getCellRefInfo();
					var refCellId = cellRefInfo.getColId() + "_" + cellRefInfo.getRowId();
					referNode.getReferCellIds()[refCellId] = "";
				}
				else{
					throw new Error("暂时为实现跨Sheet引用");
				} 
			}
			else if(expPart.getPartType() == partType.RangeReferance){
				if(expPart.getCellReferSourceType() == cellReferanceSourceType.CurrentSheet){
					var fromCellRefInfo = expPart.getFromCellRefInfo();
					var toCellRefInfo = expPart.getToCellRefInfo();
					var fromColId = fromCellRefInfo.getColId();
					var fromRowId = fromCellRefInfo.getRowId();
					var toColId = toCellRefInfo.getColId();
					var toRowId = toCellRefInfo.getRowId();
					var fromColIndex = columns.getColumnIndex(fromColId);
					var toColIndex = columns.getColumnIndex(toColId);
					var fromRowIndex = rows.getRowIndex(fromRowId);
					var toRowIndex = rows.getRowIndex(toRowId); 
					if(toColIndex < fromColIndex){
						var tempColIndex = toColIndex;
						toColIndex = fromColIndex;
						fromColIndex = tempColIndex;
					}
					if(toRowIndex < fromRowIndex){
						var tempRowIndex = toRowIndex;
						toRowIndex = fromRowIndex;
						fromRowIndex = tempRowIndex;
					}
					for(var colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
						for(var rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
							var colId = columns.getColumnId(colIndex);
							var rowId = rows.getRowId(rowIndex);
							var refCellId = colId + "_" + rowId;
							referNode.getReferCellIds()[refCellId] = "";
						}	
					}
				}
				else{
					throw new Error("暂时为实现跨Sheet引用");
				} 
			}
		}
	}
	
	this.validate = function(eg){  
	
		this.eg = eg;
			
		try{	 
			//HashMap<String, ValueType>
			var cellValueTypes = new Object();
			for(var cellId in this.eg.allCells){
		 		var cell = this.eg.allCells[cellId]; 
				cellValueTypes[cellId] = cell.cellValueType;
		 	}
			
			//List<String>
			var allColumnIds = new Array();  
			for(var i = 0; i < this.eg.allColumns.length; i++){	
				var column = this.eg.allColumns[i]; 
				allColumnIds.push(column.id);
			} 		
			var columns = new ExcelGridColumns(allColumnIds);
			
			var allRowIds = new Array();
			for(var i = 0; i < this.eg.allRows.length; i++){ 
				var row = this.eg.allRows[i]; 
				allRowIds.push(row.id);
			} 
			var rows = new ExcelGridRows(allRowIds);
	
			//HashMap<String, List<ExpTreePart>>
			var cellIdToExpParts = new Object();
			
			//HashMap<String, ExpTreePart>
			var cellIdToRootParts = new Object();
			
			//HashMap<String, CellReferanceNode>
			var cellIdToCellReferNodes = new Object();
			
			var vd = new ExcelGridExpressionValidator();
			for(var cellId in this.eg.allCells){
				var cell = this.eg.allCells[cellId];
				if(cell.isExp()){
					var exp = cell.expression.substr(1); 
					
					//List<ExpTreePart>
					var expParts = vd.getExpTreeParts(exp, cellValueTypes, columns, rows);
					cellIdToExpParts[cellId] = expParts;
									
					var referNode = new CellReferanceNode();
					cellIdToCellReferNodes[cellId] = referNode;
					referNode.setCellId(cellId);
	 				try{
						this.checkReferance(referNode, expParts, columns, rows);
					}
					catch(err){
						//记录下编译验证表达式失败
					}
				}
			}
	
			//HashMap<String, CellReferanceNode>
			cellIdToCellReferNodesForEffect = new Object();
			if(cmnPcr.getObjectPropertyCount(cellIdToCellReferNodes) > 0){
				for(var cellId in cellIdToCellReferNodes){
					var refNode = cellIdToCellReferNodes[cellId];
					var refNodeForEffect = new CellReferanceNode();
					cellIdToCellReferNodesForEffect[cellId] = refNodeForEffect;
					refNodeForEffect.setCellId(cellId);
					
					for(var refCellId in refNode.getReferCellIds()){
						refNodeForEffect.getReferCellIds()[refCellId] = "";
					}
				}
			}
			
			//List<String>
			var waitingCheckExpCellIds = new Array();
			
			//先遍历所有的不含表达式的节点，去掉各个表达式单元格对应的引用情况，并去除引用记录，然后再遍历所有的cellIdToCellReferNodes，去掉不包含引用的；然后在剩余的节点中，去掉对刚刚被去除节点的引用，当发现去除掉的节点为0，但是cellIdToCellReferNodes还有剩余，那么说明出现了循环引用
			//List<String>
			var noneExpNodeIds = this.getNoneExpNodeIds();
			this.getNoneSameSheetReferNodeIds(cellIdToCellReferNodes, noneExpNodeIds, waitingCheckExpCellIds);
			if(cmnPcr.getObjectPropertyCount(cellIdToCellReferNodes) > 0){
				//存在循环引用
				var sb = "存在单元格循环引用, 包括: ";
				for(var cellId in cellIdToCellReferNodes){
					var cell = this.eg.allCells[cellId];
					var colId = cell.columnId;
					var rowId = cell.rowId;
					var colName = columns.getColumnNameById(colId);
					var rowName = rows.getRowNameById(rowId);
					sb = sb +colName + rowName + ";";
				}
				
				throw new Error(sb);
			} 
			
			//验证表达式语法是否正确 
			var errors = "";
			for(var i = 0; i < waitingCheckExpCellIds.length; i++){
				var cellId = waitingCheckExpCellIds[i];
				//List<ExpTreePart>
				var expParts = cellIdToExpParts[cellId];
				var rootPart = vd.getRootPart(expParts, cellValueTypes, null, runAt.All);
				cellIdToRootParts[cellId] = rootPart;
				var error = this.validateExp(vd, cellId, rootPart, cellValueTypes, columns, rows);
				if(error != null){
					errors = errors + "\r\n" + error;
				}
			}
		
			var vr = new ExcelGridValidateResult();
			vr.setError(errors);
			vr.setAllCellRootParts(cellIdToRootParts);
			vr.setCalcCellList(waitingCheckExpCellIds);
			vr.setColumns(columns);
			vr.setRows(rows);
			
			if(vr.getSucceed()){
				this.setAllCellEffects(cellIdToCellReferNodesForEffect);
	
				for(var cellId in cellIdToRootParts){
					var cell = this.eg.allCells[cellId];
					var rootPart = cellIdToRootParts[cellId];  
					var jsCode = vd.toExpPartJsCode(rootPart);
					cell.jsCode = jsCode; 
				}
			}
			
			return vr;
		}
		catch(ex){ 
			var vr = new ExcelGridValidateResult();
			vr.setError(ex.message); 
			return vr;
		}
	} 
	
	this.validateExp = function(vd, cellId, rootPart, cellValueTypes, columns, rows){
		try{
			var resultValueTypeStr = vd.getExpResultValueType(rootPart, null);
			var resultValueType = resultValueTypeStr.toLowerCase();
			this.eg.allCells[cellId].cellValueType = resultValueType;
			cellValueTypes[cellId] = resultValueType;
			return null;
		}
		catch(ex){
			var cellName = this.getCellNameById(cellId, columns, rows);
			return cellName + ": " + ex.description;
		}
	}
	
	this.getNoneExpNodeIds = function(){
		var noExpNodeIds = new Array();
		for(var cellId in this.eg.allCells){
			var cell = this.eg.allCells[cellId];
			if(!cell.isExp()){
				noExpNodeIds.push(cellId);
			}
		}
		return noExpNodeIds;
	}
	
	this.getCellNameById = function(cellId, columns, rows){
		var cell = this.eg.allCells[cellId];
		var colId = cell.columnId;
		var rowId = cell.rowId;
		var cellName = columns.getColumnNameById(colId) + rows.getRowNameById(rowId);
		return cellName;
	}
	
	//递归获取有没有形成循环引用
	this.getNoneSameSheetReferNodeIds = function(cellIdToCellReferNodes, needRemoveNodeIds, waitingCheckExpCellIds){
		var noRefNodeIds = new Array();
		for(var cellRefNodeId in cellIdToCellReferNodes){ 
			var cellRefNode = cellIdToCellReferNodes[cellRefNodeId];
			var cellIds = cellRefNode.getReferCellIds();
			for(var i = 0;i < needRemoveNodeIds.length; i++){
				var needRemoveNodeId = needRemoveNodeIds[i];
				if(cellIds[needRemoveNodeId] != null){
					delete cellIds[needRemoveNodeId];
				}
			}
			var refCount = cmnPcr.getObjectPropertyCount(cellRefNode.getReferCellIds());  
			if(refCount == 0){
				noRefNodeIds.push(cellRefNode.getCellId());
				waitingCheckExpCellIds.push(cellRefNode.getCellId());
			}
		}
		for(var i = 0;i < noRefNodeIds.length; i++){
			var noRefNodeId = noRefNodeIds[i]; 
			delete cellIdToCellReferNodes[noRefNodeId];
		}
		
		if(noRefNodeIds.length > 0){
			this.getNoneSameSheetReferNodeIds(cellIdToCellReferNodes, noRefNodeIds, waitingCheckExpCellIds);
		} 
	}
}

function ExcelGridColumns(columnIds){
	//HashMap<String, Integer>
	this.columnNameToIndex = new Object();
	
	//HashMap<String, Integer>
	this.columnIdToIndex = new Object();
	
	//List<String>
	this.allColumnNames = new Array();
	
	//List<String>
	this.allColumnIds = new Array();

	this.size = function(){
		return this.allColumnIds.length;
	}
	
	this.getColumnIndexByName = function(name){
		if(this.columnNameToIndex[name] != null){
			return this.columnNameToIndex[name];
		}
		else{
			return null;
		}
	}
	this.getColumnNameById = function(colId){
		if(this.columnIdToIndex[colId] != null){
			var colIndex = this.columnIdToIndex[colId];
			return this.allColumnNames[colIndex];
		}
		else{
			return null;
		}
	}
	
	this.getColumnId = function(colIndex){
		if(this.allColumnIds.length > colIndex){
			return this.allColumnIds[colIndex];
		}
		else{
			return null;
		}
	}
	
	this.getColumnIndex = function(colId){
		if(this.columnIdToIndex[colId] != null){
			return this.columnIdToIndex[colId];
		}
		else{
			return null;
		}
	}
	
	this.init = function(columnIds){
		this.allColumnIds = columnIds;
		var columnCount = columnIds.length;
		var columnIndex =  0;
		for(var i = -1; i < 26; i++){
			var chr1 = (i == -1) ? "" : String.fromCharCode(i + 65);
			for(var j = 0; j < 26; j++){
				var chr2 = String.fromCharCode(j + 65);
				var columnName = chr1 + chr2;
				var columnId = columnIds[columnIndex];
				this.columnNameToIndex[columnName] = columnIndex;
				this.columnIdToIndex[columnId] = columnIndex;
				this.allColumnNames.push(columnName);
				columnIndex++;
				if(columnCount <= columnIndex){
					break;
				}
			}	
			if(columnCount <= columnIndex){
				break;
			}	
		}		
	}	
	
	this.init(columnIds);
}

function ExcelGridRows(rowIds){
	this.rowNameToIndex = new Object();
	this.rowIdToIndex = new Object();
	this.allRowNames = new Array();
	this.allRowIds = new Array();

	this.size = function(){
		return this.allRowIds.length;
	}
	
	this.getRowIndexByName = function(name){
		if(this.rowNameToIndex[name] != null){
			return this.rowNameToIndex[name];
		}
		else{
			return null;
		}
	}
	
	this.getRowId = function(rowIndex){
		if(this.allRowIds.length > rowIndex && rowIndex >= 0){
			return this.allRowIds[rowIndex];
		}
		else{
			return null;
		}
	}
	
	this.getRowIndex = function(rowId){
		if(this.rowIdToIndex[rowId] != null){
			return this.rowIdToIndex[rowId];
		}
		else{
			return null;
		}
	}
	
	this.getRowNameById = function(rowId){
		if(this.rowIdToIndex[rowId] != null){
			var rowIndex = this.rowIdToIndex[rowId];
			return (rowIndex + 1).toString();
		}
		else{
			return null;
		}
	}
	
	this.init = function(rowIds){
		this.allRowIds = rowIds;
		var rowCount = rowIds.length; 
		for(var i = 0; i < rowCount; i++){  
			var rowName = (i + 1).toString();
			var rowId = rowIds[i];
			this.rowNameToIndex[rowName] = i;
			this.rowIdToIndex[rowId] = i;
			this.allRowNames.push(rowName); 
		}		
	}	
	this.init(rowIds);
}

function CellReferanceNode(){
	this.cellId;
	
	//HashMap<String, String>
	this.referCellIds = new Object();
	this.getCellId = function() {
		return this.cellId;
	}
	this.setCellId = function(cellId) {
		this.cellId = cellId;
	}
	this.getReferCellIds = function() {
		return this.referCellIds;
	}
	this.setReferCellIds = function(referCellIds) {
		this.referCellIds = referCellIds;
	}	
}


//验证表达式
function ExcelGridExpressionValidator(){ 
	
	this.getFunction = function(name){
		for(var categoryName in excelExpFunctions){
			var cate = excelExpFunctions[categoryName];
			for(var funcName in cate){
				if(funcName.toLowerCase() == name){
					return cate[funcName];
				}
			}
		}
		return null;
	}
	this.getOperator = function(name){
		for(var categoryName in excelExpOperators){
			var op = excelExpOperators[categoryName]; 
			if(op.name.toLowerCase() == name){
				return op;
			} 
		}
		return null;
	}
	
	//PartType为单元格引用或区域引用的，不验证参数类型
	this.getFunctionSetting = function(func, paramTypes, paramPartTypes){
		if(func.settings != null){
			for(var i = 0; i < func.settings.length; i++){
				var funcSetting = func.settings[i];
			 	var ps = funcSetting.parameters;
			 	if((ps == null || ps.length == 0 )){
			 		if((paramTypes == null || paramTypes.length ==0)){
			 			return funcSetting;
			 		}
			 		else{
			 			continue;
			 		}
			 	}
			 	else{
			 		if(paramTypes == null){
			 			continue;
			 		}
			 		else {
				 		var funcSettingParamCount = ps.length;
				 		var expFuncParamCount = paramTypes.length;
				 		
			 			if(expFuncParamCount == funcSettingParamCount){
				 			var checked = true;
				 			for(var j = 0; j < funcSettingParamCount; j++){
				 				var paramType = paramTypes[j];
				 				var paramPartType = paramPartTypes[j];
				 				
				 				//PartType为单元格引用或区域引用的，不验证参数类型
				 				if(paramPartType != partType.CellReferance && paramPartType != partType.RangeReferance){
					 				var p = ps[j];
					 				if(p.valueType != paramType){
					 					checked = false;
					 					break;
					 				}
				 				}
				 			}
				 			if(checked){
				 				return funcSetting;
				 			}
				 			else{
				 				continue;
				 			} 
			 			}
				 		else if(expFuncParamCount > funcSettingParamCount){
				 			//参数个数不相等，看看表达式中的参数多出来的部分，是不是函数定义里允许参数重复了
				 			var repeatableParamType = new Array();
				 			var fromRepeatIndex = 0;
				 			for(var j = funcSettingParamCount - 1; j >=0; j--){
				 				var p = ps[j];
				 				if(p.repeatable){
				 					repeatableParamType.push(p.valueType);
				 					fromRepeatIndex = j;
				 				}
				 				else{
				 					break;
				 				}
				 			}
				 			var repeatableParamCount = repeatableParamType.length;
				 			if(repeatableParamCount == 0){
				 				continue;
				 			}
				 			else {
				 				var repeatParamCount = expFuncParamCount - fromRepeatIndex;
				 				if(repeatParamCount % repeatParamCount  == 0){
				 					var repeatCount = Math.floor(repeatParamCount / repeatableParamCount);
				 					
				 					var allRepeatParamValueTypeStr = ""; 
				 					for(var j = fromRepeatIndex; j < expFuncParamCount; j++){
				 						allRepeatParamValueTypeStr = allRepeatParamValueTypeStr + paramTypes[j] + ";";
				 					}
				 					
				 					var allRepeatableParamValueTypeStr = ""; 
				 					for(var j = 0; j < repeatCount; j++){
				 						for(var k = 0; k < repeatableParamCount; k++){
				 							allRepeatableParamValueTypeStr = allRepeatableParamValueTypeStr + repeatableParamType.get(k) + ";";
				 						}
				 					}
				 					if(allRepeatParamValueTypeStr == allRepeatableParamValueTypeStr){
				 						return funcSetting;
				 					}
				 					else{
				 						continue;
				 					}
				 				}
				 				else{
				 					continue;
				 				}
				 			}
				 		}
				 		else {
				 			continue;
				 		}
			 		}
			 	}
			}
			return null;
		}
		else{
			return null;
		}
	}
	
	this.createPart = function(text, partType, resultType){
		var part = new ExpTreePart();
		part.setText(text);
		part.setPartType(partType);
		part.setResultType(resultType);
		return part;
	}
	
	this.validateExp = function(exp, cellValueTypes, columns, rows, fieldTypes, expRunAt, needResultType){
		var parameters = new Array();
		for(var key in fieldTypes){
			var vType = fieldTypes[key];
			var parameter = new Parameter();
			parameter.setName(key);
			parameter.setValueType(expCommonValueType.getRuntimeValueType(valueType.toString().toLowerCase()));
			parameters.push(parameter);
		}
		
		
		//！！！！！！！！！！！
		//1. 实现验证表达式，增加了cellValueTypes, columns, rows三个参数；
		//2. 在testExcelExpression.jsp页面实现客户端调用服务器端的OnlineExcelGridService类里的validateExcelExpression方法，来验证表达式。需要在配置文件里声明OnlineExcelGridService服务。

		return this.validateExp(exp, cellValueTypes, columns, rows, parameters, expRunAt, needResultType == null ? "": needResultType.toString().toLowerCase());
	}
	
	this.getExpTreeParts = function(exp, cellValueTypes, columns, rows){
		var errors = new Array();
		try{			
			var allParts = this.splitParts(exp, errors);
			
			if(errors.length != 0){
				var errorStr = "";
				for(var i=0; i < errors.length; i++){
					errorStr = errorStr + errors[i] + "\r\n";
				} 
				throw new Error("表达式验证未通过. Expression:" + exp + ". Errors:" + errorStr);
			}
			
			//识别单元格引用
			this.findCellReference(allParts, cellValueTypes, columns, rows);
			
			return allParts;			
		}
  		catch(ex){
  			throw ex;
		}
	}
	
	this.getExpTreePartValueType = function(allParts, cellValueTypes){
		for(var i = 0; i < allParts.length; i++){
			var expTreePart = allParts[i];
			switch(expTreePart.getPartType()){ 
				case partType.CellReferance:
					if(expTreePart.getCellReferSourceType() == cellReferanceSourceType.CurrentSheet){
						var cellReferInfo = expTreePart.getCellRefInfo();
						var cellId = cellReferInfo.getColId() + "_" + cellReferInfo.getRowId();
						var cellValueType = cellValueTypes[cellId];
						expTreePart.setResultType(expCommonValueType.getRuntimeValueType(cellValueType.toString()));
					}
					else{
						//暂不支持跨Sheet页单元格引用
					}
					break;
				case partType.RangeReferance:
					expTreePart.setResultType(expCommonValueType.Array);
					break;
			}
		}
	}
	
	this.validateExp = function(exp, cellValueTypes, columns, rows, userParameters, expRunAt, needResultType){
		try{
			var allParts = this.getExpTreeParts(exp, cellValueTypes, columns, rows);
			var rootPart = this.getRootPart(allParts, cellValueTypes, userParameters, expRunAt);
			var resultType = this.getExpResultValueType(rootPart, needResultType);
			
			var result = new ValidateResult(); 
			result.setValueType(resultType);  
			result.setRootPart(rootPart);
			result.setRunAt(expRunAt); 
			return result;
		}
		catch(ex){
			var result = new ValidateResult();
			result.setError(ex.description);  
			result.setRunAt(runAt.None); 
			return result;
		}
	} 
	
	this.getRootPart = function(allParts, cellValueTypes, userParameters, expRunAt){

		var errors = new Array();
		
		this.getExpTreePartValueType(allParts, cellValueTypes);
		
		var userParameterHash = new Object();
		if(userParameters != null){
			for(var i = 0; i < userParameters.length; i++){
				var p = userParameters[i];
				var name = p.getName().toLowerCase();
				if(userParameterHash[name] != null){
					errors.add("存在多个名为" + name + "的参数, 不区分大小写");
				}
				else{
					userParameterHash[name]  = p.getValueType();
				}
			}
		}
		var resultType = null;
		
		//词法分析结果  
				
		if(errors.length == 0){
			if(this.checkPartType(allParts, userParameterHash, errors)){
				allParts = this.processBracket(allParts, errors); 
				if(errors.length == 0){
					//构造树 
					allParts = this.processFunctionBracket(allParts, errors);
					if(errors.length == 0){						
						allParts = this.processComma(allParts, errors);
						//构造树,处理了逗号
						if(errors.length == 0){
							allParts = this.processOperatorLevel2(allParts, errors);
							//处理了乘法除法
							if(errors.length == 0){
								allParts = this.processOperatorLevel1(allParts, errors);
								//处理了加法减法								
								if(errors.length == 0){
									return this.checkRootPart(allParts); 
								}
							}
						}
					}					
				}
			}
		}		
		
		var errorStr = "";
		for(var i=0; i < errors.length; i++){
			errorStr = errorStr + errors[i] + "\r\n";
		} 
		
		throw new Error(errorStr);
	}
	
	this.getExpResultValueType = function(rootPart, needResultType){
		var errors = new Array();
		var resultType = this.processFunctionResultType(rootPart, runAt.Server, errors);
		
		var resultClientType = expCommonValueType.getClientValueType(resultType);
		if(needResultType != null && needResultType.length() != 0){
			if(resultClientType != null && needResultType != resultClientType) {
				if((resultClientType == "time" && needResultType == "date") || (resultClientType == "date" && needResultType == "time")){
					//如果两者为时间或日期类型，那么也认为是可以的
				}
				else{
					errors.push("返回值类型错误. 要求返回值类型为" + needResultType.toString() + ", 实际返回值为" + resultClientType.toString());
				}
			}
		}		
 
		var errorStr = "";  
		for(var i = 0; i < errors.length; i++){
			errorStr += errors[i];
		}
		
		if(errors.length != 0){
			throw new Error(errorStr);
		}
		else{
			return resultClientType;
		}
	}
	
	this.findCellReference = function(allParts, cellValueTypes, columns, rows){
		for(var i = 0; i < allParts.length; i++){
			var p = allParts[i];
			if(p.getPartType() == partType.Unknown){
				var ps = p.getText().split("!");
				var cReferanceSourceType = ps.length == 1 ? cellReferanceSourceType.CurrentSheet : cellReferanceSourceType.RemoteSheet;
				var names = ps[ps.length - 1].split(":");
				if(names.length == 1){
					var cellName = names[0];
					var cellRefInfo = this.getCellReferenceInfo(cellName, columns, rows);
					if(cellRefInfo != null){
						if(cellRefInfo.getColName().length != 0 && cellRefInfo.getRowName().length != 0){
							p.setCellRefInfo(cellRefInfo);
							p.setPartType(partType.CellReferance);
							p.setCellReferSourceType(cReferanceSourceType);
							var rowId = cellRefInfo.getRowId();
							var colId = cellRefInfo.getColId();
							var cellId = colId + "_" + rowId;
							var cellValueType = cellValueTypes[cellId];
							p.setResultType(expCommonValueType.getRuntimeValueType(cellValueType.toString()));
						}
					}
				}
				else if(names.length == 2){
					var fromCellName = names[0];
					var toCellName = names[1];
					var fromCellRefInfo = this.getCellReferenceInfo(fromCellName, columns, rows);
					var toCellRefInfo = this.getCellReferenceInfo(toCellName, columns, rows);
					if(fromCellRefInfo != null && toCellRefInfo != null){
						if(((fromCellRefInfo.getColName().length == 0 && toCellRefInfo.getColName().length == 0) || (fromCellRefInfo.getColName().length != 0 && toCellRefInfo.getColName().length != 0))
							&& ((fromCellRefInfo.getRowName().length == 0 && toCellRefInfo.getRowName().length == 0) || (fromCellRefInfo.getRowName().length != 0 && toCellRefInfo.getRowName().length != 0))								
							&& (fromCellRefInfo.isColAbsolute() == toCellRefInfo.isColAbsolute())
							&& (fromCellRefInfo.isRowAbsolute() == toCellRefInfo.isRowAbsolute())){							
							p.setFromCellRefInfo(fromCellRefInfo);
							p.setToCellRefInfo(toCellRefInfo); 
							p.setPartType(partType.RangeReferance);
							p.setCellReferSourceType(cReferanceSourceType);
						}
					}
				}
			}
		}
	}

	this.getCellReferenceInfo = function(cellName, columns, rows){
		var isCellRef = true; 
		var j = 0;
		var letterPos = new Array();
		var numPos = new Array();
		var dollarPos = new Array();
		while(j < cellName.length){
			var chr = cellName[j];
			if(chr == '$'){
				dollarPos.push(j);
			}
			else if(chr >= 'A' && chr <= 'z'){
				letterPos.push(j);
			}
			else if(chr >= '0' && chr <= '9'){
				numPos.push(j);
			}
			else{
				isCellRef = false;
				break;
			}
			j++;
		}
		if(isCellRef){
			if(dollarPos.length == 0){
				for(var lIndex = 0; lIndex < letterPos.length; lIndex++){
					var letterIndex = letterPos[lIndex];
					for(var nIndex = 0; nIndex < numPos.length; nIndex++){
						var numIndex = numPos[nIndex];
						if(numIndex < letterIndex){
							isCellRef = false;
							break;
						}
					}
				}
			}
			else if(dollarPos.length == 1){
				var dollarIndex = dollarPos[0];
				if(dollarIndex == 0){
					for(var lIndex = 0; lIndex < letterPos.length; lIndex++){
						var letterIndex = letterPos[lIndex];
						for(var nIndex = 0; nIndex < numPos.length; nIndex++){
							var numIndex = numPos[nIndex];
							if(numIndex < letterIndex){
								isCellRef = false;
								break;
							}
						}
					}
				}
				else{
					for(var lIndex = 0; lIndex < letterPos.length; lIndex++){
						var letterIndex = letterPos[lIndex];
						if(letterIndex > dollarIndex){
							isCellRef = false;
							break;
						}
					}	
					for(var nIndex = 0; nIndex < numPos.length; nIndex++){
						var numIndex = numPos[nIndex];
						if(numIndex < dollarIndex){
							isCellRef = false;
							break;
						}
					}							
				}
			}
			else if(dollarPos.length == 2){
				var dollarAIndex = dollarPos[0];
				var dollarBIndex = dollarPos[1];
				if(dollarAIndex > 0){
					isCellRef = false;
				}
				else if(dollarBIndex == 1 && dollarBIndex == cellName.length - 1){
					isCellRef = false;
				} 
				else{
					for(var lIndex = 0; lIndex < letterPos.length; lIndex++){
						var letterIndex = letterPos[lIndex];
						if(letterIndex > dollarBIndex){
							isCellRef = false;
							break;
						}
					}	
					for(var nIndex = 0; nIndex < numPos.length; nIndex++){
						var numIndex = numPos[nIndex];
						if(numIndex < dollarBIndex){
							isCellRef = false;
							break;
						}
					}							
				}
			}
			else{
				isCellRef = false;
			}
			if(isCellRef){
				var colName = "";
				var rowName = "";
				var colId = "";
				var rowId = "";
				var colAbsolute = false;
				var rowAbsolute = false;
				if(letterPos.length > 0){
					var firstLetterIndex =  letterPos[0];
					if(firstLetterIndex > 0){
						colAbsolute = cellName[firstLetterIndex - 1] == '$';
					}
				}
				for(var lIndex = 0; lIndex < letterPos.length; lIndex++){
					var letterIndex = letterPos[lIndex];
					colName +=  cellName[letterIndex].toUpperCase();
				}
				if(numPos.length > 0){
					var firstNumIndex =  numPos[0];
					if(firstNumIndex > 0){
						rowAbsolute = cellName[firstNumIndex - 1] == '$';
					}
				}
				for(var nIndex = 0; nIndex < numPos.length; nIndex++){
					var numIndex = numPos[nIndex];
					rowName += cellName[numIndex];
				}		
				if(colName.length != 0){
					var colIndex = columns.getColumnIndexByName(colName);
					if(colIndex == null){
						isCellRef = false;
					}
					else{
						colId = columns.getColumnId(colIndex);
					}
				}
				if(rowName.length != 0){
					var rowIndex = parseInt(rowName) - 1;
					rowId = rows.getRowId(rowIndex);
					if(rowId == null){
						isCellRef = false;
					} 
				}
				if(isCellRef){
					var cellRefInfo = new CellReferanceInfo(colName, colId, colAbsolute, rowName, rowId, rowAbsolute);
					return cellRefInfo;
				}
				else{
					return null;
				}
			}
			else{
				return null;
			}
		}
		else{
			return null;
		}
	} 
	
	this.processFunctionResultTypeByParameters = function(part, functionName, parameterValueTypes, parameterPartTypes, expRunAt, errors){
		var func = this.getFunction(functionName.toLowerCase());
		if(func.runAt == expRunAt || func.runAt == runAt.All){ 
			var funcSetting = this.getFunctionSetting(func, parameterValueTypes, parameterPartTypes);				
			if(funcSetting == null){
				errors.push("函数\"" + functionName + "\"的参数类型错误");
				return null;
			}
			else {
				part.setFunctionSetting(funcSetting);
				return funcSetting.valueType;
			}
		}
		else{
			errors.push("函数\"" + functionName + "\"的只允许运行在" + func.runAt + "端");
			return null;
		}
	}
	
	//获取此part实际对应的内容的类型，用于在判断函数的functionsetting时使用
	this.getBracketInnerPartType = function(var part){
		if(part.getPartType() != partType.Bracket){
			return part.getPartType();
		}
		else{
		   var childParts = part.getAllChildParts();
		   if(childParts.length == 1){
			   return this.getBracketInnerPartType(childParts[0]);
		   }
		   else{
			   return partType.Bracket;
		   }
		}
	}
	 
	//处理函数的返回值类型
	this.processFunctionResultType = function(parentPart, expRunAt, errors){
		var parentPartType = parentPart.getPartType();
		if(parentPartType == partType.Function){
			var treeParts = parentPart.getAllChildParts();
			if(treeParts != null){				 
				if( treeParts.length % 2 == 0){
					errors.push("函数\"" + parentPart.getText() + "\"的参数定义错误");
					return null;
				}
				else{
					var canGetParameterValueType = true;
					var parameterValueTypes = new Array();
					var parameterPartTypes = new Array();
					for(var i = 0;i < treeParts.length; i++){
						var p = treeParts[i];
						if(i % 2 == 0){
							var vt = this.processFunctionResultType(p, expRunAt, errors);
							if(vt != null){
								parameterValueTypes.push(vt);
								parameterPartTypes.push(this.getBracketInnerPartType(p));
							}
							else{
								canGetParameterValueType=false;
								break;
							}
						}
						else{
							if(p.getPartType() != partType.Comma){
								errors.push("函数\"" + parentPart.getText() + "\"的参数定义错误");
							}
						}						
					}
					if(canGetParameterValueType){
						var resultType = this.processFunctionResultTypeByParameters(parentPart, parentPart.getText(), parameterValueTypes, parameterPartTypes, expRunAt, errors);
						parentPart.setResultType(resultType);
						return resultType;
					}
					else{
						return null;
					}
				}
			}
			else{
				var resultType = this.processFunctionResultTypeByParameters(parentPart,  parentPart.getText(), null, null, expRunAt, errors);
				parentPart.setResultType(resultType);
				return resultType;
			}
		} 
		else if(parentPartType == partType.Comma){
			errors.push("无效的表达式, 逗号\",\"出现的位置错误");
			return null;
		}
		else if(parentPartType == partType.Constant){
			return parentPart.getResultType();
		}
		else if(parentPartType == partType.Bracket){
			var resultType =  this.processFunctionResultTypeByPartList(parentPart.getAllChildParts(), expRunAt, errors);
			parentPart.setResultType(resultType);
			return resultType;
		}
		else if(parentPartType == partType.UserParameter){
			return parentPart.getResultType();
		}
		else if(parentPartType == partType.CellReferance){
			return parentPart.getResultType();
		}
		else if(parentPartType == partType.RangeReferance){
			return parentPart.getResultType();
		}
		else{
			errors.push("无效的表达式" + parentPart.getText());
			return null;
		}
	}
	 
	//处理函数的返回值类型
	this.processFunctionResultTypeByPartList = function(rootParts, expRunAt, errors){
		if(rootParts != null && rootParts.length > 1){
			errors.push("请确认是否输入了一个完整的表达式, 有无出现空格使得表达式断开, 或者为空表达式");
			return null;
		}
		else if(rootParts == null || rootParts.length == 0){
			return null;
		}
		else{
			var rootPart = rootParts[0]; 
			return this.processFunctionResultType(rootPart, expRunAt, errors); 
		}
	}
	 
	//处理函数的返回值类型
	this.checkRootPart = function(rootParts){
		if(rootParts != null && rootParts.length > 1){
			throw new Error("请确认是否输入了一个完整的表达式, 有无出现空格使得表达式断开, 或者为空表达式");
		}
		else if(rootParts == null || rootParts.length == 0){
			return null;
		}
		else{
			var rootPart = rootParts[0]; 
			return rootPart; 
		}
	}

	//处理加减法法等级别为1的操作符，替换为函数
	this.processOperatorLevel2 = function(treeParts, errors){
		var operators = new Array();
		operators.push("*");
		operators.push("/");
		return this.processOperatorLevel(treeParts, errors, operators);
	}

	//处理加减法法等级别为1的操作符，替换为函数
	this.processOperatorLevel1 = function(treeParts, errors){
		var operators = new Array();
		operators.push("+");
		operators.push("-");
		operators.push(">");
		operators.push("=");
		operators.push("<");
		operators.push(">=");
		operators.push("<=");
		operators.push("&&");
		operators.push("||");
		return this.processOperatorLevel(treeParts, errors, operators);
	}
	
	//处理乘除法等级别为2的操作符
	this.processOperatorLevel = function(treeParts, errors, operators){
		if(treeParts!=null){
			var newTreeParts = new Array();
			var operatorIndexs = new Array(); 
			for(var i = 0; i < treeParts.length; i++){
				var p = treeParts[i];
				if(p.getPartType() == partType.Operator){
					if(operators.contains(p.getText())) {
						operatorIndexs.push(i);						
					}
				}
			} 
			if(operatorIndexs.length > 0){ 
				for(var i = 1; i < operatorIndexs.length; i++){
					if(operatorIndexs[i] - operatorIndexs[i-1] == 1){
						errors.push("运算符 " + treeParts[operatorIndexs[i-1]].getText() + " 和 " + treeParts[operatorIndexs[i]].getText() + " 不允许相邻");
					}
				}
				if(errors.length == 0){
					var opIndex = 0;
					var i = 0;
					while(i < treeParts.length) {
						if(opIndex < operatorIndexs.length){
							if(i == operatorIndexs[opIndex]){
								var p = treeParts[i];
								var functionName = this.getOperator(p.getText()).functionName;
								var newPart = new ExpTreePart();
								newPart.setText(functionName);
								newPart.setParentPart(p.getParentPart());
								newPart.setPartType(partType.Function);
								var operatorChildParts = new Array();
								newPart.setAllChildParts(operatorChildParts);
								if(i > 0){
									var previousPart = newTreeParts[newTreeParts.length - 1];
									previousPart.setParentPart(newPart);
									operatorChildParts.push(previousPart);
									var tempTreeParts = newTreeParts;
									newTreeParts = new Array();
									for(var t = 0; t < newTreeParts.length - 1; t++){
										newTreeParts.push(tempTreeParts[t]);
									}
								}
								if(i > 0 && i < treeParts.length - 1){ 
									var commaPart = new ExpTreePart();
									commaPart.setText(",");
									commaPart.setParentPart(newPart);
									commaPart.setPartType(partType.Comma);
									operatorChildParts.push(commaPart); 
								} 
								if(i < treeParts.length - 1){
									var nextPart = treeParts[i+1];
									nextPart.setParentPart(newPart);
									operatorChildParts.push(nextPart);
									nextPart.setAllChildParts(this.processOperatorLevel(nextPart.getAllChildParts(), errors, operators));
								}
								newTreeParts.push(newPart);
								i = i + 2;
								opIndex++; 
							}
							else if(i >= 0){
								var p = treeParts[i];
								newTreeParts.push(p);
								p.setAllChildParts(this.processOperatorLevel(p.getAllChildParts(), errors, operators));
								i++;
							}
						}
						else{
							var p = treeParts[i];
							newTreeParts.push(p);
							p.setAllChildParts(this.processOperatorLevel(p.getAllChildParts(), errors, operators));
							i++;
						}
					}
				}
				return newTreeParts;
			}
			else{
				for(var i = 0; i < treeParts.length; i++){
					var childPart =treeParts[i];
					childPart.setAllChildParts(this.processOperatorLevel(childPart.getAllChildParts(), errors, operators));					
				}
				return treeParts;
			}
		}
		else{
			return null;
		}
	}
	
	//处理逗号
	this.processComma = function(treeParts, errors){
		if(treeParts != null && treeParts.length > 0){
			var commaIndexs = new Array();
			for(var i = 0; i < treeParts.length; i++){
			   var p = treeParts[i];
			   if(p.getPartType() == partType.Comma){
				   commaIndexs.push(i);
			   }
			   p.setAllChildParts(this.processComma(p.getAllChildParts(), errors));
			}
			if(commaIndexs.length == 0){
				return treeParts;
			}
			else{
				var newTreeParts = new Array();
				for(var j = 0; j <= commaIndexs.length; j++){
					var beginIndex = (j==0 ? 0 : commaIndexs[j - 1] + 1);
					var endIndex = (j == commaIndexs.length ? treeParts.length - 1: commaIndexs[j] - 1);
					if(beginIndex <= endIndex){
						var newPart = new ExpTreePart();
						newPart.setParentPart(treeParts[beginIndex].getParentPart());
						newPart.setPartType(partType.Bracket);
						newPart.setText("()");
						newTreeParts.push(newPart);
						var childParts = new Array();
						for(var k = beginIndex; k <= endIndex; k++){
							var tempPart = treeParts[k];
							childParts.push(tempPart);
							newPart.setAllChildParts(childParts);
						}
					}
					if(j < commaIndexs.length){
						newTreeParts.push(treeParts[commaIndexs[j]]);
					}
				}
				return newTreeParts;
			}
		}
		else{
			return null;
		}
	}
	
	//处理函数的括号
	this.processFunctionBracket = function(treeParts, errors){
		if(treeParts != null && treeParts.length > 0){
			var newTreeParts = new Array();
			var i = 0;
			while(i < treeParts.length){
				var p = treeParts[i];
				if(p.getPartType() == partType.Function){
					if(i + 1 < treeParts.length){
						var nextPart = treeParts[i + 1];
						if(nextPart.getPartType() == partType.Bracket){
							newTreeParts.push(p);
							var childParts = nextPart.getAllChildParts();
							if(childParts != null){
								for(var j = 0; j < childParts.length; j++){
									childParts[j].setParentPart(p);
								}
								p.setAllChildParts(this.processFunctionBracket(childParts, errors));
							}
						}
						else{
							errors.push("函数 " + p.getText() + " 后应为括号及参数");
						}
						i = i + 2;
					}
					else{ 
						errors.push("函数 " + p.getText() + " 后应为括号及参数");
						break;
					} 
				}
				else{
					newTreeParts.push(p);
					var childParts = p.getAllChildParts();
					p.setAllChildParts(this.processFunctionBracket(childParts, errors));
					i++;
				}
			}
			return newTreeParts;
		}
		else{
			return null;
		}
	}
	
	//处理括号
	this.processBracket = function(allParts, errors){
		var bracketPairs= new Object();
		var stockParts = new Array();
		for(var i = 0; i < allParts.length; i++){
			var p = allParts[i];
			if(p.getPartType() == partType.Bracket){
				if(p.getText() =="("){
					stockParts.push(p);
				}
				else{ //为")"
					if(stockParts.length == 0){
						errors.push("括号没有成对出现");
						break;
					}
					else{
						var beginPart = stockParts[stockParts.length - 1];
						var tempStockParts = stockParts;
						stockParts = new Array();
						for(var t = 0; t < tempStockParts.length - 1; t++){
							stockParts.push(tempStockParts[t]);
						}
						bracketPairs[beginPart] = p;
					}
				}
			}
		}
		if(stockParts.length != 0){
			errors.push("括号没有成对出现");
			return null;
		}
		else{
			for(var i = 0; i < allParts.length; i++){
				var p = allParts[i];
				if(p.getPartType() == partType.Bracket){
					if(p.getText() == "("){					
						var endPart = bracketPairs[p];
						
						var endIndex = -1;
						for(var j = 0; j < allParts.length; j++){
							if(allParts[j] == endPart){
								endIndex = j;
							}
						}
						
						for(var j = i + 1; j < endIndex; j++){
							var innerPart = allParts[j];
							innerPart.setParentPart(p);
						}
					}
				}				
			}
			
			var treeParts = new Array();
			for(var i = 0; i < allParts.length; i++){
				var p = allParts[i];
				if(p.getParentPart() == null){
					if(p.getPartType() == partType.Bracket){
						if(p.getText() == "("){
							p.setText("()");
							p.setAllChildParts(new Array());
							treeParts.push(p);
						}
						else{ //为")",放弃之
							//
						}
					}
					else{
						treeParts.push(p);
					}
				}
				else{
					if(p.getPartType() == partType.Bracket){
						if(p.getText() == "("){
							p.setText("()");
							p.setAllChildParts(new Array());
							var childParts = p.getParentPart().getAllChildParts();
							childParts.push(p);
						}
						else{ //为")",放弃之
							//
						}
					}
					else{
						var childParts = p.getParentPart().getAllChildParts();
						childParts.push(p);
					}
				}
			}
			return treeParts;
		} 
	}
	
	//词法分析
	this.splitParts = function(exp, errors) {
		var i = 0;
		var expLength = exp == null ? 0 :  exp.length;
		var tempStr = ""; 
		var inStr = false; 
		var allParts = new Array();
		while(i < expLength){
			var chr = exp.substr(i, 1);
			if(inStr){ //如果现在正在字符串中	
				if(chr == "\\"){
					if(expLength > i+1){
						var nextChr = exp.substr(i+1, 1);
						if(nextChr == "\\"){
							tempStr += chr;
							i = i+2;
							continue;							
						}
						else if(nextChr == "\""){
							tempStr += "\"";
							i = i+2;
							continue;	
						}
						else {
							errors.push("无法识别特殊字符\\" + nextChr);
							break;
						}
					}
					else{
						errors.push("出现未结束的字符串:" + tempStr);
						break;
					}
				}
				else if(chr == "\""){ //如果遇到了"，之前的判断已经确保引号之前不是\，那么表示字符串结束了
					var p = this.createPart(tempStr, partType.Constant, expCommonValueType.String);
					allParts.push(p);
					tempStr = "";
					inStr = false;
					i++;
					continue; 
				}
				else{ //正在字符串内，且未接收到"，那么继续拼接字符串
					tempStr += chr;
					i++;
					continue;
				}
			}
			else { //没有在字符串内
				if(chr == ","){ //如果遇到了双引号，那么字符串开始
					if(tempStr.length != 0){
						var p = this.createPart(tempStr, partType.Unknown, null);
						allParts.push(p);
						tempStr = "";
					}
					var p = this.createPart(chr, partType.Comma, null);
					allParts.push(p); 
					i++; 
					continue;
				}
				else if(chr == "\""){ //如果遇到了双引号，那么字符串开始
						if(tempStr.length != 0){
							var p = this.createPart(tempStr, partType.Unknown, null);
							allParts.push(p);
							tempStr = "";
						}
						inStr = true;
						i++;
						continue;
					}
					else if(chr == " "){ //如果遇到了空格，那么前面的词结束
					if(tempStr.length != 0){
						var p = this.createPart(tempStr, partType.Unknown, null);
						allParts.push(p);
						tempStr = "";
					} 
					i++;
					continue;
				}	
				else if(chr == "(" || chr == ")"){
					if(tempStr.length != 0){
						var p = this.createPart(tempStr, partType.Unknown, null);
						allParts.push(p);
						tempStr = "";
					} 
					var p = this.createPart(chr, partType.Bracket, null);
					allParts.push(p); 
					i++;
					continue;
				}		
				else if(chr == "="){
					if(tempStr.length != 0){
						var p = this.createPart(tempStr, partType.Unknown, null);
						allParts.push(p);
						tempStr = "";
					} 
					var p = this.createPart(chr, partType.Operator, null);
					allParts.push(p); 
					i++;
					continue;
				}	
				else if(chr == ">" || chr == "<"){
					if(expLength > i + 1){
						var nextChr = exp.substring(i + 1, 1);
						if(nextChr == "="){		
							if(tempStr.length != 0){
								var p = this.createPart(tempStr, partType.Unknown, null);
								allParts.push(p);
								tempStr = "";
							} 
							var p = this.createPart(chr + nextChr, partType.Operator, null);
							allParts.push(p); 
							i = i + 2;
							continue;
						}
						else{						
							if(tempStr.length != 0){
								var p = this.createPart(tempStr, partType.Unknown, null);
								allParts.push(p);
								tempStr = "";
							} 
							var p = this.createPart(chr, partType.Operator, null);
							allParts.push(p); 
							i++;
							continue;
						}
					}
					else{
						errors.push("出现未结束的操作符:" + tempStr);
						break;
					}
				}
				else{ 
					
					var op = this.getOperator(chr);
					if(op == null){ //如果不是关键字，那么继续				
						tempStr += chr;
						i++;
						continue;
					}
					else {
						if(tempStr.length != 0){
							var p = this.createPart(tempStr, partType.Unknown, null);
							allParts.push(p);
							tempStr = "";
						} 
						var p = this.createPart(chr, partType.Operator, null);
						allParts.push(p); 
						i++;
						continue;
					}
				}
			}
		}
		 
		if(inStr){ 
			errors.push("出现未结束的字符串:" + tempStr);
		}
		else if(tempStr.length != 0){
			var p = this.createPart(tempStr, partType.Unknown, null);
			allParts.push(p); 
		} 
		return allParts;
	}

	//检验片段的类型
	this.checkPartType = function(allParts, userParameterHash, errors){
		for(var i = 0;i < allParts.length; i++){
			var p = allParts[i];
			this.checkOnePartType(p, userParameterHash);
			if(p.getPartType() == partType.Unknown){
				errors.push("无法识别的内容:" + p.getText());
			}
		}
		return errors.length == 0;
	}
	
	//检验某个片段的类型
	this.checkOnePartType = function(p, userParameterHash){
		if(p.getPartType() == partType.Unknown){ 
			if(this.getFunction(p.getText().toLowerCase()) != null){ 
				p.setPartType(partType.Function);
			}
			else if(userParameterHash !=null && userParameterHash[p.getText().toLowerCase()] != null){ 
				var pValueType = userParameterHash[p.getText()];
				p.setPartType(partType.UserParameter);
				p.setResultType(pValueType);
			}
			else if(cmnPcr.isDecimal(p.getText())){
				p.setPartType(partType.Constant); 
				p.setResultType(expCommonValueType.Decimal);
			}
			else if(cmnPcr.isBoolean(p.getText())){
				p.setPartType(partType.Constant); 
				p.setResultType(expCommonValueType.Boolean);
				p.setText(p.getText().toLowerCase());
			}
		}
	}
	
	this.toExpJsCode = function(validateResult){
		if(validateResult.runAt == expRunAt.Js || validateResult.runAt == expRunAt.All){
			return this.toExpPartJsCode(validateResult.getRootPart());
		}
		else{
			//不能运行在客户端
			throw new Error("无法将表达式转化为JS代码, 此表达式只允许运行在" + validateResult.getRunAt().toString())
		}
	}
	
	this.toExpPartJsCode = function(part){
		var pPartType = part.getPartType();
		switch(pPartType){
			case partType.Operator:
			case partType.Function:{
				var func = this.getFunction(part.getText().toLowerCase());
				var name = func.beanName + "." + func.methodName;
				return name + "(" + this.toJsCode(part.getAllChildParts()) +")";
			}
			case partType.Bracket:{
				return "(" + this.toJsCode(part.getAllChildParts()) +")";
			}
			case partType.Comma:{
				return ",";
			}
			case partType.Constant:{
				var valueType = part.getResultType();
				var text = part.getText();
				if(valueType == expCommonValueType.String){ 
					return "\"" + text + "\"";
				}
				return part.getText();			
			}
			case partType.UserParameter:{
				return part.getText();
			} 

			case partType.CellReferance:{
				var cellReferInfo = part.getCellRefInfo(); 
				return "runningEG.getCellValue(\"" + cellReferInfo.getColId() + "\", \"" + cellReferInfo.getRowId() + "\")";
			}
			 
			case partType.RangeReferance:{
				var fromCellReferInfo = part.getFromCellRefInfo(); 
				var toCellReferInfo = part.getToCellRefInfo();  
				return "runningEG.getRangeValue(\"" + fromCellReferInfo.getColId() + "\", \"" + fromCellReferInfo.getRowId() + "\", \"" + toCellReferInfo.getColId() + "\", \"" + toCellReferInfo.getRowId() + "\")";
			}
			default:{
				throw new Error("获取片段js代码失败" + part.getText());
			}
		}
	}
	
	this.toJsCode = function(allParts){
		if(allParts == null){
			return "";
		}
		else{
			var ss = "";
			for(var i = 0; i < allParts.length; i++){
				var p = allParts[i];
				var s = this.toExpPartJsCode(p);
				ss += s;
			}
			return ss;
		}
	} 
}


function PartType(){
	//常量
	this.Constant = "Constant";
	
	//函数
	this.Function = "Function";
	
	//操作符
	this.Operator = "Operator"; 

	//括号
	this.Bracket = "Bracket";
	
	//逗号
	this.Comma = "Comma"; 
	
	//用户参数
	this.UserParameter = "UserParameter"; 
	
	//未知
	this.Unknown = "Unknown";
	
	//单元格
	this.CellReferance = "CellReferance";
	
	//区域（单元格集合）
	this.RangeReferance = "RangeReferance";
}
var partType = new PartType();

function CellReferanceSourceType(){
	this.CurrentSheet = "CurrentSheet";
	this.RemoteSheet = "RemoteSheet";
}
var cellReferanceSourceType = new CellReferanceSourceType();

function CellReferanceInfo(colName, colId, colAbsolute, rowName, rowId, rowAbsolute){ 
	
	this.colName = colName;
	this.colId = colId;
	this.colAbsolute = colAbsolute;
	this.rowName = rowName;
	this.rowId = rowId;
	this.rowAbsolute = rowAbsolute;
	
	this.clone = function(){
		var newCellRefInfo = new CellReferanceInfo(this.colName, this.colId, this.colAbsolute, this.rowName, this.rowId, this.rowAbsolute);
		return newCellRefInfo;
	}
	
	this.getColName = function() {
		return colName;
	}
	this.setColName = function(colName) {
		this.colName = colName;
	}
	this.getColId = function() {
		return colId;
	}
	this.setColId = function(colId) {
		this.colId = colId;
	}
	this.isColAbsolute = function() {
		return colAbsolute;
	}
	this.setColAbsolute = function(colAbsolute) {
		this.colAbsolute = colAbsolute;
	}
	this.getRowName = function() {
		return rowName;
	}
	this.setRowName = function(rowName) {
		this.rowName = rowName;
	}
	this.getRowId = function() {
		return rowId;
	}
	this.setRowId = function(rowId) {
		this.rowId = rowId;
	}
	this.isRowAbsolute = function() {
		return rowAbsolute;
	}
	this.setRowAbsolute = function(rowAbsolute) {
		this.rowAbsolute = rowAbsolute;
	}
}

function ExpTreePart(){

	//子片段
	this.allChildParts = null;
	
	this.parentPart;
	//此片段内容
	this.text = null;
	//此部分类型
	this.partType = null;
	//返回值类型
	this.resultType = null;
	//返回值类型
	this.functionSetting = null;

	this.cellRefInfo = null;
	
	this.fromCellRefInfo = null;
	
	this.toCellRefInfo = null;
	
	this.cReferSourceType = cellReferanceSourceType.CurrentSheet;
	
	this.clone = function(){
		var newPart = new ExpTreePart();  
		newPart.text  = this.text;
		newPart.partType = this.partType;
		newPart.resultType = this.resultType;
		newPart.functionSetting = this.functionSetting;
		newPart.cReferSourceType = this.cReferSourceType;
		if(this.cellRefInfo != null){
			newPart.cellRefInfo = this.cellRefInfo.clone();
		}
		if(this.fromCellRefInfo != null){
			newPart.fromCellRefInfo = this.fromCellRefInfo.clone();
			newPart.toCellRefInfo = this.toCellRefInfo.clone(); 
		} 
		return newPart;
	}
	
	this.getAllChildParts = function(){
		return this.allChildParts;
	}
	this.setAllChildParts = function(allChildParts){
		this.allChildParts = allChildParts;
	}
	
	this.getParentPart = function(){
		return this.parentPart;
	}
	this.setParentPart = function(parentPart){
		this.parentPart = parentPart;
	}
	
	this.getText = function(){
		return this.text;
	}
	this.setText = function(text){
		this.text = text;
	}
	
	this.getPartType = function(){
		return this.partType;
	}
	this.setPartType = function(partType){
		this.partType = partType;
	}
		
	this.getResultType = function(){
		return this.resultType;
	}
	this.setResultType = function(resultType){
		this.resultType = resultType;
	}

	
	this.getFunctionSetting = function(){
		return this.functionSetting;
	}
	this.setFunctionSetting = function(functionSetting){
		this.functionSetting = functionSetting;
	}

	this.getCellRefInfo = function() {
		return this.cellRefInfo;
	}
	this.setCellRefInfo = function(cellRefInfo) {
		this.cellRefInfo = cellRefInfo;
	}

	this.getFromCellRefInfo = function() {
		return this.fromCellRefInfo;
	}
	this.setFromCellRefInfo = function(fromCellRefInfo) {
		this.fromCellRefInfo = fromCellRefInfo;
	}

	this.getToCellRefInfo = function() {
		return this.toCellRefInfo;
	}
	this.setToCellRefInfo = function(toCellRefInfo) {
		this.toCellRefInfo = toCellRefInfo;
	}
	this.getCellReferSourceType = function() {
		return this.cReferSourceType;
	}
	this.setCellReferSourceType = function(cReferSourceType) {
		this.cReferSourceType = cReferSourceType;
	}
}

function RunAt() {
	//服务器端
	this.Server = "Server";
	
	//Js客户端
	this.Js = "Js";
	
	//全部
	this.All = "All";
	
	//不能运行
	this.None = "None";
}
var runAt = new RunAt();

function ValidateResult(){ 	
	this.getSucceed = function(){
		return this.error.length() == 0;
	} 
	
	this.error = "";
	this.getError = function(){
		return this.error;
	} 
	this.setError = function(error){
		this.error = error;
	}
	
	this.alert = "";
	this.getAlert = function(){
		return this.alert;
	} 
	this.setAlert = function(alert){
		this.alert = alert;
	}
	 
	this.toJson = function(){
		var jsonObj = new Object(); 
		jsonObj["error"] = error;
		jsonObj["alert"] = alert;		
		return jsonObj;
	}
}

function ExcelGridValidateResult(){
	this.allCellRootParts = null;
	this.calcCellList = null;
	this.columns = null;
	this.rows = null;

	this.getAllCellRootParts = function() {
		return allCellRootParts;
	}

	this.setAllCellRootParts = function(allCellRootParts) {
		this.allCellRootParts = allCellRootParts;
	}

	this.getCalcCellList = function() {
		return calcCellList;
	}

	this.setCalcCellList = function(calcCellList) {
		this.calcCellList = calcCellList;
	}

	this.getColumns = function() {
		return columns;
	}

	this.setColumns = function(columns) {
		this.columns = columns;
	}

	this.getRows = function() {
		return rows;
	}

	this.setRows = function(rows) {
		this.rows = rows;
	}
	
	this.getSucceed = function(){
		return this.error.length == 0;
	} 
	
	this.error = "";
	this.getError = function(){
		return this.error;
	} 
	this.setError = function(error){
		this.error = error;
	}
	
	this.alert = "";
	this.getAlert = function(){
		return this.alert;
	} 
	this.setAlert = function(alert){
		this.alert = alert;
	}
	 
	this.toJson = function(){
		var jsonObj = new Object(); 
		jsonObj["error"] = error;
		jsonObj["alert"] = alert;		
		return jsonObj;
	}
}

function ExpCommonValueType(){  
	this.Object = "java.lang.Object";
	this.String = "java.lang.String";
	this.Decimal = "java.math.BigDecimal";
	this.Boolean = "java.lang.Boolean";
	this.DateTime = "java.util.Date";
	this.Array = "com.novacloud.novaone.excelGrid.expression.definition.RangeArray";

	this.convertTo = function(str, vValueType){
		if (str == "" || str == undefined || str == null) {
			return null;
		} 
		else {
			switch(vValueType) {
			case valueType.object:
				return str.toString();
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
				throw new Error("convertTo, type=" + type + ", str=" + str); 
			}
		}
	}

	this.getClientValueType = function(runtimeValueType){
		if(runtimeValueType == null || runtimeValueType.length == 0){
			return null;
		}
		else {
			switch(runtimeValueType){
				case expCommonValueType.Object://"java.lang.String":
					return "object";
				case expCommonValueType.String://"java.lang.String":
					return "string";
				case expCommonValueType.Decimal://"java.math.BigDecimal":
					return "decimal";
				case expCommonValueType.Boolean://"java.lang.Boolean":
					return "boolean";
				case expCommonValueType.DateTime://"java.util.Date":
					return "date";
				case expCommonValueType.Array:
					return "array";
				default:
					throw new Error("Can not convert to client value type : '" + runtimeValueType + "'.");
			}
		}
	}
	
	this.getRuntimeValueType = function(clientValueType){
		if(clientValueType == null || clientValueType.length == 0){
			return null;
		}
		else {
			clientValueType = clientValueType.toLowerCase();
			switch(clientValueType){
				case "object"://"java.lang.String":
					return expCommonValueType.Object;
				case "string"://"java.lang.String":
					return expCommonValueType.String;
				case "decimal"://"java.math.BigDecimal":
					return expCommonValueType.Decimal;
				case "boolean"://"java.lang.Boolean":
					return expCommonValueType.Boolean;
				case "date"://"java.util.Date":
					return expCommonValueType.DateTime;
				case "time"://"java.util.Time":
					return expCommonValueType.DateTime;
				case "Array":
					return expCommonValueType.Array;
				default:
					throw new Error("Can not convert to runtime value type : '" + clientValueType + "'.");
			}
		}
	}	
}	
var expCommonValueType = new ExpCommonValueType(); 
