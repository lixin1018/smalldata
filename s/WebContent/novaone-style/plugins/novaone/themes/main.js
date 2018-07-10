$(document).ready(function(){
	
	//获取传递过来的url参数
	var requestParameters = cmnPcr.getQueryStringArgs();
	
	
	initMenu({
		containerId:"menuContainerId",
		requestParameters:requestParameters
	});	
	initContent({
		containerId:"contentContainerId",
		requestParameters:requestParameters
	});	
	initHeader({
		containerId:"headerContainerId",
		requestParameters:requestParameters
	});	
	initLogout({
		logoutId: "logoutBtnId"
	});
});

function initMenu(p){  
	//设置样式
	$(".layout-panel-west").css({"border-right-color":"#45A4DA"});
	$(".panel-header").css({"background-image":"url('"+baseImages+"/login/menuheader.png')",
		"background-repeat":"repeat-x",
		"color":"#ffffff",
		"border-color":"#188AC6"});   
	$(".panel-header .panel-title").css({"color":"#ffffff"});  
	$(".panel-header .panel-icon").css({"width":"17px", "height":"17px"});
	  
	try{
		 serverAccess.request({
			 serviceName:"userNcpService",
			 funcName:"getMenu",
		     args:{requestParam:cmnPcr.jsonToStr({})}, 
			 successFunc:function(obj){
				 initMenuItems(obj.result.menuItems);
				 runMenuItemByRequestParameter(p, obj.result.menuItems);
			 },
			 failFunc:function(obj){
				 msgBox.alert({title:"提示",info:obj.message});
			 },
			 waitingBarParentId:p.containerId
		 });
	}catch(e){
	    alert(e.message);
	}
	
	var runMenuItemByRequestParameter = function(p, menuItems){
		if(p.requestParameters != null){
			if(p.requestParameters["optype"] == "menuitem"){
				var opkey = p.requestParameters["opkey"];
				if(opkey != null){
					for(var i=0;i<menuItems.length;i++){
						var menuItem = menuItems[i];
						if(runMenuItem(opkey, menuItem)){
							return;
						}
					}
				}
				msgBox.alert({info:"无效的opkey, 请联系管理员确认是否有此菜单功能权限"});
			}
		}
	}
	
	//根据菜单项ID运行菜单功能
	var runMenuItem = function(itemId, menuItem){
		if(menuItem.id == itemId){
			if(menuItem.attributes != undefined && menuItem.attributes.actionexp != undefined){
				iocClient.execExp(menuItem.attributes.actionexp);
			}
			else{
				msgBox.alert({info:"无效的opkey, 所指定菜单功能只是菜单目录"});
			}
			return true;
		}
		else{
			var childMenuItems = menuItem.children;
			if(childMenuItems!=null){
				for(var i=0;i<childMenuItems.length;i++){
					if(runMenuItem(itemId, childMenuItems[i])){
						return true;
					} 
				}
			}
			return false;
		}
	}
	
	var initMenuItems = function(menuItems){
		$("#" + p.containerId).accordion({
			animate:false,
			fit:true,
			border:false,
			onSelect:function(title,index){
				var menuItem = menuItems[index];
				if(!menuItem.hasInit){
					var divId = p.containerId + "_" + index;
					setTimeout(function(){
						$("#" + divId).tree({
							data:menuItem.children,
							//单击打开菜单，放弃onDblClick
							onClick:function(node){
								//执行菜单项表达式
								if(node.attributes != undefined && node.attributes.actionexp != undefined){
									iocClient.execExp(node.attributes.actionexp);
								}
							},
							onLoadSuccess:function(node, data){
								//设置每个菜单项的图标
								var setNodeIcon = function(nodeData){
									var nodeObj = $("#" + divId).find("div[node-id='"+nodeData.id+"']")[0];
									var icon = nodeData.attributes.icon;
									if(icon != undefined){
										$(nodeObj).children(".tree-icon").css({
											backgroundImage:"url('"+baseImages+"/menu/"+icon+".png')",
											backgroundPositionX:"0px",
											backgroundPositionY:"0px"}); 
									}
									
									if(nodeData.children != null){
										for(var i=0;i<nodeData.children.length;i++){
											setNodeIcon(nodeData.children[i]);
										}
									}
								}
								if(data!=null){ 
									for(var i=0;i<data.length;i++){
										setNodeIcon(data[i]);
									}
								}
							}
						});
						
						
					},10);
					menuItem.hasInit = true;
				}
			}
		});
		
		for(var i=0;i<menuItems.length;i++){
			var menuItem = menuItems[i];
			var divId = p.containerId + "_" + i;
			var treeContainerHtml = "<div id=\""+divId+"\" style=\"width:100%;height:100%;\"></div>";
			$("#" + p.containerId).accordion("add", {title:menuItem.text, 
				content:treeContainerHtml, 
				selected: (i == 0),
				iconCls:"icon-" + menuItem.attributes.icon});  
		} 

		//设置样式 
		$("#menuContainerId .panel-icon").css({"left":"15px",
			   "width":"17px",
			   "height":"17px"});
		$("#menuContainerId .panel-with-icon").css({"padding-left":"32px",
			"font-weight":"normal"}); 
		$("#menuContainerId .accordion-header").css({"background-image":"url('"+baseImages+"/menuitemheader.png')",
			"background-repeat":"repeat-x",
			"color":"#075587",
			"border-color":"#B9DDEC"});
		$("#menuContainerId .panel-tool").css({"display":"none"});
	}
}

