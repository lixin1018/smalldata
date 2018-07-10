function NcpEditDataGrid(p) {

	var that = this;

	//基类
	this.base = NcpGrid;
	this.base(p);
	
	this.serviceName = "editShareDataGridNcpService";
}

var gridWin = null; 
$(document).ready(function(){ 
	var p = { 
		containerId:"dataGridContainer",   
		multiselect:true,
		dataModel:dataModel,
		onePageRowCount:30,
		isRefreshAfterSave:true,
		isShowData:true,
		viewModel:viewModel 
	};
	gridWin = new NcpEditDataGrid(p); 
	gridWin.show(); 
});
		