
function initSheetGrid(grid){
	//初始化多选控件
	var initMultiValueDispUnit = function(grid, columnName, ctrl, options, style){
		var childDataModelName = multiValueFields[columnName].childDataModelName;
		var childFieldName = multiValueFields[columnName].childFieldName;
		var dataModel = dataModels[childDataModelName]; 
		var fieldModel = dataModel.fields[childFieldName]; 
		options.name = columnName;
		$(ctrl).css("background-color", "transparent");
		return $(ctrl).popMultiDispunit({
			idField : fieldModel.foreignKeyName == "" ? null
					: fieldModel.maps[fieldModel.foreignKeyName],
			textField : fieldModel.maps[fieldModel.name],
			options : options,
			showPopFunc : function(p) {
				var columnName = p.options.name;
				var childDataModelName = multiValueFields[columnName].childDataModelName;
				var childFieldName = multiValueFields[columnName].childFieldName;
				var fieldModel = dataModels[childDataModelName].fields[childFieldName]; 
				grid.doPop( {
					viewName : fieldModel.view.name,
					value : p.value,
					rowId : p.options.rowId,
					fieldName : fieldModel.name,
					fieldModel : fieldModel,
					dataModel : dataModel,
					isMultiValue : true,
					changeValueFunc : p.changeValueFunc
				});
			},
			style : style
		}); 	
	}
	
	//构造多值编辑控件
	grid.createCustomDispunit  = function(name, dispunitType, ctrl, fieldModel, options, style){
		
		if(multiValueFields[name] != null){
			return initMultiValueDispUnit(grid, name, ctrl, options, style);
		} 
	}
	
	grid.setCustomDispunitEditValue = function(ctrl, cModel, fieldModel, row){
		var id = row.getValue(grid.dataModel.idFieldName);
		var allPartData = grid.datatable.allChildPartData[id];
		if(allPartData != null){
			var multiValueField = multiValueFields[cModel.name];
			var partName =multiValueField.childPartSheetName;
			var childDataModelName = multiValueField.childDataModelName; 
			var childFieldName = multiValueField.childFieldName;
			var childFieldMaps = dataModels[childDataModelName].fields[childFieldName].maps;
			var popCtrlValues = {};					
			var childRows = allPartData[partName].rows;
			for(var i = 0;i < childRows.length;i++){ 
				var childRow = childRows[i];
				var popRow= {};
				popRow[childFieldMaps["valueid"]] = childRow["valueid"];
				popRow[childFieldMaps["value"]] = childRow["value"];
				popCtrlValues[i] = popRow;
			}
			grid.doCtrlCoreMethod(ctrl, "popMulti", cModel.name, "setValue", popCtrlValues);
		}
	}
	
	//获取数据
	grid.basePage = function(param) {
		var requestParam = {
				serviceName : "dataNcpService",
				waitingBarParentId : grid.containerId,
				funcName : "select",
				successFunc : function(obj) {
					param.datatable = grid.getDataTableFromBackInfo(obj.result.table.rows);
					//获取子表数据
					param.datatable.allChildPartData = obj.result.allChildPartData;
					getMultiDispunitShowText(param.datatable);
					
					param.sumRow = null;// that.getSumRow(obj);  
					param.totalRowCount = obj.result.rowCount;
					grid.setCtrlStatus(formStatusType.browse);
					grid.processPageData(param);
					grid.afterBasePage(param);
					grid.afterDoPage(param);
				},
				args : {
					requestParam : cmnPcr.jsonToStr( {
								dataName : grid.dataModel.name,
								getDataType : "page", 
								currentPage : param.currentPage, 
								pageSize : grid.onePageRowCount,
	
								isGetSum : grid.isGetSum,
								isGetCount : grid.isGetCount,
								where : param.where == undefined ? (grid.where == undefined ? []
										: grid.where)
										: param.where,
								sysWhere : grid.sysWhere == undefined ? []
										: grid.sysWhere,
								orderby : grid.orderby == undefined ? []
										: grid.orderby,
								previousField : param.previousField == undefined ? ""
										: param.previousField,
								previousData : param.previousData == undefined ? ""
										: param.previousData,
								popDataField : param.popDataField == undefined ? ""
										: param.popDataField
							})
				}
			};
			grid.ProcessServerAccess(requestParam);
		}
	
	//保存
	grid.baseSave = function(param) {
		var requestParam = {
			serviceName : "dataNcpService",
			waitingBarParentId : grid.containerId,
			funcName : "save",
			successFunc : function(obj) {
				var dt = grid.getDataTableFromBackInfo( obj.result.table == undefined ? null : obj.result.table.rows,
						obj.result.idValueToRowIds == undefined ? null : obj.result.idValueToRowIds);
				param.table = dt;
				
				//子表数据
				if(obj.result.allChildPartData != null){
					for(var rowId in param.tempChildPartRows){
						var idValue = param.table.rows(rowId).getValue(grid.dataModel.idFieldName);
						param.tempChildPartRows[rowId] =  obj.result.allChildPartData[idValue];
					} 
				}
	
				//从idvalue到rowid的对应关系中，获取rowid到idvalue
				var rowIdToIdValues = {};
				for ( var idValue in obj.result.idValueToRowIds) {
					var rowId = obj.result.idValueToRowIds[idValue];
					rowIdToIdValues[rowId] = idValue;
				}
				param.rowIdToIdValues = rowIdToIdValues;
	
				grid.setCtrlStatus(formStatusType.browse);
				grid.processSaveData(param);
				grid.afterBaseSave(param);
				grid.afterDoSave(param);
			},
			args : {
				requestParam : cmnPcr.jsonToStr( {
					dataName : grid.dataModel.name,
					isRefreshAfterSave : grid.isRefreshAfterSave,
					update : grid.getDatatableHash(param.update),
					insert : grid.getDatatableHash(param.insert),
					childPartRows:param.childPartRows
				})
			}
		};
		grid.ProcessServerAccess(requestParam);
	}
	
	var getMultiDispunitShowText  = function(datatable){
		for(var rowId in datatable.allRows()){
			var row = datatable.rows(rowId);
			getMultiDispunitShowTextInRow(row, datatable.allChildPartData);
		}
	}
	var getMultiDispunitShowTextInRow  = function(row, allChildPartData){
		var id = row.getValue(grid.dataModel.idFieldName);
		var allPartData = allChildPartData[id];
		if(allPartData != null){
			for (var name in multiValueFields){
				var multiValueField = multiValueFields[name];
				var partName =multiValueField.childPartSheetName;
				var childDataModelName = multiValueField.childDataModelName; 
				var childFieldName = multiValueField.childFieldName;
				var childFieldMaps = dataModels[childDataModelName].fields[childFieldName].maps;
				var showText = "";					
				var childRows = allPartData[partName].rows;
				for(var i = 0;i < childRows.length;i++){ 
					var childRow = childRows[i];  
					showText +=((showText == ""? "" : ",") + childRow["value"] ); 
				}
				row.setValue(name, showText);
			}
		}
	}
	
	var getChildPartValueBeforeDoSave = function(parentTable, allChildPartRows){
		for(var rowId in parentTable.allRows()){
			var childPartRow = {};
			for (var name in multiValueFields){
				var childPartField =  multiValueFields[name];
				var childFieldMaps = dataModels[childPartField.childDataModelName].fields[childPartField.childFieldName].maps;
				var ctrl = $("#" + rowId + "_" + name);
				var newValue =  grid.doCtrlCoreMethod(ctrl, "popMulti", name, "getValue");	
				
				var childDataRows = new Array();
				for(var childRowId in newValue){
				   var childIdValue = newValue[childRowId][childFieldMaps["valueid"]];
				   var childValue = newValue[childRowId][childFieldMaps["value"]]; 
				   childDataRows.push({valueid: childIdValue, value: childValue});
				}
				
				childPartRow[childPartField.childPartSheetName] = {rows:childDataRows};			
			} 		
			allChildPartRows[rowId] = childPartRow;
		}
	}			
	
	var getChildPartValueFromEditCtrl = function(rowId){ 
		var childPartRow = {};
		for (var name in multiValueFields){
			var ctrl = $("#" + rowId + "_" + name);
			var newValue =  grid.doCtrlCoreMethod(ctrl, "popMulti", name, "getValue");	
			
			var childDataRows = new Array();
			for(var childRowId in newValue){
			   var childIdValue = newValue[childRowId]["id"];
			   var childValue = newValue[childRowId]["value"];
			   childDataRows.push({valueid: childIdValue, value: childValue}); 
			}
			var childPartField =  multiValueFields[name];
			childPartRow[childPartField.childPartSheetName] = childDataRows;			
		} 		
		return childPartRow;
	}		
	
	var refreshMultiValueAfterSave = function(table, param){
		for ( var rowId in table.allRows()){ 
			var childRow = param.tempChildPartRows[rowId];
			var row = grid.datatable.rows(rowId); 
			var idValue = row.getValue(grid.dataModel.idFieldName);
			grid.datatable.allChildPartData[idValue] = childRow;
			getMultiDispunitShowTextInRow(row, grid.datatable.allChildPartData);
			$(grid.gridCtrl).jqGrid("setRowData", rowId, row.allCells());
		}
	}
	
	var externalObject = new Object();
	externalObject.beforeDoSave = function(param){
		var allTempChildPartRows = {};
		getChildPartValueBeforeDoSave(param.insert, allTempChildPartRows); 
		getChildPartValueBeforeDoSave(param.update, allTempChildPartRows);
		
		var allSumbitChildPartRows = {};
		for(var rowId in allTempChildPartRows){
			var tempChildPartRow = allTempChildPartRows[rowId];
			var submitChildPartRow = {};
			for(var partName in tempChildPartRow){
				var tempChildDataRows = tempChildPartRow[partName].rows;
				var submitChildDataRows = new Array();
				for(var i=0;i<tempChildDataRows.length;i++){
					submitChildDataRows.push({valueid: tempChildDataRows[i].valueid});
				}
				submitChildPartRow[partName] = submitChildDataRows;
			}
			allSumbitChildPartRows[rowId] = submitChildPartRow;
		}
		param.childPartRows = allSumbitChildPartRows;
		param.tempChildPartRows = allTempChildPartRows;
		return true;
	}
	externalObject.afterDoSave = function(param){
		refreshMultiValueAfterSave(param.update, param); 
		refreshMultiValueAfterSave(param.insert, param); 
	}
	
	grid.addExternalObject(externalObject);

}