
$(document).ready(function(){
	getCartLineCount();
});

//获取购物车商品数量
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

//显示购物车商品数量
function showCartLineCount(cartLineCount){
	if(cartLineCount == null){
		$("#cartLineCountSpanId").text("(?)");
	}
	else{			
		$("#cartLineCountSpanId").text("(" + cartLineCount + ")");
	}
}