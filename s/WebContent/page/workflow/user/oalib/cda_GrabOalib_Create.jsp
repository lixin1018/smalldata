﻿<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>抓取Oalib数据</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/cda_GrabOalib.js"></script>
	<script type="text/javascript" src="${viewModel}/cda_GrabOalib.js"></script>
	<script type="text/javascript" src="${dataModel}/cda_GrabOalibLine.js"></script>
	<script type="text/javascript" src="${viewModel}/cda_GrabOalibLine.js"></script>
	<script type="text/javascript" src="${sheetModel}/grabOalib.js"></script>
	
	<script> 
		var docWin = null;
		var linePartCtrl = null;
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			initParam.submitBtnId = "submitBtnId";
			initParam.showLogBtnId = "showLogBtnId";
			initParam.getBackBtnId = "getBackBtnId";
			initParam.showStatusDivId = "showStatusDivId"; 
			initParam.windowType = "create";
			initParam.sheetModel = sheetModels[initParam.sheetName];
			docWin = new NcpDocumentMultiStyleSheetWin(initParam); 
			docWin.show();	
			
			linePartCtrl = docWin.sheetCtrl.getPartCardCtrl("line");
			
			linePartCtrl.addExternalObject({
				processAddData : function(param){
					var allSelectedSpeciesRowIds = new Array();
					for (var rowId in param.species) {
						allSelectedSpeciesRowIds.push(rowId);
					}
					var speciesIndex = 0;
					for (var rowId in param.newRowsTable.allRows()) {
						var selectedSpeciesRowId = allSelectedSpeciesRowIds[speciesIndex];
						var speciesRow = param.species[selectedSpeciesRowId];
						var row = param.newRowsTable.rows(rowId);
						row.setValue("speciesid", speciesRow.id);
						row.setValue("species", speciesRow.speciesname);						
						speciesIndex++;
					}
				}
			});
			
			$("#selectSpeciesId").click(function(){
				selectSpecies();
			});
		});  
		
		function addChildRows(species){
	
			//去掉已经存在的
			for (var rowId in linePartCtrl.datatable.allRows()) {
				var speciesId = linePartCtrl.datatable.rows(rowId).getValue("speciesid");
 				var existSelectedSpeciesRowId = null;
				for (var selectedSpeciesRowId in species) {
					var speciesRow = species[selectedSpeciesRowId];
					if(speciesRow.id == speciesId){
						existSelectedSpeciesRowId = selectedSpeciesRowId;
						break;
					}
				} 
				if(existSelectedSpeciesRowId != null){
					delete species[existSelectedSpeciesRowId];
				}
			}
			
			if(species != null){
				var count = 0; 
				for (var k in species){
					count++;
				}
				if(count > 0){
					linePartCtrl.doAdd({
						newRowCount : count,
						species : species
					});
				}
			}
		}
		
		function selectSpecies(){ 
			//将单据变为编辑状态
			var mainCardCtrl = docWin.sheetCtrl.getMainCardCtrl();
			if(mainCardCtrl.currentStatus == formStatusType.browse){
				msgBox.alert({info:"请将单据置为编辑状态"});
			}
			else{
				showSelectSpeciesWindow();
			} 
		}
		
		function showSelectSpeciesWindow(){
			var popContainer = new PopupContainer( {
				width : 600,
				height : 500,
				top : 50
			});
			popContainer.show();
			var initParam = {
				closeWin : function(p) {
					popContainer.close();
					if(p.selectedRows != undefined){
						addChildRows(p.selectedRows);
					}
				}, 						 
				showField : "speciesname",
				isMultiValue : true
			}
			window.popInitParam = initParam;

			//var popNames = param.fieldModel.inputHelpName.split(".");
			var popPageUrl =basePath + "/page/cda/pop/selectWordInfoSpecies.jsp";

			var frameId = cmnPcr.getRandomValue();
			var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
			$("#" + popContainer.containerId).html(iFrameHtml);
			$("#" + frameId).attr("src", popPageUrl);
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
		<span style="width:500px;"> 
			<input type="button" id="showLogBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;"  value="查看流程" />
			<input type="button" id="getBackBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;"  value="取 回" />	
			<input type="button" id="submitBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;" value="提 交" /> 
			<span id="showStatusDivId" style="width:300px;float:right;margin-left:5px;margin-right:5px;text-align:right;height:25px;line-height:25px;cursor:pointer;text-decoration:underline;"></span>
		</span>	
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false">  
		<div class="easyui-layout" data-options="fit:true" >
			<div data-options="region:'north',border:false" style="overflow:hidden;">
				<table>
					<tr style="height:25px;">
						<td style="width:50px;height:22px;text-align:right;">编码</td>
						<td style="width:200px;height:22px;"><input type="text" name="code" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">名称</td>
						<td style="width:200px;height:22px;"><input type="text" name="name" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td>&nbsp;</td>
						<td style="width:50px;height:22px;"><input type="button" id="selectSpeciesId" style="width:100px;" value="选择菌..."/></td>
					</tr> 
					<tr style="height:25px;">
						<td style="width:50px;height:22px;text-align:right;">创建时间</td>
						<td style="width:200px;height:22px;"><input type="text" name="createtime" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">创建人</td>
						<td style="width:200px;height:22px;"><input type="text" name="createusername" style="width:200px;height:22px;" cardCtrl="true"></input></td>
						<td style="width:50px;height:22px;text-align:right;">描述</td>
						<td style="width:400px;height:22px;"><input type="text" name="description" style="width:400px;height:22px;" cardCtrl="true"></input></td>
					</tr> 
					<tr style="height:50px;">
						<td style="text-align:right;">Cookie</td>
						<td colspan="5"><textarea name="cookie" style="width:950px;height:50px;" cardCtrl="true"></textarea></td> 
					</tr>
				</table>
			</div>
			<div data-options="region:'center',border:false" class="ncpInnerContainer">
				<div class="easyui-tabs" data-options="fit:true,plain:true">
					<div title="明细" class="ncpCardTab">   
						<div class="easyui-layout" sheetPart="line" data-options="fit:true" id="testCardContainer2">
							<div data-options="region:'north',border:false" class="ncpGridToolbarContainer">	 
								<span class="ncpGridToolbar">
									<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'"></a>
									<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'"></a> 
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