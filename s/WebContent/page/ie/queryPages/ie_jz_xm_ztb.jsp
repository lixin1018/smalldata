<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_项目_招投标</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_项目_招投标"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_项目_招投标">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_xm_ztb.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_xm_ztb.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xmbm: {
id: "78785a1d-7148-4f61-8073-e53434f27b8a",
name: "xmbm",
label: "&#39033;&#30446;&#32534;&#30721;",
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
zblx: {
id: "040cc89a-b285-4e24-92c0-5bbfbb087e45",
name: "zblx",
label: "&#25307;&#26631;&#31867;&#22411;",
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
zbfs: {
id: "681ce114-3ff2-4b53-8d42-ef76d3fca0b4",
name: "zbfs",
label: "&#25307;&#26631;&#26041;&#24335;",
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
zbdwmc: {
id: "e9ecfd6d-0ab8-492e-a900-bea5dc1f1300",
name: "zbdwmc",
label: "&#20013;&#26631;&#21333;&#20301;&#21517;&#31216;",
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
zbrq: {
id: "cd29f96d-1df8-4722-b586-babc094f6fd8",
name: "zbrq",
label: "&#20013;&#26631;&#26085;&#26399;",
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
zbtzsbh: {
id: "508c5c16-5279-4277-93dc-998767b4969c",
name: "zbtzsbh",
label: "&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;",
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
sjzbtzsbh: {
id: "a799b0ad-573b-4b38-a793-5304f34f4f33",
name: "sjzbtzsbh",
label: "&#30465;&#32423;&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;",
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
isdeleted: {
id: "633b6f5c-c667-41f2-883f-8b70d0e1915b_1",
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
		var dataModel = dataModels.ie_jz_xm_ztb;
		var viewModel = viewModels.ie_jz_xm_ztb;
		var definitionId = "9b229f9a-2b2d-4b0e-9c9b-b883d232f397";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xmbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmbm", title:"&#39033;&#30446;&#32534;&#30721;", operator:"like", value: result.values.xmbm });
}
if(result.values.zblx.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zblx", title:"&#25307;&#26631;&#31867;&#22411;", operator:"like", value: result.values.zblx });
}
if(result.values.zbfs.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zbfs", title:"&#25307;&#26631;&#26041;&#24335;", operator:"like", value: result.values.zbfs });
}
if(result.values.zbdwmc.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zbdwmc", title:"&#20013;&#26631;&#21333;&#20301;&#21517;&#31216;", operator:"like", value: result.values.zbdwmc });
}
if(result.values.zbrq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zbrq", title:"&#20013;&#26631;&#26085;&#26399;", operator:"like", value: result.values.zbrq });
}
if(result.values.zbtzsbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"zbtzsbh", title:"&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;", operator:"like", value: result.values.zbtzsbh });
}
if(result.values.sjzbtzsbh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjzbtzsbh", title:"&#30465;&#32423;&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;", operator:"like", value: result.values.sjzbtzsbh });
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
		<div class="tableQueryLine"><div class="tableQueryItemName">&#39033;&#30446;&#32534;&#30721;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="xmbm" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#25307;&#26631;&#31867;&#22411;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zblx" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#25307;&#26631;&#26041;&#24335;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zbfs" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20013;&#26631;&#21333;&#20301;&#21517;&#31216;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zbdwmc" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20013;&#26631;&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zbrq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="zbtzsbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#30465;&#32423;&#20013;&#26631;&#36890;&#30693;&#20070;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjzbtzsbh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInputCheck" type="checkbox" name="isdeleted" paramCtrl="true"/>
<div class="tableQueryItemName">&#24050;&#21024;&#38500;:&nbsp;</div></div></div>
	 
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
				<div class="tableTitle">建筑_项目_招投标</div>	 
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