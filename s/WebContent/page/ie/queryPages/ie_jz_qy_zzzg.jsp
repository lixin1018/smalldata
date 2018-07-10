<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_企业_资质资格</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_企业_资质资格"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_企业_资质资格">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_qy_zzzg.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_qy_zzzg.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {qyid: {
id: "2406a790-ff33-43dc-9a7e-224423001063",
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
zzlb: {
id: "749db4d6-a5d8-4b50-a89f-fbada223a8f4",
name: "zzlb",
label: "&#36164;&#36136;&#31867;&#21035;",
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
zzzsh: {
id: "0cb8e426-e0e2-4639-a5e6-09d4e0a7b975",
name: "zzzsh",
label: "&#36164;&#36136;&#35777;&#20070;&#21495;",
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
zzmc: {
id: "163e18dc-24ae-44e7-8ccb-66dc6e02903b",
name: "zzmc",
label: "&#36164;&#36136;&#21517;&#31216;",
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
fzrq: {
id: "f27fbf1a-33f4-48c2-8a75-bf7c8eaf0235",
name: "fzrq",
label: "&#21457;&#35777;&#26085;&#26399;",
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
zjyxq: {
id: "4b37012b-7cec-4ad2-af8c-f7b98b363012",
name: "zjyxq",
label: "&#35777;&#20214;&#26377;&#25928;&#26399;",
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
fzjg: {
id: "b52fcde0-a591-4030-977c-9944db399406",
name: "fzjg",
label: "&#21457;&#35777;&#26426;&#20851;",
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
isdeleted: {
id: "1a624b21-44b2-4547-8065-0778d3cd470d",
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
		var dataModel = dataModels.ie_jz_qy_zzzg;
		var viewModel = viewModels.ie_jz_qy_zzzg;
		var definitionId = "a6439249-f306-4184-b968-433727b50da0";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.qyid.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyid", title:"CompanyId", operator:"like", value: result.values.qyid });
}
if(result.values.zzlb.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zzlb", title:"&#36164;&#36136;&#31867;&#21035;", operator:"like", value: result.values.zzlb });
}
if(result.values.zzzsh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zzzsh", title:"&#36164;&#36136;&#35777;&#20070;&#21495;", operator:"like", value: result.values.zzzsh });
}
if(result.values.zzmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zzmc", title:"&#36164;&#36136;&#21517;&#31216;", operator:"like", value: result.values.zzmc });
}
if(result.values.fzrq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fzrq", title:"&#21457;&#35777;&#26085;&#26399;", operator:"like", value: result.values.fzrq });
}
if(result.values.zjyxq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zjyxq", title:"&#35777;&#20214;&#26377;&#25928;&#26399;", operator:"like", value: result.values.zjyxq });
}
if(result.values.fzjg.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fzjg", title:"&#21457;&#35777;&#26426;&#20851;", operator:"like", value: result.values.fzjg });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#36164;&#36136;&#31867;&#21035;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zzlb" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#36164;&#36136;&#35777;&#20070;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zzzsh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#36164;&#36136;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zzmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#21457;&#35777;&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fzrq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#35777;&#20214;&#26377;&#25928;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zjyxq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#21457;&#35777;&#26426;&#20851;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fzjg" paramCtrl="true"/></div></div>
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
				<div class="tableTitle">建筑_企业_资质资格</div>	 
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