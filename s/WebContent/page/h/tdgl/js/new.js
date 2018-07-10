$(document).ready(function(){
	$("#saveNewTeamBtnId").click(function(){
		saveNewTeam();
		return false;
	}); 
});
 
function saveNewTeam(){
	$("#alertNameInputId").empty();
	
	var name = $("#nameInputId").val();
	var description = $("#descriptionInputId").val();
	if(cmnPcr.trim(name).length == 0){
		$("#alertNameInputId").text("名称不能为空");
	}
	else{		
		var requestParam = {
			name: name, 
			description: description
		};	
		serverAccess.request({
			waitingBarParentId: "innerDiv",
			serviceName:"teamNcpService", 
			funcName:"addTeam", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){	
				var teamId = obj.result.teamId;
				window.location = "teamInfoOwner.jsp?&teamid=" + teamId;
			}
		}); 
	}
}