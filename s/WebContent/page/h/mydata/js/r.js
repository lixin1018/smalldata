var paramWin = null;
$(document).ready(function(){
	var paramWinContainerId = "paramWinId";
	paramWin = new NcpParamWin({
		containerId: paramWinContainerId,
		paramWinModel: paramWinModels.myDataReceiveParam
	});
	paramWin.show();
	
	var queryStrings = cmnPcr.getQueryStringArgs();
	var dirId = queryStrings["did"];
	
	paramWin.setParamValues({
		fromuser: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["fromUser"])),
		touser: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["toUser"])),
		receivedate: cmnPcr.strToDate(queryStrings["receiveDate"]),
		filename: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["fileName"])),
		message: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["message"]))
	});
		
	$("#" + paramWinContainerId).find("a[name=\"queryUserBtn\"]").click(function(){		
		var paramValues = paramWin.getParamValues();
		var fromUser = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.fromuser));
		var toUser = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.touser));
		var receiveDateStr = cmnPcr.datetimeToStr(paramValues.receivedate, "yyyy-MM-dd");
		var fileName = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.filename));
		var message = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.message));
		window.location.href = "r.jsp?fromUser=" + fromUser + "&toUser=" + toUser + "&receiveDate=" + receiveDateStr + "&fileName=" + fileName + "&message=" + message;
		return false;
	});
});