function BringBackWindow(){
	var that = this; 
	this.form = null;
	this.flowViewer = null; 
	this.instanceObj = null;
	this.instanceId = null;
	this.stepId = null;
	this.backFromSteps = null;
	this.containerId = null;
	this.afterOkFunction = null;
	this.backFromStepColor = "#DC143C";
	this.backToStepColor = "#FFC125";
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
			dataObject: that.instanceObj
		});
	}
	
	this.setNodesColor = function(){
		var needBringFromStepIds = new Array();
		
		//找出可以取回到的点，也就是this.stepId的后续节点
		var stepLinks = this.instanceObj.stepLinks;
		for(var i = 0; i < stepLinks.length; i++){
			var stepLink = stepLinks[i];
			if(stepLink.fromStepId == this.stepId){
				needBringFromStepIds.push(stepLink.toStepId);
			}
		} 
		
		that.backFromSteps = new Array();
		for(var i = 0; i < this.instanceObj.steps.length; i++){
			var step = this.instanceObj.steps[i];
			if(step.id == this.stepId){
				step.color = this.backToStepColor;
			}
			else if(needBringFromStepIds.contains(step.id)){
				that.backFromSteps.push(step);	
				step.color = this.backFromStepColor;
			}
			else{
				step.color = this.normalStepColor;
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
	 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml); 		

		$("#" + titleId).text("确认取回");
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer; 
	
		$("#" + cancelBtnId).click(function(){ 
			that.form.hide(); 
		});
		
		$("#" + okBtnId).click(function(){			
			///这里增加取回成功的代码，还是刷新页面吧		
			that.afterOkFunction(that.backFromSteps);
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

