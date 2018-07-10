<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_企业_注册人员</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_企业_注册人员"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_企业_注册人员">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_qy_zcry.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_qy_zcry.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {qyid: {
id: "b89369e1-31a4-48c1-bcc1-d60ca3ce4edc",
name: "qyid",
label: "CompanyId",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 30,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
xm: {
id: "168600a5-5039-4b56-9236-1187d866b80e",
name: "xm",
label: "&#22995;&#21517;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
sfzh: {
id: "8d0283e1-4e02-4551-950b-60287dfa09b5",
name: "sfzh",
label: "&#36523;&#20221;&#35777;&#21495;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
zclb: {
id: "2e600c45-2304-46cc-90e3-ea93eb0ed00e",
name: "zclb",
label: "&#27880;&#20876;&#31867;&#21035;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
zch: {
id: "6eddc0ac-f9bb-41fa-a969-b3306296ce90",
name: "zch",
label: "&#27880;&#20876;&#21495;&#65288;&#25191;&#19994;&#21360;&#31456;&#21495;&#65289;",
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
zczy: {
id: "ee91f0ba-bfc0-419f-ab41-0a66f71e91ec",
name: "zczy",
label: "&#27880;&#20876;&#19987;&#19994;",
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
isdeleted: {
id: "ca15cef6-c9f8-4a44-ac33-cba92a4b2b01_1",
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
		var dataModel = dataModels.ie_jz_qy_zcry;
		var viewModel = viewModels.ie_jz_qy_zcry;
		var definitionId = "3e80274d-b040-4070-ae54-54a58f9f8c36";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.qyid.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyid", title:"CompanyId", operator:"like", value: result.values.qyid });
}
if(result.values.xm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xm", title:"&#22995;&#21517;", operator:"like", value: result.values.xm });
}
if(result.values.sfzh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sfzh", title:"&#36523;&#20221;&#35777;&#21495;", operator:"like", value: result.values.sfzh });
}
if(result.values.zclb.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zclb", title:"&#27880;&#20876;&#31867;&#21035;", operator:"like", value: result.values.zclb });
}
if(result.values.zch.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zch", title:"&#27880;&#20876;&#21495;&#65288;&#25191;&#19994;&#21360;&#31456;&#21495;&#65289;", operator:"like", value: result.values.zch });
}
if(result.values.zczy.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zczy", title:"&#27880;&#20876;&#19987;&#19994;", operator:"like", value: result.values.zczy });
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
		<div class="tableQueryLine"><div class="tableQueryItemName">CompanyId:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyid" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#22995;&#21517;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#36523;&#20221;&#35777;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sfzh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#27880;&#20876;&#31867;&#21035;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zclb" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#27880;&#20876;&#21495;&#65288;&#25191;&#19994;&#21360;&#31456;&#21495;&#65289;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zch" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#27880;&#20876;&#19987;&#19994;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zczy" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInputCheck" type="checkbox" name="isdeleted" paramCtrl="true"/></div>
<div class="tableQueryItemInputContainer tableQueryItemCheckTitleContainer"><div class="tableQueryItemName tableQueryCheckItemName">&#24050;&#21024;&#38500;:&nbsp;</div></div></div>
	 
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
				<div class="tableTitle">建筑_企业_注册人员</div>	 
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