//登录方法  codeTb,pwdTb,containerDiv,alertDiv
function reg(p){
 
	var code =	$("#"+p.codeTb).val();
	var pwd = $("#"+p.pwdTb).val();
	var pwdConfim = $("#"+p.pwdConfirmTb).val();
	var email = $("#"+p.emailTb).val();
	var imgCode = $("#"+p.imgCodeTb).val();
	
	$("#" + p.alertCodeTb).empty();
	$("#" + p.alertPwdTb).empty();
	$("#" + p.alertPwdConfirmTb).empty();
	$("#" + p.alertEmailTb).empty();
	$("#" + p.alertImgCodeTb).empty();
	
	var canReg = true;
	if(code == ""){
		$("#" + p.alertCodeTb).text("请输入账号"); 
		canReg = false;
	}
	
	if(pwd == ""){
		$("#" + p.alertPwdTb).text("请输入密码"); 
		canReg = false;
	}
	
	if(pwdConfim != pwd){
		$("#" + p.alertPwdConfirmTb).text("两次输入的密码不同"); 
		canReg = false;
	}
	
	if(email == ""){
		$("#" + p.alertEmailTb).text("请输入Email地址"); 
		canReg = false;
	}
	else if(!isEmail(email)){
		$("#" + p.alertEmailTb).text("Email地址填写有误"); 
		canReg = false;
	}
	
	if(imgCode == ""){
		$("#" + p.alertImgCodeTb).text("请输入图片验证码"); 
		canReg = false;
	}
	 
	if(canReg){
		serverAccess.request({
			serviceName:"dataHelperUserNcpService",
			funcName:"regUser",
		    args:{requestParam:cmnPcr.jsonToStr({
		    	code: encodeURIComponent(code), 
		    	password: encodeURIComponent(pwd), 
		    	imgCode: encodeURIComponent(imgCode), 
		    	email: encodeURIComponent(email)
	    	})}, 
			successFunc:function(obj){
				location.href = "regSucceed.jsp";
			},
			failFunc:function(obj){
				refreshImgCodeImage();
				if(obj.code == "reg_code"){
					$("#" + p.alertCodeTb).text(obj.message); 
				}
				else if(obj.code == "reg_password"){
					$("#" + p.alertPwdTb).text(obj.message); 
					refreshImgCodeImage();
				}
				else if(obj.code == "reg_imgcode"){
					$("#" + p.alertImgCodeTb).text(obj.message);
				}
				else if(obj.code == "reg_email"){
					$("#" + p.alertEmailTb).text(obj.message); 
				}
				else {
					msgBox.alert({info: obj.message});
				}	
			},
			waitingBarParentId:p.containerDiv
		});
	}
}

function refreshImgCodeImage(){
	$("#imgCodeImage").attr("src", "num.jsp?t=" + cmnPcr.datetimeToStr(new Date(), "yyyyMMddHHssSSS"));
}

function isEmail(str){
   var reg = /^\w+([._-]\w+)*@(\w+\.)+\w+$/;
   return reg.test(str);
}

$(document).ready(function(){ 	
	$("#regBtn").click(function(){
		reg({
			codeTb:"userCodeText",
			alertCodeTb:"alertUserCodeText",
			pwdTb:"userPasswordText",
			alertPwdTb:"alertUserPasswordText",
			pwdConfirmTb:"userPasswordConfirmText",
			alertPwdConfirmTb:"alertUserPasswordConfirmText",
			emailTb:"emailText",
			alertEmailTb:"alertEmailText",
			imgCodeTb:"imgCodeText",
			imgCodeImage:"imgCodeImage",
			alertImgCodeTb:"alertImgCodeText",
			containerDiv:"innerDiv", 
			regBtn:"regBtn"
		});
	});
	
	$("#imgCodeImage").click(function(){
		refreshImgCodeImage();
		return false;
	});
	
	refreshImgCodeImage();
	
});