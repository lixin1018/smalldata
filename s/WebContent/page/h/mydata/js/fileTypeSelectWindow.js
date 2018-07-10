function FileTypeSelectWindow(){
	var that = this; 
	this.form = null; 
	  
	this.afterOkFunction = null; 

	this.containerId = null;
	
	this.init = function(p){	
		var width = $("#" + p.contentDivId).width();
		var height = $("#" + p.contentDivId).height();
		var popContainer = new PopupContainer({
			width : width,
			height : height,
			top : 100
		}); 
		
		popContainer.show(); 
		var winId = cmnPcr.getRandomValue();
		that.containerId = popContainer.containerId; 
		$("#" + p.contentDivId).appendTo("#" + that.containerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer;  
	
		$("#" + p.contentDivId).find("img[name='selectCloseImage']").click(function(){
			that.form.hide();
		});   
	
		$("#" + p.contentDivId).find(".fileTypeItemInnerDiv").click(function(){
			var typeName = $(this).attr("typeName");
			that.selectFileType(typeName);
		});   
		
		$("#" + p.contentDivId).find("input[name='selectFileTypeBtn']").click(function(){ 
			var fileName = that.getInputFileName();
			var typeName = that.getFileType();
			var extType = that.getExeType();
			if(fileName.length == 0){
				msgBox.alert({info: "请输入文件名"});
			}
			else if(typeName == null){ 
				msgBox.alert({info: "请选择文件类型"});
			}
			else{				
				that.afterOkFunction({
					fileName: fileName,
					fileType: typeName, 
					closeWin: function(){
						that.close();
					}
				});
			} 
			return false;
		});
	}
	
	this.getInputFileName = function(){
		return $("#" + that.containerId).find("input[name='fileNameInput']").val();
	}
	
	this.getFileType = function(){
		var typeElements = $("#" + that.containerId).find(".fileTypeItemInnerDivSelected");
		if(typeElements.length > 0){
			return $(typeElements[0]).attr("typeName");
		}
		else{
			return null;
		}
	}
	
	this.getExeType = function(){
		var typeElements = $("#" + that.containerId).find(".fileTypeItemInnerDivSelected");
		if(typeElements.length > 0){
			return $(typeElements[0]).attr("exeType");
		}
		else{
			return null;
		}
	}
	
	this.selectFileType = function(typeName){
		$("#" + that.containerId).find(".fileTypeItemInnerDiv").removeClass("fileTypeItemInnerDivSelected");
		var typeElements = $("#" + that.containerId).find("div[typeName='" + typeName + "']");
		if(typeElements.length > 0){
			$(typeElements[0]).addClass("fileTypeItemInnerDivSelected");
		}
	}
	
	this.close = function(){
		that.form.hide();
	} 
	 
	//显示
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
    	if(that.form != null){
    		that.form.show(p);
    	}
    	else{ 
    		that.init(p);
		}
		this.refreshValues(p);
	} 
	
	this.refreshValues = function(p){ 
		$("#" + this.containerId).find("div[name='selectTitle']").text(p.title);
		var fileName = "新建文件" + cmnPcr.datetimeToStr(new Date(), "yyyyMMddHHmmss");
		$("#" + this.containerId).find("input[name='fileNameInput']").val(fileName);
	} 
}