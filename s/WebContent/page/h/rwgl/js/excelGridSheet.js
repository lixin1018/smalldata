function ExcelGridSheet(){ 
	this.name = false; 
	this.id = null; 
	this.index = 0; 
	
	this.init = function(initParam){
		if(initParam.id == null){
			this.id = cmnPcr.createGuid();
		}
		else{
			this.id = initParam.id;
		}
		this.name = initParam.name;
		this.index = initParam.index;
		this.initColumnNameDic();
	} 
		
	//所有列
	this.allColumns = new Array();
	this.setAllColumns = function(allColumns){
		this.allColumns = allColumns;
	}
	this.getAllColumns = function(){
		return this.allColumns;
	}
	
	//所有行
	this.allRows = new Array(); 
	this.setAllRows = function(allRows){
		this.allRows = allRows;
	}
	this.getAllRows = function(){
		return this.allRows;
	}
	
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
	
	//根据行列序号获取单元格Id
	this.getCellIdByIndex = function(columnIndex, rowIndex){ 
		if(columnIndex >= 0 && columnIndex < this.allColumns.length
			&& rowIndex >=0 && rowIndex < this.allRows.length){					
			var column = this.getColumnByIndex(columnIndex);
			var row = this.getRowByIndex(rowIndex);
			var cellId = this.id + "_" + column.id + "_" + row.id;
			return cellId;
		}
		else{
			return null;
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
	
	//根据行名称 （行序号+1）
	this.getRowNameById = function(rowId){
		var rowCount = this.allRows.length;
		for(var i = 0; i < rowCount; i++){
			if(rowId == this.allRows[i].id){
				return i + 1;
			}
		}
		return 0;
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
}

function ExcelGridColumn(){
	this.width = 80;
	this.isFrozen = false;
	this.sheetId = null;
	this.id = null;
	this.isDeleted = false;
	
	this.init = function(initParam){
		if(initParam.id == null){
			this.id = cmnPcr.createGuid();
		}
		else{
			this.id = initParam.id;
		}
		this.sheetId = initParam.sheetId;
		this.width = initParam.width;
		this.isFrozen = initParam.isFrozen == null ? false : initParam.isFrozen;
	} 
}

function ExcelGridRow(){
	this.height = 20;
	this.isFrozen = false;
	this.sheetId = null;
	this.id = null;
	this.isDeleted = false;
	
	this.init = function(initParam){
		if(initParam.id == null){
			this.id = cmnPcr.createGuid();
		}
		else{
			this.id = initParam.id;
		}
		this.sheetId = initParam.sheetId;
		this.height = initParam.height;
		this.isFrozen = initParam.isFrozen == null ? false : initParam.isFrozen;
	} 
}
 
var re1 = new RegExp("^=");   
function checkIsExpression(str){    
	return re1.test(str);
}   
function ExcelGridCell(){
	this.id = null;
	this.sheetId = null;
	this.columnId = null;
	this.rowId = null;
	this.value = null;
	this.cellValueType = valueType.string;
	this.cellShowType = "text";//text/htmlElement/link
	this.expression = "";
	this.isExp = false;
	this.formatString = "";
	this.colSpan = 1;
	this.rowSpan = 1;
	this.component = "";
	this.groupCellId = null;
	this.isDeleted = false;
	
	this.jsCode = "";
	this.effectCellIds = {};
	this.isError = false;
	this.note = "";
	
	//样式
	this.cssStyle = new ExcelGridCssStyle();
		
	//是否存在循环引用
	this.hasCircleRefer = false;
	
	this.expTreePart = null; 
	
	this.isBlankCell = function(){
		var isBlankCell = (this.value == null || this.value.toString() == "")
			&& !this.isExp
			&& this.cellShowType == "text"
			&& this.cellValueType == valueType.string
			&& this.colSpan == 1
			&& this.rowSpan == 1
			&& (this.groupCellId == this.id || this.groupCellId == null || this.groupCellId == "")
			&& (this.cssStyle == null || this.cssStyle.isNull());
		return isBlankCell;
	}
	
	this.addEffectCellId = function(effectCellId){
		var effectCellIds = this.effectCellIds; 
		if(effectCellIds[effectCellId] == null){
			effectCellIds[effectCellId] = "";
		}
		
		/*
		if(this.effectCellIds == null){
			this.effectCellIds = new Array();
			this.effectCellIds.push(effectCellId);
		}
		else if(!this.effectCellIds.contains(effectCellId)){
			this.effectCellIds.push(effectCellId);
		}		
		*/
	}
	
	this.removeEffectCellId = function(effectCellId){
		var effectCellIds = this.effectCellIds; 
		if(effectCellIds[effectCellId] != null){
			delete effectCellIds[effectCellId];
		}
	}
	
	this.clearEffectCellId = function(){
		this.effectCellIds = {};
	}
	
	this.getIsExp = function(){
		return this.isExp; 
	}
	
	this.getExpression = function(){
		return this.expression;
	} 
	
	this.clone = function(sheetId, colId, rowId, groupCellId){
		var newCell = new ExcelGridCell();
		newCell.init({
			sheetId: sheetId,
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
			toCell.isExp = this.isExp;
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
	
	this.isHidden = function(){
		return this.groupCellId !=null && this.groupCellId != this.id;
	}
	
	this.isGroupMain = function(){
		return (this.rowSpan > 1 || this.colSpan > 1) && (this.groupCellId == null || this.groupCellId == this.id);
	}
	
	this.isInGroup = function(){
		//return this.groupCellId != null;
		return this.rowSpan > 1 || this.colSpan > 1 || this.groupCellId != null;
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
			this.id = initParam.sheetId + "_" + initParam.columnId + "_" + initParam.rowId;
		}
		else{
			this.id = initParam.id;
		}
		this.sheetId = initParam.sheetId; 
		this.columnId = initParam.columnId;
		this.rowId = initParam.rowId; 
		this.value = initParam.value == null || initParam.value == "" ? null : this.getValueObject(decodeURIComponent(initParam.value), initParam.cellValueType);
		this.cellValueType = initParam.cellValueType == null ? valueType.string : this.toFullValueType(initParam.cellValueType);
		this.cellShowType = initParam.cellShowType == null ? "text" : this.toFullShowType(initParam.cellShowType);
		this.expression = initParam.expression == null ? "" : decodeURIComponent(initParam.expression);
		this.isExp = initParam.isExp == "Y" ? true : false;
		this.formatString = initParam.formatString;
		this.colSpan = initParam.colSpan;
		this.rowSpan = initParam.rowSpan;
		this.groupCellId = initParam.groupCellId;
		
		this.jsCode = initParam.jsCode;
		this.effectCellIds = initParam.effectCellIds == null ? {} : initParam.effectCellIds;
		this.isError = initParam.isError == "Y" ? true : false;
		this.note = decodeURIComponent(initParam.note); 
	}
	
	this.toFullShowType = function(simpleShowType){	
		switch(simpleShowType){
			case "t":
			case "text":
				return "text";
			case "h":
			case "htmlElement":
				return "htmlElement";
			default:
				return "";
		} 
	}
	
	this.toSimpleShowType = function(fullShowType){	
		switch(fullShowType){
			case "text":
				return "t"; 
			case "htmlElement": 
				return "h";
			default:
				return "";
		}
	}
	
	this.toFullValueType = function(simpleValueType){
		switch(simpleValueType) { 
			case "o":
			case valueType.object:
				return valueType.object;
			case "s":
			case valueType.string:
				return valueType.string;
			case "n":
			case valueType.decimal:
				return valueType.decimal;
			case "b":
			case valueType.boolean:
				return valueType.boolean;
			case "t":
			case valueType.time:
				return valueType.time;
			case "d":
			case valueType.date:
				return valueType.date;
			default:
				alert("toFullValueType, simpleValueType=" + simpleValueType);
				return null;
		}
	}
	
	this.toSimpleValueType = function(fullValueType){
		switch(fullValueType) {  
			case valueType.object:
				return "o"; 
			case valueType.string:
				return "s"; 
			case valueType.decimal:
				return "n"; 
			case valueType.boolean:
				return "b"; 
			case valueType.time:
				return "t"; 
			case valueType.date:
				return "d";
			default:
				alert("toSimpleValueType, fullValueType=" + fullValueType);
				return null;
		}
	}		
}

function ExcelGridCssStyle(){
	this.color = null;
	this.backgroundColor = null;
	this.fontFamily = null;
	this.fontSize = null;
	this.fontStyle = null;
	this.borderBottom = new ExcelGridBorderStyle();
	this.borderRight = new ExcelGridBorderStyle();
	this.borderTop = new ExcelGridBorderStyle();
	this.borderLeft = new ExcelGridBorderStyle();
	this.textHAlign = null;
	this.textVAlign = null;
	
	this.isNull = function(){
		if((this.color == null || this.color == "") 
			&& (this.backgroundColor == null || this.backgroundColor == "")
			&& (this.fontFamily == null || this.fontFamily == "" || this.fontFamily == "SimSun")
			&& (this.fontSize == null || this.fontSize == "" || this.fontSize == 11)
			&& (this.fontStyle == null || this.fontStyle == "" || this.fontStyle == "normal")
			&& (this.borderLeft == null || this.borderLeft.isNull())
			&& (this.borderTop == null || this.borderTop.isNull())
			&& (this.borderRight == null || this.borderRight.isNull())
			&& (this.borderBottom == null || this.borderBottom.isNull())){
			return true;
		}
		else{
			return false;
		}
	}
	
	this.fromJson = function(json){
		if(json.c != null){
			this.color = json.c;
		}
		if(json.bc != null){
			this.backgroundColor = json.bc;
		}
		if(json.ff != null){
			this.fontFamily = json.ff;
		}
		if(json.fs != null){
			this.fontSize = json.fs;
		}
		if(json.st != null){
			this.fontStyle = json.st;
		}
		if(json.ha != null){
			this.textHAlign = json.ha;
		}
		if(json.va != null){
			this.textVAlign = json.va;
		}
		if(json.bl != null){
			this.borderLeft = new ExcelGridBorderStyle();
			this.borderLeft.fromJson(json.bl);
		}
		if(json.bt != null){
			this.borderTop = new ExcelGridBorderStyle();
			this.borderTop.fromJson(json.bt);
		}
		if(json.br != null){
			this.borderRight = new ExcelGridBorderStyle();
			this.borderRight.fromJson(json.br);
		}
		if(json.bb != null){
			this.borderBottom = new ExcelGridBorderStyle();
			this.borderBottom.fromJson(json.bb);
		}
	}
	
	this.toJson = function(){
		var json = {};
		if(this.color != null && this.color != ""){
			json["c"] = this.color;
		}
		if(this.backgroundColor != null && this.backgroundColor != ""){
			json["bc"] = this.backgroundColor;
		}
		if(this.fontFamily != null && this.fontFamily != "" && this.fontFamily != "SimSun"){
			json["ff"] = this.fontFamily;
		}
		if(this.fontSize != null && this.fontSize != "" && this.fontSize != 11){
			json["fs"] = this.fontSize;
		}
		if(this.fontStyle != null && this.fontStyle != "" && this.fontStyle != "normal"){
			json["st"] = this.fontStyle;
		}
		if(this.textHAlign != null && this.textHAlign != "" && this.textHAlign != cssTextAlignType.general){
			json["ha"] = this.textHAlign;
		}
		if(this.textVAlign != null && this.textVAlign != "" && this.textVAlign != cssTextAlignType.middle){
			json["va"] = this.textVAlign;
		}
		if(this.borderTop != null && !this.borderTop.isNull()){
			json["bt"] = this.borderTop.toJson();
		}
		if(this.borderLeft != null && !this.borderLeft.isNull()){
			json["bl"] = this.borderLeft.toJson();
		}
		if(this.borderRight != null && !this.borderRight.isNull()){
			json["br"] = this.borderRight.toJson();
		}
		if(this.borderBottom != null && !this.borderBottom.isNull()){
			json["bb"] = this.borderBottom.toJson();
		}	
		return json;	
	}
}

function ExcelGridBorderStyle(p){
	this.color = p == null ? null : p.color;
	this.width = p == null ? null : p.width;
	this.style = p == null ? null : p.style;
	
	this.clone = function(){
		var newBorderStyle = new ExcelGridBorderStyle({
			color: this.color,
			width: this.width,
			style: this.style
		});
		return newBorderStyle;
	} 
	
	this.isNull = function(){
		if((this.color == null || this.color == "") 
			&& (this.width == null || this.width == "" || this.width == 0 || this.width == 1)
			&& (this.style == null || this.style == "" || this.style == "none")){
			return true;
		}
		else{
			return false;
		}
	}
	
	this.toJson = function(){
		var json = {};
		if(this.color != null && this.color != ""){
			json["c"] = this.color;
		}
		if(this.width != null && this.width != "" && this.width != 0 && this.width != 1){
			json["w"] = this.width;
		}
		if(this.style != null && this.style != "" && this.style != "none"){
			json["s"] = this.style;
		}	
		return json;	
	}
	
	this.fromJson = function(json){
		if(json.c != null){
			this.color = json.c;
		}
		if(json.w != null){
			this.width = json.w;
		}
		if(json.s != null){
			this.style = json.s;
		}
	}
}

var cssFontStyle = {
	normal: "normal",
	italic: "italic",
	bold: "bold",
	italicBold: "italicBold"
}

var cssTextAlignType = {
	left: "l",
	center: "c",
	right: "r",
	general: "g",
	top: "t",
	middle: "m",
	bottom: "b"
}

var cssBorderStyleType = {
	none: "none",
	dotted: "dotted",
	dashed: "dashed",
	solid: "solid",
	double: "double"
}

var rangeInitSpan = 0;
//ExcelGrid某个区域的数据
function ExcelGridRangeValue(){

	this.eg = null;
	
	this.sheetId = null;
	
	//object[][]
	this.values = null;
		
	this.colNameToIndex = null;
	
	this.rowNameToIndex = null;
		
	this.init = function(eg, sheetId, fromColId, fromRowId, toColId, toRowId){
		this.eg = eg;
		this.sheetId = sheetId;
		var sheet = eg.allSheets[sheetId];
		var fromColIndex =  sheet.getColumnIndexById(fromColId);
		var toColIndex = sheet.getColumnIndexById(toColId);
		var fromRowIndex = fromRowId == "" ? 0 : sheet.getRowIndexById(fromRowId);
		var toRowIndex = toRowId == "" ? (sheet.allRows.length - 1) : sheet.getRowIndexById(toRowId);

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
			var colId = sheet.getColumnIdByIndex(colIndex);
			var colName = sheet.getColumnNameById(colId);
			this.colNameToIndex[colName] = colIndex - fromColIndex;
		}

		this.rowNameToIndex = new Object();
		for(var rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			var rowId = sheet.getRowIdByIndex(rowIndex);
			var rowName = sheet.getRowIndexById(rowId);
			this.rowNameToIndex[rowName] = rowIndex - fromRowIndex;
		}
		
		this.values = new Array(); 
		for(var rowIndex = fromRowIndex; rowIndex <= toRowIndex; rowIndex++){
			
			var rowValues = new Array();
			this.values.push(rowValues);
			var rowId = sheet.getRowIdByIndex(rowIndex);
			for(var colIndex = fromColIndex; colIndex <= toColIndex; colIndex++){
				var colId = sheet.getColumnIdByIndex(colIndex); 
				var cellId = sheetId + "_" + colId + "_" + rowId; 
				var cell = eg.getCell(cellId); 
				var value = cell.value; 
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
