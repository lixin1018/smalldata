function UploadFileWindow(){
	var that = this; 
	this.form = null;
	 
	this.maxFileSizeM = 2; 
	this.afterFileUploadedFunc = null;
	this.fileExt = "";
	this.fileDesc = "";
	this.allowMultiUpload = false;
	
	this.titleDivId = null;    
	
	this.init = function(p){		
		var popContainer = new PopupContainer({
			width : 500,
			height : 400,
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
	 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:340px;font-size:11px;text-align:center;overflow:auto;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"关 闭\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml);
 
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer;
		that.titleDivId = titleId;
	
		$("#" + cancelBtnId).click(function(){
			that.form.hide(); 
		});  
		
		var initParam = {
			onSelect: function(event, queueId, fileObj){
				$("#selectErrorDivId").css("display", "none"); 
			
				if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("文件大小不能超过" + that.maxFileSizeM + "M");
				}
			},
			onAllComplete: function(event, data){ 
				that.afterFileUploadedFunc(event, data);
			}
		};
		
		$("#selectFileBtnId").uploadify({
	       'swf': uploadify + "/uploadify.swf",
	       'uploader': basePath + '/accessory/uploadFile',//后台处理的请求
	       'cancelImage': uploadify + "/cancel.png",
	       'buttonImage':  uploadify + "/browse.png",  
	       'method': "get", 
	       'queueID': "fileQueueDivId",
	       'auto': false,
	       'multi': that.allowMultiUpload, 
	       'sizeLimit': that.maxFileSizeM * 1024 * 1024, 
	       'fileTypeExts': that.fileExt,
	       'fileTypeDesc': that.fileDesc, 
	       
	       'scriptData': { filterType: "excelGrid_UploadExcelFileDefinition", filterValue: ""},
	       'onError': function(event, queueID, fileObj) { 
	    	   	if(initParam.onError != undefined){
	    	   		return initParam.onError(event, queueID, fileObj);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       },
	       'onComplete': function(event, queueId, fileObj, response, data) {
	    	   	if(initParam.onComplete != undefined){
	    	   		return initParam.onComplete(event, queueId, fileObj, response, data);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       },
	       'onAllComplete': function(event, data) { 
	    	   	if(initParam.onAllComplete != undefined){
	    	   		return initParam.onAllComplete(event, data);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       },
	       'onSelect': function(event, queueId, fileObj) { 
	    	   	if(initParam.onSelect != undefined){
	    	   		return initParam.onSelect(event, queueId, fileObj);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       },
	       'onProgress ':function(event, queueId, fileObj, data){
	    	   	if(initParam.onProgress != undefined){
	    	   		return initParam.onProgress(event, queueId, fileObj, data);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       },
	       'onOpen':function(event, queueId, fileObj){
	    	   	if(initParam.onProgress != undefined){
	    	   		return initParam.onProgress(event, queueId, fileObj, data);
	    	   	}
	    	   	else{
	           		return true;
	    	   	}
	       }
		});
		
		$("#uploadExcelBtnDivId").click(function(){ 
			if($("#selectExcelBtnId").uploadifySettings("queueSize") > 0){
				$("#selectExcelBtnId").uploadifyUpload();
			}
			else{
				msgBox.alert({info: "请点击\"浏览\"按钮, 选择文件"});
			}
			return false;
		});
	}
	 
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
    	if(that.form != null){
    		that.form.show();
    	}
    	else{ 
    		that.init(p);
		} 
		this.refreshValues(p);
	}
	
	this.refreshValues = function(p){
		this.maxFileSizeM = p.maxFileSizeM;
		this.afterFileUploadedFunc = p.afterFileUploadedFunc;
		this.fileExt = p.fileExt;
		this.fileDesc = p.fileDesc;
		this.allowMultiUpload = p.allowMultiUpload; 
		$("#selectFileBtnId").uploadify("settings", "sizeLimit", this.maxFileSizeM * 1024 * 1024);
		$("#selectFileBtnId").uploadify("settings", "multi", this.allowMultiUpload);
		$("#selectFileBtnId").uploadify("settings", "fileTypeExts", this.fileExt);
		$("#selectFileBtnId").uploadify("settings", "fileTypeDesc", this.fileDesc);
		$("#selectFileBtnId").uploadify("settings", "scriptData", {filterType: p.filterType, filterValue: p.filterValue});
		$("#selectErrorDivId").css("display", "none"); 
		$("#" + this.titleDivId).text(p.title);
		$("#selectFilePromptDivId").text("请选择要上传的文件(文件大小不能超过" + this.maxFileSizeM + "M)"); 
	}
} 

