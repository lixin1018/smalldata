$(document).ready(function(){
	var siLayout = new SendInfoLayout();
	siLayout.init({
		containerId: "bodyContainerId",
		bringBackBtnId: "bringBackBtnId",
		applicationIdHiddenInputId: "applicationDirId",
		sendIdHiddenInputId: "sendId",
		fileContentDivId: "fileContentId",
		fileTitleDivId: "fileTitle",
		sendDirDivId: "sendDirId",
		saveAsBtnId: "saveAsBtnId",
		saveAndSelectDirDivId: "saveAndDirSelect"
	});
});

function SendInfoLayout(){
	var that = this;
	this.containerId = null;
	this.bringBackBtnId = null;
	this.sendIdHiddenInputId = null;
	this.fileContentDivId = null;
	this.fileTitleDivId = null;
	this.sendDirDivId = null;
	this.saveAsBtnId = null;
	this.saveAndSelectDirDivId = null;
	
	this.init = function(p){
		this.containerId = p.containerId;
		this.bringBackBtnId = p.bringBackBtnId;
		this.sendIdHiddenInputId = p.sendIdHiddenInputId;
		this.applicationIdHiddenInputId = p.applicationIdHiddenInputId;
		this.fileContentDivId = p.fileContentDivId;
		this.fileTitleDivId = p.fileTitleDivId;
		this.sendDirDivId = p.sendDirDivId;
		this.saveAsBtnId = p.saveAsBtnId;
		this.saveAndSelectDirDivId = p.saveAndSelectDirDivId;
		
		$("#" + this.containerId).find(".fileLink").click(function(){
			$(".fileLink").removeClass("fileLinkSelected");
			var exeTypeName = $(this).attr("exeTypeName");
			var fileId = $(this).attr("fileId");
			var fileName = $(this).text();
			that.showFilePage(fileId, exeTypeName, fileName);
			return false;
		});
		var firstFileElement = 	$("#" + this.containerId).find(".fileLink")[0];
		var fileId = $(firstFileElement).attr("fileId");
		var exeTypeName = $(firstFileElement).attr("exeTypeName");
		var fileName = $(firstFileElement).text();
		that.showFilePage(fileId, exeTypeName, fileName);
		
		$("#" + this.bringBackBtnId).click(function(){
			var sendId = $("input[id='" + that.sendIdHiddenInputId + "']").val();
			that.bringBack(sendId);
			return false;
		});
		
		$("#" + this.saveAsBtnId).click(function(){
			var fileElement = $("#" + that.containerId).find(".fileLinkSelected")[0];
			var fileId = $(fileElement).attr("fileId");
			var fileType = $(fileElement).attr("fileType");
			var fileName = $(fileElement).text();
			that.saveAs(fileId, fileName, fileType);
			return false;
		});		
		
	}
	
	this.showFilePage = function(fileId, exeTypeName, fileName){
		$("#" + this.containerId).find(".fileLink[fileId=\"" + fileId + "\"]").addClass("fileLinkSelected");
		$("#" + this.fileTitleDivId).text(fileName);		
		$("#" + this.fileContentDivId).empty();
		if(exeTypeName == null || exeTypeName.length == 0){
			var alertHtml = "<div style=\"align:center;width:100%;\">不支持预览此文件.</div>";
			$("#" + this.fileContentDivId).html(alertHtml);
		}
		else{
			var fileUrl = "fe/" + exeTypeName + "/" + exeTypeName + ".jsp?did=" + fileId;
			var frameId = cmnPcr.getRandomValue();
			var frameHtml = "<iframe id=\"" + frameId + "\"frameborder=\"0\" class=\"fileFrame\"></iframe>";
			$("#" + this.fileContentDivId).html(frameHtml);
			$("#" + frameId).attr("src", fileUrl);
		}
	} 

	this.bringBack = function(sendId){
		if(msgBox.confirm({info: "确认取回吗?"})){
			var requestParam = { 
				sentInfoId: sendId
			};	
			serverAccess.request({
				waitingBarParentId: this.containerId,
				serviceName:"dataFileNcpService", 
				funcName:"bringBack", 
				args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
				successFunc:function(obj){	
					window.location.reload();
				} 
			});
		} 
	}
	
	this.saveAndDirSelectWindow = null;
	this.getSaveAndDirSelectWindow = function(){
		if(this.saveAndDirSelectWindow == null){
			this.saveAndDirSelectWindow= new SaveAndDirSelectWindow();
		}	
		return this.saveAndDirSelectWindow;
	}
	
	this.saveAs = function(fileId, fileName, fileType){  
		var sendDirId = $("input[id='" + that.sendDirDivId + "']").val(); 
		if(fileType == "exe"){
			if(msgBox.confirm({info: "是否将此应用添加到'我的应用'?"})){
				var applicationDirId = $("input[id='" + that.applicationIdHiddenInputId + "']").val(); 
				that.saveAsOnServer(sendDirId, applicationDirId, fileId, fileName);
			}
		}
		else{
			var saveAnddirSelectWindow = this.getSaveAndDirSelectWindow();
			saveAnddirSelectWindow.show({
				contentDivId: that.saveAndSelectDirDivId,
				title: "请选择另存至的文件夹",
				fileName: fileName,
				afterOkFunction: function(p){
					var toDirId = p.dirId;
					var fileName = p.fileName;
					that.saveAsOnServer(sendDirId, toDirId, fileId, fileName);
				}
			});		  
		} 	  
	}
	
	this.saveAsOnServer = function(fromParentId, toParentId, fileId, fileName){
		var fileIdArray = new Array();
		fileIdArray.push(fileId);
		var requestParam = {
			fromParentId: fromParentId, 
			toParentId: toParentId,
			fileId: fileId,
			fileName: fileName
		};	
		serverAccess.request({
			waitingBarParentId: that.containerId,
			serviceName:"dataFileNcpService", 
			funcName:"saveAs", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){ 
				var newFile = obj.result.newFile; 
				that.afterSaveAsOnServer(toParentId, newFile);
				that.saveAndDirSelectWindow.close();
			},
			failFunc: function(obj){
				that.failSaveAsOnServer(obj);
			}
		}); 
	}
	
	this.afterSaveAsOnServer = function(toParentId, newFile){
		var alertInfoString = "另存文件成功.";
		msgBox.alert({info: alertInfoString});
	}
	
	this.failSaveAsOnServer = function(resultObj){
		//提示复制失败
		msgBox.alert( {
			title : "另存失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
}