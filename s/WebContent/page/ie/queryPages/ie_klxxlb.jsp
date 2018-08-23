<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>恐龙信息列表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,恐龙信息列表"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="恐龙信息列表">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_klxxlb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_klxxlb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {name: {
id: "08fa6448-18d1-4a08-b642-f00a44b4fd25",
name: "name",
label: "name",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 40,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
name_cn: {
id: "a0bd7843-521a-455e-988b-f8f09067f5f7",
name: "name_cn",
label: "name_cn",
valueType: valueType.string,
inputHelpType: "",
inputHelpName: "",
decimalNum: 0,
valueLength: 40,
isMultiValue: false,
isNullable: true,
isEditable: true,
unitType:"text",
defaultValue: null
},
area: {
id: "747c22d2-5fb9-402c-b997-42c880dc33d6",
name: "area",
label: "area",
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
area_cn: {
id: "4534381a-69aa-4532-9ac5-4af40ec108b6",
name: "area_cn",
label: "area_cn",
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
}};
		var dataModel = dataModels.ie_klxxlb;
		var viewModel = viewModels.ie_klxxlb;
		var definitionId = "22077b26-87c7-4be8-95e7-314d02caf3e3";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.name.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name", title:"name", operator:"like", value: result.values.name });
}
if(result.values.name_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"name_cn", title:"name_cn", operator:"like", value: result.values.name_cn });
}
if(result.values.area.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"area", title:"area", operator:"like", value: result.values.area });
}
if(result.values.area_cn.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"area_cn", title:"area_cn", operator:"like", value: result.values.area_cn });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">name:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">name_cn:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="name_cn" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">area:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="area" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">area_cn:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="area_cn" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">恐龙信息列表</div>	 
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