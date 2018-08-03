function DataFileTextLayout(p){
	
	var that = this; 

	this.applicationName = "textEditor";

	this.applicationVersion = "1.0.0";
	
	this.containerId = p.containerId; 
	
	this.titleContainerId = p.titleContainerId;
	  
	this.file = null; 
	
	this.textContent = null;
	
	
	this.showContent = function(p){
		$("#" + that.containerId).val(this.textContent);
	}
	
	//展示文本
	this.show = function(p){
		this.showContent(p);
		
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
	
	//调用服务器端，保存当前编辑的文本
	this.saveToServer = function(p){
		var afterSaveFunc = p.afterSaveFunc; 
		 
		var fileContent = $("#" + that.containerId).val();
		
		var requestParam = { 
			fileId: that.file.id,
			fileContent: fileContent,
			title: encodeURIComponent(that.file.name),
			applicationName: that.applicationName,
			applicationVersion: that.applicationVersion,
			property: ""
		};				
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"textFileNcpService", 
			funcName:"saveFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				msgBox.alert({info: "保存成功"});
				
				if(afterSaveFunc != null){
					afterSaveFunc();
				}
			},
			failFunc:function(obj){
				msgBox.alert( {
					title : "保存文件失败",
					info : obj.message + "(code:" + obj.code + ")"
				});
			}
		});
	}
	
	//调用服务器端，读取文本
	this.loadFromServer = function(p){ 
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			fileId: p.fileId
		};
		
 		serverAccess.request({ 
 			waitingBarParentId: that.bodyId,
			serviceName:"textFileNcpService", 
			funcName:"readFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var textContent = obj.result.fileContent;
				
				that.file = {
					id: obj.result.fileInfo.id,
					name: decodeURIComponent(obj.result.fileInfo.name),
					readonly: obj.result.fileInfo.readonly == "Y" ? true : false
				}; 
				
				that.textContent = textContent; 
				
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