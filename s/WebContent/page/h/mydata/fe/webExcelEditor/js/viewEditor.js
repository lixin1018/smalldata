function ViewEditorWindow(p){
	var that = this;
	this.containerId = null;
	this.form = null;
	this.afterOkFunction = null;
	
	this.hasGridLine = true;
	this.hasEditBar = true;
	this.hasSheetTitle = true;
	this.hasColumnRowTitle = true;
	this.hasPageTitle = true;
	
	this.init = function(p){
		this.afterOkFunction = p.afterOkFunction;
		this.initForm(p); 
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

		$("#" + titleId).text("视图设置");
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer; 
	
		$("#" + cancelBtnId).click(function(){ 
			that.form.hide(); 
		});
		
		$("#" + okBtnId).click(function(){	 
			that.afterOkFunction(that.getValues());
			that.form.hide();  
		});
		
	}
	
	this.show = function(p){
		if(this.form.isHidden){
			this.form.show();
		}
		this.hasGridLine = p.hasGridLine;
		this.hasEditBar = p.hasEditBar;
		this.hasSheetTitle = p.hasSheetTitle; 
		this.hasColumnRowTitle = p.hasColumnRowTitle; 
		this.hasPageTitle = p.hasPageTitle; 
		
		this.refreshShowValues();		 
	}
	
	this.refreshShowValues = function(){
		this.refreshCheckboxValue("hasGridLineCheckbox", this.hasGridLine);
		this.refreshCheckboxValue("hasEditBarCheckbox", this.hasEditBar);
		this.refreshCheckboxValue("hasSheetTitleCheckbox", this.hasSheetTitle);
		this.refreshCheckboxValue("hasColumnRowTitleCheckbox", this.hasColumnRowTitle);
		this.refreshCheckboxValue("hasPageTitleCheckbox", this.hasPageTitle);
	}
	
	this.refreshCheckboxValue = function(checkboxName, value){
		if(value){
			$("input[name='" + checkboxName + "']").attr("checked", "checked");
		}
		else{
			$("input[name='" + checkboxName + "']").removeAttr("checked");
		}
	}
	
	this.getCheckboxValue = function(checkboxName){
		return $("input[name='" + checkboxName + "']").attr("checked") == "checked";
	}
	  
	this.getValues = function(){
		var obj = {
			hasGridLine: this.getCheckboxValue("hasGridLineCheckbox"),
			hasEditBar: this.getCheckboxValue("hasEditBarCheckbox"),
			hasSheetTitle: this.getCheckboxValue("hasSheetTitleCheckbox"),
			hasColumnRowTitle: this.getCheckboxValue("hasColumnRowTitleCheckbox"),
			hasPageTitle: this.getCheckboxValue("hasPageTitleCheckbox")
		}; 
		return obj;
	}
	
	this.init(p);
}