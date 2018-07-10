//对话框
var expCommon = {
	andString: function(var1, var2){
		var s = "";
		if(var1 != null){
			s += var1;
		}
		if(var2 != null){
			s += var2;
		}
		return s;
	},
	//加减乘除
	add:function(var1, var2){
		if(var1 == null){
			var1 = 0;
		}
		else if(cmnPcr.isDecimal(var1)){
			var1 = parseFloat(var1); 
		}
		else{
			throw new Error(var1.toString() + "不是数值");
		}
		if(var2 == null){
			var2 = 0;
		}
		else if(cmnPcr.isDecimal(var2)){
			var2 = parseFloat(var2);
		}
		else{
			throw new Error(var2.toString() + "不是数值");
		}
		return cmnPcr.floatAdd(var1, var2);
		/*
		if(var1 == null){
			return var2;
		}
		else if(var2 == null){
			var var1;
		}	 
		else if(typeof var1 === "number" && typeof var2 === "number"){
			 return cmnPcr.floatAdd(var1, var2);
		}
		else {
			 return var1 + var2;
		}*/
	 },
	 subtract:function(var1, var2){
		 if(var2 == undefined){
			 return 0 - var1;
		 }
		 else{
			 return cmnPcr.floatAdd(var1, 0 - var2); 
		 }
	 },
	 multiply:function(var1, var2){
	    var m = 0, s1 = var1.toString(), s2 = var2.toString();  
	    try{ m += s1.split(".")[1].length; }catch(e){}  
	    try{ m += s2.split(".")[1].length; }catch(e){}  
	    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)  
		 //return var1 * var2;
	 },
	 divide:function(var1, var2){
		 try{
		 	if(var1 == null){
		 		throw new Error("被除数不能为空");
		 	}
		 	else if(var2 == null){
		 		throw new Error("除数不能为空");
		 	}
		 	else if(var2 == 0){
				throw new Error("除数不能为0");
		 	}
		 	else {
		 	   var t1 = 0, t2 = 0, r1, r2;  
			    try{t1 = var1.toString().split(".")[1].length}catch(e){}  
			    try{t2 = var2.toString().split(".")[1].length}catch(e){}  
			    with(Math){  
			        r1=Number(var1.toString().replace(".",""))  
			        r2=Number(var2.toString().replace(".",""))  
			        return (r1/r2)*pow(10,t2-t1);  
			    }	 	
				//return var1 / var2;
			}
		}
		catch(ex){
			throw ex;
		}
	 },
	 
	 //判断相等
	 equal:function(var1, var2){
		 return var1 == var2;
	 },

	 //大于
	 moreThan:function(var1, var2){
		 return var1 > var2;
	 },
	 //小于
	 lessThan:function(var1, var2){
		 return var1 < var2;
	 },
	 //大于等于
	 moreThanOrEqual:function(var1, var2){
		 return var1 >= var2;
	 },
	 //小于等于
	 lessThanOrEqual:function(var1, var2){
		 return var1 <= var2;
	 },
	 
	 //字符串和json对象互转
	 jsonToString:function(json){
		 return cmnPcr.jsonToStr(json);
	 },
	 stringToJson:function(str){
		 return cmnPcr.strToJson(str);
	 },
	 
	 //IIF
	 iif:function(boolValue, returnValue1, returnValue2){
		 return boolValue ? returnValue1 : returnValue2;
	 },
	 
	 //and
	 and:function(param1, param2){
		 return param1 && param2;
	 },
	 //or
	 or:function(param1, param2){
		 return param1 || param2;
	 }
}