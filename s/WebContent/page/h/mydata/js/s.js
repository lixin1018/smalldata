var paramWin = null;
$(document).ready(function(){
	var paramWinContainerId = "paramWinId";
	paramWin = new NcpParamWin({
		containerId: paramWinContainerId,
		paramWinModel: paramWinModels.myDataSendParam
	});
	paramWin.show();
	
	var queryStrings = cmnPcr.getQueryStringArgs();
	var dirId = queryStrings["did"];
	
	paramWin.setParamValues({
		touser: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["toUser"])),
		senddate: cmnPcr.strToDate(queryStrings["sendDate"]),
		filename: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["fileName"])),
		message: cmnPcr.decodeURI(cmnPcr.decodeURI(queryStrings["message"]))
	});
		
	$("#" + paramWinContainerId).find("a[name=\"queryUserBtn\"]").click(function(){		
		var paramValues = paramWin.getParamValues();
		var toUser = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.touser));
		var sendDateStr = cmnPcr.datetimeToStr(paramValues.senddate, "yyyy-MM-dd");
		var fileName = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.filename));
		var message = cmnPcr.encodeURI(cmnPcr.encodeURI(paramValues.message));
		window.location.href = "s.jsp?toUser=" + toUser + "&sendDate=" + sendDateStr + "&fileName=" + fileName + "&message=" + message;
		return false;
	});
});