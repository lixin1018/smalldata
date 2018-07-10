function FileSelectWindow(){
	var that = this; 
	this.form = null;
	
	//默认按照名称排序
	this.sortFieldName = dataDirAndFileOrderByFieldName.name;
	this.sortDirection = dataDirAndFileOrderByDirection.asc;
	
	this.dataDir = null;
	  
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
	
		$("#" + p.contentDivId).find("img[name='selectCloseImage']").click(function(){
			that.form.hide();
		});   
		
		$("#" + p.contentDivId).find("input[name='selectFileBtn']").click(function(){ 
			var selectedItemIds = that.getSelectedItemIds();
			if(selectedItemIds.length == 0){
				msgBox.alert({info: "请选择文件"});
			}
			if(that.checkSelectedItems(selectedItemIds)){
				var fileObjArray = new Array();
				for(var i = 0; i < selectedItemIds.length; i++){
					var id = selectedItemIds[i];
					var df = that.dataDir.getDF(id);
					fileObjArray.push(df);
				}
				that.afterOkFunction(fileObjArray);
				that.close();
			}
			else{
				msgBox.alert({info: "只允许选择文件"});
			}
			return false;
		}); 
		
		//打开p.dirId对应的文件夹
		this.getChildrenOnServer("", true, true);	
	} 
	
	this.checkSelectedItems = function(ids){ 
		for(var i = 0; i < ids.length; i++){
			var id = ids[i];
			var df = this.dataDir.getDF(id);
			if(df.isDir){
				return false;
			}
		}
		return true;
	}
	
	this.close = function(){
		that.form.hide();
	}
	
	this.getSelectedItemIds = function(){
		var items = $("#" + this.containerId).find(".popItemLineDiv");
		var selectedItemIds = new Array();
		for(var i = 0; i < items.length; i++){
			var item = items[i];
			if($(item).hasClass("popItemLineDivSelected")){
				var did = $(item).attr("did");
				selectedItemIds.push(did);
			} 
		}		
		return selectedItemIds;
	}
		
	//选中此项
	this.selectAllItems = function(selected, checkAllSelected){
		var items = $("#" + this.containerId).find(".popItemLineDiv");
		for(var i = 0; i < items.length; i++){
			var did = $(items[i]).attr("did");
			this.selectItem(did, selected, false);
		}		
		if(checkAllSelected){
			this.checkAllItemSelected();
		}
	}
	
	//查看是否已经全选，并设置全选按钮状态
	this.checkAllItemSelected = function(){
		var allSelected = true;
		var items = $("#" + this.containerId).find(".popItemLineDiv");
		for(var i = 0; i < items.length; i++){
			if(!$(items[i]).hasClass("popItemLineDivSelected")){
				allSelected = false;
				break;
			}
		}
		
		$( "#" + this.containerId).find("input[name='selectAllCheckbox']").attr("checked", allSelected);		
	}
	
	//选中此项
	this.selectItem = function(did, selected, checkAllSelected){
		var items = $("#" + this.containerId).find(".popItemLineDiv[did='" + did + "']");
		if(items.length > 0){
			var item = items[0]; 
			if(selected){
				$(item).addClass("popItemLineDivSelected"); 
				$(item).find("input[name='selectItemCheckbox']").attr("checked", true);
			}
			else{
				$(item).removeClass("popItemLineDivSelected"); 
				$(item).find("input[name='selectItemCheckbox']").attr("checked", false);
			}	
			if(checkAllSelected){
				this.checkAllItemSelected();
			}
		}
	}
	
	//显示文件夹路径	
	this.getChildrenOnServer = function(parentId, doesShowDir, doesShowFile){		
		var requestParam = {
			parentId: parentId, 
			doesShowDir: doesShowDir ? "Y" : "N",
			doesShowFile: doesShowFile ? "Y" : "N"
		};
		
		//提交重命名，如果重命名成功，那么关闭重命名窗口，如果失败则提示之
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService",
			funcName:"getChildren",
			args:{requestParam: cmnPcr.jsonToStr(requestParam)},
			successFunc: function(obj){
				var childrenArray = obj.result.childrenArray;
				var allChildDirAndFiles = new Object();
				for(var i = 0; i < childrenArray.length; i++){
					var df = that.getDFInfoByServerBackInfo(childrenArray[i]);
					allChildDirAndFiles[df.id] = df;
				}
				
				var pathPartArray = obj.result.pathPartArray;
				var allPathInfos = new Array();
				for(var i = 0; i < pathPartArray.length; i++){
					var df = that.getDFInfoByServerBackInfo(pathPartArray[i]);
					allPathInfos.push(df);
				}
				
				that.afterGetChildrenOnServer(parentId, allChildDirAndFiles, allPathInfos);
			},
			failFunc: function(obj){
				that.failGetChildrenOnServer(obj);
			}
		}); 
	}
	
	this.afterGetChildrenOnServer = function(parentId, allChildDirAndFiles, allPathInfos){
		var dataDir = new DataDir();
		dataDir.init({ 
			pathInfos: allPathInfos,
			childDirAndFiles: allChildDirAndFiles
		});
		this.dataDir = dataDir;
		
		//刷新dataDir的展示
		$( "#" + this.parentDivId).find("div[name='dirAndFileList']").children(".itemLineDiv").remove();
		var childNum = this.dataDir.getChildNum(); 
		
		this.showPathElements();
		this.showChildElements();
				
		this.bindItemEvent();
	}
	
	this.failGetChildrenOnServer = function(resultObj){
		//打开文件夹失败
		msgBox.alert( {
			title : "获取文件夹信息失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	}
	
	//显示文件夹的文件（夹）列表	
	this.showChildElements = function(){
		var childrenDirAndFiles = this.dataDir.getSortedObjects(this.sortDirection, this.sortFieldName)
		var allChildElementHtml = ""; 
		for(var i = 0; i < childrenDirAndFiles.length; i++){
			var dfObj = childrenDirAndFiles[i];
			allChildElementHtml += this.createChildElementHtml(dfObj); 
		}
		$( "#" + this.containerId).find("div[name='dirAndFileList']").html(allChildElementHtml);
	}
	
	//创建文件夹内元素
	this.createChildElementHtml = function(dfObj){
		var nameTitle = cmnPcr.replace(dfObj.name, "\"", "'");
		var nameHtml = cmnPcr.html_encode(dfObj.name); 
		var fileTypeHtml = cmnPcr.html_encode(dfObj.fileType); 
		var childElementHtml = "<div class=\"popItemLineDiv\" name=\"itemLine\" did=\"" + dfObj.id + "\">" 
			+ "<div class=\"popItemSelectDivMultiSelect\" name=\"itemSelectDiv\"><input type=\"checkbox\" did=\"" + dfObj.id + "\" name=\"selectItemCheckbox\" /></div>"
			+ "<div class=\"popItemIconDivMultiSelect\"><img src=\"img/fileType/" + dfObj.fileType + ".png\" /></div>"
			+ "<div class=\"popItemNameDivMultiSelect\"><a name=\"nameLink\" title=\"" + nameTitle + "\">" + nameHtml + "</a></div>" 
			+ "<div class=\"popItemFileTypeDivMultiSelect\">" + fileTypeHtml + "</div>"  
			+ "</div>"; 
		return childElementHtml;
	}
	
	//绑定点击事件
	this.bindItemEvent = function(){
		
		$( "#" + this.containerId).find("input[name='selectAllCheckbox']").click(function(){
			var selected = $(this).is(":checked");
			that.selectAllItems(selected, false); 
		}); 
				
		//点击列表中的文件夹
		$("#" + this.containerId).find(".popItemLineDiv").unbind("click");
		$("#" + this.containerId).find(".popItemLineDiv").click(function(e){  
			if($(e.srcElement).attr("name") != "selectItemCheckbox"
				&& $(e.srcElement).attr("name") != "itemSelectDiv"){
				var did = $(this).attr("did"); 
				var dfObj = that.dataDir.getDF(did);
				if(dfObj.isDir){
					that.getChildrenOnServer(did, true, true);
				}
				else {
					var did = $(this).attr("did");
					that.selectAllItems(false, false);
					that.selectItem(did, true, true); 
				}
			} 
		});
		
		//点击路径中的文件夹
		$("#" + this.containerId).find(".pathPart").unbind("click");
		$("#" + this.containerId).find(".pathPart").click(function(e){  
			var did = $(this).attr("did");  
			that.getChildrenOnServer(did, true, true); 
		});  
		
		$("#" + this.containerId).find(".popItemLineDiv").find("div[name='itemSelectDiv']").unbind("click");
		$("#" + this.containerId).find(".popItemLineDiv").find("div[name='itemSelectDiv']").click(function(e){
			if($(e.srcElement).attr("name") == "itemSelectDiv"){
				var did = $(this).parent().attr("did");
				var selected = $(this).parent().hasClass("popItemLineDivSelected");
				that.selectItem(did, !selected, true);
			} 
		});
		
		$("#" + this.containerId).find(".popItemLineDiv").find("input[name='selectItemCheckbox']").unbind("change");
		$("#" + this.containerId).find(".popItemLineDiv").find("input[name='selectItemCheckbox']").change(function(e){
			var did = $(this).attr("did");
			var selected = $(this).parent().parent().hasClass("popItemLineDivSelected");
			that.selectItem(did, !selected, true);
			return false;
		});
	}
	
	
	//显示路径
	this.showPathElements = function(){
		var pathInfos = this.dataDir.pathInfos;
		var fullPathElementHtml = "<span style=\"position:relative;height:30px;width:30px;\">&nbsp;&nbsp;&nbsp;&nbsp;<img src=\"img/dir.png\" style=\"position:absolute;left:0px;top:1px;width:16px;height:16px;\" /></span>";
		for(var i = 0; i < pathInfos.length; i++){
			var pathInfo = pathInfos[i];
			fullPathElementHtml += this.createPathSplitElementHtml();
			var dirName = (pathInfo.isSys && pathInfo.name == "myDocument") ? "我的文档" : pathInfo.name;
			fullPathElementHtml += this.createPathPartElementHtml(pathInfo.id, dirName);
		}
		$( "#" + this.containerId).find("div[name='dirPathInfo']").html(fullPathElementHtml);
	}
	
	//创建路径元素
	this.createPathPartElementHtml = function(id, name){
		var nameHtml = cmnPcr.html_encode(name);
		var html = "<span name=\"pathPart\" did=\"" + id + "\" class=\"pathPart\">" + nameHtml + "</span>"
		return html;
	}
	this.createPathSplitElementHtml = function(){ 
		var html = "&nbsp;<span>&gt;</span>&nbsp;"
		return html;
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
		this.getChildrenOnServer(this.dataDir == null || this.dataDir.id == null ? "" : this.dataDir.id, true, true);
		$("#" + this.containerId).find("div[name='selectTitle']").text(p.title);
	}
	
	//将服务器端返回的文件夹（文件）信息转换成DataDirAndFile对象
	this.getDFInfoByServerBackInfo = function(dfInfoObj){
		var obj = {
			id: dfInfoObj.id,
			name : decodeURIComponent(dfInfoObj.name),
			isDir: cmnPcr.strToObject(dfInfoObj.isDir, valueType.boolean),
			isSys: cmnPcr.strToObject(dfInfoObj.isSys, valueType.boolean),
			fileType: dfInfoObj.fileType,
			fileSize: dfInfoObj.fileSize,
			createTime: cmnPcr.strToObject(dfInfoObj.createTime, valueType.time),
			lastModifyTime: cmnPcr.strToObject(dfInfoObj.lastModifyTime, valueType.time),
			createUserId: dfInfoObj.createUserId,
			modifyUserId: dfInfoObj.modifyUserId,
			description: decodeURIComponent(dfInfoObj.description),
			parentId: dfInfoObj.parentId,
			isDeleted: cmnPcr.strToObject(dfInfoObj.isDeleted, valueType.boolean),
			description: dfInfoObj.description,
			ownerId: dfInfoObj.ownerId
		};
		var df = new DataDirAndFile();
		df.init(obj);
		return df;
	}	
}