function FileSendWindow(){
	var that = this; 
	this.form = null; 
	
	this.dataDir = null;
	  
	this.afterOkFunction = null; 

	this.containerId = null;
	
	this.showFileSelectWindowFunc = null;
	
	this.showUserSelectWindowFunc = null;
	
	this.fileInfos = new Array();
	
	this.userInfos = new Array();
	
	this.messageContent = ""; 
	
	this.getMessage = function(){
		var message = $("#" + this.containerId).find("textarea[name='messageContent']").val();
		return message;
	}
	
	this.refreshShowFileNames = function(){
		var fileListDiv = $("#" + this.containerId).find("div[name='fileListDiv']")[0];
		$(fileListDiv).empty();
		
		$("#" + this.containerId).find("input[name='selectFileBtn']").val("文件(" + this.fileInfos.length + ")...");
		
		for(var i = 0; i < this.fileInfos.length; i++){ 
			var fileInfo = this.fileInfos[i];
			var fileSpanId = cmnPcr.getRandomValue();
			var deleteBtnId = "delete_" + fileSpanId;
			var html = "<span id=\"" + fileSpanId + "\"></span><span id=\"" + deleteBtnId + "\" fileId=\"" + fileInfo.id + "\" style=\"border:solid 1px #cccccc;width:20px;text-align:center;color:#A9A9A9;font-size:13px;padding-left:3px;padding-right:3px;cursor:pointer;\">×</span>;&nbsp;";
			$(fileListDiv).append(html);
			$("#" + fileSpanId).text(fileInfo.name);
			$("#" + deleteBtnId).click(function(){
				var fileId = $(this).attr("fileId");
				that.removeFromFileInfos(fileId);
				return false;
			});
		} 
	}
	
	this.removeFromFileInfos = function(fileId){
		var fileInfos = new Array();
		for(var i = 0; i < that.fileInfos.length; i++){
			var fileInfo = that.fileInfos[i]; 
			if(fileInfo.id != fileId){
				fileInfos.push(fileInfo);
			}
		}
		that.fileInfos = fileInfos; 
		that.refreshShowFileNames(); 
	}
	
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
	
		$("#" + p.contentDivId).find("img[name='sendCloseImage']").click(function(){
			if(msgBox.confirm({info: "确认放弃发送吗?"})){
				that.form.hide();
			}
		});   
		
		$("#" + p.contentDivId).find("input[name='sendFileBtn']").click(function(){ 
			if(that.fileInfos.length == 0){
				msgBox.alert({info: "请选择要发送的文件."});
				return false;
			}
			var emails = that.getInputEmails();
			if(emails != null){
				if(emails.length == 0){
				msgBox.alert({info: "请选择接收人."});
				return false;
				}
				else{
					that.getUserInfoByEmailOnServer({emails: emails});
				}
			}
			return false;
		});
		
		$("#" + p.contentDivId).find("input[name='selectFileBtn']").click(function(){			
			//弹出文件选择窗口，选择文件，后刷新fileInfos属性值
			that.selectFiles();
			return false;
		});
		
		$("#" + p.contentDivId).find("input[name='toEmailsBtn']").click(function(){  
			//弹出人员选择窗口，选择人员，后刷新toEmails录入框的值
			that.selectUsers();
			return false;
		});
		
		$("#" + that.containerId).find("textarea[name=\"toEmails\"]").blur(function(){
			that.refreshToEmailsBtn();
		});
	}  
	
	this.close = function(){
		that.form.hide();
	}
	
	this.selectFiles = function(){ 
		this.showFileSelectWindowFunc({
			afterOkFunction: function(fileObjArray){
				that.addFileInfos(fileObjArray);
			}
		});
	}
	
	this.selectUsers = function(){ 
		this.showUserSelectWindowFunc({
			afterOkFunction: function(fileObjArray){
				that.addUserInfos(fileObjArray);
			}
		});
	}
	
	this.addFileInfos = function(fileObjArray){
		for(var i = 0 ; i < fileObjArray.length; i++){
			var fileObj = fileObjArray[i];
			var hasSelected = false;
			for(var j  = 0; j < this.fileInfos.length; j++){
				if(this.fileInfos[j].id == fileObj.id){
					hasSelected = true;
					break;
				}
			}
			if(!hasSelected){
				this.fileInfos.push(fileObj);
			}
		}
		this.refreshShowFileNames();
	}
	
	this.addUserInfos = function(userArray){
		var emails = this.getInputEmails();
		if(emails != null){
			for(var i = 0 ; i < userArray.length; i++){
				var user = userArray[i];
				var hasSelected = false;
				for(var j  = 0; j < emails.length; j++){
					if(emails[j] == user.email){
						hasSelected = true;
						break;
					}
				}
				if(!hasSelected){
					emails.push(user.email);
					this.addToEmail(user.name, user.email);
				}
			}
		}
		this.refreshToEmailsBtn();
	}
	
	this.addToEmail = function(name, email){
		var emailStr = $("#" + that.containerId).find("textarea[name=\"toEmails\"]").val();
		emailStr = cmnPcr.trim(emailStr);
		if(emailStr.length == 0){
			emailStr = name + "<" + email + ">;";
		}
		else if(emailStr.endWith(";")){
			emailStr += " " + name + "<" + email + ">;";
		}
		else{
			emailStr += "; " + name + "<" + email + ">;";
		}
		$("#" + that.containerId).find("textarea[name=\"toEmails\"]").val(emailStr);
	}
	
	this.refreshToEmailsBtn = function(){
		var emails = this.getInputEmails();
		$("#" + this.containerId).find("input[name='toEmailsBtn']").val("接收人(" + (emails == null ? "0": emails.length) + ")...");
	}

	this.getInputEmails = function(){
		var emailStr = $("#" + that.containerId).find("textarea[name=\"toEmails\"]").val();
		var partStrs = emailStr.split(";");
		var emails = new Array();
		for(var i = 0; i < partStrs.length; i++){
			var partStr = cmnPcr.trim(partStrs[i]);
			if(partStr.length != 0){
				var beginIndex = partStr.indexOf("<");
				var endIndex = partStr.indexOf(">");
				var email = null; 
				if(beginIndex == -1 && endIndex == -1){
					email = cmnPcr.trim(partStr);
				}
				else if(beginIndex >= 0 && endIndex >= 0){
					email = cmnPcr.trim(partStr.substr(beginIndex + 1, endIndex - beginIndex - 1)); 
				} 
				if(!cmnPcr.isEmail(email)){				
					msgBox.alert({info: "Email地址错误. Email = " + partStr});
					return null;
				}
				emails.push(email);
			}
		}
		return emails;		
	}
	
	this.getUserInfoByEmailOnServer = function(p){ 
		var emails = p.emails;
		
		var requestParam = {
			emailArray: emails
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"getUserInfoByEmail", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){	
				var userInfoArray = obj.result.userInfoArray;
				that.afterGetUserInfoByEmailOnServer(userInfoArray); 
			},
			failFunc: function(obj){
				that.failGetUserInfoByEmailOnServer(obj);
			}
		}); 
	}
	this.afterGetUserInfoByEmailOnServer = function(userInfoArray){
		var userInfos = new Array();
		var notExistUserInfos = new Array();
		var notExistUserMessage = "系统内不存在这些用户, 邀请他们注册后即可发送文件，确定邀请吗?\r\n";
		for(var i = 0; i < userInfoArray.length; i++){
			var userInfoJson =  userInfoArray[i];
			var id =  userInfoJson.id;
			var email =  userInfoJson.email;
			var name = decodeURIComponent(userInfoJson.name);
			var userInfo = {
				name: name,
				id: id,
				email: email
			};
			if(id == null || id.length == 0){
				notExistUserInfos.push(userInfo);
				notExistUserMessage += ("\"" + email + "\" ");
			}
			userInfos.push(userInfo);
		}
			
		if(notExistUserInfos.length != 0){
			if(msgBox.confirm({info: notExistUserMessage})){
				this.inviteAndCreateUserOnServer({
					userInfos: userInfos, 
					notExistUserInfos:notExistUserInfos
				});
			}
		}
		else{
			var needSendEmail = true;
			
			var toUserEmailArray = new Array();
			for(var i = 0; i < userInfos.length; i++){
				toUserEmailArray.push(userInfos[i].email);
			}
			
			var fileIdArray = new Array();
			for(var i = 0; i < this.fileInfos.length; i++){
				fileIdArray.push(this.fileInfos[i].id);
			}
			
			if(msgBox.confirm({info: "确定发送文件吗?"})){
				this.sendToOnServer({ 
					toUserEmailArray: toUserEmailArray,
					fileIdArray: fileIdArray,
					needSendEmail: needSendEmail,
					message: that.getMessage()		
				});		
			}
		}
	} 
	
	this.failGetUserInfoByEmailOnServer = function(resultObj){ 
		msgBox.alert( {
			title : "获取接收人信息失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	}  
	
	this.inviteAndCreateUserOnServer = function(p){
		var userInfos = p.userInfos;
		var notExistUserInfos = p.notExistUserInfos;
		var emailArray = new Array();
		for(var i = 0; i < notExistUserInfo.length; i++){
			emailArray.push(notExistUserInfo.email);
		} 
		var requestParam = {
			emailArray: emailArray
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"inviteAndCreateUser", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){	
				var emailToUserIdsObj = obj.result.emailToUserIds;
				for(var email in emailToUserIdsObj){ 
					for(var i = 0; i < userInfos.length; i++){
						var userInfo = userInfos[i];
						if(userInfo.email == email){
							var id = emailToUserIdsObj[email];
							userInfo.id = id;
						}
					}
				}				
				
				that.afterInviteAndCreateUserOnServer({userInfos: userInfos}); 
			},
			failFunc: function(obj){
				that.failInviteAndCreateUserOnServer(obj);
			}
		}); 
	}
	
	this.afterInviteAndCreateUserOnServer = function(p){
		var userInfos = p.userInfos; 
		var needSendEmail = true;
		
		var fileIdArray = new Array();
		for(var i = 0; i < this.fileInfos.length; i++){
			var fileInfo = this.fileInfos[i];
			fileIdArray.push(fileInfo.id);
		}
		
		var toUserEmailArray = new Array();
		for(var i = 0; i < userInfos.length; i++){
			toUserEmailArray.push(userInfo[i].email);
		} 
		this.sendToOnServer({
			toUserEmailArray: toUserEmailArray,
			fileIdArray: fileIdArray,
			needSendEmail: needSendEmail,
			message: that.getMessage()
		});
	}
	
	this.sendToOnServer = function(p){
		var requestParam = {
			toUserEmailArray: p.toUserEmailArray,
			fileIdArray: p.fileIdArray,
			needSendEmail: p.needSendEmail ? "Y" : "N",
			message: encodeURIComponent(p.message)			
		};	
		
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"sendTo", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){	
				msgBox.alert({info: "发送成功."});
				that.close();
			},
			failFunc: function(obj){
				that.failSendToOnServer(obj);
			}
		}); 		
	}
	
	this.failSendToOnServer = function(resultObj){ 
		msgBox.alert( {
			title : "获取接收人信息失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	}  
	
	//显示
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
		this.fileInfos = p.fileInfos;
		this.userInfos = p.userInfos;
		this.messageContent = "";
    	if(that.form != null){
    		that.form.show(p);
    	}
    	else{ 
    		that.init(p);
		}
		this.refreshValues(p);
	}
	
	this.refreshValues = function(p){
		$("#" + this.containerId).find("div[name='sendTitle']").text(p.title);
		this.refreshShowFileNames();
		this.showFileSelectWindowFunc = p.showFileSelectWindowFunc;	
		this.showUserSelectWindowFunc = p.showUserSelectWindowFunc;	
	}
}