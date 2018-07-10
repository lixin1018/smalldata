<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title></title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<script type="text/javascript" src="${expressionjs}/editExpression.js"></script> 
	
	<style>
	.ncpMultiSelectItemSpan{
		border:solid 1px #A6C9E2;
		margin:2px;
		font-size:9px;
		height:16px;
		display:inline-block;
	}
	.ncpMultiSelectItemSpanCurrent{
		background-color:#FF9393;
	}
	.ncpMultiSelectItemValueSpan{
		line-height:16px; 
		height:16px;	
		display:inline-block;
		vertical-align:top;
	}
	.ncpMultiSelectItemDelete{
		width:16px;
		height:16px;
		display:inline-block;
		border-left:solid 1px #A6C9E2;
    	background:url(../../novaone-style/plugins/novaone/themes/default/images/remove.png) center center;
    	cursor:pointer;
	}
	</style>
	
	<script> 
	$(document).ready(function(){ 
		var initParam = window.parent.popInitParam; 
		var parameters = initParam.otherValues.currentParameters;
		var needResultType = initParam.otherValues.currentNeedResultType;
		var runAt = initParam.otherValues.currentRunAt;
		var expression = initParam.value;

		var inputExpParams = {
			expText:expression, 
			needResultType:needResultType,
			userParameters:parameters,
			/*
			userParameters:[
			                {name:"p1", valueType:valueType.string, description:"参数1"},
			                {name:"p2", valueType:valueType.decimal, description:"参数2"}
			                ],
            */
			returnFunc:function(p){
				if(p.succeed){
					expression = p.expText;
					closePop([{expression:expression}]);
				}
				else{
					closePop(null);
				}
			},
			runAt:runAt
		};
		var editExp = new EditExpression();
		editExp.init(inputExpParams);		

		var closePop = function(rows){ 
			initParam.closeWin({selectedRows:rows});
		} 		
	});  
	</script>
</head>

<body style="width:100%; height:100%;"  class="easyui-layout">
	<div data-options="region:'center',border:true">
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'center',border:false">				
				<div class="easyui-layout" data-options="fit:true" >
					<div id="keyWordDivId" style="height:30px;line-height:30px;" data-options="region:'north',border:false">&nbsp;
						<input type="button" style="width:25px;height:25px;" title="加" value="+" />
						<input type="button" style="width:25px;height:25px;" title="减" value="-" />
						<input type="button" style="width:25px;height:25px;" title="乘" value="*" />
						<input type="button" style="width:25px;height:25px;" title="除" value="/" />
						<input type="button" style="width:25px;height:25px;" title="括号" value="()" />
						<input type="button" style="width:25px;height:25px;" title="除" value="&quot;" />
						<input type="button" style="width:25px;height:25px;" title="逗号" value="," />
						<input type="button" style="width:25px;height:25px;" title="等于" value="=" />
						<input type="button" style="width:25px;height:25px;" title="大于" value="&gt;" />
						<input type="button" style="width:25px;height:25px;" title="小于" value="&lt;" />
						<input type="button" style="width:25px;height:25px;" title="大于等于" value="&gt;=" />
						<input type="button" style="width:25px;height:25px;text-align:center;" title="小于等于" value="&lt;=" />
					</div>
					<div id="expressionInputDivId" data-options="region:'center'" style="overflow:hidden;border-color:#aaaaaa;"> 
			 			<textarea placeholder="请输入表达式" id="expressionInputId" style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto;border-width:0px;" value="" ></textarea>
					</div>
				</div> 
			</div> 
			<div style="height:75px;" data-options="region:'south',border:false">
				<div class="easyui-layout" data-options="fit:true" >
				 	<div data-options="region:'north',border:false" style="height:25px;overflow:hidden;">
				 		<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">
				 			<tr style="vertical-align:bottom;text-align:center;">
				 				<td style="text-align:left;">
					 				&nbsp;
					 			</td>
				 				<td style="width:80px;">
					 				<input id="validateButtonId" type="button" value="验证 " style="width:70px;height:23px;" />
					 			</td>
				 				<td style="width:80px;">
				 					<input id="okButtonId" type="button" value="确 定" style="width:70px;height:23px;" />
				 				</td>
				 				<td style="width:80px;">
				 					<input id="cancelButtonId" type="button" value="取 消" style="width:70px;height:23px;" />
				 				</td>
				 			</tr>
				 		</table>   
				 	</div>
					<div id="validateResultDivId" data-options="region:'center',border:false">
						表达式验证结果:尚未验证.
					</div>
				 </div>
			 </div> 
		</div>
	</div>
	<div data-options="region:'west',border:true,collapsed:false,split:true" style="width:220px;overflow:hidden;">	
		<div class="easyui-layout" data-options="fit:true"  >
			<div id="findDivId" data-options="region:'north',border:false"  style="height:28px;overflow:hidden;">
				<input id="findId" type="text"  placeholder="查找：请输入函数名称或描述" style="height:100%;width:100%;" />
			</div> 
			<div id="funcTreeDivId" data-options="region:'center',border:false"  style="border-top:solid 1px #dddddd;"></div> 
			<div id="detailInfoDivId" data-options="region:'south',border:false"  style="height:76px;vertical-align:top;border-top:solid 1px #dddddd;word-break:break-all;padding:5px;"></div>
		</div>  
	</div>
</body>
</html>