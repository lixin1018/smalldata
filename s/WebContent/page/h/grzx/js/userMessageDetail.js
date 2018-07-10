$(document).ready(function(){ 	
	var initParam = window.parent.multiStyleWinInitParam; 
	initParam.containerId = "testSheetContainer";
	var sheetWin = new NcpMultiStyleSheetWin(initParam); 
	sheetWin.show();	
	var sheetCtrl = sheetWin.sheetCtrl;
	
	window.parent.markCurrentRead();
});  