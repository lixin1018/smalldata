var dataDFLayout = null;
$(document).ready(function(){ 
	
	var queryStrings = cmnPcr.getQueryStringArgs();
	var dirId = queryStrings["did"];
	if(dirId == null || dirId.length == 0){
		dirId = $("#rootDirId").val();
	}
	dataDFLayout = new DataDirAndFileLayout();
	dataDFLayout.show({
		dirId: dirId,
		parentDivId: "innerDiv",
		selectDirDivId: "selectDir",
		selectFileDivId: "selectFile",
		sendFileDivId: "sendFile",
		selectUserDivId: "selectUser",
		selectFileTypeDivId: "selectFileType"
	});
	
	
});