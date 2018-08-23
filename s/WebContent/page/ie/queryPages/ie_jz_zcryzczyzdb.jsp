<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_注册人员注册专业字典表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_注册人员注册专业字典表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_注册人员注册专业字典表">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_zcryzczyzdb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_zcryzczyzdb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xh: {
id: "eb1cff2f-c1a2-4bc7-a15c-0247e30771df",
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
id: "85368af1-8998-4759-b75b-253cf7483584",
name: "bm",
label: "&#20195;&#30721;",
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
zy: {
id: "7156f4d2-a9b3-4d7a-a5fe-95717c3be5c7",
name: "zy",
label: "&#19987;&#19994;",
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
zclxjdj: {
id: "2d462cb5-d478-41a2-97ff-7a13be3e32ff",
name: "zclxjdj",
label: "&#27880;&#20876;&#31867;&#22411;&#21450;&#31561;&#32423;",
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
		var dataModel = dataModels.ie_jz_zcryzczyzdb;
		var viewModel = viewModels.ie_jz_zcryzczyzdb;
		var definitionId = "4cdd519c-29c1-4687-9ce1-fc39ad664945";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xh", title:"&#24207;&#21495;", operator:"like", value: result.values.xh });
}
if(result.values.bm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"bm", title:"&#20195;&#30721;", operator:"like", value: result.values.bm });
}
if(result.values.zy.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zy", title:"&#19987;&#19994;", operator:"like", value: result.values.zy });
}
if(result.values.zclxjdj.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zclxjdj", title:"&#27880;&#20876;&#31867;&#22411;&#21450;&#31561;&#32423;", operator:"like", value: result.values.zclxjdj });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#20195;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="bm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#19987;&#19994;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zy" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#27880;&#20876;&#31867;&#22411;&#21450;&#31561;&#32423;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zclxjdj" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">建筑_注册人员注册专业字典表</div>	 
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