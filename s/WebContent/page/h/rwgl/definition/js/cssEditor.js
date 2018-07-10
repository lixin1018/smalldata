function CssEditorWindow(p){
	var that = this;
	this.containerId = null;
	this.form = null;
	this.afterOkFunction = null;
	
	this.outerBorderStyle = null;
	this.innerBorderStyle = null;
	this.topBorderStyle = null;
	this.bottomBorderStyle = null;
	this.leftBorderStyle = null;
	this.rightBorderStyle = null;
	this.fontFamily = null;
	this.fontSize = null;
	this.fontStyle = null;
	this.color = null;
	this.backgroundColor = null;
	this.textHAlign = null;
	this.textVAlign = null;
	
	this.init = function(p){
		this.afterOkFunction = p.afterOkFunction;
		this.initForm(p);
		this.initColorPicker();
		this.initCombobox();
	}
	
	this.initCombobox = function(){
		$(".borderStyleBtn").combobox("loadData", [
			{text: "无边框", value: "none"},
			{text: "点状", value: "dotted"},
			{text: "虚线", value: "dashed"},
			{text: "实线", value: "solid"}
			]);
		$(".borderWidthBtn").combobox("loadData", [
			{value: "1", text: "细"},
			{value: "2", text: "粗"}
			]);
			
		$(".fontSizeBtn").combobox("loadData", [
			{value: "6", text: "6"},
			{value: "7", text: "7"},
			{value: "8", text: "8"},
			{value: "9", text: "9"},
			{value: "10", text: "10"},
			{value: "11", text: "11"},
			{value: "12", text: "12"},
			{value: "14", text: "14"},
			{value: "16", text: "16"},
			{value: "18", text: "18"},
			{value: "20", text: "20"},
			{value: "22", text: "22"},
			{value: "24", text: "24"},
			{value: "26", text: "26"},
			{value: "28", text: "28"},
			{value: "32", text: "32"},
			{value: "36", text: "36"},
			{value: "40", text: "40"},
			{value: "48", text: "48"},
			{value: "60", text: "60"},
			{value: "72", text: "72"}
			]);
			
		$(".fontStyleBtn").combobox("loadData", [
			{value: cssFontStyle.normal, text: "常规"}, 
			{value: cssFontStyle.italic, text: "倾斜"}, 
			{value: cssFontStyle.bold, text: "加粗"}, 
			{value: cssFontStyle.italicBold, text: "加粗倾斜"}
			]);
			
		$(".textHAlignBtn").combobox("loadData", [
			{value: cssTextAlignType.left, text: "左"},
			{value: cssTextAlignType.center, text: "中"}, 
			{value: cssTextAlignType.right, text: "右"}, 
			{value: cssTextAlignType.general, text: "自动"}
			]);
			
		$(".textVAlignBtn").combobox("loadData", [
			{value: cssTextAlignType.top, text: "上"},
			{value: cssTextAlignType.middle, text: "中"}, 
			{value: cssTextAlignType.bottom, text: "下"}
			]);
		
		
		$(".fontFamilyBtn").combobox("loadData", [
				{text: "宋体", value: "SimSun"},
				{text: "黑体", value: "SimHei"},
				{text: "楷体", value: "KaiTi"},
				{text: "新宋体", value: "	NSimSun"},
				{text: "仿宋", value: "FangSong"},
				{text: "微软雅黑", value: "Microsoft YaHei"},
				{text: "微软正黑体", value: "Microsoft JhengHei"},
				{text: "标楷体", value: "BiauKai"},
				{text: "新细明体", value: "PMingLiU"},
				{text: "细明体", value: "	MingLiU"},
				{text: "标楷体", value: "	DFKai-SB"},
				{text: "华文细黑", value: "STXihei"},
				{text: "华文黑体", value: "STHeiti"},
				{text: "华文楷体", value: "STKaiti"},
				{text: "华文宋体", value: "STSong"},
				{text: "华文中宋", value: "STZhongsong"},
				{text: "华文仿宋", value: "STFangsong"},
				{text: "华文彩云", value: "STCaiyun"},
				{text: "华文琥珀", value: "STHupo"},
				{text: "华文隶书", value: "STLiti"},
				{text: "文行楷	", value: "STXingkai"},
				{text: "华文新魏", value: "STXinwei"},
				{text: "丽黑 Pro", value: "LiHei Pro Medium"},
				{text: "丽宋 Pro", value: "LiSong Pro Light"},
				{text: "苹果丽中黑", value: "Apple LiGothic Medium"},
				{text: "苹果丽细宋", value: "Apple LiSung Light"},
				{text: "隶书", value: "LiSu"},
				{text: "幼圆", value: "YouYuan"},
				{text: "方正舒体", value: "FZShuTi"},
				{text: "方正姚体", value: "FZYaoti"},
				{text: "Arial", value: "Arial"},
				{text: "Book Antiqua", value: "Book Antiqua"},
				{text: "Century Gothic", value: "Century Gothic"},
				{text: "Courier New", value: "Courier New"},
				{text: "Georgia", value: "Georgia"},
				{text: "Impact", value: "Impact"},
				{text: "PmingLiu", value: "PmingLiu"},
				{text: "Tahoma", value: "Tahoma"},
				{text: "Times New Roman", value: "Times New Roman"},
				{text: "Verdana", value: "Verdana"}
			]);
			
			$("#" + this.containerId).find("div[name='outerBorder']").find(".borderStyleBtn").combobox({onSelect: function(rec){ 
				$("#" + that.containerId).find("div[name='leftBorder']").find(".borderStyleBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='rightBorder']").find(".borderStyleBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='topBorder']").find(".borderStyleBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='bottomBorder']").find(".borderStyleBtn").combobox("setValue", rec.value);
			}});
			
			$("#" + this.containerId).find("div[name='outerBorder']").find(".borderWidthBtn").combobox({onSelect: function(rec){ 
				$("#" + that.containerId).find("div[name='leftBorder']").find(".borderWidthBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='rightBorder']").find(".borderWidthBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='topBorder']").find(".borderWidthBtn").combobox("setValue", rec.value);
				$("#" + that.containerId).find("div[name='bottomBorder']").find(".borderWidthBtn").combobox("setValue", rec.value);
			}});

			
	}
	
	this.initForm = function(p){			
		var popContainer = new PopupContainer({
			width : 540,
			height : 265,
			top : 150
		}); 
		popContainer.show();
		var winId = cmnPcr.getRandomValue();
		that.containerId = popContainer.containerId;
		var titleId = winId + "_title";
		var innerContainerId = winId + "_inner";
		var buttonContainerId = winId + "_buttonContainer";
		var okBtnId = winId + "_ok";
		var cancelBtnId = winId + "_cancel";
		var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
	 	+ "<div id=\"" + innerContainerId + "\" style=\"width:100%;height:205px;font-size:11px;text-align:center;overflow:auto;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"width:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
	 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml); 		

		$("#" + titleId).text("样式设置");
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer; 
	
		$("#" + cancelBtnId).click(function(){ 
			that.form.hide(); 
		});
		
		$("#" + okBtnId).click(function(){	 
			that.afterOkFunction(that.getCssValues());
			that.form.hide();  
		});
		
	}
	
	this.show = function(p){
		if(this.form.isHidden){
			this.form.show();
		}
		this.outerBorderStyle = new ExcelGridBorderStyle(p.outerBorderStyle);
		this.innerBorderStyle = new ExcelGridBorderStyle(p.innerBorderStyle);
		this.topBorderStyle = new ExcelGridBorderStyle(p.topBorderStyle);
		this.bottomBorderStyle = new ExcelGridBorderStyle(p.bottomBorderStyle);
		this.leftBorderStyle = new ExcelGridBorderStyle(p.leftBorderStyle);
		this.rightBorderStyle = new ExcelGridBorderStyle(p.rightBorderStyle);
		this.fontFamily = p.fontFamily;
		this.fontSize = p.fontSize;
		this.fontStyle = p.fontStyle;
		this.textHAlign = p.textHAlign;
		this.textVAlign = p.textVAlign;
		this.color = p.color;
		this.backgroundColor = p.backgroundColor;	
		
		this.refreshShowValues();	
		 
	}
	
	this.refreshShowValues = function(){
		this.refreshBorderStyleShowValues("outerBorder", this.outerBorderStyle);
		this.refreshBorderStyleShowValues("innerBorder", this.innerBorderStyle);
		this.refreshBorderStyleShowValues("leftBorder", this.leftBorderStyle);
		this.refreshBorderStyleShowValues("rightBorder", this.rightBorderStyle);
		this.refreshBorderStyleShowValues("topBorder", this.topBorderStyle);
		this.refreshBorderStyleShowValues("bottomBorder", this.bottomBorderStyle);
		
		$("#" + this.containerId).find("div[name='fontFamily']").find(".fontFamilyBtn").combobox("setValue", this.fontFamily == null ? "" : this.fontFamily);
		$("#" + this.containerId).find("div[name='fontSize']").find(".fontSizeBtn").combobox("setValue", this.fontSize == null ? "" : this.fontSize);
		$("#" + this.containerId).find("div[name='fontStyle']").find(".fontStyleBtn").combobox("setValue", this.fontStyle == null ? "" : this.fontStyle);
		$("#" + this.containerId).find("div[name='textHAlign']").find(".textHAlignBtn").combobox("setValue", this.textHAlign == null ? "" : this.textHAlign);
		$("#" + this.containerId).find("div[name='textVAlign']").find(".textVAlignBtn").combobox("setValue", this.textVAlign == null ? "" : this.textVAlign);
		  
		var backgroundColor = (this.backgroundColor == "" || this.backgroundColor == null) ? "" : ("#" + this.backgroundColor);
		this.setColorPickerValue($("#" + this.containerId).find("div[name='backgroundColor']").find(".colorPickerBtn"), this.backgroundColor, backgroundColor);
		  
		var color = (this.color == "" || this.color == null) ? "" : ("#" + this.color); 
		this.setColorPickerValue($("#" + this.containerId).find("div[name='color']").find(".colorPickerBtn"), this.color, color);
	}
	
	this.refreshBorderStyleShowValues = function(borderDivName, borderStyle){
		var borderDiv = $("#" + this.containerId).find("div[name='" + borderDivName + "']"); 
		var color =  (borderStyle.color == "" || borderStyle.color == null) ? "" : ("#" + borderStyle.color);
		this.setColorPickerValue($(borderDiv).find(".colorPickerBtn"), borderStyle.color, color); 
		$(borderDiv).find(".borderStyleBtn").combobox("setValue", borderStyle.style == null ? "" : borderStyle.style);
		$(borderDiv).find(".borderWidthBtn").combobox("setValue", borderStyle.width == null ? "" : borderStyle.width);
	}
	
	this.getBorderStyleShowValues = function(borderDivName){
		var borderStyle = new ExcelGridBorderStyle({color: null, style: null, width: null});
		var borderDiv = $("#" + this.containerId).find("div[name='" + borderDivName + "']");
		var color = $(borderDiv).find(".colorPickerBtn").attr("colorValue");
		if(color != ""){
			borderStyle.color = color;
		}
		var style = $(borderDiv).find(".borderStyleBtn").combobox("getValue");
		if(style != ""){
			borderStyle.style = style;
		}
		var width = $(borderDiv).find(".borderWidthBtn").combobox("getValue");
		if(width != ""){
			borderStyle.width = cmnPcr.strToDecimal(width);
		}
		return borderStyle;
	}
	
	this.setBorderStyleColorValue = function(colorPickerBtn, color){
		var colorValue = (color != "" && color != null) ? color.substr(1) : color;
		this.setColorPickerValue(colorPickerBtn, colorValue, color);
		
		if($(colorPickerBtn).parent().attr("name") == "outerBorder"){
			this.setColorPickerValue($("#" + this.containerId).find("div[name='leftBorder']").find(".colorPickerBtn"), colorValue, color);
			this.setColorPickerValue($("#" + this.containerId).find("div[name='rightBorder']").find(".colorPickerBtn"), colorValue, color);
			this.setColorPickerValue($("#" + this.containerId).find("div[name='topBorder']").find(".colorPickerBtn"), colorValue, color);
			this.setColorPickerValue($("#" + this.containerId).find("div[name='bottomBorder']").find(".colorPickerBtn"), colorValue, color); 
		}
	}
	
	this.setColorPickerValue = function(colorPickerBtn, colorValue, color){
		var showText = "";
		if(colorValue == null){
			showText = "未指定";
		}
		else if(colorValue == ""){
			showText = "";
		}
		else{
			showText = colorValue;
		}
		$(colorPickerBtn).html(showText);
		$(colorPickerBtn).attr("colorValue", colorValue).css("background-color", color);
	}
	
	this.initColorPicker = function(){ 
		var colorpicker = null; 
		var allColorPickerBtns = $("#" + this.containerId).find(".colorPickerBtn");
		KindEditor(allColorPickerBtns).bind('click', function(e) {
			if (colorpicker) {
				colorpicker.remove();
				colorpicker = null;
			}
			var colorPickerBtn = this;
			e.stopPropagation(); 
			var colorpickerPos = KindEditor(this).pos();
			colorpicker = KindEditor.colorpicker({
				x : colorpickerPos.x,
				y : colorpickerPos.y + KindEditor(this).height(),
				z : 10000,
				selectedColor : 'default',
				noColor : '无颜色',
				click : function(color) {
					that.setBorderStyleColorValue(colorPickerBtn, color);
					colorpicker.remove();
					colorpicker = null;
				}
			});
		});  
		KindEditor("#" + this.containerId).click(function() {
			if (colorpicker) {
				colorpicker.remove();
				colorpicker = null;
			}
		});
	} 
	
	this.getCssValues = function(){
		var cssStyle = {};
		cssStyle.outerBorderStyle = this.getBorderStyleShowValues("outerBorder");
		cssStyle.innerBorderStyle = this.getBorderStyleShowValues("innerBorder");
		cssStyle.leftBorderStyle = this.getBorderStyleShowValues("leftBorder");
		cssStyle.rightBorderStyle = this.getBorderStyleShowValues("rightBorder");
		cssStyle.topBorderStyle = this.getBorderStyleShowValues("topBorder");
		cssStyle.bottomBorderStyle = this.getBorderStyleShowValues("bottomBorder");
		
		var fontFamily = $("#" + this.containerId).find("div[name='fontFamily']").find(".fontFamilyBtn").combobox("getValue");
		if(fontFamily != ""){
			cssStyle.fontFamily = fontFamily;
		}
		var fontSize = $("#" + this.containerId).find("div[name='fontSize']").find(".fontSizeBtn").combobox("getValue");
		if(fontSize != ""){
			cssStyle.fontSize = fontSize;
		}
		var fontStyle = $("#" + this.containerId).find("div[name='fontStyle']").find(".fontStyleBtn").combobox("getValue");
		if(fontStyle != ""){
			cssStyle.fontStyle = fontStyle;
		} 
		var textHAlign = $("#" + this.containerId).find("div[name='textHAlign']").find(".textHAlignBtn").combobox("getValue");
		if(textHAlign != ""){
			cssStyle.textHAlign = textHAlign;
		} 
		var textVAlign = $("#" + this.containerId).find("div[name='textVAlign']").find(".textVAlignBtn").combobox("getValue");
		if(textVAlign != ""){
			cssStyle.textVAlign = textVAlign;
		} 
		var backgroundColor = $("#" + this.containerId).find("div[name='backgroundColor']").find(".colorPickerBtn").attr("colorValue");
		if(backgroundColor != ""){
			cssStyle.backgroundColor = backgroundColor;
		}
		var color = $("#" + this.containerId).find("div[name='color']").find(".colorPickerBtn").attr("colorValue");
		if(color != ""){
			cssStyle.color = color;
		}
		return cssStyle;
	}
	
	this.init(p);
}