function initUploadExcelPage(){
	var maxFileSize = 1024 * 1024 * 2;
	var initParam = {
		onSelect: function(event, queueId, fileObj){
			$("#selectErrorDivId").css("display", "none"); 
		
			if(fileObj.size > maxFileSize){
				$("#selectErrorDivId").css("display", "block");
				$("#selectErrorDivId").text("文件大小不能超过2M");
			}
		},
		onComplete: function(event, queueId, fileObj, response, data){
			var responseObj = cmnPcr.strToJson(response);
			var accessoryId = responseObj[0].result.ids[0];
			window.location = "validateExcel.jsp?aid=" + accessoryId;
		}
	};
	
	$("#selectExcelBtnId").uploadify({
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
	       'fileExt': "*.xls;*.xlsx;",
	       'fileDesc': "Excel文档",
	
	       'simUploadLimit': 1,
	       'width': 92,
	       'height': 23, 
	       
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
			msgBox.alert({info: "请点击\"浏览\"按钮, 选择Excel文件"});
		}
		return false;
	});
}; 

$(document).ready(function(){
	initUploadExcelPage();
});