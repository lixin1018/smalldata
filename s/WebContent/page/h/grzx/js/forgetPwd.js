function forgetPwd(p){
	var email = $("#"+p.emailTb).val(); 

	$("#" + p.alertEmailTb).empty(); 
	
	var canReg = true; 
	if(email == ""){
		$("#" + p.alertEmailTb).text("请输入Email地址"); 
		canReg = false;
	}
	else if(!isEmail(email)){
		$("#" + p.alertEmailTb).text("Email地址填写有误"); 
		canReg = false;
	} 
	 
	if(canReg){
		serverAccess.request({
			serviceName:"dataHelperUserNcpService",
			funcName:"forgetPwd",
		    args:{requestParam:cmnPcr.jsonToStr({
		    	email: encodeURIComponent(email)
	    	})}, 
			successFunc:function(obj){
				var tid = obj.result.id;
				location.href = "forgetChangePwd.jsp?tid=" + tid;
			},
			failFunc:function(obj){ 
				if(obj.code == "forgetpwd_email"){
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

function isEmail(str){
   var reg = /^\w+([._-]\w+)*@(\w+\.)+\w+$/;
   return reg.test(str);
}

$(document).ready(function(){ 	
	$("#forgetPwdBtn").click(function(){
		forgetPwd({
			emailTb:"emailText",
			alertEmailTb:"alertEmailText",
			containerDiv:"innerDiv", 
			forgetPwdtn:"forgetPwdtn"
		});
	});	
});