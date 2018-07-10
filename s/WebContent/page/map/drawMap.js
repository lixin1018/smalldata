var boundaryList = {};

function drawMapBoundary(p){	
	var svgWidth = p.canvasWidth - p.borderWidth * 2;
	var svgHeight = p.canvasHeight - p.borderWidth * 2;
	var blankX = 0;
	var blankY = 0;
	var maxX = p.boundaryInfo.maxX;
	var maxY = p.boundaryInfo.maxY;
	var minX = p.boundaryInfo.minX;
	var minY = p.boundaryInfo.minY;	
	var allDistrictMainPoints = p.allDistrictMainPoints;
	var allNamePoints = p.allNamePoints;	
	
	var xyDefaultScale = 1.1 -  Math.sin((maxY + minY) * 3.1415 / (4 * 90)) / 2;
	
	var ignoreRadius = 2;
	
	var canvasScale = svgWidth / svgHeight;
	
	var realScale = xyDefaultScale * (maxX - minX) / (maxY - minY);
	var zoomScale = 1;
	
	if(canvasScale > realScale){
		blankX = (svgWidth - svgHeight * xyDefaultScale * (maxX - minX) / (maxY - minY)) / 2;
		zoomScale = svgHeight / (maxY - minY);
	}
	else{
		blankY = (svgHeight - svgWidth * (maxY - minY) / ((maxX - minX) * xyDefaultScale)) / 2;
		zoomScale = svgWidth / ((maxX - minX) * xyDefaultScale);
	}
	getSvgBoundariesHtml({
		svgElementId: p.svgElementId,
		code: p.boundaryInfo.code,
		name: p.boundaryInfo.name, 
		level: 1,
		boundaryArray: p.boundaryInfo.boundaryArray, 
		ignoreRadius: ignoreRadius, 
		xyDefaultScale: xyDefaultScale, 
		zoomScale: zoomScale, 
		svgWidth: svgWidth, 
		svgHeight: svgHeight, 
		blankX: blankX, 
		blankY: blankY, 
		borderWidth: p.borderWidth,
		minX: minX, 
		minY: minY, 
		fillColor: "#eeeeee", 
		strokeColor: "#888888", 
		strokeWidth: 1, 
		smallPolygonfillColor: "#eeeeee", 
		smallPolygonStrokeColor: "#bbbbbb", 
		smallPolygonFtrokeWidth: 0, 
		strokeDasharray: null});
	
	var nextLevelArray = p.boundaryInfo.nextLevelArray;
	for(var i = 0; i < nextLevelArray.length; i++){
		nextLevelDistrict = nextLevelArray[i];
		getSvgBoundariesHtml({
			svgElementId: p.svgElementId,
			code: nextLevelDistrict.code, 
			name: nextLevelDistrict.name, 
			level: 2,
			boundaryArray: nextLevelDistrict.boundaryArray, 
			ignoreRadius: ignoreRadius, 
			xyDefaultScale: xyDefaultScale, 
			zoomScale: zoomScale, 
			svgWidth: svgWidth, 
			svgHeight: svgHeight, 
			blankX: blankX, 
			blankY: blankY, 
			borderWidth: p.borderWidth,
			minX: minX, 
			minY: minY, 
			fillColor: "#eeeeee", 
			strokeColor: "#bbbbbb", 
			strokeWidth: 0.5, 
			smallPolygonfillColor: "#eeeeee", 
			smallPolygonStrokeColor: "#bbbbbb", 
			smallPolygonFtrokeWidth: 0.5, 
			strokeDasharray: "1"}); 
	}
	for(var i = 0; i < nextLevelArray.length; i++){
		nextLevelDistrict = nextLevelArray[i]; 
		var districtMainPoint = allDistrictMainPoints[nextLevelDistrict.code];
		var namePoint = allNamePoints[nextLevelDistrict.code];
		addSvgText({
			svgElementId: p.svgElementId,
			point: namePoint.point_x + "," + namePoint.point_y,  
			capitalPoint: districtMainPoint.point_x + "," + districtMainPoint.point_y,  
			code: districtMainPoint.code,
			name: districtMainPoint.name,
			xyDefaultScale: xyDefaultScale,
			zoomScale: zoomScale, 
			svgWidth: svgWidth,
			svgHeight: svgHeight, 
			blankX: blankX, 
			blankY: blankY, 
			borderWidth: p.borderWidth,
			stokeColor: "#888888", 
			textColor: "#444444", 
			minX: minX, 
			minY: minY});
	}
}
	
