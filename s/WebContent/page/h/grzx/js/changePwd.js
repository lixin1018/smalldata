//登录方法  codeTb,pwdTb,containerDiv,alertDiv
function changePwd(p){
	var oldPwd = $("#"+p.oldPwdTb).val(); 
	var newPwd = $("#"+p.newPwdTb).val(); 
	var newPwdConfirm = $("#"+p.newPwdConfirmTb).val(); 

	$("#" + p.alertOldPwdTb).empty(); 
	$("#" + p.alertNewPwdTb).empty(); 
	$("#" + p.alertNewPwdConfirmTb).empty(); 
	
	var canReg = true; 
	if(oldPwd == ""){
		$("#" + p.alertOldPwdTb).text("请输入原密码"); 
		canReg = false;
	}
	if(newPwd == ""){
		$("#" + p.alertNewPwdTb).text("请输入新密码"); 
		canReg = false;
	}
	else if(newPwd != newPwdConfirm){
		$("#" + p.alertNewPwdConfirmTb).text("两次输入的新密码不同"); 
		canReg = false;
	}
	 
	if(canReg){
		serverAccess.request({
			serviceName:"dataHelperUserNcpService",
			funcName:"changePwd",
		    args:{requestParam:cmnPcr.jsonToStr({
		    	oldPwd: encodeURIComponent(oldPwd),
		    	newPwd: encodeURIComponent(newPwd)
	    	})}, 
			successFunc:function(obj){
				location.href = "changePwdSucceed.jsp";
			},
			failFunc:function(obj){ 
				if(obj.code == "changepwd_newPwd"){
					$("#" + p.alertNewPwdTb).text(obj.message); 
				}
				else if(obj.code == "changepwd_oldPwd"){
					$("#" + p.alertOldPwdTb).text(obj.message); 
				}
				else {
					msgBox.alert({info: obj.message});
				}	
			},
			waitingBarParentId:p.containerDiv
		});
	}
} 

function isEmail(str){
   var reg = /^\w+([._-]\w+)*@(\w+\.)+\w+$/;
   return reg.test(str);
}

$(document).ready(function(){ 	
	$("#changePwdBtn").click(function(){
		changePwd({
			oldPwdTb:"oldPwdText",
			alertOldPwdTb:"alertOldPwdText",
			newPwdTb:"newPwdText",
			alertNewPwdTb:"alertNewPwdText",
			newPwdConfirmTb:"newPwdConfirmText",
			alertNewPwdConfirmTb:"alertNewPwdConfirmText",
			containerDiv:"innerDiv", 
			changePwdtn:"changePwdtn"
		});
	});	
});