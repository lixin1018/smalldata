/*	最普通的属性编辑框
	p.typeProperties为product type properties，记录了此产品类型所有可选的属性，
	例如p.typeProperties = [
					{	"propertyName":"color",
					 	"fieldName":"color",
					 	"showName":"颜色",
					 	"description":"请选择颜色",
					 	"values":[ {"value":"白色", "description":""},{"value":"黑色", "description":""},{"value":"金色", "description":""}]
					},					
					{ 	"propertyName":"romsize",
					 	"fieldName":"romsize",
					 	"showName":"ROM容量",
					 	"description":"请选择ROM容量",
					 	"values":[ {"value":"4G", "description":""}, {"value":"8G", "description":""}, {"value":"16G", "description":""}, {"value":"32G", "description":""}, {"value":"64G", "description":""} ]
					},					
					{	"propertyName":"simType",
					 	"fieldName":"",
					 	"showName":"套餐类型",
					 	"description":"请选择套餐类型",
					 	"valueType":"simTypeEditor",
					 	"values":[ 
					 				{"value":"76元A套餐", "description":""}, {"value":"76元B套餐", "description":""}, {"value":"76元C套餐", "description":""},
					 				{"value":"96元A套餐", "description":""}, {"value":"96元B套餐", "description":""}, {"value":"96元C套餐", "description":""},
					 				{"value":"106元A套餐", "description":""}, {"value":"106元B套餐", "description":""}, {"value":"106元C套餐", "description":""},
					 			]
					},					
					{
					 	"propertyName":"telNum",
					 	"fieldName":"",
					 	"showName":"手机号码",
					 	"description":"请选择新的手机号码",
					 	"valueType":"telNumEditor"
					}
				]

	p.productProperty为product property values，此产品的子产品中，每个子产品可选的属性值
	p.productProperty = {
				"properties":["color", "romsize", "simType", "telNum"],
				"values":[
							[
								{"name":"color", "value":"黑色", "inventory":"100"},
								{"name":"romsize", "value":"16G", "inventory":"100"}
							]
						]
			}
			
	p.containerId容器ID
	p.onSubProductChange当变换了选中的子产品时，例如库存值会更新
*/
//属性编辑框
function propertyEditor(p){
	this.containerId = p.containerId;
	this.typeProperties = p.typeProperties;
	this.productProperty = p.productProperty;
	this.onSubProductChange = p.onSubProductChange;
	
	//记录了所有属性编辑控件
	this.editors = new Array();

	//当选中属性改变时
	this.changeSelectedProperty = function(p){
		
		var selectedSubProducts = this.getSelectedSubProduct();
		if(this.onSubProductChange != null){
			this.onSubProductChange({
				selectedSubProducts:selectedSubProducts
				});
		}
	}
	
	this.getSelectedSubProduct = function(){
		var selectedSubProducts = new Array(); 
		for(var i=0;i<this.productProperty.values.length;i++){
			selectedSubProducts.push(this.productProperty.values[i]);
		}
		for(var i = 0; i < this.editors.length; i++){
			var editor = this.editors[i];
			var propertyName  = editor.typeProperty.propertyName;
			var propertyValue = editor.getValue();
			var tempSelectedSubProducts = new Array();
			for(var j=0;j<selectedSubProducts.length;j++){
				var subProdValue = selectedSubProducts[j];
				var value = subProdValue[propertyName];
				if(value == null || value == propertyValue || propertyValue == null){
					tempSelectedSubProducts.push(selectedSubProducts[j]);
				}
			}
			selectedSubProducts = tempSelectedSubProducts;
		}
		return selectedSubProducts;
	}
	
	//判断此产品是否使用此属性
	this.checkHasThisProperty = function(propertyName){
		for(var j = 0; j < this.productProperty.properties.length; j++){
			var pn = this.productProperty.properties[j];
			if(pn == propertyName){
				return true;
			}
		}
		return false;
	}
	
	//判断此产品是否使用此属性值
	this.checkHasThisPropertyValue = function(propertyName, value, ppvs){
		for(var j = 0; j < ppvs.length; j++){
			var pv = ppvs[j];
			if(value == pv[propertyName]){
				return true;
			}
		}
		return false;
	}
	
	//初始化
	this.init = function(){
		for(var i = 0; i < this.typeProperties.length; i++){
			var ptp = this.typeProperties[i];
			var hasThisProperty = this.checkHasThisProperty(ptp.propertyName);
			if(hasThisProperty){
				 var valueType = ptp.valueType;
				 var thisValues = new Array();
				 if(ptp.values != null){
					 for(var k = 0; k < ptp.values.length; k++){ 
						 var value = ptp.values[k].value;
						 if(this.checkHasThisPropertyValue(ptp.propertyName, value, this.productProperty.values)){
						 	thisValues.push(value);
						 }
					 }
				 }
				 var inputParam = {	
					 				parent:this,
					 				typeProperty:ptp,
				 					propertyValues:thisValues
			 					};
				 var editor = null;
				 switch(valueType){
				 	case "inputTypePropertyEditor":
			 			{
			 				editor =new inputTypePropertyEditor(inputParam);
			 			}
				 		break;
				 	case "telNumTypePropertyEditor":
			 			{
			 				editor =new telNumTypePropertyEditor(inputParam);
			 			}
				 		break;
				 	case "listTypePropertyEditor":
			 			{
			 				editor =new listTypePropertyEditor(inputParam);
			 			}
				 		break;
				 	case "commonPropertyEditor":
			 		default:
			 			{
			 				editor =new commonPropertyEditor(inputParam);
			 			}
			 			break;
				 }
				 this.editors.push(editor);
			}
		}
	}
}

