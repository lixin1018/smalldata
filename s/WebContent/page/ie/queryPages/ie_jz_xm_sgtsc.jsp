<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_项目_施工图审查</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_项目_施工图审查"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_项目_施工图审查">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_xm_sgtsc.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_xm_sgtsc.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xmbm: {
id: "df9dce2c-5b52-4cc4-8c27-611a759c0715",
name: "xmbm",
label: "&#39033;&#30446;&#32534;&#30721;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
sgtschgsbh: {
id: "b7824aa9-8053-436c-9e42-eb4f9c8aecae",
name: "sgtschgsbh",
label: "&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 50,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
sjsgtschgsbh: {
id: "61967ef1-dd03-4299-9570-595cff931a84",
name: "sjsgtschgsbh",
label: "&#30465;&#32423;&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 80,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
kcdwmc: {
id: "c93ff78a-73c5-4251-9de1-6d58781b83c0",
name: "kcdwmc",
label: "&#21208;&#23519;&#21333;&#20301;&#21517;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
sjdwmc: {
id: "5b31588e-f123-4461-b4bc-15d4a01e69b2",
name: "sjdwmc",
label: "&#35774;&#35745;&#21333;&#20301;&#21517;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
sgtscjgmc: {
id: "7cc568b6-f2f9-452f-b1a2-3347680515fc",
name: "sgtscjgmc",
label: "&#26045;&#24037;&#22270;&#23457;&#26597;&#26426;&#26500;&#21517;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 200,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
scwcrq: {
id: "41c56d7e-ada6-41ce-b3fd-28a2ffcb9276",
name: "scwcrq",
label: "&#23457;&#26597;&#23436;&#25104;&#26085;&#26399;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 10,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
isdeleted: {
id: "15cdcab5-ad17-4c5c-b594-2665114c1474_1",
name: "isdeleted",
label: "&#24050;&#21024;&#38500;",
valueType: valueType.boolean,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 1,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"checkbox",
defaultValue: null
}};
		var dataModel = dataModels.ie_jz_xm_sgtsc;
		var viewModel = viewModels.ie_jz_xm_sgtsc;
		var definitionId = "83787a99-4ca0-4bd2-83b5-3170107487a8";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xmbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmbm", title:"&#39033;&#30446;&#32534;&#30721;", operator:"like", value: result.values.xmbm });
}
if(result.values.sgtschgsbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sgtschgsbh", title:"&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;", operator:"like", value: result.values.sgtschgsbh });
}
if(result.values.sjsgtschgsbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjsgtschgsbh", title:"&#30465;&#32423;&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;", operator:"like", value: result.values.sjsgtschgsbh });
}
if(result.values.kcdwmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"kcdwmc", title:"&#21208;&#23519;&#21333;&#20301;&#21517;&#31216;", operator:"like", value: result.values.kcdwmc });
}
if(result.values.sjdwmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjdwmc", title:"&#35774;&#35745;&#21333;&#20301;&#21517;&#31216;", operator:"like", value: result.values.sjdwmc });
}
if(result.values.sgtscjgmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sgtscjgmc", title:"&#26045;&#24037;&#22270;&#23457;&#26597;&#26426;&#26500;&#21517;&#31216;", operator:"like", value: result.values.sgtscjgmc });
}
if(result.values.scwcrq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"scwcrq", title:"&#23457;&#26597;&#23436;&#25104;&#26085;&#26399;", operator:"like", value: result.values.scwcrq });
}
if(result.values.isdeleted != null){
gridWin.sysWhere.push({parttype:"field", field:"isdeleted", title:"&#24050;&#21024;&#38500;", operator:"=", value:  cmnPcr.objectToStr(result.values.isdeleted, valueType.boolean) });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">&#39033;&#30446;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmbm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sgtschgsbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#30465;&#32423;&#26045;&#24037;&#22270;&#23457;&#26597;&#21512;&#26684;&#20070;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjsgtschgsbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#21208;&#23519;&#21333;&#20301;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="kcdwmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#35774;&#35745;&#21333;&#20301;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjdwmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#26045;&#24037;&#22270;&#23457;&#26597;&#26426;&#26500;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sgtscjgmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#23457;&#26597;&#23436;&#25104;&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="scwcrq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInputCheck" type="checkbox" name="isdeleted" paramCtrl="true"/>
<div class="tableQueryItemName">&#24050;&#21024;&#38500;:&nbsp;</div></div></div>
	 
		<div class="tableQueryBlankCell">&nbsp;</div> 
		<div class="tableQueryButtonLine">
			<div class="tableQueryButtonLineInner">
				<span id="queryButton" title="按照查询条件进行查询">查&nbsp;询</span>
				<span id="queryButtonCloseBtnId" title="关闭查询条件录入框">关&nbsp;闭</span>
			</div> 
		</div>  	
	</div>	 		
	<div class="headerMain" data-options="region:'north',border:false">  
		<jsp:include  page="headerSjgx.jsp">
			<jsp:param value="sjgx" name="menuName"/>
		</jsp:include>
		<div class="tableHeader">
			<div class="tableHeaderInner">  
				<div class="tableTitle">建筑_项目_施工图审查</div>	 
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