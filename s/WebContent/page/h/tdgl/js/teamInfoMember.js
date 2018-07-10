$(document).ready(function(){
	var args = cmnPcr.getQueryStringArgs();
	teamId = args["teamid"]; 

	showTeamDetailInfo();

	$("#leaveFromTeamBtnId").click(function(){
		leaveFromTeam();
		return false;
	}); 
});
 
var sheet = null;
var teamId = null;
function showTeamDetailInfo(){
	var p = {
		containerId: "innerDiv",
		idValue: teamId,
		dataModel:dataModels.tm_MyTeam,
		isRefreshAfterSave:true,
		viewModel: viewModels.tm_MyTeam,
		sheetModel: sheetModels.myTeam
	};
	sheet = new NcpSheet(p);
	sheet.show();
}
 
function leaveFromTeam(){ 
	var requestParam = {
		teamId: teamId
	};	
	serverAccess.request({
		waitingBarParentId: "innerDiv",
		serviceName:"teamNcpService",
		funcName:"leaveFromTeam",
		args:{requestParam: cmnPcr.jsonToStr(requestParam)},
		successFunc:function(obj){
			window.location = "teamInfoGuest.jsp?teamid=" + teamId;
		}
	}); 
	return false;
}