function forgetChangePwd(p){
	var userId = $("#"+p.userIdTb).val(); 
	var validateCode = $("#"+p.validateCodeTb).val(); 
	var newPwd = $("#"+p.newPwdTb).val(); 
	var newPwdConfirm = $("#"+p.newPwdConfirmTb).val(); 

	$("#" + p.alertValidateCodeTb).empty(); 
	$("#" + p.alertNewPwdTb).empty(); 
	$("#" + p.alertNewPwdConfirmTb).empty(); 
	
	var canReg = true; 
	if(validateCode == ""){
		$("#" + p.alertValidateCodeTb).text("请输入验证码"); 
		canReg = false;
	}
	if(newPwd == ""){
		$("#" + p.alertNewPwdTb).text("请输入新密码"); 
		canReg = false;
	} 
	else if(newPwd != newPwdConfirm){
		$("#" + p.alertNewPwdConfirmTb).text("两次输入的密码不同"); 
		canReg = false;
	} 
	 
	if(canReg){
		serverAccess.request({
			serviceName:"dataHelperUserNcpService",
			funcName:"forgetChangePwd",
		    args:{requestParam:cmnPcr.jsonToStr({
		    	userId: encodeURIComponent(userId),
		    	validateCode: encodeURIComponent(validateCode),
		    	newPwd: encodeURIComponent(newPwd)
	    	})}, 
			successFunc:function(obj){
				location.href = "changePwdSucceed.jsp";
			},
			failFunc:function(obj){ 
				if(obj.code == "forgetchangepwd_validateCode"){
					$("#" + p.alertValidateCodeTb).text(obj.message); 
				}
				else if(obj.code == "forgetchangepwd_newPwd"){
					$("#" + p.alertNewPwdTb).text(obj.message); 
				}
				else {
					msgBox.alert({info: obj.message});
				}	
			},
			waitingBarParentId:p.containerDiv
		});
	}
}

$(document).ready(function(){ 	
	$("#forgetChangePwdBtn").click(function(){
		forgetChangePwd({
			userIdTb:"userIdText",
			validateCodeTb:"validateCodeText",
			newPwdTb:"newPwdText",
			newPwdConfirmTb:"newPwdConfirmText",
			alertValidateCodeTb:"alertValidateCodeText",
			alertNewPwdTb:"alertNewPwdText",
			alertNewPwdConfirmTb:"alertNewPwdConfirmText",
			containerDiv:"innerDiv", 
			forgetChangePwdtn:"forgetChangePwdtn"
		});
	});	
});