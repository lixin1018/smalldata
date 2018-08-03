var txtl = null; 
$(document).ready(function(){
	var queryStrings = cmnPcr.getQueryStringArgs(); 
	fileId = queryStrings["did"];   
	
	txtl = new DataFileTextLayout({
			bodyId: "bodyContainerId",   
			containerId: "textContainerId", 
			titleContainerId: "titleContainerId"
		});
	txtl.loadFromServer({
		fileId: fileId,  
		afterLoadFunc: function(){ 
			txtl.show({});
			showTitle();
		}
	});
	
	$("#saveInstanceBtnId").click(function(){ 
		txtl.saveToServer({
			afterSaveFunc:function(){
				showTitle();
			}
		}); 
	});
	
	$("#titleBtnId").click(function(){
		msgBox.htmlWindow({
			title: "标题",
			label: "请输入表格标题",
			text: txtl.file.name == null ? "" : txtl.file.name,
			type: "oneInputText",
			okFunction: function(p){
				txtl.file.name = p.text;
				showTitle();
				p.closeWin();
			} 
		});
	});
});  

function showTitle(){
	$("#" + txtl.titleContainerId).text(txtl.file.name); 
}