function initContent(p){
	//alert(p.containerId);
	$("#" + p.containerId).tabs({ 
		border:false, 
		plain:true,
		fit:true,
		onSelect:function(title){ 
		}
	});  

	iocClient.addEntity("mainPageTab", {		
		//判断tab是否存在
		exist : function(id){
			var allTabs = $("#" + p.containerId).tabs("tabs");
			for(var i=0;i<allTabs.length;i++){
				if($(allTabs[i]).attr("id") == id){
					return true;
				}
			}
			return false;
		},
		
		//选中此tab
		select:function(id){
			var allTabs = $("#" + p.containerId).tabs("tabs");
			for(var i=0;i<allTabs.length;i++){
				if($(allTabs[i]).attr("id") == id){
					var index = $("#" + p.containerId).tabs("getTabIndex", allTabs[i]);
					$("#" + p.containerId).tabs("select", index);
				}
			} 
		},
		
		//显示tab
		showContent:function(id, name, content, closable){
			if(this.exist(id)){
				this.select(id);
			}
			else{
				$("#" + p.containerId).tabs("add",{ 
					id:id,
					title:name, 
					content:content,
					closable: closable == undefined ? true : closable 
				});	
				var tab = $("#" + p.containerId).tabs('getSelected');
				$(tab).attr("id", id);
			}
		},
		
		//显示嵌入页面的tab
		showPage:function(id, name, url, closable){
			if(this.exist(id)){
				this.select(id);
			}
			else{
				var iframeId = cmnPcr.getRandomValue();
				var innerHtml = "<div style=\"width:100%;height:100%;overflow:hidden;\"><iframe id=\"" + iframeId + "\" style=\"width:100%;height:100%;border:0px;\" frameborder=\"0\" /></div>";
				$("#" + p.containerId).tabs("add",{ 
					id:id,
					title:name, 
					content:innerHtml,
					closable: closable == undefined ? true : closable 
				});
				//if(url.indexOf(".dhtml") != -1){
				//	url = basePath+"/"+url;
				//}else{
				//	url = basePath+"/page/"+url;
				//}
				//alert(url);
				$("#" + iframeId).attr("src", url);
				var tab = $("#" + p.containerId).tabs('getSelected');
				$(tab).attr("id", id);
			}
		}
	});
	
	iocClient.mainPageTab().showPage("mainPage","主页","mainPage.jsp",false);
	
	
	iocClient.addEntity("workflowProcessor", {		
		//打开创建流程实例的窗口
		showCreateInstancePage : function(id){
			return true;
		}
	});
	
	
}

function initHeader(p){
	 serverAccess.request({
		 serviceName:"userNcpService",
		 funcName:"getSysParam",
	     args:{requestParam:cmnPcr.jsonToStr({})}, 
		 successFunc:function(obj){
			 $("#"+p.containerId).html("您好，" + decodeURIComponent(obj.result.username) + ", 欢迎使用本系统");
		 },
		 failFunc:function(obj){
			 msgBox.alert({title:"提示",info:obj.message});
		 },
		 waitingBarParentId:p.containerId
	 });
}

function initLogout(p){
	$("#" + p.logoutId).click(function(){
		if(msgBox.confirm({info: "确定退出吗?"})){
			serverAccess.request({
				serviceName:"userNcpService",
				funcName:"logout",
			    args:{requestParam:cmnPcr.jsonToStr({})}, 
				successFunc:function(obj){ 
				},
				waitingBarParentId:p.containerId
			});
			location.href = basePath+"/page/sys/login.jsp";
		}
	});
	 
}