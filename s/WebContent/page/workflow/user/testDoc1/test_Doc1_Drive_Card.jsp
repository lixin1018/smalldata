<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../../../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>test_doc1我的任务详情</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript" src="${dataModel}/test_doc1.js"></script>
	<script type="text/javascript" src="${viewModel}/test_doc1.js"></script>
	<script type="text/javascript" src="${sheetModel}/testDoc1.js"></script>
	<script type="text/javascript" src="${dataModel}/Wf_InstanceStepForBackList.js"></script>
	<script type="text/javascript" src="${viewModel}/Wf_InstanceStepForBackList.js"></script>
	
	<script> 
		$(document).ready(function(){ 			
			var initParam = window.parent.multiStyleWinInitParam; 
			initParam.containerId = "testCardContainer";
			initParam.driveBtnId = "driveBtnId";
			initParam.sendBackBtnId = "sendBackBtnId";
			initParam.showLogBtnId = "showLogBtnId";
			initParam.getBackBtnId = "getBackBtnId";
			initParam.showStatusDivId = "showStatusDivId"; 
			initParam.windowType = "drive";
			initParam.sheetModel = sheetModels[initParam.sheetName];
			var cardWin = new NcpDocumentMultiStyleSheetWin(initParam); 
			cardWin.show();	 
	});  
	</script>
</head>  
<body class="easyui-layout" style="width:100%;height:100%;" id = "testCardContainer">
	<div class="ncpCardToolbarContainer" data-options="region:'north',border:false">	 
		<span class="ncpCardToolbar">
			<a name="backBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-back'">返回</a>
			<a name="editBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-edit'">编辑</a>
			<a name="saveBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-save',disabled:true">保存</a>
			<a name="cancelBtn" href="#" class="easyui-linkbutton" data-options="plain:true,iconCls:'icon-cancel'">取消</a>  
		</span>  
		<span style="width:500px;"> 
			<input type="button" id="showLogBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;"  value="查看流程" />
			<input type="button" id="sendBackBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;"  value="退 回" />	
			<input type="button" id="driveBtnId" style="width:80px;float:right;margin-left:5px;margin-right:5px;height:25px;" value="通 过" /> 
			<span id="showStatusDivId" style="width:300px;float:right;margin-left:5px;margin-right:5px;text-align:right;height:25px;line-height:25px;cursor:pointer;text-decoration:underline;"></span>
		</span>	
	</div>   
	<div name="cardDiv" class="cardGridDiv" data-options="region:'center',border:false" > 
		<table>
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">价格</td>
				<td style="width:200px;height:22px;"><input type="text" name="price" style="width:150px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">创建人</td>
				<td style="width:200px;height:22px;"><input type="text" name="createusername" style="width:150px;" cardCtrl="true"></input></td> 
			</tr>  
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">创建时间</td>
				<td style="width:200px;height:22px;"><input type="text" name="createtime" style="width:150px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">创建日期</td>
				<td style="width:200px;height:22px;"><input type="text" name="createdate" style="width:150px;" cardCtrl="true"></input></td> 
			</tr>   
			<tr style="height:22px;">
				<td style="width:100px;text-align:right;">所属部门</td>
				<td style="width:200px;height:22px;"><input type="text" name="orgname" style="width:150px;" cardCtrl="true"></input></td>
				<td style="width:100px;text-align:right;">修改人</td>
				<td style="width:200px;height:22px;"><input type="text" name="modifyusername" style="width:150px;" cardCtrl="true"></input></td> 
			</tr>    
			<tr style="height:50px;">
				<td style="width:100px;text-align:right;">备注说明</td>
				<td colspan="3" ><textarea name="note" style="width:500px;height:50px;" cardCtrl="true"></textarea></td> 
			</tr>    
		</table>      
	</div> 
</body>	 
</html>