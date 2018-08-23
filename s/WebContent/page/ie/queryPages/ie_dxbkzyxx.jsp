<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>大学本科专业信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,大学本科专业信息"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="大学本科专业信息">
	<script type="text/javascript" src="${dataModel}/ie_dxbkzyxx.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_dxbkzyxx.js"></script>
	
	<script>
		var paramWinModelUnits = {xw: {
id: "51f22729-3222-4c90-9cd8-8cdf0bc49003",
name: "xw",
label: "&#23398;&#20301;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "null",
inputHelpName: "null",
unitType:"text",
defaultValue: null
},
xkfl: {
id: "bc396486-c26a-499e-9e69-f1284ee64687",
name: "xkfl",
label: "&#23398;&#31185;&#20998;&#31867;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "pop",
inputHelpName: "pop/ie/popPages/dxbkxkfl.jsp",
unitType:"text",
defaultValue: null
},
yjxk: {
id: "a34b97d2-7827-4bd6-ad1d-2100a16cb32e",
name: "yjxk",
label: "&#19968;&#32423;&#23398;&#31185;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "null",
inputHelpName: "null",
unitType:"text",
defaultValue: null
},
zy: {
id: "10ea3391-4d07-47d2-8bc3-a2da8233cc7a",
name: "zy",
label: "&#19987;&#19994;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "null",
inputHelpName: "null",
unitType:"text",
defaultValue: null
},
zydm: {
id: "8b7b86aa-c7c7-496c-a497-e8701eddecbf",
name: "zydm",
label: "&#19987;&#19994;&#20195;&#30721;",
valueType: valueType.string,
decimalNum: 0,
valueLength: 20,
isMultiValue: false,
isNullable: true,
isEditable: true,
inputHelpType: "null",
inputHelpName: "null",
unitType:"text",
defaultValue: null
}};
		var dataModel = dataModels.ie_dxbkzyxx;
		var viewModel = viewModels.ie_dxbkzyxx;
		var definitionId = "f67bdc50-745e-4ad5-af5b-43ebfc763c77";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xw != null && result.values.xw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xw", title:"&#23398;&#20301;", operator:"like", value: result.values.xw });
}
if(result.values.xkfl != null && result.values.xkfl.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xkfl", title:"&#23398;&#31185;&#20998;&#31867;", operator:"like", value: result.values.xkfl });
}
if(result.values.yjxk != null && result.values.yjxk.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"yjxk", title:"&#19968;&#32423;&#23398;&#31185;", operator:"like", value: result.values.yjxk });
}
if(result.values.zy != null && result.values.zy.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zy", title:"&#19987;&#19994;", operator:"like", value: result.values.zy });
}
if(result.values.zydm != null && result.values.zydm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zydm", title:"&#19987;&#19994;&#20195;&#30721;", operator:"like", value: result.values.zydm });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">&#23398;&#20301;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xw" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#23398;&#31185;&#20998;&#31867;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xkfl" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#19968;&#32423;&#23398;&#31185;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="yjxk" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#19987;&#19994;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zy" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#19987;&#19994;&#20195;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zydm" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">大学本科专业信息</div>	 
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