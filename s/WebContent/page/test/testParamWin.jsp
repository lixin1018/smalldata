<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ include file="../basePage.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>用户</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">

		<script type="text/javascript" src="${dataModel}/d_User.js"></script>
		<script type="text/javascript" src="${viewModel}/d_User.js"></script>
		
		<!-- 查询条件对应的js，为系统自动生成 -->
		<script type="text/javascript" src="${paramWinModel}/testQuery.js"></script> 

		<script> 
			var gridWin = null; 
			var paramWin = null; 
			
			//查询数据
			function queryData(){ 		
				//获取录入的查询条件值
				var result = paramWin.getParamResult();	
				
				//如果必填项已经填写
				if(result.verified){
					
					//获取录入的两个参数值
					var sysWhere = new Array();  
					if(result.values.name.length != 0 ){
						sysWhere.push({parttype:"field", field:"name", operator:"like", value: "%"+result.values.name+"%" });
					}
					if(result.values.isusing != null ){
						sysWhere.push({parttype:"field", field:"isusing", operator:"=", value: result.values.isusing });
					} 
					
					//设置窗口的查询条件
					gridWin.sysWhere = sysWhere;
					
					//刷新数据表，显示第一页数据
					gridWin.doPage({ pageNumber:1});
				}			
			}	
			
			$(document).ready(function() {	   
				//初始化参数录入框
				paramWin = new NcpParamWin({
					containerId:"testQueryParamWinId",
					paramWinModel:paramWinModels.testQuery
				}); 
				paramWin.show(); 
				
				//构造grid窗口
				var p = {
					containerId : "testGridContainer",
					multiselect : true,
					dataModel : dataModels.d_User,
					onePageRowCount : 20,
					isRefreshAfterSave : true,
					colModel : viewModels.d_User.colModel,
					isShowData:false
				};				
				gridWin = new NcpGrid(p);
				gridWin.show();
				
				//绑定按钮
				$("#queryButtonId").click(function(){
					queryData();
				});
				
				//初始化后，按照默认查询条件显示数据
				queryData();
			});
		</script>
	</head>
	<body class="easyui-layout" style="width: 100%; height: 100%;"
		id="testGridContainer">
		<div class="ncpGridToolbarContainer"
			data-options="region:'north',border:false" style="height:60px;">
			
			<!-- 参数录入 区域-->			
			<span id="testQueryParamWinId" style="width:300px;height:25px;">
				<table cellspacing="0" cellpadding="0">
					<tr>
						<td style="width:50px;text-align:right;">姓名: </td>
						<td style="width:100px;"><input type="text" paramCtrl="true" name="name" style="width:100px;height:22px;"/></td>
						<td style="width:50px;text-align:right;">可用: </td>
						<td style="width:50px;"><input type="checkbox" paramCtrl="true" name="isusing" style="width:100px;height:22px;"/></td>
						<td style="width:50px;"><input type="button" id="queryButtonId" value="查询" /></td> 
					</tr>
				</table>
			</span>  
			
			<!-- 增删改等操作按钮 -->
			<span class="ncpGridToolbar"> <a name="addBtn" href="#"
				class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-add'">新建</a> <a
				name="editBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-edit'">编辑</a> <a
				name="saveBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a> <a
				name="cancelBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-cancel'">取消</a> <a
				name="deleteBtn" href="#" class="easyui-linkbutton"
				data-options="plain:true,iconCls:'icon-delete'">删除</a>  
			</span>
			
			<!-- 翻页导航按钮 -->
			<span name="paginationCtrl"
				class="easyui-pagination ncpGridPagination"
				data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>
		</div>
		
		<!-- 数据显示区域 -->
		<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">
			<table name="gridCtrl"></table>
		</div>
	</body>
</html>