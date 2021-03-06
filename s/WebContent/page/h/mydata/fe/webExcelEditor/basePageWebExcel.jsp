<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.novacloud.novaone.dao.sys.SystemContext"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://" +request.getServerName() + ":"+ request.getServerPort() + path + "";
String novaOneStylePath = com.novacloud.novaone.core.ConfigContext.getConfigMap().get(com.novacloud.novaone.constants.NovaCloudState.NOVAONE_UI_STYLE);
String novaOneObjectTitle = com.novacloud.novaone.core.ConfigContext.getConfigMap().get(com.novacloud.novaone.constants.NovaCloudState.NOVAONE_PROJECT_NAME);
String novaOneRequestUrl = com.novacloud.novaone.core.ConfigContext.getConfigMap().get(com.novacloud.novaone.constants.NovaCloudState.NOVAONE_REQUEST_URL);
String novaOnePageJumpUrl = com.novacloud.novaone.core.ConfigContext.getConfigMap().get(com.novacloud.novaone.constants.NovaCloudState.NOVAONE_PAGEJUMP_URL);
//项目图片服务网址(文件引用system.properties)
String imageServer = SystemContext.getSysProperties().get("imageServer").toString();

%>
<c:set var="base" value="<%=basePath %>" />
<c:set var="novaOneStylePath" value="<%=novaOneStylePath %>" />
<c:set var="novaOneRequestUrl" value="<%=novaOneRequestUrl %>" />
<c:set var="novaOnePageJumpUrl" value="<%=novaOnePageJumpUrl %>" />
<c:set var="imageServer" value="<%=imageServer %>" />
<c:set var="novaoneStyle" value="${base}/novaone-style" />
<c:set var="plugins" value="${novaoneStyle}/plugins" />
<c:set var="novaone" value="${plugins}/novaone" />
<c:set var="jquery" value="${plugins}/jquery" />
<c:set var="themes" value="${novaone}/themes" />
<c:set var="basejs" value="${novaone}/base" />
<c:set var="expressionjs" value="${novaone}/expression" />
<c:set var="model" value="${novaone}/data-model" />
<c:set var="dataModel" value="${model}/data" />
<c:set var="viewModel" value="${model}/view" />
<c:set var="treeModel" value="${model}/tree" />
<c:set var="sheetModel" value="${model}/sheet" />
<c:set var="paramWinModel" value="${model}/paramWin" />
<c:set var="reportModel" value="${model}/report" />
<c:set var="locale" value="${novaone}/locale" />
<!-- js组件路径 -->
<c:set var="components" value="${plugins}/components" /> 

<!--扩展--> 
<c:set var="editor" value="${components}/kindeditor-4.1.10" /><!-- 富文本编辑 -->

<!-- 页面 -->
<c:set var="pagePath" value="${base}/page" />  

<!-- easyui-1.3.2 -->
<c:set var="easyui" value="${components}/easyui" />
<c:set var="easyuicss" value="${easyui}/themes" />

<!-- 确定当前要使用的样式 -->
<c:set var="style" value="${themes}/${novaOneStylePath}" />
<c:set var="css" value="${style}" />
<c:set var="images" value="${style}/images" />
<c:set var="js" value="${themes}/" />


<!-- 项目名称(根据项目更改此处即可) -->
<c:set var="alertTitle" value="<%=novaOneObjectTitle %>" /> 

<script type="text/javascript">
var basePath = "${base}";
var novaoneBanner = basePath+"/<%=session.getAttribute("novaBanner")%>";
var pluginpath = "${plugins}"; 
var baseTitle = "${alertTitle}";
var baseImages = "${images}";
var baseCss = "${css}";
var uploadify = "${uploadify}";
var imageServer = "${imageServer}";
var pagePath = "${pagePath}"; 
var _user_win = true;

//alert("basePage.jsp-->---"+novaoneBanner+"--------");

<!-- 禁止鼠标右键 -->
//ocument.oncontextmenu=function(){
//	event.cancelBubble=true;
//	event.returnValue=false;
//	return false;
//};
<!-- 禁止鼠标右键兼容火狐 -->
function stop(){ 
	return false; 
} 
//document.oncontextmenu=stop; 
</script>

<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.simplemodal.1.4.4.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.jqGrid.min.js"></script>
<script type="text/javascript" src="${jquery}/grid.locale-cn.js"></script>
<script type="text/javascript" src="${basejs}/json.js"></script>
<script type="text/javascript" src="${basejs}/common.js"></script>
<script type="text/javascript" src="${basejs}/datatable.js"></script>
<script type="text/javascript" src="${basejs}/hashtable.js"></script>
<script type="text/javascript" src="${basejs}/datarow.js"></script>
<script type="text/javascript" src="${basejs}/static.js"></script>
<script type="text/javascript" src="${basejs}/ncpGrid.js"></script>
<script type="text/javascript" src="${basejs}/ncpGridCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpView.js"></script>
<script type="text/javascript" src="${basejs}/ncpSheet.js"></script>
<script type="text/javascript" src="${basejs}/ncpTree.js"></script>
<script type="text/javascript" src="${basejs}/ncpTreeCard.js"></script>
<script type="text/javascript" src="${basejs}/ncpTreeStyleGrid.js"></script>
<script type="text/javascript" src="${basejs}/ncpMultiStyleWin.js"></script> 
<script type="text/javascript" src="${basejs}/ncpParamWin.js"></script>
<script type="text/javascript" src="${basejs}/dispunit.js"></script>

<!-- 表达式函数列表 -->
<script type="text/javascript" src="${expressionjs}/functionList.js"></script>

<!-- 运行js表达式 -->
<script type="text/javascript" src="${expressionjs}/expressionRunner.js"></script>

<!-- 用户自定义扩展库 -->
<script type="text/javascript" src="${expressionjs}/expCommon.js"></script>

<!-- 富文本编辑 -->
<link rel="stylesheet" type="text/css" href="${editor}/themes/default/default.css">
<link rel="stylesheet" type="text/css" href="${editor}/plugins/code/prettify.css">
<script type="text/javascript" charset="utf-8" src="${editor}/kindeditor.js"></script>
<script type="text/javascript" charset="utf-8" src="${editor}/lang/zh_CN.js"></script>
<script type="text/javascript" charset="utf-8" src="${editor}/plugins/code/prettify.js"></script>
<script type="text/javascript" src="${editor}/novaone-keditor.min.js"></script>

<link rel="stylesheet" type="text/css" href="${css}/common.css">
<link rel="stylesheet" type="text/css" href="${css}/jquery-ui-custom.css">
<link rel="stylesheet" type="text/css" href="${css}/ui.jqgrid.css">
<link rel="stylesheet" type="text/css" href="${css}/easyui.css">
<link rel="stylesheet" type="text/css" href="${css}/icon.css">
<link rel="stylesheet" type="text/css" href="${css}/ncpCard.css">
<link rel="stylesheet" type="text/css" href="${css}/ncpGrid.css">