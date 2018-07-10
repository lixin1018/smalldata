function ImportExportLayout(){
	var that = this;
	this.ie = null;
	this.nameInputControlId = null;
	this.codeInputControlId = null;
	this.definitionXmlInputControlId = null;
	
	this.show = function(p){
		this.nameInputControlId = p.nameInputControlId;
		this.codeInputControlId = p.codeInputControlId;
		this.definitionXmlInputControlId = p.definitionXmlInputControlId;
		
		$("#" + this.nameInputControlId).val(this.ie.name);
		$("#" + this.codeInputControlId).val(this.ie.code);
		$("#" + this.definitionXmlInputControlId).val(this.ie.versionXml);
	}
	
	//调用服务器端，读取表格
	this.loadFromServer = function(p){
		this.versionId = p.versionId;
		this.definitionId = p.definitionId;
		var afterLoadFunc = p.afterLoadFunc;
		
		var requestParam = {
			definitionId: this.definitionId,
			versionId: this.versionId
		};
		
 		serverAccess.request({
			serviceName:"importExportNcpService", 
			funcName:"readVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var name = decodeURIComponent(obj.result.versionJson.name);
				var code = decodeURIComponent(obj.result.versionJson.code);
				var versionXml = decodeURIComponent(obj.result.versionXml);
				
				var ie = new ImportExport();
				ie.load({name:name, code:code, versionXml:versionXml});
				that.ie = ie;
				
				if(afterLoadFunc != null) {
					afterLoadFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	
	//调用服务器端保存
	this.saveToServer = function(p){
		this.endEdit();
		var afterSaveFunc = p.afterSaveFunc;
		
		var definitionId = that.definitionId;
		var versionId = that.versionId;
		var name = that.ie.name;
		var code = that.ie.code;
		var versionXml = that.ie.toXml();
		
		var requestParam = {
			definitionId: definitionId,
			versionId: versionId,
			name: encodeURIComponent(name),
			code: encodeURIComponent(code),
			versionXml: encodeURIComponent(versionXml)
		};				
		
 		serverAccess.request({
			serviceName:"importExportNcpService", 
			funcName:"updateVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){ 			
				if(obj.result.validateResult == null){
					msgBox.alert({info: "更新成功!"}); 
				}
				else{
					var error = obj.result.validateResult.error;
					var alert = obj.result.validateResult.alert;
					if(error.length != 0){
						//验证未通过
						var msg = "验证未通过!\r\n错误信息:\r\n" + decodeURIComponent(error) + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
						msgBox.alert({info: msg});
					}
					else{
						//验证通过
						var msg = "更新成功!" + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
						msgBox.alert({info: msg}); 
					} 
				}
				
				if(afterSaveFunc != null){
					afterSaveFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	//调用服务器端验证
	this.validateOnServer = function(p){
		this.endEdit(); 
		var afterValidateFunc = p.afterValidateFunc;
		
		var definitionId = that.definitionId;
		var versionId = that.versionId;
		var name = that.ie.name;
		var code = that.ie.code;
		var versionXml = that.ie.toXml();
		
		var requestParam = {
			definitionId: definitionId,
			versionId: versionId,
			code: decodeURIComponent(code),
			name: decodeURIComponent(name),
			versionXml: decodeURIComponent(versionXml)
		};				
		
 		serverAccess.request({
			serviceName:"importExportNcpService", 
			funcName:"validateVersion", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){ 
			
				var error = obj.result.validateResult.error;
				var alert = obj.result.validateResult.alert;
				if(error.length != 0){
					//验证未通过
					var msg = "验证未通过!\r\n错误信息:\r\n" + decodeURIComponent(error) + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
					msgBox.alert({info: msg});
				}
				else{
					//验证通过
					var msg = "验证通过!" + (alert.length == 0 ? "" : ("\r\n警告信息: " + decodeURIComponent(alert)));
					msgBox.alert({info: msg}); 
				} 
				
				if(afterValidateFunc != null){
					afterValidateFunc();
				}
			},
			failFunc:function(obj){ alert(cmnPcr.jsonToStr(obj)); }
		});
	}
	
	//结束编辑
	this.endEdit = function(){
		this.ie.name = $("#" + this.nameInputControlId).val();
		this.ie.code = $("#" + this.codeInputControlId).val();
		this.ie.versionXml = $("#" + this.definitionXmlInputControlId).val();
	}

	//创建新的
	this.create = function(p){
		var ie = new ImportExport();
		ie.create(p);
		this.ie = ie;
	} 
}

function ImportExport(){
	this.versionId = null;
	this.name = null; 
	this.code = null; 
	this.versionXml = null;
	
	this.toXml = function(){	 
		var versionXml = this.versionXml == "" || this.versionXml == null ? "" : this.versionXml;
		return versionXml;
	}
	
	this.load = function(initParam){ 
		this.name = initParam.name == null || initParam.name == "" ? null : initParam.name; 
		this.code = initParam.code == null || initParam.code == "" ? null : initParam.code; 
		this.versionXml = initParam.versionXml == null || initParam.versionXml == "" ? null : initParam.versionXml;		
	}
	
	this.create = function(p){ 
		this.name = p.name;
		this.code = p.code;
		this.versionXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n"
			+ "<ImportExportDefinition UpdateType=\"UpdateExistRow\" FileType=\"EXCEL\">\r\n"
   			+ "  <ExcelParser HasHeaderRow=\"true\">\r\n"
   			+ "    <Columns>\r\n"
       		+ "      <Column ExcelColumnName=\"test\" ItemName=\"test\" DataType=\"String\"></Column>\r\n"
     		+ "    </Columns>\r\n"
   			+ "  </ExcelParser>\r\n"
   			+ "  <FieldList>\r\n"
     		+ "    <Field ItemName=\"test\" DBFieldName=\"test\" IsUnique=\"false\" Width=\"1000\"  FieldType=\"String\"></Field>\r\n"
     		+ "  </FieldList>\r\n"
     		+ "</ImportExportDefinition>\r\n";
	}
}