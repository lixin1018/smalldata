function DriveToNextWindow(){
	//操作按钮列的名称
	this.operateColumnName = "operateColumn";
	var that = this;
	this.nextUserList = null;
	this.form = null;
	this.grid = null;
	this.paramWin = null;
	this.userWin = null;
	this.containerId = null;
	this.afterOkFunction = null; 
	
	this.addToNextUserList = function(userId){
		var row = this.userWin.datatable.getRowByIdField(userId, "userid"); 
		var userName = row.getValue("username"); 
		var userCode = row.getValue("usercode");
		for(var i = 0; i < that.nextUserList.length; i++){
			var uId = that.nextUserList[i].userId;
			if(uId == userId){
				return false;
			}
		}
		that.nextUserList.push({
			userId: userId,
			userName: userName,
			userCode: userCode
		});
		that.refreshOperateColumnText(userId);
		this.refreshNextUserList();
		return false;
	} 
	
	this.refreshOperateColumnText = function(userId){
		var linkId = that.getCellContainerId(userId);
		var linkText = that.getLinkText(userId);
		$("#" + linkId).text(linkText);
	} 
	
	this.removeFromNextUserList = function(userId){
		var userList = new Array();
		for(var i = 0; i < that.nextUserList.length; i++){
			var userObj = that.nextUserList[i];
			var uId = userObj.userId;
			var uCode = userObj.userCode;
			var uName = userObj.userName;
			if(uId != userId){
				userList.push({
					userId: uId,
					userName: uName,
					userCode: uCode
				});
			}
		}
		that.nextUserList = userList;
		that.refreshOperateColumnText(userId);
		that.refreshNextUserList();
		return false;
	}
		
	that.refreshNextUserList = function(){
		var showContainer = $("#" + that.containerId).find("div[name='nextUserList']")[0];
		var showCountContainer = $("#" + that.containerId).find("span[name='selectedNextUserCount']")[0];
		$(showCountContainer).text("(已选" + that.nextUserList.length + "人)");
		if(that.nextUserList.length == 0){
			$(showContainer).css("color", "#A9A9A9");
			$(showContainer).text("请使用左侧窗口添加接收人"); 
		}
		else{
			$(showContainer).css("color", "#000000");
			$(showContainer).empty();
			for(var i = 0; i < that.nextUserList.length; i++){
				var userObj = that.nextUserList[i];
				var userId = userObj.userId;
				var userName = userObj.userName;
				var userCode = userObj.userCode;
				var id = that.containerId + "_NextUser_" + userId; 
				var deleteBtnId = id + "_Delete"; 
				var html = "<span id=\"" + id + "\"></span><span id=\"" + deleteBtnId + "\" userId=\"" + userId + "\" style=\"border:solid 1px #cccccc;width:20px;text-align:center;color:#A9A9A9;font-size:13px;padding-left:3px;padding-right:3px;cursor:pointer;\">×</span>;&nbsp;";
				$(showContainer).append(html);
				$("#" + id).text(userName);
				$("#" + deleteBtnId).click(function(){
					var userId = $(this).attr("userId");
					that.removeFromNextUserList(userId);
				});
			}
		}
	}
	
	this.getLinkText = function(userId){
		var linkText = "添加到接收人";
		for(var i = 0; i < that.nextUserList.length; i++){
			var uId = that.nextUserList[i].userId;
			if(uId == userId){
				linkText = "已添加";
				break;
			}
		}
		return linkText;
	}
		
	//获取操作按钮单元格内容html
	this.getLinkHtml = function(userId){
		var linkId = that.getCellContainerId(userId);
		var linkText = that.getLinkText(userId);		
		var showDetailBtnHtml = "<a id=\"" + linkId + "\" userId=\"" + userId + "\" style=\"line-height:24px;cursor:pointer;\" >" + linkText + "</a>";
		return "&nbsp;&nbsp;&nbsp;" + showDetailBtnHtml;
	}

	//操作按钮列ID
	this.getCellContainerId = function(userId){
		return that.operateColumnName + "_" + userId;
	}
	
	this.init = function(p){		
		var popContainer = new PopupContainer({
			width : 700,
			height : 400,
			top : 150
		});
		popContainer.show();
		var winId = cmnPcr.getRandomValue();
		that.containerId = popContainer.containerId;
		var titleId = winId + "_title";
		var innerContainerId = winId + "_inner";
		var buttonContainerId = winId + "_buttonContainer";
		var okBtnId = winId + "_ok";
		var cancelBtnId = winId + "_cancel";
		var innerHtml = "<div id=\"" + titleId + "\" style=\"width:100%;height:30px;font-size:13px;text-align:center;font-weight:800;\"></div>"
	 	+ "<div id=\"" + innerContainerId + "\" style=\"witdh:100%;height:340px;font-size:11px;text-align:center;overflow:auto;\"></div>"
	 	+ "<div id=\"" + buttonContainerId + "\" style=\"witdh:100%;height:30px;font-size:11px;text-align:right;border-top:#dddddd 1px solid;line-height:30px;\">" 
	 	+ "<input type=\"button\" id=\"" + okBtnId +"\" value=\"确 定\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;" 
	 	+ "<input type=\"button\" id=\"" + cancelBtnId +"\" value=\"取 消\" style=\"width:70px;height:25px;cursor:pointer;\" />&nbsp;</div>";
		$("#" + popContainer.containerId).html(innerHtml); 		

		$("#" + titleId).text("请选择接收人");
		$("#" + p.contentDivId).appendTo("#" + innerContainerId);	
		$("#" + p.contentDivId).css("display", "block");	
		that.form = popContainer;
		
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
	
		$("#" + cancelBtnId).click(function(){ 
			that.form.hide(); 
		});
		
		$("#" + okBtnId).click(function(){
			if(that.nextUserList.length == 0){
				msgBox.alert({info: "请选择接收人"});
			}
			else{
				var userIds = new Array();
				for(var i = 0; i < that.nextUserList.length; i++){
					var userId = that.nextUserList[i].userId;
					userIds.push(userId);
				}
				var note = $("#" + that.containerId).find("textarea[name='note']").val();				
				that.afterOkFunction(userIds, note);
				that.form.hide(); 
			}
		});
	
		//从模型中增加操作按钮列
		viewModels.tm_teamMemberSelector.colModel.push({name:that.operateColumnName,
			label:"操作",
			width:100,
			hidden:false,
			sortable:false, 
			search:false,
			resizable:true,
			editable:false,
			canEdit:false,
			formatter: function(cellvalue, options, rowObject){
				var html = that.getLinkHtml(rowObject.userid);
				return "<div style=\"width:100%;height:100%;\">" + html + "</div>";
			}
		});

		//初始化编辑控件 
		this.paramWin = new NcpParamWin({
			containerId:p.contentDivId,
			paramWinModel:paramWinModels.driveToNextUserSelector
		}); 
		this.paramWin.show();
		
		this.userWin = new NcpGrid({
			containerId : p.contentDivId,
			multiselect : false,
			dataModel : dataModels.tm_teamMemberSelector,
			onePageRowCount : 10,
			isRefreshAfterSave : true,
			viewModel : viewModels.tm_teamMemberSelector
		});
		
		this.userWin.addExternalObject({
			afterDoPage: function(param){
				for(var rowId in that.userWin.datatable.allRows()){
					var row = that.userWin.datatable.rows(rowId);
					var userId = row.getValue("userid");
					var containerId = that.getCellContainerId(userId);
					$("#" + containerId).click(function(){
						var userId = $(this).attr("userId");
						that.addToNextUserList(userId);
						return false;
					});
				}				
				return false;
			}
		});
		//添加扩展程序，afterDoPage时，绑定每个操作单元格的操作按钮事件		
		this.userWin.show();
		this.nextUserList = new Array();
		that.refreshNextUserList();	
	}
	 
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
    	if(that.form != null){
    		that.form.show();
    	}
    	else{ 
    		that.init(p);
		} 
	}
} 

