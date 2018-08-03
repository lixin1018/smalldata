function DataFileWebWordLayout(p){
	
	var that = this; 

	this.applicationName = "webWordViewer";

	this.applicationVersion = "1.0.0";
	
	this.containerId = p.containerId; 
	
	this.titleContainerId = p.titleContainerId;
	  
	this.file = null; 
	
	this.accessoryId = null;
	
	
	this.showPreview = function(p){
		var previewFilePath = basePath + "/fe/getWebWordPreviewFile?accessoryid=" + that.accessoryId;
		$("#" + that.containerId).attr("src", previewFilePath);
	}
	
	//展示预览框和下载按钮
	this.show = function(p){
		this.showPreview(p);
		
		this.showButton(p);
		
		//显示只读提示信息
		if(this.file.readonly){
			this.showReadonlyAlertBar();
		}   
	}
	
	this.showButton = function(p){
		$(".headerBottom").css("display", "block");
		if(this.file.readonly){
			$(".headerRightTop").css("display", "none");
		}   
	}
	
	this.showReadonlyAlertBar = function(){
		var headerTopDiv = $("#" + this.bodyId).find(".headerTop")[0];
		var alertHtml = "<div style=\"position:absolute;color: #000000;background-color: #dddddd;border-bottom: solid 1px #CCCCCC;top:0px;left:0px;bottom:0px;right:0px;text-align:center;z-index:1000;line-height:30px;\">提示: 只读文档, 不能编辑</div>";
		$(headerTopDiv).append(alertHtml);
	}
	
	this.downloadFile = function(){
		var filePath = basePath + "/fe/getWebWordFile?accessoryid=" + that.accessoryId;
		window.open(filePath);
	}
	
	//调用服务器端，读取文本
	this.loadFromServer = function(p){ 
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			fileId: p.fileId
		};
		
 		serverAccess.request({ 
 			waitingBarParentId: that.bodyId,
			serviceName:"webWordFileNcpService", 
			funcName:"readFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var accessoryId = obj.result.fileContent;
				
				that.file = {
					id: obj.result.fileInfo.id,
					name: decodeURIComponent(obj.result.fileInfo.name),
					readonly: obj.result.fileInfo.readonly == "Y" ? true : false
				}; 
				
				that.accessoryId = accessoryId; 
				
				if(afterLoadFunc != null) {
					afterLoadFunc();
				}
			},
			failFunc:function(obj){
				msgBox.alert( {
					title : "读取文件失败",
					info : obj.message + "(code:" + obj.code + ")"
				});
			}
		});
	}
	
}