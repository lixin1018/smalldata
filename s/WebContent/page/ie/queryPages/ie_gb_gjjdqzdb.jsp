﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePageShareData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>国标_国籍及地区字典表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,国标_国籍及地区字典表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="国标_国籍及地区字典表"> 
	<script type="text/javascript" src="${dataModel}/ie_gb_gjjdqzdb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_gb_gjjdqzdb.js"></script> 
	
	<script>
		var paramWinModelUnits = {xh: {
id: "fdfeed36-7366-4910-b748-d6748c853f85",
name: "xh",
label: "&#24207;&#21495;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 5,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
name_cn: {
id: "3f76503f-aad0-442f-a62b-8e6d85b8f561",
name: "name_cn",
label: "&#20013;&#25991;&#21517;",
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
name_en: {
id: "1f6c8386-85f6-4deb-bda8-e33a1b5b761c",
name: "name_en",
label: "&#33521;&#25991;&#21517;",
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
name_2: {
id: "aeed3c46-ee24-443f-8403-874f5abd8f8f",
name: "name_2",
label: "&#32553;&#20889;(2&#20010;&#23383;&#27597;)",
valueType: valueType.string,
decimalNum: 0,
valueLength: 2,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
name_3: {
id: "e7f75834-4580-4828-8443-75374f121fcf",
name: "name_3",
label: "&#32553;&#20889;(3&#20010;&#23383;&#27597;)",
valueType: valueType.string,
decimalNum: 0,
valueLength: 3,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
code: {
id: "aec60543-29c1-4432-b440-1e56f033c0f5",
name: "code",
label: "&#32534;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 5,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
fullname_cn: {
id: "a5ab94a5-482f-4620-ab75-97b76b01b916",
name: "fullname_cn",
label: "&#20013;&#25991;&#20840;&#31216;",
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
fullname_en: {
id: "39e10c50-f267-4727-b94e-6b2158e4185f",
name: "fullname_en",
label: "&#33521;&#25991;&#20840;&#31216;",
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
		var dataModel = dataModels.ie_gb_gjjdqzdb;
		var viewModel = viewModels.ie_gb_gjjdqzdb;
		var definitionId = "6b3626f1-781c-4ce7-b512-d23fad9884e5";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xh != null && result.values.xh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xh", title:"&#24207;&#21495;", operator:"like", value: result.values.xh });
}
if(result.values.name_cn != null && result.values.name_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_cn", title:"&#20013;&#25991;&#21517;", operator:"like", value: result.values.name_cn });
}
if(result.values.name_en != null && result.values.name_en.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_en", title:"&#33521;&#25991;&#21517;", operator:"like", value: result.values.name_en });
}
if(result.values.name_2 != null && result.values.name_2.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_2", title:"&#32553;&#20889;(2&#20010;&#23383;&#27597;)", operator:"like", value: result.values.name_2 });
}
if(result.values.name_3 != null && result.values.name_3.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_3", title:"&#32553;&#20889;(3&#20010;&#23383;&#27597;)", operator:"like", value: result.values.name_3 });
}
if(result.values.code != null && result.values.code.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"code", title:"&#32534;&#30721;", operator:"like", value: result.values.code });
}
if(result.values.fullname_cn != null && result.values.fullname_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fullname_cn", title:"&#20013;&#25991;&#20840;&#31216;", operator:"like", value: result.values.fullname_cn });
}
if(result.values.fullname_en != null && result.values.fullname_en.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fullname_en", title:"&#33521;&#25991;&#20840;&#31216;", operator:"like", value: result.values.fullname_en });
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
		<div class="tableQueryNameLine"><div class="tableQueryItemName">&#24207;&#21495;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xh" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#20013;&#25991;&#21517;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_cn" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#33521;&#25991;&#21517;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_en" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#32553;&#20889;(2&#20010;&#23383;&#27597;):&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_2" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#32553;&#20889;(3&#20010;&#23383;&#27597;):&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_3" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="code" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#20013;&#25991;&#20840;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fullname_cn" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#33521;&#25991;&#20840;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fullname_en" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">国标_国籍及地区字典表</div>	 
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