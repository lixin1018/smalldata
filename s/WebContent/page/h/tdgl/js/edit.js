var teamId = null;

$(document).ready(function(){
	var args = cmnPcr.getQueryStringArgs();
	teamId = args["teamid"];	

	showTeamInfo();

	$("#saveTeamBtnId").click(function(){
		saveTeam();
		return false;
	}); 
});


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
			var name = decodeURIComponent(obj.result.name);
			var description = decodeURIComponent(obj.result.description);
			$("#nameInputId").val(name);
			$("#descriptionInputId").text(description);
		}
	}); 
}
 
function saveTeam(){
	var args = cmnPcr.getQueryStringArgs();
	var teamId = args["teamid"];
	var name = $("#nameInputId").val();
	var description = $("#descriptionInputId").val();
	if(cmnPcr.trim(name).length == 0){
		$("#alertNameInputId").text("团队名称不能为空");
	}
	else{		
		var requestParam = {
			teamId: teamId,
			name: name, 
			description: description
		};	
		serverAccess.request({
			waitingBarParentId: "innerDiv",
			serviceName:"teamNcpService", 
			funcName:"updateTeamInfo", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				window.location = "teamInfoManager.jsp?&teamid=" + teamId;
			}
		}); 
	}
}