//一般属性选择框
function commonPropertyEditor(p){
	
	var that = this;
	this.parent = p.parent;
	
	//属性类型
	this.typeProperty = p.typeProperty;
	
	//容器ID
	this.containerId = p.parent.containerId + "_" + p.typeProperty.propertyName;
		
	this.getValue = function(){
		var controls = $("#" + this.containerId).find(".commonPropertyBoxSelected");
		var value = controls.length == 0 ? null : $(controls[0]).attr("propertyValue");
		return value;
	}
	
	this.setValue = function(value){
		var controls = $("#" + this.containerId).find(".commonPropertyBox");
		for(var i = 0; i < controls.length; i++){
			var control = controls[i];
			var pv = $(control).attr("propertyValue");
			if(pv == value){
				$(control).addClass("commonPropertyBoxSelected");
			}
			else{
				$(control).removeClass("commonPropertyBoxSelected");
			}				
		}
	}
	
	this.init = function(){ 
		var values = p.propertyValues;
		
		//一行放置3个
		var oneLineCellCount = 3;
		
		//当行行高
		var lineHeight = 30;
		
		//计算要放置多少行
		var lineCount = Math.ceil(values.length / oneLineCellCount);
		
		var html = "<div id=\"" + this.containerId + "\" style=\"width:100%;height:"+(lineCount * lineHeight)+"px;\">";
		for(var i = 0; i < lineCount ; i++){
			html += "<div style=\"width:100%;height:" + lineHeight + "px;\">"; 
			html += ("<span class=\"propertyNameDiv\">" + ( i == 0 ? cmnPcr.encodeString(this.typeProperty.showName) + ":" : "&nbsp;") + "</span>") 
			for(var j = 0; j < oneLineCellCount; j++){
				var index = i * oneLineCellCount + j;
				if(index < values.length){
					var value = values[index];
					html += "<span class=\"commonPropertyBox\" propertyValue=\"" + cmnPcr.replace(value, "\"", "\\\"")  + "\">" + cmnPcr.encodeString(value) + "</span>";
				}
			}
			html += "</div>";
		}
		html += "</div>";
		
		$("#" + p.parent.containerId).append(html);
		
		$("#" + this.containerId ).find(".commonPropertyBox").click(function(){
			var value = $(this).attr("propertyValue");
			that.setValue(value);
			that.parent.changeSelectedProperty({
				name:that.typeProperty.propertyName,
				value:value,		
			});
		});
	}
	
	//执行初始化
	this.init();
}

