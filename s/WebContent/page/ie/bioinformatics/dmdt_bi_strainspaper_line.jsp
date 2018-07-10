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
	
	<script type="text/javascript" src="${dataModel}/dmdt_bi_strainspaper_line.js"></script>
	<script type="text/javascript" src="${viewModel}/dmdt_bi_strainspaper_line.js"></script>
	
	<script> 
		var detailGrid = null;

		//获取操作按钮单元格内容html
		function getLinkHtml(rowId){
			var row = detailGrid.datatable.rows(rowId); 
			var nameValue = row.getValue("name");
			var timeMark = (new Date()).getMilliseconds();
			var html = "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return showSourceFile('" + rowId + "')\">查看原文</a>&nbsp;"
			+ "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return showTextFile('" + rowId + "')\">查看文本</a>&nbsp;"
			+ "&nbsp;<a href=\"#\" target=\"blank\" style=\"line-height:24px;width:100%;\" onclick=\"return showSentance('" + rowId + "')\">查看句子</a>&nbsp;";
			return html;
		}
		
		//操作按钮列ID
		function getCellContainerId(rowId){
			return "editDetailColumn_" + rowId;
		}

		//查看句子
		function showSentance(rowId){			
			var row = detailGrid.datatable.rows(rowId); 
			var idValue = row.getValue(detailGrid.dataModel.idFieldName);

			if(detailGrid.currentStatus != formStatusType.browse){
				msgBox.alert({info:"请先保存当前编辑的数据."});
			}
			else{
				if(idValue == null){
					msgBox.alert({info:"请先选定行."});
				}
				else{
					var detailPageUrl = "dmdt_bi_strainspaper_sentance.jsp";
					
					var initParam =  {
							parentIdValue : idValue,
							closeWin : function(p){ 
								popContainer.close();
						}
					}
					window.detailInitParam = initParam; 
	
					var popContainer = new PopupContainer({width:800,
						height:400,
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
		
		$(document).ready(function(){ 
			var initParam = window.parent.detailInitParam; 
			
			//从模型中增加操作按钮列
			viewModels.dmdt_bi_strainspaper_line.colModel.push({name:"editGridColumn",
				label:"操作",
				width:160,
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
				dataModel:dataModels.dmdt_bi_strainspaper_line,
				onePageRowCount:20,
				isRefreshAfterSave:false,
				viewModel:viewModels.dmdt_bi_strainspaper_line, 
				where:[{parttype:"field", field:"parentid", operator:"=", value:initParam.parentIdValue}]		
			};
			detailGrid = new NcpGrid(p); 
			detailGrid.show();
			
			var externalObject = {
					processAddData:function(param){
						for(var rowId in param.newRowsTable.allRows()){
							var row = param.newRowsTable.rows(rowId);			
							row.setValue("parentid",initParam.parentIdValue);		
						}
					}
				};
			detailGrid.addExternalObject(externalObject);
			
			$("#closeBtnId").click(function(){
				var canClose = true;
				if(detailGrid.currentStatus != formStatusType.browse){
					canClose = msgBox.confirm({info:"数据未保存，继续关闭吗?"});
				} 
				if(canClose){
					initParam.closeWin();
				}
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
		</span>
		<a name="closeBtn" id="closeBtnId" href="#" class="easyui-linkbutton" style="float:right;" data-options="plain:true" >关闭</a> 
		<span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 
		<span class="ncpGridSearchBar"><input name="searchCtrl" class="easyui-searchbox" style="width:110px;" data-options="prompt:'模糊查询'"></input></span>
		</div>   
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
		<table name="gridCtrl" ></table>  
	</div> 
</body>	 
</html>