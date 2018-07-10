
var isIE = function(ver){
    var b = document.createElement('b')
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
    return b.getElementsByTagName('i').length === 1
}

// show a time string according total seconds
function toTimeString(seconds){
    s=seconds;
    m=0;
    h=0;
	if(s>59){
		m=Math.floor(s/60);
		s=s-m*60
	}
	if(m>59){
		h=Math.floor(m/60);
		m=m-h*60
	}
	if(s<10){
		s="0"+s;
	}
	if(m<10){
		m="0"+m;
	}
	return '' + h + ':' + m + ':' + s;
}

// Div 居中
function centerDiv(obj){
	if(typeof(obj) == 'string'){
		obj = document.getElementById(obj);
	}
	if(obj){
		obj.style.top = '50%';
		obj.style.left = '50%';
		try{
			obj.style.marginLeft = ( 0 - obj.scrollWidth / 2 + document.documentElement.scrollLeft) + 'px';
			obj.style.marginTop = ( 0 - obj.scrollHeight / 2 + document.documentElement.scrollTop) + 'px';
		}catch (e){}
		setTimeout("centerDiv('" + obj.id + "')", 100);
	}
}

// 根据标签获取物件
function getTag(obj, tagName, index){
	if(typeof(obj) == 'string'){
		obj = document.getElementById(obj);
	}
	var tags = obj.getElementsByTagName(tagName);
	if(index != null){
		return tags[index];
	}else{
		return tags;
	}
}

// 高亮物件
function highlight(obj, highlightClass){
	if(typeof(obj) == 'string'){
		obj = document.getElementById(obj);
	}
	if(highlightClass == null){
		highlightClass = 'highlight';
	}
	try{
		for(var i in obj.parentNode.childNodes){
			if(obj.parentNode.childNodes[i].className != null){
				var re = new RegExp("[ ]*" + highlightClass);
				obj.parentNode.childNodes[i].className = obj.parentNode.childNodes[i].className.replace(re, '');
			}
		}
		obj.className += ' ' + highlightClass;
	}catch(e){}
}

/**
* 封装不同浏览器下javascript的差异，提供统一的接口；扩展javascript语言底层提供的接口，让它提供更多更为易用的接口
*
**/
var G = {};
G.namespace = function(str){
	var arr = str.split("."),o = G;
	for(i = (arr[0] == "G") ? 1 : 0; i <arr.length; i++){
		o[arr[i]] = o[arr[i]] || {};
		o = o[arr[i]];
	}
}

/**
 * 全局变量声明
 * G.Public.constants.tip_windows_control
 * G.Public.CON_NOTY
 * @param {Object} node
 * @return {TypeName} 
 */
G.namespace("Public");
G.Public = {
	CON_EASYUI : 'easyui',//jquery easyui组件
	CON_NOTY : 'noty'	//jquery noty组件
};
G.Public.constants = {
	tip_windows_control : (isIE(6)||isIE(7)||isIE(8))?G.Public.CON_EASYUI:G.Public.CON_NOTY;
}

/**
 * 提示信息组件封装
 */
G.namespace("Msg");
/**=============
 * noty组件公共接口
 * type:	information,alert,error,warning,success
 * layout:	top,topCenter,topLeft,topRight,centerRight,centerLeft,center,bottom,bottomCenter,bottomLeft,bottomRight
 * 带按钮的对话框使用说明：
 * 1) 编写参数
 * 		var parm = {
 * 			type:'success',//弹出窗口类型
 * 			layout:'center',//弹出窗口位置
 *			modal:true,//遮罩
 *			buttons:false,//是否在弹出的窗口中增加按钮
 *			btnType:0,//按钮，默认0，表示只弹出对话框，没有按钮;1表示需要一个确定按钮2表示需要一个取消按钮3表示两个按钮都需要
 *			onCloseCallback:null,//窗口关闭时调用的回调函数
 *			btnOKCallback:null,// 按确定按钮后的回调函数
 *			btnCancelCallback:null// 按取消按钮后的回调函数
 * 		}
 * 2) 方法调用
 * 		G.Msg.notyAPI('消息内容', parm)
 * =============**/
G.Msg.notyAPI = function(message, params){
	this.options = {
		type 				: 'success',//弹出窗口类型
		layout 				: 'center',//弹出窗口位置
		modal 				: true,//遮罩
		buttons 			: false,//是否在弹出的窗口中增加按钮
		btnType 			: 0,//按钮，默认0，表示只弹出对话框，没有按钮;1表示需要一个确定按钮2表示需要一个取消按钮3表示两个按钮都需要
		onCloseCallback 	: null,
		btnOKCallback 		: null,// 按确定按钮后的回调函数
		btnCancelCallback 	: null// 按取消按钮后的回调函数
	}

	if(params != null || params != "undefined"){
		this.options = $.extend({},this.options,params);
	}
	
	var okBackFunc = this.options.btnOKCallback;
	var cancelBackFunc = this.options.btnCancelCallback;
	
	var btnOK = {
		addClass: 'btn btn-primary', text: '确定', onClick: function ($noty) {
                    if ( okBackFunc != null )	{
						okBackFunc();
					}
                    $noty.close();//close
                }
	};
	var btnCancel = {
		addClass: 'btn btn-danger', text: '取消', onClick: function ($noty) {
                    if ( cancelBackFunc != null )	{
						cancelBackFunc();
					}
                    $noty.close();//close
                }
	};
	var tempBtn;
	if(this.options.btnType == 1){//表示需要一个确定按钮
		tempBtn = [btnOK];
	}else if(this.options.btnType == 2){//表示需要一个取消按钮
		tempBtn = [btnCancel];
	}else if(this.options.btnType == 3){//3表示两个按钮都需要
		tempBtn = [btnOK,btnCancel];
	}else{
		tempBtn = false;
	}
	this.options.buttons = tempBtn;
	var apiobj = this;
	
	var msgOpen = noty({
            text        : message == null ?'Do you want to continue?' : message,
            type        : this.options.type,//information,alert,error,warning,success
            dismissQueue: true,
            layout      : this.options.layout,//
            theme       : 'defaultTheme',
		    modal		: this.options.modal,
		    closeWith: ['click'],// ['click', 'button', 'hover']
		    callback: {
		        onClose: function() {
		        	if ( apiobj.options.onCloseCallback != null )	{
						apiobj.options.onCloseCallback();
					}
		        }
            },
            buttons     : this.options.buttons
        });
	
}

//=============
//弹出警告窗口
//=============
G.Msg.showWarning = function(message,callbackFunc,title){
	//jquery easyui组件
	if(G.Public.constants.tip_windows_control == G.Public.CON_EASYUI){
		if(title == null){
			title = G.Pro.title;
		}
		$.messager.alert(title,message,'warning',function(){
			if ( callbackFunc != null )	{
				callbackFunc();
			}
		});
	}else if(G.Public.constants.tip_windows_control == G.Public.CON_NOTY){//jquery noty组件
		G.Msg.notyAPI(message, {type:'warning',onCloseCallback:callbackFunc});
		/**noty({
            text        : message,
            type        : 'warning',
            dismissQueue: true,
            layout      : 'center',
            modal: true,
            closeWith: ['click'],
            theme       : 'defaultTheme',
            callback: {
		        onClose: function() {
		        	if ( callbackFunc != null )	{
						callbackFunc();
					}
		        }
            }
        });**/
	}
}


//=============
//弹出操作成功窗口
//=============
G.Msg.showSuccess = function(message, callbackFunc){
	//jquery easyui组件
	if(G.Public.constants.tip_windows_control == G.Public.CON_EASYUI){
		$.messager.alert(G.Pro.title, message,'info',function(){
			if ( callbackFunc != null )	{
				callbackFunc();
			}
		});
	}else if(G.Public.constants.tip_windows_control == G.Public.CON_NOTY){//jquery noty组件
		G.Msg.notyAPI(message, {type:'information',onCloseCallback:callbackFunc});
	}
}

//=============
//弹出操作失败窗口
//=============
G.Msg.showError = function(message, callbackFunc){
	//jquery easyui组件
	if(G.Public.constants.tip_windows_control == G.Public.CON_EASYUI){
		$.messager.alert(G.Pro.title,message,'error',function(){
			if ( callbackFunc != null )	{
				callbackFunc();
			}
		});
	}else if(G.Public.constants.tip_windows_control == G.Public.CON_NOTY){//jquery noty组件
		G.Msg.notyAPI(message, {type:'error',onCloseCallback:callbackFunc});
	}
}


//=============
//弹出确认操作窗口
//=============
G.Msg.showConfirm = function(message, callbackFunc, type){
	message = null==message?"确定要删除吗？":message;
	type = null==type?"information":type;
	//jquery easyui组件
	if(G.Public.constants.tip_windows_control == G.Public.CON_EASYUI){
		$.messager.confirm(G.Pro.title,message,function(f){
			if ( callbackFunc != null )	{
				callbackFunc(f);
			}
		});
	}else if(G.Public.constants.tip_windows_control == G.Public.CON_NOTY){//jquery noty组件
		G.Msg.notyAPI(message, {type : type, btnType : 3, btnOKCallback : callbackFunc});
	}
}


/**
 * DOM相关
 * 操作DOM，包括获取DOM节点和设置DOM属性
 * 
 */
G.namespace("Dom");

