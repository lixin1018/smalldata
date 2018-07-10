<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>建筑_项目_竣工验收备案</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据助手,数据共享,数据工具,数据,数据抓取,建筑_项目_竣工验收备案"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	
	<meta http-equiv="description" content="建筑_项目_竣工验收备案">
	<script type="text/javascript" src="../js/ncpShareDataGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/ie_jz_xm_jgysba.js"></script>
	<script type="text/javascript" src="${viewModel}/ie_jz_xm_jgysba.js"></script>
	<link rel="stylesheet" type="text/css" href="../../h/css/siteCommon.css">
	<link rel="stylesheet" type="text/css" href="../css/sjgxTablePage.css">
	
	<script>
		var paramWinModelUnits = {xmbm: {
id: "4b45f2e8-3ee2-4943-b417-35d8a11f936a",
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
jgbabh: {
id: "88a69b9c-f6b8-45fc-9a8c-4d801fe4ba0e",
name: "jgbabh",
label: "&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;",
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
sjjgbabh: {
id: "5734d0dc-a80e-4bb6-89be-c4804db44c31",
name: "sjjgbabh",
label: "&#30465;&#32423;&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;",
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
sjkgrq: {
id: "ac52bed9-cc06-47af-b5c4-632859bf1087",
name: "sjkgrq",
label: "&#23454;&#38469;&#24320;&#24037;&#26085;&#26399;",
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
sjjgysrq: {
id: "7edb5d06-63e3-46c5-a165-592fc76b80a3",
name: "sjjgysrq",
label: "&#23454;&#38469;&#31459;&#24037;&#39564;&#25910;&#26085;&#26399;",
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
isdeleted: {
id: "6f0bdfea-e1f6-414f-804f-474a0dd2ebfb_1",
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
		var dataModel = dataModels.ie_jz_xm_jgysba;
		var viewModel = viewModels.ie_jz_xm_jgysba;
		var definitionId = "9c0b4a3c-6a2d-4c7b-904c-3969df9b4bc4";
		
		function queryData(pageNumber){ 		
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array();  
				if(result.values.xmbm.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"xmbm", title:"&#39033;&#30446;&#32534;&#30721;", operator:"like", value: result.values.xmbm });
}
if(result.values.jgbabh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"jgbabh", title:"&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;", operator:"like", value: result.values.jgbabh });
}
if(result.values.sjjgbabh.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjjgbabh", title:"&#30465;&#32423;&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;", operator:"like", value: result.values.sjjgbabh });
}
if(result.values.sjkgrq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjkgrq", title:"&#23454;&#38469;&#24320;&#24037;&#26085;&#26399;", operator:"like", value: result.values.sjkgrq });
}
if(result.values.sjjgysrq.length != 0){
gridWin.sysWhere.push({parttype:"field", field:"sjjgysrq", title:"&#23454;&#38469;&#31459;&#24037;&#39564;&#25910;&#26085;&#26399;", operator:"like", value: result.values.sjjgysrq });
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
<div class="tableQueryLine"><div class="tableQueryItemName">&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="jgbabh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#30465;&#32423;&#31459;&#24037;&#22791;&#26696;&#32534;&#21495;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjjgbabh" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#23454;&#38469;&#24320;&#24037;&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjkgrq" paramCtrl="true"/></div></div>
<div class="tableQueryLine"><div class="tableQueryItemName">&#23454;&#38469;&#31459;&#24037;&#39564;&#25910;&#26085;&#26399;:&nbsp;</div></div>
<div class="tableQueryLine"><div class="tableQueryItemInputContainer"><input class="tableQueryItemInput" type="text" name="sjjgysrq" paramCtrl="true"/></div></div>
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
				<div class="tableTitle">建筑_项目_竣工验收备案</div>	 
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