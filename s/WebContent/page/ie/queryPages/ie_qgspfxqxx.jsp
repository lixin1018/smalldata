<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePageShareData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>全国商品房小区信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,全国商品房小区信息"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="全国商品房小区信息"> 
	<script type="text/javascript" src="${dataModel}/ie_qgspfxqxx.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_qgspfxqxx.js"></script> 
	
	<script>
		var paramWinModelUnits = {csbm: {
id: "9ee53d8e-5575-4a0e-b46c-4b152b433055",
name: "csbm",
label: "&#22478;&#24066;&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
csmc: {
id: "0b0a4b99-c56a-4f11-bb52-cde2cf436f31",
name: "csmc",
label: "&#22478;&#24066;&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
qybm: {
id: "d5014360-4315-4859-9f43-bbcd81204ed2",
name: "qybm",
label: "&#21306;&#22495;&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
qymc: {
id: "e2cb355d-0db2-4463-bd48-42398cd1ce3a",
name: "qymc",
label: "&#21306;&#22495;&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
jdbm: {
id: "513f0869-ba58-451f-a3a7-24e60d6d47e0",
name: "jdbm",
label: "&#34903;&#36947;&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
jdmc: {
id: "d93079dd-0789-4148-913d-6477aa5d7ff4",
name: "jdmc",
label: "&#34903;&#36947;&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
xqmc: {
id: "32e57156-6824-4884-af0e-228ab255d22d",
name: "xqmc",
label: "&#23567;&#21306;&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
jsnf: {
id: "b1fa7b72-f60c-4193-a1f9-100d7e1171b1",
name: "jsnf",
label: "&#24314;&#35774;&#24180;&#20221;",
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
		var dataModel = dataModels.ie_qgspfxqxx;
		var viewModel = viewModels.ie_qgspfxqxx;
		var definitionId = "1d6b9d13-4406-4f4a-9457-8eac80e00e57";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.csbm != null && result.values.csbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"csbm", title:"&#22478;&#24066;&#32534;&#30721;", operator:"like", value: result.values.csbm });
}
if(result.values.csmc != null && result.values.csmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"csmc", title:"&#22478;&#24066;&#21517;&#31216;", operator:"like", value: result.values.csmc });
}
if(result.values.qybm != null && result.values.qybm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qybm", title:"&#21306;&#22495;&#32534;&#30721;", operator:"like", value: result.values.qybm });
}
if(result.values.qymc != null && result.values.qymc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qymc", title:"&#21306;&#22495;&#21517;&#31216;", operator:"like", value: result.values.qymc });
}
if(result.values.jdbm != null && result.values.jdbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jdbm", title:"&#34903;&#36947;&#32534;&#30721;", operator:"like", value: result.values.jdbm });
}
if(result.values.jdmc != null && result.values.jdmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jdmc", title:"&#34903;&#36947;&#21517;&#31216;", operator:"like", value: result.values.jdmc });
}
if(result.values.xqmc != null && result.values.xqmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xqmc", title:"&#23567;&#21306;&#21517;&#31216;", operator:"like", value: result.values.xqmc });
}
if(result.values.jsnf != null && result.values.jsnf.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jsnf", title:"&#24314;&#35774;&#24180;&#20221;", operator:"like", value: result.values.jsnf });
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
		<div class="tableQueryNameLine"><div class="tableQueryItemName">&#22478;&#24066;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="csbm" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#22478;&#24066;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="csmc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#21306;&#22495;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qybm" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#21306;&#22495;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qymc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#34903;&#36947;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jdbm" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#34903;&#36947;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jdmc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#23567;&#21306;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xqmc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#24314;&#35774;&#24180;&#20221;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jsnf" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">全国商品房小区信息</div>	 
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