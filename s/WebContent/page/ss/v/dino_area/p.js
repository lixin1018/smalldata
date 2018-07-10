var fadeInOut;
function beginPlay(){
	fadeInOut = new FadeInOut();
	showTitlePage();	
}

function showTitlePage(){			
	//开始打字
	autoType({
		elementClass: ".dzxgType-js",
		typingSpeed: 200,
		afterTypedFunc: function(){
			getDinoDataFromServer();					
		}
  	});
}

function getDinoDataFromServer(){
	var shuShuoDataAccess = new ShuShuoDataAccess();
	shuShuoDataAccess.getData({
		code:"dino_area",
		afterGetDataFunc: function(rows){ 
			initContentImageBlocks(rows);
			hiddenTitlePage();
		}
	});
}

function initContentImageBlocks(rows){
	for(var i = 0; i < rows.length; i++){
		var row = rows[i];
		var imgBlockId = cmnPcr.getRandomValue();
		var imgBlockHtml = "<div id=\"" + imgBlockId + "\" areaCode= \"" + row.area_code + "\" class=\"imgScroller_page\">" 
						+ "	<div class=\"imgScroller_pageInner\" style=\"text-align:center;\"></div>"
						+ "	<div class=\"imgScroller_pageContent\" ></div>"
						+ "</div>";
		$("#imgScrollerMainDivId").find(".imgScroller_pageContainer").append(imgBlockHtml);
		$("#" + imgBlockId).find(".imgScroller_pageInner").text(row.name_cn + " " + row.name);  
		$("#" + imgBlockId).attr("areaname", row.area_cn + " " + row.area);
		
		var dinoImageUrl = basePath + "/rs/images/dino/" + row.name + ".jpg";
		$("#" + imgBlockId).find(".imgScroller_pageContent").css({"background-image":"url(" + dinoImageUrl + ")"}); 
	}

	$("#imgScrollerMainDivId").find(".imgScroller_pageContainer").append("<div class=\"imgScroller_blankPage\"></div>");
}

function hiddenTitlePage(){			
	fadeInOut.init({
		containerId: "fadeInOutDivId"
	});
	fadeInOut.fadeIn({
		speed: 1000,
		afterFadeInFunc: function(){
			$("#dzxgMainDivId").css({display: "none"});
			showContentPage();
		}
	}); 
}

function alertAreaInMap(areaCode){
	addAreaStyle({
		code: areaCode,
		style:{
			"fill": "#FF6A00",
			"filter":"alpha(opacity=50)",
			"-moz-opacity":"0.50",
			"opacity":"0.50"
		}
	});
}

function addAreaStyle(p){ 
	var codeLow = p.code.toLowerCase().trim();
	$("#mapMainDivId").find("path[areaname='" + codeLow + "']").css(p.style); 
}

function removeAreaStyle(p){ 
	var codeLow = p.code.toLowerCase().trim();
	$("#mapMainDivId").find("path[areaname='" + codeLow + "']").removeAttr("style");  
}

function unAlertAreaInMap(areaCode){
	removeAreaStyle({
		code: areaCode 
	});
}

function showContentPage(){

	$("#mapMainDivId").css({display: "block"});
	$("#areaNameMainDivId").css({display: "block"});
	
	//展示ppt
	$("#imgScrollerMainDivId").css({display: "block"});
	var imgScroller = new ImgScroller();
	imgScroller.init({
		containerId: "imgScrollerMainDivId", 
		firstPageWaitTime: 7000,
		pageWaitTime:7000,
		pageFadeInStepTime:50,
		pageFadeInStepCount:3,
		firstPagePosition:360,
		showCompletedFunc: function(){
			hiddenContentPage();
		},
		afterShowOneImageFunc: function(index, pageElement){  
			var areaCodeStr = $(pageElement).attr("areacode");
			var areaName = $(pageElement).attr("areaname");
			
			$("#areaNameMainDivId").text(areaName);
			
			var areaCodes = areaCodeStr.split(",");
			for(var i = 0; i < areaCodes.length; i++){ 
				alertAreaInMap(areaCodes[i].toLowerCase());
			}
			setTimeout(function(){
				for(var i = 0; i < areaCodes.length; i++){
					unAlertAreaInMap(areaCodes[i].toLowerCase());
				}
			}, 7000)
		}
	});
	
	fadeInOut.fadeOut({
		speed: 1000,
		afterFadeOutFunc: function(){}
	}); 
}

function hiddenContentPage(){		 
	fadeInOut.fadeIn({
		speed: 1000,
		afterFadeInFunc: function(){ }
	}); 
	
	var thanks = new Thanks();
	thanks.init({
		containerId: "thanksMainDivId"
	});
	 
	thanks.show({
		speed: 1000,
		afterShownFunc: function(){
			stopAudio();
		}
	}); 
}		

function stopAudio(){
	var audio = document.getElementById("backgroundAudioId"); 
	audio.pause(); 
}