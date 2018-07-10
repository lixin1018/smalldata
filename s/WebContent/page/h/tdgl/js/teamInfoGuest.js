$(document).ready(function(){ 	 

	var args = cmnPcr.getQueryStringArgs();
	teamId = args["teamid"];
	if(teamId == null || teamId.length ==0){
		msgBox.alert({info: "不存在此团队"});
	}
	
	showTeamInfo();
	
	$("#joinTeamBtnId").click(function(){ 
		if(isOnLine){
			showJoinMessageInputWindow();
		}
		return false;
	}); 	
});  

var teamId = null;

function showTeamInfo(){
	var requestParam = {
		teamId: teamId
	};	
	serverAccess.request({
		waitingBarParentId: "innerDiv",
		serviceName:"teamNcpService", 
		funcName:"getTeamInfo", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){	
			var name = obj.result.name;
			var description = obj.result.description;
			var createUserName = obj.result.createUserName;
			$("#nameDivId").text("名称: " + name);
			$("#descriptionDivId").text("简介: " + description);
			$("#createUserNameDivId").text("创建人: " + createUserName);
		}
	}); 
}

//申请加入团队留言
function showJoinMessageInputWindow(){	 
	msgBox.htmlWindow({
		title: "申请加入",
		label: "留言",
		text: "",
		type: "oneInputTextarea",
		okFunction: function(p){
			var message = p.text;
			p.closeWin();		
			joinTeam(message);	
		}
	});
	return false;
}
function joinTeam(message){
	var requestParam = {
		teamId: teamId,
		message: message
	};
	serverAccess.request({
		waitingBarParentId: "innerDiv",
		serviceName:"teamNcpService", 
		funcName:"requestJoinTeam", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			msgBox.alert({info: "已发送申请, 请等待审批."});
		} 
	});
}
