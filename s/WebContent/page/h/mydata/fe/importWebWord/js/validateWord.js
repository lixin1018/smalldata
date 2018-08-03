function initValidateWordPage(){
	var args = cmnPcr.getQueryStringArgs();
	var accessoryId = args["aid"];
	if(accessoryId == null){
		msgBox.alert({info: "网页地址错误"});
	}
	else{
		var requestParam = {aid: accessoryId};
		serverAccess.request({
			serviceName:"/webWordFileNcpService", 
			funcName:"createPreviewFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){			
				var fileId = obj.result.fileId;
				$("#validateWordBtnDivId").text("点击查看文件");
				$("#validateWordBtnDivId").click(function(){
					var editPageUrl = "../webWordViewer/webWordViewer.jsp?did=" + fileId;
	 				window.location = editPageUrl;
				});
				//$("#previewContainerDivId").height((sheetNames.length > 6 ? 6 * 47 : sheetNames.length * 47) + 5);
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	} 
}; 

$(document).ready(function(){
	initValidateWordPage();
});