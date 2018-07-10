function FlowCanvas(){
	var that = this;
	
	this.diagramDivId = null;
	this.workflowEditDivId = null;
	this.nodeEditDivId = null;
	this.linkEditDivId = null;
	this.workflowPropertyBtnId = null;
	this.saveBtnId = null;
	this.messageControlId = null;
	this.layoutId = null;
	this.workflowNameLabelId = null;
	
	this.flowDiagram = null;
	this.workflow = null;
	this.docFields = null;
	this.canEdit = false;
	
	this.init = function(p){
		this.workflow = p.workflow;
		this.canEdit = p.canEdit;		
		this.diagramDivId = p.diagramDivId;
		this.workflowEditDivId = p.workflowEditDivId;
		this.nodeEditDivId = p.nodeEditDivId;
		this.linkEditDivId = p.linkEditDivId;
		this.workflowPropertyBtnId = p.workflowPropertyBtnId;
		this.saveBtnId = p.saveBtnId;
		this.messageControlId = p.messageControlId;
		this.layoutId = p.layoutId;
		this.workflowNameLabelId = p.workflowNameLabelId;
		this.aisParameterContainerId = p.aisParameterContainerId;
		this.docFields = p.docFields;
		
		$("#" + this.workflowPropertyBtnId).click(function(){
			that.editWorkflowProperties();
		});
			
		$("#" + this.saveBtnId).click(function(){
			that.saveWorkflowInfo();
		});
			
		this.showWorkflowNameLabel();
		this.initCanvas(p);
		this.initFlowDiagram(p);		
	} 
	
	this.showWorkflowNameLabel = function(){
		var labelHtml = "<span style=\"font-size:15px;font-weight:600;color:#888888;\">"+ cmnPcr.encodeString(this.workflow.name == null || this.workflow.name == "" ? "新建流程" : this.workflow.name ) 
			+ "</span><span style=\"font-size:8px;color:#aaaaaa;\">(适用组织:" + (this.workflow.orgName == null || this.workflow.orgName == "" ? "暂未指定" : this.workflow.orgName) +", " 
			+ (this.workflow.isActive ? "已启用" : "未启用") + ")</span>";
		$("#" + this.workflowNameLabelId).html(labelHtml);
	} 
	
	this.getNodePosition = function(dNode){
		var locArray = dNode.location.split(" ");
		var locationX = cmnPcr.strToDecimal(locArray[0]);
		var locationY = cmnPcr.strToDecimal(locArray[1]);
		return {
			positionX: locationX,
			positionY: locationY
		};
	}
	
	this.saveWorkflowInfo = function(){
		//保存前，形成保存需要的json文档；
		//在服务器，保存前先验证有效性、完整性；然后再验证被删除的点是否存在未审批的单据，如果存在不允许删除；验证通过了再执行保存；
		//一个组织+一个单据类型，只能指定一个isActive的流程；
		//提供系统功能，按照节点设置，重新指定到新的审批人；
		//更新位置信息		
		var allDiagramLinks = that.getAllLinks();
		var allDiagramNodes = that.getAllNodes();
		var linkCount = allDiagramLinks.length;
		var nodeCount = allDiagramNodes.length;
		
		var newNodes = new Hashtable();
		for(var i=0;i<nodeCount;i++){
			var dNode = allDiagramNodes[i];  
			var pos = that.getNodePosition(dNode); 
			var nodeObject = dNode.object;
			nodeObject.positionX = pos.positionX;
			nodeObject.positionY = pos.positionY;
			newNodes.add(nodeObject.id, nodeObject);
		}
		this.workflow.nodes = newNodes;
		
		var newLinks = new Hashtable();
		for(var i=0;i<linkCount;i++){
			var dLink = allDiagramLinks[i];   
			var linkObject = dLink.object;
			newLinks.add(linkObject.id, linkObject);
		}
		this.workflow.links = newLinks;
		
		var workflowJson = that.workflow.toJson();
				
		var requestParam = {
			workflow: workflowJson
		}; 
		serverAccess.request({
			serviceName:"workflowNcpService", 
			funcName:"saveWorkflow",
			args:{
				requestParam:cmnPcr.jsonToStr(requestParam)
			},  
			successFunc:function(obj){  
				if(obj.result.succeed){
					$("#" + that.messageControlId).val("保存成功!"); 
					var resultStr = "保存成功!"; 
					msgBox.alert({info:resultStr});				
					window.location =  window.location.pathname+"?workflowid=" + obj.result.workflowId;
				}
				else {
					var resultStr = "保存失败!\r\n" + obj.result.errorMessage; 
					$("#" + that.messageControlId).val(resultStr); 
					$("#" + that.layoutId).layout("expand", "east");  
				}
			},  
			failFunc:function(obj){  
				var resultStr = "保存失败!\r\n" + obj.message; 
				$("#" + that.messageControlId).val(resultStr); 
				$("#" + that.layoutId).layout("expand", "east");  
			}
		}); 
	}	
	
	this.showWorkflowById = function(p){ 
		var requestParam = {
			workflowId: p.workflowId
		}; 
		serverAccess.request({
			serviceName:"workflowNcpService", 
			funcName:"getWorkflow",
			args:{
				requestParam:cmnPcr.jsonToStr(requestParam)
			},  
			successFunc:function(obj){
				msgBox.show({info:obj.result});				
				
				var encodedWorkflow = obj.result.workflow;
				
				var wf = new Workflow({
					id: encodedWorkflow.id,
					code: encodedWorkflow.code,
					createTime: cmnPcr.strToObject(encodedWorkflow.createTime, valueType.time),
					modifyTime: cmnPcr.strToObject(encodedWorkflow.modifyTime, valueType.time),
					name: decodeURIComponent(encodedWorkflow.name),	
					docTypeId: encodedWorkflow.docTypeId, 
					docTypeName: encodedWorkflow.docTypeName == null? "" : decodeURIComponent(encodedWorkflow.docTypeName),
					isActive: cmnPcr.strToObject(encodedWorkflow.isActive, valueType.boolean),
					orgId: encodedWorkflow.orgId,
					orgName: encodedWorkflow.orgName == null? "" : decodeURIComponent(encodedWorkflow.orgName),
					orgCode: decodeURIComponent(encodedWorkflow.orgCode),
					description: decodeURIComponent(encodedWorkflow.description),
					createUserCode: decodeURIComponent(encodedWorkflow.createUserCode),
					createUserName: decodeURIComponent(encodedWorkflow.createUserName),
					createUserId: encodedWorkflow.createUserId,
					abstractExp: decodeURIComponent(encodedWorkflow.abstractExp) 
				});
				
				var nodeCount = encodedWorkflow.nodes.length;
				for(var i = 0; i < nodeCount; i++){
					var encodedNode = encodedWorkflow.nodes[i];
					wf.addNode({
						id: encodedNode.id, 
						name: decodeURIComponent(encodedNode.name),
						positionX: encodedNode.positionX,
						positionY: encodedNode.positionY,				
						triggerType: encodedNode.triggerType,
						statusName: decodeURIComponent(encodedNode.statusName),
						canBackFrom: encodedNode.canBackFrom,
						canBackTo: encodedNode.canBackTo, 
						actionPageUrl: decodeURIComponent(encodedNode.actionPageUrl),
						reviewPageUrl: decodeURIComponent(encodedNode.reviewPageUrl),
						userDef: decodeURIComponent(encodedNode.userDef),
						userExp: decodeURIComponent(encodedNode.userExp),
						backInDef: decodeURIComponent(encodedNode.backInDef),
						backInExp: decodeURIComponent(encodedNode.backInExp),
						inDef: decodeURIComponent(encodedNode.inDef),
						inExp: decodeURIComponent(encodedNode.inExp),
						passDef: decodeURIComponent(encodedNode.passDef),
						passExp: decodeURIComponent(encodedNode.passExp),
						ticketDef: decodeURIComponent(encodedNode.ticketDef),
						ticketExp: decodeURIComponent(encodedNode.ticketExp), 
						timingExp: decodeURIComponent(encodedNode.timingExp), 
						description: decodeURIComponent(encodedNode.description),	
						aisId: encodedNode.aisId,	
						aisName: decodeURIComponent(encodedNode.aisName),
						aisParameterConfig:decodeURIComponent(encodedNode.aisParameterConfig),
						aisParameterExp:decodeURIComponent(encodedNode.aisParameterExp),	
						groupId: encodedNode.groupId,				
						nodeType: encodedNode.nodeType
					}); 
				}
				
				var linkCount = encodedWorkflow.links.length;
				for(var i = 0; i < linkCount; i++){
					var encodedLink = encodedWorkflow.links[i];
					wf.addLink({
						id: encodedLink.id,
						fromNodeId: encodedLink.fromNodeId,
						toNodeId: encodedLink.toNodeId,
						name: decodeURIComponent(encodedLink.name),
						conditionDef: decodeURIComponent(encodedLink.conditionDef),
						conditionExp: decodeURIComponent(encodedLink.conditionExp),
						description: decodeURIComponent(encodedLink.description), 
						lineType: encodedLink.lineType
					}); 
				}				
				
				p.workflow = wf;
			    
				var docFieldsFromServer = obj.result.docFields;
				var docFields = new Array();
				for(var i=0;i<docFieldsFromServer.length;i++){
					var fieldFromServer = docFieldsFromServer[i];
					docFields.push({
						name:decodeURIComponent(fieldFromServer.name),
						valueType:fieldFromServer.valueType.toLowerCase(),
						valueTypeDes:fieldFromServer.valueType.toLowerCase(),
						description:decodeURIComponent(fieldFromServer.description)
					});
				}		 
				p.docFields = docFields;
				
			    that.init(p); 
			    
			}
		});
	}
	
	this.createWorkflow = function(p){  
		var wf = new Workflow({name:"我的流程"});
	    wf.addNode({id:"n1", name:"开始", positionX: 0, positionY: 0, nodeType: "start"}); 
	    wf.addNode({id:"n10", name:"结束", positionX: 0, positionY: 300, nodeType: "end"});
	    p.workflow = wf; 
	    that.init(p);  
	}	
	
	this.initDiagramNode = function(workflowNode){
    	var legend = nodeTypeLegend[workflowNode.nodeType];
    	var dragramNode ={
    		key:workflowNode.id,
    		object:workflowNode,
    		text:workflowNode.name,
    		color:legend.color, 
    		figure:legend.figure,
    		width:legend.width,
    		height:legend.height,
    		group:workflowNode.groupId,
    		isGroup: workflowNode.nodeType == nodeTypeLegend.parallel.name,
    		location:(workflowNode.positionX + " " + workflowNode.positionY)
    	}; 
    	return dragramNode;
	}
	
	this.initDiagramLink = function(workflowLink){
    	var legend = linkTypeLegend[workflowLink.lineType];
    	var dragramLink ={
    		from:workflowLink.fromNodeId,
    		to:workflowLink.toNodeId, 
    		routing:legend.drawType,
    		text:workflowLink.name,
    		object:workflowLink
    	}; 
    	return dragramLink;
	}
	 
	this.initFlowDiagram = function(p){ 
		//node: { key: 1, text: "Alpha", color: "lightgray", location: "0 0" },
		//link: { from: 1, to: 2 , text:"test"} 
		var allDragramNodes = new Array();
	    for (var k in this.workflow.nodes.allKeys()) {
	    	var workflowNode = this.workflow.nodes.get(k);
	    	var dragramNode = this.initDiagramNode(workflowNode);
	    	allDragramNodes.push(dragramNode);
	    }
	    
		var allDragramLinks = new Array();
	    for (var k in this.workflow.links.allKeys()) {
	    	var workflowLink = this.workflow.links.get(k);
	    	var dragramLink = this.initDiagramLink(workflowLink);
	    	allDragramLinks.push(dragramLink);
	    }
	    
	    this.flowDiagram.model = new go.GraphLinksModel(
    		allDragramNodes,
    		allDragramLinks
    	); 
	}
	
	this.initCanvas = function(p) {
		var $diagram = go.GraphObject.make;  // for conciseness in defining templates
		that.flowDiagram = $diagram(
	   		go.Diagram, 
	   		that.diagramDivId,  // create a Diagram for the DIV HTML element
	        {
	          initialContentAlignment: go.Spot.Center,  // center the content
	          "linkingTool.isEnabled": false,  // invoked explicitly by drawLink function, below
	          "linkingTool.direction": go.LinkingTool.ForwardsOnly,  // only draw "from" towards "to"
	          "undoManager.isEnabled": false,  // enable undo & redo
	          allowCopy: false  // enable undo & redo
	        }
		);
		
		that.flowDiagram.groupTemplate = $diagram(
			go.Group, 
			"Auto",
		    { 
		    	/*
				layout: $diagram(
					go.LayeredDigraphLayout,
	                { 
						direction: 0, 
						columnSpacing: 5 
					}
				),
				*/
				
            	layout: $diagram(
            		go.TreeLayout,
            		{ 
            			angle: 90,
            			//arrangement: go.TreeLayout.ArrangementFixedRoots,
            			//arrangement: go.TreeLayout.ArrangementHorizontal,
            			arrangement: go.TreeLayout.ArrangementVertical,
            			isRealtime: false 
        			}
    			),
         		doubleClick: function(e, group) {
         			that.editNodeProperties({
	         			node:group.data, 
	         			object:group.data.object
         			}); 
     			}
			},
			$diagram(
				go.Shape, 
				//"Rectangle", // surrounds everything
		        { 
					parameter1: 5, 
					fill: "rgba(128,128,128,0.33)" ,
		            strokeWidth:4, 
		            stroke: "lightgray"
				},
				new go.Binding("figure", "figure")
			),
			$diagram(
				go.Panel,  
				"Vertical",  // position header above the subgraph
		        {
					defaultAlignment: go.Spot.Left
				}, 
		        $diagram(
	        		go.Panel, 
	        		"Horizontal",  // the header
	        		{ 
	        			defaultAlignment: go.Spot.Top
        			},
	        		$diagram("SubGraphExpanderButton"),  // this Panel acts as a Button
	        		$diagram(
        				go.TextBlock, 
        				{
        		            margin: 5, 
        		            overflow: go.TextBlock.OverflowEllipsis,
        		            maxLines:1,
        		            textAlign: "center" 
        				},
        				new go.Binding("text", "text")
    				)
		        ),
		        $diagram(
	        		go.Placeholder,     // represents area for all member parts
	        		{ 
	        			padding: new go.Margin(0, 15) 
    				},
		            new go.Binding("background", "color")
        		)
    		)
		);

		
	    that.flowDiagram.linkTemplate = $diagram(
	   		go.Link,
	   		{ 
	   			//routing: go.Link.AvoidsNodes, 
	   			corner: 10, 
	   			curve: go.Link.JumpOver,
         		doubleClick: function(e, link) {
         			if(that.canEdit){
	         			that.editLinkProperties({
		         			link:link.data, 
		         			object:link.data.object
	         			}); 
         			}
     			}
   			},
   			new go.Binding("routing", "routing"),
			$diagram(go.Shape, { strokeWidth: 1.5 , stroke: "gray"}),
			$diagram(go.Shape, { toArrow: "Standard"}),
			$diagram(go.TextBlock, new go.Binding("text", "text"))
	    );
	    that.flowDiagram.nodeTemplate = $diagram(
	   		go.Node, 
	   		"Auto", 
	   		{
	   			//desiredSize: new go.Size(100, 36),
	         		// rearrange the link points evenly along the sides of the nodes as links are
	         		// drawn or reconnected -- these event handlers only make sense when the fromSpot
	         		// and toSpot are Spot.xxxSides
         		linkConnected: function(node, link, port) {
	           		if (link.fromNode !== null) link.fromNode.invalidateConnectedLinks();
	           		if (link.toNode !== null) link.toNode.invalidateConnectedLinks();
      			},
         		linkDisconnected: function(node, link, port) {
	           		if (link.fromNode !== null) link.fromNode.invalidateConnectedLinks();
	           		if (link.toNode !== null) link.toNode.invalidateConnectedLinks();
         		},
         		locationSpot: go.Spot.Center,
         		doubleClick: function(e, node) {
         			if(that.canEdit){
	         			that.editNodeProperties({
		         			node:node.data, 
		         			object:node.data.object
	         			}); 
         			}
     			}
      		},
	       	new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
	        //new go.Binding("figure", "figure"),
	        //new go.Binding("fill", "color"),
	        //new go.Binding("desiredSize", "size"),  
	       	$diagram(
  				go.Shape,
   				{
		            //name: "SHAPE",  // named so that changeColor can modify it
		            strokeWidth: 1, 
		            stroke: "lightgray",
		            portId: "",
		            // use the following property if you want users to draw new links
		            // interactively by dragging from the Shape, and re-enable the LinkingTool
		            // in the initialization of the Diagram
		            //cursor: "pointer",
		            fromSpot: go.Spot.AllSides, 
		            fromLinkable: true,
		            fromLinkableDuplicates: false, 
		            fromLinkableSelfNode: false,
		            toSpot: go.Spot.AllSides, 
		            toLinkable: true,
		            toLinkableDuplicates: false, 
		            toLinkableSelfNode: false
				}, 
				new go.Binding("figure", "figure"),
				new go.Binding("fill", "color"),
				new go.Binding("width", "width"),
				new go.Binding("height", "height")
			),  
	       	$diagram(
  				go.TextBlock,
     			{
		            name: "TEXTBLOCK",  // named so that editText can start editing it
		            margin: 5, 
		            overflow: go.TextBlock.OverflowEllipsis,
		            maxLines: 1
	          	},
				{font: "8pt sans-serif"},
	          	new go.Binding("text")
 			)
	 	);
	    // a selected node shows an Adornment that includes both a blue border
	    // and a row of Buttons above the node
	    if(that.canEdit){
		    that.flowDiagram.nodeTemplate.selectionAdornmentTemplate = $diagram(
	    		go.Adornment,
	    		"Spot",
	        	$diagram(
	       			go.Panel, 
	       			"Auto",
	       			$diagram(
	   					go.Shape, 
	       				{ 
	   						stroke: "#FF4500", 
	   						strokeWidth: 2, 
	   						fill: null 
						},
	   					new go.Binding("figure", "figure"),
	   					new go.Binding("width", "width"),
	   					new go.Binding("height", "height")
					),
	       			$diagram(go.Placeholder)
	        	),
	       		$diagram(
	   				go.Panel, 
	   				"Horizontal",
	   				{ alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom },
	   				$diagram(
						"Button",
						{ click: that.editText },  // defined below, to support editing the text of the node
						$diagram(
							go.TextBlock, 
							"E",
							{ font: "bold 10pt sans-serif", desiredSize: new go.Size(15, 15), maxLines:1, textAlign: "center" }
						)
					), 
		          	$diagram(
		        		"Button",
		        		{
		        			click: that.clickNewLink 
		        	    },
		        	    $diagram(
		       	    		go.Shape,
		       	    		{ geometryString: "M0 0 L8 0 8 12 14 12 M12 10 L14 12 12 14" }
		      	    	)
		      	    ),
		          	$diagram(
		          		"Button",
		          		{ 
		          			_dragData: { text: "a Node", color: "lightgray" },  // node data to copy
		          			click: that.clickNewNode  // defined below, to support a click on the button
		         		},
		            	$diagram(
		            		go.Shape,
		            		{ geometryString: "M0 0 L3 0 3 10 6 10 x F1 M6 6 L14 6 14 14 6 14z", fill: "gray" }
		           		)
		           	)
		        )
		    );
	    }
	    // a selected node shows an Adornment that includes both a blue border
	    // and a row of Buttons above the node
	    that.flowDiagram.groupTemplate.selectionAdornmentTemplate = $diagram(
    		go.Adornment,
    		"Spot",
        	$diagram(
       			go.Panel, 
       			"Auto",
       			$diagram(
   					go.Shape, 
       				{ 
   						stroke: "#FF4500", 
   						strokeWidth: 2, 
   						fill: null 
					},
   					new go.Binding("figure", "figure")
				),
       			$diagram(go.Placeholder)
        	) 
	    );

	    that.flowDiagram.linkTemplate.selectionAdornmentTemplate = $diagram(
    		go.Adornment,
    		$diagram(
				go.Shape,
				{ 
					isPanelMain: true, 
					stroke: "#FF4500", 
					strokeWidth: 2 
				}
			),
            $diagram(
            	go.Shape,
            	{ 
            		toArrow: "Standard", 
            		fill: "#FF4500", 
            		stroke: null 
        		}
        	)
	    ); 
	    
	    that.flowDiagram.addDiagramListener("LinkDrawn",
			function(e) {
				
				var object = that.workflow.addLink(
					{
						fromNodeId:e.subject.data.from,
						toNodeId:e.subject.data.to
					}
				);
				e.subject.data.object = object;
			}
		);
	    
	    that.flowDiagram.addDiagramListener("SelectionDeleting",
			function(e) {
	    		var pCount = e.diagram.selection.count;
	    		if(pCount > 0){
	    			var pArray = e.diagram.selection.toArray();
	    			for(var i=0;i<pCount;i++){
	    				var p = pArray[i];
	    				var object = p.data.object;
	    				if(object.isNode){
	    					if(object.nodeType == nodeTypeLegend.start.name ){
	    						msgBox.alert({info:"不能删除'开始'节点!"});
	    						e.cancel = true;
	    						break;
	    					}
	    					else if( object.nodeType == nodeTypeLegend.end.name ){
	    						msgBox.alert({info:"不能删除'结束'节点!"});
	    						e.cancel = true;
	    						break;
	    					}
	    					else if(object.nodeType == nodeTypeLegend.startParallel.name ){
	    						msgBox.alert({info:"不能删除'并行开始'节点!"});
	    						e.cancel = true;
	    						break;
	    					}
	    					else if( object.nodeType == nodeTypeLegend.endParallel.name ){
	    						msgBox.alert({info:"不能删除'并行结束'节点!"});
	    						e.cancel = true;
	    						break;
	    					}
	    				}     					
	    			}
	    			
	    			if(!msgBox.confirm({info:"确定要删除吗?"})){
	    				e.cancel = true;
	    			}
	    		}
	    	}
	    ); 
	    that.flowDiagram.toolManager.linkingTool.linkValidation = function(fromNode, fromPort, toNode, toPort){
	    	return that.checkLinkToNode(fromNode, toNode); 
	    } 
	}
	
	this.getAllLinks = function(){
		return that.flowDiagram.model.linkDataArray;
	}
	
	this.getFromNodeLinks = function(nodeId){
		var allLinks = this.getAllLinks();
		var resultLinks = new Array();
		var count = allLinks.length;
		for(var i=0;i<count;i++){
			var link = allLinks[i];
			if(link.object.fromNodeId == nodeId){ 
				resultLinks.push(link);
			}
		}
		return resultLinks;
	}
	
	this.getToNodeLinks = function(nodeId){
		var allLinks = this.getAllLinks();
		var resultLinks = new Array();
		var count = allLinks.length;
		for(var i=0;i<count;i++){
			var link = allLinks[i];
			if(link.object.toNodeId == nodeId){ 
				resultLinks.push(link);
			}
		}
		return resultLinks;
	}
	
	this.getNodeObjectById = function(nodeId){
		var allNodes = this.getAllNodes(); 
		var count = allNodes.length;
		for(var i=0;i<count;i++){
			var node = allNodes[i];
			if(node.object.id == nodeId){ 
				return node;
			}
		}
		return null;
	}
	
	this.getAllNodes = function(){
		return that.flowDiagram.model.nodeDataArray;
	}
	
	this.getAllLinks = function(){
		return that.flowDiagram.model.linkDataArray;
	}

    
    this.editText = function(e, button) {
    	var node = button.part.adornedPart;
    	e.diagram.commandHandler.editTextBlock(node.findObject("TEXTBLOCK"));
    } 
    this.clickNewLink = function(e, button) {
    	var node = button.part.adornedPart;
    	var canLinkNext = that.canConnectNext(node);	    	
    	if(canLinkNext){    	
	    	var tool = e.diagram.toolManager.linkingTool;
	    	tool.startObject = node.port;
	    	e.diagram.currentTool = tool;
	    	tool.doActivate();
    	} 
    } 
    
    this.checkLinkToNode = function(fromNode, toNode){
    	var canLinkTo = true;
    	if(toNode.data.object.nodeType == nodeTypeLegend.parallel.name){
    		canLinkTo = false;
		}
		else{
			//如果fromNode是并行结束，那么只允许连接其所在并行分组的外面一层节点
			if(fromNode.data.object.nodeType == nodeTypeLegend.endParallel.name){
				var parallelFNodeObject = this.getNodeObjectById(fromNode.data.object.groupId);
				 
				if(toNode.data.object.nodeType == nodeTypeLegend.startParallel.name){
					var parallelTNodeObject = this.getNodeObjectById(toNode.data.object.groupId); 
			 		if(parallelFNodeObject.group == parallelTNodeObject.group){
			 			if(parallelFNodeObject.id == parallelTNodeObject.id){
			 				//fromNode和toNode是同组的
			 				canLinkTo = false;
			 			}
			 		}
			 		else{
		 				//如果fromNode和toNode节点所在的并行节点不属于同组的
			 			canLinkTo = false;
			 		}
		 		}
		 		else if(parallelFNodeObject.group != toNode.data.object.groupId){
		 			canLinkTo = false;
			 	}		 	
			} 			
			
			//如果fromNode是active节点、判断节点，那么只允许连接其子并行分组的并行开始节点,或者同组内的active节点、开始几点、并行开始节点，或者本组内的并行结束节点
			if(fromNode.data.object.nodeType == nodeTypeLegend.start.name 
			|| fromNode.data.object.nodeType == nodeTypeLegend.startParallel.name
			|| fromNode.data.object.nodeType == nodeTypeLegend.active.name
			|| fromNode.data.object.nodeType == nodeTypeLegend.judge.name){
				if(toNode.data.object.nodeType == nodeTypeLegend.active.name
				||toNode.data.object.nodeType == nodeTypeLegend.judge.name
				||toNode.data.object.nodeType == nodeTypeLegend.endParallel.name 
				||toNode.data.object.nodeType == nodeTypeLegend.end.name
				||toNode.data.object.nodeType == nodeTypeLegend.start.name){
					if(fromNode.data.object.groupId != toNode.data.object.groupId){
			 			canLinkTo = false;
					}
				}
				else if(toNode.data.object.nodeType == nodeTypeLegend.startParallel.name){
					var parallelTNodeObject = this.getNodeObjectById(toNode.data.object.groupId); 
					if(fromNode.data.object.groupId != parallelTNodeObject.group){
			 			canLinkTo = false;
					}
				}
			}  				
		}
		return canLinkTo;
    }
    
    //是否可以连接后续节点
    this.canConnectNext = function(node){
    	if(node.data.object.nodeType == nodeTypeLegend.end.name){ 
			msgBox.alert({info:"结束节点无后续节点."});
			return false;
		}
		else{
	    	var fromNodeLinks = that.getFromNodeLinks(node.data.object.id);
	    	    	
	    	//判断是否可以增加边    	
	    	var canAddLink = false;
	    	if(node.data.object.nodeType == nodeTypeLegend.end.name) {
				var msg = "'" + nodeTypeLegend.end.text + "'类型节点不能指定后续节点.";
				msgBox.alert({info:msg});    	
	    	}
	    	else if(node.data.object.nodeType == nodeTypeLegend.active.name 
	    	|| node.data.object.nodeType == nodeTypeLegend.start.name
	    	|| node.data.object.nodeType == nodeTypeLegend.endParallel.name){
	    		if(fromNodeLinks.length > 0){
	    			var msg = "'" + nodeTypeLegend.active.text + "'类型节点只能包含一个后续节点. 如果存在分支和并行的情况，请创建'" + nodeTypeLegend.judge.text +"'或'" + nodeTypeLegend.parallel.text + "'节点.";
	    			msgBox.alert({info:msg});
	    		}
	    		else{
	    			canAddLink = true;	
	    		}
	    	}
	    	else{
	    			canAddLink = true;	
	    	}
	    	return canAddLink;
    	}
    }
    
    // the Button.click event handler, called when the user clicks the "N" button
    this.clickNewNode = function(e, button) {
    	var data = button._dragData;
    	if (!data) return;
    	var fromNode = button.part.adornedPart;
    	
    	var canLinkNext = that.canConnectNext(fromNode);	    	
    	if(canLinkNext){
			var popContainer = new PopupContainer( {
				width : 200,
				height : 160,
				top : 50
			});
			
			popContainer.show();
	  
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var nameLabelId = frameId + "_nameLabel";
			var typeLabelId = frameId + "_typeLabel";
			var nameTextId = frameId + "_nameText";
			var typeTextId = frameId + "_typeText";
			var buttonContainerId = frameId + "_buttonContainer";
			var okBtnId = frameId + "_ok";
			var cancelBtnId = frameId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
			+ "<div id=\"" + nameLabelId + "\" style=\"witdh:100%;height:20px;font-size:11px;\"></div>"
		 	+ "<div style=\"witdh:100%;height:30px;font-size:11px;text-align:center;\"><input id=\"" + nameTextId + "\" type=\"text\" style=\"width:190px;height:24px;\" /></div>"
		 	+ "<div id=\"" + typeLabelId + "\" style=\"witdh:100%;height:20px;font-size:11px;\"></div>"
		 	+ "<div style=\"witdh:100%;height:30px;font-size:11px;text-align:center;\"><input id=\"" + typeTextId + "\" type=\"text\" style=\"width:190px;height:24px;\" /></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;\"><input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:60px;height:20px;\" />&nbsp;<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:60px;height:20px;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml);
			$("#" + titleId).text("新建节点");
			$("#" + nameLabelId).text("节点名称:");
			$("#" + typeLabelId).text("节点类型:");
			 		
			var nodeTypeRows = nodeTypeLegend.getUserCreateTypeRows;
			$("#" + typeTextId).listDispunit({
				idField:"name",
				textField:"text",
				columns:[[{field:"name",valueType:valueType.string,title:"name",width:0,hidden:true},
				         {field:"text",valueType:valueType.string,title:"节点类型",width:100,hidden:false}]],
				getListFunc:function(p){
					$("#" + typeTextId).listDispunit("showList",nodeTypeRows);
				},
				options:{},
				style:{}}); 
			$("#" + typeTextId).listDispunit("setValue", nodeTypeRows[0]);
	
			$("#" + nameTextId).textDispunit({ 
				options:{},
				style:{}}
			); 
			
			$("#" + okBtnId).click(function(){  
				var typeRow = $("#" + typeTextId).listDispunit("getValue");
				var name = $("#" + nameTextId).textDispunit("getValue");
				if(name == null || name == ""){
					msgBox.alert({info:"请输入节点名称."});
				}
				else if(typeRow == null){
					msgBox.alert({info:"请选择节点类型."});
				}
				else{
					var nodeType = typeRow["name"];
					var succeed = that.createNewNode({
						e:e,
						button:button,
						fromNode : fromNode,
						nodeType:nodeType,
						name:name						 
					});		
					popContainer.close();
				}
			});
			$("#" + cancelBtnId).click(function(){ 
				popContainer.close(); 
			});    	 
		}
    }
    
    this.createNewNode = function(p){  	

    	//结束节点不允许有出边；并行开始、判断节点允许多个出边；并行节点不允许有出边；活动节点、开发节点、并行结束节点允许有一个出边；
    	//当流程到达并行结束节点时，系统判断是否所有的此并行分组内所有的活动都已经执行到并行结束节点，如果是则跳出并行。判断时需要递归判断是否执行到了此并行分组的子并行分组。
    	    	
    	var e = p.e; 
    	var button = p.button; 
    	var fromNode = p.fromNode; 
    	e.diagram.startTransaction("Create Node and Link");
    	var newNodeGroupName = null;  
    	if(fromNode.nodeType == nodeTypeLegend.endParallel.name){
			var parallelNodeObject = this.getNodeObjectById(fromNode.data.object.groupId); 
    		newNodeGroupName = parallelNodeObject.group;
    	}
    	else{
    		newNodeGroupName = fromNode.data.object.groupId;
    	}
    	
    	var pos = this.getNodePosition(fromNode.data);
    	
    	if(p.nodeType == nodeTypeLegend.active.name || p.nodeType == nodeTypeLegend.judge.name){
    		var workflowNode = that.workflow.addNode({
    			nodeType:p.nodeType,
    			positionX:pos.positionX + 160,
    			positionY:pos.positionY,
    			name:p.name,
    			groupId:newNodeGroupName
    		});
	    	var dragramNode = this.initDiagramNode(workflowNode);
        	e.diagram.model.addNodeData(dragramNode);

    		var workflowLink = that.workflow.addLink({
    			fromNodeId: fromNode.data.object.id,
    			toNodeId: workflowNode.id
    		});
	    	var dragramLink = this.initDiagramLink(workflowLink);
        	e.diagram.model.addLinkData(dragramLink);        	
        	
    	}
    	else if(p.nodeType == nodeTypeLegend.parallel.name) {
    		var wpNode = that.workflow.addNode({
    			nodeType:nodeTypeLegend.parallel.name,
    			positionX:pos.positionX + 160,
    			positionY:pos.positionY,
    			name:p.name,
    			groupId:newNodeGroupName
    		});
	    	var dragramPNode = this.initDiagramNode(wpNode);
        	e.diagram.model.addNodeData(dragramPNode);

    		var wspNode = that.workflow.addNode({
    			nodeType:nodeTypeLegend.startParallel.name,
    			positionX:pos.positionX + 160,
    			positionY:pos.positionY,
    			name:nodeTypeLegend.startParallel.text,
    			groupId:wpNode.id
    		});
	    	var dragramSPNode = this.initDiagramNode(wspNode);
        	e.diagram.model.addNodeData(dragramSPNode);

    		var wepNode = that.workflow.addNode({
    			nodeType:nodeTypeLegend.endParallel.name,
    			positionX:pos.positionX + 160,
    			positionY:pos.positionY + 160,
    			name:nodeTypeLegend.endParallel.text,
    			groupId:wpNode.id
    		});
	    	var dragramEPNode = this.initDiagramNode(wepNode);
        	e.diagram.model.addNodeData(dragramEPNode);

    		var workflowLink = that.workflow.addLink({
    			fromNodeId: fromNode.data.object.id,
    			toNodeId: wspNode.id
    		});
	    	var dragramLink = this.initDiagramLink(workflowLink);
        	e.diagram.model.addLinkData(dragramLink); 
    	}
    	e.diagram.commitTransaction("Create Node and Link");
    }
        
    this.refreshDocFieldsInfoFromServer = function(docTypeId){
    	if(docTypeId == null || docTypeId == ""){
    		that.docFields = null;
    	}
    	else {
			var requestParam = {
				docTypeId: docTypeId
			}; 
			serverAccess.request({
				serviceName:"workflowNcpService", 
				funcName:"getDocFields",
				args:{
					requestParam:cmnPcr.jsonToStr(requestParam)
				},  
				successFunc:function(obj){
					var docFieldsFromServer = obj.result.docFields;
					var docFields = new Array();
					for(var i=0;i<docFieldsFromServer.length;i++){
						var fieldFromServer = docFieldsFromServer[i];
						docFields.push({
							name:decodeURIComponent(fieldFromServer.name),
							valueType:fieldFromServer.valueType.toLowerCase(),
							valueTypeDes:fieldFromServer.valueType.toLowerCase(),
							description:decodeURIComponent(fieldFromServer.description)
						});
					}		
					that.docFields = docFields;
				},  
				failFunc:function(obj){  
					var resultStr = "获取相关单据信息!\r\n" + obj.message; 
					$("#" + that.messageControlId).val(resultStr); 
					$("#" + that.layoutId).layout("expand", "east");  
				}
			}); 
		}
    }
    
    this.workflowPropertyEditor = null;
    this.editWorkflowProperties = function(){
    	if(this.workflowPropertyEditor != null){
    		this.workflowPropertyEditor.show();
    	}
    	else{
			var popContainer = new PopupContainer( {
				width : 740,
				height : 280,
				top : 50
			});
			popContainer.show(); 
			var winId = cmnPcr.getRandomValue();
			var titleId = winId + "_title"; 
			var innerContainerId = winId + "_inner";
			var buttonContainerId = winId + "_buttonContainer";
			var okBtnId = winId + "_ok"; 
			var cancelBtnId = winId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
		 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:220px;font-size:11px;text-align:center;overflow:auto;\"></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml); 		
	
			$("#" + titleId).text("流程属性");
			$("#" + that.workflowEditDivId).appendTo("#" + innerContainerId);	
			$("#" + that.workflowEditDivId).css("display", "block");	
			this.workflowPropertyEditor = popContainer;
		
			$("#" + cancelBtnId).click(function(){ 
				popContainer.hide(); 
			});
			
			$("#" + okBtnId).click(function(){ 
				popContainer.hide(); 
				var paramValues =popContainer.paramWin.getParamValues();
				that.workflow.name = paramValues.name;
				that.workflow.docTypeId = paramValues.doctypeid;
				that.workflow.docTypeName = paramValues.doctypename;
				that.workflow.isActive = paramValues.isactive;
				that.workflow.orgId = paramValues.orgid; 
				that.workflow.orgName = paramValues.orgname;  
				that.workflow.description = paramValues.description;	
				that.workflow.abstractExp = paramValues.abstractexp;	  
				
				//重新获取单据类型对应的字段信息
				that.refreshDocFieldsInfoFromServer(that.workflow.docTypeId);
			});
			
			//初始化编辑控件 
			popContainer.paramWin = new NcpParamWin({
				containerId:that.workflowEditDivId,
				paramWinModel:paramWinModels.workflowPropertyEditor
			}); 
			popContainer.paramWin.show(); 
			
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.abstractexp.name, "setAutoPopAfterChange", false);
			
			popContainer.paramWin.addExternalObject({
				beforeDoPop:function(param){
					if(param.paramModel.name == workflowExpType.abstractexp.name) {
						var paramValues = popContainer.paramWin.getParamValues();
						window.currentDocTypeInfo = {fields:that.docFields};
						window.currentNeedResultType = workflowExpType.abstractexp.resultType;
						window.currentRunAt = workflowExpType.abstractexp.getRunAt();
						param.value = paramValues[param.paramModel.name]; 
					}
					return true;
				}
			});
			
			popContainer.paramWin.valueChange = function(jq, newValue){
				var paramName = $(jq).attr("fieldName");
				if(paramName == "doctypename"){
					var value = $(jq).popDispunit("getValue");
					that.refreshDocFieldsInfoFromServer(value.id);
				}
			}			
		}
		
		//显示流程属性值 
		that.workflowPropertyEditor.paramWin.setParamValues({
	    	name:that.workflow.name,  	
			doctypeid:that.workflow.docTypeId,			
			doctypename:{
				id:that.workflow.docTypeId,
				name:that.workflow.docTypeName
			},
			isactive:that.workflow.isActive,
			orgid:that.workflow.orgId,
			orgname:{
				id:that.workflow.orgId,
				name:that.workflow.orgName
			},
			description:that.workflow.description,
			code:that.workflow.code, 
			createusername:that.workflow.createUserName,
			createtime:that.workflow.createTime,
			modifytime:that.workflow.modifyTime,
			abstractexp:{expression:that.workflow.abstractExp}
		});
    }
    
    this.nodePropertyEditor = null;
    this.editNodeProperties = function(np){
    	if(that.nodePropertyEditor != null){
    		that.nodePropertyEditor.show();
    		that.nodePropertyEditor.node = np;
    	}
    	else{
			var popContainer = new PopupContainer( {
				width : 750,
				height : 415,
				top : 50
			});
			popContainer.show(); 
			var winId = cmnPcr.getRandomValue();
			var titleId = winId + "_title"; 
			var innerContainerId = winId + "_inner";
			var buttonContainerId = winId + "_buttonContainer";
			var okBtnId = winId + "_ok"; 
			var cancelBtnId = winId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
		 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:355px;font-size:11px;text-align:center;overflow:auto;\"></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml); 		
	
			$("#" + titleId).text("节点属性");
			$("#" + that.nodeEditDivId).appendTo("#" + innerContainerId);	
			$("#" + that.nodeEditDivId).css("display", "block");	
			that.nodePropertyEditor = popContainer;
			that.nodePropertyEditor.node = np;			
		
			$("#" + cancelBtnId).click(function(){ 
				popContainer.hide(); 
			});
			
			$("#" + okBtnId).click(function(){ 
				popContainer.hide(); 
				 
				var paramValues =popContainer.paramWin.getParamValues();
				var np = that.nodePropertyEditor.node;
		    	np.object.name = paramValues.name; 	
				np.object.triggerType = paramValues.triggertype;
				np.object.statusName = paramValues.statusname;
				np.object.canBackFrom = paramValues.canbackfrom;
				np.object.canBackTo = paramValues.canbackto;
				np.object.actionPageUrl = paramValues.actionpageurl;
				np.object.reviewPageUrl = paramValues.reviewpageurl;
				np.object.userExp = paramValues.userexp;
				np.object.backInExp = paramValues.backinexp;
				np.object.inExp = paramValues.inexp;
				np.object.passExp = paramValues.passexp;
				np.object.ticketExp = paramValues.ticketexp;
				np.object.timingExp = paramValues.timingexp;
				np.object.description = paramValues.description;
				np.object.aisId = paramValues.aisid;
				np.object.aisName = paramValues.aisname;
				np.object.aisParameterConfig = paramValues.aisparameterconfig; 
				
				np.object.aisParameterExp =  that.getAisAllParameterExp(paramValues.aisparameterconfig);
				 
				that.flowDiagram.model.setDataProperty(np.node, "text", paramValues.name);
			});
			
			//初始化编辑控件 
			popContainer.paramWin = new NcpParamWin({
				containerId:that.nodeEditDivId,
				paramWinModel:paramWinModels.workflowNodePropertyEditor
			}); 
			popContainer.paramWin.show(); 
			
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.userexp.name, "setAutoPopAfterChange", false);
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.backinexp.name, "setAutoPopAfterChange", false);
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.inexp.name, "setAutoPopAfterChange", false);
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.passexp.name, "setAutoPopAfterChange", false);
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.ticketexp.name, "setAutoPopAfterChange", false);
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.timingexp.name, "setAutoPopAfterChange", false);
			
			popContainer.paramWin.addExternalObject({
				beforeDoPop:function(param){
					if( param.paramModel.name == workflowExpType.userexp.name
					|| param.paramModel.name == workflowExpType.backinexp.name
					|| param.paramModel.name == workflowExpType.inexp.name
					|| param.paramModel.name == workflowExpType.passexp.name
					|| param.paramModel.name == workflowExpType.ticketexp.name
					|| param.paramModel.name == workflowExpType.timingexp.name) {
						var paramValues = popContainer.paramWin.getParamValues();
						var triggerType = paramValues["triggertype"] == null ? null : paramValues["triggertype"];
						window.currentNodeTriggerType = triggerType;
						window.currentDocTypeInfo = {fields:that.docFields};
						window.currentNeedResultType = workflowExpType[param.paramModel.name].resultType;
						window.currentRunAt = workflowExpType[param.paramModel.name].getRunAt();
						param.value = paramValues[param.paramModel.name]; 
					}
					return true;
				}
			});
			
			popContainer.paramWin.valueChange = function(jq, newValue){
				var paramName = $(jq).attr("fieldName");
				if(paramName == "aisname"){
					var value = $(jq).popDispunit("getValue");
					that.initAisParameterEditor({
						aisParameterConfig : value.parameterconfig, 
						aisParameterExp : "{}"
					});
				}
			}	
			
		}
		
		//显示节点属性值 
		that.nodePropertyEditor.paramWin.setParamValues({
	    	name:np.object.name,  	 
			triggertype:{name:np.object.triggerType},
			statusname:np.object.statusName,
			canbackfrom:np.object.canBackFrom,
			canbackto:np.object.canBackTo,
			actionpageurl:np.object.actionPageUrl,
			reviewpageurl:np.object.reviewPageUrl,
			userexp:{expression:np.object.userExp},
			backinexp:{expression:np.object.backInExp},
			inexp:{expression:np.object.inExp},
			passexp:{expression:np.object.passExp},
			ticketexp:{expression:np.object.ticketExp},
			timingexp:{expression:np.object.timingExp},
			description:np.object.description,
			nodetype:np.object.nodeType, 
			aisname:{id : np.object.aisId, name : np.object.aisName, parameterconfig : np.object.aisParameterConfig}
		});
			
		//初始化异步调用参数设置 
		this.initAisParameterEditor({
			aisParameterConfig : np.object.aisParameterConfig,
			aisParameterExp : np.object.aisParameterExp
		});
    }
    
    this.getAisAllParameterExp = function(aisParameterConfig){
   		var aisParameterConfigObj = cmnPcr.strToJson(aisParameterConfig);
    	var aisPExpObj = {};
   		if(aisParameterConfigObj != null){
	    	var aisPConfigArray = aisParameterConfigObj.parameterConfig;
	    	for(var i=0;i<aisPConfigArray.length;i++){
	    		var aisPConfigObj = aisPConfigArray[i];
	    		var pName = aisPConfigObj.name;	
	    		var expCtrlId = "aisParameterExp_" + pName;    		
	    		var values = $("#" + expCtrlId).popDispunit("getValue");
				aisPExpObj[pName] = values == null ? "" : (values.expression == null ? "" : encodeURIComponent(values.expression));
	    	}
    	}
    	return cmnPcr.jsonToStr(aisPExpObj);
    } 
    
    this.initAisParameterEditor = function(aisP){    
   		var aisParameterConfigObj = cmnPcr.strToJson(aisP.aisParameterConfig);
    	var aisPConfigArray = aisParameterConfigObj == null ? null : aisParameterConfigObj.parameterConfig;
    	var aisPExpObj = cmnPcr.strToJson(aisP.aisParameterExp);
    	for(var pName in aisPExpObj){
    		aisPExpObj[pName] =decodeURIComponent(aisPExpObj[pName]);
    	}
    	
    	var pEditorHtml = "<table style=\"width:100%;height:100%;\">";
    	if(aisPConfigArray != null){
	    	for(var i=0;i<aisPConfigArray.length;i++){
	    		var aisPConfigObj = aisPConfigArray[i];
	    		var pName = aisPConfigObj.name;	
	    		var valueType = aisPConfigObj.valueType;
	    		var pNameCtrlId = "aisParameterName_" + pName; 
	    		var pDescriptionCtrlId = "aisParameterDescription_" + pName; 
	    		var expCtrlId = "aisParameterExp_" + pName;    		
	    		pEditorHtml += ("<tr style=\"height:28px;\"><td style=\"width:80px;text-align:right;\" id=\"" + pNameCtrlId + "\">"
	    			+ "</td>"
	    			+ "<td style=\"width:350px;\">"
	    			+ "<input id=\"" + expCtrlId + "\"  style=\"width:350px;height:22px;\"/>"
	    			+ "</td><td id=\"" + pDescriptionCtrlId + "\">"
	    			+ "</td></tr>");    		
	    	}
    	}
		pEditorHtml += "</table>"; 
    	$("#" + that.aisParameterContainerId).html(pEditorHtml);
    	if(aisPConfigArray != null){
	    	for(var i=0;i<aisPConfigArray.length;i++){
	    		var aisPConfigObj = aisPConfigArray[i];
	    		var pName = aisPConfigObj.name;	
	    		var valueType = aisPConfigObj.valueType;
	    		var description = aisPConfigObj.description;
	    		var exp = aisPExpObj[pName] == null ? "" : decodeURIComponent(aisPExpObj[pName]);   
	    		var pNameCtrlId = "aisParameterName_" + pName;
	    		var pDescriptionCtrlId = "aisParameterDescription_" + pName; 
	    		var expCtrlId = "aisParameterExp_" + pName;    		   		
	    		$("#" + pNameCtrlId).text(pName);		   		
	    		$("#" + pDescriptionCtrlId).text(valueType + " " + (description == null ? "" : description));
	    		$("#" + expCtrlId).attr("pName", pName);
	    		$("#" + expCtrlId).attr("valueType", valueType.toLowerCase());
	    		$("#" + expCtrlId).attr("exp", exp);
	    		
	    		$("#" + expCtrlId).popDispunit({
					idField : null,
					textField : "expression",
					showPopFunc : function(sp) {				
						window.currentDocTypeInfo = {fields:that.docFields}; 
						window.currentNeedResultType = $("#" + sp.options.expCtrlId).attr("valueType");
						window.currentRunAt = expRunAt.server;
						window.currentExpCtrId = sp.options.expCtrlId;
						var expressionObj = $("#" + sp.options.expCtrlId).popDispunit("getValue");
						var popContainer = new PopupContainer({width:700,
							height:400,
							top:50});
						popContainer.show();
						var initParam = {
							closeWin : function(cp){ 
								var expression = "";
								if(cp.selectedRows != undefined){ 
									for(var rowId in cp.selectedRows){ 
										var selectedRow = cp.selectedRows[rowId];								
										$("#" + sp.options.expCtrlId).popDispunit("setValue", {expression : selectedRow.expression});
										break;
									}
								}							
								popContainer.close();  
							},
							value:  sp.value == null ? (expressionObj == null ? "" : expressionObj.expression) : sp.value,
							isMultiValue:false,
							showField : "expression",
							paramField : "expression"
						}
						window.popInitParam = initParam; 
	
						var popPageUrl = basePath + "/page/pop/view_EditWorkflowExpression.jsp";					
						 
						var frameId = cmnPcr.getRandomValue();
						var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
						$("#" + popContainer.containerId).html(iFrameHtml);
						$("#" + frameId).attr("src", popPageUrl);	
					},
					options:{
						fieldName : "expression",
						expCtrlId : expCtrlId
					},
					style : {}
				});
	    		$("#" + expCtrlId).popDispunit("setValue", {expression : exp});
	    	}
    	}
    }
    
    this.linkPropertyEditor = null;
    this.editLinkProperties = function(lp){
    	if(that.linkPropertyEditor != null){
    		that.linkPropertyEditor.show();
    		that.linkPropertyEditor.link = lp;
    	}
    	else{
			var popContainer = new PopupContainer( {
				width : 740,
				height : 200,
				top : 50
			});
			popContainer.show(); 
			var winId = cmnPcr.getRandomValue();
			var titleId = winId + "_title"; 
			var innerContainerId = winId + "_inner";
			var buttonContainerId = winId + "_buttonContainer";
			var okBtnId = winId + "_ok"; 
			var cancelBtnId = winId + "_cancel";
			var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
		 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:140px;font-size:11px;text-align:center;overflow:auto;\"></div>"
		 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
		 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
		 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
			$("#" + popContainer.containerId).html(innerHtml); 		
	
			$("#" + titleId).text("边属性");
			$("#" + that.linkEditDivId).appendTo("#" + innerContainerId);	
			$("#" + that.linkEditDivId).css("display", "block");	
			that.linkPropertyEditor = popContainer;
    		that.linkPropertyEditor.link = lp;
		
			$("#" + cancelBtnId).click(function(){ 
				popContainer.hide(); 
			});
			
			$("#" + okBtnId).click(function(){ 
				popContainer.hide(); 
				var paramValues =popContainer.paramWin.getParamValues();
				var lp = that.linkPropertyEditor.link;
				
				lp.object.name = paramValues.name;
				lp.object.lineType = paramValues.linetype;
				lp.object.conditionExp = paramValues.conditionexp;
				lp.object.description = paramValues.description;
				 
				that.flowDiagram.model.setDataProperty(lp.link, "text", paramValues.name);
				var linkLegend = linkTypeLegend[paramValues.linetype];
				that.flowDiagram.model.setDataProperty(lp.link, "routing", linkLegend == null ? linkTypeLegend.normal.drawType : linkLegend.drawType);
			});
			
			//初始化编辑控件 
			popContainer.paramWin = new NcpParamWin({
				containerId:that.linkEditDivId,
				paramWinModel:paramWinModels.workflowLinkPropertyEditor
			}); 
			popContainer.paramWin.show(); 
			
			popContainer.paramWin.doCtrlMethodByParamName(workflowExpType.conditionexp.name, "setAutoPopAfterChange", false); 
			
			popContainer.paramWin.addExternalObject({
				beforeDoPop:function(param){
					if(param.paramModel.name == workflowExpType.conditionexp.name) {
						var paramValues = popContainer.paramWin.getParamValues();
						var triggerType = paramValues["triggertype"] == null ? null : paramValues["triggertype"];
						window.currentNodeTriggerType = triggerType;
						window.currentDocTypeInfo = {fields: that.docFields};
						window.currentNeedResultType = workflowExpType.conditionexp.resultType;
						window.currentRunAt = workflowExpType.conditionexp.getRunAt();
						param.value = paramValues[param.paramModel.name]; 
					}
					return true;
				}
			});
		}
		
		//显示边属性值
		that.linkPropertyEditor.paramWin.setParamValues({
			name:lp.object.name,
	    	linetype:{name:lp.object.lineType},
			conditionexp:{expression:lp.object.conditionExp},
			description:lp.object.description
		});
    } 
}