function changeUserInfo(p){
	var name = $("#"+p.nameInputId).val(); 
	var email = $("#"+p.emailInputId).val(); 
	var password = $("#"+p.pwdInputId).val(); 

	$("#" + p.alertNameInputId).empty(); 
	$("#" + p.alertEmailInputId).empty(); 
	$("#" + p.alertPwdInputId).empty(); 
	
	var canChange= true; 
	if(name == ""){
		$("#" + p.alertNameInputId).text("请输入姓名"); 
		canChange = false;
	}
	if(email == ""){
		$("#" + p.alertEmailInputId).text("请输入邮箱地址"); 
		canChange = false;
	}
	else if(!isEmail(email)){
		$("#" + p.alertEmailInputId).text("请输入正确的邮箱地址"); 
		canChange = false;
	}
	if(password == ""){
		$("#" + p.alertPwdInputId).text("请输入此账号的密码"); 
		canChange = false;
	}
	 
	if(canChange){
		serverAccess.request({
			serviceName:"userNcpService",
			funcName:"changeUserInfo",
		    args:{requestParam:cmnPcr.jsonToStr({
		    	name: encodeURIComponent(name),
		    	email: encodeURIComponent(email),
		    	password: encodeURIComponent(password)
	    	})}, 
			successFunc:function(obj){
				location.href = "../grzx/grzx.jsp";
			},
			failFunc:function(obj){ 
				if(obj.code == "changeUserInfo_003"){
					$("#" + p.alertPwdInputId).text(obj.message); 
				}
				else if(obj.code == "changeUserInfo_002"){
					$("#" + p.alertEmailInputId).text(obj.message); 
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

function getUserInfo(){	 
	var requestParam = { };	
	serverAccess.request({
		serviceName:"userNcpService", 
		funcName:"getUserInfo", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){				
			var email = decodeURIComponent(obj.result.email);	
			var userName = decodeURIComponent(obj.result.name);
			showUserInfo(userName, email);
		}
	});  
	return false;		
}

function showUserInfo(userName, email){	 
	$("#nameInputId").val(userName);  
	$("#emailInputId").val(email); 
}

$(document).ready(function(){ 	

	getUserInfo();

	$("#changeUserInfoBtnId").click(function(){
		changeUserInfo({
			nameInputId:"nameInputId",
			emailInputId:"emailInputId",
			pwdInputId:"pwdInputId",
			alertNameInputId:"alertNameInputId",
			alertEmailInputId:"alertEmailInputId",
			alertPwdInputId:"alertPwdInputId",
			containerDiv:"innerDiv", 
			changePwdtn:"changePwdtn"
		});
	});	
});