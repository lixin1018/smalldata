
$(document).ready(function(){ 
	$("#convertBtnId").click(function(){		
		convert({
			fromFilePathId: "fromFilePath",
			toFilePathId: "toFilePath"
		});
	});
});
  
function convert(p){
	var fromFilePath = cmnPcr.trim($("#" + p.fromFilePathId).val());
	var toFilePath = cmnPcr.trim($("#" + p.toFilePathId).val());
	if(fromFilePath.length == 0){
		msgBox.alert({info: "请输入词库文件路径"});
	}
	else if(toFilePath.length == 0){
		msgBox.alert({info: "请输出TXT文件路径"});
	}
	else{ 
		var requestParam = {
			toFilePath: toFilePath,
			fromFilePath: fromFilePath
		};
		serverAccess.request({
			serviceName:"sougouScelNcpService", 
			funcName:"convertToTxt", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){ 
				msgBox.alert({info: "转换成功!"});
			}
		});  
	}
}