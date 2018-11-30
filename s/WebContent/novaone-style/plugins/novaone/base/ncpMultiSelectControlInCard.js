//子表以多选方式在父表界面中编辑保存  added by lixin 20181127
function NcpMultiSelectControlInCard(){
	var that = this;
	
	this.serviceName = "dataNcpService";
	
	this.containerId = null;
	this.childDataModel = null; 
	this.childViewModel = null; 
	this.childListFieldName = null; 
	this.parentCardControl = null;
	this.parentDataName = null;
	this.keyFieldName = null;
	this.listName = null;
	this.listColumns = null;
	this.colMaps = null;
	this.initialValues = null;
	
	this.init = function(p){
		this.parentCardControl = p.parentCardControl;
		this.parentDataName = p.parentCardControl.dataModel.name;
		this.childDataModel = p.childDataModel;
		this.childViewModel = p.childViewModel;
		this.childListFieldName = p.childListFieldName;
		this.containerId = p.containerId;
		var fieldModel = p.childDataModel.fields[p.childListFieldName];
		this.keyFieldName = fieldModel.foreignKeyName == "" ? p.childListFieldName : fieldModel.foreignKeyName;
		this.listName = fieldModel.list.name;
		this.listColumns = fieldModel.list.columns;
		this.colMaps = fieldModel.maps;

		var externalObject = {				
			beforeDoSave: function(param){
				var rowId = null;
				if(param.insert.count()>0){ 
					//新建保存
					var row = param.insert.getRowByIndex(0);
					rowId = row.rowId;
				}
				else{
					//编辑保存
					var row = param.update.getRowByIndex(0);
					rowId = row.rowId;
				} 
				
				if(param.otherRequestParam == null){
					param.otherRequestParam = {};
				}  
				if(param.otherRequestParam.multiSelects == null){
					param.otherRequestParam["multiSelects"] = {};
				}
				
				if(param.otherRequestParam.multiSelects[that.parentDataName] == null){
					param.otherRequestParam.multiSelects[that.parentDataName] = {};
				}
				
				param.otherRequestParam.multiSelects[that.parentDataName][that.childDataModel.name] =[{
					rowId: rowId,
					values: that.getValues()
				}];		
				return true;
			},
			afterDoCancel:function(param){
				//加载原来的数据
				that.restoreValues();
				return true;
			},
			afterDoAdd:function(param){
				//显示空的数据，即取消选择所有选项
				that.showValues({});
				return true;
			},
			afterDoPage:function(param){
				var otherResponseParam = param.otherResponseParam; 
				var values =  otherResponseParam.multiSelects[that.childDataModel.name].length == 0 ? {} : otherResponseParam.multiSelects[that.childDataModel.name][0].values;
				that.initValues({values: values});	
			},
			refreshOterhEditCtrlStatus: function(param){
				that.setReadonly({
					isReadonly: param.isReadonly
				});
			}
		} 
			
		that.parentCardControl.addExternalObject(externalObject); 
		
		this.getListDataFromServer({
			childCardName: that.childCardName,
			listName: that.listName,
			listColumns: that.listColumns,
			colMaps: that.colMaps,
			where: p.where,
			orderby: p.orderby,
			showInputControls: function(param){
				that.showInputControls(param);
			}
		});		
	} 
	
	this.showInputControls = function(p){
		var allHtml = "";
		for(var i = 0; i < p.rows.length; i++){
			allHtml += that.createOneInputControl(p.rows[i], p.colMaps);
		} 
		$("#" + that.containerId).html(allHtml);
		
		that.showValues({values: that.initialValues});
		this.setReadonly({isReadonly: that.parentCardControl.currentStatus != formStatusType.edit});
	}
	
	this.initValues = function(p){
		that.initialValues = p.values;
		that.showValues(p);
	}
	
	this.restoreValues = function(){
		that.showValues({values: that.initialValues});
	}
	
	this.showValues = function(p){
		$("#" + that.containerId).find("input").attr("checked",false);
		if(p.values != null){
			for(var i = 0; i < p.values.length; i++){
				var key = cmnPcr.html_encode(p.values[i][that.keyFieldName]);
				$("#" + that.containerId).find("input[value='" + key + "']").attr("checked",true);
			}
		}
	}
	
	this.getValues = function(p){
		var values = [];
	    var ctrls = $("#" + that.containerId).find("input");
		for(var i = 0; i < ctrls.length; i++){
			var ctrl = ctrls[i];
			if($(ctrl).is(':checked')){
				values.push($(ctrl).val());
			}
		}
		return values;
	}
	
	this.setReadonly = function(p){
		$("#" + that.containerId).find("input").attr("disabled", p.isReadonly);
	}
	
	this.createOneInputControl = function(row, colMaps){
		var keyHtml = cmnPcr.html_encode(row[this.keyFieldName]);
		var valueHtml = "";
		for(var i = 0; i < that.listColumns.length; i++){
			var column = that.listColumns[i];
			if(!column.hidden){
				var destFieldName = that.getDestFieldName(column.field, colMaps);
				valueHtml = valueHtml + (valueHtml.length == 0 ? "" : ", ") +  cmnPcr.html_encode(row[destFieldName])
			}
		} 
		var oneHtml = "<span><input type=\"checkbox\" value=\"" + keyHtml + "\" style=\"margin-top: 0px;margin-bottom: 1px;vertical-align: middle;\" />" + valueHtml + "</span>";
		return oneHtml;
	}
	
	this.getListDataFromServer = function(param){
		var requestParam = {
			serviceName : that.serviceName,
			waitingBarParentId : null,
			funcName : "getList",
			successFunc : function(obj) {
				param.rows = that.getListRowsFromBackInfo(obj.result.table.rows, param.listColumns, param.colMaps);
				param.showInputControls(param); 
			},
			args : {
				requestParam : cmnPcr.jsonToStr( {
					dataName : param.childCardName,
					listName : param.listName,
					where : param.where == undefined ? [] : param.where,
					orderby : param.orderby == undefined ? [] : param.orderby,  
				})
			}
		};
		var serverAccess = new ServerAccess();
		serverAccess.request(requestParam);
	}

	//从返回值中获取下拉的数据
	this.getListRowsFromBackInfo = function(allServerRows, columns, colMaps) {
		var rows = new Array();
		for ( var i = 0; i < allServerRows.length; i++) {
			var serverRow = allServerRows[i];
			var row = {};
			for(var destFieldName in colMaps){
				var sourceFieldName = colMaps[destFieldName];
				var valueType = that.getColumnValueType(sourceFieldName, columns);
				var value = cmnPcr.strToObject(serverRow[sourceFieldName], valueType);
				row[destFieldName] = value;
			}
			rows.push(row);
		} 
		return rows;
	}
	
	this.getColumnValueType = function(fieldName, columns){
		for(var i = 0; i < columns.length; i++){
			var column = columns[i];
			if(column.field == fieldName){
				return column.valueType;
			}		
		}
		return null;
	}
	
	this.getDestFieldName = function(sourceFieldName, colMaps){
		for(var destFieldName in colMaps){
			if(colMaps[destFieldName] == sourceFieldName){
				return destFieldName;
			}		
		}
		return null;
	}
}