$(document).ready(function(){ 
	
	getUserInfo();
	
});   

function getUserInfo(){	 
	var requestParam = { };	
	serverAccess.request({
		serviceName:"userNcpService", 
		funcName:"getUserInfo", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){				
			var userCode = decodeURIComponent(obj.result.code);	
			var userName = decodeURIComponent(obj.result.name);
			showUserInfo(userCode, userName);
		}
	});  
	return false;		
}

function showUserInfo(userCode, userName){	 
	$("#userNameDivId").text(userName);  
	$("#userCodeDivId").text(userCode); 
}