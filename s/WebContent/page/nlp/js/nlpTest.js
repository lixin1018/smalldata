
$(document).ready(function(){ 
	$("#segmentBtnId").click(function(){		
		segment({
			textInputId: "textInputId",
			wordsShowId: "wordsShowId"
		});
	});

});
  
function segment(p){
	var text = cmnPcr.trim($("#" + p.textInputId).val());
	if(text.length == 0){
		msgBox.alert({info: "请输入语句"});
	}
	else{ 
		var requestParam = {
			text: text
		};
		serverAccess.request({
			serviceName:"nlpNcpService", 
			funcName:"segment", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var words = obj.result.words; 
				var showStr = "";
				for(var i = 0; i < words.length; i++){
					showStr += (words[i] + "; ");
				}
				$("#" + p.wordsShowId).val(showStr);
			}
		});  
	}
}