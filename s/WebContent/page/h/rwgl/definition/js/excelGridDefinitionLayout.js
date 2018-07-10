function ExcelGridDefinitionLayout(p){
	var that = this;
	
	this.excelGridRowJson = null;

	this.excelGridId = null;
	this.excelGridVersionId = null;
	
	//基类
	this.base = ExcelGridLayout;
	this.base(p);
	
	this.checkClientHasModify = function(){
		return false;
	}
	
	//调用服务器端，保存当前编辑的表格
	this.activiteOnServer = function(p){
		var afterActiviteFunc = p.afterActiviteFunc;
		if(this.checkClientHasModify()){
			msgBox.alert({info: "模板已经修改，请先保存模板."});
		}
		else{
			var excelGridId = that.excelGridId;
			var excelGridVersionId = that.excelGridVersionId;
			if(msgBox.confirm({info:"确定要启用吗?"})){ 
				var requestParam = {
					excelGridId: excelGridId, 
					excelGridVersionId: excelGridVersionId
				};
		 		serverAccess.request({
 					waitingBarParentId: that.bodyId,
					serviceName:"excelGridNcpService", 
					funcName:"activateVersion", 
					args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
					successFunc:function(obj){ 
						that.excelGridRowJson = obj.result.excelGridVersion;
						that.excelGridRowJson.definitionName = decodeURIComponent(that.excelGridRowJson.definitionName);
						afterActiviteFunc();
					},
					failFunc:function(obj){ 
						if(obj.code == "activateVersion_002"){
							msgBox.alert({info: "验证失败:\r\n" + obj.message});
						}
						else{
							msgBox.alert({info: cmnPcr.jsonToStr(obj)}); 
						}
					}	
				});
			}  
		}
	}
	
	//调用服务器端，保存当前编辑的表格
	this.saveToServer = function(p){
		var afterSaveFunc = p.afterSaveFunc;
		that.endCellEdit(true);
		var excelGridId = that.excelGridId;
		var excelGridVersionId = that.excelGridVersionId;
		
		var requestParam = {
			excelGridId: excelGridId,
			excelGridVersionId: excelGridVersionId
		};				
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridNcpService", 
			funcName:"getIsEnableVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){			
				var isEnable = obj.result.isEnable; 
				var needCreateNewVersion = false;
				if(isEnable){
					needCreateNewVersion = !msgBox.confirm({info: "此版本目前为启用状态, 确定覆盖原有模板吗?\n点击\"确定\": 覆盖原有版本.\n点击\"取消\": 保留原有版本, 系统创建新的版本."});
				}
				that.saveToServerAfterCheckIsEnable({
					afterSaveFunc: afterSaveFunc,
					needCreateNewVersion: needCreateNewVersion
				});
			}
		});
	}
	
	this.saveToServerAfterCheckIsEnable = function(p){
		var afterSaveFunc = p.afterSaveFunc;
		
		var excelGridId = that.excelGridId;
		var excelGridVersionId = that.excelGridVersionId;
		var versionJson = that.eg.toJson();
		
		var requestParam = {
			excelGridId: excelGridId,
			excelGridVersionId: excelGridVersionId,
			excelGridJsonStr: versionJson,
			description: encodeURIComponent(that.excelGridRowJson.description),
			needCreateNewVersion: p.needCreateNewVersion
		};				
		
 		serverAccess.request({
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridNcpService", 
			funcName:"updateVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){			
				var isNewVersion = obj.result.saveResult.isNewVersion;
				that.excelGridVersionId = obj.result.saveResult.excelGridVersionId;
				that.excelGridRowJson = obj.result.excelGridVersion;
				that.excelGridRowJson.definitionName = decodeURIComponent(that.excelGridRowJson.definitionName);
				var validateSucceed = obj.result.saveResult.validateSucceed;
				var error = obj.result.saveResult.error;
				
				var message = "保存成功.\n";
				if(isNewVersion){
					message += "系统创建了新的版本.\n";					
				}
				
				if(!validateSucceed){
					message += "虽然保存成功，但是新版本公式存在错误:\n";
					message += error;
				}
			
				msgBox.alert({info: message});
				
				if(afterSaveFunc != null){
					afterSaveFunc();
				}
			}
		});
	}  
	
	//调用服务器端，读取表格
	this.loadFromServer = function(p){
		this.excelGridId = p.excelGridId;
		this.excelGridVersionId = p.versionId;
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			excelGridId: this.excelGridId,
			excelGridVersionId: this.excelGridVersionId
		};				
		
 		serverAccess.request({ 
 			waitingBarParentId: that.bodyId,
			serviceName:"excelGridNcpService", 
			funcName:"readVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var versionFileJson = cmnPcr.strToJson(obj.result.excelGridVersionFile);
				
				that.excelGridRowJson = obj.result.excelGridVersion;
				that.excelGridRowJson.definitionName = decodeURIComponent(that.excelGridRowJson.definitionName);
				
				var eg = new ExcelGrid();
				eg.load(versionFileJson);
				that.eg = eg;
				
				//that.clientValidateAndCalcAllCells();
				that.clientValidateAllCells();
				
				if(afterLoadFunc != null) {
					afterLoadFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	
}