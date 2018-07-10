var egl = null; 
$(document).ready(function(){	
	var queryStrings = cmnPcr.getQueryStringArgs();
	var name = decodeURIComponent(queryStrings["name"]);
	var excelGridId = queryStrings["excelgrid"];
	var versionId = queryStrings["version"]; 

	$("#excelGridNameContainerId").text(name);
	
	egl = new ExcelGridDefinitionLayout();
	egl.loadFromServer({
		excelGridId: excelGridId,
		versionId:versionId,
		afterLoadFunc: function(){
			egl.show({
				currentCellInfoDivId: "currentCellInfoDivId",
				editExpressionButtonId: "editExpressionButtonId",
				cellOutEditorId: "cellOutEditorId",
				containerId: "excelGridlayoutContainerId",
				toolbarContainerId: "toolbarContainerId",
				titleContainerId: "excelGridTitleContainerId",
				subTitleContainerId: "excelGridSubTitleContainerId"
			});
			showTitle();
		}
	});
	
	$("#saveDefinitionBtnId").click(function(){
		egl.saveToServer({
			afterSaveFunc:function(){
				showTitle();
			}
		});
	});
	
	$("#activateDefinitionBtnId").click(function(){ 
		egl.activiteOnServer({
			afterActiviteFunc:function(){
				showTitle();
				msgBox.alert({info: "此版本已经启用"});
			}});
		return false;
	});
	
	$("#propertyBtnId").click(function(){
		msgBox.htmlWindow({
			title: "属性",
			label: "备注",
			text: egl.excelGridRowJson.description == null ? "" : egl.excelGridRowJson.description,
			type: "oneInputTextarea",
			okFunction: function(p){
				egl.excelGridRowJson.description = p.text;
				p.closeWin();
			}
		});
	});
});

function showTitle(){
	$("#" + egl.titleContainerId).text(egl.excelGridRowJson.definitionName);
	$("#" + egl.subTitleContainerId).text((egl.excelGridRowJson.enable == "Y" ? "已启用" : "未启用") + ", 创建时间: " + egl.excelGridRowJson.createTime);
}