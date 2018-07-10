$(document).ready(function(){
	var queryStrings = cmnPcr.getQueryStringArgs();
	definitionId = queryStrings["definition"];
	teamId = queryStrings["team"];  
	
	$("#createInstanceBtnId").click(function(){  
		showCreateInstanceForm();
	});
});

var definitionId;
var teamId;
	
function showCreateInstanceForm(){
	var definitionName = $("#definitionNameHiddenInputId").val();
	var userName = $("#userNameHiddenInputId").val();
	var definitionId = $("#definitionIdHiddenInputId").val();
	var versionId = $("#versionIdHiddenInputId").val();
	var title = definitionName + "_" + userName + "_" + cmnPcr.datetimeToStr(new Date(), "HHmmss");
	msgBox.htmlWindow({
		title: "表格标题",
		label: "请输入新建的表格标题",
		text: title,
		type: "oneInputText",
		okFunction: function(p){
			var title = p.text;
			
			//调用服务器端，创建instance
			createInstance({
				title: title,
				definitionId: definitionId,
				versionId: versionId,
				teamId: teamId,
				closeWin: p.closeWin
			}); 
		}
	});
}

function createInstance(p){
	var closeInputTitleWinFunc = p.closeWin;
	var requestParam = {
		title: encodeURIComponent(p.title),
		definitionId: p.definitionId,
		versionId: p.versionId,
		teamId: p.teamId
	};
	serverAccess.request({
		waitingBarParentId: "bodyId",
		serviceName:"excelGridInstanceNcpService",
		funcName:"createInstance",
		args:{requestParam: cmnPcr.jsonToStr(requestParam)},
		successFunc:function(obj){
			closeInputTitleWinFunc();
			afterCreateInstance(obj.result.instanceId, obj.result.stepId);
		},
		failFunc:function(obj){
			msgBox.alert({info: obj.message});
		}
	});
}

function afterCreateInstance(instanceId, stepId){
	window.location = "myInstance.jsp?instance=" + instanceId + "&step=" + stepId;
}
