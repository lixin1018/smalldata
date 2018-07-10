<div id="driveToNextSelectUserDivId" class="easyui-layout" style="display:none;height:335px;width:700px;">
	<div data-options="region:'center',border:false"> 
		<div style="height:100%;overflow:hidden;position:relative;">
			<div style="position:absolute;left:5px;right:5px;top:0px;height:20px;line-height:20px;">接收人<span name="selectedNextUserCount"></span>:&nbsp;</div>  
			<div name="nextUserList" style="position:absolute;left:0px;right:0px;top:20px;height:40px;border:solid 1px #a6c9e2;line-height:20px;color:#A9A9A9;">请使用左侧窗口添加接收人</div> 
			<div style="position:absolute;left:5px;right:5px;top:60px;height:20px;line-height:20px;">附言:</div>
			<div style="border:solid 1px #a6c9e2;position:absolute;left:0px;right:0px;top:80px;bottom:0px;">
				<textarea name="note" placeholder="请在此处输入意见或建议" style="position:absolute;resize:none;left:0px;right:0px;top:0px;bottom:0px;width:100%;border:none;margin:0; padding:0;"></textarea>
			</div>
		</div>  
	</div> 
	<div data-options="region:'west',border:false" style="width:350px;">
		<div class="easyui-layout" data-options="fit:true">
			<div data-options="region:'north',border:false" style="height:30px;">  
				<table style="width:100%;height:100%;font-size:12px;">
					<tr>
						<td style="width:40px;text-align:right;padding-left:3px;">团队:</td>
						<td style="width:100px;"><input name="teamname" style="width:100px;" paramCtrl="true" /></td>
						<td style="width:40px;text-align:right;padding-left:3px;">姓名:</td>
						<td style="width:60px;"><input name="username" style="width:60px;" paramCtrl="true" /></td>
						<td style="width:50px;text-align:center;"><a name="queryUserBtn" style="width:50px;color:#333333;cursor:pointer;" >查&nbsp;询</a></td>
						<td>&nbsp;</td>
					</tr>
				</table>
			</div>
			<div name="gridDiv" class="ncpGridDiv" data-options="region:'center',border:false">   
				<table name="gridCtrl" ></table>  
			</div>
			<div class="ncpGridToolbarContainer" data-options="region:'south',border:false" style="height:30px;">
				<span name="paginationCtrl" style="float:left;" class="easyui-pagination ncpGridPagination" data-options="showPageList: false,showRefresh: true,beforePageText:'第',afterPageText:'/{pages}页',displayMsg: '共{total}条'"></span>	 	
			</div> 
		</div> 
	</div>
</div>