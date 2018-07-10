function DataDirAndFileLayout(){ 
	var that = this;
	
	//默认按照名称排序
	this.sortFieldName = dataDirAndFileOrderByFieldName.name;
	this.sortDirection = dataDirAndFileOrderByDirection.asc;
	
	this.parentDivId = null;
	this.selectDirDivId = null;
	this.selectFileDivId = null;
	this.selectFileTypeDivId = null;
	this.selectUserDivId = null;
	this.sendFileDivId = null;
	
	this.dataDir = null;
	
	this.show = function(p){
		var dirId = p.dirId;
		this.selectDirDivId = p.selectDirDivId;
		this.selectFileDivId = p.selectFileDivId;
		this.selectFileTypeDivId = p.selectFileTypeDivId;
		this.selectUserDivId = p.selectUserDivId;
		this.sendFileDivId = p.sendFileDivId;
		this.parentDivId = p.parentDivId;
		this.bindEvent();
		this.getChildrenOnServer(dirId, true, true);
	}
	
	this.bindEvent = function(){
		$( "#" + this.parentDivId).find("a[name='createDir']").click(function(){
			that.createDir();
		});
		
		$( "#" + this.parentDivId).find("a[name='createFile']").click(function(){
			that.createFile();
		});
		
		$( "#" + this.parentDivId).find("a[name='rename']").click(function(){
			that.rename();
		});
		
		$( "#" + this.parentDivId).find("a[name='delete']").click(function(){
			that.deleteItem();
		});
		
		$( "#" + this.parentDivId).find("a[name='copyTo']").click(function(){
			that.copyTo();
		});
		
		$( "#" + this.parentDivId).find("a[name='moveTo']").click(function(){
			that.moveTo();
		});
		
		$( "#" + this.parentDivId).find("a[name='sendFile']").click(function(){
			that.sendFile();
		});
		
		$( "#" + this.parentDivId).find("input[name='selectAllCheckbox']").click(function(){
			var selected = $(this).is(":checked");
			that.selectAllItems(selected, false); 
		}); 
				
		$( "#" + this.parentDivId).find("div[name='columnTitle']").click(function(){
			var sortElements = $(this).find("span[name='listSort']");
			if(sortElements.length > 0){
				var sortElement = sortElements[0];				
				var sortField = $(sortElement).attr("sortField");
				var sortDisable = $(sortElement).hasClass("listSortDisable");
				if(sortDisable){
					switch(sortField){
						case dataDirAndFileOrderByFieldName.modifyTime:
						case dataDirAndFileOrderByFieldName.createTime:
							that.refreshDFListSort(sortField, dataDirAndFileOrderByDirection.desc);
							break;
						case dataDirAndFileOrderByFieldName.name:
						default:
							that.refreshDFListSort(sortField, dataDirAndFileOrderByDirection.asc);
							break;
					}
				}
				else{
					var sortAsc = $(sortElement).hasClass("listSortAsc");
					if(sortAsc){
						that.refreshDFListSort(sortField, dataDirAndFileOrderByDirection.desc);				
					}
					else{
						that.refreshDFListSort(sortField, dataDirAndFileOrderByDirection.asc);		
					}
				}
			}
		});
	}
	
	//按照指定的字段和顺序进行排序
	this.refreshDFListSort = function(fieldName, sortDirection){	
		var allSortElements = $( "#" + this.parentDivId).find("span[name='listSort']");
		for(var i = 0; i < allSortElements.length; i++){
			var sortElement = allSortElements[i];
			var sortField = $(sortElement).attr("sortField");
			if(fieldName == sortField){
				if($(sortElement).hasClass("listSortDisable")){
					$(sortElement).removeClass("listSortDisable");
					if(sortDirection == dataDirAndFileOrderByDirection.asc){
						$(sortElement).addClass("listSortAsc");
					}
					else{
						$(sortElement).addClass("listSortDesc");
					}
				}
				else{
					if(sortDirection == dataDirAndFileOrderByDirection.asc){
						$(sortElement).removeClass("listSortDesc");
						$(sortElement).addClass("listSortAsc");
					}
					else{
						$(sortElement).removeClass("listSortAsc");
						$(sortElement).addClass("listSortDesc");
					}
				}
			}
			else{
				$(sortElement).removeClass("listSortAsc");
				$(sortElement).removeClass("listSortDesc");
				$(sortElement).addClass("listSortDisable");
			}			
		}
	
		this.sortFieldName = fieldName;
		this.sortDirection = sortDirection;
		
		this.showPathElements();
		this.showChildElements();
	}
	
	this.dirSelectWindow = null;
	this.getDirSelectWindow = function(){
		if(this.dirSelectWindow == null){
			this.dirSelectWindow= new DirSelectWindow();
		}	
		return this.dirSelectWindow;
	}
	
	this.copyTo = function(){
		var selectedItemIds = this.getSelectedItemIds();
		if(selectedItemIds.length == 0){
			msgBox.alert({info: "请选中复制项."});
		}
		else{
			var hasDir = false;
			for(var i = 0; i < selectedItemIds.length; i++){
				var dfObj = this.dataDir.getDF(selectedItemIds[i]);
				if(dfObj.isDir){
					hasDir = true;
					break;
				}
			}
			if(hasDir){
				msgBox.alert({info: "不能复制文件夹, 尚未支持此功能."});
			}
			else{
				var dirSelectWindow = this.getDirSelectWindow();
				dirSelectWindow.show({
					contentDivId: this.selectDirDivId,
					title: "请选择复制到的文件夹",
					afterOkFunction: function(p){
						var toDirId = p.dirId; 
						that.copyToOnServer(that.dataDir.id, toDirId, selectedItemIds)
					}
				});
			}
		}
	}
	
	this.moveTo = function(){
		var selectedItemIds = this.getSelectedItemIds();
		if(selectedItemIds.length == 0){
			msgBox.alert({info: "请选中复制项."});
		}
		else{
			var dirSelectWindow = this.getDirSelectWindow();
			dirSelectWindow.show({
				contentDivId: this.selectDirDivId,
				title: "请选择移动到的文件夹",
				afterOkFunction: function(p){
					var toDirId = p.dirId; 
					that.moveToOnServer(that.dataDir.id, toDirId, selectedItemIds)
				}
			});
		}
	}
	
	this.createDir = function(){
		msgBox.htmlWindow({
			title: "新建文件夹",
			text: "新建文件夹",
			label: "请输入文件夹名称",
			type: "oneInputText",
			okFunction: function(p){
				var text = p.text;
				var closeInputNameWindowFunc = p.closeWin;
				that.createDirOnServer(text, "dir", that.dataDir.id, closeInputNameWindowFunc);
			} 	
		});
	}
	
	this.createFile = function(){
		this.selectFiltType({
			afterOkFunction: function(p){
				var fileName = p.fileName;
				var fileType = p.fileType; 
				var closeWindowFunc = p.closeWin;
				that.createFileOnServer(fileName, fileType, that.dataDir.id, closeWindowFunc);
			} 	
		});
	}
	 
	this.createDirOnServer = function(name, fileType, parentId, closeInputNameWindowFunc){
		var requestParam = {
			name: encodeURIComponent(name), 
			fileType: fileType, 
			parentId: parentId
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"createDir", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){	
				var dirJsonOnServer = obj.result.dirJson;
				var dirObj = that.getDFInfoByServerBackInfo(dirJsonOnServer);
				that.afterCreateDirOnServer(dirObj);
				closeInputNameWindowFunc();
			},
			failFunc: function(obj){
				that.failCreateDirOnServer(obj);
			}
		}); 
	}
	
	this.afterCreateDirOnServer = function(dirObj){
		this.dataDir.add(dirObj);
		this.addDirAndFileShowItem(dirObj, true);		
	}
	
	this.failCreateDirOnServer = function(resultObj){
		//提示创建文件夹失败
		msgBox.alert( {
			title : "创建文件夹失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
	//在界面中显示文件夹或文件
	this.addDirAndFileShowItem = function(dfObj, focusIt){
		//在此处添加刷新界面的代码，如果focusIt，那么选中此行
		var childElementHtml = this.createChildElementHtml(dfObj); 
		var index = this.dataDir.getIndex(dfObj, this.sortDirection, this.sortFieldName);
		var dfItemElements = $("#" + this.parentDivId).find("div[name='dirAndFileList']").children("div[name='itemLine']");
		if(dfItemElements.length == 0){
			$( "#" + this.parentDivId).find("div[name='dirAndFileList']").html(childElementHtml);
		}
		else{
			if(index == 0){ 
				$(dfItemElements[0]).before(childElementHtml); 
			}
			else{
				$(dfItemElements[index - 1]).after(childElementHtml); 
			}
		}
		
		this.bindDFItemEvent();
		
		that.selectAllItems(false, false);
		that.selectItem(dfObj.id, true, true); 
	}
	
	//绑定点击事件
	this.bindDFItemEvent = function(){		
		$("#" + this.parentDivId).find(".itemLineDiv").unbind("click");
		$("#" + this.parentDivId).find(".itemLineDiv").click(function(e){
			if($(e.srcElement).attr("name") != "selectItemCheckbox"
				&& $(e.srcElement).attr("name") != "itemSelectDiv"){
				var did = $(this).attr("did");
				that.selectAllItems(false, false);
				that.selectItem(did, true, true); 
			} 
		});
		
		$("#" + this.parentDivId).find(".itemLineDiv").unbind("dblclick");
		$("#" + this.parentDivId).find(".itemLineDiv").dblclick(function(e){ 
			var did = $(this).attr("did");
			var dfObj = that.dataDir.getDF(did);
			if(dfObj.isDir){
				location.href = "mydir.jsp?did=" + did; 
			}
		});
		
		$("#" + this.parentDivId).find(".itemLineDiv").find("div[name='itemSelectDiv']").unbind("click");
		$("#" + this.parentDivId).find(".itemLineDiv").find("div[name='itemSelectDiv']").click(function(e){
			if($(e.srcElement).attr("name") == "itemSelectDiv"){
				var did = $(this).parent().attr("did");
				var selected = $(this).parent().hasClass("itemLineSelected");
				that.selectItem(did, !selected, true);
			} 
		});
		
		$("#" + this.parentDivId).find(".itemLineDiv").find("input[name='selectItemCheckbox']").unbind("change");
		$("#" + this.parentDivId).find(".itemLineDiv").find("input[name='selectItemCheckbox']").change(function(e){
			var did = $(this).attr("did");
			var selected = $(this).parent().parent().hasClass("itemLineSelected");
			that.selectItem(did, !selected, true);
			return false;
		});
	}
	
	//在界面中刷新显示文件夹或文件
	this.refreshDirAndFileShowItem = function(dfObj){
		//在此处添加刷新界面的代码
		var nameHtml = cmnPcr.html_encode(dfObj.name);
		var descriptionHtml = cmnPcr.html_encode(dfObj.description);
		var lastModifyTimeHtml = cmnPcr.objectToStr(dfObj.lastModifyTime, valueType.time);
		var createTimeHtml = cmnPcr.objectToStr(dfObj.createTime, valueType.time);
		var fileTypeHtml = cmnPcr.html_encode(dfObj.fileType);
		var fileSizeHtml = dfObj.isDir ? "" : dfObj.fileSize;
		var itemLineElement = $("#" + this.parentDivId).find(".itemLineDiv[did='" + dfObj.id + "']")[0];
		$(itemLineElement).find(".itemNameDiv").find("a[name='nameLink']").html(nameHtml);
		$(itemLineElement).find(".itemLastModifyTimeDiv").html(lastModifyTimeHtml);
		$(itemLineElement).find(".itemCreateTimeDiv").html(createTimeHtml);
		$(itemLineElement).find(".itemFileTypeDiv").html(fileTypeHtml);
		$(itemLineElement).find(".itemFileSizeDiv").html(fileSizeHtml);
		$(itemLineElement).find(".itemDescriptionDiv").html(descriptionHtml); 
	}
	
	//在界面中删除文件夹或文件
	this.deleteDirAndFileItem = function(dfObj){
		//在此处添加刷新界面的代码
		$("#" + this.parentDivId).find(".itemLineDiv[did='" + dfObj.id + "']").remove();
	}
	
	this.createFileOnServer = function(name, fileType, parentId, closeWindowFunc){
		var requestParam = {
			name: encodeURIComponent(name), 
			parentId: parentId,
			fileType: fileType
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"createFile", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj){	
				var fileJsonOnServer = obj.result.fileJson;
				var fileObj = that.getDFInfoByServerBackInfo(fileJsonOnServer);
				that.afterCreateFileOnServer(fileObj);
				closeWindowFunc();
			},
			failFunc: function(obj){
				that.failCreateFileOnServer(obj);
			}
		}); 
	}
	
	this.afterCreateFileOnServer = function(fileObj){
		this.dataDir.add(fileObj);
		this.addDirAndFileShowItem(fileObj, true);		
		
		//关闭新文件名称录入窗口
	} 
	
	this.failCreateFileOnServer = function(resultObj){
		//提示创建文件失败
		msgBox.alert( {
			title : "创建文件失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
	this.moveToOnServer = function(fromParentId, toParentId, fileAndDirIdArray){
		var requestParam = {
			fromParentId: fromParentId, 
			toParentId: toParentId,
			fileAndDirIdArray: fileAndDirIdArray,
			autoRename: "Y"
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"moveTo", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var allMovedDirAndFiles = obj.result.allMovedDirAndFiles;
				for(var i = 0; i < allMovedDirAndFiles.length; i++){
					var movedDirAndFile =  allMovedDirAndFiles[i];
					movedDirAndFile.name = decodeURIComponent(movedDirAndFile.name);
					if(movedDirAndFile.newName != null){
						movedDirAndFile.newName = decodeURIComponent(movedDirAndFile.newName);
					}
				}
				that.afterMoveToOnServer(toParentId, allMovedDirAndFiles);
				that.dirSelectWindow.close();
			},
			failFunc: function(obj){
				that.failMoveToOnServer(obj);
			}
		}); 
	}
	this.afterMoveToOnServer = function(toParentId, allMovedDirAndFiles){
		var alertInfoString = "移动文件（夹）成功，共移动了 " + allMovedDirAndFiles.length + " 项.";
		var renameString = "";
		
		for(var i = 0; i < allMovedDirAndFiles.length; i++){
			var movedDirAndFile =  allMovedDirAndFiles[i];
			var dfObj = this.dataDir.getDF(movedDirAndFile.id);
			this.deleteDirAndFileItem(dfObj);		
			if(movedDirAndFile.newName != null){
				renameString += ("\r  因目标文件夹中存在重名项, '" + movedDirAndFile.name + "' 名称变更为 '" + movedDirAndFile.newName + "'.");
			}
		}
		
		alertInfoString = alertInfoString + (renameString.length == 0 ? "" : ("\r说明:" + renameString));
		
		//询问用户是否跳转到转移到的文件夹，并显示移动的结果信息，关闭移动至的文件夹选择窗口
		msgBox.alert({info: alertInfoString});
		
	} 
	
	this.failMoveToOnServer = function(resultObj){
		//提示移动失败
		msgBox.alert( {
			title : "移动文件（夹）失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
	
	this.copyToOnServer = function(fromParentId, toParentId, fileIdArray){
		var requestParam = {
			fromParentId: fromParentId, 
			toParentId: toParentId,
			fileIdArray: fileIdArray,
			autoRename: "Y"
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"copyTo", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				var allNewFiles = obj.result.allNewFiles;
				for(var i = 0; i < allNewFiles.length; i++){
					var newFile =  allNewFiles[i];
					newFile.name = decodeURIComponent(newFile.name);
					if(newFile.newName != null){
						newFile.newName = decodeURIComponent(newFile.newName);
					}
				}
				that.afterCopyToOnServer(toParentId, allNewFiles);
				that.dirSelectWindow.close();
			},
			failFunc: function(obj){
				that.failCopyToOnServer(obj);
			}
		}); 
	}
	
	this.afterCopyToOnServer = function(toParentId, allNewFiles){
		var alertInfoString = "复制文件成功，共复制了 " + allNewFiles.length + " 项.";
		var renameString = "";
		
		for(var i = 0; i < allNewFiles.length; i++){
			var newFile =  allNewFiles[i];
			if(newFile.newName != null){
				renameString += ("\r  因目标文件夹中存在重名项, '" + newFile.name + "' 名称变更为 '" + newFile.newName + "'.");
			}
		}
		
		alertInfoString = alertInfoString + (renameString.length == 0 ? "" : ("\r说明:" + renameString));
		
		//询问用户是否跳转到复制到的文件夹（如果是当前文件夹，就不用再询问了），并显示复制的结果信息，关闭选择复制至的文件夹窗口
		msgBox.alert({info: alertInfoString});
	}
	
	this.failCopyToOnServer = function(resultObj){
		//提示复制失败
		msgBox.alert( {
			title : "复制文件失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
	this.deleteItem = function(){
		var selectedItemIds = this.getSelectedItemIds();
		if(selectedItemIds.length == 0){
			msgBox.alert({
				info: "请选中文件或文件夹"
			});
		} 
		else{		 
			if(msgBox.confirm({info: "确定要删除选中项吗? 提示:选中了 " + selectedItemIds.length + " 项."})){
				var dirId = this.dataDir.id;
				this.deleteOnServer(dirId, selectedItemIds);
			}
		}
	}
	
	this.deleteOnServer = function(parentId, fileAndDirIdArray){
		var requestParam = {
			parentId: parentId,
			fileAndDirIdArray: fileAndDirIdArray
		};	
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"delete", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc:function(obj){
				that.afterDeleteOnServer(fileAndDirIdArray);
			},
			failFunc: function(obj){
				that.failDeleteOnServer(obj);
			}
		}); 
	}
	
	this.afterDeleteOnServer = function(fileAndDirIdArray){
		var alertInfoString = "删除文件成功，共删除了 " + fileAndDirIdArray.length + " 项."; 
		for(var i = 0; i < fileAndDirIdArray.length; i++){
			var did =  fileAndDirIdArray[i];
			var dfObj = this.dataDir.getDF(did);
			this.deleteDirAndFileItem(dfObj); 
		}  
	}
	
	this.failDeleteOnServer = function(resultObj){
		//提示删除失败
		msgBox.alert( {
			title : "删除文件失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	} 
	
	this.rename = function(){
		var selectedItemIds = this.getSelectedItemIds();
		if(selectedItemIds.length == 0){
			msgBox.alert({
				info: "请选中一个文件或文件夹"
			});
		}
		else if(selectedItemIds.length > 1){
			msgBox.alert({
				info: "只能选中一个文件或文件夹"
			});
		}
		else{		
			var dfObj = this.dataDir.getDF(selectedItemIds[0]);
			var dirId = this.dataDir.id;
			msgBox.htmlWindow({
				title: "重命名",
				text: dfObj.name,
				label: "请输入文件名称",
				type: "oneInputText",
				okFunction: function(p){
					var text = p.text;
					var closeInputNameWindowFunc = p.closeWin;
					that.renameOnServer(dirId, dfObj.id, text, closeInputNameWindowFunc);
				} 	
			});
		}
	}
	
	this.renameOnServer = function(parentId, id, newName, closeInputNameWindowFunc){
		var requestParam = {
			parentId: parentId, 
			id: id, 
			newName: encodeURIComponent(newName) 
		};	
		
		//提交重命名，如果重命名成功，那么关闭重命名窗口，如果失败则提示之
		serverAccess.request({
			waitingBarParentId: that.parentDivId,
			serviceName:"dataFileNcpService", 
			funcName:"rename", 
			args:{requestParam: cmnPcr.jsonToStr(requestParam)}, 
			successFunc: function(obj){
				that.afterRenameOnServer(id, newName);
				closeInputNameWindowFunc();
			},
			failFunc: function(obj){
				that.failRenameOnServer(obj);
			}
		}); 
	}
	
	this.afterRenameOnServer = function(id, newName){
		var dfObj = this.dataDir.getDF(id);
		dfObj.name = newName;
		this.refreshDirAndFileShowItem(dfObj, true); 
	}
	
	this.failRenameOnServer = function(resultObj){
		//提示重命名失败
		msgBox.alert( {
			title : "重命名失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
	}
	
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
		var childNum = this.dataDir.getChildNum();
		$( "#" + this.parentDivId).find("div[name='dirSummaryInfo']").text("[共" + childNum + "项]"); 
		
		this.refreshDFListSort(this.sortFieldName, this.sortDirection);
	}
	
	this.showChildElements = function(){
		$( "#" + this.parentDivId).find("div[name='dirAndFileList']").children(".itemLineDiv").remove();
		
		var childrenDirAndFiles = this.dataDir.getSortedObjects(this.sortDirection, this.sortFieldName)
		var allChildElementHtml = ""; 
		for(var i = 0; i < childrenDirAndFiles.length; i++){
			var dfObj = childrenDirAndFiles[i];
			allChildElementHtml += this.createChildElementHtml(dfObj); 
		}
		$( "#" + this.parentDivId).find("div[name='dirAndFileList']").html(allChildElementHtml);
				
		this.bindDFItemEvent();
	}
	
	//获取选中项
	this.getSelectedItemIds = function(){
		var items = $("#" + this.parentDivId).find(".itemLineDiv");
		var selectedItemIds = new Array();
		for(var i = 0; i < items.length; i++){
			var item = items[i];
			if($(item).hasClass("itemLineSelected")){
				var did = $(item).attr("did");
				selectedItemIds.push(did);
			} 
		}		
		return selectedItemIds;
	}
	
	//选中此项
	this.selectAllItems = function(selected, checkAllSelected){
		var items = $("#" + this.parentDivId).find(".itemLineDiv");
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
		var items = $("#" + this.parentDivId).find(".itemLineDiv");
		for(var i = 0; i < items.length; i++){
			if(!$(items[i]).hasClass("itemLineSelected")){
				allSelected = false;
				break;
			}
		}
		
		$( "#" + this.parentDivId).find("input[name='selectAllCheckbox']").attr("checked", allSelected);		
	}
	
	//选中此项
	this.selectItem = function(did, selected, checkAllSelected){
		var items = $("#" + this.parentDivId).find(".itemLineDiv[did='" + did + "']");
		if(items.length > 0){
			var item = items[0]; 
			if(selected){
				$(item).addClass("itemLineSelected"); 
				$(item).find("input[name='selectItemCheckbox']").attr("checked", true);
			}
			else{
				$(item).removeClass("itemLineSelected"); 
				$(item).find("input[name='selectItemCheckbox']").attr("checked", false);
			}	
			if(checkAllSelected){
				this.checkAllItemSelected();
			}
		}
	}
	
	//创建文件夹内元素
	this.createChildElementHtml = function(dfObj){
		var nameTitle = cmnPcr.replace(dfObj.name, "\"", "'");
		var nameHtml = cmnPcr.html_encode(dfObj.name);
		var descriptionHtml = cmnPcr.html_encode(dfObj.description);
		var lastModifyTimeHtml = cmnPcr.objectToStr(dfObj.lastModifyTime, valueType.time);
		var createTimeHtml = cmnPcr.objectToStr(dfObj.createTime, valueType.time);
		var fileTypeHtml = cmnPcr.html_encode(dfObj.fileType);
		var fileSizeHtml = dfObj.isDir ? "" : dfObj.fileSize;
		//如果是文件夹那么使用dir打开，如果exeType不为空，那么用exeType打开，如果exeType为空，那么让用户下载
		var linkUrl = dfObj.isDir ? ("mydocument.jsp?did=" + dfObj.id) : ("fe/" + dfObj.exeType + "/" + dfObj.exeType + ".jsp?did=" + dfObj.id);
		var childElementHtml = "<div class=\"itemLineDiv\" name=\"itemLine\" did=\"" + dfObj.id + "\">"
			+ "<div class=\"itemSelectDiv\" name=\"itemSelectDiv\"><input type=\"checkbox\" did=\"" + dfObj.id + "\" name=\"selectItemCheckbox\" /></div>"
			+ "<div class=\"itemIconDiv\"><img src=\"img/fileType/" + dfObj.fileType + ".png\" /></div>"
			+ "<div class=\"itemNameDiv\"><span>名称:&nbsp;</span><a name=\"nameLink\" href=\""+ linkUrl +"\" target=\"" + (dfObj.isDir ? "_self" : "_blank") + "\" title=\"" + nameTitle + "\">" + nameHtml + "</a></div>"
			+ "<div class=\"itemLastModifyTimeDiv\"><span>修改时间:&nbsp;</span>" + lastModifyTimeHtml + "</div>"
			+ "<div class=\"itemCreateTimeDiv\"><span>创建时间:&nbsp;</span>" + createTimeHtml + "</div>"
			+ "<div class=\"itemFileTypeDiv\"><span>类型:&nbsp;</span>" + fileTypeHtml + "</div>"
			+ "<div class=\"itemFileSizeDiv\"><span>大小:&nbsp;</span>" + fileSizeHtml + "</div>"
			+ "<div class=\"itemDescriptionDiv\"><span>描述:&nbsp;</span>" + descriptionHtml + "</div>"
			+ "</div>"; 
		return childElementHtml;
	}
	
	this.showPathElements = function(){
		var pathInfos = this.dataDir.pathInfos;
		var fullPathElementHtml = "<span style=\"position:relative;height:30px;width:30px;\">&nbsp;&nbsp;&nbsp;&nbsp;<img src=\"img/dir.png\" style=\"position:absolute;left:0px;top:1px;width:16px;height:16px;\" /></span>";
		for(var i = 0; i < pathInfos.length; i++){
			var pathInfo = pathInfos[i];
			fullPathElementHtml += this.createPathSplitElementHtml();
			var dirName = pathInfo.isSys ? this.getSysDirName(pathInfo.name) : pathInfo.name;
			fullPathElementHtml += this.createPathPartElementHtml(pathInfo.id, dirName); 
		}
		$( "#" + this.parentDivId).find("div[name='dirPathInfo']").html(fullPathElementHtml);
	}
	
	this.getSysDirName = function(pathInfoName){
		switch(pathInfoName){
			case "myDocument":
				return "我的文件";
			case "myApplication":
				return "我的应用";
			default:
				return pathInfoName;
		}
	}
	
	//创建路径元素
	this.createPathPartElementHtml = function(id, name){
		var nameHtml = cmnPcr.html_encode(name);
		var html = "<span name=\"pathPart\" did=\"" + id + "\" class=\"pathPart\"><a href=\"mydocument.jsp?did=" + (id == null ? "" : id) +"\" target=\"_self\">" + nameHtml + "</a></span>"
		return html;
	}
	this.createPathSplitElementHtml = function(){ 
		var html = "&nbsp;<span>&gt;</span>&nbsp;"
		return html;
	} 
	
	this.failGetChildrenOnServer = function(resultObj){
		//打开文件夹失败
		msgBox.alert( {
			title : "获取文件夹信息失败",
			info : resultObj.message + "(code:" + resultObj.code + ")"
		});
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
			exeType: dfInfoObj.exeType,
			description: dfInfoObj.description,
			ownerId: dfInfoObj.ownerId,
			exeType: dfInfoObj.exeType
		};
		var df = new DataDirAndFile();
		df.init(obj);
		return df;
	}	
		
	this.fileSendWindow = null;
	this.getFileSendWindow = function(){
		if(this.fileSendWindow == null){
			this.fileSendWindow= new FileSendWindow();
		}	
		return this.fileSendWindow;
	}	
	
	this.sendFile = function(){
		//发送文件到某些人
		var selectedItemIds = this.getSelectedItemIds();
		if(selectedItemIds.length == 0){
			msgBox.alert({info: "请选中文件."});
		}
		else{
			var fileInfos = new Array();
			var hasDir = false;
			for(var i = 0; i < selectedItemIds.length; i++){
				var dfObj = this.dataDir.getDF(selectedItemIds[i]);
				if(dfObj.isDir){
					hasDir = true;
					break;
				}
				fileInfos.push(dfObj);
			}
			if(hasDir){
				msgBox.alert({info: "不能发送文件夹, 尚未支持此功能."});
			}
			else{
				var fileSendWindow = this.getFileSendWindow();
				fileSendWindow.show({
					contentDivId: this.sendFileDivId,
					title: "发送文件给其他人",
					fileInfos: fileInfos,
					showFileSelectWindowFunc: this.selectFiles,
					showUserSelectWindowFunc: this.selectUsers
				});
			}
		}
	}
	
	this.fileSelectWindow = null;
	this.getFileSelectWindow = function(){
		if(this.fileSelectWindow == null){
			this.fileSelectWindow= new FileSelectWindow();
		}	
		return this.fileSelectWindow;
	}
	
	this.selectFiles = function(p){
		var fileSelectWindow = that.getFileSelectWindow();
		fileSelectWindow.show({
			contentDivId: that.selectFileDivId,
			title: "请选择文件",
			afterOkFunction: p.afterOkFunction
		});
	}
	
	this.userSelectWindow = null;
	this.getUserSelectWindow = function(){
		if(this.userSelectWindow == null){
			this.userSelectWindow= new UserSelectWindow();
		}	
		return this.userSelectWindow;
	}
	
	this.selectUsers = function(p){
		var userSelectWindow = that.getUserSelectWindow();
		userSelectWindow.show({
			contentDivId: that.selectUserDivId,
			title: "请选择接收人",
			afterOkFunction: p.afterOkFunction
		});
	}
	
	this.fileTypeSelectWindow = null;
	this.getFileTypeSelectWindow = function(){
		if(this.fileTypeSelectWindow == null){
			this.fileTypeSelectWindow= new FileTypeSelectWindow();
		}	
		return this.fileTypeSelectWindow;
	}
	
	this.selectFiltType = function(p){
		var fileTypeSelectWindow = that.getFileTypeSelectWindow();
		fileTypeSelectWindow.show({
			contentDivId: that.selectFileTypeDivId,
			title: "请选择文件类型",
			afterOkFunction: p.afterOkFunction
		});
	}
}