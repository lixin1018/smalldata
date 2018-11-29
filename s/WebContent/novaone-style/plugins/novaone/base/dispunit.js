$.fn.popMultiDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.popMultiDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "popMultiDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"ncpDispunitCtrl ncpDispunitCtrlWithButton\" ></div><div class=\"ncpDispunitBtn ncpDispunitPop\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);	
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("width", "");
		$(this).css("padding", "0px");
		$(this).attr("disabled", "disabled");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);	
		$("#" + tableId).find(".ncpDispunitBtn").height(
				$("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "popMulti");

		var btn = $("#" + tableId).find(".ncpDispunitBtn")[0];
		var showPop = function(value) {
			options.showPopFunc( {
				value : value,
				options : options.options,
				changeValueFunc : function(rowData) {
					var idField = options.idField;
					var values = new Array();
					for(var rowId in rowData){
						var value = rowData[rowId];
						if(idField != null){
							value[idField] = rowId;							
						}
						values.push(value);
					}
					$(that).popMultiDispunit("setValue", values);
					if (values != null && values.length != 0) {
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, values,
									options.options.rowId);
						}
					} 
					/*
					else {
						var initValue = $(that).popMultiDispunit("getValue"); //cmnPcr.strToJson($(that).attr("jsonValue"));
						$(that).popMultiDispunit("setValue", initValue);
					}
					*/
				}
			});
		}

		$(btn).click(function() {
			var value = $(that).popMultiDispunit("getValue");
			showPop(value);
		});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.popMultiDispunit.methods["setValue"](this, {});
	}
	return this;
}

$.fn.popMultiDispunit.methods = {
	getValue : function(jq) {
		var textField = $(jq).attr("textField");
		var idField = $(jq).attr("idField");
		var idValueArray = $(jq).attr("idValue").length == 0 ? null : $(jq).attr("idValue").split(",");	
		var valueArray = $(jq).attr("jsonValue").length == 0 ? null : $(jq).attr("jsonValue").split(",");	
		var values = new Array();
		if(valueArray != null){
			for(var i = 0; i < valueArray.length; i++){
				var value = {};
				if(idField != null){
					value[idField] = idValueArray[i];
				}
				value[textField] = decodeURIComponent(valueArray[i]);				
				values.push(value);
			}	
		}
		return values;
	},
	setValue : function(jq, values) {
		if (values == null) {
			values = [];
		}
		var textField = $(jq).attr("textField");
  
		var textFieldArray = new Array();
		for ( var i = 0; i < values.length; i++) {
			var oneRow = values[i];
			textFieldArray.push(oneRow[textField]);
		}
		var textFieldStr = cmnPcr.arrayToString(textFieldArray, ",");
		$(jq).val(textFieldStr);
		//$(jq).attr("initValue", textFieldStr); 

		var idField = $(jq).attr("idField");
		var idFieldArray = new Array();
		if (idField != null) {
			for ( var i = 0; i < values.length; i++) {
				var oneRow = values[i];
				idFieldArray.push(oneRow[idField]);
			}
		}
		$(jq).attr("idValue", cmnPcr.arrayToString(idFieldArray, ","));
		
		var encodeValueArray = new Array();
		for ( var i = 0; i < values.length; i++) {
			var oneRow = values[i];
			encodeValueArray.push(oneRow[textField] == null ? null : encodeURIComponent(oneRow[textField]));
		}
		
		$(jq).attr("jsonValue", cmnPcr.arrayToString(encodeValueArray, ","));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("isDisabled", "true");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).attr("isDisabled", "false");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("isDisabled") == "true";
	}
}

