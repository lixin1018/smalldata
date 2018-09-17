/*
containerId jqgrid的容器id
outerId整个view编辑控件的容器
datatype:默认"local"，一般不改变此参数值
height:如果使用fill停靠，那么不需要赋值
width:如果使用fill停靠，那么不需要赋值
shrinkToFit:默认为false，一般不修改此参数
caption:默认为空"",不建议使用此参数
onePageRowCount(对应jqgrid的rowNum):默认为20,
multiselect:允许多选

列
colNames:字符串数组
colModel:{name:label:width:sortable:search:resizable:hidden:formatter:formatoptions:frozen :}

合并表头
useColSpanStyle: true,   
groupHeaders:[{  startColumnName:'id',numberOfColumns: 2,titleText: '<input type="text"/>'}  ]	 

显示合计行
footerrow : true, 
*/

//NcpGrid
function NcpGrid(p) {

	var that = this;

	//显示的定义，注意dataModel是数据模型定义
	this.colModel = p.viewModel.colModel;

	//Card方式显示域定义
	this.dispUnitModel = p.viewModel.dispUnitModel;

	//基类
	this.base = NcpView;
	this.base(p);

	//jqgrid控件
	this.gridCtrl = null;

	//jqgrid控件所属控件
	this.gridDiv = null;

	//导航控件
	this.paginationCtrl = null;

	//是否取合计
	this.isGetSum = true;

	//是否取记录数
	this.isGetCount = true;

	//翻页导航所用参数
	this.totalRowCount = 0;
	this.pageNumber = 1;

	//编辑窗口地址
	this.editInCard = p.editInCard ? true : false;
	this.editPageUrl = p.editPageUrl;

	//编辑窗口大小
	this.editWinHeight = p.editWinHeight;
	this.editWinWidth = p.editWinWidth;
	
	//本地执行列排序
	this.columnLocalSort = p.columnLocalSort == undefined ? false : p.columnLocalSort;

	//获取当前行Id
	this.getCurrentIdValue = function() {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (selRowId != undefined) {
			var row = this.datatable.rows(selRowId);
			return row == null ? null : row
					.getValue(this.dataModel.idFieldName);
		} else {
			return null;
		}
	}
	//获取当前行
	this.getCurrentRow = function() {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (selRowId != undefined) {
			var row = this.datatable.rows(selRowId);
			return row;
		} else {
			return null;
		}
	}
	//初始化某个录入控件
	this.initGridCtrl = function(ctrlContainer, rowId, fieldName) {
		var cModel = this.getCModel(fieldName);
		var fieldModel = this.dataModel.fields[fieldName];
		var style = null;
		switch (cModel.editoptions.edittype) {
		case "text":
		case "textarea":
		case "decimal":
		case "date":
		case "time":
		case "list":
		case "checkbox":
		case "button":
			style = {
				width : "100%",
				height : "100%",
				border : "solid 0px #95B8E7",
				padding : "0px"
			};
			break;
		}
		var options = {};
		var editCtrl = this.createDispUnit(cModel.name, cModel.dispunittype, ctrlContainer,
				fieldModel, options, style);
	}
	
	//获取列的显示定义
	this.getCModel = function(name) {
		for ( var i = 0; i < this.colModel.length; i++) {
			var cModel = this.colModel[i];
			if (name == cModel.name) {
				return cModel;
			}
		}
		return null;
	}

	this.afterBaseList = function(param) {
		//显示下拉 
		$("#" + param.rowId + "_" + param.fieldName).listDispunit("showList",
				param.rows);
	}

	this.getSelectedRowIds = function() {
		var rowIds = new Array();
		for ( var rowId in this.datatable.allRows()) {
			if ($("#" + rowId + "_ncpRowSelect").attr("checked") != undefined) {
				rowIds.push(rowId);
			}
		}
		if (rowIds.length == 0) {
			var rowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			if (rowId != undefined) {
				rowIds.push(rowId);
			}
		}
		return rowIds;
	}

	this.doEdit = function(param) {
		if (this.currentStatus == formStatusType.browse || this.editInCard) {
			if (this.beforeBaseEdit(param) && this.beforeDoEdit(param)) {
				this.baseEdit(param);
			}
		}
	}

	this.baseAdd = function(param) {
		if (this.editInCard) {
			var newRowId = cmnPcr.getRandomValue();
			param.rowId = newRowId;
			param.isEdit = false;
			param.dataModel = this.dataModel;
			param.dispUnitModel = this.dispUnitModel;
			this.editRowInPage(param);
		} else {
			if(!that.needTriggerServerAdd){
				var newBlankRows = new Array();
				if(param.newRowCount == null){
					param.newRowCount = 1;
				}
				for(var i = 0; i < param.newRowCount; i++){
					newBlankRows.push({});
				}
				param.newRowsTable = that.getDataTableFromBackInfo(newBlankRows);
				that.setCtrlStatus(formStatusType.edit);
				that.processAddData(param);
				that.afterBaseAdd(param);
				that.afterDoAdd(param);
			}
			else{
				var requestParam = {
					serviceName : this.serviceName,
					waitingBarParentId : this.containerId,
					funcName : "add",
					successFunc : function(obj) {
						param.newRowsTable = that
								.getDataTableFromBackInfo(obj.result.defaultValues);
						that.setCtrlStatus(formStatusType.edit);
						that.processAddData(param);
						that.afterBaseAdd(param);
						that.afterDoAdd(param);
					},
					args : {
						requestParam : cmnPcr.jsonToStr( {
							dataName : this.dataModel.name,
							newRowCount : param.newRowCount == undefined ? 1
									: param.newRowCount,
							otherRequestParam:param.otherRequestParam
						})
					}
				};
				this.ProcessServerAccess(requestParam);
			}
		}
	}

	this.baseEdit = function(param) {
		if (this.editInCard) {
			var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			if (selRowId != undefined) {
				var idValue = this.datatable.rows(selRowId).getValue(
						this.dataModel.idFieldName);
				param.rowId = selRowId;
				param.isEdit = true;
				param.idValue = idValue;
				param.dataModel = this.dataModel;
				param.dispUnitModel = this.dispUnitModel;
				this.editRowInPage(param);
			} else {
				msgBox.alert( {
					info : "请先选中记录."
				});
			}
		} else {
			that.setCtrlStatus(formStatusType.edit);
			that.processEditData(param);
			that.afterBaseEdit(param);
			that.afterDoEdit(param);
		}
	}

	this.editRowInPage = function(initParam) {
		window.gridCardInitParam = initParam;
		initParam.closeWin = function(param) {
			//如果处理成功，在进行相应的后续操作
			if (param.succeed) {
				if (initParam.isEdit) {
					//编辑模式修改当前Grid行数据					
					param.updateRowsTable = param.update;
					that.setCtrlStatus(formStatusType.edit);
					that.processEditData(param);
					that.afterBaseEdit(param);
					that.afterDoEdit(param);
				} else {
					//新建模式 ，添加当前Grid行数据
					param.newRowsTable = param.insert;
					that.setCtrlStatus(formStatusType.edit);
					that.processAddData(param);
					that.afterBaseAdd(param);
					that.afterDoAdd(param);
				}
			}
			popContainer.close();
		}

		var popContainer = new PopupContainer( {
			width : that.editWinWidth,
			height : that.editWinHeight,
			top : 100
		});
		popContainer.show();
		var frameId = cmnPcr.getRandomValue();
		var iFrameHtml = "<iframe id=\""
				+ frameId
				+ "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
		$("#" + popContainer.containerId).html(iFrameHtml);
		$("#" + frameId).attr("src", this.editPageUrl);

	}

	this.beforeBaseDelete = function(param) {
		//var rowIds = $(this.gridCtrl).jqGrid("getGridParam", "selarrrow");
		var rowIds = this.getSelectedRowIds();
		if (rowIds.length == 0) {
			msgBox.alert( {
				info : "请选择要删除的记录."
			});
			return false;
		} else {
			param.existRowIdValues = {};
			param.existRowIds = new Array();
			param.newRowIds = new Array();
			for ( var i = 0; i < rowIds.length; i++) {
				var rowId = rowIds[i];
				var row = this.datatable.rows(rowId);
				if (row.isNewRow(this.dataModel.idFieldName)) {
					//新建的
					param.newRowIds.push(rowId);
				} else {
					//已存在的
					param.existRowIds.push(rowId);
					param.existRowIdValues[rowId] = row
							.getValue(this.dataModel.idFieldName);
				}
			}
			return msgBox.confirm( {
				info : "确定要删除选中数据吗?"
						+ (rowIds.length > 1 ? "\r\n共 " + rowIds.length
								+ " 条记录" : "")
			});
		}
	}

	this.afterBaseDelete = function(param) {
		var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		for ( var i = 0; i < param.existRowIds.length; i++) {
			var existRowId = param.existRowIds[i];
			$(this.gridCtrl).jqGrid("delRowData", existRowId);
			this.datatable.remove(existRowId);
			if (selRowId == existRowId) {
				this.afterRowSelect(undefined);
			}
		}
		for ( var i = 0; i < param.newRowIds.length; i++) {
			var newRowId = param.newRowIds[i];
			this.restoreRow(newRowId);
			if (selRowId == newRowId) {
				this.afterRowSelect(undefined);
			}
		}

		//在本地增加一下记录数，这个数不准，只是给用户的视觉效果
		this.totalRowCount -= param.existRowIds.length;
		this.refreshPaginationCtrl();
	}

	this.afterBaseCancel = function(param) {
		for ( var i = 0; i < param.editRowIds.length; i++) {
			var editRowId = param.editRowIds[i];
			this.restoreRow(editRowId);
		}
		for ( var i = 0; i < param.newRowIds.length; i++) {
			var newRowId = param.newRowIds[i];
			this.restoreRow(newRowId);
		}
	}

	this.beforeBasePage = function(param) {
		//param.fromIndex = (param.pageNumber - 1) * that.onePageRowCount;
		param.currentPage = param.pageNumber;
		return true;
	}

	//将新增记录显示在界面中
	this.afterBaseAdd = function(param) {
		for ( var rowId in param.newRowsTable.allRows()) {
			var newRow = param.newRowsTable.rows(rowId);
			this.datatable.addRow(rowId, newRow);
			$(this.gridCtrl).jqGrid("addRowData", rowId, newRow.allCells());
			this.initRowSelectContrl(rowId);
			//$(this.gridCtrl).jqGrid("setSelection",rowId);
			this.selectRowInGrid(rowId);
		}
	}

	this.afterBaseEdit = function(param) {
		if (this.editInCard) {
			for ( var rowId in param.updateRowsTable.allRows()) {
				var updateRow = param.updateRowsTable.rows(rowId);
				this.datatable.replaceRow(rowId, updateRow);
				$(this.gridCtrl).jqGrid("setRowData", rowId,
						updateRow.allCells());
				this.editRowInGrid(updateRow);
			}
		}
	}

	//保存后刷新数据
	this.afterBaseSave = function(param) {

		//在本地增加一下记录数，这个数不准，只是给用户的视觉效果
		this.totalRowCount += param.insert.count();

		//将编辑区域变为浏览状态		
		for ( var rowId in param.insert.allRows()) {
			var row = this.datatable.rows(rowId);
			row.setIsEdited(false);
			row.setValue(this.dataModel.idFieldName, param.rowIdToIdValues[rowId]);
			$(this.gridCtrl).jqGrid("restoreRow", rowId);

			if (!this.isRefreshAfterSave) {
				var insertRow = param.insert.rows(rowId);
				for ( var k in insertRow.allCells()) {
					if (k != this.dataModel.idFieldName) {
						row.setValue(k, insertRow.getValue(k));
					}
				}
				$(this.gridCtrl).jqGrid("setRowData", rowId, row.allCells());
			}
		}
		for ( var rowId in param.update.allRows()) {
			var row = this.datatable.rows(rowId);
			row.setIsEdited(false);
			$(this.gridCtrl).jqGrid("restoreRow", rowId);
			var updateRow = param.update.rows(rowId);

			if (!this.isRefreshAfterSave) {
				for ( var k in updateRow.allCells()) {
					row.setValue(k, updateRow.getValue(k));
				}
				$(this.gridCtrl).jqGrid("setRowData", rowId, row.allCells());
			}
		}

		for ( var rowId in param.table.allRows()) {
			var newRow = param.table.rows(rowId);
			this.datatable.replaceRow(rowId, newRow);
			$(this.gridCtrl).jqGrid("setRowData", rowId, newRow.allCells());
		}
		this.refreshPaginationCtrl();
	}

	this.beforeBaseSave = function(param) {
		var insertDt = new DataTable();
		var updateDt = new DataTable();
		for ( var rowId in this.datatable.allRows()) {
			var row = this.datatable.rows(rowId);
			if (row.isNewRow(this.dataModel.idFieldName)) {
				//获取新建的行
				var newShowRow = this.getRowFromEditCtrl(rowId);
				insertDt.addRow(rowId, newShowRow);
			} else if (row.getIsEdited()) {
				//获取编辑的行
				var editShowRow = this.getRowFromEditCtrl(rowId);
				editShowRow.setValue(this.dataModel.idFieldName, row
						.getValue(this.dataModel.idFieldName));
				updateDt.addRow(rowId, editShowRow);
			}
		}
		if (insertDt.count() == 0 && updateDt.count() == 0) {
			//msgBox.alert({info:"没有需要保存的记录."});		
			return true;
		} else {
			param.update = updateDt;
			param.insert = insertDt;			
			return this.checkNotNullable(param);
		}
	}
	
	this.checkNotNullable = function(param){
		var errorStr = "";
		if(param.update.count()>0){
	        for (var k in param.update.allRows()) {
	        	var row = param.update.rows(k);
	        	var es = this.checkRowNotNullable(row);
	        	if(es.length !=0){
	        		var index = this.datatable.getRowIndex(row.rowId);
	        		errorStr += ("第 " + (index + 1) + " 行:\r" + es);
	        	}
	        }
		}
		if(param.insert.count()>0){
	        for (var k in param.insert.allRows()) {
	        	var row = param.insert.rows(k);
	        	var es = this.checkRowNotNullable(row);
	        	if(es.length !=0){
	        		var index = this.datatable.getRowIndex(row.rowId);
	        		errorStr += ("第 " + (index + 1) + " 行:\r" + es);
	        	}
	        }
		}
		if(errorStr.length == 0){
			return true;
		}
		else{
			msgBox.alert({info:errorStr});
			return false;
		}
	}	
	
	//验证某行的必填项是否填写完整
	this.checkRowNotNullable = function(row){
		var str = "";
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			var unitModel = p.viewModel.colModel[i];
			if(!unitModel.nullable && !unitModel.hidden){
				var value =  row.getValue(unitModel.name);
				if(value == null || value ===""){
					str += ( "  字段 " + unitModel.label + " 的值不可为空;\r");
				}				
			}			
		}
		return str;
	}
	
	//从编辑控件里获取编辑后的记录值
	this.getRowFromEditCtrl = function(rowId) {
		var oldRow = this.datatable.rows(rowId);
		var row = new DataRow();
		row.rowId = rowId;
		for ( var i = 0; i < this.colModel.length; i++) {
			var cModel = this.colModel[i];
			var fieldModel = this.dataModel.fields[cModel.name];
			if (fieldModel
					!= undefined) {
				var ctrl = $("#" + rowId + "_" + cModel.name);

				/*
				//如果不可显示的列，那么不从界面中读取控件值
				var newValue = cModel.hidden ? oldRow.getValue(fieldModel.name)
						: this.doCtrlCoreMethod(ctrl, cModel.dispunitType,
								cModel.name, "getValue");*/
				var newValue =  this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name, "getValue");
 
 				/*
				if(fieldModel.isSave){
					if (fieldModel.maps == undefined) {
						row.setValue(fieldModel.name, newValue);
					} else {
						for (var k in fieldModel.maps){
							row.setValue(k, newValue[fieldModel.maps[k]]);
						}
					} 
				}
				*/
				//所有字段都传输到服务器端
				if (fieldModel.maps == undefined) {
					row.setValue(fieldModel.name, newValue);
				} else {
					for (var k in fieldModel.maps){
						row.setValue(k, newValue == null ? null : newValue[fieldModel.maps[k]]);
					}
				}  
			}
		}
		return row;
	}

	//从当前编辑的单元格中获取字段值
	this.getEditValue = function(rowId, fieldModel) {
		var value = null;
		switch (fieldModel.valueType) {
		case valueType.decimal:
		case valueType.string:
		case valueType.date:
		case valueType.time:
			value = $("#" + rowId + "_" + fieldModel.name).val();
			break;
		case valueType.boolean:
			value = $("#" + rowId + "_" + fieldModel.name).attr("checked") != undefined;
			break;
		}
		return value;
	}

	//将数据显示在界面中
	this.afterBasePage = function(param) {
		$(this.gridCtrl).jqGrid("clearGridData", true);

		this.datatable = param.datatable;

		for ( var rowId in param.datatable.allRows()) {
			$(this.gridCtrl).jqGrid("addRowData", rowId,
					param.datatable.rows(rowId).allCells());
			this.initRowSelectContrl(rowId);
		}

		this.totalRowCount = param.totalRowCount;
		this.pageNumber = param.pageNumber;
		this.refreshPaginationCtrl();
	}

	//添加Grid头列多选控件
	this.initRowSelectContrl = function(rowId) {
		var rowCheckId = rowId + "_ncpRowSelect";
		$(this.gridCtrl).jqGrid(
				"setCell",
				rowId,
				"ncpRowSelect",
				"<input class=\"ncpRowSelect\" type=\"checkbox\" rowId=\"" + rowId + "\" id=\"" + rowCheckId
						+ "\" />");
		$("#" + rowCheckId).click(function(){
			var rowId = $(this).attr("rowId");
			var checked = $(this).is(":checked");
			that.onRowCheckClick(rowId, checked);
		});
	}
	
	//设置是否选中(复选框)
	this.setRowSelectCheck = function(rowId, isSelect){
		var rowCheckId = rowId + "_ncpRowSelect";
		$("#" + rowCheckId).attr("checked", isSelect);
	}
	
	//当行选择控件被点击时
	this.onRowCheckClick = function(rowId, checked){
		
	}

	//刷新导航栏
	this.refreshPaginationCtrl = function() {
		$(this.paginationCtrl).pagination( {
			total : this.totalRowCount,
			pageNumber : this.pageNumber,
			pageSize : this.onePageRowCount
		});
	}

	//最大化填充
	this.fulfill = function() {
		$(that.gridCtrl).setGridWidth($(that.gridDiv).width() - 2);
		$(that.gridCtrl).setGridHeight($(that.gridDiv).height() - 23);
	}

	//取消此行的编辑，如果是新建，那么删除此行，如果是编辑，那么还原为原来的显示内容
	this.restoreRow = function(rowId) {
		if (this.datatable.isNewRow(rowId, this.dataModel.idFieldName)) {
			var selRowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
			$(this.gridCtrl).jqGrid("delRowData", rowId);
			this.datatable.remove(rowId);
			if (selRowId == rowId) {
				this.afterRowSelect(undefined);
			}
		} else {
			$(this.gridCtrl).jqGrid("restoreRow", rowId);
			this.markEditRow(rowId, false);
		}
	}

	//初始化
	this.initGrid = function(p) {
		this.gridCtrl = $("#" + this.containerId)
				.find("table[name='gridCtrl']")[0];
		this.gridDiv = $("#" + this.containerId).find("div[name='gridDiv']")[0];

		//给jqgrid控件id赋值，jqgrid存在bug，如果其不存在id属性，那么清除数据时出错
		if ($(this.gridCtrl).attr("id") == undefined) {
			$(this.gridCtrl).attr("id", cmnPcr.getRandomValue());
		}

		//设置默认值
		p.shrinkToFit = p.shrinkToFit == undefined ? false : p.shrinkToFit;
		p.multiselect = p.multiselect == undefined ? false : p.multiselect;
		p.useColSpanStyle = p.useColSpanStyle == undefined ? true
				: p.useColSpanStyle;
		p.footerrow = p.footerrow == undefined ? false : p.footerrow;
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			var col = p.viewModel.colModel[i];
			if (col.editoptions == undefined) {
				col.editoptions = {
					dataInit : function(elem) {
						//$(elem).focus(function(){ this.select();}) 
					},
					dataEvents : [ {
						type : "keydown",
						fn : function(e) {
							switch (e.keyCode) {
							case 27:
								var rowId = $(this).parent().parent().parent()
										.parent().parent().parent().attr("id");
								if (msgBox.confirm( {
									info : "确定取消对此行的编辑吗?"
								})) {
									that.restoreRow(rowId);
								}
								break;
							default:
								break;
							}
						}
					} ]
				}
				if (col.edittype == "checkbox" && col.name != "ncpRowSelect") {
					col.formatter = function(cellValue, options, rowObject) {
						if (cellValue === true || cellValue == "是") {
							return "是";
						} else if (cellValue === false || cellValue == "否") {
							return "否";
						} else {
							return "";
						}
					}
				}
			}
		}
		var initParam = {
			datatype : "local",
			height : p.height,
			width : p.width,
			shrinkToFit : p.shrinkToFit,
			caption : "",
			rowNum : p.onePageRowCount,
			multiselect : false,//p.multiselect,
			multiboxonly : true,
			colNames : p.colNames,
			colModel : p.viewModel.colModel,
			footerrow : p.footerrow,
			onSelectRow : function(id, status) {
				var row = that.datatable.rows(id);
				that.editRowInGrid(row);
				if (status) {
					that.afterRowSelect(id);
				}
			},
			//列宽改变时，改变一下可编辑显示域的宽度
			resizeStop : function(newWidth, index){
				//此处尚未实现，需要重新计算并改变一下显示域控件大小
			},
			onSortCol : function(colName, index, sortOrder){
				if(!that.columnLocalSort){
					var fieldModel = that.dataModel.fields[colName];
					that.orderby = [{name:fieldModel.name, direction:sortOrder}];
					if(fieldModel != null){
						that.doPage( {
							pageNumber : that.pageNumber
						});
					}
					return "stop";
				}
			}
		};

		this.setGridOtherParam(initParam);
		//构造grid控件
		$(that.gridCtrl).jqGrid(initParam);

		//多级表头
		if (p.groupHeaders != undefined) {
			$(that.gridCtrl).jqGrid("setGroupHeaders", {
				useColSpanStyle : true,
				groupHeaders : p.groupHeaders
			});
		}

		//冻结 
		for ( var i = 0; i < p.viewModel.colModel.length; i++) {
			if (p.viewModel.colModel[i].frozen) {
				$(that.gridCtrl).jqGrid("setFrozenColumns");
				$(that.gridCtrl).triggerHandler("jqGridAfterGridComplete");
				break;
			}
		}

		//自适应大小
		if (that.gridDiv != null) {
			$(that.gridDiv).panel( {
				onResize : function() {
					that.fulfill();
				}
			});
			this.fulfill();
		}

		//是否显示多选列
		if (!p.multiselect) {
			$(that.gridCtrl).jqGrid("hideCol", "ncpRowSelect");
		} 
	}
	
	this.hideMultiSelectColumn = function(){
		$(that.gridCtrl).jqGrid("hideCol", "ncpRowSelect");
	}

	this.setGridOtherParam = function(initParam) {

	}

	this.doAllEdit = function() {
		for ( var rowId in this.datatable.allRows()) {
			var row = this.datatable.rows(rowId);
			this.editRowInGrid(row);
		}
	}

	//如果是树形节点列、ncpRowSelect列，那么不用初始化其编辑控件
	this.isInitEditCtrl = function(cModel) {
		return !(cModel.name == "ncpRowSelect" || cModel.isSpecial == true);
	}

	this.editRowInGrid = function(row) {
		var rowId = row.rowId;
		if (that.canEditRow(rowId) && this.beforeRowEditIn(row)) {
			$(that.gridCtrl)
					.jqGrid(
							"editRow",
							rowId,
							{
								keys : false,
								oneditfunc : function(rowId) {
									that.markEditRow(rowId, true);
									var row = that.datatable.rows(rowId);
									for ( var i = 0; i < that.colModel.length; i++) {
										var cModel = that.colModel[i];
										if (that.isInitEditCtrl(cModel)) {
											var fieldModel = that.dataModel.fields[cModel.name];
											var ctrlId = rowId + "_" + cModel.name;
											//$("#" + ctrlId).width($("#" + ctrlId).parent().width());
											that.initGridDispunitCtrl($("#" + ctrlId), cModel, fieldModel, rowId);
											that.setEditValue($("#" + ctrlId), cModel, fieldModel, row);
											that.doCtrlCoreMethod($("#" + ctrlId), cModel.dispunitType, cModel.name, "setReadonly", !cModel.canEdit);
											/*
											1.grid方式下，无论此列是否可编辑，都初始化一个编辑控件，然后设置只读；
											2.从列表中的控件中获取字段值；
											3.查看card方式下的数据编辑保存；
											4.grid方式下点击编辑，系统自动切换到卡片方式，但是子表不能操作？？？
											 */
										} else {
											var fieldModel = that.dataModel.fields[cModel.name];
											if (fieldModel != null) {
												var ctrlId = rowId + "_"
														+ cModel.name;
												$("#" + ctrlId).attr(
														"disabled", "disabled");
												$("#" + ctrlId)
														.css(
																{
																	"border" : "0px",
																	"background-color" : "transparent"
																});
											}
										}
									}
									that.afterRowEditIn(row);
								}
							});

			$("#" + rowId).find("input").focus(function() {
				if ($(this).attr("class") != "cbox") {
					if (that.selectRowInGrid(rowId)) {
						$(this).focus();
					}
				}
			});
		}
	}

	this.selectRowInGrid = function(rowId) {
		if ($(this.gridCtrl).jqGrid("getGridParam", "selrow") != rowId) {
			return $(this.gridCtrl).jqGrid("setSelection", rowId, true);
		} else {
			return false;
		}
	} 

	this.canEditRow = function(rowId) {
		return that.currentStatus == formStatusType.edit;
	}

	//从当前编辑的单元格中获取字段值
	this.setEditValue = function(ctrl, cModel, fieldModel, row) {
		//如果有对应的字段定义 modified by lixin 20150721
		if(fieldModel != null) {
			if (fieldModel.maps == null) {
				this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name,
						"setValue", row == null ? null : row.getValue(cModel.name));
			} else {
				var value = {};
				if (row != null) {
					for ( var viewField in fieldModel.maps) {
						var listField = fieldModel.maps[viewField];
						value[listField] = row.getValue(viewField);
					}
				}
				this.doCtrlCoreMethod(ctrl, cModel.dispunitType, cModel.name,
						"setValue", value);
			}
		}
		else{
			this.setCustomDispunitEditValue(ctrl, cModel, fieldModel, row);
		}
	}
	
	this.setCustomDispunitEditValue = function(ctrl, cModel, fieldModel, row){
		
	}

	//初始化某个录入控件
	this.initGridDispunitCtrl = function(ctrl, cModel, fieldModel, rowId) {
		var style = {"min-height": "24px"};
		switch (cModel.dispunitType) {
		case "text":
		case "textarea":
		case "decimal":
		case "date":
		case "time":
		case "list":
		case "checkbox":
			break;
		}
		var options = {
			rowId : rowId,
			changeFunc : this.dispunitValueChange,
			enterPressFunc : this.dispunitEnterPress
		};
		this.createDispunit(cModel.name, cModel.dispunitType, ctrl, fieldModel, options,
				style);		
	}
	
	//回车后，定位到下一行(shift按下是为上一行)的此字段
	this.dispunitEnterPress = function(jq, shiftKey, rowId){
		var toRowId = shiftKey ?  that.datatable.getPreviousRowId(rowId) :  that.datatable.getNextRowId(rowId);
		if(toRowId != null){		
			var fieldName = $(jq).attr("fieldName");
			that.focusCell(toRowId, fieldName)
		}
	}
	
	this.dispunitValueChange = function(jq, newValue, rowId) {
		var fieldName = $(jq).attr("fieldName");
		var fieldModel = that.dataModel.fields[fieldName];
		if (fieldModel.maps != null) {
			for ( var desFieldName in fieldModel.maps) {
				if (desFieldName != fieldName) {
					var cSameGroupFieldModel = that.getCModel(desFieldName);
					var cellValue = newValue[fieldModel.maps[desFieldName]];
					var ctrl = $("#" + rowId + "_" + desFieldName);
					that.doCtrlCoreMethod(ctrl,
							cSameGroupFieldModel.dispunitType,
							cSameGroupFieldModel.name, "setValue", cellValue);
				}
			}
		}
		that.valueChange(jq, rowId, newValue);
	}

	//显示域值改变时调用此函数，(用于扩展)
	this.valueChange = function(jq, rowId, newValue) {
		//alert($(jq).attr("id") + " " + $(jq).attr("fieldName") + " " + newValue);
	}

	this.getWinBtnStatus = function() {
		return gridWinBtnStatus;
	}

	//给控制按钮们绑定事件
	this.regOperateCtrl = function(ctrlType, operateType, ctrlName, eventName,
			func) {
		var toolbarContainer = $("#" + this.containerId
				+ " .ncpGridToolbarContainer")[0];
		var ctrls = $(toolbarContainer).find(
				ctrlType + "[name='" + ctrlName + "']");
		if (ctrls.length > 0) {
			var ctrl = ctrls[0];
			this.allToolbarCtrls.set(operateType, ctrl);
			if (eventName != undefined) {
				$(ctrl).bind(eventName, func);
			}
		}
	}

	this.showColumn = function(colNames) {
		if (typeof (colNames) == "string")
			$(this.gridCtrl).jqGrid('showCol', [ colNames ]);
		else
			$(this.gridCtrl).jqGrid('showCol', colNames);
	}

	this.hideColumn = function(colNames) {
		if (typeof (colNames) == "string")
			$(this.gridCtrl).jqGrid('hideCol', [ colNames ]);
		else
			$(this.gridCtrl).jqGrid('hideCol', colNames);
	}

	this.setGridCell = function(rowId, colname, data) {
		$(this.gridCtrl).jqGrid("setCell", rowId, colname, data);
	}

	this.setCurrentRowCell = function(colname, data) {
		var rowId = $(this.gridCtrl).jqGrid("getGridParam", "selrow");
		if (rowId != undefined) {
			$(this.gridCtrl).jqGrid("setCell", rowId, colname, data);
		}
	}

	//进入Grid编辑状态之前
	this.beforeRowEditIn = function(row) {
		return this.doExternalFunctionContinue("beforeRowEditIn", row);
	}

	//进入Grid编辑状态之后
	this.afterRowEditIn = function(row) {
		return this.doExternalFunction("afterRowEditIn", row);
	}

	//选中单元格
	this.focusCell = function(rowId, fieldName){
		$(this.gridCtrl).jqGrid("setSelection", rowId, true);
		var ctrlId = rowId + "_" + fieldName; 
		$("#" + ctrlId).focus();
		$("#" + ctrlId).select(); 
	}	

	//注册其他控件操作方法
	this.regOtherOperateCtrls = function(){
		this.regOperateCtrl("a", "complexQuery", "complexQueryBtn", "click", function() {
			if (that.getWinBtnStatus()["complexQuery"][that.currentStatus]) {
				that.complexQuery();
			}
		});
	}
	
	//高级查询
	this.complexQueryControl = null;
	this.serverConditionStr = null;
	this.complexQuery = function(){	
		if(that.complexQueryControl == null){
			that.complexQueryControl =  that.initComplexQueryControl();
		}
		else{
			that.complexQueryControl.show();
		}
	}
	
	this.initComplexQueryControl =function(){
		var popContainer = new PopupContainer( {
			width : 550,
			height : 300,
			top : 50
		});
		popContainer.show(); 
		var winId = cmnPcr.getRandomValue();
		var titleId = winId + "_title"; 
		var innerContainerId = winId + "_inner";
		var buttonContainerId = winId + "_buttonContainer";
		var okBtnId = winId + "_ok";
		var clearQueryBtnId = winId + "_clearQuery";
		var cancelBtnId = winId + "_cancel";
		var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
	 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:240px;font-size:11px;text-align:center;overflow:auto;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
	 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"查 询\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
	 	+ "<input type=\"button\" id=\"" + clearQueryBtnId +"\" value=\"全部数据\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml); 		

		$("#" + titleId).text("高级查询");
		
		//获取可检索的字段列表
		var getQueryFieldList = function(){
			var fieldArray = new Array();
			
			var colCount = that.colModel.length;
			for(var i=0;i<colCount;i++){
			   var col = that.colModel[i];
			   var fieldModel = that.dataModel.fields[col.name];
			   if(fieldModel != null){
				   var canSearch = col.search;
				   if(canSearch){
					   var label = col.label == "" ? col.name : col.label; 
					   var dispunitType = col.dispunitType;  
					   fieldArray.push({
						   fieldModel:fieldModel, 
						   label:label,
						   dispunitType:dispunitType
					   });
				   }
			   }
			}
			return fieldArray;			
		} 
		
		//连接控件
		var initJoinTypeControl = function(ap) {
			var containerId = ap.containerId;
			var defaultJoinType = ap.joinType;
			var joinCtrlId =  ap.trId + "_join";
			var typeHtml = "<input id=\"" + joinCtrlId + "\" style=\"width:100%;height:22px;\" />";
			$("#" + containerId).append(typeHtml);	
			var rows = [{code:"or", name:"或者"},{code:"and", name:"而且"}];
			var defaultRow = null;
			for(var i=0;i<rows.length;i++){
				var row = rows[i];
				if(row.code == defaultJoinType){
					defaultRow = row;
					break;
				}
			}

			$("#" + joinCtrlId).listDispunit({
				idField:"code",
				textField:"name",
				onlySelect:true,
				columns:[[{field:"code", valueType:valueType.string, title:"code", width:0, hidden:true},
				         {field:"name", valueType:valueType.string, title:"连接", width:60, hidden:false}]],
				getListFunc:function(p){
					$("#" + joinCtrlId).listDispunit("showList", rows);
				},
				options:{},
				style:{}
			});
			$("#" + joinCtrlId).listDispunit("setValue", (defaultRow == null ? rows[0] : defaultRow));
		}
		
		//删除控件
		var initRemoveControl = function(rp) {
			var containerId = rp.containerId;
			var removeCtrlId =  cmnPcr.getRandomValue();
			var removeImgUrl = baseImages + "/common/remove.png"; 
			var removeHtml = "<div id=\"" + removeCtrlId + "\" style=\"width:16;height:16px;background-image:url(" + removeImgUrl + ");display:none;\"></div>";
			$("#" + containerId).append(removeHtml); 
			$("#" + rp.trId).mouseover(function(){
				$("#" + removeCtrlId).css("display", "block");
			});
			$("#" + rp.trId).mouseout(function(){
				$("#" + removeCtrlId).css("display", "none");
			});

			$("#" + removeCtrlId).click(function(){
				var table = $("#" + rp.trId).parent();				
				$("#" + rp.trId).remove();
				var firstTr = $(table).children()[0];
				var firstTrJoinContainerId = $(firstTr).attr("id") + "_joinContainer";
				$("#" + firstTrJoinContainerId).html("查询条件:");
			});
		}
		
		//值录入控件
		var initValueControl =  function(vp){
			var valueCtrlId = vp.trId + "_value";
			var currentValueType = $("#" + valueCtrlId).attr("valueType");
			var currentOperatorType = $("#" + valueCtrlId).attr("operatorType");
			var currentDispunitType = $("#" + valueCtrlId).attr("dispunitType");
			if(vp.operatorRow.code == "is null" || vp.operatorRow.code == "is not null"){
				$("#" + vp.containerId).empty();
			}
			else{  
				var fieldModel = that.dataModel.fields[vp.fieldModelRow.name];
				var newDispunitType = vp.fieldModelRow.dispunitType;
				var newValueType = fieldModel.valueType;
				if(vp.operatorRow.code == "like" && newValueType == valueType.string){
					//如果是字符串类型，那么为文本输入值
					newDispunitType = "text";
				}	
				
				if(currentDispunitType != newDispunitType || newDispunitType == "pop" || newDispunitType == "list" ){
					//需要重新构造值录入控件
					var inputType = newDispunitType == "checkbox" ? "checkbox" : "text";
					var valueHtml = "<input type=\"" + inputType + "\" isField=\"true\" trId=\"" + vp.trId + "\" id=\"" + valueCtrlId + "\" style=\"width:100%;height:22px;\" />";
					$("#" + vp.containerId).html(valueHtml);
					$("#" + valueCtrlId).attr("fieldName", fieldModel.name);
					var options = {fieldName : fieldModel.name};
					var style = {};
					switch (newDispunitType) {
						case "text": 
						case "textarea": 
							$("#" + valueCtrlId).textDispunit( {
								options : options,
								style : style
							});
							break;
						case "decimal":
							$("#" + valueCtrlId).decimalDispunit( {
								groupSeparator : (fieldModel.isComma ? "," : ""),
								precision : fieldModel.decimalNum,
								options : options,
								style : style
							});
							break;
						case "date":
							$("#" + valueCtrlId).dateDispunit( {
								options : options,
								style : style
							});
							break;
						case "time":
							$("#" + valueCtrlId).timeDispunit( {
								options : options,
								style : style
							});
							break;
						case "checkbox":
							//param包含，以后扩展是否允许三态
							$("#" + valueCtrlId).checkboxDispunit( {
								options : options,
								style : style
							});
							break;
						case "list":
							//param包含container、idField、textField、columns、getListFunc、changeFunc、options(扩展属性,在NcpView中，包含了rowId)
							$("#" + valueCtrlId).listDispunit({
								idField : fieldModel.foreignKeyName == "" ? null
										: fieldModel.maps[fieldModel.foreignKeyName],
								textField : fieldModel.maps[fieldModel.name],
								columns : [ fieldModel.list.columns ],
								getListFunc : function(p) {
									var fieldModel = that.dataModel.fields[p.options.fieldName];
									//{value:value, options:param.options, showList:function(data)
									var param = {
										listName : fieldModel.list.name,
										fieldName : fieldModel.name,
										dataModel : that.dataModel,
										fieldModel : fieldModel
									};
									var requestParam = {
										serviceName : this.serviceName,
										waitingBarParentId : null,
										funcName : "getList",
										successFunc : function(obj) {
											var rows = that.getListRowsFromBackInfo(obj.result.table.rows, param.fieldModel.list.columns);

											$("#" + valueCtrlId).listDispunit("showList", rows);
										},
										args : {
											requestParam : cmnPcr.jsonToStr( {
												dataName : that.dataModel.name,
												listName : param.listName,
												where : param.where == undefined ? [] : param.where,
												orderby : param.orderby == undefined ? [] : param.orderby,
												//数据权限过滤
												previousField : param.fieldModel.name,
												previousData : that.dataModel.name,
												popDataField : param.fieldModel.maps[param.fieldModel.name],
												otherRequestParam:param.otherRequestParam
											})
										}
									};
									that.ProcessServerAccess(requestParam);
								},
								options : options,
								style : style
							});
							break;
						case "pop":
							$("#" + valueCtrlId).popDispunit({
								idField : fieldModel.foreignKeyName == "" ? null
										: fieldModel.maps[fieldModel.foreignKeyName],
								textField : fieldModel.maps[fieldModel.name],
								showPopFunc : function(p) {
									var fieldModel = that.dataModel.fields[p.options.fieldName];
									var param = {
										viewName : fieldModel.view.name,
										value : p.value,
										rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的
										fieldName : fieldModel.name,
										fieldModel : fieldModel,
										dataModel : that.dataModel,
										changeValueFunc : p.changeValueFunc
									};

									var popContainer = new PopupContainer( {
										width : 600,
										height : 500,
										top : 50
									});
									popContainer.show();
									var initParam = {
										closeWin : function(p) {
											var selectedRows = null;
											if (p.selectedRows != undefined) { 
												selectedRows = {};
												for(var rowId in p.selectedRows) {
													var row = {};
													var selectedRow = p.selectedRows[rowId];
													for ( var destFieldName in param.fieldModel.maps) {
														var sourceFieldName = param.fieldModel.maps[destFieldName];
														row[sourceFieldName] = selectedRow[sourceFieldName];
													}
													selectedRows = row; 
													break;
												}
											}

											popContainer.close();
											if(selectedRows != undefined){
												p.changeValueFunc(selectedRows);
											}
										}, 						
										//数据权限过滤
										previousField : param.fieldModel.name,
										previousData : param.dataModel.name,
										popDataField : param.fieldModel.maps[param.fieldModel.name],
										showField : param.fieldModel.maps[param.fieldModel.name]
									}
									window.popInitParam = initParam;

									//var popNames = param.fieldModel.inputHelpName.split(".");
									var popPageUrl =basePath + "/" + param.fieldModel.inputHelpName; //"../pop/" + popNames[0] + "_" + popNames[1] + ".jsp";

									var frameId = cmnPcr.getRandomValue();
									var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
									$("#" + popContainer.containerId).html(iFrameHtml);
									$("#" + frameId).attr("src", popPageUrl);
								},
								options : options,
								style : style
							}); 
							break;
					}
				}
			}
		}
		
		//一个过滤条件
		var initConditionControl = function(cp){
			var allQueryFields = getQueryFieldList();
			var serverCondition = cp.serverCondition;
			if(allQueryFields.length == 0){
				cmnPcr.alert({info:"没有可以查询的字段"});
			}
			else{
				var nextTrId = cp.nextTrId;
				var hasJoinCtrl = $("#" + cp.nextTrId).prev().length != 0;
				var cId = cmnPcr.getRandomValue();
				var cJoinContainerId = cId + "_joinContainer";
				var cFieldContainerId = cId + "_fieldContainer";
				var cOperatorContainerId = cId + "_operatorContainer";
				var cValueContainerId = cId + "_valueContainer";
				var cRemoveContainerId = cId + "_removeContainer";
				var cHtml = "<tr isCondition=\"true\" id=\"" + cId + "\" style=\"height:24px;\">"  
				+ "<td id=\"" + cJoinContainerId + "\" style=\"width:40px;\"></td>"
				+ "<td id=\"" + cFieldContainerId + "\" style=\"width:100px;\"></td>"
				+ "<td id=\"" + cOperatorContainerId + "\" style=\"width:50px;\"></td>"
				+ "<td id=\"" + cValueContainerId + "\"></td>"
				+ "<td id=\"" + cRemoveContainerId + "\" style=\"width:16px;cursor:pointer;\"></td>"
				+ "</tr>";
				
				$("#" + nextTrId).before(cHtml); 
				if(hasJoinCtrl){
					initJoinTypeControl({
						containerId:cJoinContainerId,
						trId:cId,
						joinType:(serverCondition == null ? "and" : serverCondition.joinType)
					});
				}
				else{

					$("#" + cJoinContainerId).html("查询条件:");
				}
				
				initRemoveControl({
					containerId:cRemoveContainerId, 
					trId:cId
				});
	
				 
				//字段列表
				var cFieldId =  cId + "_field";
				var fieldHtml = "<input isField=\"true\" trId=\"" + cId + "\" id=\"" + cFieldId + "\" style=\"width:100%;height:22px;\" />";
				$("#" + cFieldContainerId).append(fieldHtml);	
				var fieldRows = new Array();
				var defaultFieldRow = null;
				for(var i=0;i<allQueryFields.length;i++){
					var field = allQueryFields[i];
					var fieldRow = {name:field.fieldModel.name, label:field.label, valueType:field.fieldModel.valueType, dispunitType:field.dispunitType};
					fieldRows.push(fieldRow);
					if(serverCondition != null && fieldRow.name == serverCondition.fieldName){
						defaultFieldRow = fieldRow;
					}
				}
	
				$("#" + cFieldId).listDispunit({
					idField:"name",
					textField:"label",
					onlySelect:true,
					columns:[[{field:"name", valueType:valueType.string, title:"name", width:0, hidden:true},
						         {field:"label", valueType:valueType.string, title:"字段", width:120, hidden:false},
						         {field:"valueType", valueType:valueType.string, title:"valueType", width:0, hidden:true},
						         {field:"dispunitType", valueType:valueType.string, title:"dispunitType", width:0, hidden:true}]],
					getListFunc:function(p){ 
						$("#" + cFieldId).listDispunit("showList", fieldRows);
					},
					options:{trId:cId,
						changeFunc:function(jq, listRow, parentRowId){
							var operatorCtrlId = cId + "_operator";
							var fieldCtrlId = cId + "_field";
							var valueCtrlId = cId + "_value";
							var operatorRow = $("#" + operatorCtrlId).listDispunit("getValue");
							initValueControl({
								trId:cId, 
								containerId:cValueContainerId,
								operatorRow: operatorRow, 
								fieldModelRow: listRow
							});							
						}},
					style:{}
				});
	 
				//操作符
				var cOperatorId =  cId + "_operator";
				var operatorHtml = "<input isOperator=\"true\" trId=\"" + cId + "\" id=\"" + cOperatorId + "\" style=\"width:100%;height:22px;\" />";
				$("#" + cOperatorContainerId).append(operatorHtml);
				var operatorRows = [{code:"=", name:"="},
				            {code:"like", name:"匹配"},
				            {code:"is null", name:"为空"},
				            {code:"is not null", name:"不为空"},
				            {code:"<>", name:"<>"},
				            {code:">", name:">"},
				            {code:">=", name:">="},
				            {code:"<", name:"<"},
				            {code:"<=", name:"<="}]; 
				var defaultOperatorRow = null;
				if(serverCondition != null){
					var operatorCount = operatorRows.length;
					for(var i=0;i<operatorCount;i++){
						var operatorRow = operatorRows[i];
						if(serverCondition.operatorType == operatorRow.code){
							defaultOperatorRow = operatorRow;
							break;
						}
					}
				}
				
				$("#" + cOperatorId).listDispunit({
					idField:"code",
					textField:"name",
					onlySelect:true,
					columns:[[{field:"code", valueType:valueType.string, title:"code", width:0, hidden:true},
					         {field:"name", valueType:valueType.string, title:"操作符", width:70, hidden:false}]],
					getListFunc:function(p){
						//字段类型不同，支持的操作符不同，此处应该细化 
						var fieldCtrlId = p.options.trId + "_field";
						var operatorCtrlId = p.options.trId + "_operator";
						var currentField = $("#" + fieldCtrlId).listDispunit("getValue");
						$("#" + operatorCtrlId).listDispunit("showList", operatorRows);
					},
					options:{trId:cId,
						changeFunc:function(jq, listRow, parentRowId){
							var operatorCtrlId = cId + "_operator";
							var fieldCtrlId = cId + "_field";
							var valueCtrlId = cId + "_value";
							var fieldModelRow = $("#" + fieldCtrlId).listDispunit("getValue");
							initValueControl({
								trId:cId, 
								containerId:cValueContainerId, 
								operatorRow: listRow, 
								fieldModelRow: fieldModelRow
							});							
						}},
					style:{}
				});
				
				//初始化值
				defaultFieldRow = defaultFieldRow == null ? fieldRows[0] : defaultFieldRow;
				defaultOperatorRow = defaultOperatorRow == null ? operatorRows[0] : defaultOperatorRow;
				$("#" + cFieldId).listDispunit("setValue", defaultFieldRow);
				$("#" + cOperatorId).listDispunit("setValue", defaultOperatorRow);				 
				initValueControl({
					trId:cId, 
					containerId:cValueContainerId, 
					operatorRow:defaultOperatorRow, 
					fieldModelRow: defaultFieldRow
				});
			}
		}

		var initAddControl = function(ap){
			var containerId = ap.containerId;
			var addItemBtnId =  cmnPcr.getRandomValue();
			var addGroupBtnId =  cmnPcr.getRandomValue();
			var addItemImgUrl = baseImages + "/common/addItem.png"; 
			var addGroupImgUrl = baseImages + "/common/addGroup.png"; 
			var addHtml = "<div isAddGroup=\"true\" id=\"" + addGroupBtnId + "\" style=\"float:right;cursor:pointer;width:16px;height:16px;background-image:url(" + addGroupImgUrl + ");\"></div>"
				+ "<div style=\"float:right;cursor:pointer;width:8px;height:16px;\"></div>"
				+ "<div isAddItem=\"true\" id=\"" + addItemBtnId + "\" style=\"float:right;cursor:pointer;width:16px;height:16px;background-image:url(" + addItemImgUrl + ");\"></div>";
			$("#" + containerId).append(addHtml);
			
			$("#" + addItemBtnId).click(function(){
				//增加查询条件
				var groupAddTrId = $("#" + addItemBtnId).parent().parent().attr("id");
				initConditionControl({
					nextTrId:groupAddTrId
				});
			});
			
			$("#" + addGroupBtnId).click(function(){
				//增加分组条件 
				var groupAddTrId = $("#" + addGroupBtnId).parent().parent().attr("id");
				initSubGroupControl({
					nextTrId:groupAddTrId
				});
			});
		}
		
		//主分组控件
		var initSubGroupControl = function(sgp){
			var allQueryFields = getQueryFieldList();
			var serverCondition = sgp.serverCondition;
			if(allQueryFields.length == 0){
				cmnPcr.alert({info:"没有可以查询的字段"});
			}
			else{
				var nextTrId = sgp.nextTrId;
				var hasJoinCtrl = $("#" + sgp.nextTrId).prev().length != 0 || serverCondition != null;
				var cId = cmnPcr.getRandomValue();
				var cJoinContainerId = cId + "_joinContainer"; 
				var cGroupContainerId = cId + "_subGroupContainer";
				var cRemoveContainerId = cId + "_removeContainer";
				var cHtml = "<tr isSubGroup=\"true\" id=\"" + cId + "\" style=\"height:24px;\">"  
				+ "<td id=\"" + cJoinContainerId + "\" style=\"width:40px;\"></td>"
				+ "<td colspan=\"3\" id=\"" + cGroupContainerId + "\" style=\"width:100px;border:solid 1px #DDDDDD;\"></td>"
				+ "<td id=\"" + cRemoveContainerId + "\" style=\"width:16px;cursor:pointer;\"></td>"
				+ "</tr>";
				
				$("#" + nextTrId).before(cHtml); 
				if(hasJoinCtrl){
					initJoinTypeControl({
						containerId:cJoinContainerId, 
						trId:cId, 
						joinType:(serverCondition == null ? "and" : serverCondition.joinType)
					});
				}
				
				initRemoveControl({
					containerId:cRemoveContainerId, 
					trId:cId
				})

				initGroupControl({
					containerId:cGroupContainerId,
					serverConditions:(serverCondition == null ? null : serverCondition.subConditions)
				});
			}
		}
		
		//主分组控件
		var initGroupControl = function(gp){
			var containerId = gp.containerId; 
			var serverConditions = gp.serverConditions;
			var groupId = cmnPcr.getRandomValue(); 
			var groupAddTrId = groupId + "_addTr";
			var groupAddTdId = groupId + "_addTd";
			var groupHtml = "<table isGroup=\"true\" id=\"" + groupId + "\" style=\"width:100%;\"><tr id=\"" + groupAddTrId + "\">"  
			+ "<td id=\"" + groupAddTdId + "\" style=\"width:60px;\">&nbsp;</td>"
			+ "<td colspan=\"3\"></td>"
			+ "<td style=\"width:16px;\">&nbsp;</td>"
			+ "</tr></table>";
			
			$("#" + containerId).append(groupHtml);
 
			initAddControl({containerId:groupAddTdId});
			if(serverConditions != null){
				var scCount = serverConditions.length;
				for(var i=0;i<scCount;i++){
					var serverCondition = serverConditions[i];
					if(serverCondition.isSubGroup){
						initSubGroupControl({
							nextTrId:groupAddTrId,
							serverCondition:serverCondition
						}); 
					}
					else{
						initConditionControl({
							nextTrId:groupAddTrId, 
							serverCondition:serverCondition
						});
					}
				}
			}
			else{
				initConditionControl({
					nextTrId:groupAddTrId
				});
			}
		}
		
		var getAllConditions = function(groupContainerId){
			var allTrs = $("#" + groupContainerId).children("table[isGroup='true']").children("tbody").children("tr");
			var conditions = new Array();
			for(var i=0;i<allTrs.length;i++){
				var tr = allTrs[i];
				var trId = $(tr).attr("id");
				var joinId = trId + "_join"; 
				var isCondition = $(tr).attr("isCondition") == "true";
				if(isCondition){
					var joinRow = $("#" + joinId).listDispunit("getValue");
					var joinType = joinRow == null ? null : joinRow.code;
					
					var fieldId = trId + "_field";
					var fieldRow = $("#" + fieldId).listDispunit("getValue");
					var fieldName = fieldRow.name;
					
					var operatorId = trId + "_operator";
					var operatorRow = $("#" + operatorId).listDispunit("getValue");
					var operatorType = operatorRow.code;
					
					var valueId = trId + "_value";
					var value= null;
					var dispunitType = $("#" + valueId).attr("dispunitType");
					switch(dispunitType){
						case "text":
							value = $("#" + valueId).textDispunit("getValue");
							break;
						case "time":
							value = $("#" + valueId).timeDispunit("getValue");
						break;
						case "date":
							value = $("#" + valueId).dateDispunit("getValue");
							break;
						case "decimal":
							value = $("#" + valueId).decimalDispunit("getValue");
							break;
						case "checkbox":
							value = $("#" + valueId).checkboxDispunit("getValue");
							break;
						case "list":
							var fieldName = $("#" + valueId).attr("idField");
							var row = $("#" + valueId).listDispunit("getValue");
							value = row == null ? null : row[fieldName];
							break;
						case "pop":
							var fieldName = $("#" + valueId).attr("idField");
							var row = $("#" + valueId).popDispunit("getValue");
							value = row == null ? null : row[fieldName];
							break;
					}					
					
					conditions.push({
						joinType:joinType,
						fieldName:fieldName,
						operatorType:operatorType,
						value:value,
						isSubGroup:false
					});	
				}
				else{
					var isSubGroup = $(tr).attr("isSubGroup") == "true";	
					if(isSubGroup){
						var joinRow = $("#" + joinId).listDispunit("getValue");
						var joinType = joinRow == null ? null : joinRow.code;
						
						var subGroupContainerId = trId + "_subGroupContainer";
						//var subGroup = $("#" + subGroupContainerId).children("table")[0];
						//var subGroupId = $(subGroup).attr("id");
						var subConditions = getAllConditions(subGroupContainerId);
						conditions.push({
							joinType:joinType,
							subConditions:subConditions,
							isSubGroup:true
							});
					}
				}
			}
			return conditions;
		} 
		
		var convertToWhereClause = function(conditions){
			var cCount = conditions.length;
			for(var i=0;i<cCount;i++){
				var condition = conditions[i];
				var previousCondition = i == 0 ? null: conditions[i - 1];
				var nextCondition = i == cCount - 1 ? null: conditions[i + 1];
				if(condition.joinType == "and" || (nextCondition != null &&nextCondition.joinType == "and")){
					condition.level = 1;
				}
				else{
					condition.level = 0;
				}
			}

			var orConditions = {parttype:"or",value:[]};
			var tempAndConditions = null;
			for(var i=0;i<cCount;i++){
				var condition = conditions[i];
				if(condition.level == 0){ 
					if(tempAndConditions != null){
						orConditions.value.push(tempAndConditions);
						tempAndConditions = null;
					}
					if(condition.isSubGroup){
						var childWhereClause = convertToWhereClause(condition.subConditions);
						orConditions.value.push(childWhereClause);
					}
					else{
						orConditions.value.push({
							parttype:"field",
							field:condition.fieldName,
							operator:condition.operatorType,
							value:condition.value
						});
					}
				}
				else{
					if(tempAndConditions == null){
						tempAndConditions = {parttype:"and",value:[]};
					}
					if(condition.isSubGroup){
						var childWhereClause = convertToWhereClause(condition.subConditions);
						tempAndConditions.value.push(childWhereClause);
					}
					else{
						tempAndConditions.value.push({
							parttype:"field",
							field:condition.fieldName,
							operator:condition.operatorType,
							value:condition.value
						});
					}
				}
			}
			if(tempAndConditions != null){
				orConditions.value.push(tempAndConditions);
				tempAndConditions = null;
			}
			return orConditions;
		} 
		
		var convertConditionToServerObjects = function(conditions){
			var serverObjects =null;
			var cCount = conditions.length;
			if(cCount > 0){
				serverObjects = new Array();
				for(var i=0;i<conditions.length;i++){
					var condition = conditions[i];
					if(condition.isSubGroup){
						var serverObj = {
							joinType:condition.joinType,
							subConditions:convertConditionToServerObjects(condition.subConditions),
							isSubGroup:true
						}
						serverObjects.push(serverObj);
					}
					else{
						serverObjects.push({
							joinType:condition.joinType,
							fieldName: encodeURIComponent(condition.fieldName),
							operatorType:condition.operatorType, 
							isSubGroup:false
						});	
					}
				}
			}
			return serverObjects;
		}
		
		var saveConditionToServer = function(conditions){
			var serverObjects = convertConditionToServerObjects(conditions);
			var conditionStr = cmnPcr.jsonToStr(serverObjects);
			if(that.serverConditionStr != conditionStr){
				var requestParam = {
					serviceName : "viewGridNcpService",
					waitingBarParentId : that.containerId,
					funcName : "saveComplexQuery",
					successFunc : function(obj) {
						that.serverConditionStr = conditionStr;
					},
					args : {
						requestParam : cmnPcr
								.jsonToStr( {
									modelName : that.viewModel.name,
									featureName : "ViewGridComplexQuery",
									content:encodeURIComponent(conditionStr),
									description : ""
								})
					}
				};
				that.ProcessServerAccess(requestParam);
			}
		}
		
		var initAfterGetServerConditions= function(p){
			var requestParam = {
				serviceName : "viewGridNcpService",
				waitingBarParentId : that.containerId,
				funcName : "getComplexQuery",
				successFunc : function(obj) { 
					var serverConditionStr = decodeURIComponent(obj.result.complexQueryContent);
					var serverConditions = cmnPcr.strToJson(serverConditionStr);
					that.serverConditionStr = serverConditionStr;
					initGroupControl({
						containerId:p.innerContainerId,
						serverConditions:serverConditions
						});
				},
				args : {
					requestParam : cmnPcr
							.jsonToStr( {
								modelName : that.viewModel.name,
								featureName : "ViewGridComplexQuery",
								otherRequestParam:p.otherRequestParam
							})
				}
			};
			that.ProcessServerAccess(requestParam);
		}
		
		initAfterGetServerConditions({innerContainerId:innerContainerId});
		
		$("#" + okBtnId).click(function(){
			
			//构造查询条件
			var conditions = getAllConditions(innerContainerId);
			
			//调用ViewGridService服务，将condition保存在服务器端
			saveConditionToServer(conditions);

			//转换成服务器端可识别的查询条件
			var whereClause = convertToWhereClause(conditions);
			
			//关闭查询条件窗口
			popContainer.hide(); 
			
			//刷新界面
			that.where = whereClause.value.length == 0 ? [] : [whereClause]; 
	        that.doPage({ pageNumber : 1 });
		});
		
		$("#" + cancelBtnId).click(function(){ 
			popContainer.hide(); 
		});
		
		$("#" + clearQueryBtnId).click(function(){ 
			popContainer.hide(); 
			that.where = null;
	        that.doPage({ pageNumber : 1 });
		});
		
		return popContainer;
	}

	//显示
	this.show = function() {

		//为控件绑定功能，并使控件受状态控制
		this.regOperateCtrls();

		//设置控件状态
		this.setCtrlStatus(formStatusType.browse);

		//初始化grid
		this.initGrid(p);

		//加载第一页数据
		if (this.isShowData) {
			this.doPage( {
				pageNumber : 1
			});
		} else {
			this.setCtrlStatus(formStatusType.browse);
		}
	}
}