<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePageShareData.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>全国绿色建筑项目(20170721)</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,全国绿色建筑项目(20170721)"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="全国绿色建筑项目(20170721)"> 
	<script type="text/javascript" src="${dataModel}/ie_qglsjzxm.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_qglsjzxm.js"></script> 
	
	<script>
		var paramWinModelUnits = {xmmc: {
id: "62ab6f5b-7cb5-43ff-91ce-332eb9c65b42",
name: "xmmc",
label: "&#39033;&#30446;&#21517;&#31216;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
rzlb: {
id: "ed4017db-6dda-413a-af19-c13cc74a583b",
name: "rzlb",
label: "&#35748;&#35777;&#31867;&#21035;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
tzdw: {
id: "4d080c78-4fcd-4eb6-8a20-052395943cbc",
name: "tzdw",
label: "&#25237;&#36164;&#21333;&#20301;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
zxdw: {
id: "6343bd91-fcdc-435a-a65c-84272045e1ca",
name: "zxdw",
label: "&#21672;&#35810;&#21333;&#20301;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
rzsj: {
id: "454bcee1-1347-4d83-8940-e9b6ab6cab6f",
name: "rzsj",
label: "&#35748;&#35777;&#26102;&#38388;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
sjdw: {
id: "dfc21ad1-fdfd-47d5-8b4d-e877fc4c276f",
name: "sjdw",
label: "&#35774;&#35745;&#21333;&#20301;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
},
sgdw: {
id: "c0be7c4e-d3a6-42b4-a7fa-63c26b759f11",
name: "sgdw",
label: "&#26045;&#24037;&#21333;&#20301;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "",
inputHelpName: "",
unitType:"text",
defaultValue: null
}};
		var dataModel = dataModels.ie_qglsjzxm;
		var viewModel = viewModels.ie_qglsjzxm;
		var definitionId = "ed3b8cb3-6eae-441f-99fc-8beaa7dab570";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xmmc != null && result.values.xmmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmmc", title:"&#39033;&#30446;&#21517;&#31216;", operator:"like", value: result.values.xmmc });
}
if(result.values.rzlb != null && result.values.rzlb.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"rzlb", title:"&#35748;&#35777;&#31867;&#21035;", operator:"like", value: result.values.rzlb });
}
if(result.values.tzdw != null && result.values.tzdw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"tzdw", title:"&#25237;&#36164;&#21333;&#20301;", operator:"like", value: result.values.tzdw });
}
if(result.values.zxdw != null && result.values.zxdw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zxdw", title:"&#21672;&#35810;&#21333;&#20301;", operator:"like", value: result.values.zxdw });
}
if(result.values.rzsj != null && result.values.rzsj.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"rzsj", title:"&#35748;&#35777;&#26102;&#38388;", operator:"like", value: result.values.rzsj });
}
if(result.values.sjdw != null && result.values.sjdw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjdw", title:"&#35774;&#35745;&#21333;&#20301;", operator:"like", value: result.values.sjdw });
}
if(result.values.sgdw != null && result.values.sgdw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sgdw", title:"&#26045;&#24037;&#21333;&#20301;", operator:"like", value: result.values.sgdw });
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
		<div class="tableQueryNameLine"><div class="tableQueryItemName">&#39033;&#30446;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmmc" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#35748;&#35777;&#31867;&#21035;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="rzlb" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#25237;&#36164;&#21333;&#20301;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="tzdw" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#21672;&#35810;&#21333;&#20301;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zxdw" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#35748;&#35777;&#26102;&#38388;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="rzsj" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#35774;&#35745;&#21333;&#20301;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjdw" paramCtrl="true"/></div></div>
<div class="tableQueryNameLine"><div class="tableQueryItemName">&#26045;&#24037;&#21333;&#20301;:&nbsp;</div></div>
<div class="tableQueryValueLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sgdw" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">全国绿色建筑项目(20170721)</div>	 
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