//==============
//获取当前节点的下一个兄弟节点
//==============
G.Dom.getNextNode = function(node){
	node=typeof node=="string" ? document.getElementById(node) : node;
	var nextNode = node.nextSibling;
	if(!nextNode) return null;
	if(!document.all){
		while(true){
			if(nextNode.nodeType == 1){
				break;
			}else{
				if(nextNode.nextSibling){
					nextNode = nextNode.nextSibling;
				}else{
					break;
				}
			}
		}
	}
	return nextNode;
}

//==========
//设置元素的透明度
//==========
G.Dom.setOpacity = function(node, level){
	node=typeof node== "string" ? document.getElementById(node) : node;
	if(document.all){
		node.style.filter = 'alpha(opacity=' + level +')';
	}else{
		node.style.opacity = level/100;
	}
}

//==============
//根据元素的id获取元素对象
//==============
G.Dom.get = function(object){
	object = typeof object == "string" ? document.getElementById(object) : object;
	return object;
}

//==============
//根据class名称获得表单对象集合
//该函数接收三个参数，第一个是必选的，后两个可选
//第一个参数是class名；第二个参数是父容器，缺省为body节点；第三个参数为dom节点的标签名。
//==============
G.Dom.getElementsByClassName = function (str, root, tag){
	if(root){
		root = typeof root == "string" ? document.getElementById(root) : root;
	}else{
		root = document.body;
	}
	tag = tag || "*";
	var els = root.getElementsByTagName(tag),arr=[];
	for(var i = 0,n = els.length; i < n; i++){
		for(var j = 0,k = els[i].className.split(" "),l = k.length; j < l; j++){
			if(k[j] == str){
				arr.push(els[i]);
				break;
			}
		}
	}
		
	return arr;
}
//================
//禁用提交按钮
//================
G.Dom.disabledButton = function(btnId){
	$("#"+btnId).attr("disabled","true");
	var text = $("#"+btnId).html();
	//如果没有发现font
	if(text.indexOf("font") == '-1'){
		$("#"+btnId).html("<font color='#ACA899'>" + text+ "</font>");
	}else{
		$("#"+btnId+" font").css({"color":"#ACA899"});
	}
}

//================
//启用提交按钮
//================
G.Dom.enabledButton = function(btnId){
	$("#"+btnId).removeAttr("disabled");
	$("#"+btnId+" font").css({"color":"#003399"});
}


//=================
//根据id显示或者隐藏
//=================
G.Dom.hiddenById = function(id, displayFlag){
	$("#"+id).css("display",displayFlag);
}

/**
 * Event相关
 * 用来操作事件，包括访问event对象的属性和设置事件监听。
 * 
 */
G.namespace("Event");

//==============
//获取event对象的target属性
//==============
G.Event.getEventTarget = function (e){
	e = window.event || e;
	return e.srcElement || e.target;
}

G.Event.stopPropagation = function(e){
	e = window.event || e;
	if(document.all){
		e.cancelBubble = true;
	}else{
		e.stopPropagation();
	}
}

G.Event.on = function(node,eventType,handler){
	node=typeof node== "string" ? document.getElementById(node) : node;
	if(document.all){
		node.attachEvent("on"+eventType,handler);
	}else{
		node.addEventListener(eventType,handler,false);
	}
}

/**
 * Lang相关
 * 用来模仿其他语言提供原生javascript不提供的函数
 * 
 */
G.namespace("Lang");

//==============
//去除字符串首尾空格
//==============
G.Lang.trim = function (s){
	//return s.replace(/^\s+|\s+$/,"");
	return s.replace(/^\s+|\s+$/,"").replace(/\s+$/, "");
}

//==============
//判断是否是数字
//==============
G.Lang.isNumber = function (s){
	return !isNaN(s);
}

//==============
//判断是否是字符串
//==============
G.Lang.isString = function (s){
	return typeof s === "string";
}

//==============
//判断是否是boolean型
//==============
G.Lang.isBoolean = function (s){
	return typeof s === "boolean";
}

//==============
//判断是否是函数
//==============
G.Lang.isFunction = function (s){
	return typeof s === "function";
}

//==============
//判断是否是null
//==============
G.Lang.isNull = function (s){
	return typeof s === null;
}

//==============
//判断是否是undefined
//==============
G.Lang.isUndefined = function (s){
	return typeof s === "undefined";
}

//==============
//判断是否是空
//==============
G.Lang.isEmpty = function (s){
	return /^\s*$/.test(s);
}

//==============
//判断是否是数组
//==============
G.Lang.isArray = function (s){
	return s instanceof Array;
}

//==============
//查找数组是否包含指定的字符串
//==============
G.Lang.arrayFindString = function(arr, string) {
	var str = arr.join("");
    return str.indexOf(string);
}

//================
//类的继承
//================
G.Lang.extend = function (subClass, superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	subClass.superClass = superClass.prototype;
	if(superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
}

//==================
//用于js类对象属性付值
//==================
G.Lang.setProperty = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
}

/**
 * 用于在处理过程中显示遮罩类
 **/
G.namespace("Mask");
var gzIndex = 999;
G.Mask = {
	maskId:"mask",
	maskIndex:999,
	lastHTMLStyle:null,
	
	//===========
	//显示遮罩层
	//===========
	show : function () {
		var bWidth = "0";
		var bHeight = "0";
		var pageSize = this.getPageSize();
		if("Netscape" ==navigator.appName){//火狐
			bWidth =  window.innerWidth - 5;
			bHeight = pageSize[1]- 5;
		}else{
			bWidth =  document.body.clientWidth;
			bHeight = pageSize[1];
		}
		this.maskIndex ++;
		var maskName = this.maskId + this.maskIndex;
		var mask = document.getElementById ( maskName );
		if ( mask ) {
			mask.parentNode.removeChild ( mask );
		}
		var objBody = document.getElementsByTagName('body').item(0);
		mask = document.createElement ( 'div' );
		mask.id = maskName;
		mask.className = this.maskId;
		mask.style.width = bWidth + 'px';
		mask.style.height = bHeight + 'px';
		mask.style.zIndex = gzIndex ++;
		var maskFrame = document.createElement ( 'iframe' );
		maskFrame.id = maskName + '_frame';
		maskFrame.className = this.maskId;
		maskFrame.style.width = bWidth+ 'px';
		maskFrame.style.height = bHeight + 'px';
		maskFrame.style.zIndex = gzIndex ++;
		objBody.appendChild ( maskFrame );
		objBody.appendChild ( mask );
		var objHTML = document.getElementsByTagName('html').item(0);
		if ( this.lastHTMLStyle == null ) this.lastHTMLStyle = objHTML.style.overflow;
	},
	
	//===========
	//关闭遮罩层
	//===========
	hide : function (){
		var maskFrame = document.getElementById ( this.maskId + this.maskIndex + '_frame' );
		if ( maskFrame ){
			try	{
				maskFrame.parentNode.removeChild ( maskFrame );
				gzIndex --;
			}catch(e){}
		}
		var mask = document.getElementById ( this.maskId + this.maskIndex );
		if ( mask )	{
			var objHTML = document.getElementsByTagName('html').item(0);
			mask.parentNode.removeChild ( mask );
			this.maskIndex --;
			gzIndex --;
			if ( this.maskIndex == 0 ){
				objHTML.style.overflow = this.lastHTMLStyle;
			}
		}
	},
	//===============
	//获取页面实际大小
	//由js调用，无需另行调用 
	//===============
	getPageSize : function(){ 
		var xScroll,yScroll; 
		if (window.innerHeight && window.scrollMaxY){ 
			xScroll = document.body.scrollWidth; 
			yScroll = window.innerHeight + window.scrollMaxY; 
		} else if (document.body.scrollHeight > document.body.offsetHeight){ 
			sScroll = document.body.scrollWidth; 
			yScroll = document.body.scrollHeight; 
		} else { 
			xScroll = document.body.offsetWidth; 
			yScroll = document.body.offsetHeight; 
		} 
		var windowWidth,windowHeight;
		if (self.innerHeight) { 
			windowWidth = self.innerWidth; 
			windowHeight = self.innerHeight; 
		} else if (document.documentElement &&  document.documentElement.clientHeight) { 
			windowWidth = document.documentElement.clientWidth; 
			windowHeight = document.documentElement.clientHeight; 
		} else if (document.body) { 
			windowWidth = document.body.clientWidth; 
			windowHeight = document.body.clientHeight; 
		} 
		var pageWidth,pageHeight 
		if(yScroll < windowHeight){ 
			pageHeight = windowHeight; 
		} else { 
			pageHeight = yScroll; 
		} 
		if(xScroll < windowWidth) { 
			pageWidth = windowWidth; 
		} else { 
			pageWidth = xScroll; 
		} 
		arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
		return arrayPageSize; 
	}
}

/**
 * 浏览器属性封装
 * 
 */
