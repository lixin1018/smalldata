function ExcelGridInstanceLayout(p){
	var that = this;
	
	this.canEdit = false;
	
	this.instanceRowJson = null;
	this.stepRowJson = null;
 
	this.instanceId = null;
	this.stepId = null;
	
	//查看处理过程的窗口
	this.displayFlowWindow = null;
	//显示选择发送人的窗口
	this.driveToNextWindow = null;
	//取回窗口
	this.bringBackWindow = null;
	//结束窗口
	this.endWindow = null;
	
	//基类
	this.base = ExcelGridLayout;
	this.base(p);
	this.baseShow = this.show;
	
	this.show = function(p){
		this.baseShow(p); 
	}
	
	this.showFlowWindow = function(p){
		if(this.displayFlowWindow == null){			
			this.displayFlowWindow = new DisplayFlowWindow();
		}
		this.displayFlowWindow.show({
			instanceId: that.instanceId,
			stepId: that.stepId,
			contentDivId: p.contentDivId 
		});
	}
	
	this.showDriveToNextWindow = function(p){
		if(this.driveToNextWindow == null){			
			this.driveToNextWindow = new DriveToNextWindow();
		}
		this.driveToNextWindow.show({
			contentDivId: p.contentDivId,
			afterOkFunction: function(userIds, note){
				that.driveToNext(userIds, note);
			}
		});
	}
	
	this.showSubmitWindow = function(p){
		if(this.driveToNextWindow == null){			
			this.driveToNextWindow = new DriveToNextWindow();
		}
		this.driveToNextWindow.show({
			contentDivId: p.contentDivId,
			afterOkFunction: function(userIds, note){
				that.submit(userIds, note);
			}
		});
	}
	
	this.showBringBackWindow = function(p){
		if(this.bringBackWindow == null){			
			this.bringBackWindow = new BringBackWindow();
		}
		this.bringBackWindow.show({
			contentDivId: p.contentDivId,
			instanceId: that.instanceId,
			stepId: that.stepId,
			afterOkFunction: function(backFromSteps){
				that.bringBack(backFromSteps);
			}
		});
	}
	
	this.showEndWindow = function(p){
		if(this.endWindow == null){			
			this.endWindow = new EndWindow();
		}
		this.endWindow.show({
			instanceId: that.instanceId,
			stepId: that.stepId,
			afterOkFunction: function(instanceId, stepId){
				that.end(instanceId, stepId);
			}
		});
	}
	
	this.checkClientHasModify = function(){
		return false;
	}
	
	this.bringBack = function(backFromSteps){	
		var fromStepArray = new Array();
		for(var i = 0; i < backFromSteps.length; i++){
			var step = backFromSteps[i];
			fromStepArray.push({fromStepId: step.id, fromUserId: step.processUserId});
		} 
		
		var requestParam = {
			instanceId: that.instanceId,
			backToStepId: that.stepId,
			note: "",
			fromStepArray: fromStepArray
		}; 
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"bringBack", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var toStepIds = obj.result.toStepIds; 
				msgBox.alert({info: "取回成功. \r\n系统将跳转至此表格的任务处理页面"});
				//window.location = "waitingList.jsp";
				window.location = "processInstance.jsp?instance=" + that.instanceId + "&step=" + toStepIds[0];
			}
		});
	}
	 
	this.driveToNext = function(userIds, note){		
		var instanceId = that.instanceId;
		var stepId = that.stepId; 
		var fileJson = that.eg.toJson();
		
		var requestParam = {
			instanceId: instanceId,
			fromStepArray: [{
					fromStepId: stepId
				}
			],
			nextStepArray: [],
			note: encodeURIComponent(note)
		};
		
		for(var i = 0; i < userIds.length; i++){ 
			requestParam.nextStepArray.push({
				nextUserId: userIds[i], 
				title: encodeURIComponent(that.stepRowJson.title)
			});
		}	
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"driveToNext", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				msgBox.alert({info: "发送成功. \r\n系统将跳转至待办列表页"});
				window.location = "waitingList.jsp";
			}
		});
	} 
	 
	this.submit = function(userIds, note){		
		var instanceId = that.bodyId;
		var stepId = that.stepId; 
		var fileJson = that.eg.toJson();
		
		var requestParam = {
			instanceId: instanceId,
			fromStepArray: [{
					fromStepId: stepId
				}
			],
			nextStepArray: [],
			note: encodeURIComponent(note)
		};
		
		for(var i = 0; i < userIds.length; i++){ 
			requestParam.nextStepArray.push({
				nextUserId: userIds[i], 
				title: encodeURIComponent(that.stepRowJson.title)
			});
		}	
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"driveToNext", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				msgBox.alert({info: "发送成功."});
				window.location.reload();
			}
		});
	} 
	 
	this.end = function(instanceId, stepId){
		var requestParam = {
			instanceId: instanceId,
			fromStepArray: [{
					fromStepId: stepId					
				}
			],
			note: ""
		}; 
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"end", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				msgBox.alert({info: "已设为完成状态. \r\n系统将跳转至待办列表页"});
				window.location = "waitingList.jsp";
			}
		});
	}
	
	//调用服务器端，保存当前编辑的表格
	this.saveToServer = function(p){
		var afterSaveFunc = p.afterSaveFunc;
		that.endCellEdit(true);
		
		var instanceId = that.instanceId;
		var stepId = that.stepId; 
		var fileJson = that.eg.toJson();
		
		var requestParam = {
			instanceId: instanceId,
			stepId: stepId,
			fileStr: fileJson,
			title: encodeURIComponent(that.stepRowJson.title),
		};				
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"updateStep", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				msgBox.alert({info: "保存成功"});
				
				if(afterSaveFunc != null){
					afterSaveFunc();
				}
			}
		});
	}
	
	//调用服务器端，读取表格
	this.loadFromServer = function(p){
		this.instanceId = p.instanceId;
		this.stepId = p.stepId;
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			instanceId: this.instanceId,
			stepId: this.stepId
		};
		
 		serverAccess.request({ 
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"readStep", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var instanceFileJson = cmnPcr.strToJson(obj.result.instanceFile);
				
				that.instanceRowJson = obj.result.instance;
				that.stepRowJson = obj.result.step;
				that.stepRowJson.title = decodeURIComponent(that.stepRowJson.title);
				that.instanceRowJson.statusNote = decodeURIComponent(that.instanceRowJson.statusNote);
				that.instanceRowJson.definitionName = decodeURIComponent(that.instanceRowJson.definitionName); 
				
				var eg = new ExcelGrid();
				eg.load(instanceFileJson);
				that.eg = eg;
				
				that.clientValidateAllCells();
				
				if(afterLoadFunc != null) {
					afterLoadFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	
}