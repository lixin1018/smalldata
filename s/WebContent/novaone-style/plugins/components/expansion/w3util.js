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