G.namespace("Brower");
G.Brower = {
	//================
	//判断当前浏览器类型
	//================
	isBrowser:function(){
		if (navigator.userAgent.indexOf("MSIE") != -1){
			return true;  
		}
        else if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Mozilla") != -1){
        	return false;
        }
		return false;
	},
	//========================
	//判断是否需要设置浏览器
	//type=0表示验证用户ca证书的上传 type=1表示验证批量导入
	//========================
	configBrowser:function(text){
		if(!this.isBrowser()){
			try {  
	            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect"); 
	            return true;
	        } catch(e) {  
				buffer.del();
				buffer.append('为了正常使用上传功能，请按照以下设置：<br>');
				buffer.append('1、地址栏输入 "about:config"<br>');
				buffer.append('2、右键 新建 -> 布尔值<br>');
				buffer.append('3、输入"signed.applets.codebase_principal_support"(忽略引号)<br>');
				buffer.append('4、点击"确定"，即可完成浏览器的设置。<br>');
				buffer.append('5、重新点击"'+text+'"，在出现的安全对话框中，点"是"即可。');
	        	G.Msg.showSuccess(buffer.toString());
	        	return false;
	        } 
		}
		return true;
	},
    getFilePath: function (fileBrowser) {
        if (navigator.userAgent.indexOf("MSIE") != -1){fileBrowser.select(); return document.selection.createRange().text;  }
        else if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Mozilla") != -1) return this.getFilePathWithFF(fileBrowser);  
        else alert("Not IE or Firefox (userAgent=" + navigator.userAgent + ")");  
    },  
    getFilePathWithFF: function (fileBrowser) {  
        try {  
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
        } catch(e) {}  
        var fileName = $("#"+fileBrowser).val();  
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);  
        try {  
            file.initWithPath(fileName.replace(/\//g, "\\\\"));  
        } catch(e) {  
            if (e.result != Components.results.NS_ERROR_FILE_UNRECOGNIZED_PATH) throw e;  
            alert("File '" + fileName + "' cannot be loaded: relative paths are not allowed. Please provide an absolute path to this file.");  
            return;  
        }
        return file.path;  
    }
}


/**
* 提供可复用的组件，和页面内的具体功能没有直接关系
*
**/

/**
 * 封装cookie组件
* @param	name  	cookie名称
* @param	value 	cookie值
* @param	expires 时间戳
 */
G.namespace("Cookie");
G.Cookie = {
	//读取
	getCookie : function(name){
		cookie_name = name + "=";
		cookie_length = document.cookie.length;
		cookie_begin = 0;
		while(cookie_begin < cookie_length){
			value_begin = cookie_begin + cookie_name.length;
			if(document.cookie.substring(cookie_begin, value_begin) == cookie_name){
				var value_end = document.cookie.indexOf ( ";", value_begin);
				if(value_end == -1){
					value_end = cookie_length;
				}
				return unescape(document.cookie.substring(value_begin, value_end));
			}
			cookie_begin = document.cookie.indexOf( " ", cookie_begin) + 1;
			if(cookie_begin == 0){
				break;
			}
		}
		return null;
	},
	//设置
	setCookie : function(name, value){
		expires = new Date();
		expires.setTime(expires.getTime() + (1000 * 86400 * 365));
		document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() +  "; path=/";
	},
	//删除
	delCookie : function(name){
		var expireNow = new Date();
		document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" +  "; path=/";
	}
}

/**
 * ajax加载页面
 * 
 * @param {Object} loadUrl
 * @param {Object} targetObj
 * @param {Object} queryString
 * @memberOf {TypeName} 
 */
G.namespace("Loader");
G.Loader = {
	//载入 loadUrl 页面内容到 targetObj 物件
	loadPage : function(loadUrl, targetObj, queryString) {
		if ( G.Lang.isString(targetObj)) {
			targetObj = document.getElementById ( targetObj );
		}
		if ( queryString == null ) queryString = '';
		
		this.get( loadUrl, targetObj, queryString );
	},
	//动态加载js文件
	loadScript : function(filename, idName, data){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = filename + '.js?version=3.0.1&'+data;
		script.id = idName ==null?"mis_load_JavaScript":idName;
		document.getElementsByTagName("head")[0].appendChild(script);	
	},
	//获得采用加载js方式取得传入的参数
	getJSArgs : function(idName){
		idName = null == idName?"mis_load_JavaScript":idName;
		var sc = $("#"+idName).attr("src");
		var paramsArr=sc.split('?')[1].split('&');
		var args={},argsStr=[],param,t,name,value;
		for(var ii=0,len=paramsArr.length;ii<len;ii++){
				param=paramsArr[ii].split('=');
				name=param[0],value=param[1];
				if(typeof args[name]=="undefined"){ //参数尚不存在
					args[name]=value;
				}else if(typeof args[name]=="string"){ //参数已经存在则保存为数组
					args[name]=[args[name]]
					args[name].push(value);
				}else{  //已经是数组的
					args[name].push(value);
				}
		}
		return  args;	
	},
	//post方式请求
	post : function(loadUrl, targetObj, queryString, callbackFunc){
		this.load ( 'POST', loadUrl, targetObj, queryString, callbackFunc );
	},
	//get方式请求
	get : function(loadUrl, targetObj, queryString, callbackFunc){
		this.load ( 'GET', loadUrl, targetObj, queryString, callbackFunc );
	},
	//执行ajax请求,由js调用，无需另行调用
	load:function(method, loadUrl, targetObj, queryString, callbackFunc){
		if(typeof(hideddrivetip) == 'function'){//清除tip提示
			hideddrivetip();
		}
		//if(!process.processing){
		//	process.start();
		//}
		if(!G.Process.processing){
			G.Process.start();
		}
		var obj;
		if ( typeof ( targetObj ) == 'string' ) {
			obj = document.getElementById ( targetObj );
		}
		else {
			obj = targetObj;
		}

		if ( callbackFunc == null )	{
			callbackFunc = ajaxCallback;
		}

		if ( queryString == null ) queryString = '';

		var clsAjax = new Ajax ( G.Pro.base+ loadUrl, queryString, callbackFunc, targetObj );

		if ( method.toLowerCase () == 'post' ) {
			clsAjax.post ();
		}
		else {
			clsAjax.get ();
		}
		if(G.Process.processing){
			G.Process.finish();
		}
	},
	// 获取错误信息
	getError:function (string) {
		var errorFlag = '<ERROR>';
		if ( string.substring(0, errorFlag.length) == errorFlag ) {
			return string.substring ( errorFlag.length, string.length );
		}
		else {
			return false;
		}
	},
	// 在指定对象显示信息
	showHTML:function(msg, objName) {
		var obj;
		if (typeof(objName) == 'string') {
			obj = document.getElementById(objName);
		}
		else {
			obj = objName;
		}
	//alert(msg);
		if (obj) {
			//setInnerHTML(obj,msg);
			obj.innerHTML = msg;	
			try	{
				obj.scrollTop = 0;
			}catch(e){}
		}
		else {
			G.Dialog.showDialogBox(msg, objName);
		}
		// 解析 Script
		//var re = /<script[^>]*>([^\x00]+)<\/script>/
		//var re = /<script[^>]*>([^\x00]+)$/i;
		var re = /<script[^>]*>([^\x00]+)$/i;
	
		var strScript = msg.split("<\/script>"); 
		//alert(strScript);
		for (var i in strScript)
		{
			//匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
			var blocks; 
			if (blocks = strScript[i].match(re)) 
			{
				//清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作 
				var code = blocks[1].replace(/<!--/, ''); 
				try 
				{ 
					eval(code) //执行脚本 
				}catch(e){} 
			}
		}
	}
	
}

/**
 * 封装ajax组件
 * 方法：post('请求的URL', '查询的参数，要提交至后台的各个参数，如：userVo.id:23', '回调函数，后台返回后要执行的js','ajax数据返回方式(text  json  xml) 默认：text','是否异步(默认false)')
 * 		get(get方式提交)
 * 		submit('form表单ID', 'form提交的URL', '提交前的js验证', '提交后service层返回的处理');//form提交
 * 		verifyRepetition('验证重名的输入框id', '点击提交的按钮id' ,'验证重名的输入框的中文名称', 'action请求地址', '返回信息的id','需要url传入的参数','验证输入的内容格式类别');//验证重名
 * 
 * @param   loadUrl 		请求的地址
 * @param   targetObj 		载入 loadUrl 页面内容到 targetObj 物件
 * @param   queryString 	需要url传入的参数
 * @param   callbackFunc 	回调函数
 * @param   dataType 		ajax数据返回方式(text  json  xml  html script jsonp) 默认：text
 * @param   isAsync         同步还是异步(false true)  默认：同步false
 * @param   method          是post方式还是get方式
 */
