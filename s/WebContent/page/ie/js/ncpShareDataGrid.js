function NcpShareDataGrid(p) {

	var that = this; 

	//基类
	this.base = NcpGrid;
	this.base(p);
	
	this.serviceName = "shareDataGridNcpService";
	
	this.getPopContainer = function(param){
		var popContainer = new PopupContainer( {
			width : 400,
			height : 500,
			top : 50
		});
		return popContainer;
	}
} 
	
var paramWin = null;
var gridWin = null;
var unitPrice = null;

var selectedRowCount = 0;
var rowSelectType = "allRows";//allRows、topRows、randomRows（暂不支持）

//获取准备付款的记录数
function getTargetRowCount(){
	if(rowSelectedType == "allRows"){
		return gridWin.totalRowCount;
	}
	else if(rowSelectedType == "topRows"){
		if(selectedRowCount <= gridWin.totalRowCount){
			return selectedRowCount;
		}
		else{
			return gridWin.totalRowCount;
		}
	}
	else {
		return 0;
	}
}

$(document).ready(function(){
	var paramWinModel = {
		  id:0,
		  name:"paramWinModel",
		  units: paramWinModelUnits
	};
				
	var p2vs = cmnPcr.getQueryStringArgs();
	var pageNumber = 1;
	for(var pName in p2vs){
		var valueStr = p2vs[pName];
		if(pName.startWith("q_")){
			pName = pName.substr(2);
			var p = paramWinModel.units[pName];
			if(p != null){
				if(cmnPcr.canConvert(valueStr, p.valueType)){
					p.defaultValue = valueStr;
				} 
			}
		}
		else if(pName == "p" && cmnPcr.canConvert(valueStr, valueType.decimal)){
			var pNum = cmnPcr.strToObject(valueStr, valueType.decimal);
			if(pNum > 0){
				pageNumber = pNum;
			}
		}
	}
	
	paramWin = new NcpShareDataParamWin({
		containerId:"queryControlContainerId",
		paramWinModel:paramWinModel
	}); 
	paramWin.show();
	
	var p = { 
		containerId:"dataGridContainer",   
		multiselect:false,
		dataModel:dataModel,
		onePageRowCount:30,
		isRefreshAfterSave:true,
		isShowData:false,
		viewModel:viewModel 
	};
	gridWin = new NcpShareDataGrid(p); 
	gridWin.show();
	
	var externalObject = {
		afterDoPage:function(param){
			 showPrice();
			 //closeQueryWin();
		} 
	};
	gridWin.addExternalObject(externalObject);
	 
	queryData(pageNumber);
	
	getUnitPrice();
	
	getCartLineCount();
	
	//设置查询按钮事件
	$("#queryBtnId").click(function(){
		queryData(1);
	});
	
	//设置加入购物车
	$("#addToCartBtnId").click(function(){
		addToCart();
	}); 

	$("#popQueryBtnId").click(function(){
		popQueryWin();
	});
	
	$("#showCartDivId").click(function(){
		goToCartPage();
	});
	
	$("#tableQueryCloseImageBtnDivId").click(function(){
		closeQueryWin();
	});
	
	$("#queryCloseBtnId").click(function(){
		closeQueryWin();
	});
}); 

var addToCartSucceedForm = null;

function goToCartPage(){
	window.open("../../h/buy/cart.jsp");
}

function showAddToCartSucceedForm(){
	if(addToCartSucceedForm == null){
		var popContainer = new PopupContainer( {
			width : 260,
			height : 180,
			top : 50
		});

		addToCartSucceedForm = popContainer;
		addToCartSucceedForm.show();
		$("#addToCartSucceedDivId").appendTo($("#" + popContainer.containerId));
		$("#addToCartSucceedDivId").css({display: "block"});	
		
		$("#addToCartSucceedDivId").click(function(){
			addToCartSucceedForm.hide();
		});
	}
	else{
		addToCartSucceedForm.show();
	}
}

function closeQueryWin(){
	$("#queryControlContainerId").removeClass("tableQueryContainerShow");
}

function popQueryWin(){
	$("#queryControlContainerId").addClass("tableQueryContainerShow");
}

function getUnitPrice(){			
	var requestParam = {
		definitionId: definitionId
	};
	
	serverAccess.request({
		serviceName:"dataHelperBuyNcpService", 
		funcName:"getUnitPrice", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			unitPrice = obj.result.unitPrice; 
			showUnitPrice();
			showPrice();
		} 
	});
}

function getCartLineCount(){			
	var requestParam = {
	};
	
	serverAccess.request({
		serviceName:"dataHelperBuyNcpService", 
		funcName:"getCartLineCount", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			var cartLineCount = obj.result.cartLineCount; 
			showCartLineCount(cartLineCount);
		} 
	});
}

function showUnitPrice(){
	var num = new Number(unitPrice);
	var formattedUnitPrice = num.toFixed(4);
	$("#unitPriceDivId").text(formattedUnitPrice);
}

function showCartLineCount(cartLineCount){
	if(cartLineCount == null){
		$(".cartCountSpan").text("(-)");
	}
	else{
		$(".cartCountSpan").text("(" + cartLineCount + ")");
	}
}

function showPrice(){
	if(gridWin.totalRowCount != null && unitPrice != null){
		var price = gridWin.totalRowCount * unitPrice;
		//var originalPrice = new Number(gridWin.totalRowCount * unitPrice);
		//var originalPriceStr = originalPrice.toFixed(4); 
		var priceStr = price.toFixed(4);	
		
		$("#dataRowCountDivId").text(gridWin.totalRowCount); 
		$("#priceDivId").text(priceStr);		
	}
}



function addToCart(){
	if(gridWin.totalRowCount > 0){
		var requestParam = {
			definitionId: definitionId, 
			dataFilter: gridWin.sysWhere
		};
		
		serverAccess.request({
			serviceName:"dataHelperBuyNcpService",
			funcName:"addToCart", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				getCartLineCount();
				showAddToCartSucceedForm();
			}
		});
	}
	else {
		msgBox.alert({info: "不能添加到购物车. \r\n原因: 没有查询到任何数据"});
	}
}
		