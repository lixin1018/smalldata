<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>数据导入定义</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="../js/importExport.js"></script>
	
	<script type="text/javascript" src="${dataModel}/dm_ImportExportDefinition.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportDefinition.js"></script>
	<script type="text/javascript" src="${dataModel}/dm_ImportExportVersion.js"></script>
	<script type="text/javascript" src="${viewModel}/dm_ImportExportVersion.js"></script>
	<script type="text/javascript" src="${sheetModel}/importExportDefinition.js"></script>
	
	<script> 
		var sheetWin = null; 
		$(document).ready(function(){ 	
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			
			$("#createVersionBtnId").click(function(){
				var definitionRow = getCurrentImportExportRow();
				if(definitionRow != null){
					var definitionId = definitionRow.getValue("id");
					var definitionName = definitionRow.getValue("name");
					var importExportObj = new ImportExport();
					importExportObj.create({
						versionId: null,
						name:definitionName
					});
					
					var requestParam = {
						definitionId: definitionId,
						versionXml: importExportObj.toXml(),
						name: definitionName
					};				
					
			 		serverAccess.request({
						serviceName:"importExportNcpService", 
						funcName:"createVersion", 
						args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
						successFunc:function(obj){
							afterCreateVersion(obj.result);
						},
						failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
					});
				}
			});
			$("#deleteVersionBtnId").click(function(){
				var definitionId = getCurrentImportExportId();
				if(definitionId != null){					
					var selectedVersions = getSelectedImportExportVersions();
					if(selectedVersions.length == 0){
						msgBox.alert({info: "请选择版本!"});
					}
					else{				
						if(msgBox.confirm({info:"确定要删除吗?"})){
							var requestParam = {
								versions: selectedVersions
							};
							
					 		serverAccess.request({
								serviceName:"importExportNcpService", 
								funcName:"deleteVersion", 
								args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
								successFunc:function(obj){
									afterDeleteVersion(selectedVersions);
								},
								failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
							});
						}
					} 
				}
			});
			$("#editVersionBtnId").click(function(){
				var importExportRow = getCurrentImportExportRow();
				if(importExportRow != null){			
					var definitionId = importExportRow.getValue("id"); 
					var versionRow = getCurrentVersionRow();
					if(versionRow == null){
						msgBox.alert({info: "请选择版本!"});
					}
					else{		 
						var versionId = versionRow.getValue("id");
						var versionName = versionRow.getValue("name");
						var versionCode = versionRow.getValue("code");
						showIEDefinitionEditor({
							contentDivId: "testSheetContainer", 
							versionName: versionName, 
							versionId: versionId,
							definitionId: definitionId});
						//window.open("../definition/editDefinition.jsp?name=" + encodeURIComponent(versionName) + "&code=" + encodeURIComponent(versionCode) + "&definition=" + definitionId + "&version=" + versionId, versionId);
					}
				}
			});
			$("#activateVersionBtnId").click(function(){
				var definitionId = getCurrentImportExportId();
				if(definitionId != null){					 
					var versionRow = getCurrentVersionRow();

					if(versionRow == null){
						msgBox.alert({info: "请选择版本!"});
					}
					else{		 
						var versionId = versionRow.getValue("id");
						var isActive = !versionRow.getValue("isactive");
						if(msgBox.confirm({info:"确定要" + ( isActive ? "启用" : "停用" ) + "吗?"})){
							var requestParam = {
								definitionId: definitionId,
								versionId: versionId,
								isActive: isActive
							};				
							
					 		serverAccess.request({
								serviceName:"importExportNcpService", 
								funcName:"activateVersion",
								args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
								successFunc:function(obj){
									afterActivateVersion(versionRow.rowId);
									
									if(obj.result.validateResult == null){
										msgBox.alert({info: "停用成功!"}); 
									}
									else{
										var error = obj.result.validateResult.error;
										var alert = obj.result.validateResult.alert;
										if(error.length != 0){
											//验证未通过
											var msg = "启用失败!\r\n错误信息:\r\n" + decodeURIComponent(error) + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
											msgBox.alert({info: msg});
										}
										else{
											//验证通过
											var msg = "启用成功!" + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
											msgBox.alert({info: msg}); 
										} 
									}
								},
								failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
							}); 
						} 
					}
				}
			});
			$("#copyVersionBtnId").click(function(){
				var definitionId = getCurrentImportExportId();
				if(definitionId != null){				
					var versionRow = getCurrentVersionRow();
					if(versionRow == null){
						msgBox.alert({info: "请选择版本!"});
					}
					else{		
						var versionId = versionRow.getValue("id");
						var name = versionRow.getValue("name");
						var code = versionRow.getValue("code"); 
						var requestParam = {
							definitionId: definitionId,
							versionId: versionId,
							name: name,
							code: code
						};				
						
				 		serverAccess.request({
							serviceName:"importExportNcpService", 
							funcName:"copyVersion",
							args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
							successFunc:function(obj){
								afterCreateVersion(obj.result);
							},
							failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
						}); 
					} 
				}
			}); 
		});   
		
		function afterCreateVersion(resultObj){ 
			var versionGridCtrl = sheetWin.sheetCtrl.getPartCardCtrl("detail");
			var resultRow = resultObj.versionJson;
			var rowId = resultRow.id;
			var newRow = new DataRow();
			newRow.setValue("createtime", cmnPcr.strToObject(resultRow.createTime, valueType.time));
			newRow.setValue("createuserid", resultRow.createUserId);
			newRow.setValue("createusername", resultRow.createUserName);
			newRow.setValue("name", resultRow.name);
			newRow.setValue("code", resultRow.code);
			newRow.setValue("definitionid", resultRow.definitionId);
			newRow.setValue("isactive", false);
			newRow.setValue("filepath", resultRow.filePath);
			newRow.setValue("id", resultRow.id);
			newRow.setValue("modifytime", null);
			newRow.setValue("modifyuserid", null);
			newRow.setValue("modifyusername", null);
			versionGridCtrl.datatable.addRow(rowId, newRow);
			$(versionGridCtrl.gridCtrl).jqGrid("addRowData", rowId, newRow.allCells());
			versionGridCtrl.initRowSelectContrl(rowId);
			versionGridCtrl.selectRowInGrid(rowId);
			  
			//window.open("../definition/editDefinition.jsp?name=" + encodeURIComponent(versionName) + "&version=" + versionId + "&definition=" + definitionId, versionId);
			showIEDefinitionEditor({
				contentDivId: "testSheetContainer", 
				versionName: resultRow.name, 
				versionId: resultRow.id,
				definitionId: resultRow.definitionId}); 
		}
		

		function afterActivateVersion(versionRowId){
			var versionGridCtrl = sheetWin.sheetCtrl.getPartCardCtrl("detail"); 
			var versionRow = versionGridCtrl.datatable.rows(versionRowId);
			var oldEnable = versionRow.getValue("isactive");
			versionRow.setValue("isactive", !oldEnable); 
			$(versionGridCtrl.gridCtrl).jqGrid("setRowData", versionRowId, versionRow.allCells());
		}
		
		
		function afterDeleteVersion(selectedVersions){
			var versionGridCtrl = sheetWin.sheetCtrl.getPartCardCtrl("detail"); 
			for ( var i = 0; i < selectedVersions.length; i++) {
				var rowId = selectedVersions[i].rowId;
				$(versionGridCtrl.gridCtrl).jqGrid("delRowData", rowId);
				versionGridCtrl.datatable.remove(rowId); 
			}
		}
		function getCurrentImportExportId(){
			var mainCardCtrl = sheetWin.sheetCtrl.getMainCardCtrl();
			if(mainCardCtrl.currentStatus == formStatusType.browse){
				var excelGridId = mainCardCtrl.getCurrentIdValue();
				return excelGridId;
			}
			else{
				msgBox.alert({info: "请先保存当前定义."});
				return null;
			}
		}
		function getCurrentImportExportRow(){
			var mainCardCtrl = sheetWin.sheetCtrl.getMainCardCtrl();
			if(mainCardCtrl.currentStatus == formStatusType.browse){
				var excelGridRow = mainCardCtrl.datatable.getRowByIndex(0); 
				return excelGridRow;
			}
			else{
				msgBox.alert({info: "请先保存当前定义."});
				return null;
			}
		}
		function getSelectedImportExportVersions(){
			var versionGridCtrl = sheetWin.sheetCtrl.getPartCardCtrl("detail");
			var selectedVersionIdJsons = new Array();
			var rowIds = versionGridCtrl.getSelectedRowIds();
			for(var i = 0; i < rowIds.length; i++){
				var rowId = rowIds[i];
				var versionId = versionGridCtrl.datatable.rows(rowId).getValue("id");
				selectedVersionIdJsons.push({
					rowId: rowId, 
					versionId: versionId
				});
			}
			
			return selectedVersionIdJsons;
		}
		function getCurrentVersionRow(){
			var versionGridCtrl = sheetWin.sheetCtrl.getPartCardCtrl("detail"); 
			var selRowId = $(versionGridCtrl.gridCtrl).jqGrid("getGridParam", "selrow");
			var row = versionGridCtrl.datatable.rows(selRowId);
			return row;
		}
		 
		function showIEDefinitionEditor(p){ 
			var versionName = p.versionName;
			var versionId = p.versionId;
			var definitionId = p.definitionId;
			var popContainerWidth = $("#" + p.contentDivId).width() - 50;
			var popContainerHeight = $("#" + p.contentDivId).height() - 100;
			var popContainer = new PopupContainer({ 
				width : popContainerWidth,
				height : popContainerHeight,
				top : 25
			}); 
			
			var frameId = cmnPcr.getRandomValue();
			var titleId = frameId + "_title";
			var closeBtnId = frameId + "_close";
			var innerHtml = "<div style=\"width:100%;height:30px;font-size:15px;text-align:center;font-weight:800;position:relative;\">"
			 	+ "<div id=\"" + titleId + "\" style=\"left:0px;top:3px;witdh:" + (popContainerWidth - 30) + "px;height:25px;font-size:13px;padding-left:10px;position:absolute;\"></div>"
			 	+ "<div id=\"" + closeBtnId + "\" style=\"right:3px;top:3px;witdh:25px;height:25px;font-size:13px;padding-left:10px;cursor:pointer;position:absolute;\">×</div></div>"
			 	+ "<div style=\"witdh:100%;height:" + (popContainerHeight - 40) + "px;font-size:11px;text-align:center;\">"
			 	+ "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>"
			 	+ "</div>";
			 
			window.importExportVersionId = versionId;
			
			popContainer.show(); 
			$("#" + popContainer.containerId).html(innerHtml); 
			$("#" + titleId).text("编辑"); 

			var editPageUrl = "../definition/dm_ImportExportVersion_Sheet.jsp";// "../definition/editDefinition.jsp?name=" + encodeURIComponent(versionName) + "&version=" + versionId + "&definition=" + definitionId;
			$("#" + frameId).attr("src", editPageUrl);
		
			$("#" + closeBtnId).click(function(){
				popContainer.close();
			});
		}
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testSheetContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a> 
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>  
		</span>
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false">
				<table>
					<tr style="height:22px;">
						<td style="width:75px;height:22px;text-align:right;">编码</td>
						<td style="width:250px;height:22px;"><input type="text" name="code" class="easyui-validatebox" style="width:230px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:75px;height:22px;text-align:right;">名称</td>
						<td style="width:250px;height:22px;"><input type="text" name="name" class="easyui-validatebox" style="width:230px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:75px;height:22px;text-align:right;">数据表名</td>
						<td style="width:250px;height:22px;"><input type="text" name="dbtablename" class="easyui-validatebox" style="width:230px;height:22px;" cardCtrl="true"></input></td>
					</tr>
					<tr style="height:22px;">
						<td style="width:75px;height:22px;text-align:right;">单价</td>
						<td style="width:250px;height:22px;"><input type="text" name="unitprice" style="width:230px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:75px;height:22px;text-align:right;">创建人</td>
						<td style="width:250px;height:22px;"><input type="text" name="createusername" style="width:230px;height:22px;" cardCtrl="true"></input></td> 
						<td style="width:75px;height:22px;text-align:right;">创建时间</td>
						<td style="width:250px;height:22px;"><input type="text" name="createtime" style="width:230px;height:22px;" cardCtrl="true"></input></td> 
					</tr>
					<tr style="height:22px;">	
						<td style="width:80px;text-align:right;">描述</td>
						<td style="width:550px;height:22px;" colspan="3"><textarea  name="description" style="width:550px;height:22px;" cardCtrl="true"></textarea></td>
						<td style="width:80px;text-align:right;">自动更新模型</td>
						<td style="width:150px;height:22px;"><input type="checkbox" name="autoupdatemodel" style="width:150px;height:22px;" cardCtrl="true"></input></td> 
					</tr>   
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="显示区域" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="detail" data-options="fit:true" id="testCardContainer2">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a id="createVersionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true">新建</a>
									<a id="editVersionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true">编辑</a> 
									<a id="copyVersionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true">复制</a> 
									<a id="activateVersionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true">启用/停用</a> 
									<a id="deleteVersionBtnId" href="#" class="easyui-linkbutton" data-options="plain:true">删除</a>
								</span>
							</div>
							<div data-options="region:'center',border:false" name="gridDiv" class="ncpGridDiv">   
								<table name="gridCtrl" ></table>  
							</div>
						</div>   
					</div>			
				</div>  
			</div> 
		</div>
	</div>
</body>	 
</html>