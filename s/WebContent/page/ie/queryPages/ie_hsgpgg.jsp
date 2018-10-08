<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePageShareData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>沪深股票公告</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,沪深股票公告"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="沪深股票公告"> 
	<script type="text/javascript" src="${dataModel}/ie_hsgpgg.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_hsgpgg.js"></script> 
	
	<script>
		var paramWinModelUnits = {mc: {
id: "edbfc513-a583-4b3f-a9ad-483ba4e5cd16",
name: "mc",
label: "&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 10,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
dm: {
id: "5e248e6e-2858-4501-ac47-ba7de5fefb07",
name: "dm",
label: "&#20195;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 10,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
}};
		var dataModel = dataModels.ie_hsgpgg;
		var viewModel = viewModels.ie_hsgpgg;
		var definitionId = "81a20d51-e670-4e96-a7ac-12547050c4ba";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.mc != null && result.values.mc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"mc", title:"&#21517;&#31216;", operator:"like", value: result.values.mc });
}
if(result.values.dm != null && result.values.dm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"dm", title:"&#20195;&#30721;", operator:"like", value: result.values.dm });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryHeaderLine">
			<div class="tableQueryCloseImageBtnDiv" id="tableQueryCloseImageBtnDivId"></div>
		</div> 
		<div class="tableQueryNameLine"><div class="tableQueryItemName">&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="mc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#20195;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="dm" paramCtrl="true"/></div></div>
	 
		<div class="tableQueryBlankCell">&nbsp;</div> 
		<div class="tableQueryButtonLine">
			<div class="queryButtonDiv" id="queryBtnId" title="按照查询条件进行查询">查&nbsp;询</div>
		</div>
		<div class="tableQuerySplitLine">
			<div class="tableQuerySplitCell"></div> 
		</div>
		<div class="newOrderConfirmContainerDiv" id="newOrderConfirmContainerDivId">
			<!-- <div class="newOrderConfirmheaderDiv"><div class="newOrderConfirmTitleDiv">计算价格</div></div> -->
			<div class="newOrderConfirmInfoItemDiv"><div class="newOrderConfirmItemNameDiv">单&nbsp;价: </div><div class="unitPriceDiv" id="unitPriceDivId"></div><div class="newOrderConfirmItemPostfixDiv">元/条</div></div>
			<div class="newOrderConfirmInfoItemDiv"><div class="newOrderConfirmItemNameDiv">数&nbsp;量: </div><div class="dataRowCountDiv" id="dataRowCountDivId"></div><div class="newOrderConfirmItemPostfixDiv">条</div></div>
			<!--<div class="newOrderConfirmInfoItemDiv"><div class="newOrderConfirmItemNameDiv">原&nbsp;价: </div><div class="originalPriceDiv" id="originalPriceDivId"></div><div class="newOrderConfirmItemPostfixDiv">元</div></div>-->
			<div class="newOrderConfirmInfoItemDiv"><div class="newOrderConfirmItemNameDiv">价&nbsp;格: </div><div class="priceDiv" id="priceDivId"></div><div class="newOrderConfirmItemPostfixDiv">元</div></div>
			<div class="newOrderConfirmBtnDiv">
				<div class="addToCartBtn" id="addToCartBtnId">放入购物车</div>
			</div>
			<!--
			<div class="newOrderConfirmBtnDiv">
				<div class="directPayAndDownloadBtn" id="directPayAndDownloadBtnId">直接支付</div>
			</div> -->
			<div class="newOrderConfirmBtnDiv">
				<a class="showCartPageBtn" id="showCartPageBtnId" href="../../h/buy/cart.jsp" target="_blank">购物车<span class="cartCountSpan"></span></a>
			</div>
			<div class="newOrderConfirmBtnDiv">
				<a class="showOrderListPageBtn" id="showOrderListPageBtnId" href="../../h/buy/orderList.jsp" target="_blank">历史订单</a>
			</div>
			<div class="tableQueryButtonLine">
				<div class="queryButtonDiv" id="queryCloseBtnId" title="关闭查询窗口">关&nbsp;闭</div>
			</div>
		</div>
	</div>	 		
	<div class="headerMain" data-options="region:'north',border:false">  
		<jsp:include  page="headerSjgx.jsp">
			<jsp:param value="sjgx" name="menuName"/>
		</jsp:include>
		<div class="tableHeader">
			<div class="tableHeaderInner">  
				<div class="tableTitle">沪深股票公告</div>	 
				<div class="tablePagination">
					<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
				</div>	   
			</div>    
		</div>    	 
	</div>
	<div name="gridDiv" id="dataListContainerId" class="ncpGridDiv" data-options="region:'center',border:false" >   
		<table name="gridCtrl" ></table> 
	</div>
</body>	 
</html>