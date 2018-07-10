function initValidateExcelPage(){ 

	var args = cmnPcr.getQueryStringArgs();
	var accessoryId = args["aid"];
	if(accessoryId == null){
		msgBox.alert({info: "网页地址错误"});
	}
	else{
		var requestParam = {accessoryId: accessoryId};
		serverAccess.request({
			serviceName:"/webExcelFileNcpService", 
			funcName:"getExcelSheetNames", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){				
				var sheetNames = obj.result.sheetNames;
				$("#sheetNameContainerDivId").empty();
				for(var i = 0; i < sheetNames.length; i++){
					var sheetName = decodeURIComponent(sheetNames[i]);
					var itemId = "sheetNameItem_" + i.toString();
					var itemHtml = "<div class=\"sheetNameItem\" id=\"" + itemId + "\"></div>";
					$("#sheetNameContainerDivId").append(itemHtml);
					$("#" + itemId).attr("sheetName", sheetName);
					$("#" + itemId).text((i + 1).toString() + ": " + sheetName);
				}
				$("#sheetNameContainerDivId").height((sheetNames.length > 6 ? 6 * 47 : sheetNames.length * 47) + 5);
				
				$(".sheetNameItem").click(function(){
					if($(this).hasClass("sheetNameItemSelected")){
						$(this).removeClass("sheetNameItemSelected");
					}
					else{
						$(this).addClass("sheetNameItemSelected");
					}
				});
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}

	$("#validateExcelSheetBtnDivId").click(function(){ 
		var selectSheetNameItems = $(".sheetNameItemSelected");
		if(selectSheetNameItems.length == 0){
			msgBox.alert({info: "请点击选择Sheet页名称"});
		}
		else{
			var sheetNames = new Array();
			for(var i = 0; i < selectSheetNameItems.length; i++){
				var selectSheetNameItem = selectSheetNameItems[i];
				var sheetName = $(selectSheetNameItem).attr("sheetName");
				sheetNames.push(sheetName);
			}
			
			var requestParam = {
				accessoryId: accessoryId, 
				sheetNames: sheetNames
			};
			
			serverAccess.request({
				serviceName:"webExcelFileNcpService", 
				funcName:"validateAndGenerateByUploadExcel", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){				 
					var fileId = obj.result.fileId;
					var editPageUrl = "../webExcelEditor/webExcelEditor.jsp?did=" + fileId;
	 				window.location = editPageUrl;
				} 
			});
		}
		return false;
	});
}; 

$(document).ready(function(){
	initValidateExcelPage();
});