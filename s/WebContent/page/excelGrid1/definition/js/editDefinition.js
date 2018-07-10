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
				containerId: "excelGridlayoutContainerId",
				toolbarContainerId: "toolbarContainerId",
				titleContainerId: "excelGridNameContainerId",
				subTitleContainerId: "excelGridCreateTimeContainerId"
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
	$("#" + egl.titleContainerId).text(egl.excelGridRowJson.name);
	$("#" + egl.subTitleContainerId).text(" (创建时间: " + egl.excelGridRowJson.createTime + ")");
}