<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>国籍及地区字典表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,国籍及地区字典表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="国籍及地区字典表">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_gjjdqzdb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_gjjdqzdb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xh: {
id: "e5fdb9aa-4f6b-4c7a-bece-127aff59a070",
name: "xh",
label: "&#24207;&#21495;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 5,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
name_cn: {
id: "2ef5bdb6-ae58-4400-847d-3874aa626a46",
name: "name_cn",
label: "&#20013;&#25991;&#21517;",
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
name_en: {
id: "94aad950-e28b-4d88-aec4-0c472cd9c8f6",
name: "name_en",
label: "&#33521;&#25991;&#21517;",
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
name_2: {
id: "962da787-c886-4fcb-9dec-42ac122c7ad5",
name: "name_2",
label: "&#32553;&#20889;(2&#20010;&#23383;&#27597;)",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 2,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
name_3: {
id: "8eb4f005-209f-425a-915e-f1c076cda446",
name: "name_3",
label: "&#32553;&#20889;(3&#20010;&#23383;&#27597;)",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 3,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
code: {
id: "557ff54f-6e6a-453f-ae4d-5bab8c2dd117",
name: "code",
label: "&#32534;&#30721;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 5,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
fullname_cn: {
id: "46dcc312-ca73-421d-8231-325b9258aa97",
name: "fullname_cn",
label: "&#20013;&#25991;&#20840;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 100,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
fullname_en: {
id: "44e230e4-b8f5-422b-9592-8c3227ae6437",
name: "fullname_en",
label: "&#33521;&#25991;&#20840;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 100,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
}};
		var dataModel = dataModels.ie_gjjdqzdb;
		var viewModel = viewModels.ie_gjjdqzdb;
		var definitionId = "6b3626f1-781c-4ce7-b512-d23fad9884e5";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xh", title:"&#24207;&#21495;", operator:"like", value: result.values.xh });
}
if(result.values.name_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_cn", title:"&#20013;&#25991;&#21517;", operator:"like", value: result.values.name_cn });
}
if(result.values.name_en.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_en", title:"&#33521;&#25991;&#21517;", operator:"like", value: result.values.name_en });
}
if(result.values.name_2.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_2", title:"&#32553;&#20889;(2&#20010;&#23383;&#27597;)", operator:"like", value: result.values.name_2 });
}
if(result.values.name_3.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_3", title:"&#32553;&#20889;(3&#20010;&#23383;&#27597;)", operator:"like", value: result.values.name_3 });
}
if(result.values.code.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"code", title:"&#32534;&#30721;", operator:"like", value: result.values.code });
}
if(result.values.fullname_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fullname_cn", title:"&#20013;&#25991;&#20840;&#31216;", operator:"like", value: result.values.fullname_cn });
}
if(result.values.fullname_en.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"fullname_en", title:"&#33521;&#25991;&#20840;&#31216;", operator:"like", value: result.values.fullname_en });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">&#24207;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20013;&#25991;&#21517;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_cn" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#33521;&#25991;&#21517;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_en" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#32553;&#20889;(2&#20010;&#23383;&#27597;):&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_2" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#32553;&#20889;(3&#20010;&#23383;&#27597;):&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_3" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="code" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20013;&#25991;&#20840;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fullname_cn" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#33521;&#25991;&#20840;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="fullname_en" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">国籍及地区字典表</div>	 
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