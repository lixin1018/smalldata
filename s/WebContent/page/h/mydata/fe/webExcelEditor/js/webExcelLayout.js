function DataFileExcelGridLayout(p){


	var that = this; 

	this.applicationName = "webExcelEditor";

	this.applicationVersion = "1.0.0";
	  
	this.file = null;
	
	//基类
	this.base = ExcelGridLayout;
	this.base(p);
	
	this.checkClientHasModify = function(){
		return false;
	}
	
	
	//展示表格
	this.show = function(p){
		this.layout();
		
		//显示只读提示信息
		if(this.file.readonly){
			this.showReadonlyAlertBar();
		}
		
		this.setPageAndSheetTitleVisible(this.eg.hasSheetTitle, this.eg.hasEditBar && !this.file.readonly, this.eg.hasPageTitle && !this.file.readonly);
		
		//绑定滚动事件
		$("#" + this.containerId).find("div[name='mainContainerDiv']").scroll(function(){
			that.mainDivScroll(this);
		});
		
		this.bindEvent();
	}
	
	this.showReadonlyAlertBar = function(){
		var headerTopDiv = $("#" + this.bodyId).find(".headerTop")[0];
		var alertHtml = "<div style=\"position:absolute;color: #000000;background-color: #dddddd;border-bottom: solid 1px #CCCCCC;top:0px;left:0px;bottom:0px;right:0px;text-align:center;z-index:1000;line-height:30px;\">提示: 只读文档, 不能编辑</div>";
		$(headerTopDiv).append(alertHtml);
	}
	
	//调用服务器端，保存当前编辑的表格
	this.saveToServer = function(p){
		var afterSaveFunc = p.afterSaveFunc;
		that.endCellEdit(true);
		 
		var fileJson = that.eg.toJson();
		
		var requestParam = { 
			fileId: that.file.id,
			fileContent: fileJson,
			title: encodeURIComponent(that.file.name),
			applicationName: that.applicationName,
			applicationVersion: that.applicationVersion,
			property: ""
		};				
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"webExcelFileNcpService", 
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
	
	//调用服务器端，读取表格
	this.loadFromServer = function(p){ 
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			fileId: p.fileId
		};
		
 		serverAccess.request({ 
 			waitingBarParentId: that.bodyId,
			serviceName:"webExcelFileNcpService", 
			funcName:"readFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var fileJson = cmnPcr.strToJson(obj.result.fileContent);
				
				that.file = {
					id: obj.result.fileInfo.id,
					name: decodeURIComponent(obj.result.fileInfo.name),
					readonly: obj.result.fileInfo.readonly == "Y" ? true : false
				};
				var eg = new ExcelGrid();
				eg.load(fileJson);
				that.eg = eg;
				
				that.clientValidateAllCells();
				
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