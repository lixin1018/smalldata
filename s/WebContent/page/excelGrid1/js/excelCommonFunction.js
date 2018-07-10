//对话框
var excelCommonFunction = {
	//sum
	 sum:function(rangeValue){
		 //rangeValue为ExcelGridRangeValue类的实例
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
		 
	 } 
}