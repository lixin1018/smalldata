<style>
	.stylePropertyLine{
		height:35px;
		width:100%;
	}
	.stylePropertyItem{
		height:20px; 
		float:left;
		width:150px;
	}
	.borderPropertyItem{
		width:250px;
	}
	.stylePropertyItem div{
		height:100%;
		float: left;
	}
	.stylePropertyItemName{
		width:60px; 
		line-height:20px;
		text-align:right;
		padding-right: 5px;
	}
	.colorPickerBtn{
		width:40px;
		height:20px;
		border: solid 1px #95B8E7;
		cursor: pointer;
		font-size:8px;
		line-height:20px;
		text-align:center;
		font-family: "simSun";
	}
	.colorPickerBtnBackgroud{
	}
	.colorPickerBtnBorder{ 
	}
	.colorPickerBtnFont{
		background-color: #000000;
	}
	.borderStyleBtn{
		width:60px;
		height:25px;
		float: left;
	}
	.borderWidthBtn{
		width:60px;
		height:25px;
		float: left;
	} 
	.fontStyleBtn{
		width:50px;
		height:25px;
		float: left;
	}
	.fontSizeBtn{
		width:50px;
		height:25px;
		float: left;
	}
	.fontFamilyBtn{
		width:120px;
		height:25px;
		float: left;
	} 
	.textHAlignBtn{
		width:50px;
		height:25px;
		float: left;
	} 
	.textVAlignBtn{
		width:50px;
		height:25px;
		float: left;
	} 
	
	.propertyItemBlankBorder{
		height:10px;
		width:540px;
		border-top: 1px solid #AAAAAA;
	}
</style>
<div id="cssEditorDivId" style="display:none;height:200px;width:530px;overflow:hidden;"> 
	<div class="stylePropertyLine">
		<div name="fontSize" class="stylePropertyItem">
			<div class="stylePropertyItemName">字号:</div>
			<input class="easyui-combobox fontSizeBtn" data-options="valueField:'value', textField:'text', panelHeight:'300'" >
		</div>
		<div name="fontStyle" class="stylePropertyItem">
			<div class="stylePropertyItemName">字形:</div>
			<input class="easyui-combobox fontStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
		</div>
		<div name="fontFamily" class="stylePropertyItem" style="width:200px;">
			<div class="stylePropertyItemName">字体:</div>
			<input class="easyui-combobox fontFamilyBtn" data-options="valueField:'value', textField:'text', panelHeight:'300'" >
		</div>
	</div>
	<div class="stylePropertyLine">
		<div name="textHAlign" class="stylePropertyItem">
			<div class="stylePropertyItemName">水平对齐:</div>
			<input class="easyui-combobox textHAlignBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
		</div>
		<div name="textVAlign" class="stylePropertyItem">
			<div class="stylePropertyItemName">垂直对齐:</div>
			<input class="easyui-combobox textVAlignBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
		</div>
		<div name="backgroundColor" class="stylePropertyItem" style="width:110px;">
			<div class="stylePropertyItemName">背景色:</div>
			<div class="colorPickerBtn colorPickerBtnBackgroud"></div>
		</div>
		<div name="color" class="stylePropertyItem" style="width:110px;">
			<div class="stylePropertyItemName">文字颜色:</div>
			<div class="colorPickerBtn colorPickerBtnFont"></div>
		</div>
	</div>
	<div class="propertyItemBlankBorder"></div>
	<div class="stylePropertyLine">
		<div name="innerBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">内边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div>
		<div name="outerBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">外边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div> 
	</div> 
	<div class="stylePropertyLine">
		<div name="topBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">上边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div>
		<div name="bottomBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">下边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div> 
	</div> 
	<div class="stylePropertyLine">
		<div name="leftBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">左边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div>
		<div name="rightBorder" class="stylePropertyItem borderPropertyItem">
			<div class="stylePropertyItemName">右边框:</div> 
			<div class="colorPickerBtn colorPickerBtnBorder"></div>
			<input class="easyui-combobox borderStyleBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" >
			<input class="easyui-combobox borderWidthBtn" data-options="valueField:'value', textField:'text', panelHeight:'auto'" > 
		</div> 
	</div>  
</div>