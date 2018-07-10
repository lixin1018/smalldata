//某个文件夹所有文件夹或文件
function DataDir(){ 

	this.id = null;
	
	this.pathInfos = null;
	
	this.childDirAndFiles = new Object();
	
	this.getDF = function(dfId){
		return this.childDirAndFiles[dfId];
	}
	
	this.getChildNum = function(){
		var count = 0;
		for(var k in this.childDirAndFiles){
			count++;
		}
		return count;
	}
	
	//初始化
	this.init = function(p){
		this.id = p.pathInfos[p.pathInfos.length - 1].id;
		this.pathInfos = p.pathInfos;
		this.childDirAndFiles = p.childDirAndFiles;
	}
	
	//获取父文件夹信息
	this.getParentInfo = function(){
		if(this.pathInfos.length > 1){
			var parentInfo = this.pathInfos[this.pathInfos.length - 2];
			return parentInfo;
		}
		else{
			return null;
		}
	}
	
	//获取元素的排序位置
	this.getIndex = function(dfObj, ascOrDesc, orderByFieldName){
		var sortedObjects = this.getSortedObjects(ascOrDesc, orderByFieldName);
		for(var i = 0; i < sortedObjects.length; i++){
			if(sortedObjects[i] == dfObj){
				return i;
			}
		}
		return -1;
	}
	
	//在本地数据层增加一个文件夹或文件
	this.add = function(dfObj){
		this.childDirAndFiles[dfObj.id] = dfObj;
	}
	
	//在本地数据层删除一个文件夹或文件
	this.remove = function(dfId){
		delete this.childDirAndFiles[dfId];
	}
	
	//排序
	this.getSortedObjects= function(ascOrDesc, orderByFieldName){
		var unSortedObjects = new Array();
		for(var id in this.childDirAndFiles){
			unSortedObjects.push(this.childDirAndFiles[id]);			
		}		
		switch(orderByFieldName){
			case dataDirAndFileOrderByFieldName.createTime:
				return ascOrDesc == dataDirAndFileOrderByDirection.asc ? unSortedObjects.sort(this.compareAscByCreateTime) : unSortedObjects.sort(this.compareDescByCreateTime);
			case dataDirAndFileOrderByFieldName.modifyTime:
				return ascOrDesc == dataDirAndFileOrderByDirection.asc ? unSortedObjects.sort(this.compareAscByModifyTime) : unSortedObjects.sort(this.compareDescByModifyTime);
			case dataDirAndFileOrderByFieldName.name:
			default:
				return ascOrDesc == dataDirAndFileOrderByDirection.asc ? unSortedObjects.sort(this.compareAscByName) : unSortedObjects.sort(this.compareDescByName);
		}
	}
	
	//排序比较方法，按名称升序
	this.compareAscByName = function(dfObjA, dfObjB){
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.name > dfObjB.name) {
		        return 1;
		    } 
		    else if (dfObjA.name < dfObjB.name) {
		        return -1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? -1 : 1;
		}
	}
	
	//排序比较方法，按名称降序
	this.compareDescByName = function(dfObjA, dfObjB){		
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.name > dfObjB.name) {
		        return -1;
		    } 
		    else if (dfObjA.name < dfObjB.name) {
		        return 1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? 1 : -1;
		}
	}
	
	//排序比较方法，按创建时间升序
	this.compareAscByCreateTime = function(dfObjA, dfObjB){
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.createTime > dfObjB.createTime) {
		        return 1;
		    } 
		    else if (dfObjA.createTime < dfObjB.createTime) {
		        return -1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? -1 : 1;
		}
	}
	
	//排序比较方法，按创建时间降序
	this.compareDescByCreateTime = function(dfObjA, dfObjB){
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.createTime > dfObjB.createTime) {
		        return -1;
		    } 
		    else if (dfObjA.createTime < dfObjB.createTime) {
		        return 1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? 1 : -1;
		}
	}
	
	//排序比较方法，按修改时间升序
	this.compareAscByModifyTime = function(dfObjA, dfObjB){
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.lastModifyTime > dfObjB.lastModifyTime) {
		        return 1;
		    } 
		    else if (dfObjA.lastModifyTime < dfObjB.lastModifyTime) {
		        return -1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? -1 : 1;
		}
	}
	
	//排序比较方法，按修改时间降序
	this.compareDescByModifyTime = function(dfObjA, dfObjB){
		if((dfObjA.isDir && dfObjB.isDir ) || (!dfObjA.isDir && !dfObjB.isDir )){			 
			if (dfObjA.lastModifyTime > dfObjB.lastModifyTime) {
		        return -1;
		    } 
		    else if (dfObjA.lastModifyTime < dfObjB.lastModifyTime) {
		        return 1;
		    } 
		    else {
		        return 0;
		    }
		}
		else{
			return dfObjA.isDir ? 1 : -1;
		}
	}
}

//文件夹或文件
function DataDirAndFile(){	
	this.id = null;
	this.name = null;
	this.isDir = null;
	this.isSys = null;
	this.fileType = null;
	this.fileSize = null;
	this.createTime = null;
	this.lastModifyTime = null;
	this.createUserId = null;
	this.modifyUserId = null;
	this.description = null;
	this.parentId = null;
	this.isDeleted = null;
	this.description = null;
	this.ownerId = null;
	this.exeType = null;
	
	//初始化构造一个
	this.init = function(p){
		this.id = p.id;
		this.name = p.name;
		this.isDir = p.isDir;
		this.isSys = p.isSys;
		this.fileType = p.fileType;
		this.fileSize = p.fileSize;
		this.createTime = p.createTime;
		this.lastModifyTime = p.lastModifyTime;
		this.createUserId = p.createUserId;
		this.modifyUserId = p.modifyUserId;
		this.description = p.description;
		this.parentId = p.parentId;
		this.isDeleted = p.isDeleted;
		this.description = p.description;
		this.ownerId = p.ownerId;
		this.exeType = p.exeType;
	}
}