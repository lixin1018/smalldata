<style>
	.viewPropertyLine{
		height:35px;
		width:100%;
	}
	.viewPropertyItem{
		height:20px; 
		float:left;
		width:150px;
	} 
	.viewPropertyItem div{
		height:100%;
		text-align:left;
		width:100px;
	}
	.viewPropertyItemName{
		width:60px; 
		line-height:20px;
		text-align:right;
		padding-right: 5px;
	} 
	.viewPropertyItemBlankBorder{
		height:10px;
		width:540px;
		border-top: 1px solid #AAAAAA;
	}
	.checkBtn{
		float: left;
		width:14px;
		height:14px;
	}
</style>
<div id="viewEditorDivId" style="display:none;height:200px;width:530px;overflow:hidden;"> 
	<div class="viewPropertyLine">
		<div name="hasPageTitle" class="viewPropertyItem">
			<input type="checkbox" name="hasPageTitleCheckbox" class="checkBtn" />
			<div class="viewPropertyItemName">显示标题栏</div> 
		</div>
		<div name="hasEditBar" class="viewPropertyItem">
			<input type="checkbox" name="hasEditBarCheckbox" class="checkBtn" />
			<div class="viewPropertyItemName">显示编辑栏</div> 
		</div>
		<div name="hasSheetTitle" class="viewPropertyItem">
			<input type="checkbox" name="hasSheetTitleCheckbox" class="checkBtn" />
			<div class="viewPropertyItemName">显示表名栏</div> 
		</div> 
	</div> 
	<div class="viewPropertyLine">
		<div name="hasColumnRowTitle" class="viewPropertyItem">
			<input type="checkbox" name="hasColumnRowTitleCheckbox" class="checkBtn" />
			<div class="viewPropertyItemName">显示行列标题</div> 
		</div>
		<div name="hasGridLine" class="viewPropertyItem">
			<input type="checkbox" name="hasGridLineCheckbox" class="checkBtn" />
			<div class="viewPropertyItemName">显示网格线</div> 
		</div>
	</div> 
</div>