function groupMouseover(domElement){ 
	setTimeout(function(){
		var code = $(domElement).attr("code");
		alertArea({
			code: code,
			fillColor: "#6BB5EA",
			strokeColor: "#6BB5EA"
		});  
	}, 100);
} 

function groupMouseout(domElement){ 
	setTimeout(function(){
		var code = $(domElement).attr("code"); 
		disalertArea({
			code: code,
			fillColor: "#eeeeee",
			strokeColor: "#bbbbbb"
		}); 
	}, 100);
} 

function alertArea(p){	
	var code = p.code;
	var polygonId = "#" + code + "_districtPolygon";
	var districtTextId = "#" + code + "_districtText";
	var circlePointId = "#" + code + "_circlePoint";
	$(polygonId).attr("isCurrent", true);
	$(polygonId).find("polygon").css({fill: p.fillColor}); 
	$(polygonId).find("polygon").css({stroke: p.strokeColor});  
	$(districtTextId).css({display: p.showName ? "block" : "none"});
	$(circlePointId).css({display: p.govPoint ? "block" : "none"}); 
}

function disalertArea(p){	
	var code = p.code; 
	var polygonId = "#" + code + "_districtPolygon";
	var districtTextId = "#" + code + "_districtText";
	var circlePointId = "#" + code + "_circlePoint";
	$(polygonId).attr("isCurrent", false);
	$(polygonId).find("polygon").css({fill: p.fillColor}); 
	$(polygonId).find("polygon").css({stroke: p.strokeColor});
	$(districtTextId).css({display: "none"});
	$(circlePointId).css({display: "none"}); 
}

function getSvgBoundariesHtml(p){ 

　　var svgDom = $("#" + p.svgElementId)[0];
	var groupDom = document.createElementNS("http://www.w3.org/2000/svg", "g");
	groupDom.setAttribute("id", p.code + "_districtPolygon");
	groupDom.setAttribute("code", p.code);
　　svgDom.appendChild(groupDom); 
	if(p.level == 2){
		groupDom.addEventListener("mouseover", function(){groupMouseover(this);}, false);
		groupDom.addEventListener("mouseout", function(){groupMouseout(this);}, false);
	}
	for(var i = 0; i < p.boundaryArray.length; i++){ 
		var boundary = p.boundaryArray[i].trim();
		var points = boundary.split(" ");				
		var allPointStr = "";
		var lastPointStr = "";
		var lastSvgPoint = null;
		var enableSvgPoint = 0; 
		for(var j = 0; j < points.length; j++){
			var point = points[j];
			var svgPoint = getSvgNamePoint({
				point: point, 
				xyDefaultScale: p.xyDefaultScale,
				zoomScale: p.zoomScale, 
				svgWidth: p.svgWidth,
				svgHeight: p.svgHeight, 
				blankX: p.blankX, 
				blankY: p.blankY, 
				borderWidth: p.borderWidth,
				minX: p.minX, 
				minY: p.minY});
								
			if(lastSvgPoint ==null || p.ignoreRadius * p.ignoreRadius < ( (svgPoint.x - lastSvgPoint.x ) * (svgPoint.x - lastSvgPoint.x ) + (svgPoint.y - lastSvgPoint.y ) * (svgPoint.y - lastSvgPoint.y ) )){
				var pointStr = svgPoint.x + "," + svgPoint.y + " ";	
				allPointStr += pointStr;
				lastSvgPoint = svgPoint;
				enableSvgPoint++;
			}
		}
		
		var polygonDom = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	　　groupDom.appendChild(polygonDom);
		if(enableSvgPoint < 8){
			allPointStr = (svgPoint.x + "," + svgPoint.y + " ") + ((svgPoint.x + 1) + "," + svgPoint.y + " ") + (svgPoint.x + "," + (svgPoint.y + 1) + " ") + (svgPoint.x+ "," + svgPoint.y + " ");
 			polygonDom.setAttribute("points", allPointStr);
			polygonDom.setAttribute("style", "fill:" + p.smallPolygonfillColor+ ";stroke:" + p.smallPolygonStrokeColor + ";" + (p.smallPolygonStrokeDasharray == null ? "" : ("stroke-dasharray:" + p.smallPolygonStrokeDasharray + ";")) + "stroke-width:" + p.smallPolygonStrokeWidth);
		} 
		else{
 			polygonDom.setAttribute("points", allPointStr);
			polygonDom.setAttribute("style", "fill:" + p.fillColor+ ";stroke:" + p.strokeColor + ";" + (p.strokeDasharray == null ? "" : ("stroke-dasharray:" + p.strokeDasharray + ";")) + "stroke-width:" + p.strokeWidth);
		} 
	} 
}



