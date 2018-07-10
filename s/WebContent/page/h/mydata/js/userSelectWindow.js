function UserSelectWindow(){
	var that = this; 
	this.form = null;
	this.userWin = null;
	this.paramWin = null;
	  
	this.afterOkFunction = null; 

	this.containerId = null;
	
	this.init = function(p){
		var width = $("#" + p.contentDivId).width();
		var height = $("#" + p.contentDivId).height();	
		var popContainer = new PopupContainer({
			width : width,
			height : height,
			top : 100
		}); 
		
		popContainer.show(); 
		var winId = cmnPcr.getRandomValue();
		that.containerId = popContainer.containerId; 
		$("#" + p.contentDivId).appendTo("#" + that.containerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer; 
		
		//初始化编辑控件 
		this.paramWin = new NcpParamWin({
			containerId:p.contentDivId,
			paramWinModel:paramWinModels.driveToNextUserSelector
		}); 
		this.paramWin.show();
		
		this.userWin = new NcpGrid({
			containerId : p.contentDivId,
			multiselect : true,
			dataModel : dataModels.tm_teamMemberSelector,
			onePageRowCount : 10,
			isRefreshAfterSave : true,
			viewModel : viewModels.tm_teamMemberSelector
		});
		this.userWin.show();
		
		$("#" + p.contentDivId).find("a[name='queryUserBtn']").click(function(){			
			var paramValues = that.paramWin.getParamValues();
			
			that.userWin.doPage({
				pageNumber: 1,
				otherRequestParam: {
					userName: paramValues.username,
					teamId: paramValues.teamid
				}
			});
			return false;	
		});
	
		$("#" + p.contentDivId).find("img[name='selectCloseImage']").click(function(){
			that.form.hide();
		});   
		
		$("#" + p.contentDivId).find("input[name='selectUserBtn']").click(function(){ 
			var rowIds = that.userWin.getSelectedRowIds();
			if(rowIds.length == 0){
				msgBox.alert({info: "请选择用户"});
			} 
			var userArray = new Array();
			for(var i = 0; i < rowIds.length; i++){
				var rowId = rowIds[i];
				var row = that.userWin.datatable.rows(rowId); 
				userArray.push({
					id: row.getValue("userid"),
					email: row.getValue("email"),
					name: row.getValue("username")
				});
			}
			that.afterOkFunction(userArray);
			that.close(); 
			return false;
		});
	}
	
	this.close = function(){
		that.form.hide();
	} 
	 
	//显示
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
    	if(that.form != null){
    		that.form.show(p);
    	}
    	else{ 
    		that.init(p);
		}
		this.refreshValues(p);
	} 
	
	this.refreshValues = function(p){ 
		$("#" + this.containerId).find("div[name='selectTitle']").text(p.title);
	} 
}