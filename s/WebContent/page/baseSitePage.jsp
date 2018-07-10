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

<!-- 页面 -->
<c:set var="pagePath" value="${base}/page" />  

<!-- 确定当前要使用的样式 -->
<c:set var="style" value="${themes}/${novaOneStylePath}" />
<c:set var="css" value="${style}" />
<c:set var="images" value="${style}/images" />
<c:set var="js" value="${themes}/" />


<!-- 项目名称(根据项目更改此处即可) -->
<c:set var="alertTitle" value="<%=novaOneObjectTitle %>" />

<c:set var="nochoiceEdit" value="请选择一条要修改的数据！" />
<c:set var="nochoiceDel" value="请至少选择一条要删除的数据！" />
<c:set var="oneAtATime" value="一次只能修改一条数据！" />
<c:set var="sureToDel" value="确定要删除选择的数据吗？删除后数据将无法恢复！" />

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
</script>

<!-- 加载框架运行库 -->
<script type="text/javascript" src="${jquery}/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="${jquery}/jquery.simplemodal.1.4.4.min.js"></script>  
<script type="text/javascript" src="${jquery}/lazyload.js"></script>
<script type="text/javascript" src="${basejs}/json.js"></script>
<script type="text/javascript" src="${basejs}/common.js"></script>
<script type="text/javascript" src="${basejs}/datatable.js"></script>
<script type="text/javascript" src="${basejs}/hashtable.js"></script>
<script type="text/javascript" src="${basejs}/datarow.js"></script>
<script type="text/javascript" src="${basejs}/static.js"></script>
<link rel="stylesheet" type="text/css" href="${css}/common.css"> 
<link rel="stylesheet" type="text/css" href="${pagePath}/h/css/siteCommon.css"> 
