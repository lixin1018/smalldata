//工作流对象
function Workflow(wfp){
	this.isNew = wfp.id == null ? true : false;
	 
	this.id = wfp.id == null ? "" : wfp.id; 
	this.name = wfp.name == null ? "" : wfp.name;
	
	this.code = wfp.code == null ? "" : wfp.code;
	this.createUserId = wfp.createUserId == null ? "" : wfp.createUserId;
	this.createUserCode = wfp.createUserCode == null ? "" : wfp.createUserCode;
	this.createUserName = wfp.createUserName == null ? "" : wfp.createUserName;
	this.createTime = wfp.createTime == null ? null : wfp.createTime;
	this.modifyTime = wfp.modifyTime == null ? null : wfp.modifyTime;
	
	this.docTypeId = wfp.docTypeId == null ? "" : wfp.docTypeId;
	this.docTypeName = wfp.docTypeName == null ? "" : wfp.docTypeName;
	this.isActive = wfp.isActive == null ? false : wfp.isActive;
	this.orgId = wfp.orgId == null ? "" : wfp.orgId;
	this.orgCode = wfp.orgCode == null ? "" :  wfp.orgCode;
	this.orgName = wfp.orgName == null ? "" : wfp.orgName;
	this.description = wfp.description == null ? "" : wfp.description;	
	this.abstractExp = wfp.abstractExp == null ? "" : wfp.abstractExp;		
	
	this.nodes = new Hashtable();
	this.links = new Hashtable();
    
    this.addNode = function(np){
    	var newNode = new WorkflowNode(); 
    	newNode.isNew = (np == null || np.id == null);
    	
    	if(newNode.isNew){
        	newNode.id = cmnPcr.getRandomValue();    		
    	} 
    	else{
        	newNode.id = np.id;
    	}

    	newNode.positionX = np.positionX == null ? 0 : np.positionX;
    	newNode.positionY = np.positionY == null ? 0 : np.positionY;
    	newNode.name = np.name == null ? "" : np.name;
    	newNode.groupId = np.groupId == null ? "" : np.groupId;    	
    	newNode.nodeType = np.nodeType == null ? "" : np.nodeType; 
    	
		newNode.triggerType = np.triggerType == null ? "" : np.triggerType;
		newNode.statusName = np.statusName == null ? "" : np.statusName;
		newNode.canBackFrom = np.canBackFrom == null ? true : np.canBackFrom;
		newNode.canBackTo = np.canBackTo == null ? true : np.canBackTo; 
		newNode.actionPageUrl = np.actionPageUrl == null ? "" : np.actionPageUrl;
		newNode.reviewPageUrl = np.reviewPageUrl == null ? "" : np.reviewPageUrl;
		newNode.userDef = np.userDef == null ? "" : np.userDef;
		newNode.userExp = np.userExp == null ? "" : np.userExp;
		newNode.backInDef = np.backInDef == null ? "" : np.backInDef;
		newNode.backInExp = np.backInExp == null ? "" : np.backInExp;
		newNode.inDef = np.inDef == null ? "" : np.inDef;
		newNode.inExp = np.inExp == null ? "" : np.inExp;
		newNode.passDef = np.passDef == null ? "" : np.passDef;
		newNode.passExp = np.passExp == null ? "" : np.passExp;
		newNode.ticketDef = np.ticketDef == null ? "" : np.ticketDef;
		newNode.ticketExp = np.ticketExp == null ? "" : np.ticketExp;
		newNode.timingExp = np.timingExp == null ? "" : np.timingExp;
		newNode.workflowId = np.workflowId == null ? "" : np.workflowId;
		newNode.description = np.description == null ? "" : np.description;
		newNode.aisId = np.aisId == null ? "" : np.aisId;
		newNode.aisName = np.aisName == null ? "" : np.aisName;
		newNode.aisParameterConfig = np.aisParameterConfig == null ? "" : np.aisParameterConfig;
		newNode.aisParameterExp = np.aisParameterExp == null ? "" : np.aisParameterExp;
    	
    	this.nodes.add(newNode.id, newNode);
    	
    	return newNode;
    }
    
    this.addLink = function(lp){
    	var newLink = new WorkflowLink(); 
    	newLink.isNew = (lp.id == null);
    	if(newLink.isNew){
        	newLink.id = cmnPcr.getRandomValue();    		
    	}
    	else{     	
    		newLink.id = lp.id;
    		newLink.name = lp.name == null ? "" : lp.name;
    	}

    	newLink.fromNodeId = lp.fromNodeId == null ? "" : lp.fromNodeId;
    	newLink.toNodeId = lp.toNodeId == null ? "" : lp.toNodeId;
    	newLink.lineType = lp.lineType == null ? linkTypeLegend.normal.name : lp.lineType;
	
		newLink.name = lp.name == null ? "" : lp.name;	
		newLink.conditionDef = lp.conditionDef == null ? "" : lp.conditionDef;
		newLink.conditionExp = lp.conditionExp == null ? "" : lp.conditionExp;
		newLink.description = lp.description == null ? "" : lp.description;
		newLink.workflowId = lp.workflowId == null ? "" : lp.workflowId;
    	
    	this.links.add(newLink.id, newLink);
    	
    	return newLink;
    } 
    
    this.toJson = function(){
    	var wfJson = {
			id: this.id,
			name: encodeURIComponent(this.name),	
			docTypeId: this.docTypeId, 
			isActive: this.isActive,
			orgId: this.orgId,
			description: encodeURIComponent(this.description),
			abstractExp: encodeURIComponent(this.abstractExp),
			nodes: new Array(),
			links: new Array()
		}
		
		var nodeIds = this.nodes.allKeys();
		for(var nodeId in nodeIds){
			var node = this.nodes.get(nodeId);
			var nodeJson = {
				id: node.id, 
				name: encodeURIComponent(node.name),
				positionX: node.positionX,
				positionY: node.positionY,				
				triggerType: node.triggerType,
				statusName: encodeURIComponent(node.statusName),
				canBackFrom: node.canBackFrom,
				canBackTo: node.canBackTo, 
				actionPageUrl: encodeURIComponent(node.actionPageUrl),
				reviewPageUrl: encodeURIComponent(node.reviewPageUrl),
				userDef: encodeURIComponent(node.userDef),
				userExp: encodeURIComponent(node.userExp),
				backInDef: encodeURIComponent(node.backInDef),
				backInExp: encodeURIComponent(node.backInExp),
				inDef: encodeURIComponent(node.inDef),
				inExp: encodeURIComponent(node.inExp),
				passDef: encodeURIComponent(node.passDef),
				passExp: encodeURIComponent(node.passExp),
				ticketDef: encodeURIComponent(node.ticketDef),
				ticketExp: encodeURIComponent(node.ticketExp), 
				timingExp: encodeURIComponent(node.timingExp), 
				description: encodeURIComponent(node.description),
				aisId: node.aisId,	
				aisName: encodeURIComponent(node.aisName),
				aisParameterConfig: encodeURIComponent(node.aisParameterConfig),
				aisParameterExp: encodeURIComponent(node.aisParameterExp),				
				groupId: node.groupId,				
				nodeType: node.nodeType
			};
			wfJson.nodes.push(nodeJson);
		}
		
		var linkIds = this.links.allKeys();
		for(var linkId in linkIds){
			var link = this.links.get(linkId); 
			var linkJson = {
				id: link.id,
				fromNodeId: link.fromNodeId,
				toNodeId: link.toNodeId,
				name: encodeURIComponent(link.name),
				conditionDef: encodeURIComponent(link.conditionDef),
				conditionExp: encodeURIComponent(link.conditionExp),
				description: encodeURIComponent(link.description), 
				lineType: link.lineType
			};
			wfJson.links.push(linkJson);
		}
		return wfJson;		
    }
}

