$(document).ready(function(){  	
	$(window).resize(function(){
		resizePlayDiv({
	 		containerId: "pageContentPlayInnerDiv"
		});
	});

	showSSPlayInfo({
		containerId: "pageContentPlayInnerDiv"
	})
 	
	resizePlayDiv({
 		containerId: "pageContentPlayInnerDiv"
	});
});

function showSSPlayInfo(p){
	var pageArgs = cmnPcr.getQueryStringArgs();
	var code = pageArgs["code"];
	if(code == null){
		msgBox.alert({info: "不存在此页面"});
	}
	else{
		var ssDataAccess = new ShuShuoDataAccess();
		ssDataAccess.getSSPlayInfo({
			code: code,
			afterGetSSPlayInfoFunc: function(ssPalyInfo){
				$("title").text(ssPalyInfo.title + " - ShuJuZhuLi.com");
			 	loadVideo({
			 		containerId: p.containerId,
			 		pageUrl: "../" + ssPalyInfo.code + "/p.html"
			 	});
			}
		});
	}
}

function loadVideo(p){
	$("#" + p.containerId).load(p.pageUrl);
}

function resizePlayDiv(p){
	var width = $("#" + p.containerId).parent().parent().width();
	var outerWidth = width > 960 ? 960 : width; 
	var outerHeight = 540 * outerWidth / 960; 
	var innerLeft = (outerWidth - 960) / 2;
	var innerTop = (outerHeight - 540) / 2;
	var scale = width > 960 ? 1 : width / 960; 
	$("#" + p.containerId).parent().css({
		width: outerWidth,
		height: outerHeight
	});	
	$("#" + p.containerId).css({
		top: innerTop,
		left: innerLeft,
		transform: "scale(" + scale + ", " + scale + ")"
	});
}