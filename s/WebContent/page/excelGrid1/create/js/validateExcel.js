function initValidateExcelPage(){ 

	var args = cmnPcr.getQueryStringArgs();
	var accessoryId = args["aid"];
	if(accessoryId == null){
		msgBox.alert({info: "网页地址错误"});
	}
	else{
		var requestParam = {accessoryId: accessoryId};
		serverAccess.request({
			serviceName:"excelGridNcpService", 
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
					$(".sheetNameItem").removeClass("sheetNameItemSelected");
					$(this).addClass("sheetNameItemSelected");
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
			var selectSheetNameItem = selectSheetNameItems[0];
			var sheetName = $(selectSheetNameItem).attr("sheetName");
			
			var requestParam = {
				accessoryId: accessoryId, 
				sheetName: sheetName
			};
			
			serverAccess.request({
				serviceName:"excelGridNcpService", 
				funcName:"validateAndGenerateByUploadExcel", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){				
					var definitionName = obj.result.excelGridVersionJson.name;
					var excelGridId = obj.result.excelGridVersionJson.excelGridId;
					var excelGridVersionId = obj.result.excelGridVersionJson.excelGridVersionId;
					var editPageUrl = "../excelGrid/definition/editDefinition.jsp?name=" + encodeURIComponent(definitionName) + "&excelgrid=" + excelGridId + "&version=" + excelGridVersionId;
	 				parent.iocClient.mainPageTab().showPage(excelGridVersionId, "编辑模板:" + definitionName, editPageUrl, true);
				},
				failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
			});
		}
		return false;
	});
}; 

$(document).ready(function(){
	initValidateExcelPage();
});