function DisplayFlowWindow(){
	var that = this; 
	this.form = null;
	this.flowViewer = null; 
	this.instanceObj = null;
	this.instanceId = null;
	this.stepId = null; 
	this.containerId = null;
	this.afterOkFunction = null;
	this.currentStepColor = "#DC143C";
	this.normalStepColor = "#8DB6CD";
	
	this.showFlow = function(){
		var flowViewerDiv = $("#" + that.containerId).find("div[name='flowViewer']")[0];
		var flowViewerDivId = this.containerId + "_flowViewer"
		$(flowViewerDiv).attr("id", flowViewerDivId);
		
		this.setNodesColor();
		
		var flowViewer = new FlowViewer();
		this.flowViewer = flowViewer;
		flowViewer.show({
			containerId: flowViewerDivId,
			dataObject: that.instanceObj,
			onChangedNodeSelection: function(stepIds){
				that.lightStepInfos(stepIds);
			}
		});
		
		this.showProcessInfo();
	}
	
	this.setNodesColor = function(){ 
		for(var i = 0; i < this.instanceObj.steps.length; i++){
			var step = this.instanceObj.steps[i];
			if(step.resultType == "waitingProcess"){ 
				step.color = this.currentStepColor;
			}
			else{
				step.color = this.normalStepColor;
			}
		}			
	}
	
	this.getToSteps = function(fromStepId, stepHash){
		var tempSteps = new Array();
		for(var i = 0; i < this.instanceObj.stepLinks.length; i++){
			var stepLink = this.instanceObj.stepLinks[i];
			if(stepLink.fromStepId == fromStepId){
				var tempStep = stepHash[stepLink.toStepId];
				tempSteps.push(tempStep);
			}
		}
		return tempSteps;
	}
	
	this.lightStepInfos = function(stepIds){
		var flowInfoDiv = $("#" + that.containerId).find("div[name='flowInfo']")[0];
		$(flowInfoDiv).children("span").css({"color": "#333333", "font-weight": "400"});
		for(var i = 0; i < stepIds.length; i++){
			$("#flowInfo_" + stepIds[i]).css({"color": "#ff6700", "font-weight": "600"});
		}
	}
		
	this.showProcessInfo = function(){		
		var startStep = null;
		var stepHash = new Object();
		for(var i = 0; i < this.instanceObj.steps.length; i++){
			var step = this.instanceObj.steps[i];
			stepHash[step.id] = step;
			if(step.operateType == "create"){
				startStep = step;
			}
		}
		
		var flowInfoDiv = $("#" + that.containerId).find("div[name='flowInfo']")[0];
		var index = 1;
		for(var i = this.instanceObj.steps.length - 1; i >= 0; i--){
			var step = this.instanceObj.steps[i]; 
			var toSteps = this.getToSteps(step.id, stepHash);
			if(toSteps.length == 0){
				//不显示，不做处理
			}
			else{
				var divId = "flowInfo_" + step.id;
				var stepHtml = "<span id=\"" + divId + "\" style=\"color:#333333;padding-top:3px;padding-left:10px;display:block;\"></span>";
				$(flowInfoDiv).append(stepHtml); 
				var infoText = index +". ";	
				index++;	
				if(toSteps.length == 1){
					var toStep = toSteps[0];
					if(toStep.operateType == "end"){
						infoText += step.processUserName + " 执行完成";
					}
					else if(toStep.operateType == "bringBack"){
						infoText += toStep.processUserName + " 执行取回";
					}
					else if(toStep.operateType == "converge"){
						infoText += toStep.processUserName + " 执行合并";
					}
					else{
						infoText += step.processUserName + " 发送给 " + toStep.processUserName;
					} 
				}
				else{
					var toStepUserNames = new Array();
					for(var j = 0; j < toSteps.length; j++){
						toStepUserNames.push(toSteps[j].processUserName);
					} 
					infoText += step.processUserName + " 发送给 " + cmnPcr.arrayToString(toStepUserNames, ", "); 
				}  
				$("#" + divId).html(cmnPcr.html_encode(infoText) + (step.note.length == 0 ? "": ("<br/>&nbsp;&nbsp;&nbsp;附言:" + step.note)) + "<br/>&nbsp;&nbsp;&nbsp;(" + step.processTime + ")");  
			}	
		}	
	}
		
	//根据instance的id，获取步骤和连接线，调用服务器端获取所属step和link的方法
	this.loadInstanceFromServer = function(p){		
		this.instanceId = p.instanceId; 
		this.stepId = p.stepId;
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			instanceId: this.instanceId 
		};
		
 		serverAccess.request({ 
 			waitingBarParentId: that.containerId,
			serviceName:"excelGridInstanceNcpService", 
			funcName:"getInstanceStepsAndLinks", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var instanceObj =obj.result.instance;
				that.instanceObj = instanceObj;
				for(var i = 0; i < instanceObj.steps.length; i++){
					var stepObj = instanceObj.steps[i];
					stepObj.title = decodeURIComponent(stepObj.title);
					stepObj.processUserName = decodeURIComponent(stepObj.processUserName);
					stepObj.note = decodeURIComponent(stepObj.note);
				} 
				if(afterLoadFunc != null) {
					afterLoadFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}     
	
	this.init = function(p){		
		var popContainer = new PopupContainer({
			width : 700,
			height : 400,
			top : 150
		});
		popContainer.show();
		var winId = cmnPcr.getRandomValue();
		that.containerId = popContainer.containerId;
		var titleId = winId + "_title";
		var innerContainerId = winId + "_inner";
		var buttonContainerId = winId + "_buttonContainer";
		var okBtnId = winId + "_ok";
		var cancelBtnId = winId + "_cancel";
		var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
	 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:340px;font-size:11px;text-align:center;overflow:auto;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"关 闭\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml); 		

		$("#" + titleId).text("处理过程");
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer; 
	
		$("#" + cancelBtnId).click(function(){ 
			that.form.hide(); 
		}); 
		
		this.loadInstanceFromServer({
			instanceId: p.instanceId,
			stepId: p.stepId,
			afterLoadFunc: function(){
				that.showFlow();
			}
		});
	}
	 
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
    	if(that.form != null){
    		that.form.show();
    	}
    	else{ 
    		that.init(p);
		} 
	}
} 

