//表达式运行
function ExpressionRunner(){
	this.run = function(paramNameToValues, expStr){ 
		var runStr = "var runExp = function(paramNameToValues){";
		if(paramNameToValues != null){
			for(var pName in paramNameToValues){
				runStr += ("  var " + pName + " = paramNameToValues[\"" + pName +"\"];");
			}
		}
		runStr += "  return " + expStr + ";";
		runStr += "}";
		
		//将函数动态加载到内存里
		eval(runStr);
		
		//运行函数
		return runExp(paramNameToValues);
	}
	
}