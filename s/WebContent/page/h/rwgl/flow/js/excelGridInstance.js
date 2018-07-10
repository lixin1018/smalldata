function ExcelGridInstance(p){
	this.id = p.id;
	this.allSteps = new Array();
	this.allStepLinks = new Array();
	
	this.addStep = function(p){
		var stepObj = new ExcelGridInstanceStep(p);
		this.allSteps.push(stepObj);
	}
	
	this.addStepLinks = function(p){
		var stepLinkObj = new ExcelGridInstanceStepLink(p);
		this.allStepLinks.push(stepLinkObj);
	}
}

function ExcelGridInstanceStep(p){
	this.id = p.id;
	this.createTime = p.createTime;
	this.processTime = p.processTime;
	this.processUserId = p.processUserId;
	this.processUserName = p.processUserName;
	this.operateType = p.operateType;
	this.resultType = p.resultType;
	this.title = p.title;
	this.fileLastModifyTime = p.fileLastModifyTime;
}

function ExcelGridInstanceStepLink(p){
	this.id = p.id;
	this.fromStepId = p.fromStepId;
	this.toStepId = p.toStepId;
	this.createTime = p.createTime;
}