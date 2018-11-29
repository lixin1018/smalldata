<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>Grid方式下编辑子表</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${basejs}/ncpMultiSelectControlInGrid.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild2.js"></script>
	<script type="text/javascript" src="${dataModel}/test_DocAChild3.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAParent.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild2.js"></script>
	<script type="text/javascript" src="${viewModel}/test_DocAChild3.js"></script>
	
	<script> 
		$(document).ready(function(){ 
			viewModels.test_DocAParent.colModel.push({
				name: "test_DocAChild3", 
				label: "子表3", 
				width: 300, 
				hidden: false, 
				sortable: false, 
				search: false, 
				resizable: true, 
				editable: true, 
				canEdit: true, 
				nullable: true, 
				edittype: "text", 
				dispunitType: "popMulti",
				formatter: multiSelectsFormater
			});
			/*
			viewModels.test_DocAParent.colModel.push({
				name: "test_DocAChild2", 
				label: "子表2", 
				width: 300, 
				hidden: false, 
				sortable: false, 
				search: false, 
				resizable: true, 
				editable: true, 
				canEdit: true, 
				nullable: true, 
				edittype: "text", 
				dispunitType: "popMulti",
				formatter: multiSelectsFormater
			});*/
			
			function multiSelectsFormater(cellvalue, options, rowObject){
				var rowId = options.rowId;
				var row = grid.datatable.rows(rowId);
				var values = row["test_DocAChild3"];
				var textFieldArray = new Array();
				if(values != null){
					for ( var i = 0; i < values.length; i++) {
						var oneRow = values[i];
						textFieldArray.push(oneRow["name"]);
					}
				}
				var textFieldStr = cmnPcr.arrayToString(textFieldArray, ",");
				return textFieldStr;
			}
		
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.test_DocAParent,
				onePageRowCount:20,
				isRefreshAfterSave:false,
				viewModel:viewModels.test_DocAParent 
			};
			var grid = new NcpGrid(p);
			
			var externalObject = {				
				beforeDoSave: function(param){
					var rowIds = new Array();
					if(param.insert.count()>0){ 
						//新建保存
						var row = param.insert.getRowByIndex(0);
						rowIds.push(row.rowId);
					}
					else{
						//编辑保存
						var row = param.update.getRowByIndex(0);
						rowIds.push(row.rowId);
					} 
				
					if(param.otherRequestParam == null){
						param.otherRequestParam = {};
					}  
					if(param.otherRequestParam.multiSelects == null){
						param.otherRequestParam["multiSelects"] = {};
					}
				
					var multiSelectsArray = new Array();
					param.otherRequestParam.multiSelects["test_DocAChild3"] = multiSelectsArray;
					for(var i = 0; i < rowIds.length; i++){
						var rowId = rowIds[i];
						var valuesArray = $("#" + rowId+"_" + "test_DocAChild3").popMultiDispunit("getValue");
						var saveValueArray = new Array();
						for(var j = 0; j < valuesArray.length; j++){
							saveValueArray.push(valuesArray[j]["name"]);
						}
						multiSelectsArray.push({
							rowId: rowId,
							values: saveValueArray
						});		
					}
					return true;
				},
				afterDoCancel: function(param){
					//加载原来的数据 
					return true;
				},
				processSaveData: function(param){					
					var multiSelectsArray = param.otherRequestParam.multiSelects["test_DocAChild3"];
					for(var i = 0; i < multiSelectsArray.length; i++){
						var rowId = multiSelectsArray[i].rowId;
						var values = $("#" + rowId+"_" + "test_DocAChild3").popMultiDispunit("getValue");
						grid.datatable.rows(rowId)["test_DocAChild3"] = values;
					}
				},
				processPageData: function(param){
					var otherResponseParam = param.otherResponseParam; 
					var multiSelectsArray = otherResponseParam.multiSelects["test_DocAChild3"];
					for(var i = 0; i < multiSelectsArray.length; i++){
						var idValue = multiSelectsArray[i].idValue;
						var values = multiSelectsArray[i].values;
						var row = param.datatable.getRowByIdField(idValue, "id");
						row["test_DocAChild3"] = values;
					} 
				},
				refreshOterhEditCtrlStatus: function(param){
					that.setReadonly({
						isReadonly: param.isReadonly
					});
				}
			}
			
			grid.addExternalObject(externalObject); 
			
			grid.show();
	
			grid.setCustomDispunitEditValue = function(ctrl, cModel, fieldModel, row){
				var values = row["test_DocAChild3"];
				$(ctrl).popMultiDispunit("setValue", values);
			}
			
			grid.createCustomDispunit = function(name, dispunitType, ctrl, fieldModel, options, style) {
				var rowId = options.rowId;
				var row = grid.datatable.rows(rowId);
				var values = row["test_DocAChild3"];
				var fieldModel = dataModels.test_DocAChild3.fields["name"];		
				options.fieldName = "name";
				options.changeFunc = function(ctrl, rowData, rowId){
					
				}
				return $(ctrl).popMultiDispunit({
					idField : null,
					textField : "name",
					options : options,
					showPopFunc : function(p) {
						var fieldModel =  dataModels.test_DocAChild3.fields[p.options.fieldName];
						grid.doPop({
							viewName : fieldModel.view.name,
							value : p.value,
							rowId : p.options.rowId,//card方式下此属性无用，grid方式下有用，用来确定是哪一行的
							keyFieldName: null,
							fieldName : fieldModel.name,
							fieldModel : fieldModel,
							dataModel : dataModels.test_DocAChild3,
							isMultiValue : true,
							changeValueFunc : p.changeValueFunc
						});
					},
					style : style
				});
			}
		});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer">
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpGridToolbar">
			<a name="addBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-add'">新建</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a> 
			<a name="deleteBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-delete'">删除</a> 
		</span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>