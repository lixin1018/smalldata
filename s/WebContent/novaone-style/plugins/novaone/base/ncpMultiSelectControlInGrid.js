//子表以多选方式在父表Grid界面中编辑保存  added by lixin 20181127
function NcpMultiSelectControlInGrid(p){
	var that = this;  
	this.childColumnName = p.childColumnName;
	this.childColumnWidth = p.childColumnWidth;
	this.childDataModel = p.childDataModel; 
	this.childViewModel = p.childViewModel;
	this.parentDataModel = p.parentDataModel;
	this.parentViewModel = p.parentViewModel;
	
	this.childListFieldName = p.childListFieldName; 
	this.parentGridControl = null;
	this.childKeyFieldName = p.childKeyFieldName; 
	 
	that.parentViewModel.colModel.push({
		name: that.childDataModel.name, 
		label: that.childColumnName, 
		width: that.childColumnWidth, 
		hidden: false, 
		sortable: false, 
		search: false, 
		resizable: true, 
		editable: true, 
		canEdit: true, 
		nullable: true, 
		edittype: "text", 
		dispunitType: "popMulti",
		formatter: function(cellvalue, options, rowObject){
			var rowId = options.rowId;
			var row = that.parentGridControl.datatable.rows(rowId);
			var values = row[options.colModel.name];
			var textFieldArray = new Array();
			if(values != null){
				for ( var i = 0; i < values.length; i++) {
					var oneRow = values[i];
					textFieldArray.push(oneRow[that.childListFieldName]);
				}
			}
			var textFieldStr = cmnPcr.arrayToString(textFieldArray, ",");
			return textFieldStr;
		}
	});
	
	this.init = function(p){
		that.parentGridControl = p.parentGridControl;
	
		var externalObject = {				
			beforeDoSave: function(param){
				var rowIds = new Array();
				if(param.insert.count()>0){ 
					//新建保存
					var row = param.insert.getRowByIndex(0);
					rowIds.push(row.rowId);
				}
				else{
					//编辑保存
					var row = param.update.getRowByIndex(0);
					rowIds.push(row.rowId);
				} 
			
				if(param.otherRequestParam == null){
					param.otherRequestParam = {};
				}  
				if(param.otherRequestParam.multiSelects == null){
					param.otherRequestParam["multiSelects"] = {};
				}
			
				var multiSelectsArray = new Array();
				param.otherRequestParam.multiSelects[that.childDataModel.name] = multiSelectsArray;
				for(var i = 0; i < rowIds.length; i++){
					var rowId = rowIds[i];
					var valuesArray = $("#" + rowId+"_" + that.childDataModel.name).popMultiDispunit("getValue");
					var saveValueArray = new Array();
					var fieldModel = that.childDataModel.fields[that.childListFieldName];
					var destKeyFieldName = fieldModel.foreignKeyName;
					var destValueFieldName = fieldModel.name;
					var sourceKeyFieldName = fieldModel.maps[destKeyFieldName];
					var sourceValueFieldName = fieldModel.maps[destValueFieldName];
					for(var j = 0; j < valuesArray.length; j++){
						var fieldName = sourceKeyFieldName == null ? sourceValueFieldName : sourceKeyFieldName;
						saveValueArray.push(valuesArray[j][fieldName]);
					}
					multiSelectsArray.push({
						rowId: rowId,
						values: saveValueArray
					});		
				}
				return true;
			},
			afterDoCancel: function(param){
				//加载原来的数据 
				return true;
			},
			processSaveData: function(param){					
				var multiSelectsArray = param.otherRequestParam.multiSelects[that.childDataModel.name];
				var fieldModel = that.childDataModel.fields[that.childListFieldName];
				var destKeyFieldName = fieldModel.foreignKeyName;
				var destValueFieldName = fieldModel.name;
				var sourceKeyFieldName = fieldModel.maps[destKeyFieldName];
				var sourceValueFieldName = fieldModel.maps[destValueFieldName]; 
				for(var i = 0; i < multiSelectsArray.length; i++){
					var rowId = multiSelectsArray[i].rowId;
					var values = $("#" + rowId+"_" + that.childDataModel.name).popMultiDispunit("getValue");
					var newValues = new Array();
					for(var j = 0; j < values.length; j++){
						var newValue = {};
						newValue[destValueFieldName] = values[j][sourceValueFieldName];
						if(sourceKeyFieldName != null){
							newValue[destKeyFieldName] = values[j][sourceKeyFieldName];
						}
						newValues.push(newValue);
					}
					that.parentGridControl.datatable.rows(rowId)[that.childDataModel.name] = newValues;
				}
				return true;
			},
			processPageData: function(param){
				var otherResponseParam = param.otherResponseParam; 
				var multiSelectsArray = otherResponseParam.multiSelects[that.childDataModel.name];
				for(var i = 0; i < multiSelectsArray.length; i++){
					var idValue = multiSelectsArray[i].idValue;
					var values = multiSelectsArray[i].values;
					var row = param.datatable.getRowByIdField(idValue, that.parentDataModel.idFieldName);
					row[that.childDataModel.name] = values;
				} 
				return true;
			},
			refreshOterhEditCtrlStatus: function(param){
				that.setReadonly({
					isReadonly: param.isReadonly
				});
				return true;
			},
			setCustomDispunitEditValue: function(param){
				if(param.cModel.name == that.childDataModel.name){
					var fieldModel = that.childDataModel.fields[that.childListFieldName];
					var	idField = fieldModel.maps[fieldModel.foreignKeyName];
					var	textField = fieldModel.maps[that.childListFieldName];
					var values = param.row[that.childDataModel.name];
					var popValues = new Array();
					if(values != null){
						for(var i = 0; i < values.length; i++){
							var popValue = {};
							if(idField != null){
								popValue[idField] = values[i][fieldModel.foreignKeyName];
							}
							popValue[textField] = values[i][that.childListFieldName];
							popValues.push(popValue);
						}
					}
					$(param.ctrl).popMultiDispunit("setValue", popValues);
				}
				return true;
			},
			createCustomDispunit: function(param) {
				if(param.name != that.childDataModel.name){
					return null;
				}
				else{
					var rowId = param.options.rowId;
					var row = that.parentGridControl.datatable.rows(rowId);
					var values = row[that.childDataModel.name];
					var fieldModel = that.childDataModel.fields[that.childListFieldName];		
					param.options.fieldName = that.childListFieldName;
					param.options.changeFunc = function(ctrl, rowData, rowId){
						
					}
					return $(param.ctrl).popMultiDispunit({
						idField : fieldModel.maps[fieldModel.foreignKeyName],
						textField : fieldModel.maps[that.childListFieldName],
						options : param.options,
						showPopFunc : function(p) {
							var fieldModel =  that.childDataModel.fields[p.options.fieldName];
							that.parentGridControl.doPop({
								viewName : fieldModel.view.name,
								value : p.value,
								rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的 
								fieldName : fieldModel.maps[that.childListFieldName], //that.childListFieldName,
								fieldModel : fieldModel,
								dataModel : that.childDataModel,
								isMultiValue : true,
								changeValueFunc : p.changeValueFunc
							});
						},
						style : param.style
					});
				}
			} 
		}
		
		that.parentGridControl.addExternalObject(externalObject);  
	} 
	
}