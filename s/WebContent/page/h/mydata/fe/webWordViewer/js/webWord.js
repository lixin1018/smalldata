var txtl = null; 
$(document).ready(function(){
	var queryStrings = cmnPcr.getQueryStringArgs(); 
	fileId = queryStrings["did"];   
	
	txtl = new DataFileWebWordLayout({
			bodyId: "bodyContainerId",   
			containerId: "previewContainerId", 
			titleContainerId: "titleContainerId"
		});
	txtl.loadFromServer({
		fileId: fileId,  
		afterLoadFunc: function(){ 
			txtl.show({});
			showTitle();
		}
	});
	
	$("#downloadFileBtnId").click(function(){ 
		txtl.downloadFile(); 
	}); 
});  

function showTitle(){
	$("#" + txtl.titleContainerId).text(txtl.file.name); 
}