$(document).ready(function(){ 
	$("#getStringFromImageBtnId").click(function(){
		var filePath = $("#imageFilePathId").val();
		getStringFromImage({
			filePath: filePath
		});
	});
}); 


function getStringFromImage(p){
	serverAccess.request({
		serviceName:"ocrNcpService",
		funcName:"getStringFromImage",
	    args:{requestParam:cmnPcr.jsonToStr({filePath: p.filePath})}, 
		successFunc:function(obj){  
			$("#resultStringId").val( obj.result.value );  
			msgBox.error({title:"提示", info:"识别完成"});
		},
		failFunc:function(obj){
			msgBox.error({title:"提示", info:obj.message});
		}
	}); 
}