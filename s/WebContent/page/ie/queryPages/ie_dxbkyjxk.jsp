<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePageShareData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>大学本科一级学科</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,大学本科一级学科"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="大学本科一级学科"> 
	<script type="text/javascript" src="${dataModel}/ie_dxbkyjxk.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_dxbkyjxk.js"></script> 
	
	<script>
		var paramWinModelUnits = {flbm: {
id: "08192d63-fe78-4c07-a321-1872ffe99d2d",
name: "flbm",
label: "&#20998;&#31867;&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 6,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
xkfl: {
id: "ba6733a0-411b-4089-a888-4c451d2ee689",
name: "xkfl",
label: "&#23398;&#31185;&#20998;&#31867;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 100,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
yjxkbm: {
id: "3d7c474a-de13-4c3d-8882-1efc1457ed87",
name: "yjxkbm",
label: "&#19968;&#32423;&#23398;&#31185;&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 6,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
yjxk: {
id: "5068b4dd-4247-452e-82c9-2626fae2f872",
name: "yjxk",
label: "&#19968;&#32423;&#23398;&#31185;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 100,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
}};
		var dataModel = dataModels.ie_dxbkyjxk;
		var viewModel = viewModels.ie_dxbkyjxk;
		var definitionId = "b833519b-40bb-435c-a5b0-3c94a71e8222";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.flbm != null && result.values.flbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"flbm", title:"&#20998;&#31867;&#32534;&#30721;", operator:"like", value: result.values.flbm });
}
if(result.values.xkfl != null && result.values.xkfl.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xkfl", title:"&#23398;&#31185;&#20998;&#31867;", operator:"like", value: result.values.xkfl });
}
if(result.values.yjxkbm != null && result.values.yjxkbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"yjxkbm", title:"&#19968;&#32423;&#23398;&#31185;&#32534;&#30721;", operator:"like", value: result.values.yjxkbm });
}
if(result.values.yjxk != null && result.values.yjxk.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"yjxk", title:"&#19968;&#32423;&#23398;&#31185;", operator:"like", value: result.values.yjxk });
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
		<div class="tableQueryNameLine"><div class="tableQueryItemName">&#20998;&#31867;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="flbm" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#23398;&#31185;&#20998;&#31867;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xkfl" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#19968;&#32423;&#23398;&#31185;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="yjxkbm" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#19968;&#32423;&#23398;&#31185;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="yjxk" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">大学本科一级学科</div>	 
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