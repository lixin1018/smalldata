<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>user_umassd_new_name_list</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,user_umassd_new_name_list"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="user_umassd_new_name_list">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_user_umassd_new_name_list.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_user_umassd_new_name_list.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {state: {
id: "137058e2-abbb-49fe-b430-7b729855ebd1",
name: "state",
label: "STATE",
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
address: {
id: "3bc00064-7491-448e-b6e7-7c3fb83d3752",
name: "address",
label: "ADDRESS",
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
exec_fname: {
id: "b62fd758-f40c-41c1-9e29-d1d3171088be",
name: "exec_fname",
label: "EXEC_FNAME",
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
city: {
id: "b104d3de-160b-4dcd-b7cc-0d7c99e5f7c0",
name: "city",
label: "CITY",
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
exec_fullname: {
id: "5ace48f1-ef7e-438d-9a5d-3401106311c1",
name: "exec_fullname",
label: "EXEC_FULLNAME",
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
exec_mname: {
id: "fc723d9c-6d2c-4d90-b7c2-cb1ac64d58d3",
name: "exec_mname",
label: "EXEC_MNAME",
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
exec_lname: {
id: "bec7501b-fa64-4423-a2df-82e5327d62fc",
name: "exec_lname",
label: "EXEC_LNAME",
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
}};
		var dataModel = dataModels.ie_user_umassd_new_name_list;
		var viewModel = viewModels.ie_user_umassd_new_name_list;
		var definitionId = "b3c63317-4502-44bc-ae9c-4cd8f3cc4556";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.state.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"state", title:"STATE", operator:"like", value: result.values.state });
}
if(result.values.address.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"address", title:"ADDRESS", operator:"like", value: result.values.address });
}
if(result.values.exec_fname.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"exec_fname", title:"EXEC_FNAME", operator:"like", value: result.values.exec_fname });
}
if(result.values.city.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"city", title:"CITY", operator:"like", value: result.values.city });
}
if(result.values.exec_fullname.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"exec_fullname", title:"EXEC_FULLNAME", operator:"like", value: result.values.exec_fullname });
}
if(result.values.exec_mname.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"exec_mname", title:"EXEC_MNAME", operator:"like", value: result.values.exec_mname });
}
if(result.values.exec_lname.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"exec_lname", title:"EXEC_LNAME", operator:"like", value: result.values.exec_lname });
}
 
				gridWin.doPage({ pageNumber:pageNumber});
			}			
		}	
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id="dataGridContainer"> 
	<div id="queryControlContainerId" class="tableQueryContainer"> 
		<div class="tableQueryLine"><div class="tableQueryItemName">STATE:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="state" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">ADDRESS:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="address" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">EXEC_FNAME:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="exec_fname" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">CITY:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="city" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">EXEC_FULLNAME:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="exec_fullname" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">EXEC_MNAME:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="exec_mname" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">EXEC_LNAME:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="exec_lname" paramCtrl="true"/></div></div>
	 
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
				<div class="tableTitle">user_umassd_new_name_list</div>	 
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