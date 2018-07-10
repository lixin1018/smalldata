<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>导入导出定义编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">  
	<script type="text/javascript" src="../js/importExport.js"></script>
	<script type="text/javascript"> 
		var iel = null; 
		$(document).ready(function(){ 
			
			var queryStrings = cmnPcr.getQueryStringArgs();
			var name = decodeURIComponent(queryStrings["name"]);
			var code = decodeURIComponent(queryStrings["code"]);
			var definitionId = queryStrings["definition"];
			var versionId = queryStrings["version"]; 

			$("#importExportNameId").text(name); 
			$("#importExportVersionId").text("(version:" + versionId + ")");
			
			iel = new ImportExportLayout();
			iel.loadFromServer({
				definitionId: definitionId,
				versionId:versionId,
				afterLoadFunc: function(){
					iel.show({
						nameInputControlId: "nameInputControlId",
						codeInputControlId: "codeInputControlId",
						definitionXmlInputControlId: "definitionXmlInputControlId"
					});
				}
			});
			
			$("#saveBtnId").click(function(){
				iel.saveToServer({
					afterSaveFunc:function(){}
				});
			});
			
			$("#validateBtnId").click(function(){
				iel.validateOnServer({
					afterValidateFunc:function(){}
				});
			});
		});
		
	</script> 
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id="testGridContainer">
	<div id="toolbarContainerId" data-options="region:'north',border:false" style="height:28px;overflow:hidden;">	 
		<div class="gridToolbar">  
			<a id="saveBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">保存</a>
			<a id="validateBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true,iconCls:'icon-save'">验证</a>
			<span id="importExportNameId" style="padding-left:5px;height:27px;line-height:27px;font-size:15px;font-weight:600;"></span>
			<span id="importExportVersionId" style="height:27px;font-size:11px;font-weight:400;"></span>
		</div> 
	</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   	
		 <div style="position:absolute;left:10px;right:10px;top:0px;height:30px;">
		 	<span style="position:absolute;left:0px;top:0px;bottom:0px;width:45px;height:100%;text-align:right;">名称:</span>
		 	<span style="position:absolute;left:50px;top:0px;bottom:0px;width:250px;height:100%"><input type="text" id="nameInputControlId" style="width:250px;" /></span>
		 	<span style="position:absolute;left:300px;top:0px;bottom:0px;width:45px;height:100%;text-align:right;">编码:</span>
		 	<span style="position:absolute;left:350px;top:0px;bottom:0px;width:250px;height:100%"><input type="text" id="codeInputControlId" style="width:250px;" /></span>
		 </div>	
		 <div style="position:absolute;left:10px;right:10px;top:31px;bottom:10px;">
		 	<span style="position:absolute;left:0px;top:0px;bottom:0px;width:45px;height:100%;text-align:right;">内容:</span>
		 	<span style="position:absolute;left:50px;right:0px;top:0px;bottom:0px;">
		 		<textarea id="definitionXmlInputControlId" style="width:100%;height:100%"></textarea>
	 		</span>
		 </div>
	</div>
</body>	 
</html>