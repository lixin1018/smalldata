//登录方法  codeTb,pwdTb,containerDiv,alertDiv
function login(p){
 
	var code =	$("#"+p.codeTb).val();
	var pwd = $("#"+p.pwdTb).val();
	
	if(code == ""){
		$("#" + p.alertDiv).text("请输入用户名"); 
		return;
	}
	if(pwd == ""){
		$("#" + p.alertDiv).text("请输入密码"); 
		return;
	}
	 
	serverAccess.request({
		serviceName:"userNcpService",
		funcName:"login",
	    args:{requestParam: cmnPcr.jsonToStr({
	    	code: encodeURIComponent(code),
	    	password: encodeURIComponent(pwd)
    	})}, 
		successFunc:function(obj){
			var args = cmnPcr.getQueryStringArgs();
			var loginRedirectUrl = args["loginRedirectUrl"];	
			if(loginRedirectUrl != null && loginRedirectUrl != ""){
				loginRedirectUrl = decodeURIComponent(loginRedirectUrl);
				location.href = loginRedirectUrl;
			}
			else{
				location.href = "index.jsp";
			}
		},
		failFunc:function(obj){
			$("#" + p.alertDiv).text(obj.message);
		},
		waitingBarParentId:p.containerDiv
	});
}

$(document).ready(function(){ 

	//判断浏览器版本
	cmnPcr.checkBrowserVersion("../../");

	$("#userCodeText").focus();
	
	$("#userCodeText").keydown(function(){
		if(event.keyCode==13){
			$("#loginBtn").click();
		}
	});
	
	$("#userPasswordText").keydown(function(){
		if(event.keyCode==13){
			$("#loginBtn").click();
		}
	});
		
	$("#loginBtn").click(function(){
		login({
			codeTb:"userCodeText",
			pwdTb:"userPasswordText",
			saveChb:"",
			autoChb:"",
			containerDiv:"innerDiv",
			alertDiv:"alertDiv",
			loginBtn:"loginBtn"
		});
	});
});