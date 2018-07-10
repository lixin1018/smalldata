<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html>
<head> 
	<title>文件上传</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
		
	<link rel="stylesheet" type="text/css" href="${uploadify}/uploadify.css">
	<script type="text/javascript" src="${uploadify}/swfobject.js"></script>
	<script type="text/javascript" src="${uploadify}/jquery.uploadify.min.js"></script>
	
	<script type="text/javascript">
		$(document).ready(function() {
			var initParam = window.parent.accessoryInitParam; 
			
			$("#uploadify").uploadify({
			       'uploader': uploadify + "/uploadify.swf",
			       'script': basePath + '/accessory/uploadFile',//后台处理的请求
			       'cancelImg': uploadify + "/cancel.png",
			       'buttonImg':  uploadify + "/browse.png",  
			       'method': "get",
			       'rollover': false,
			       'queueID': "fileQueue",
			       'auto': false,
			       'multi': initParam.multi == undefined?false:initParam.multi,
			       //修改文件大小的限制  
			       'sizeLimit': initParam.sizeLimit == undefined?10*1024*1024:initParam.sizeLimit,
			
			       //增加了文件类型的限制 modified by lixin 20120905
			       'fileExt': initParam.fileExt == undefined?"*.*":initParam.fileExt,
			       'fileDesc': initParam.fileDesc == undefined?"":initParam.fileDesc,
			
			       'simUploadLimit': 1,
			       'width': 92,
			       'height': 23, 
			       
			       'scriptData': { filterType: initParam.filterType, filterValue: initParam.filterValue },
			       'onError': function(event, queueID, fileObj) { 
			    	   	if(initParam.onError != undefined){
			    	   		return initParam.onError(event, queueID, fileObj);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       },
			       'onComplete': function(event, queueId, fileObj, response, data) {
			    	   	if(initParam.onComplete != undefined){
			    	   		return initParam.onComplete(event, queueId, fileObj, response, data);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       },
			       'onAllComplete': function(event, data) { 
			    	   	if(initParam.onAllComplete != undefined){
			    	   		return initParam.onAllComplete(event, data);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       },
			       'onSelect': function(event, queueId, fileObj) { 
			    	   	if(initParam.onSelect != undefined){
			    	   		return initParam.onSelect(event, queueId, fileObj);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       },
			       'onProgress ':function(event, queueId, fileObj, data){
			    	   	if(initParam.onProgress != undefined){
			    	   		return initParam.onProgress(event, queueId, fileObj, data);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       },
			       'onOpen':function(event, queueId, fileObj){
			    	   	if(initParam.onProgress != undefined){
			    	   		return initParam.onProgress(event, queueId, fileObj, data);
			    	   	}
			    	   	else{
			           		return true;
			    	   	}
			       }
			});
		});
	</script>
</head>
<body>
	<div style="padding:5px;width:100%;height:20px;">
        <input type="file" name="uploadify" id="uploadify" />
        <a href="javascript:$('#uploadify').uploadifyUpload()" style="font-size:13px;">开始上传</a>
	</div>
	<div id="fileQueue"></div>
</body>
</html>