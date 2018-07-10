<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_企业信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_企业信息"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_企业信息">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_qy.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_qy.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {qyid: {
id: "09f3f434-e3f5-48cc-80e8-e050f2754c36",
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
qymc: {
id: "c0a037df-fed0-4145-8d84-d949c596375e",
name: "qymc",
label: "&#20225;&#19994;&#21517;&#31216;",
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
tyshxydm: {
id: "0d5f1686-cf01-46df-bf9a-8aadac3f6ca5",
name: "tyshxydm",
label: "&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;",
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
qyfddbr: {
id: "5bc5f340-b616-435f-b2eb-d0037d5a1636",
name: "qyfddbr",
label: "&#20225;&#19994;&#27861;&#23450;&#20195;&#34920;&#20154;",
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
qydjzclx: {
id: "0b48b3d7-ce32-4e19-bcd9-e6ca267e7850",
name: "qydjzclx",
label: "&#20225;&#19994;&#30331;&#35760;&#27880;&#20876;&#31867;&#22411;",
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
qyzcsdbm: {
id: "c6a8ecea-0f96-4ca3-aacc-221cd2161114",
name: "qyzcsdbm",
label: "&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;&#32534;&#30721;",
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
qyzcsd: {
id: "45581cae-24b2-417f-be14-d7c26a47c116",
name: "qyzcsd",
label: "&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;",
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
qyjydbm: {
id: "8cdf75a8-196f-4101-930c-f99529ad8e19",
name: "qyjydbm",
label: "&#20225;&#19994;&#32463;&#33829;&#22320;&#32534;&#30721;",
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
qyjyd: {
id: "1d5aaf3f-a54e-4bff-b5e1-e6ec3e265093",
name: "qyjyd",
label: "&#20225;&#19994;&#32463;&#33829;&#22320;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 59,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
qyjydz: {
id: "f440682c-07ac-4b70-be29-e2477eb1d7fd",
name: "qyjydz",
label: "&#20225;&#19994;&#32463;&#33829;&#22320;&#22336;",
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
id: "5cb0457c-447e-45f3-82b9-309b2006e506",
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
		var dataModel = dataModels.ie_jz_qy;
		var viewModel = viewModels.ie_jz_qy;
		var definitionId = "1d676253-8017-45a2-bf4f-6f9be842a6ee";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.qyid.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyid", title:"CompanyId", operator:"like", value: result.values.qyid });
}
if(result.values.qymc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qymc", title:"&#20225;&#19994;&#21517;&#31216;", operator:"like", value: result.values.qymc });
}
if(result.values.tyshxydm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"tyshxydm", title:"&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;", operator:"like", value: result.values.tyshxydm });
}
if(result.values.qyfddbr.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyfddbr", title:"&#20225;&#19994;&#27861;&#23450;&#20195;&#34920;&#20154;", operator:"like", value: result.values.qyfddbr });
}
if(result.values.qydjzclx.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qydjzclx", title:"&#20225;&#19994;&#30331;&#35760;&#27880;&#20876;&#31867;&#22411;", operator:"like", value: result.values.qydjzclx });
}
if(result.values.qyzcsdbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyzcsdbm", title:"&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;&#32534;&#30721;", operator:"like", value: result.values.qyzcsdbm });
}
if(result.values.qyzcsd.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyzcsd", title:"&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;", operator:"like", value: result.values.qyzcsd });
}
if(result.values.qyjydbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyjydbm", title:"&#20225;&#19994;&#32463;&#33829;&#22320;&#32534;&#30721;", operator:"like", value: result.values.qyjydbm });
}
if(result.values.qyjyd.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyjyd", title:"&#20225;&#19994;&#32463;&#33829;&#22320;", operator:"like", value: result.values.qyjyd });
}
if(result.values.qyjydz.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"qyjydz", title:"&#20225;&#19994;&#32463;&#33829;&#22320;&#22336;", operator:"like", value: result.values.qyjydz });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qymc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="tyshxydm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#27861;&#23450;&#20195;&#34920;&#20154;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyfddbr" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#30331;&#35760;&#27880;&#20876;&#31867;&#22411;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qydjzclx" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyzcsdbm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#27880;&#20876;&#23646;&#22320;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyzcsd" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#32463;&#33829;&#22320;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyjydbm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#32463;&#33829;&#22320;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyjyd" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20225;&#19994;&#32463;&#33829;&#22320;&#22336;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="qyjydz" paramCtrl="true"/></div></div>
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
				<div class="tableTitle">建筑_企业信息</div>	 
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