G.namespace("Ajax");
G.Ajax = {
	//post方式请求
	post : function(loadUrl, queryString, callbackFunc, dataType,isAsync){
		this.load("POST", loadUrl, queryString, callbackFunc, dataType,isAsync);
	},
	//get方式请求
	get : function( loadUrl, queryString, callbackFunc){
		//this.load("GET", loadUrl, queryString, callbackFunc, dataType,isAsync);
		if (queryString == null) queryString = {};
		$.get(G.Pro.base+ loadUrl, queryString,
			function(data) {
				//返回结果
				if ( callbackFunc != null )	{
					callbackFunc(data)
				}
			});
	},
	//表单提交
	submit : function(formId, loadUrl, checkFunc, callbackFunc, queryString){
		this.form(formId,'submit', loadUrl, checkFunc, callbackFunc, queryString);
	},
	//Validform提交    checkFunc 传入自定义optionType类型，可以是正则，也可以是函数
	/**
	 * Validform的form提交
	 * 
	 * G.Ajax.validsubmit(formId, loadUrl, datatype, callbackFunc);
	 * 在页面尾部增加如下代码即可
	 * <script type="text/javascript">
	 *		$(function(){
	 *			G.Ajax.validsubmit("form ID", "action URL", null, function(data){//处理代码});
	 *		})
	 * </script>
	 * 
	 * @param {Object} formId form ID
	 * @param {Object} loadUrl action提交URL
	 * @param {Object} optionType 传入自定义datatype类型，可以是正则，也可以是函数
	 * @param {Object} callbackFunc form提交成功后的回调函数
	 * @param {Object} aboutparam  提交之前的处理
	 */
	validsubmit : function(formId, loadUrl, optionType, callbackFunc, aboutparam){
		//使用方法：{tiptype : 5}或{tiptype : 6}
		var _cutom = {
			/**
			 * 自定义弹出框提示:侧边提示会在当前元素的父级的next对象的子级查找显示提示信息的对象，表单以ajax提交时不会弹出自定义提示框显示表单提交状态
			 * 自定义提示:此场景应用在文本框与提示在一行的两个列中，且使用ajax提交且往数据库提交时，不需要弹出进度窗口，故使用此自定义
			 * @param {Object} msg：提示信息;
			 * @param {Object} o:{obj:*,type:*,curform:*}, obj指向的是当前验证的表单元素（或表单对象），
			 * 			type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, 
			 * 			curform为当前form对象;
			 * @param {Object} cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
			 */
			_5:function(msg, o, cssctl){
				if(!o.obj.is("form")){
					//查找当前文本框的平行<td>对象下是否有class="Validform_checktip"对象
					var objtip = o.obj.parent().next().find(".Validform_checktip");
					if(objtip.length==0){
						//如果没有，则动态添加
						o.obj.parent().next().append("<span class='Validform_checktip' />");
						o.obj.siblings(".Validform_checktip").remove();
						objtip = o.obj.parent().next().find(".Validform_checktip");
					}
					cssctl(objtip,o.type);
					objtip.text(msg);
				}
			},
			//自定义弹出框提示:侧边提示(会在当前元素的父级的next对象下查找显示提示信息的对象
			_6:function(msg, o, cssctl){
				if(!o.obj.is("form")){
					//查找当前文本框的平行<td>对象下是否有class="Validform_checktip"对象
					var objtip=o.obj.siblings(".Validform_checktip");
					if(objtip.length==0){
						//如果没有，则动态添加
						o.obj.parent().append("<span class='Validform_checktip' />");
						o.obj.parent().next().find(".Validform_checktip").remove();
						objtip = o.obj.siblings(".Validform_checktip");
					}
					cssctl(objtip,o.type);
					objtip.text(msg);
				}
			}
		};
		var formName = formId == null ? "nsform" : formId;
		var options = {
			tiptype : 4,//可用的值有：1、2、3、4和function函数
			postonce : true,//默认为false，指定是否开启二次提交防御，true开启，不指定则默认关闭
			ajaxPost:true,//是否ajax提交
			datatype : {"zh1-6":/^[\u4E00-\u9FA5\uf900-\ufa2d]{1,6}$/},//自定义验证表达式
			swfupload:{},//外调插件:文件上传
			datepicker:{},//外调插件:密码强度检测
			passwordstrength:{},//外调插件:日期控件
			jqtransform:{//外调插件:表单美化
					selector:"select,input"
			}
	
		}
		if(optionType != null || optionType != "undefined"){
			options = $.extend({},options,optionType);
		}
		//alert(G.Pro.base+ loadUrl);
		//return;
		$('#'+formName).Validform({
			tiptype  : options.tiptype == 5 ? _cutom._5 : options.tiptype == 6 ?_cutom._6 : options.tiptype,
			postonce : options.postonce,//默认为false，指定是否开启二次提交防御，true开启，不指定则默认关闭
			datatype : options.datatype,
			ajaxPost : options.ajaxPost,
			usePlugin : {
				swfupload : options.swfupload,
				datepicker : options.datepicker,
				passwordstrength : options.passwordstrength,
				jqtransform : options.jqtransform
			},
			beforeSubmit:function(curform){
				if(!G.Process.processing){
					G.Process.start();
				}
				if ( aboutparam != null )	{
					if(!aboutparam(curform)){
						if(G.Process.processing){
							G.Process.finish();
						}
						return false;
					}
				}
				//alert($('#parentFunctionId').val());
			},
			callback:function(data){
				if(G.Process.processing){
					G.Process.finish();
				}
				if ( callbackFunc != null )	{
					callbackFunc(data)
				}
			}
		}).config({ url :G.Pro.base+ loadUrl});
	},
	//执行ajax请求,由js调用，无需另行调用
	load:function(method, loadUrl, queryString, callbackFunc, dataType,isAsync){
		if (queryString == null) queryString = {};
		if(dataType == null){
			dataType = "text";
		}
		if(isAsync == null){
			isAsync = false;
		}
		//alert("===="+G.Pro.base+ loadUrl);
		$.ajax( {
			type : method,
			url : G.Pro.base+ loadUrl,
			data : queryString,
			dataType : dataType,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			async :isAsync,
			success : function(data, textStatus) {//返回结果
				if ( callbackFunc != null )	{
					callbackFunc(data, textStatus)
				}
			}
		});
	},
	//表单form提交,由js调用，无需另行调用
	form:function(formId, method, loadUrl, checkFunc, callbackFunc, queryString){
		if (queryString == null) queryString = {};
		$('#'+formId).form(method, {
			url: G.Pro.base + loadUrl,
			data : queryString,
			onSubmit:function(){ 
//				if(!gels_formValidate($(this))){
//					G.Process.finish();
//					return false;
//				}
				if(checkFunc != null){
					if(!checkFunc()){
						return false;
					}
					return true;
				}
			},
		   	success:function(data){
				if ( callbackFunc != null )	{
					callbackFunc(data)
				}
		   	}
		});
	}
};	

/**
 * 浮动对话框操作类 组件封装
 * 显示提示窗口：G.Dialog.open('jsp页面');(外部调用)
 * 载入指定页面至当前浮动对话框：G.Dialog.load('jsp页面');(外部调用)
 * 提交表单至浮动对话框：G.Dialog.post('URL','form对象或form id名称');(外部调用)
 * 弹出div窗口：G.Dialog.window('div id名称', 'open或者close', '弹出窗口的限制属性');(外部调用)
 * 
 * 显示提示窗口:G.Dialog.showDialogBox('内容', 'div ID');(内部调用方法，外部一般不会用到)
 * 显示提示窗口屏幕居中:G.Dialog.centerDiv(div obj);(内部调用方法，外部一般不会用到)
 * 用于在处理过程完毕后移除对话框:G.Dialog.removeDialogBox();(内部调用方法，外部一般不会用到)
 */
G.namespace("Dialog");
G.Dialog = {
	id : "",
	isShow : "close",
	queryParams : {},
	dialogIndex : 0,
	dialogName : 'dialog',
	options:{
		modal: true, 
		//title:'Toolbar and Buttons',
		draggable:false, 
		maximizable:false,
		minimizable:false,
		collapsible:false,
		resizable:false
	},
	
	//弹出提示窗口
	open : function (loadUrl, dialogId) {
		if(!G.Lang.isUndefined(dialogId)){
			this.dialogName = dialogId;
		}
		G.Loader.get(loadUrl, this.dialogName + (++this.dialogIndex));
	},
	//基于easyui实现
	window : function(dialogId, isShow, option){
		if ( null != isShow && "undefined" != isShow && typeof ( isShow ) == 'string' ) {
			this.isShow = isShow;
		}
		G.Lang.setProperty(this.options, option || {});
		$('#'+dialogId).window(this.options).window(this.isShow);
	},
	// 载入至当前浮动对话框
	load : function (loadUrl) {
		var dialogName = this.dialogName + this.dialogIndex;
		G.Loader.get(loadUrl, dialogName);
	},
	// 提交表单至浮动对话框
	post : function ( loadUrl, form, callbackFunc )
	{
		if ( typeof ( form ) == 'string' )
		{
			form = document.getElementById ( form );
		}
		G.Loader.post ( loadUrl, this.dialogName + this.dialogIndex, form, callbackFunc);
	},
	// 关闭浮动对话框
	close : function ()
	{//alert(this.dialogName + ( this.dialogIndex ));
		var obj = document.getElementById( this.dialogName + ( this.dialogIndex ));

		if (!obj) {//防止error页面开空dialog
			this.dialogIndex--;
		}

		this.removeDialogBox ( this.dialogName + ( this.dialogIndex-- ) );
	},
	//================
	// 用于在处理过程中显示提示窗口
	// 由js调用，无需另行调用 
	//================
	showDialogBox : function(msg, objId) {
		var objClass = 'dialog_box';
		G.Mask.show ();
		if ( objId == null ){
			objId = objClass + G.Mask.maskIndex;
		}
		var msgBox = document.getElementById ( objId );
		if ( msgBox ){
			msgBox.parentNode.removeChild ( msgBox );
		}
		msgBox=document.createElement ( 'div' );
		msgBox.id = objId;
		msgBox.className = objClass;
		var objBody = document.getElementsByTagName('body').item(0);
		objBody.appendChild ( msgBox );
		msgBox.style.zIndex = gzIndex ++;
	
		msgBox.innerHTML = msg;
		this.centerDiv ( msgBox );
	},
	//=================
	// 用于在处理过程中显示的Div 居中
	// 由js调用，无需另行调用 
	//=================
	centerDiv : function (obj){
		if(G.Lang.isString(obj)){
			obj = document.getElementById(obj);
		}
		if (obj){
			obj.style.top = '50%';
			obj.style.left = '50%';
			try{
				obj.style.marginLeft = ( 0 - obj.scrollWidth / 2 + document.documentElement.scrollLeft) + 'px';
				obj.style.marginTop = ( 0 - obj.scrollHeight / 2 + document.documentElement.scrollTop) + 'px';
			}catch (e){}
			//setTimeout("this.centerDiv('" + obj.id + "')", 100);
		}
	},
	//==============
	// 用于在处理过程完毕后移除对话框
	// 由js调用，无需另行调用 
	//==============
	removeDialogBox : function (objName) {
		if (objName == null) {
			objName = 'dialog_box' + G.Mask.maskIndex;
		}
		G.Mask.hide ();
		var obj = document.getElementById(objName);
		if (obj) {
			obj.parentNode.removeChild(obj);
		}
		gzIndex --;
	}
}

