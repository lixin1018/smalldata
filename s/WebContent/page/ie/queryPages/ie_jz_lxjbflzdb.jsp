<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_立项级别分类字典表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_立项级别分类字典表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_立项级别分类字典表">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_lxjbflzdb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_lxjbflzdb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xh: {
id: "3e49ee4c-8273-4a08-8153-cc0163707714",
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
bm: {
id: "57710c27-0bfd-4659-a2a2-79f268106ad9",
name: "bm",
label: "&#32534;&#30721;",
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
lxjb: {
id: "88b1b86b-7803-4542-afd2-af547cf2cf5b",
name: "lxjb",
label: "&#31435;&#39033;&#32423;&#21035;",
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
}};
		var dataModel = dataModels.ie_jz_lxjbflzdb;
		var viewModel = viewModels.ie_jz_lxjbflzdb;
		var definitionId = "d578f40f-b61d-4108-8850-a70d5cc0b06a";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xh", title:"&#24207;&#21495;", operator:"like", value: result.values.xh });
}
if(result.values.bm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"bm", title:"&#32534;&#30721;", operator:"like", value: result.values.bm });
}
if(result.values.lxjb.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"lxjb", title:"&#31435;&#39033;&#32423;&#21035;", operator:"like", value: result.values.lxjb });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="bm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#31435;&#39033;&#32423;&#21035;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="lxjb" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">建筑_立项级别分类字典表</div>	 
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