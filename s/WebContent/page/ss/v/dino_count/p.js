var fadeInOut;
var endShowRandomBlock = false;

function beginPlay(){
	fadeInOut = new FadeInOut();
	showTitlePage();	
}

function showTitlePage(){			
	//开始打字
	autoType({
		elementClass: ".dzxgType-js",
		typingSpeed: 300,
		afterTypedFunc: function(){
			getDinoDataFromServer();					
		}
  	});
}

function getDinoDataFromServer(){
	var shuShuoDataAccess = new ShuShuoDataAccess();
	shuShuoDataAccess.getData({
		code:"dino_count",
		afterGetDataFunc: function(rows){ 
			initContentRandomBlocks(rows);
			hiddenTitlePage();
		}
	});
}

function initContentRandomBlocks(rows){
	for(var i = 0; i < rows.length; i++){
		var row = rows[i];
		var imgBlockId = cmnPcr.getRandomValue();
		var imgBlockHtml = "<div id=\"" + imgBlockId + "\" areaCode= \"" + row.area_code + "\" areaName= \"" + row.area_cn + "\" class=\"randomBlock_div\">" 
						+ "	<div class=\"randomBlock_divInner\" style=\"text-align:center;\"></div>"
						+ "	<div class=\"randomBlock_divContent\" ></div>"
						+ "</div>";
		$("#randomBlockMainDivId").append(imgBlockHtml);
		$("#" + imgBlockId).find(".randomBlock_divInner").text(row.name_cn + " " + row.name);  
		$("#" + imgBlockId).attr("areaName", row.area_cn);
		
		var dinoImageUrl = basePath + "/rs/images/dino/" + row.name + ".jpg";
		$("#" + imgBlockId).find(".randomBlock_divContent").css({"background-image":"url(" + dinoImageUrl + ")"}); 
	}

	//$("#imgScrollerMainDivId").find(".imgScroller_pageContainer").append("<div class=\"imgScroller_blankPage\"></div>");
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

function showContentPage(){ 
	$("#barContainerMainDivId").css({display: "block"}); 
	$("#randomBlockMainDivId").css({display: "block"});
	showCountBar();

	var randomBlock = new RandomBlock();
	randomBlock.init({
		containerId: "randomBlockMainDivId",
		fadeInTime: 500,
		fadeOutTime: 20000,
		blockIntervalTime:4000,
		showCompletedFunc: function(){
			endShowRandomBlock = true; 
		},
		afterShowOneBlockFunc: function(blockIndex, areaCodeStr, areaNameStr){
			var areaCodes = areaCodeStr.split(", ");
			var areaNames = areaNameStr.split(", ");
			for(var i = 0; i < areaCodes.length; i++){
				var areaCode = areaCodes[i].trim();
				var areaName = areaNames[i].trim();
				var areaInfo = areaCountDic[areaCode];
				if(areaInfo == null){
					areaInfo = {code: areaCode, title: areaName, value: 0, text: 0};
					areaCountDic[areaCode] = areaInfo;
				}
				areaInfo.value = areaInfo.value + 1;
				areaInfo.text = areaInfo.value;
			}
			refreshCountBar();
		}
	}); 
	
	fadeInOut.fadeOut({
		speed: 1000,
		afterFadeOutFunc: function(){}
	}); 
}

var areaCountDic = {};
var barGraphMovie = null;
function showCountBar(){
	barGraphMovie = new BarGraphMovie();
	barGraphMovie.init({
		containerId: "barInnerDivId",
		displayCount: 100,
		itemHeight: 30,
		itemSpaceBlankHeight: 3,
		itemTitleWidth: 150,
		itemValueWidth: 100,
		itemMaxValue: 100,
		itemBlockMaxWidth: 80	
	});
	refreshCountBar();
}

function refreshCountBar(){
	var items = new Array();
	for(var code in areaCountDic){
		var areaCountInfo = areaCountDic[code];
		items.push(areaCountInfo);
	}
	barGraphMovie.refreshGraph({
		items:items
	});

	if(endShowRandomBlock){
		setTimeout(function(){
			hiddenContentPage();
		}, 1000);				 
	} 
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