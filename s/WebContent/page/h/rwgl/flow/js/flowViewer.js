function FlowViewer(){
	var that = this;
	
	this.containerId = null; 
	this.dataObject = null;
	this.onChangedNodeSelection = null;
	
	this.myDiagram = null;
	
	this.getToSteps = function(fromStepId, stepHash){
		var tempSteps = new Array();
		for(var i = 0; i < this.dataObject.stepLinks.length; i++){
			var stepLink = this.dataObject.stepLinks[i];
			if(stepLink.fromStepId == fromStepId){
				var tempStep = stepHash[stepLink.toStepId];
				tempSteps.push(tempStep);
			}
		}
		return tempSteps;
	}
	
	this.changedNodeSelection = function(stepIds){
		if(that.onChangedNodeSelection != null){
			that.onChangedNodeSelection(stepIds);
		}
	}
	
	this.initPosition = function(step, positionX, positionY, pointMaps){
		var toSteps = step.toSteps;
		for(var i = 0; i < toSteps.length; i++){
			var toStep = toSteps[i];
			if(toStep.x ==null){
				var posStr = positionX + "_" + positionY;
				while(pointMaps[posStr]){
					positionY++;
					posStr = positionX + "_" + positionY;
				}
				toStep.x = positionX;				
				toStep.y = positionY;
				pointMaps[posStr] = true;
				this.initPosition(toStep, positionX + 1, 0, pointMaps);			
			}
		}
	}
	
	this.show = function(p){
		this.containerId = p.containerId;
		this.dataObject = p.dataObject;
		this.onChangedNodeSelection = p.onChangedNodeSelection;
		
		this.initViewer();		
		
		var startStep = null;
		var stepHash = new Object();
		for(var i = 0; i < this.dataObject.steps.length; i++){
			var step = this.dataObject.steps[i];
			stepHash[step.id] = step;
			if(step.operateType == "create"){
				startStep = step;
			}
		}
		
		for(var i = 0; i < this.dataObject.steps.length; i++){
			var step = this.dataObject.steps[i];
			step.toSteps = that.getToSteps(step.id, stepHash);
		}
		
		var pointMaps = new Object();
		startStep.x = 0;
		startStep.y = 0;
		pointMaps[startStep.x + "_" + startStep.y] = true;
		this.initPosition(startStep, 1, 0, pointMaps);
		
		var viewerColWidth = 120;
		var viewerRowHeight = 60;
		var nodeDataArray = new Array();
		for(var i = 0; i < this.dataObject.steps.length; i++){
			var step = this.dataObject.steps[i];
			var node = {"key": step.id, "color": step.color, "isNode": true};
			if(step.operateType == "create"){
				node["category"] = "Start";
				node["text"] = step.processUserName;
			}
			else if(step.operateType == "end"){
				node["category"] = "End";
				node["text"] = "完成";
			}
			else{
				node["text"] = step.processUserName;
			}
			node["loc"] = (step.x * viewerColWidth) + " " + (step.y * viewerRowHeight); 
			nodeDataArray.push(node);
		}
		
		var linkDataArray = new Array();
		for(var i = 0; i < this.dataObject.stepLinks.length; i++){
			var stepLink = this.dataObject.stepLinks[i];
			linkDataArray.push({
				"isLink": true,
				"from": stepLink.fromStepId, 
				"to": stepLink.toStepId, 
				"fromPort": "R", 
				"toPort": "L"
			});
		}
				
		that.myDiagram.model = go.Model.fromJson({ 
			"class": "go.GraphLinksModel",
			"linkFromPortIdProperty": "fromPort",
			"linkToPortIdProperty": "toPort",
			"nodeDataArray": nodeDataArray,
			"linkDataArray": linkDataArray
		});
	}
	
	
  	this.initViewer = function() { 
    	var $diagram = go.GraphObject.make;  // for conciseness in defining templates

    	that.myDiagram = $diagram(go.Diagram, this.containerId,  // must name or refer to the DIV HTML element
			{
				initialContentAlignment: go.Spot.Center,
	        	allowDrop: true,  // must be true to accept drops from the Palette
				"LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
				"LinkRelinked": showLinkLabel,
				"animationManager.duration": 800, // slightly longer than default (600ms) animation
				"undoManager.isEnabled": true  // enable undo & redo
	        });

		// when the document is modified, add a "*" to the title and enable the "Save" button
    	that.myDiagram.addDiagramListener("ChangedSelection", function(e) { 
    		var pCount = e.diagram.selection.count;
    		if(pCount > 0){
    			var pArray = e.diagram.selection.toArray();
    			var selectedStepIds = new Array();
    			for(var i=0;i<pCount;i++){
    				var p = pArray[i];
    				var dataObject = p.data;
    				if(dataObject.isNode){
    					selectedStepIds.push(dataObject.key);
    				}
				}
				that.changedNodeSelection(selectedStepIds);
			}
		});
		
    	that.myDiagram.addDiagramListener("Modified", function(e) {
      		var button = document.getElementById("SaveButton");
      		if (button) {
      			button.disabled = !that.myDiagram.isModified;
  			}
      		var idx = document.title.indexOf("*");
      		if (that.myDiagram.isModified) {
        		if (idx < 0) document.title += "*";
      		} 
      		else {
        		if (idx >= 0) {
        			document.title = document.title.substr(0, idx);
    			}
      		}
		});

    	// helper definitions for node templates
    	function nodeStyle() {
      		return [
	        	// The Node.location comes from the "loc" property of the node data,
	       		// converted by the Point.parse static method.
	        	// If the Node.location is changed, it updates the "loc" property of the node data,
	        	// converting back using the Point.stringify static method.
	        	new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
	          		// the Node.location is at the center of each node
	          		locationSpot: go.Spot.Center,
	          		//isShadowed: true,
	          		//shadowColor: "#888",
	          		// handle mouse enter/leave events to show/hide the ports
	         		mouseEnter: function (e, obj) { },
	          		mouseLeave: function (e, obj) { }
	        	}
	      	];
	    }

    	// Define a function for creating a "port" that is normally transparent.
    	// The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    	// and where the port is positioned on the node, and the boolean "output" and "input" arguments
    	// control whether the user can draw links from or to the port.
    	function makePort(name, spot, output, input) {
      		// the port is basically just a small circle that has a white stroke when it is made visible
      		return $diagram(go.Shape, "Circle", {
            	fill: "transparent",
           		stroke: null,  // this is changed to "white" in the showPorts function
            	desiredSize: new go.Size(8, 8),
            	alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
            	portId: name,  // declare this object to be a "port"
            	fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
            	fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
            	cursor: "pointer"  // show a different cursor to indicate potential link point
            });
    	}

    	// define the Node templates for regular nodes
		var lightText = 'whitesmoke';

    	that.myDiagram.nodeTemplateMap.add("",  // the default category
      		$diagram(go.Node, "Spot", nodeStyle(),
        	// the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        	$diagram(go.Panel, "Auto",
          		$diagram(go.Shape, "RoundedRectangle", {
          			//fill: "#00A9C9", 
		            stroke: "gray",
		            strokeWidth: 0,
		            desiredSize: new go.Size(70, 30), 
		            alignment: go.Spot.Center
              		}, 
      				new go.Binding("fill", "color"), 
      				new go.Binding("figure", "figure")),
          		$diagram(go.TextBlock, {
              		font: "bold 10pt Helvetica, Arial, sans-serif",
              		stroke: lightText,
              		textAlign: "center",
              		margin: 1,  
              		editable: false
	            	},
	            	new go.Binding("text").makeTwoWay()
            	)
    		),
	        // four named ports, one on each side:
	        makePort("T", go.Spot.Top, false, true),
	        makePort("L", go.Spot.Left, true, true),
	        makePort("R", go.Spot.Right, true, true),
	        makePort("B", go.Spot.Bottom, true, false)
      	));

    	that.myDiagram.nodeTemplateMap.add("Start",
      		$diagram(go.Node, "Spot", nodeStyle(),
        		$diagram(go.Panel, "Auto",
         		$diagram(go.Shape, "Ellipse", 
         			{
         				minSize: new go.Size(70, 35), 
     					//fill: "#79C9FF", 
     					stroke: null 
 					}, 
      				new go.Binding("fill", "color")),
          		$diagram(go.TextBlock, "Start", { font: "bold 10pt Helvetica, Arial, sans-serif", stroke: lightText }, new go.Binding("text"))
        	),
	        // three named ports, one on each side except the top, all output only:
	        makePort("L", go.Spot.Left, true, false),
	        makePort("R", go.Spot.Right, true, false),
	        makePort("B", go.Spot.Bottom, true, false)
		));

    	that.myDiagram.nodeTemplateMap.add("End",
      		$diagram(go.Node, "Spot", nodeStyle(),
        		$diagram(go.Panel, "Auto",
          		$diagram(go.Shape, "Ellipse", 
          			{ 
          				minSize: new go.Size(70, 35), 
          				//fill: "#DC3C00", 
          				stroke: null 
      				}, 
      				new go.Binding("fill", "color")),
          		$diagram(go.TextBlock, "End", { font: "bold 10pt Helvetica, Arial, sans-serif", stroke: lightText }, new go.Binding("text"))
	        ),
	        // three named ports, one on each side except the bottom, all input only:
	        makePort("T", go.Spot.Top, false, true),
	        makePort("L", go.Spot.Left, false, true),
	        makePort("R", go.Spot.Right, false, true)
		));	
 
    	// replace the default Link template in the linkTemplateMap
    	that.myDiagram.linkTemplate =
      		$diagram(go.Link, {
          		routing: go.Link.AvoidsNodes,
          		curve: go.Link.JumpOver,
				corner: 5, toShortLength: 4,
				relinkableFrom: false,
				relinkableTo: false,
				reshapable: true,
				resegmentable: true,
				// mouse-overs subtly highlight links:
				mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
				mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        	},
        	new go.Binding("points").makeTwoWay(),
        	$diagram(go.Shape,  // the highlight shape, normally transparent
          		{ isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        	$diagram(go.Shape,  // the link path shape
          		{ isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        	$diagram(go.Shape,  // the arrowhead
         		{ toArrow: "standard", stroke: null, fill: "gray"}),
       		$diagram(go.Panel, "Auto",  // the link label, normally not visible
          		{ visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          	new go.Binding("visible", "visible").makeTwoWay(),
          	$diagram(go.Shape, "RoundedRectangle",  // the label shape
            		{ fill: "#F8F8F8", stroke: null }),
          	$diagram(go.TextBlock, "Yes",  // the label
            	{
              		textAlign: "center",
              		font: "10pt helvetica, arial, sans-serif",
             		stroke: "#333333",
              	editable: true
            	},
            	new go.Binding("text").makeTwoWay())
        	)
      	);

	    // Make link labels visible if coming out of a "conditional" node.
	    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
	    function showLinkLabel(e) {
      		var label = e.subject.findObject("LABEL");
      		if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
		}

	    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
	    that.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
	    that.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
 
	    // The following code overrides GoJS focus to stop the browser from scrolling
	    // the page when either the Diagram or Palette are clicked or dragged onto.
	
	    function customFocus() {
	      	var x = window.scrollX || window.pageXOffset;
	      	var y = window.scrollY || window.pageYOffset;
	      	go.Diagram.prototype.doFocus.call(this);
	      	window.scrollTo(x, y);
	    }
	
	    that.myDiagram.doFocus = customFocus; 
  	} // end init
 
}