/**
 * 处理过程提示框 组件封装
 * 实现程序加载时的等待窗口实现,
 * 开始等待:G.Process.start();
 * 关闭等待:G.Process.finish();
 */
G.namespace("Process");

G.Process={
	processing : false,
	chkTimeOut : null,
	timeOutSeconds : 3500,
	timeOutSort : null,
	callback : null,
	timeOutSortCallback : null,
	start : function (procMsg)	{
		if ( !this.processing ){
			if ( procMsg == null ) procMsg = '正在处理中, 请稍候...';
			var tipp = '';
			tipp += '<div class="gels-loading">';
			tipp += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="32" height="32">';
			tipp += '<param name="movie" value="'+G.Pro.base+'/sec-style/images/loading1.swf"><param name="quality" value="high" ><param name="wmode" value="transparent">';
			tipp += '<embed src="'+G.Pro.base+'/sec-style/images/loading1.swf" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="32" height="32" wmode="transparent" ></embed>';
			tipp += '</object></div>';
			G.Dialog.showDialogBox ( '<table border="0" cellspacing="0"><tr><td width="200" align="center" style="padding: 5px 0px 0px 3px;font-size: 12px;">'+tipp+'&nbsp;' + procMsg + '</td></tr><table>');
			this.processing = true;
			//alert(this.processing);
			this.chkTimeOut = setTimeout ( "this.timeOut()", (this.timeOutSort?this.timeOutSort:this.timeOutSeconds) * 1000 );
		}
	},
	// 处理完成
	finish : function (){
		if ( this.processing ){
			objContentBody = document.getElementById ( 'body' );
			G.Dialog.removeDialogBox();
			this.processing = false;
			clearTimeout ( this.chkTimeOut );
			if(this.callback != null){
				eval(this.callback);
			}
		}
	},
	timeOut : function (){
		this.finish();
		G.Msg.showWarning('网络连接超时，请重试！');
	}
}

/**
 * 日期组件封装
 */
G.namespace("Date");
G.Date = {
	day : 24 * 60 * 60 * 1000,
	month : this.day * 30,
	year : this.day * 365,

	//================
	//日期比较1(date1<date2则返回false)
	//================
	checkDate : function(date1, date2){
		//支持火狐
	    if (new Date(date1.replaceAll("-","/")) > new Date(date2.replaceAll("-","/"))){
	    	return true;
	    }
	    return false;
	},
	
	//================
	//判断指定日期是否超过9999年12月31日 23点59分59秒，如果大于这个时间则返回false
	//================
	isMaxDate : function(date1){
		return this.checkDate('9999-12-31 23:59:59', date1);
	},
	
	//=====================
	//判断传入的时间是否大于当前系统时间,大于当前时间返回true,否则返回false
	//=====================
	isBigNowTime : function(date1){
		var _n = Date.parse(new Date())
		var objDate = new Date(_n);
		var year = objDate.getFullYear().toString();
		var month = objDate.getMonth() + 1;
		month = month.toString ();
		var day = objDate.getDate().toString();
		var hours = objDate.getHours().toString();
		var minutes = objDate.getMinutes().toString();
		var seconds = objDate.getSeconds().toString();		
		//取出系统时间
		var _dateTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;		
		return this.checkDate(date1, _dateTime);
	},
	//==========================
	//日期增加年数或月数或天数 
	// @param   dateOrDateTime 	源日期(yyyy-mm-dd)或日期时间(yyyy-MM-dd HH:mm:ss)
	// @param   interval 		要增加的数值
	// @param   datePart 		要增加类别(day:增加天)(month:增加月)(year:增加年)
	//==========================
	dateAdd : function(dateOrDateTime, interval, datePart) {
		var tempOld, tempOldYMD, tempOldHMS, dateObj, tempTime = "", dVal, newDate, newDay, newMon;
		tempOld = dateOrDateTime.split(" ");
		tempOldYMD = tempOld[0].split("-");//年月日
        if(tempOldYMD[1]!= undefined){//月是由0开始11结束
        	tempOldYMD[1]=tempOldYMD[1]-1;
        }
		//如果没有时间
		if (tempOld[1] == undefined) {
			dateObj = new Date(tempOldYMD[0], tempOldYMD[1], tempOldYMD[2]);
		} else {
			
			tempOldHMS = tempOld[1].split(":");
			dateObj = new Date(tempOldYMD[0], tempOldYMD[1], tempOldYMD[2],
					tempOldHMS[0], tempOldHMS[1], tempOldHMS[2]);
			tempTime = " " + tempOld[1];
			
		}
		//返回 Date 对象的原始值
		dVal = new Date(dateObj).valueOf();
		switch (datePart) {
		case "day":
			newDate = new Date(dVal + this.day * interval);
			break;
		case "month":
			var yeard,monthd;
			var yearint,monthint;
			//interval个月包括几年
			yearint = parseInt(interval/12);
			//余多少个月
			monthint = interval%12;
			//年份
			yeard = yearint + parseInt(tempOldYMD[0]);			
			if((monthint + parseInt(tempOldYMD[1],10))/12 > 1){
				yeard = yeard + 1;
				monthd = (monthint + parseInt(tempOldYMD[1],10))%12;				
			}else{
				monthd = monthint + parseInt(tempOldYMD[1],10);				
			}			
			newDate = new Date(yeard,monthd,tempOldYMD[2],tempOldHMS[0], tempOldHMS[1], tempOldHMS[2]);			
			break;
		case "year":			
			newDate = new Date(parseInt(tempOldYMD[0]) + parseInt(interval,10),tempOldYMD[1],tempOldYMD[2],tempOldHMS[0], tempOldHMS[1], tempOldHMS[2]);
			break;
		default:
			return escape("日期格式不对");
		}
		newDate = new Date(newDate);
		
		if (newDate.getMonth() < 9) {
			newMon = "0" + (newDate.getMonth()+1);
		} else {
			newMon = newDate.getMonth()+1;
		}

		if (newDate.getDate() < 10) {
			newDay = "0" + newDate.getDate();
		} else {
			newDay = newDate.getDate();
		}
		return newDate.getFullYear() + "-" + newMon + "-" + newDay + tempTime;
	},

	//判断有没有时间,有时间返回true
	isHaveTime : function(dateOrDateTime) {
		var tempOld = dateOrDateTime.split(" ");
		if (tempOld[1] == undefined) {
			return false;
		}
		return true;
	},
	//转换json日期.G.Date.toDate(要转换的json日期数据,"yyyy-MM-dd hh:mm:ss")
	toDate : function(objDate, format) {
	    var date = new Date();
	    date.setTime(objDate.time);
	    date.setHours(objDate.hours);
	    date.setMinutes(objDate.minutes);
	    date.setSeconds(objDate.seconds);
	    return date.format(format);
	},
	//格式化Datebox里的输入内容,格式化成形如：2013-06-07
	//@param date 要格式化的日期对象
	dateboxFormatter : function(date){
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
	},
	//解析Datebox里的输入内容
	//@param s 要解析的字符串
	dateboxParser : function(s){
		if(!s){return new Date();}
		var ss = s.split('-');
		var y = parseInt(ss[0],10);
		var m = parseInt(ss[1],10);
		var d = parseInt(ss[2],10);
		if(!isNaN(y) && !isNaN(m) && !isNaN(d)){
			return new Date(y,m-1,d);
		}else{
			return new Date();
		}
	}
}

/**
 * 时钟组件封装，代替Window的setTimeout/setInterval函数。［注意，单位：秒］
 *
 * 方法：
 *    1、G.Clock.run()                  时钟开始运行(用于当时钟被暂停时，可以用此方法重新唤醒)
 *    2、G.Clock.pause()                暂停
 *    3、G.Clock.setTimeout(CMD,time,jumpTime)   追加命令(命令行，时间，只运行一次)，返回命令ID
 *    4、G.Clock.setInterval(CMD,time, jumpTime)  追加命令(命令行，时间，连续运行)，返回命令ID
 *    5、G.Clock.sleep(time)            睡眠指定的时间
 *
 */	
