
$(document).ready(function(){
	bindBtnEvent();
	reCalcTotalPrice();
});
 
function bindBtnEvent(){	
	
	$(".removeFromCart").click(function(){
		var cartLineId = $(this).attr("cartLineId");
		if(msgBox.confirm({info: "确定删除此数据商品吗?"})){
			removeFromCart(cartLineId);
		}
	});
	
	$(".dataCheckBox").click(function(){
		checkNeedSelectAll(); 
		reCalcTotalPrice();
		changeCartLineItemBackground();
	});
	
	$("#selectAllCheckboxId").click(function(){
		var isSelectAll = $("#selectAllCheckboxId").is(":checked");
		selectAllCartLines(isSelectAll);
		changeCartLineItemBackground();
	});
	
	$("#toPayPage").click(function(){
		generateOrder();
	});
}

function changeCartLineItemBackground(){
	var items = $("div.dataItem");
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		$(item).removeClass("dataItemSelected");
		if($(item).children("input.dataCheckBox").is(":checked")){
			$(item).addClass("dataItemSelected");
		}
	}
}
 
function removeFromCart(cartLineId){	
	var requestParam = {
		cartLineId: cartLineId
	};
	serverAccess.request({
		serviceName:"dataHelperBuyNcpService", 
		funcName:"removeFromCart", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			var cartLineCount = obj.result.cartLineCount; 
			removeCartLineFromUI(cartLineId); 
		}
	}); 
}

function removeCartLineFromUI(cartLineId){
	$("div.dataItem[cartLineId='" + cartLineId + "']").remove();
	$("div.dataItemSpaceBorder[cartLineId='" + cartLineId + "']").remove();
	checkNeedSelectAll();
	reCalcTotalPrice();
}

function checkNeedSelectAll(){
	var needSelctAll = true;
	var allCheckBoxes = $("input.dataCheckBox");
	for(var i = 0; i < allCheckBoxes.length; i++){
		var checkbox = allCheckBoxes[i];
		if(!$(checkbox).is(":checked")){
			needSelctAll = false;
			break;
		}
	}
	if(needSelctAll){
		$("#selectAllCheckboxId").attr("checked", "checked");
	}
	else{
		$("#selectAllCheckboxId").removeAttr("checked");
	} 
}

function selectAllCartLines(checked){
	var allCheckBoxes = $("input.dataCheckBox");
	for(var i = 0; i < allCheckBoxes.length; i++){
		var checkbox = allCheckBoxes[i];
		if(checked){
			$(checkbox).attr("checked", "checked");
		}
		else{
			$(checkbox).removeAttr("checked");
		}
	}
	reCalcTotalPrice();
}

function reCalcTotalPrice(){
	var allCheckBoxes = $("input.dataCheckBox");
	var totalPrice100 = 0;
	for(var i = 0; i < allCheckBoxes.length; i++){
		var checkbox = allCheckBoxes[i];
		if($(checkbox).is(":checked")){
			var priceStr = $(checkbox).nextAll("div.dataPrice").attr("price");
			var price = cmnPcr.strToDecimal(priceStr);
			totalPrice100 += price * 100;
		}
	}
	totalPrice = (totalPrice100 / 100).toFixed(2);
	$("#totalPriceId").text("￥" + totalPrice);
}

function getSelectedCartLines(){
	var selectedCartLineIds = new Array();
	var items = $("div.dataItem");
	for(var i = 0; i < items.length; i++){
		var item = items[i];
		$(item).removeClass("dataItemSelected");
		if($(item).children("input.dataCheckBox").is(":checked")){
			var cartLineId = $(item).attr("cartLineId");
			selectedCartLineIds.push({id: cartLineId});
		}
	}
	return selectedCartLineIds;
}

function generateOrder(){
	var selectedCartLineIds = getSelectedCartLines();
	if(selectedCartLineIds.length == 0){
		msgBox.alert({info: "请选择要结算的数据商品"});
	}
	else{		
		var requestParam = {
			cartLines: selectedCartLineIds
		};
		serverAccess.request({
			serviceName:"dataHelperBuyNcpService", 
			funcName:"generateOrder", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var orderId = obj.result.orderId; 
				location.href = "order.jsp?id=" + orderId;
			}
		}); 
	}
}