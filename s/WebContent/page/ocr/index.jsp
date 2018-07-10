<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %> 
<%@ include file="../basePage.jsp" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">  
	<title>文字识别</title>
	<link rel="stylesheet" type="text/css" href="${css}/common.css">
	<link rel="stylesheet" type="text/css" href="${css}/mainPage.css"> 
	<script type="text/javascript" src="index.js"></script>  
</head> 
<body style="width:100%;border:0;margin:0;padding:0;overflow:auto;">
	<div style="width:1000px;margin:0 auto;font-size:13px;">
		<div style="width:100%;height:35px;position:relative;">
			<div style="position:absolute; left:5px; top:8px; height:20px; width:6px;background-color:#2477D7;"></div>
			<div style="position:absolute; left:20px; top:9px; height:25px;width:80px;font-size:13px;">文字识别</div>	  
		</div>
		<div style="width:100%;height:35px;position:relative;">
			<div style="position:absolute; left:5px; top:8px; height:20px; width:80px;">图片地址</div>
			<div style="position:absolute; left:80px; top:9px; height:25px;width:400px;font-size:13px;">
				<input type="input" id="imageFilePathId" value="‪D:\t\201803261056321.jpg" style="width:400px;" />
			</div>	
			<div style="position:absolute; left:500px; top:9px; height:25px;width:80px;font-size:13px;">
				<input type="button" id="getStringFromImageBtnId" value="‪识别" style="width:80px;" />
			</div>	  
		</div>
		<div style="width:100%;height:300px;position:relative;">
			<div style="position:absolute; left:5px; top:8px; height:20px; width:80px;">识别结果</div>
			<div style="position:absolute; left:80px; top:9px; height:300px;width:400px;font-size:13px;">
				<textarea id="resultStringId" style="height:300px;width:400px;" ></textarea>
			</div>	  
		</div>
	</div> 
</body>
</html>