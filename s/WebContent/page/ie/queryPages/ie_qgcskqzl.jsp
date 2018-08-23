<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>全国城市空气质量(2013.10至2018.5)</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,全国城市空气质量(2013.10至2018.5)"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="全国城市空气质量(2013.10至2018.5)">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_qgcskqzl.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_qgcskqzl.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {csbm: {
id: "1de61627-a316-41ae-b3c3-d195fd0606d9",
name: "csbm",
label: "&#22478;&#24066;&#32534;&#30721;",
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
csmc: {
id: "7c18580f-2c43-4977-abfe-0cd12f14dbab",
name: "csmc",
label: "&#22478;&#24066;&#21517;&#31216;",
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
rq: {
id: "a9365327-1cca-44dd-bdfd-a44b40e159f0",
name: "rq",
label: "&#26085;&#26399;",
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
zldj: {
id: "3c8efce9-0f1a-4e6c-9f85-51f94c31ece3",
name: "zldj",
label: "&#36136;&#37327;&#31561;&#32423;",
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
dtaqipm: {
id: "f754ed20-94b8-4b26-b7fe-c0c6b0c9b466",
name: "dtaqipm",
label: "&#24403;&#22825;AQI&#25490;&#21517;",
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
}};
		var dataModel = dataModels.ie_qgcskqzl;
		var viewModel = viewModels.ie_qgcskqzl;
		var definitionId = "c611b7d1-a264-45c0-8e21-d952100bb1e8";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.csbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"csbm", title:"&#22478;&#24066;&#32534;&#30721;", operator:"like", value: result.values.csbm });
}
if(result.values.csmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"csmc", title:"&#22478;&#24066;&#21517;&#31216;", operator:"like", value: result.values.csmc });
}
if(result.values.rq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"rq", title:"&#26085;&#26399;", operator:"like", value: result.values.rq });
}
if(result.values.zldj.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zldj", title:"&#36136;&#37327;&#31561;&#32423;", operator:"like", value: result.values.zldj });
}
if(result.values.dtaqipm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"dtaqipm", title:"&#24403;&#22825;AQI&#25490;&#21517;", operator:"like", value: result.values.dtaqipm });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">&#22478;&#24066;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="csbm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#22478;&#24066;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="csmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="rq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#36136;&#37327;&#31561;&#32423;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zldj" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#24403;&#22825;AQI&#25490;&#21517;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="dtaqipm" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">全国城市空气质量(2013.10至2018.5)</div>	 
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