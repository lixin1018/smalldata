$(document).ready(function(){
	initSelectStylePage();
});

function initSelectStylePage(){
 	var createByImportExcelBtnId = "createByImportExcelBtnId";
 	var createByBlankDefinitionBtnId = "createByBlankDefinitionBtnId";
 	
 	$("#" + createByImportExcelBtnId).click(function(){
 		window.location = "uploadExcel.jsp";
 		return false;
 	});
 	
 	$("#" + createByBlankDefinitionBtnId).click(function(){ 
 		createNewBlankExcelGrid();
 		return false;
 	});
}

//创建新的空模板
function createNewBlankExcelGrid(){ 
	var requestParam = {
		defaultRowCount: 40, 
		defaultColumnCount: 15, 
		defaultRowHeight: 23, 
		defaultColumnWidth: 80
	};	
	serverAccess.request({
		serviceName:"excelGridNcpService", 
		funcName:"createNewBlankExcelGrid", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){				
			var definitionName = obj.result.excelGridVersionJson.name;
			var excelGridId = obj.result.excelGridVersionJson.excelGridId;
			var excelGridVersionId = obj.result.excelGridVersionJson.excelGridVersionId;
			var editPageUrl = "../excelGrid/definition/editDefinition.jsp?name=" + encodeURIComponent(definitionName) + "&excelgrid=" + excelGridId + "&version=" + excelGridVersionId;
			parent.iocClient.mainPageTab().showPage(excelGridVersionId, "编辑模板:" + definitionName, editPageUrl, true);
		}
	}); 
	return false;
}