//工作流节点
function WorkflowNode(){
	this.isNode = true;
	
	this.id = null;
	this.isNew = true; 
	
	this.name = null;
	this.positionX = 0;
	this.positionY = 0;	
	
	this.triggerType = null;
	this.statusName = null;
	this.canBackFrom = null;
	this.canBackTo = null;
	this.actionDef = null;
	this.actionPageUrl = null;
	this.reviewPageUrl = null; 
	this.userDef = null;
	this.userExp = null;
	this.backInDef = null;
	this.backInExp = null;
	this.inDef = null;
	this.inExp = null;
	this.passDef = null;
	this.passExp = null;
	this.ticketDef = null;
	this.ticketExp = null;
	this.timingExp = null;
	this.workflowId = null;
	this.description = null;
	this.aisId = null;
	this.aisName = null;
	this.aisParameterConfig = null;
	this.aisParameterExp = null;	
	this.groupId = null;	
	this.nodeType = nodeTypeLegend.active.name;	
} 

//工作流边
function WorkflowLink(){
	this.isLink = true;
	
	this.id = null;
	this.isNew = true;	
	this.fromNodeId = null;
	this.toNodeId = null;	
	this.name = null;	
	this.conditionDef = null;
	this.conditionExp = null;
	this.description = null;
	this.workflowId = null;
	this.lineType = linkTypeLegend.normal.name;
} 

