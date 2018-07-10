/*
Ajax 类
sUrl : 目标 URL
sQueryString : 提交变量
callbackFunc : 回调函数
callbackParams : 回调函数参数
sRecvType : 返回值格式 ( 0: 文本, 1: XML );
*/

function Ajax( sUrl, sQueryString, callbackFunc, callbackParams, sRecvType)
{
	this.url = sUrl;
	this.queryString = sQueryString != null ? sQueryString : '';
	this.response; // 返回值

	this.xmlHttp = this.createXMLHttpRequest ();
	if(this.xmlHttp == null ){
		//alert ( '网络连接出错, 请稍后重试!' );
		G.Msg.showWarning('网络连接出错, 请稍后重试!');
		return;
	}
	var objxml = this.xmlHttp;
	objxml.onreadystatechange = function(){
		Ajax.handleStateChange ( objxml, sRecvType, callbackFunc, callbackParams )
	}
}

Ajax.prototype.createXMLHttpRequest = function(){
	try{
		return new ActiveXObject( 'Msxml2.XMLHTTP' );
	}catch(e){}

	try{
		return new ActiveXObject( 'Microsoft.XMLHTTP' );
	} catch(e){}

	try{
		return new XMLHttpRequest();
	} catch(e){}

	return null;
}

Ajax.prototype.createQueryString = function(){
	var queryString = '';
	if(this.queryString != null && typeof ( this.queryString ) != 'string' ){
		var elements = this.queryString.elements;
		var pairs = new Array();
		for(var i=0;i<elements.length;i++){
			if((name=elements[i].name)&&(value = elements[i].value)){
				//alert(elements[i].nodeType+":"+elements[i].nodeName+":"+elements[i].type);
				if(elements[i].type != 'button' && elements[i].type != 'submit' && elements[i].type != 'file'&& elements[i].type != 'image'&& elements[i].type != 'reset'){
					if((elements[i].type == 'radio' && !elements[i].checked) ||(elements[i].type == 'checkbox' && !elements[i].checked )){
						//alert("error");
						continue;
					}
					pairs.push(name + "=" + encodeURIComponent(value));
				}
			}
		}
		//pairs.push("session=" + sessionid);
		queryString = pairs.join ( '&' );
	}else{
		//queryString = this.queryString +"session="+sessionid;
		queryString = this.queryString;
	}
	return queryString;
}

Ajax.prototype.get = function (){
	sUrl = this.url;

	var queryString = sUrl;
	if(extraQueryString = this.createQueryString()){
		queryString += ( sUrl.indexOf ('?') > 0 ? '&' : '?' ) + extraQueryString;
	}
	this.xmlHttp.open ( 'GET', queryString, true );
	this.xmlHttp.send ( null );
}

Ajax.prototype.post = function(){
	var sUrl = this.url;
	var queryString = this.createQueryString ();
	this.xmlHttp.open( 'POST', sUrl, true );
	this.xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
	this.xmlHttp.send( queryString );
}

Ajax.handleStateChange = function(xmlHttp, sRecvType, callbackFunc, callbackParams ){
	if(xmlHttp.readyState == 4 ){
		if(xmlHttp.status == 200){
			Response = sRecvType ? xmlHttp.responseXML : xmlHttp.responseText;
			//Response = sRecvType ? xmlHttp.responseXML : xmlHttp.responseBody;
			if(callbackFunc != null ){
				callbackFunc ( Response, callbackParams );
			}else{
				if(G.Process.processing){
					G.Process.finish();
				}
			}
		}else{
			//mask.hide ();
			//alert ( '网络连接出错, 请稍后重试!' );
			G.Msg.showWarning('网络连接出错, 请稍后重试!');
		}
	}
}
