<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_项目信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_项目信息"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_项目信息">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_xm.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_xm.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xmbh: {
id: "15690ec6-3582-45f9-bf8c-3baba160a73d",
name: "xmbh",
label: "&#39033;&#30446;&#32534;&#21495;",
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
sjxmbh: {
id: "2d0f805a-268a-400e-bd46-511570968140",
name: "sjxmbh",
label: "&#30465;&#32423;&#39033;&#30446;&#32534;&#21495;",
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
xmmc: {
id: "8fddc3fc-cb53-43b5-a432-723bc6388d72",
name: "xmmc",
label: "&#39033;&#30446;&#21517;&#31216;",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 500,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
szqh: {
id: "fe8a4e18-be3b-44f2-9685-e2e9a80c4da4",
name: "szqh",
label: "&#25152;&#22312;&#21306;&#21010;",
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
jsdw: {
id: "215bc662-64a8-4bca-900d-4963b252233b",
name: "jsdw",
label: "&#24314;&#35774;&#21333;&#20301;",
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
jsdwzzjgdm: {
id: "2d3e9fbf-b9d8-493a-88b2-d68e839011b2",
name: "jsdwzzjgdm",
label: "&#24314;&#35774;&#21333;&#20301;&#32452;&#32455;&#26426;&#26500;&#20195;&#30721;&#65288;&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;&#65289;",
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
xmfl: {
id: "9a893847-6061-4631-9242-496c126a5d8e",
name: "xmfl",
label: "&#39033;&#30446;&#20998;&#31867;",
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
isdeleted: {
id: "e901a3e3-fe57-4f18-92a2-3a3e0f8670ff_1",
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
		var dataModel = dataModels.ie_jz_xm;
		var viewModel = viewModels.ie_jz_xm;
		var definitionId = "ee42b547-70bb-45a4-83d5-04eef25ccea5";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xmbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmbh", title:"&#39033;&#30446;&#32534;&#21495;", operator:"like", value: result.values.xmbh });
}
if(result.values.sjxmbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjxmbh", title:"&#30465;&#32423;&#39033;&#30446;&#32534;&#21495;", operator:"like", value: result.values.sjxmbh });
}
if(result.values.xmmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmmc", title:"&#39033;&#30446;&#21517;&#31216;", operator:"like", value: result.values.xmmc });
}
if(result.values.szqh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"szqh", title:"&#25152;&#22312;&#21306;&#21010;", operator:"like", value: result.values.szqh });
}
if(result.values.jsdw.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jsdw", title:"&#24314;&#35774;&#21333;&#20301;", operator:"like", value: result.values.jsdw });
}
if(result.values.jsdwzzjgdm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jsdwzzjgdm", title:"&#24314;&#35774;&#21333;&#20301;&#32452;&#32455;&#26426;&#26500;&#20195;&#30721;&#65288;&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;&#65289;", operator:"like", value: result.values.jsdwzzjgdm });
}
if(result.values.xmfl.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmfl", title:"&#39033;&#30446;&#20998;&#31867;", operator:"like", value: result.values.xmfl });
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
		<div class="tableQueryLine"><div class="tableQueryItemName">&#39033;&#30446;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#30465;&#32423;&#39033;&#30446;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjxmbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#39033;&#30446;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#25152;&#22312;&#21306;&#21010;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="szqh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#24314;&#35774;&#21333;&#20301;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jsdw" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#24314;&#35774;&#21333;&#20301;&#32452;&#32455;&#26426;&#26500;&#20195;&#30721;&#65288;&#32479;&#19968;&#31038;&#20250;&#20449;&#29992;&#20195;&#30721;&#65289;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jsdwzzjgdm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#39033;&#30446;&#20998;&#31867;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmfl" paramCtrl="true"/></div></div>
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
				<div class="tableTitle">建筑_项目信息</div>	 
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