//电话号码选择框
function telNumTypePropertyEditor(p){ 
		
	var that = this;
	this.parent = p.parent;
	
	//属性类型
	this.typeProperty = p.typeProperty;
	
	//容器ID
	this.containerId = p.parent.containerId + "_" + p.typeProperty.propertyName;
		
	this.getValue = function(){ 
	}
	
	this.setValue = function(value){ 
	}
	
	this.init = function(){  
	}
	
	//执行初始化
	this.init();
}

//下拉选择框
function listTypePropertyEditor(p){
	
	var that = this;
	this.parent = p.parent;
	
	//属性类型
	this.typeProperty = p.typeProperty;
	
	//容器ID
	this.containerId = p.parent.containerId + "_" + p.typeProperty.propertyName;
		
	this.getValue = function(){
		var controls = $("#" + this.containerId).find(".listPropertyBox");
		var value = controls.length == 0 ? null : $(controls[0]).val();
		return value;
	}
	
	this.setValue = function(value){
		var controls = $("#" + this.containerId).find(".listPropertyBox"); 
		$(controls[0]).val(value);
	}
	
	this.init = function(){ 
		var values = p.propertyValues; 
		
		//当行行高
		var lineHeight = 30; 
		//当行行高
		var lineHeight = 30; 
		
		var html = "<div id=\"" + this.containerId + "\" style=\"width:100%;height:" + lineHeight + "px;\">"; 
		html += ("<span class=\"propertyNameDiv\">" + cmnPcr.encodeString(this.typeProperty.showName) + ":</span>") 
		html += "<select class=\"listPropertyBox\">";
		for(var i = 0; i < this.typeProperty.values.length ; i++){ 
			var value = this.typeProperty.values[i].value;
			html += ("<option " + (i == 0 ? "selected=\"selected\"" : "") + " value=\"" + cmnPcr.replace(value, "\"", "\\\"")  + "\">" + cmnPcr.encodeString(value) + "</option>");
		}
		html += "</select>";
		html += "</span>";
		html += "</div>";
		
		$("#" + p.parent.containerId).append(html);
		
		$("#" + this.containerId ).find(".listPropertyBox").change(function(){
			var value = $(this).attr("value");
			that.setValue(value);
			that.parent.changeSelectedProperty({
				name:that.typeProperty.propertyName,
				value:value,		
			});
		});
	}
	
	//执行初始化
	this.init();
}

//一般录入框
function inputTypePropertyEditor(p){
	
	var that = this;
	this.parent = p.parent;
	
	//属性类型
	this.typeProperty = p.typeProperty;
	
	//容器ID
	this.containerId = p.parent.containerId + "_" + p.typeProperty.propertyName;
		
	this.getValue = function(){
		var controls = $("#" + this.containerId).find(".inputPropertyBox");
		var value = controls.length == 0 ? null : $(controls[0]).val();
		return value;
	}
	
	this.setValue = function(value){
		var controls = $("#" + this.containerId).find(".inputPropertyBox"); 
		$(controls[0]).val(value);
	}
	
	this.init = function(){ 
		var values = p.propertyValues; 
		
		//当行行高
		var lineHeight = 30; 
		//当行行高
		var lineHeight = 30; 
		
		var html = "<div id=\"" + this.containerId + "\" style=\"width:100%;height:" + lineHeight + "px;\">"; 
		html += ("<span class=\"propertyNameDiv\">" + cmnPcr.encodeString(this.typeProperty.showName) + ":</span>") 
		html += "<input class=\"inputPropertyBox\" />";  
		html += "</span>";
		html += "</div>";
		
		$("#" + p.parent.containerId).append(html);
		
		$("#" + this.containerId ).find(".inputPropertyBox").change(function(){
			var value = $(this).attr("value"); 
			that.parent.changeSelectedProperty({
				name:that.typeProperty.propertyName,
				value:value,		
			});
		});
	}
	
	//执行初始化
	this.init();
}