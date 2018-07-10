//登录方法  codeTb,pwdTb,saveChb,autoChb，containerDiv
function login(p){
 
	var code =	$("#"+p.codeTb).val();
	var pwd = $("#"+p.pwdTb).val();
	
	if(code == "" || pwd == ""){
		msgBox.warning({title:"提示",info:"请输入用户名和密码."});
		return;
	}
	 
	serverAccess.request({
		serviceName:"userNcpService",
		funcName:"login",
	    args:{requestParam:cmnPcr.jsonToStr({
	    	code:encodeURIComponent(code),
	    	password:encodeURIComponent(pwd)})}, 
		successFunc:function(obj){
			location.href = basePath+"/page/sys/main.jsp";
		},
		failFunc:function(obj){
			msgBox.error({title:"提示",info:obj.message});
			//G.Msg.showWarning(obj.message);
		},
		waitingBarParentId:p.containerDiv
	});
}

$(document).ready(function(){ 

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
			loginBtn:"loginBtn"
		});
	});
});