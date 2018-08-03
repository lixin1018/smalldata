function initUploadWordPage(){
	var maxFileSize = 1024 * 1024 * 20;
	var exeId = $("#exeId").val();
	
	if(cmnPcr.checkHtml5()){
		var initParam = {
			onAddQueueItem: function(fileObj){
				$("#selectErrorDivId").css("display", "none"); 
			
				if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("文件大小不能超过20M");
				}
			},
			onComplete: function(fileObj, data){
				var responseObj = cmnPcr.strToJson(data);
				var accessoryId = responseObj[0].result.ids[0];
				window.location = "validateWord.jsp?aid=" + accessoryId + "&exeid=" + exeId;
			},
			onUpload: function(filesToUpload){
				if(filesToUpload == 0){ 
					msgBox.alert({info: "请点击\"浏览\"按钮, 选择Word文件"});
				} 
				return true;
			}
		};
		$("#selectWordBtnId").uploadifive({ 
			'uploadScript': basePath + '/accessory/uploadFile?filterType=ImportWebWord&filterValue=',//后台处理的请求 
			'buttonText':  "选择文件...",  
			'method': "post", 
			'queueID': "fileQueueDivId",
			'auto': false,
			'multi': false,
			//修改文件大小的限制  
			'fileSizeLimit': maxFileSize,
				
			//增加了文件类型的限制 modified by lixin 20120905
			'fileType': ["application\/pdf","application\/msword","application\/vnd.openxmlformats-officedocument.wordprocessingml.document","application\/excel","application\/vnd.ms-excel","application\/x-excel","application\/x-msexcel","application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text\/plain","application\/vnd.oasis.opendocument.text","application\/vnd.oasis.opendocument.spreadsheet"], 
				 
			'queueSizeLimit': 1,
			'width': 92,
			'height': 23, 
				   
			//'formData': { "filterType": "ImportWebWord", "filterValue": ""}, 
			'onUploadComplete': function(fileObj, data) {
				if(initParam.onComplete != undefined){
					return initParam.onComplete(fileObj, data);
				}
				else{
					return true;
				}
			}, 
			'onAddQueueItem': function(file) { 
				if(initParam.onAddQueueItem != undefined){
					return initParam.onAddQueueItem(file);
				}
				else{
					return true;
	    	   	}
			},
			'onUpload': function(filesToUpload){
				if(initParam.onUpload != undefined){
					return initParam.onUpload(filesToUpload);
				}
				else{
					return true;
	    	   	}
			}
		});
		
		$("#uploadWordBtnDivId").click(function(){
			$("#selectWordBtnId").uploadifive("upload"); 
			return false;
		});
	}
	else{	
		var initParam = {
			onSelect: function(event, queueId, fileObj){
				$("#selectErrorDivId").css("display", "none"); 
			
				if(fileObj.size > maxFileSize){
					$("#selectErrorDivId").css("display", "block");
					$("#selectErrorDivId").text("文件大小不能超过20M");
				}
			},
			onComplete: function(event, queueId, fileObj, response, data){
				var responseObj = cmnPcr.strToJson(response);
				var accessoryId = responseObj[0].result.ids[0];
				window.location = "validateWord.jsp?aid=" + accessoryId + "&exeid=" + exeId;
			}
		};
		$("#selectWordBtnId").uploadify({
		       'uploader': uploadify + "/uploadify.swf",
		       'script': basePath + '/accessory/uploadFile',//后台处理的请求
		       'cancelImg': uploadify + "/cancel.png",
		       'buttonImg':  uploadify + "/browse.png",  
		       'method': "get",
		       'rollover': false,
		       'queueID': "fileQueueDivId",
		       'auto': false,
		       'multi': false,
		       //修改文件大小的限制  
		       'sizeLimit': maxFileSize,
		
		       //增加了文件类型的限制 modified by lixin 20120905
		       'fileExt': "*.doc;*.docx;",
		       'fileDesc': "Word文档",
		
		       'simUploadLimit': 1,
		       'width': 92,
		       'height': 23, 
		       
		       'scriptData': { filterType: "ImportWebWord", filterValue: ""},
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
		
		$("#uploadWordBtnDivId").click(function(){ 
			if($("#selectWordBtnId").uploadifySettings("queueSize") > 0){
				$("#selectWordBtnId").uploadifyUpload();
			}
			else{
				msgBox.alert({info: "请点击\"浏览\"按钮, 选择Word文件"});
			}
			return false;
		});
	}
}; 

$(document).ready(function(){
	initUploadWordPage();
});