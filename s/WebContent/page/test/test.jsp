<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>测试列表编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<!-- 这里替换成您的模型名称 -->
	<script type="text/javascript" src="${dataModel}/sys_Data.js"></script>
	
	<!-- 这里替换成您的模型名称 -->
	<script type="text/javascript" src="${viewModel}/sys_Data.js"></script> 
		
	<!-- 这里替换成您的模型名称 -->
	<script type="text/javascript" src="${paramWinModel}/ltygQueryData.js"></script>
	
	<script> 
	
		var paramWin = null;
		var gridWin = null;
		$(document).ready(function(){			
				 
			//初始化参数录入框
			paramWin = new NcpParamWin({
				containerId:"testParamWinContainer",
				paramWinModel:paramWinModels.ltygQueryData
			}); 
			paramWin.show();
			
			//初始化grid
			var p = { 
				containerId:"testGridContainer",   
				multiselect:true,  
				
				//这里替换成您的模型名称
				dataModel:dataModels.sys_Data,
				onePageRowCount:20,
				isRefreshAfterSave:true,
				
				//这里替换成您的模型名称
				viewModel:viewModels.sys_Data 
			};
			gridWin = new NcpGrid(p); 
			gridWin.show();
			
			//设置tab选项卡事件
			setQueryTabEvent();
			
			//设置查询按钮事件
			$("#queryButton").click(function(){
				queryData();
			});
	});
	</script>
	<style type="text/css">
		.queryTab{
			font-size:13px;
			color:#000000;
			padding-left:5px;
			padding-right:5px;
			cursor:pointer;
			font-weight:400;
		}
		.queryTabCurrent{
			color:#009DD9;
			font-weight:800;
		}
	</style>
	<script>
	
		function setQueryTabEvent(){
			$(".queryTab").click(function(){
				var thisModuleName = $(this).attr("moduleName");
				var allQueryTabs = $(".queryTab");
				for(var i=0;i<allQueryTabs.length;i++){ 
					var queryTab = allQueryTabs[i];
					var moduleName = $(queryTab).attr("moduleName");
					if(thisModuleName == moduleName){
						$(queryTab).addClass("queryTabCurrent");
					}
					else{
						$(queryTab).removeClass("queryTabCurrent");
					}
				}
				queryData();
			}); 
		}
		
		function queryData(){
			var queryModuleName = $(".queryTabCurrent").attr("moduleName");			
			var result = paramWin.getParamResult();			
			if(result.verified){
				gridWin.sysWhere = new Array(); 
				var queryIsUsing = null;
				if(result.values.name.length != 0 ){
					gridWin.sysWhere.push({parttype:"field", field:"name", operator:"like", value: "%"+result.values.name+"%" });
				}
				if(result.values.isUsing != null ){
					gridWin.sysWhere.push({parttype:"field", field:"isusing", operator:"=", value: result.values.isUsing });
				}
				if(queryModuleName.length != 0){
					gridWin.sysWhere.push({parttype:"field", field:"sysmodule", operator:"=", value: queryModuleName });
				}
				gridWin.doPage({ pageNumber:1});
			}			
		}	
		
	</script>
</head>
<body class="easyui-layout" style="width:100%;height:100%;" id = "testGridContainer"> 
	<div class="ncpGridToolbarContainer" data-options="region:'north',border:false" style="height:85px;">
		<div style="width:100%;height:30px;padding-top:5px;">
			<span style="font-size:25px;font-weight:700;padding-left:10px;padding-right:10px;">订单</span>
			<span class="queryTab queryTabCurrent" moduleName="">所有模块</span>
			<span class="queryTab" moduleName="系统配置">系统配置模块</span>
			<span class="queryTab" moduleName="系统开发">系统开发模块</span>
			<span class="queryTab" moduleName="传染病">传染病模块</span>
		</div>	 
		<div style="width:100%;height:2px;background-color:#DDDDDD;margin:5px;">
		</div>	 
		<div id="testParamWinContainer"  style="width:100%;height:25px;">
			<table cellspacing="0" cellpadding="0" style="width:100%;height:25px;">
				<tr>
					<td style="width:50px;">名称:</td>
					<td style="width:160px;"><input type="text" name="name" style="width:150px;" paramCtrl="true"/></td>
					<td style="width:20px;"><input type="checkbox" type="text" name="isUsing" style="width:20px;" paramCtrl="true"/></td>
					<td style="width:40px;">已启用</td>
					<td style="width:20px;">&nbsp;</td>
					<td style="width:100px;"><input type="button" id="queryButton" value="查询" style="width:80px;height:25px;"/></td>
					<td><span name="paginationCtrl" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span></td>
				</tr>
			</table> 			
		</div>	  
	</div>
	<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false" >   
		<table name="gridCtrl" ></table> 
	</div>
</body>	 
</html>