G.namespace("Clock");
G.Clock = {
	//用一个数组来存贮需要加载运行的方法列表
	functions : new Array(),
	//记录当前时钟（毫秒）
	time : 0,
	//暂停标志
	isClockPause : false,
	//记录时钟开始时间
	startTime : null,
	isPause : false,
	isRuning : true,
	startTime : new Date(),
	//window.setInterval("this.running()",50);
		
	//时钟主循环，所有需要反复循环的东西，都从这里执行
	running : function(){
		//暂停状态
		if(this.isPause)return
		var nowTime = new Date();
		//当前时钟相对startTime增加的毫秒数量(总是100的整数,即100毫秒是最小计时单位)
		this.time = parseInt((nowTime-this.startTime)/100)*100;
		//根据已经加载的方法，逐个运行
		for (var i = 0; i < this.functions.length;i++) {
			//运行方法
			var iF = this.functions[i]	//取得方法信息
			//达到执行条件
			if(iF.isON && ((this.time-iF.initTime)>=iF.time) ){
				try{
					//执行命令
					eval(iF.CMD);
				}catch(err){
				}
				//如果是只运行一次
				if(iF.onlyOne){
					//删除该方法
					this.remove(i)
				}else{
					iF.initTime = this.time
				}
			}
		}
	},
	//删除方法
	remove : function(id) {
		if(this.functions[id]!=null)
			this.functions[id].isON = false;
	},
	//运行时钟
	run : function(){
		this.isPause = false;
	},
	//暂停
	pause : function(){
		this.isPause = true;
	},
	//睡眠指定的时间
	sleep : function(time){
		this.pause()
		window.setTimeout("this.run()",time)
	},
	//加载方法(方法名称，多少帧后执行，只执行一次) CMD:要执行的语句或函数  time:多少秒后执行(单位：秒) jumpTime:方法与方法之间的间隔时间(单位：秒)
	setTimeout : function(CMD, time, jumpTime) {
		//找一个闲置的存储位置
		var nowTime = parseInt((new Date()-this.startTime)/100)*100;
		if(jumpTime == null || jumpTime=="undefined" || Number(jumpTime)==0){
			jumpTime = 1;
		}else{
			jumpTime = Number(jumpTime);
		}
		for (var i = 0; i < this.functions.length; i++) {
			var iF = this.functions[i]
			//方法列表里有空位置
			if(!iF.isON){		
				//覆盖命令
				iF.CMD = CMD;
				//覆盖时间()
				iF.time = jumpTime* time * 1000;
				//覆盖运行次数
				iF.onlyOne = true;
				//起始时间点
				iF.initTime = nowTime;
				//设置为非空
				iF.isON = true;
				//返回下标
				return i;
			}
		}
		//创建一个新的方法
		var newF = new Array();
		//命令
		newF.CMD = CMD;	
		//时间间隔
		newF.time = jumpTime* time * 1000;
		//只运行一次
		newF.onlyOne = true;
		//起始时间点
		newF.initTime = nowTime;
		//设置为非空
		newF.isON = true;

		//否则追加到最后
		this.functions[this.functions.length] = newF;
		return this.functions.length - 1;
	},
	//加载方法(方法名称，多少帧后执行，反复执行)
	setInterval : function(CMD,time, jumpTime) {
		var id = this.setTimeout(CMD,time, jumpTime);
		this.functions[id].onlyOne = false;
	}
}

/**
 * 列表组件封装
 * @param   id 				table对象ID
 * @param   title 			标题
 * @param   url 			请求地址
 * @param   queryParams 	其它参数
 * @param   columns 		加载列标题
 * @param   toolbar 		工具条
 * @param   option		 	设置参数    {
 * 											height:300,//列表定高
 * 											frozenColumns:true,//是否需要复选框
 * 											width:400px,//表格宽度
 * 											isPageList:true,//是否加载分页
 * 											onClickRow:function(){},//单击事件
 * 											onDblClickRow:function(){}//双击某行事件
 * 										}
 */

G.namespace("Datagrid");
G.Datagrid = {
	id : "",
	url : "",
	queryParams : {},
	detailUrl : "",
	options : {
		height:undefined,
		sortName:undefined,
		sortOrder:undefined,
		//0表示默认分页([5,15,25,35,50,100,200])  1表示[5,10,20,30,40,50]
		model:'0',
		//是否需要复选框
		frozenColumns:true, 
		//是否需要显示分页相关功能
		isPageList:true,
		singleSelect:false,
		//初始化为折叠状态，默认展开
		collapsed:false,
		//折叠按钮状态，默认隐藏
		collapsible:false
	},
	bakOptions:{
		height:undefined,
		sortName:undefined,
		sortOrder:undefined,
		frozenColumns:true,
		isPageList:true
	},
	//==============
	//  加载表格
	//==============
	datagrid : function(id, title, url, queryParams, columns, toolbar, option){
		if(id == null || id == "" || id=="undefined"){
			return;
		}
		if(title == null || title == "undefined"){
			title='';
		}
		if(url == null || url=='' || url == "undefined"){
			url='';
		}else{
			url = G.Pro.base + url;
		}
		if(queryParams == null || queryParams == "undefined"){
			queryParams = {};
		}
		if(columns == null || columns == "undefined"){
			columns = "";
		}
		if(toolbar == null || toolbar == "undefined"){
			toolbar = "";
		}
		this.id = id;
		this.url = url;
		this.queryParams = queryParams;
		G.Lang.setProperty(this.options, option || {});
		//alert(id);
		
		$('#'+id).datagrid({
			title:title,
			width:this.options.width?this.options.width:document.body.clientWidth-15,
			height:this.options.height,
			pageSize:this.options.model=='1'?1:G.Pro.pageSize,
			pageList:this.options.model=='1'?[5,10,20,30,40,50]:G.Pro.pages,
			border:true,
			//单元格内的内容超出宽时，自动隐藏超出的部分
			nowrap:true,
			striped: true,
			//定义分页工具栏的位置.可用值有： 'top'，'bottom'，'both'。
			pagePosition:'bottom',
			url:url,
			queryParams:queryParams,
			loadMsg:'数据装载中......',
			//默认让页面跳转到第1页
			pageNumber:1,
			remoteSort:false,
			frozenColumns:this.options.frozenColumns?[[{field:'ck',checkbox:true}]]:"",
			//加载列标题
			columns:columns,
			//包含分页 
			pagination:this.options.isPageList,
			//是否显示列的序号
			rownumbers:true,
			//加载工具栏
			toolbar:toolbar,
		    onClickRow:this.options.onClickRow,
			onDblClickRow:this.options.onDblClickRow,
			onLoadSuccess:this.options.onLoadSuccess,
			//单选模式
			singleSelect:this.options.singleSelect,
			//初始化为折叠状态，默认展开
			collapsible:this.options.collapsible,
			//列表是否展开
			collapsed:this.options.collapsed
		});
		this.displayPageMsg(id);
	},
	//===================
	// 加载表格（可以展开表格每行）
	//===================
	datagridDetailview : function(id, title, url, queryParams, columns, toolbar, option, expandRow){
		if(id == null || id == "" || id=="undefined"){
			return;
		}
		if(title == null || title == "undefined"){
			title='';
		}
		if(url == null || url=='' || url == "undefined"){
			url='';
		}else{
			url = G.Pro.base + url;
		}
		if(queryParams == null || queryParams == "undefined"){
			queryParams = {};
		}
		if(columns == null || columns == "undefined"){
			columns = "";
		}
		if(toolbar == null || toolbar == "undefined"){
			toolbar = "";
		}
		this.id = id;
		this.url = url;
		this.queryParams = queryParams;
		G.Lang.setProperty(this.options, option || {});
		$('#'+id).datagrid({
			title:title,
			width:this.options.width?this.options.width:document.body.clientWidth-30,
			height:this.options.height,
			pageSize:this.options.model=='1'?5:G.Pro.pageSize,
			pageList:this.options.model=='1'?[5,10,20,30,40,50]:G.Pro.pages,
			border:true,
			//单元格内的内容超出宽时，自动隐藏超出的部分
			nowrap:true,
			striped: true,
			url:url,
			queryParams:queryParams,
			loadMsg:'数据装载中......',
			//默认让页面跳转到第1页
			pageNumber:1,
			remoteSort:false,
			frozenColumns:this.options.frozenColumns?[[{field:'ck',checkbox:true}]]:"",
			//加载列标题
			columns:columns,
			//包含分页 
			pagination:this.options.isPageList,
			//是否显示列的序号
			rownumbers:true,
			//加载工具栏
			toolbar:toolbar,
		    onClickRow:this.options.onClickRow,
			onDblClickRow:this.options.onDblClickRow,
			onLoadSuccess:this.options.onLoadSuccess,
			//单选模式
			singleSelect:this.options.singleSelect,
			//初始化为折叠状态，默认展开
			collapsible:this.options.collapsible,
			//列表是否展开
			collapsed:this.options.collapsed,
			view: detailview,
			detailFormatter:function(index,row){
				return '<div id="ddv-' + index + '"></div>';
			},
			onExpandRow:expandRow
		});
		this.displayPageMsg(id);
	},
	//重新加载列表
	reloadDatagrid : function(id, url, queryParams, _opt){
		if(id == null || id == "" || id=="undefined"){
			return;
		}
		if(queryParams == null || queryParams == "undefined"){
			queryParams = {};
		}
		G.Lang.setProperty(this.options, _opt || {});
		$('#'+id).datagrid({
			url:G.Pro.base + url,
			queryParams:queryParams,
			//让页面跳转到第一页
			pageNumber:1,
			loadMsg:'数据装载中......'
		});
		this.displayPageMsg(id);
	},
	//列表尾
	displayPageMsg : function(id){
		//当前显示从{from}到{to}共{total}条记录
		if(this.options.isPageList){
			$('#'+id).datagrid('getPager').pagination({displayMsg:'当前显示从{from}到{to}共{total}条记录'});
		}
	},
	//ajax重新加载外部数据
	loadDataOfAjax : function(id, url, queryParams,_opt){
		var _obj = this;
		
		if(id == null || id == "" || id=="undefined" || url == "" || url=="undefined"){
			return;
		}
		if(queryParams == null || queryParams == "undefined"){
			queryParams = {};
		}
		var reData;
		G.Ajax.post(url, queryParams,function(data,t){
			reData = data.split("|");
			if(reData[0] == 'ok'){
				var subDate = data.substring(3,data.length);
				_obj.loadDataOfData(id, subDate,_opt);
			}
		});
	},
	loadDataOfData : function(id, reData,_opt){
		G.Lang.setProperty(this.options, _opt || {});
		$('#'+id).datagrid("loadData",jQuery.parseJSON(reData));
		this.displayPageMsg(id);
	},
	loadDataOfJsonData : function(id, reData,_opt){
		G.Lang.setProperty(this.options, _opt || {});
		$('#'+id).datagrid("loadData",reData);
		this.displayPageMsg(id);
	},
	//返回列表数据总数
	getDatagridListLength : function(id){
		return $('#'+id).datagrid("getRows").length;
	},
	//删除指定的行  names:要删除的名称以逗号隔开
	deleteRow : function(id, names){
		names = names.replaceAll(",", '|');
		var _tem = [names];
		if(id == null || id=="undefined"){
			return;
		}
		var selected = $('#'+id).datagrid('getSelections');
		var index;
		if(selected.length>0){
			for(var i=0;i<selected.length;i++){
				index = $('#'+id).datagrid('getRowIndex', selected[i]);
				if(_tem.join("|").indexOf(selected[i].name) != -1){
	      			$('#'+id).datagrid('deleteRow', index);
				}
			}
		}
	},
	//调整列表
	resizeDatagrid : function(id,width){
		setTimeout(resize,50);
		function resize(){
			if(null==width){
				if(null != $(".nav-list").html()){
					var hWidth = $(".nav-list").css("width").replace("px","");
					$('#'+id).datagrid('resize', {width:hWidth});
				}
			}else{
				$('#'+id).datagrid('resize', {width:width});
			}
		}
	}
}