//工作流相关表达式
function WorkflowExpType(){  
	this.userexp = {
		name:"userexp",
		resultType:valueType.string,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.backinexp = {
		name:"backinexp",
		resultType:valueType.boolean,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.inexp = {
		name:"inexp",
		resultType:valueType.boolean,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.passexp = {
		name:"passexp",
		resultType:valueType.boolean,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.ticketexp = {
		name:"ticketexp",
		resultType:valueType.decimal,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.timingexp = {
		name:"timingexp",
		resultType:valueType.time,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.conditionexp = {
		name:"conditionexp",
		resultType:valueType.boolean,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
	this.abstractexp = {
		name:"abstractexp",
		resultType:valueType.string,
		getRunAt: function(){
			return expRunAt.server;
		}
	};
}

var workflowExpType = new WorkflowExpType();

//节点类型
function NodeTypeLegend(){
	this.start ={
			name:"start",
			text:"开始",
			figure: "Ellipse",
			color:"#32CD32",			
			width:80,
			height:30};
	this.end = {
			name:"end",
			text:"结束",
			figure: "Ellipse",
			color:"#A39480",
			width:80,
			height:30};
	this.judge =  {
			name:"judge",
			text:"分支/判断",
			figure: "Diamond",
			color:"#F0E68C",
			width:80, 
			height:30};
	this.active = {
			name:"active",
			text:"活动/操作",
			figure: "RoundedRectangle",
			color:"#BDFCC9",
			width:80, 
			height:30};
	this.parallel = {
			name:"parallel",
			text:"并行",
			figure: "Rectangle",
			color:"#F0FFFF",
			width:400, 
			height:100}; 
	this.startParallel = {
			name:"startParallel",
			text:"并行开始",
			figure: "Hexagon",
			color:"#7CFC00",
			width:80, 
			height:30}; 
	this.endParallel = {
			name:"endParallel",
			text:"并行结束",
			figure: "Hexagon",
			color:"#D2B48C",
			width:80, 
			height:30}; 
			
	this.getUserCreateTypeRows = [this.active, this.judge, this.parallel];
}
var nodeTypeLegend = new NodeTypeLegend();

//边类型
var linkTypeLegend = {
	normal:{
		name:"normal",
		drawType:go.Link.Normal
	},
	avoidsNodes:{
		name:"avoidsNodes",
		drawType:go.Link.AvoidsNodes
	}
}

//节点操作类型
var nodeOperateType = {
	clientManual:{
		expRunAt:expRunAt.js,
		type:"clientManual",
		name:"客户端手工操作"
	},
	timer:{
		expRunAt:expRunAt.server,
		type:"timer",
		name:"定时执行"
	},
	serverAuto:{
		expRunAt:expRunAt.server,
		type:"serverAuto",
		name:"自动执行"
	},
	externalInvoke:{
		expRunAt:expRunAt.server,
		type:"externalInvoke",
		name:"外部调用"
	}	
}