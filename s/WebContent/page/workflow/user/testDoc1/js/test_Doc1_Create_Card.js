var docWin = null;
var mainCardWin = null;
$(document).ready(function(){ 			
	var initParam = window.parent.multiStyleWinInitParam; 
	initParam.containerId = "testCardContainer";
	initParam.submitBtnId = "submitBtnId";
	initParam.showLogBtnId = "showLogBtnId";
	initParam.getBackBtnId = "getBackBtnId";
	initParam.showStatusDivId = "showStatusDivId"; 
	initParam.windowType = "create";
	initParam.sheetModel = sheetModels[initParam.sheetName];
	docWin = new NcpDocumentMultiStyleSheetWin(initParam); 
	docWin.show();	
	mainCardWin = docWin.sheetCtrl.getMainCardCtrl();
	
	$("#batchImportDetailBtnId").click(function(){		
		if(mainCardWin.currentStatus != formStatusType.browse){
			msgBox.alert({info: "请先保存单据."});
		}
		else{	
			showUploadFileWindow({
				maxFileSizeM: 2,
				afterFileUploadedFunc: afterUploadDetailFile,
				fileExt: "*.xlsx;",
				fileDes: "Excel文件(*。xlsx)",
				allowMultiUpload: false,
				title: "请选择文件"
			}); 
		}
	});
});  

function afterUploadDetailFile(event, data){
	alert("afterUploadDetailFile");
}

	
var uploadFileWindow = null;
function showUploadFileWindow(p){
	if(uploadFileWindow == null){			
		uploadFileWindow = new UploadFileWindow({});
	} 
	uploadFileWindow.show({
		contentDivId: "uploadWindowDivId",
		maxFileSizeM: p.maxFileSizeM,
		afterFileUploadedFunc: p.afterFileUploadedFunc,
		fileExt: p.fileExt,
		fileDes: p.fileDesc,
		allowMultiUpload: p.allowMultiUpload,
		title: p.title
	});
}