/**
 * 项目相关
 * 封装项目相关的常量和函数，如不需要，可以删掉
 * 
 */
G.namespace("Pro");

G.Pro.base = basePath;

//弹出窗口标题
G.Pro.title = baseTitle;

//默认分页数
G.Pro.pageSize = 15;

//分页列表数
G.Pro.pages = [5,15,25,35,50,100,200];

//===================
//执行action请求
//===================
G.Pro.doAction = function(url){   
	 //支持火孤  
	parent.document.getElementById("rightFrame").src = G.Pro.base+url;
	return false;
}
//===============
//窗口打开 全屏窗口
//===============
G.Pro.openWindow = function(url){
	window.location.href = G.Pro.base + url;
}

//=======================
//注销系统
//=======================
G.Pro.logout = function(su, pageUrl){
	G.Msg.showConfirm("确定要退出系统吗？<div><br/></div>", function(es){
		if(typeof(es) == "undefined" || es){
			if(typeof(su) != "undefined" && typeof(su) == "string" && su.length > 3){
				//struts方式
				if(su.indexOf("dhtml") != -1){
					parent.location.href = G.Pro.base + su;
				}else{
					//service方式
					if(pageUrl == ""){
						parent.location.href = G.Pro.base + "/page/sys/urlerror.jsp";
					}
					G.Ajax.post("/ws/"+su+".action", {"functionName":'logout',"params":JSON.stringify({co:''})}, function(data){
						parent.location.href = G.Pro.base +pageUrl;
					},"json");
				}
			}else{
				parent.location.href = G.Pro.base + "/login!logout.dhtml";
			}
		}
	});
};

//=======================
//权限修改，刷新页面
//=======================
G.Pro.refreshWindow = function(){
	$.G.Msg.showWarning('权限已修改！',function(){
		parent.document.getElementById("topFrame").src=G.Pro.base+"/top.dhtml?"+(new Date()).getTime();
		parent.document.getElementById("leftFrame").src=G.Pro.base+"/defaultleft.dhtml?"+(new Date()).getTime();
		parent.document.getElementById("rightFrame").src=G.Pro.base+"/default.dhtml?"+(new Date()).getTime();
	});
}

//======================
// 获得realPath路径
//======================
G.Pro.path = function(){
	var strFullPath=window.document.location.href;
	var strPath=window.document.location.pathname;
	var pos=strFullPath.indexOf(strPath);
	var prePath=strFullPath.substring(0,pos);
	var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
	return(prePath+postPath);	
}

//=============================
// 获得不带工程名的请求地址，如http://127.0.0.1:8080
//=============================
G.Pro.paths = function(){
	var strFullPath=window.document.location.href;
	var strPath=window.document.location.pathname;
	var pos=strFullPath.indexOf(strPath);
	var prePath=strFullPath.substring(0,pos);
	return prePath;
}

//=============
//重新对指定的节点进行异步加载子节点
//_tree:树对象
//=============
G.Pro.refreshNodes = function(_tree){
	// 得到左框架中的树对象
	//var _tree = parent.document.getElementById("leftFrame").contentWindow.gelsTree;
	// 获得当前选中的节点
	var pNode = _tree.getSelectedNode();
	var childNodes = _tree.transformToArray(pNode);
	for(var i = 0;i < childNodes.length; i++){
		if(childNodes[i] == pNode){
			if(!pNode.isParent){
				pNode = pNode.parentNode;
			}
			_tree.reAsyncChildNodes(pNode, "refresh");
		}else{
			if(childNodes[i].isParent){
				_tree.reAsyncChildNodes(childNodes[i], "refresh");
			}
		}
	}
	_tree.selectNode(pNode);
}

//==============
//重新对指定的节点进行异步加载子节点
//_tree:树对象  type:节点的type  id：节点的id
//==============

G.Pro.refreshOtherNodes = function(_tree, type, id){
	// 得到左框架中的树对象
	//var _tree = parent.document.getElementById("leftFrame").contentWindow.gelsTree;
	// 获得当前选中的节点
	var pNode = _tree.getSelectedNode();
	var nodes = _tree.getNodesByParam("id", id, null);
	$.each(nodes,function(key,value){
		if(value.type == type){
			_tree.reAsyncChildNodes(value, "refresh");
		}
	});
	nodes = _tree.getNodesByParam("id", id, null);
	$.each(nodes,function(key,value){
		if(value.type == type){
			value.isParent = true;
			value.open = false;
			_tree.updateNode(value, true);
			_tree.refresh();
		}
	});
	_tree.selectNode(pNode);
}

//获得选中的文本
G.Pro.getSelectionText = function(){
	if(window.getSelection){
		return window.getSelection().toString();
	}else if(document.selection && document.selection.createRange){
		return document.selection.createRange().text;
	}
	return '';
}

/**禁止输入 空格
//可以在非空格字符后输入空格 
//全选输入框中的字符后，禁止输入空格
//输入框无内容禁止输入空格
* **/
G.Pro.prohibitsTheInputSpace = function(pageIdStr){
	$(pageIdStr).bind({
		keydown:function(e){
			var keyCode=parseInt(e.which==null?e.keyCode:e.which);
			if((G.Pro.getSelectionText().length > 1||$(this).val()=='')&&keyCode==32){e.returnValue=false;}
		}
	});
}


/**
 * 迁移组件封装
 * 使用说明：点击触发后调用
 * $("#deptMenuBtn").click(function(){
		G.Migrate.loadMigrate({"showId":"deptName","hiddenId":"deptId",targetId:"gels-show-dept",treeId:"treeId",url:"",left:0,top:0});
	});
 * 
 * @param   option 	设置参数 {
 * 				//获得数据的请求的url,url返回值是 "ok|具体数据" 格式。 
 * 				url:'',
 * 				//存放显示出来的名称所在文本框的id，该值默认值为deptName
 * 				showId:'deptName',
 * 				//将选中的选项的id存放到的隐藏域的id，该值默认值为deptId
 * 				hiddenId:'deptId',
 * 				//显示部门树的层的id,该值默认值为gels-show-dept
 * 				targetId:'gels-show-dept',
 * 				//显示部门树的id,该值默认值为treeId
 * 				treeId:'treeId'
 * 			}
 */