$.fn.popDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.popDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "popDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"ncpDispunitCtrl ncpDispunitCtrlWithButton\" ></div><div class=\"ncpDispunitBtn ncpDispunitPop\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("width", "");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".ncpDispunitBtn").height(ctrlHeight);

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "pop");

		var btn = $("#" + tableId).find(".ncpDispunitBtn")[0];
		var showPop = function(value) {
			options.showPopFunc( {
				value : value,
				options : options.options,
				changeValueFunc : function(rowData) {
					if (rowData != null) {
						var isChanged = false;
						var idField = options.idField;
						var textField = options.textField;
						if (idField == null) {
							isChanged = rowData[textField] != $(that)
									.listDispunit("getValue")[textField];
						} else {
							isChanged = rowData[idField] != $(that)
									.listDispunit("getValue")[idField];
						}

						$(that).popDispunit("setValue", rowData);
						if (isChanged) {
							if (options.options.changeFunc != undefined) {
								options.options.changeFunc(that, rowData,
										options.options.rowId);
							}
						}
					} else {
						var initValue = $(that).popDispunit("getValue"); //cmnPcr.strToJson($(that).attr("jsonValue"));
						$(that).popDispunit("setValue", initValue);
					}
				}
			});
		}

		$(btn).click(function() {
			showPop(null);
		});
		$(this).change(function() {
			var autoPopAfterChange = $(this).attr("autoPopAfterChange") == "true";
			if(autoPopAfterChange){
				var value = $(this).val();
				showPop(value);
			}
			else{
				var textField = $(this).attr("textField");
				var value = {};
				value[textField] = $(this).val();
				$.fn.popDispunit.methods["setValue"](this, value);
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.popDispunit.methods["setValue"](this, {});
		$.fn.popDispunit.methods["setAutoPopAfterChange"](this, true);
	}
	return this;
}

$.fn.popDispunit.methods = {
	setAutoPopAfterChange:function(jq, autoPopAfterChange){
		$(jq).attr("autoPopAfterChange", autoPopAfterChange);
	},
	getValue : function(jq) {
		var value = cmnPcr.strToJson($(jq).attr("jsonValue"));
		for(var k in value){
			value[k] = value[k] == null? null : decodeURIComponent(value[k]);
		}
		return value;
	},
	setValue : function(jq, value) {
		if (value == null) {
			value = {};
		}
		var textField = $(jq).attr("textField");
		$(jq).val(value[textField]);
		$(jq).attr("initValue", value[textField]);

		var idField = $(jq).attr("idField");
		if (idField != null) {
			$(jq).attr("idValue", value[idField]);
		} 
		
		var encodeValue = {};
		for(var k in value){
			encodeValue[k] = value[k] == null ? null : encodeURIComponent(value[k]);
		}
		
		$(jq).attr("jsonValue", cmnPcr.jsonToStr(encodeValue));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			$(jq).css("background-color", "#F8FDF0");
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.listDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.listDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "listDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"ncpDispunitCtrl ncpDispunitCtrlWithButton\" ></div><div class=\"ncpDispunitBtn ncpDispunitList\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("width", "");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".ncpDispunitBtn").height(ctrlHeight);

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("textField", options.textField);
		$(this).attr("idField", options.idField);
		$(this).attr("dispunitType", "list");

		//只允许选取，不允许手工录入
		if(options.onlySelect){
			$(this).attr("disabled", "disabled");
			$(this).css("background-color", "#ffffff");
			$("#" + tableId).css("background-color", "#ffffff");
		}

		var btn = $("#" + tableId).find(".ncpDispunitBtn")[0];
		var showList = function(value) {
			var inputTable = $(that).parent().parent();//.parent();
			var width = 2;
			var height = 100;
			for ( var i = 0; i < options.columns[0].length; i++) {
				var column = options.columns[0][i];
				width += (column.hidden ? 0 : column.width);
			}
			var listContainer = new ListContainer( {
				parentControl : inputTable,
				width : width,
				height : height,
				closeWinFunc : function(p) {
					if (p.selected == undefined) {
						var initValue =$(that).listDispunit("getValue"); // cmnPcr.strToJson($(that).attr("jsonValue"));
						$(that).listDispunit("setValue", initValue);
					}
				}
			});
			listContainer.show();
			var listCtrlId = listContainer.containerId + "_List";
			$("#" + listContainer.containerId).html(
					"<table style=\"width:100%;height:100%;\" id=\""
							+ listCtrlId + "\"></table>");
			$(that).attr("listContainerId", listContainer.containerId);
			$(that).attr("listCtrlId", listCtrlId);
			$("#" + listCtrlId)
					.datagrid(
							{
								columns : options.columns,
								border : false,
								style : {
									borderWidth : 0
								},
								fit : true,
								fitColumns : true,
								autoRowHeight : false,
								onClickRow : function(rowIndex, rowData) {
									listContainer.close( {
										selected : true
									});
									if (rowData != null) {
										var isChanged = false;
										var idField = options.idField;
										var textField = options.textField;
										if (idField == null) {
											isChanged = rowData[textField] != $(
													that).listDispunit(
													"getValue")[textField];
										} else {
											isChanged = rowData[idField] != $(
													that).listDispunit(
													"getValue")[idField];
										}

										$(that).listDispunit("setValue",
												rowData);
										if (isChanged) {
											if (options.options.changeFunc != undefined) {
												options.options.changeFunc(
														that, rowData,
														options.options.rowId);
											}
										}
									}
								}
							});
			//改在构造了grid控件后执行
			options.getListFunc( {
				value : value,
				options : options.options
			});
		}

		$(btn).click(function() {
			showList(null);
		});
		$(this).change(function() {
			var value = $(this).val();
			showList(value);
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
		$.fn.listDispunit.methods["setValue"](this, {});
	}
	return this;
}

$.fn.listDispunit.methods = {
	getValue : function(jq) {
		var value = cmnPcr.strToJson($(jq).attr("jsonValue"));

		for(var k in value){
			value[k] = value[k] == null? null : decodeURIComponent(value[k]);
		}
		return value;
	},
	setValue : function(jq, value) {
		if (value == null) {
			value = {};
		}
		var textField = $(jq).attr("textField");
		$(jq).val(value[textField]);
		$(jq).attr("initValue", value[textField]);

		var idField = $(jq).attr("idField");
		if (idField != null) {
			$(jq).attr("idValue", value[idField]);
		}
		
		var encodeValue = {};
		for(var k in value){
			encodeValue[k] = value[k] == null ? null : encodeURIComponent(value[k]);
		}
		$(jq).attr("jsonValue", cmnPcr.jsonToStr(encodeValue));
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			$(jq).css("background-color", "#F8FDF0");
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	showList : function(jq, data) {
		var height = 25 + 25 * (data.length > 10 ? 10 : data.length);
		var listContainerId = $(jq).attr("listContainerId");
		var listCtrlId = $(jq).attr("listCtrlId");
		$("#" + listContainerId).height(height);
		$("#" + listCtrlId).datagrid( {
			data : data
		});
		$("#" + listCtrlId).datagrid("selectRow", 0);
		$("#" + listCtrlId).focus();
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.checkboxDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.checkboxDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "checkboxDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var html = "<div id=\"" + tableId
				+ "\" class=\"ncpDispunitTable\" ></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + tableId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);		
		$("#" + tableId).css("border", "0px");
		$("#" + tableId).css("height", "auto");
		$("#" + tableId).css("padding-top", "4px");
		//style=\"height:auto;padding-top:5px;\"
		$(this).css("width", "14px");
		$(this).css("height", "14px");
		$(this).css("line-height", $("#" + tableId).height() + "px");
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "checkbox");

		$(this).change(function() {
			if (!$(this).checkboxDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					var newValue = $(that).checkboxDispunit("getValue");
					options.options.changeFunc(that, newValue);
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.checkboxDispunit.methods = {
	getValue : function(jq) {
		return $(jq).attr("checked") == "checked";
	},
	setValue : function(jq, value) {
		if (value) {
			$(jq).attr("checked", "checked");
		} else {
			$(jq).removeAttr("checked");
		}
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).css("background-color", "transparent");
			$(jq).attr("disabled", "disabled");
		} else {
			$(jq).css("background-color", "#F8FDF0");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.timeDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.timeDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "timeDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"ncpDispunitCtrl ncpDispunitCtrlWithButton\" ></div><div class=\"ncpDispunitBtn ncpDispunitDateTime\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		var that = this;
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("width", "");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".ncpDispunitBtn").height(
				$("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "time");

		//弹出编辑日期
		var btn = $("#" + tableId).find(".ncpDispunitBtn")[0];
		var showPop = function(value) {
			var inputTable = $(that).parent().parent();//.parent();
			var listContainer = new ListContainer( {
				parentControl : inputTable,
				width : 200,
				height : 195
			});
			listContainer.show();

			var calendarContainerId = listContainer.containerId + "_calendar";
			var timespinnerId = listContainer.containerId + "_timespinner";
			var returnBtnId = listContainer.containerId + "_returnBtn";
			var innerHtml = "<div style=\"height:170px;width:200px;\" id=\""
					+ calendarContainerId
					+ "\"></div>"
					+ "<div style=\"height:20px;width:200px;\">"
					+ "<input id=\""
					+ timespinnerId
					+ "\" class=\"easyui-timespinner\" style=\"width:80px;\" />&nbsp;"
					+ "<input id=\""
					+ returnBtnId
					+ "\" type=\"button\" value=\"确定\" style=\"width:40px;height:22px;vertical-align:middle;\" /></div>";
			$("#" + listContainer.containerId).html(innerHtml);

			$("#" + calendarContainerId).calendar(
					{
						current : value,
						weeks : [ "日", "一", "二", "三", "四", "五", "六", ],
						months : [ "1月", "2月", "3月", "4月", "5月", "6月", "7月",
								"8月", "9月", "10月", "11月", "12月" ],
						onSelect : function(date) {
							var dateStr = date.getFullYear() + "-"
									+ (date.getMonth() + 1) + "-"
									+ date.getDate();
							$("#" + calendarContainerId).attr("dateStr",
									dateStr);
						}
					});
			if (value != null) {
				$("#" + calendarContainerId).calendar("moveTo", value);
				var dateStr = value.getFullYear() + "-"
						+ (value.getMonth() + 1) + "-" + value.getDate();
				$("#" + calendarContainerId).attr("dateStr", dateStr);
			}
			$("#" + timespinnerId).timespinner( {
				required : true,
				showSeconds : true
			});
			$("#" + timespinnerId).timespinner(
					"setValue",
					value == null ? "00:00:00" : (value.getHours() + ":"
							+ value.getMinutes() + ":" + value.getSeconds()));
			$("#" + returnBtnId).click(function() {
				var dateStr = $("#" + calendarContainerId).attr("dateStr");
				if (dateStr == undefined) {
					msgBox.alert( {
						info : "请选中日期."
					});
					return;
				}
				var timeStr = $("#" + timespinnerId).timespinner("getValue");
				var datetime = cmnPcr.strToTime(dateStr + " " + timeStr);
				listContainer.close();
				$(that).timeDispunit("setValue", datetime);
				if (options.options.changeFunc != undefined) {
					options.options.changeFunc(that, $(that).val());
				}
			});
		}
		$(btn).click(function() {
			var value = $(that).timeDispunit("getValue");
			showPop(value);
		});

		$(this).change(
			function() {
				if (!$(this).timeDispunit("getReadonly")) {
					var newValue = null;
					var str = $(this).val();
					if (cmnPcr.trim(str) == "") {
						newValue = null;
					} else {
						newValue = cmnPcr.strToDate(str);
					}
					if (cmnPcr.objectToStr(newValue, valueType.time) != $(
							this).attr("initValue")) {
						$(this).timeDispunit("setValue", newValue);
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, newValue);
						}
					}
				}
			});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.timeDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.time);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.time)
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			$(jq).css("background-color", "#F8FDF0");
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.dateDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.dateDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "datelDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var thisw = Math.floor($(this).width()) - 23;
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\" ><div id=\""
				+ contentTdId
				+ "\" class=\"ncpDispunitCtrl ncpDispunitCtrlWithButton\" ></div><div class=\"ncpDispunitBtn ncpDispunitDateTime\">&nbsp;</div></div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		var that = this;
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("width", "");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$("#" + tableId).find(".ncpDispunitBtn").height(
				$("#" + tableId).height());

		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "date");

		//弹出编辑日期
		var btn = $("#" + tableId).find(".ncpDispunitBtn")[0];
		var showPop = function(value) {
			var inputTable = $(that).parent().parent();//.parent();
			var listContainer = new ListContainer( {
				parentControl : inputTable,
				width : 200,
				height : 170
			});
			listContainer.show();
			$("#" + listContainer.containerId)
					.calendar(
							{
								current : value,
								weeks : [ "日", "一", "二", "三", "四", "五", "六"],
								months : [ "1月", "2月", "3月", "4月", "5月", "6月",
										"7月", "8月", "9月", "10月", "11月", "12月" ],
								onSelect : function(date) {
									listContainer.close();
									$(that).dateDispunit("setValue", date);
									if (options.options.changeFunc != undefined) {
										options.options.changeFunc(that,
												$(that).val());
									}
								}
							});
			$("#" + listContainer.containerId).calendar('moveTo', value);
		}
		$(btn).click(function() {
			var value = $(that).dateDispunit("getValue");
			showPop(value);
		});

		$(this).change(
			function() {
				if (!$(this).dateDispunit("getReadonly")) {
					var newValue = null;
					var str = $(this).val();
					if (cmnPcr.trim(str) == "") {
						newValue = null;
					} else {
						newValue = cmnPcr.strToDate(str);
					}
					if (cmnPcr.objectToStr(newValue, valueType.time) != $(
							this).attr("initValue")) {
						$(this).dateDispunit("setValue", newValue);
						if (options.options.changeFunc != undefined) {
							options.options.changeFunc(that, newValue);
						}
					}
				}
			});

		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.dateDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.date);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.date);
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).attr("disabled", "disabled");
			$(jq).css("background-color", "transparent");
			$(jq).parent().next().css("display", "none");
		} else {
			$(jq).removeAttr("disabled");
			$(jq).css("background-color", "#F8FDF0");
			$(jq).parent().next().css("display", "block");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.decimalDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.decimalDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "decimalDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var html = "<div id=\""
				+ tableId
				+ "\" class=\"ncpDispunitTable\"></div>";

		var that = this;
		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + tableId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("padding", "0px");
		$(this).css("ime-mode", "disabled");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$(this).attr("fieldName", options.options.fieldName);
		$(this)
				.attr("onkeypress",
						"return event.key >= '0' && event.key <= '9' || event.key == '.';");
		$(this).attr("onpaste",
				"return !clipboardData.getData('text').match(/\D/)");
		$(this).attr("ondragenter", "return false;");
		$(this).attr("dispunitType", "decimal");

		if (options.options.changeFunc != undefined) {
			if (!$(this).decimalDispunit("getReadonly")) {
				$(this)
						.change(
								function() {
									var newValue = null;
									var str = $(this).val();
									if (cmnPcr.trim(str) == "") {
										newValue = null;
									} else {
										newValue = cmnPcr.strToDecimal(str);
										if (isNaN(newValue)) {
											newValue = null;
										} else {
											newValue = cmnPcr.toFixed(newValue,
													options.precision);
										}
									}
									if (cmnPcr.objectToStr(newValue,
											valueType.decimal) != $(this).attr(
											"initValue")) {
										$(this).decimalDispunit("setValue",
												newValue);
										if (options.options.changeFunc != undefined) {
											options.options.changeFunc(that,
													newValue);
										}
									} else {
										$(this).decimalDispunit("setValue",
												newValue);
									}
								});
			}
		}
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.decimalDispunit.methods = {
	getValue : function(jq) {
		var str = $(jq).val();
		return cmnPcr.strToObject(str, valueType.decimal);
	},
	setValue : function(jq, value) {
		var str = cmnPcr.objectToStr(value, valueType.decimal);
		$(jq).val(str);
		$(jq).attr("initValue", str);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).css("background-color", "transparent");
			$(jq).attr("disabled", "disabled");
		} else {
			$(jq).css("background-color", "#F8FDF0");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.textDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.textDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "textDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var html = "<div id=\"" + tableId
				+ "\" class=\"ncpDispunitTable\" ></div>";

		var style = $(this).attr("style");
		//var ctrlHeight=$(parent).height();
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$("#" + tableId).height(ctrlHeight);	
		$(this).appendTo("#" + tableId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("padding", "0px");
		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("dispunitType", "text");
		
		$(this).change(function() {
			if (!$(this).textDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					options.options.changeFunc(that, $(that).val());
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.textDispunit.methods = {
	getValue : function(jq) {
		return $(jq).val();
	},
	setValue : function(jq, value) {
		$(jq).val(value);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).css("background-color", "transparent");
			$(jq).attr("disabled", "disabled");
		} else {
			$(jq).css("background-color", "#F8FDF0");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.textareaDispunit = function(options, value) {
	if (typeof options == "string") {
		var method = $.fn.textareaDispunit.methods[options];
		if (method != undefined) {
			return method(this, value);
		} else {
			msgBox.alert( {
				info : "textareaDispunit: none method named = " + options
			});
			return this;
		}
	} else {
		var that = this;
		$(that).css(options.style);
		var parent = $(this).parent();
		var tableId = cmnPcr.getRandomValue();
		var contentTdId = tableId + "tableId";
		var html = "<div id=\"" + tableId
				+ "\" class=\"ncpDispunitTable\" </div>";

		var style = $(this).attr("style");
		var ctrlHeight = Math.floor($(this).height()) - 2;
		$(this).height(ctrlHeight);
		$(parent).append(html).height(ctrlHeight);
		$(this).appendTo("#" + contentTdId);
		$(this).addClass("ncpDispunitContent");
		$(this).css("padding", "0px");
		$(this).attr("dispunitType", "textarea");

		$("#" + tableId).attr("style", style);
		$("#" + tableId).height(ctrlHeight);
		$(this).attr("fieldName", options.options.fieldName);
		$(this).attr("spellcheck", false);
		$(this).change(function() {
			if (!$(this).textareaDispunit("getReadonly")) {
				if (options.options.changeFunc != undefined) {
					options.options.changeFunc(that, $(that).val());
				}
			}
		});
		$(this).keypress(function(event) {
			  switch(event.keyCode) {
			  	case 13:
					if (options.options.enterPressFunc != undefined) {
						options.options.enterPressFunc(that, event.shiftKey, options.options.rowId);
					}
			  		break;
			  }
		});
	}
	return this;
}

$.fn.textareaDispunit.methods = {
	getValue : function(jq) {
		return $(jq).val();
	},
	setValue : function(jq, value) {
		$(jq).val(value);
		return jq;
	},
	setReadonly : function(jq, isReadonly) {
		if (isReadonly) {
			$(jq).css("background-color", "transparent");
			$(jq).attr("disabled", "disabled");
		} else {
			$(jq).css("background-color", "#F8FDF0");
			$(jq).removeAttr("disabled");
		}
		return jq;
	},
	getReadonly : function(jq) {
		return $(jq).attr("disabled") == "disable";
	}
}

$.fn.dispunit = function(options, value) {
	if (typeof options == "string") {

	} else {

	}
	return this;
}

$.fn.dispunit.methods = {
	getValue : function(jq) {
	},
	setValue : function(jq, value) {
	},
	setReadonly : function(jq, isReadonly) {
	}
}