//对话框
var excelCommonFunction = {
	//sum
	sum:function(rangeValue){ 
 		var resultValue = 0;
		var values = rangeValue.getValues();
		for(var i = 0; i < values.length; i++){
			var rowValues = values[i];
			for(var j = 0; j < rowValues.length; j++){
				var value = rowValues[j];
				if(value != null && value != ""){
					if(cmnPcr.isDecimal(value)){
						var valueNum = parseFloat(value);
						resultValue = cmnPcr.floatAdd(resultValue, valueNum);
					}
					else{
						throw new Error("无法进行sum运算, 值为" + value);
					} 
				}
			}
		}
		return resultValue;		 
	 },
	
	//average
	average:function(rangeValue){ 
 		var resultValue = 0;
		var values = rangeValue.getValues();
		var count = 0;
		for(var i = 0; i < values.length; i++){
			var rowValues = values[i];
			for(var j = 0; j < rowValues.length; j++){
				var value = rowValues[j];
				if(value != null && value != ""){
					if(cmnPcr.isDecimal(value)){
						var valueNum = parseFloat(value);
						resultValue = cmnPcr.floatAdd(resultValue, valueNum);
						count++;
					}
					else{
						throw new Error("无法进行sum运算, 值为" + value);
					} 
				}
			}
		}
		
		resultValue = resultValue / count;
		
		return resultValue;		 
	 },
	 
	//搜索获得区域内符合条件的值, 目前只支持精准匹配
	vlookup: function(lookupValue, array, colIndex, matchType){
		matchType = (matchType == 0 || matchType == false) ? false : true;
		
		if(lookupValue == null){
			return null;
		}
		else{ 
			var values = array.getValues(); 
			for(var i = 0; i < values.length; i++){
				var row = values[i];
				var toValue = row[0];
				if(lookupValue == toValue){
					var destValue = row[colIndex - 1];
					return destValue;
				}
			} 
			return null;
		}
	},
	
	//根据条件判断返回值
	iff: function(checkValue, trueValue, falseValue){
		if(checkValue){
			return trueValue;
		}
		else{
			return falseValue;
		}
	}
	
}