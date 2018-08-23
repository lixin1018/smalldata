function NcpShareDataParamWin(p){
	
	var that = this;
	
	//基类
	this.base = NcpParamWin;
	this.base(p);
	
	this.getPopContainer = function(param){
		var popContainer = new PopupContainer({
			width:350,
			height:400,
			top:50});
		return popContainer;
	}
	
	//下拉
	this.baseList= function(param){
		var requestParam ={serviceName : "shareDataParamWinNcpService",
				waitingBarParentId : null,
				funcName : "getList", 
				successFunc : function(obj){ 
					param.rows = that.getListRowsFromBackInfo(obj.result.table.rows, param.paramModel.list.columns); 
					that.processListData(param);
					that.afterBaseList(param); 
					that.afterDoList(param); 
				},
				args : {requestParam:cmnPcr.jsonToStr({
					paramWinName: that.paramWinModel.name,
					listName: param.listName,
					where: param.where == undefined ? [] : param.where,
					orderby: param.orderby== undefined ? [] : param.orderby,
					otherRequestParam:param.otherRequestParam
				})}
				};
		this.ProcessServerAccess(requestParam); 
	}
}