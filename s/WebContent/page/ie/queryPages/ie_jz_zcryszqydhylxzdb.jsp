<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_注册人员所在企业的行业类型字典表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_注册人员所在企业的行业类型字典表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_注册人员所在企业的行业类型字典表">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_zcryszqydhylxzdb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_zcryszqydhylxzdb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xh: {
id: "40feb4a4-d263-4f10-a9ad-abeca22d2da0",
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
id: "ac56cc4c-509b-4843-84cf-d5a06761cfde",
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
hylx: {
id: "01ff06bf-0d29-4ad1-b05e-c3d4706e1f79",
name: "hylx",
label: "&#34892;&#19994;&#31867;&#22411;",
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
		var dataModel = dataModels.ie_jz_zcryszqydhylxzdb;
		var viewModel = viewModels.ie_jz_zcryszqydhylxzdb;
		var definitionId = "5b4f1eef-2692-4fe3-994c-c0e974fe8709";
		
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
if(result.values.hylx.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"hylx", title:"&#34892;&#19994;&#31867;&#22411;", operator:"like", value: result.values.hylx });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#34892;&#19994;&#31867;&#22411;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="hylx" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">建筑_注册人员所在企业的行业类型字典表</div>	 
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