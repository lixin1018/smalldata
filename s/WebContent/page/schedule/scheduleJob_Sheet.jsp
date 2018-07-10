<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>定时任务</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/skd_Job.js"></script>
	<script type="text/javascript" src="${viewModel}/skd_Job.js"></script>
	<script type="text/javascript" src="${sheetModel}/scheduleJob.js"></script>
	
	<script> 
		$(document).ready(function(){ 	
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testSheetContainer";
			var sheetWin = new NcpMultiStyleSheetWin(initParam); 
			sheetWin.show();	
			var sheetCtrl = sheetWin.sheetCtrl; 
			
			var cardCtrl = sheetCtrl.getMainCardCtrl();
			cardCtrl.addExternalObject({
				beforeDoPop:function(param){
					if(param.fieldName == "runexp") {
						if(param.value == null) {
							//如果是在dispunit内手动修改的值，那么param.value不为空
							//如果param.value的值为空，那么从显示域中获取值
							param.value =  cardCtrl.doCtrlMethod(param.fieldName, "getValue").expression;
						}
						param.otherValues = {
							currentNeedResultType : null,
							currentRunAt : expRunAt.server,
							currentParameters: [{
									name: "jobInstanceId",
									valueType: valueType.string,
									valueTypeDes: "字符串",
									description: "任务实例ID"
								}]
						} 
					}
					return true;
				}
			});
			
		});  
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
		<table>
			<tr style="height:25px;">
				<td style="width:60px;height:22px;text-align:right;">编码</td>
				<td style="width:150px;height:22px;"><input type="text" name="code" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:50px;height:22px;text-align:right;">名称</td>
				<td style="width:150px;height:22px;"><input type="text" name="name" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:60px;height:22px;text-align:right;">任务类型</td>
				<td style="width:150px;height:22px;"><input type="text" name="jobtype" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:60px;height:22px;text-align:right;">已启用</td>
				<td style="width:150px;height:22px;"><input type="checkbox" name="isactive" style="width:150px;height:22px;" cardCtrl="true"></input></td>
			</tr> 
			<tr style="height:25px;">
				<td style="width:60px;height:22px;text-align:right;">创建时间</td>
				<td style="width:150px;height:22px;"><input type="text" name="createtime" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:60px;height:22px;text-align:right;">创建人</td>
				<td style="width:150px;height:22px;"><input type="text" name="username" style="width:150px;height:22px;" cardCtrl="true"></input></td>
				<td style="width:100px;height:22px;text-align:right;">执行时间配置</td>
				<td style="width:360px;height:22px;" colspan="3"><input type="text" name="timeconfig" style="width:360px;height:22px;" cardCtrl="true"></input></td>
			</tr>
			<tr style="height:50px;">
				<td style="text-align:right;">执行表达式</td>
				<td colspan="7"><textarea name="runexp" style="width:950px;height:50px;" cardCtrl="true"></textarea></td> 
			</tr>
			<tr style="height:50px;">
				<td style="text-align:right;">执行参数</td>
				<td colspan="7"><textarea name="runparameters" style="width:950px;height:50px;" cardCtrl="true"></textarea></td> 
			</tr>
			<tr style="height:50px;">
				<td style="text-align:right;">备注</td>
				<td colspan="7"><textarea name="description" style="width:950px;height:50px;" cardCtrl="true"></textarea></td> 
			</tr>
		</table> 
	</div>
</body>	 
</html>