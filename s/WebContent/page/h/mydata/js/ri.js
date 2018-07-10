$(document).ready(function(){
	var riLayout = new ReceiveInfoLayout();
	riLayout.init({
		containerId: "bodyContainerId", 
		receiveIdHiddenInputId: "receiveId",
		applicationIdHiddenInputId: "applicationDirId",
		fileContentDivId: "fileContentId",
		fileTitleDivId: "fileTitle",
		sendDirDivId: "receiveDirId",
		saveAsBtnId: "saveAsBtnId",
		saveAndSelectDirDivId: "saveAndDirSelect",
		needMarkReadInputId: "needMarkRead"
	});
});

function ReceiveInfoLayout(){
	var that = this;
	this.containerId = null; 
	this.receiveIdHiddenInputId = null;
	this.applicationIdHiddenInputId = null;
	this.fileContentDivId = null;
	this.fileTitleDivId = null;
	this.receiveDirDivId = null;
	this.saveAsBtnId = null;
	this.saveAndSelectDirDivId = null;
	this.needMarkReadInputId = null;
	
	this.init = function(p){
		this.containerId = p.containerId; 
		this.receiveIdHiddenInputId = p.receiveIdHiddenInputId;
		this.applicationIdHiddenInputId = p.applicationIdHiddenInputId;
		this.fileContentDivId = p.fileContentDivId;
		this.fileTitleDivId = p.fileTitleDivId;
		this.receiveDirDivId = p.receiveDirDivId;
		this.saveAsBtnId = p.saveAsBtnId;
		this.saveAndSelectDirDivId = p.saveAndSelectDirDivId;
		this.needMarkReadInputId = p.needMarkReadInputId;
		
		$("#" + this.containerId).find(".fileLink").click(function(){
			$(".fileLink").removeClass("fileLinkSelected");
			var exeTypeName = $(this).attr("exeTypeName");
			var fileId = $(this).attr("fileId");
			var fileName = $(this).text();
			that.showFilePage(fileId, exeTypeName, fileName);
			return false;
		});
		var fileElments = $("#" + this.containerId).find(".fileLink");
		if(fileElments.length > 0){
			var firstFileElement = fileElments[0];
			var fileId = $(firstFileElement).attr("fileId")
			var fileName = $(firstFileElement).text();
			var exeTypeName = $(firstFileElement).attr("exeTypeName"); 
			that.showFilePage(fileId, exeTypeName, fileName); 
		} 
		
		$("#" + this.saveAsBtnId).click(function(){
			var fileElement = $("#" + that.containerId).find(".fileLinkSelected")[0];
			var fileId = $(fileElement).attr("fileId");
			var fileType = $(fileElement).attr("fileType");
			var fileName = $(fileElement).text();
			that.saveAs(fileId, fileName, fileType);
			return false;
		});		
		
		var needMarkRead = $("input[id='" + that.needMarkReadInputId + "']").val() == "true";
		if(needMarkRead){
			var receiveId = $("input[id='" + that.receiveIdHiddenInputId + "']").val();
			that.markRead(receiveId);		
		}
	}

	this.markRead = function(receiveId){
		var receiveInfoIdArray = new Array(); 
		receiveInfoIdArray.push(receiveId);
		var requestParam = { 
			receiveInfoIdArray: receiveInfoIdArray
		};	
		serverAccess.request({
			waitingBarParentId: this.containerId,
			serviceName:"dataFileNcpService", 
			funcName:"markRead", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
			} 
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
	
	
	this.saveAndDirSelectWindow = null;
	this.getSaveAndDirSelectWindow = function(){
		if(this.saveAndDirSelectWindow == null){
			this.saveAndDirSelectWindow= new SaveAndDirSelectWindow();
		}	
		return this.saveAndDirSelectWindow;
	}
	
	this.saveAs = function(fileId, fileName, fileType){
		var receiveDirId = $("input[id='" + that.receiveDirDivId + "']").val(); 
		if(fileType == "exe"){
			if(msgBox.confirm({info: "是否将此应用添加到'我的应用'?"})){
				var applicationDirId = $("input[id='" + that.applicationIdHiddenInputId + "']").val(); 
				that.saveAsOnServer(receiveDirId, applicationDirId, fileId, fileName);
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
					that.saveAsOnServer(receiveDirId, toDirId, fileId, fileName);
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