function getSvgNamePoint(p){
	var xy = p.point.split(",");
	var x = parseFloat(xy[0])
	var y = parseFloat(xy[1])
	x = p.borderWidth + p.zoomScale * p.xyDefaultScale * (x - p.minX) + p.blankX;
	y = p.borderWidth - (p.zoomScale * (y - p.minY) + p.blankY - p. svgHeight); 
	return {x: x, y: y};			
}
function getSvgCapitalPoint(p){
	var xy = p.capitalPoint.split(",");
	var x = parseFloat(xy[0])
	var y = parseFloat(xy[1])
	x = p.borderWidth + p.zoomScale * p.xyDefaultScale * (x - p.minX) + p.blankX;
	y = p.borderWidth - (p.zoomScale * (y - p.minY) + p.blankY - p. svgHeight); 
	return {x: x, y: y};			
}

function addSvgText(p){
	var svgDom = $("#" + p.svgElementId)[0];
	var namPoint = getSvgNamePoint(p);
	var capitalPoint = getSvgCapitalPoint(p);
	
	var circleDom = document.createElementNS("http://www.w3.org/2000/svg", "circle");
　　circleDom.setAttribute("cx", capitalPoint.x);
　　circleDom.setAttribute("cy", capitalPoint.y); 
　　circleDom.setAttribute("r", 2);   
　　circleDom.setAttribute("style", "display:none;"); 
　　circleDom.setAttribute("stroke-width", 2);  
　　circleDom.setAttribute("stroke", p.stokeColor);  
　　circleDom.setAttribute("fill", "transparent");  
	circleDom.setAttribute("id", p.code + "_circlePoint");
	circleDom.setAttribute("code", p.code);
	svgDom.appendChild(circleDom); 	
	circleDom.addEventListener("mouseover", function(){groupMouseover(this);}, false);
	circleDom.addEventListener("mouseout", function(){groupMouseout(this);}, false);
	
	var textDom = document.createElementNS("http://www.w3.org/2000/svg", "text");
　　textDom.setAttribute("x", namPoint.x);
　　textDom.setAttribute("y", namPoint.y); 
　　textDom.setAttribute("fill", p.textColor); 
　　textDom.setAttribute("style", "display:none;"); 
　　textDom.setAttribute("font-size", "15"); 
　　textDom.setAttribute("text-anchor", "middle"); 
　　textDom.setAttribute("dominant-baseline", "middle"); 
	textDom.setAttribute("id", p.code + "_districtText");
	textDom.setAttribute("code", p.code);
	svgDom.appendChild(textDom); 		
		
	var textNode = document.createTextNode(p.name);
	textDom.appendChild(textNode);	
	textDom.addEventListener("mouseover", function(){groupMouseover(this);}, false);
	textDom.addEventListener("mouseout", function(){groupMouseout(this);}, false);
	
}