G.namespace("Migrate");
G.Migrate = {
	options : {
		//存储要显示树的ID
		treeId:'treeId',
		//获得join数据的请求URL
		url:'',
		//显示层的id
		targetId:'gels-show-dept',
		showId:'deptName',
		hiddenId:'deptId',
		left:0,
		top:0
	},
	
	//===============
	//加载树
	//===============
	loadMigrate : function(option){
		G.Lang.setProperty(this.options, option || {});
		buffer.del();
		buffer.append('<div id="');
		buffer.append(this.options.targetId);
		buffer.append('" style="display:none; position:absolute; height:200px; min-width:150px; ');
		buffer.append('background-color:white;border:1px solid #6699cc;overflow-y:auto;overflow-x:auto;">');
		buffer.append('<ul id="');
		buffer.append(this.options.treeId);
		buffer.append('" class="tree"></ul>');
		buffer.append('</div>');
		$("body").append(buffer.toString());
		//菜单层ID
		var targetId = this.options.targetId;
		var showId = this.options.showId;
		this.showMenu();
		//监听按下鼠标
		$("body").bind("mousedown", 
			function(event){
				if(!(event.target.id == showId || event.target.id == targetId || $(event.target).parents("#"+targetId).length>0)){
					//隐藏弹出层
					$("#"+targetId).fadeOut("fast");
				}
		});
	},
	
	//==============
	//显示点击选择后的菜单 
	//==============
	showMenu : function(){
		var Obj = $("#"+this.options.showId);
		var Offset = $("#"+this.options.showId).offset();
		var _da = "";
		
		//树所需的回调函数
		var migrateSetting = {
			callback: {
				//beforeExpand: function(){return false;},
				//beforeCollapse: function(){return false;},
				beforeClick: this.migrateBeforeClick,//判断哪些节点可以点击
				click: this.migrateClick//处理点击具体的用户或资源时
			}
		};
		
		G.Ajax.post(this.options.url,{}, function(data,t){
				var _d = data.split("|");
		  		// 如果成功
		  		if(_d[0] == 'ok'){
					if(_d[1]==""){
						return ;
					}
					_da = _d[1];
		  		}
		},"",false);
		$("#"+this.options.treeId).zTree(migrateSetting, eval(_da));
		$("#"+this.options.targetId).css({left:(Offset.left-this.options.left) + "px", top:(Offset.top-this.options.top + Obj.outerHeight()) + "px",width:'150px'}).slideDown("fast");
	},
	
	//====================
	//处理单击选择的事件
	//====================
	migrateClick : function(event, treeId, treeNode) {
		if(treeNode && treeNode.isSelect=='true'){
			//放到显示的文本框中的名称
			$("#"+G.Migrate.options.showId).attr("value", treeNode.name);
			//放到隐藏域的id
			$("#"+G.Migrate.options.hiddenId).attr("value", treeNode.id);
			$("#"+G.Migrate.options.targetId).fadeOut("fast");
			//触发输入框的失去焦点事件
			$("#"+G.Migrate.options.showId).blur();
		}
	},
	//=============
	//节点控制
	//=============
	migrateBeforeClick : function(treeId, treeNode) {
		//禁止输入父节点
//		if(treeNode.isSelect=='false') return false;
		//返回子节点
		return true;
	}
}



/**
 * 操作字符串类<br>
 * 
 * 添加值:buffer.append('Mack');
 * 获得值:buffer.toString();
 **/	
function StringBuffer(){
	this._strings_ = new Array();
	/**
	 * 追加字符串
	 * 
	 * @param {Object} str
	 * @memberOf {TypeName} 
	 */
	this.append = function(str) {
	  this._strings_.push(str);
	}
		
	/**
	 * 删除StringBuffer中的字符串
	 * 
	 * 如：清除所有 buffer.del();
	 * 清除从第二条数据开始的三条数据，buffer.del(2, 3);
	 * 
	 * buffer.append('==========1');
	 * buffer.append('==========2');
	 * buffer.append('==========3');
	 * buffer.append('==========4');
	 * buffer.append('==========5');
	 * 
	 * 执行buffer.del(2, 3);后，最后答案：
	 * '==========1'
	 * '==========5'
	 * 
	 * @param {Object} from 开始删除的位置 
	 * @param {Object} to 共删除多少条数据
	 * @memberOf {TypeName} 
	 */
	this.del = function(from, to) {		
		if ((from != null && typeof (from) == "number" && from > 0) && 
			(to != null && typeof (to) == "number" && to > 0)){
			var mm = new Array();
				if(to > this._strings_.length){
					to = this._strings_.length;
				}
				for (var i=0;i<this._strings_.length;i++){
					if(i< from-1 || i> to){
						mm.push(this._strings_[i]);
					}
				}
				//this._strings_ = new Array();
				this._strings_ = mm; 
		}else{
		  	this._strings_ = new Array();
		}
	};
		
	/**
	 * 把数组转换为字符串，并返回结果
	 * 
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	this.toString = function() {
	  return this._strings_.join("");
	};
	//获得长度
	this.length = function(){
		return this._strings_.length;
	}	
};
var buffer = new StringBuffer ();

/**
 * 扩展内置类
 */
//================
//模仿java中的replaceAll方法
//================
String.prototype.replaceAll = function(s1,s2) { 
	return this.replace(new RegExp(s1,"gm"),s2); 
}

//============
//去掉字符串中所有的空格  
//============
String.prototype.atrim = function()	{
	// 用正则表达式将右边空格用空字符串替代。
	return this.replace(/(\s+)|(　+)/g, "");
}
	
String.prototype.replaceRemark = function(){
	return this.replaceAll("-rn-", "\r\n")
}

//=========================
// 获得字符串长度(一个汉字为两个字符)
//由于 JavaScript 将全角、半角均视为是一个字符，
//在一些实际运用中可能会造成一定的问题，现在我们将一个汉字做为两个字符使用 
//使用方法：alert("www.测试.com".cnLength()) -> 显示 12
//=========================
String.prototype.cnLength = function(){ 
	var arr=this.match(/[^\x00-\xff]/ig); 
	return this.length+(arr==null?0:arr.length); 
}
//=======================	
//从字符串左边截取 n 个字符，并支持全角半角字符的区分
//使用方法：
//alert("www.测试.com".left(6)) -> 显示 www.测试
//alert("www.测试.com".left(6,true)) -> 显示 www.测
//=======================
String.prototype.left = function(num,mode){ 
	if(!/\d+/.test(num))
		return(this); 
	var str = this.substr(0,num); 
	if(!mode)
		return str; 
	var n = str.Tlength() - str.length; 
	    num = num - parseInt(n/2); 
	return this.substr(0,num); 
}

//=====================
//用正则表达式将前后空格用空字符串替代  
//=====================
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
}	

//==================
//将字符串按HTML需要的编码方式编码  
//==================
String.prototype.encodeHtml = function() {
	var strToCode = this.replace(/</g,"&lt;");
	strToCode = strToCode.replace(/>/g,"&gt;");
	return strToCode;
}

//===============
//将字符串按HTML需要的编码方式解码 
//===============
String.prototype.decodeHtml = function() {
	var strToCode = this.replace(/&lt;/g,"<");
	strToCode = strToCode.replace(/&gt;/g,">");
	return strToCode;
}

//将字符串按java需要的编码方式解码 
String.prototype.decString = function(){
	return escape(encodeURIComponent(this));
}
	
//=================
//指定字符集半角字符全部转变为对应的全角字符
//=================
String.prototype.dbcToSbc = function(dbcStr){
	var resultStr = this;
	for(var i = 0;i < this.length;i ++){
		switch(dbcStr.charAt(i)){
	    	case ",":
	        	resultStr = resultStr.replace(/\,/g,"，"); 
	            break;
	        case "!":
	            resultStr = resultStr.replace(/\!/g,"！"); 
	            break;
	        case "#":
	            resultStr = resultStr.replace(/\#/g,"＃"); 
	            break;
	        case "|":
	            resultStr = resultStr.replace(/\|/g,"|"); 
	            break;
	        case ".":
	            resultStr = resultStr.replace(/\./g,"。"); 
	            break;
	        case "?":
	            resultStr = resultStr.replace(/\?/g,"？"); 
	            break;
	        case ";":
	            resultStr = resultStr.replace(/\;/g,"；"); 
	            break;
	    }
	}
	return resultStr;
}

/**
 * 将超出的文本用...表示
 *
 * 使用说明：<script>G.Over.set('要显示的文本内容');</script>
 */	
G.namespace("Over");
G.Over = {
	num:20,
	set: function(context, len) {
		if (len != null && typeof (len) == "number" && len > 0){
			this.num = len;
		}
		var count = 0;	
        for(i=0;i<context.length;i++){
             if(context.charCodeAt(i)>128){
                 count+=2;
             }else{
                 count+=1;
             }
             if(count>this.num){
             	document.write(context.substr(0,i).encodeHtml()+"...");
             	return;
             }
        }	
		document.write(context.encodeHtml());
	},
	getValue: function(context, len) {
		if (len != null && typeof (len) == "number" && len > 0){
			this.num = len;
		}
		var count = 0;	
        for(i=0;i<context.length;i++){
             if(context.charCodeAt(i)>128){
                 count+=2;
             }else{
                 count+=1;
             }
             if(count>this.num){
             	return (context.substr(0,i).encodeHtml()+"...");
             }
        }	
		return (context.encodeHtml());
	}
}

//format 日期
Date.prototype.format = function(format) {
    /*
     * format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" : this.getMonth() + 1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth() + 3) / 3),
        "S" : this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4- RegExp.$1.length));
        }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)){
            format = format.replace(RegExp.$1, RegExp.$1.length == 1? o[k]:("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

// 获取服务器返回的信息
function ajaxCallback ( ret, obj )
{
	//if(process.processing){
	//	process.finish();
	//}
	if(G.Process.processing){
		G.Process.finish();
	}
	//alert(ret);
	var errorMsg = G.Loader.getError(ret);
	if(errorMsg) {
		G.Loader.showHTML(errorMsg);
	}
	else if( ret != '' ) {
		G.Loader.showHTML(ret, obj);
	}
}




