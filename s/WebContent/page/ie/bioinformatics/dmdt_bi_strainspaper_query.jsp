<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/dmdt_bi_strainspaper.js"></script>
	<script type="text/javascript" src="${viewModel}/dmdt_bi_strainspaper.js"></script>
	
	<script> 
		var parentGrid = null;
	
		//获取操作按钮单元格内容html
		function getLinkHtml(rowId){
			var row = parentGrid.datatable.rows(rowId); 
			var nameValue = row.getValue("name");
			var timeMark = (new Date()).getMilliseconds();
			var html = "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return showDetail('" + rowId + "')\">查看明细</a>&nbsp;"
			+ "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return importDetail('" + rowId + "')\">导入明细</a>&nbsp;"
			+ "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return convertToTxt('" + rowId + "')\">生成文本</a>&nbsp;"
			+ "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return splitTxtFile('" + rowId + "')\">切分文本</a>&nbsp;";
			return html;
		}
		
		//操作按钮列ID
		function getCellContainerId(rowId){
			return "editDetailColumn_" + rowId;
		}

		//查看明细
		function showDetail(rowId){			
			var row = parentGrid.datatable.rows(rowId); 
			var idValue = row.getValue(parentGrid.dataModel.idFieldName);

			if(parentGrid.currentStatus != formStatusType.browse){
				msgBox.alert({info:"请先保存当前编辑的数据."});
			}
			else{
				if(idValue == null){
					msgBox.alert({info:"请先选定行."});
				}
				else{
					var detailPageUrl = "dmdt_bi_strainspaper_line.jsp";
					
					var initParam =  {
							parentIdValue : idValue,
							closeWin : function(p){ 
								popContainer.close();
						}
					}
					window.detailInitParam = initParam; 
	
					var popContainer = new PopupContainer({width:1000,
						height:500,
						top:50});
					popContainer.show(); 
					var frameId = cmnPcr.getRandomValue();
					var iFrameHtml = "<iframe id=\"" + frameId + "\" frameborder=\"0\" style=\"width:100%;height:100%;border:0px;\"></iframe>";
					$("#" + popContainer.containerId).html(iFrameHtml);
					$("#" + frameId).attr("src", detailPageUrl);
				}
			}
			return false;
		}
		
		//导入明细
		function importDetail(rowId){
			if(msgBox.confirm({info:"确定导入数据吗？"})){
				var row = parentGrid.datatable.rows(rowId); 
				var idValue = row.getValue(parentGrid.dataModel.idFieldName);
				parentGrid.doOtherAction({
					actionName:"readExcelAndSaveToDb",
					customParam:{idValue: idValue},
					successFunc: function(obj){
						alert(cmnPcr.jsonToStr(obj));
						parentGrid.doPage({pageNumber : parentGrid.pageNumber});
					},
					failFunc:function(obj){
						alert(cmnPcr.jsonToStr(obj)); 
					}
				});
			}
			return false;
		}
		
		//切分文本
		function splitTxtFile(rowId){
			if(msgBox.confirm({info:"确定切分文本吗？"})){
				var row = parentGrid.datatable.rows(rowId); 
				var idValue = row.getValue(parentGrid.dataModel.idFieldName);
				parentGrid.doOtherAction({
					actionName:"splitTxtFile",
					customParam:{idValue: idValue},
					timeout : 1000 * 60 * 10,//此处以后改成异步
					successFunc: function(obj){
						alert(cmnPcr.jsonToStr(obj));
						parentGrid.doPage({pageNumber : parentGrid.pageNumber});
					},
					failFunc:function(obj){
						alert(cmnPcr.jsonToStr(obj)); 
					}
				});
			}
			return false;
		}
		
		//生成文本
		function convertToTxt(rowId){
			if(msgBox.confirm({info:"确定生成文本吗？"})){
				var row = parentGrid.datatable.rows(rowId); 
				var idValue = row.getValue(parentGrid.dataModel.idFieldName);
				parentGrid.doOtherAction({
					actionName : "convertToTxtFile",
					customParam : {idValue: idValue},
					timeout : 1000 * 60 * 10,//此处以后改成异步
					successFunc : function(obj){
						alert(cmnPcr.jsonToStr(obj));
						parentGrid.doPage({pageNumber : parentGrid.pageNumber});
					},
					failFunc : function(obj){
						alert(cmnPcr.jsonToStr(obj)); 
					}
				});
			}
			return false;
		} 
		
		//导入表头记录
		function importList(){
			var p = {
					title:"输入框",
					label:"请输入列表文件的绝对地址",
					type:"oneInputText",
					okFunction:function(result){
						parentGrid.doOtherAction({
							actionName:"importSpeciesList",
							customParam:{filePath:encodeURIComponent(result.text)},
							successFunc: function(obj){
								alert(cmnPcr.jsonToStr(obj));
								result.closeWin();
								parentGrid.doPage({pageNumber : parentGrid.pageNumber});
							},
							failFunc:function(obj){
								alert(cmnPcr.jsonToStr(obj));
							}
						}); 
					}
			}			
			msgBox.htmlWindow(p);			
		}
		
		//批量执行
		function batchRun(){ 
			var rowId = parentGrid.datatable.getFirstRowId();
			parentGrid.focusCell(rowId, "featuremachine");   
			/*
			var allRowIds = parentGrid.getSelectedRowIds();
			var selectedRowCount = allRowIds.length;
			if(selectedRowCount == 0){
				msgBox.alert({info:"请选择记录."});
			}
			else{
				var allIdValues = new Array();
				for(var i=0;i<selectedRowCount;i++){
					var rowId = allRowIds[i];
					var row = parentGrid.datatable.rows(rowId); 
					var idValue = row.getValue(parentGrid.dataModel.idFieldName);
					allIdValues.push(idValue);
				}
			}
			*/
		}
		
		$(document).ready(function(){ 

			//从模型中增加操作按钮列
			viewModels.dmdt_bi_strainspaper.colModel.push({name:"editGridColumn",
				label:"执行",
				width:230,
				hidden:false,
				sortable:false, 
				search:false,
				resizable:true,
				editable:false,
				canEdit:false,
				nullable:true,
				formatter:function(cellvalue, options, rowObject){
					var html = getLinkHtml(options.rowId);
					var containerId = getCellContainerId(options.rowId);
					return "<div id=\"" + containerId + "\" style=\"width:100%;height:100%;\">" + html + "</div>";
				}
			});
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				dataModel:dataModels.dmdt_bi_strainspaper,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				viewModel:viewModels.dmdt_bi_strainspaper 	
			};
			parentGrid = new NcpGrid(p); 
			parentGrid.show();
			

			$("#importBtnId").click(function(){  
				importList();
			}); 
			$("#runBtnId").click(function(){  
				batchRun();
			}); 
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
			<a name="importBtn" id="importBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-import'">导入菌列表</a> 
			<a name="runBtn" id="runBtnId" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-run'">批量执行</a> 
		</span>
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar" style="float:right;"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>