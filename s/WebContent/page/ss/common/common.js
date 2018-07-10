 function ShuShuoDataAccess(){
 	var that = this;
 	
 	this.getData = function(p){
		serverAccess.request({
			serviceName:"shuShuoNcpService",
			funcName:"getData",
		    args:{requestParam: cmnPcr.jsonToStr({
		    	code: encodeURIComponent(p.code)
	    	})}, 
			successFunc:function(obj){ 
				var rows = that.convertData(obj.result.table.rows);
				p.afterGetDataFunc(rows);
			}
		});
	}
	
	this.convertData = function(serverRows){
		var rows = new Array();
		for(var i = 0; i < serverRows.length; i++){
			var serverRow = serverRows[i];
			var row = {};
			for(var k in serverRow){
				var tempValue = serverRow[k];
				tempValue = cmnPcr.replace(tempValue, "\\\\\"", "\"");
				tempValue = cmnPcr.replace(tempValue, "\\\\r", "\r");
				tempValue = cmnPcr.replace(tempValue, "\\\\n", "\n");
				row[k] = tempValue;
			}
			rows.push(row);
		}
		return rows;
	}
 	
 	this.getSSPlayInfo = function(p){
		serverAccess.request({
			serviceName:"shuShuoNcpService",
			funcName:"getSSPlayInfo",
		    args:{requestParam: cmnPcr.jsonToStr({
		    	code: encodeURIComponent(p.code)
	    	})}, 
			successFunc:function(obj){ 
				var ssPalyInfo = that.convertSSPlayInfo(obj.result);
				p.afterGetSSPlayInfoFunc(ssPalyInfo);
			}
		});
	}
	
	this.convertSSPlayInfo = function(p){
		var playInfo = {
			code: decodeURIComponent(p.code),
			title: decodeURIComponent(p.title),
			description: decodeURIComponent(p.description),
			tag: decodeURIComponent(p.tag)
		} 
		return playInfo;
	}
}