function EditExpression(){
	
	var that = this;
	
	//传递过来的表达式
	this.expText = null;
	
	//自定义参数
	this.userParameters = null;
	
	//返回时调用的表达式
	this.returnFunc = null;
	
	//运行位置
	this.runAt = null;
	
	//需要的返回值类型
	this.needResultType = null;
	
	//显示初始状态的表达式
	this.showExpression = function(){
		$("#expressionInputId").val(that.expText);
	}
	
	//显示函数列表、参数列表
	this.showFunctionParameterListList = function(){
		var treeData = new Array();
		
		if(that.userParameters != null && that.userParameters.length != 0){
			var userParameterRootNode = {
					id:"ncpParmaterRoot",
					text:"所有参数 (" + that.userParameters.length + ")",
					children:new Array()};
			for(var i=0;i< that.userParameters.length;i++){
				var param = that.userParameters[i];
				userParameterRootNode.children.push({
					id:"parameter_"+param.name, 
					text:param.name,
					//text:param.name+" "+ param.description,
					name:param.name,
					attributes:{type:"userParameter",
						addExp:param.name,
						description:"参数: "+ param.name + ", " +  param.valueTypeDes  + ", " + param.description
					}	 
				});
			}					 
			treeData.push(userParameterRootNode);
		}
		 
		var funcRootNode = {
				id:"ncpFunctionRoot",
				text:"所有函数",
				children:new Array()};
		for(var categoryName in expFunctions){
			var funcList = expFunctions[categoryName]; 
			var categoryNode = {
				id:"category_"+categoryName,
				text:categoryName,
				attributes:{type:"category"},
				children:new Array()
			}
			for(var funcName in funcList){
				var func = funcList[funcName];
				var description = "函数: " + func.name+", "+func.description+", 运行在"+that.runAt+".<br/>";
				var funcNode = {
					id:"function_"+funcName,
					text:funcName,  
					//text:funcName+" "+func.description, 
					attributes:{type:"function",
						addExp:funcName + "()",
						description:description
					}							
				}
				
				for(var i=0;i<func.settings.length;i++){
					var funcSetting =  func.settings[i];
					funcNode.attributes.description = funcNode.attributes.description + (i+1) +": 返回"+ funcSetting.valueTypeDes +"&nbsp;" + funcSetting.description +"&nbsp;参数为";
					if(funcSetting.parameters.length == 0){
						funcNode.attributes.description += "无";
					}
					else{
						for(var j=0;j<funcSetting.parameters.length;j++){
							var p = funcSetting.parameters[j];
							funcNode.attributes.description += "<br/>";
							funcNode.attributes.description = funcNode.attributes.description + "&nbsp;&nbsp;&nbsp;&nbsp;" + (i +  1) + "." + (j + 1) + p.valueTypeDes +"&nbsp;"+p.name+"&nbsp;" + p.description;
						}
					}
					funcNode.attributes.description += "<br/>";
				}
				funcNode.attributes.description += "<br/>";
				
				categoryNode.children.push(funcNode);
			}
			if(categoryNode.children.length != 0){
				funcRootNode.children.push(categoryNode);
				categoryNode.text = categoryNode.text + " (" + categoryNode.children.length + ")";
			}
		}
		treeData.push(funcRootNode);
		
		$("#funcTreeDivId").tree({
			data:treeData,
			onDblClick:function(node){ 
				var attributes = node.attributes;
				if(attributes!=null){
					if(attributes.type == "userParameter"){
						that.addTextToExpression(attributes.addExp, 0); 
					} 
					else if(attributes.type == "function"){
						that.addTextToExpression(attributes.addExp, -1); 
					} 
				}
			},
			onClick:function(node){
				var attributes = node.attributes;
				if(attributes!=null){ 
					that.showDetailInfo(attributes.description);  
				}
				else{
					that.showDetailInfo(node.text);  
				}
			}
		});
	} 
	
	//显示函数、参数的详细描述信息
	this.showDetailInfo = function(description){
		$("#detailInfoDivId").html(description);
	} 
	
	//显示表达式验证结果
	this.showValidateInfo = function(validateResult){
		var resultStr = "";
		resultStr += (validateResult.succeed ? "验证通过!" : "验证未通过!");
		resultStr += ("(" + cmnPcr.datetimeToStr(new Date(), "HH:mm:ss") + ") ");
		resultStr += "</br>";
		if(validateResult.errors.length != 0){
			for(var i=0;i<validateResult.errors.length;i++){
				var eStr = validateResult.errors[i];
				resultStr += ((i+1) +": " + eStr +"</br>");
			}
		}		
		$("#validateResultDivId").html(resultStr);
	} 
	
	//验证 
	this.validateExpression = function(){ 	 				
		 var exp = encodeURIComponent(cmnPcr.trim( $("#expressionInputId").val()));
		 if(exp.length == 0){
			 msgBox.alert({info:"请输入表达式"});
		 }
		 else{	
		 	var userParams = new Array();
		 	if(that.userParameters != null){
		 		for(var i=0;i<that.userParameters.length;i++){
		 			var up = that.userParameters[i];
		 			userParams.push({
		 				name: encodeURIComponent(up.name),
		 				valueType: up.valueType,
		 				valueTypeDes: encodeURIComponent(up.valueTypeDes),
		 				description: encodeURIComponent(up.description)	 				
		 			});
		 		}
		 	}
		 	
			 var requestParam = {expression:exp, 
					 userParameters:userParams, 
					 runAt:that.runAt,
					 needResultType:(that.needResultType == null ? "" : that.needResultType)
					 }; 
	 		 serverAccess.request({
	 			 serviceName:"expressionNcpService", 
	 			 funcName:"validateExp",
	 			 args:{
	 				 requestParam:cmnPcr.jsonToStr(requestParam)
				 },  
	 			 successFunc:function(obj){  
				 	that.showValidateInfo(obj.result);
				 }
	 		 }); 
		}
	}
	
	//添加关键字到表达式
	this.addKeywordToExpression = function(){
		var keywordBtns = $("#keyWordDivId").find("input");
		for(var i=0;i<keywordBtns.length;i++){
			var btn = keywordBtns[i];
			$(btn).click(function(){
				//添加关键字到表达式
			    var str = $(this).val();
			    that.addTextToExpression(str, 0);
			});
		}
	} 
	
	//添加字符串到表达式
	this.addTextToExpression = function(str, swiftIndex){  
	    var tc = document.getElementById("expressionInputId");  
	    var tclen = tc.value.length;    
	    var newSelectionStart = tc.selectionStart + str.length + swiftIndex;
	    var oldSelectionStart = tc.selectionStart;
	    var oldSelectionEnd = tc.selectionEnd;
	    tc.value = tc.value.substr(0,oldSelectionStart)+str+tc.value.substring(oldSelectionEnd,tclen);  
	    tc.selectionStart = newSelectionStart;
	    tc.selectionEnd = newSelectionStart; 
	    tc.focus();	
	} 
	
	//选中函数节点
	this.selectFunctionNode = function(id){ 
		var node = $("#funcTreeDivId").tree("find", id); 
		$("#funcTreeDivId").tree("expandAll");    
		$("#funcTreeDivId").tree("select", node.target);  
	    var containerH = $("#funcTreeDivId").height();  
	    var nodeOffsetHeight = $(node.target).offset().top - $("#funcTreeDivId").offset().top;  
	    if (nodeOffsetHeight > (containerH - 30)) {  
	        var scrollHeight = $("#funcTreeDivId").scrollTop() + nodeOffsetHeight - containerH + 30;  
	        $("#funcTreeDivId").scrollTop(scrollHeight);  
	    }  
	
		var attributes = node.attributes;
		if(attributes!=null){ 
			that.showDetailInfo(attributes.description);  
		}
	} 

	this.init = function(inputParams){ 
		that.expText = inputParams.expText;
		that.userParameters = inputParams.userParameters;
		that.returnFunc = inputParams.returnFunc;
		that.runAt = inputParams.runAt;
		that.needResultType = inputParams.needResultType;
		
		//显示初始状态的表达式
		that.showExpression();
		
		//显示函数列表
		that.showFunctionParameterListList(); 
		
		that.addKeywordToExpression();
		
		$("#validateButtonId").click(function(){
			that.validateExpression();
		});
	
		$("#okButtonId").click(function(){
			var expText = cmnPcr.trim($("#expressionInputId").val());
			if(that.returnFunc != null){
				that.returnFunc({
					succeed:true,
					expText:expText
				});
			}
		});
		$("#cancelButtonId").click(function(){ 
			if(that.returnFunc != null){
				that.returnFunc({
					succeed:false
				});
			}
		});
	
		var findedIndex = -1;
		var lastFindStr = "";
		$("#findId").keydown(function(event){
			switch(event.keyCode) {
				case 13: {
					var index = -1;
					var findStr = $("#findId").val();
					if(findStr != lastFindStr){
						findedIndex=-1;
						lastFindStr=findStr;
					}
					if(findStr.length!=0){
						for(var categoryName in expFunctions){ 
							var funcList = expFunctions[categoryName];
							for(var funcName in funcList){
								var func = funcList[funcName];
								index++;
								if(index > findedIndex){
									if(funcName.indexOf(findStr) != -1 || func.description.indexOf(findStr) != -1){
										findedIndex = index;
										that.selectFunctionNode("function_"+funcName);
										return;
									}
									for(var i=0;i<func.settings.length;i++){
										var funcSetting =  func.settings[i];
										if(funcSetting.description.indexOf(findStr) != -1){
	 										findedIndex = index;
	 										that.selectFunctionNode("function_"+funcName);
											return;
										}
									}	 										
								}
							}
						}
					}
					findedIndex=-1;
					msgBox.alert({info:"未查找到更多相关函数!"});
				}
				break;
			}
		});	
	}
}