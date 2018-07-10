
$(document).ready(function(){
	bindBtnEvent(); 
});
 
function bindBtnEvent(){	
	
	$(".closeOrder").click(function(){
		var orderId = $(this).attr("orderId");
		if(msgBox.confirm({info: "确定取消此订单吗?"})){
			closeOrder(orderId);
		}
	}); 
}

function refreshOrderStatusAfterClose(orderId){
	var orderItem = $("div.orderItem[orderId='" + orderId + "']");
	$(orderItem).find("div.orderItemTitleStatusName").text("已取消");
	$(orderItem).find("span.closeOrder").remove();
}
 
function closeOrder(orderId){	
	var requestParam = {
		orderId: orderId
	};
	serverAccess.request({
		serviceName:"dataHelperBuyNcpService", 
		funcName:"closeOrder", 
		args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
		successFunc:function(obj){
			refreshOrderStatusAfterClose(orderId);
		}
	}); 
} 