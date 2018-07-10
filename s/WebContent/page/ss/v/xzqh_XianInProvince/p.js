var fadeInOut;
var shengRows;
var xianshiRows;
var shengToXianshiDic;
var loading;
var pagesLoadCompletedArgs = {}; 
function beginPlay(){
	loading = new Loading();
	loading.init({
		containerId: "loadingMainDivId"
	}); 
	loadMapPointsInfos();
	fadeInOut = new FadeInOut();
	showTitlePage();	
}

function checkPageLoadComplete(p){
	if(pagesLoadCompletedArgs[p.key]){
		loading.hidden();
		p.showNextPageFunc();
	}
	else{
		loading.show();
		setTimeout(function(){
			checkPageLoadComplete(p);
		}, 1000);
	}
}

function loadMapPointsInfos(){	
	var mapPointFileUrls = [
		"../../../map/allDistrictMainPoints.js",
        "../../../map/allNamePoints.js"];
	LazyLoad.js(mapPointFileUrls, 
		function () {	
			getShengDataFromServer();
		}
	);			
}

function showTitlePage(){
	//开始打字
	autoType({
		elementClass: ".dzxgType-js",
		typingSpeed: 300,
		afterTypedFunc: function(){
			checkPageLoadComplete({
				key: "indexData",
				showNextPageFunc: function(){
					showFirstPage();
				}
			});
		}
  	});
}

function showFirstPage(){
	var firstDm = shengRows[0].dm;
	checkPageLoadComplete({
		key: firstDm,
		showNextPageFunc: function(){
			hiddenTitlePage();
		}
	});
}

function getShengDataFromServer(){
	var shuShuoDataAccess = new ShuShuoDataAccess();
	shuShuoDataAccess.getData({
		code:"xzqh_sheng",
		afterGetDataFunc: function(rows){ 			
			var dmArray = new Array();
			var rowHash = {};
			for(var i = 0; i < rows.length; i++){
				var row = rows[i];
				dmArray.push(row.dm);
				rowHash[row.dm] = row;
			}
			dmArray = dmArray.sort();
			shengRows = new Array();
			for(var i = 0; i < dmArray.length; i++){ 
				shengRows.push(rowHash[dmArray[i]]);
			}

			pagesLoadCompletedArgs["indexData"] = true;
			initContentPPTPages(); 
			getXianshiDataFromServer();
		}
	})
}

function getXianshiDataFromServer(){
	var shuShuoDataAccess = new ShuShuoDataAccess();
	shuShuoDataAccess.getData({
		code:"xzqh_xianshi",
		afterGetDataFunc: function(rows){ 
			xianshiRows = rows;
			initShengToXianshiDic();
			loadProvinceMaps(0);
		}
	})
}

function initShengToXianshiDic(){	
	shengToXianshiDic = {}; 
	for(var i = 0; i < shengRows.length; i++){
		var shengRow = shengRows[i];
		var shengDm = shengRow.dm;
		shengToXianshiDic[shengDm] = new Array();
		var shengDmPrefix = shengDm.substr(0, 2);
		for(var j = 0; j < xianshiRows.length; j++){
			var xianshiRow = xianshiRows[j];
			var xianshiDm = xianshiRow.dm;
			if(shengDmPrefix == xianshiDm.substr(0, 2)){
				shengToXianshiDic[shengDm].push(xianshiRow);
			}
		}
	}
}

function loadProvinceMaps(shengIndex){  
	if(shengRows.length > shengIndex){
		var row = shengRows[shengIndex];
		var dm = row.dm;
		var url = "../../../map/sources/" + dm + "_L2.js";
		LazyLoad.js([url], 
			function () {	
				var row = shengRows[shengIndex];
				var dm = row.dm;
				var mc = row.mc;
				pagesLoadCompletedArgs[dm] = true;
		
				var svgContainerId = dm +"_svgContainer";
				var pptPageId = dm +"pptPage";
				var boundaryInfo = boundaryList[dm + "_L2"]; 
				drawMapBoundary({
					boundaryInfo: boundaryInfo,
					allNamePoints: allNamePoints,
					allDistrictMainPoints: allDistrictMainPoints,
					canvasWidth: 600,
					canvasHeight: 480,
					borderWidth: 30,
					svgElementId: svgContainerId
				});
				
				$("#" + pptPageId).find("div[name='name_cn']").text(mc); 
		 		var xianshiRowsInProvince = shengToXianshiDic[dm];
		 		for(var j = 0; j < xianshiRowsInProvince.length; j++){
					var xianshiRow = xianshiRowsInProvince[j];
		 			alertArea({
						code: xianshiRow.dm,
						fillColor: "#C4ECFF",
						strokeColor: "#6BB5EA",
						showName: false,
						govPoint: false
					});
		 		}
		 		loadProvinceMaps(shengIndex + 1);
			}
		); 
	}
}

function initContentPPTPages(){
	for(var i = 0; i < shengRows.length; i++){
		var shengRow = shengRows[i];
		var dm = shengRow.dm;
		var mc = shengRow.mc;
		var svgContainerId = dm +"_svgContainer";
		var pptPageId = dm +"pptPage";
		var pptPageHtml = "<div id=\"" + pptPageId + "\" class=\"pptSlider_page\">"
						+ " <div class=\"pptSlider_pageInner\"></div>"
						+ " <div class=\"pptSlider_pageContent\" style=\"top:0px;bottom:0px;right:0px;left:0px;color:#ffffff;font-size:15px;font-family: 'Verdana','Microsoft YaHei','黑体','宋体',sans-serif;\">"
						+ "		<div name=\"name_cn\" style=\"position:absolute;left:100px;top:100px;width:400px;height:40px;font-size:30px;text-align:left;line-height:30px;\"></div>"
						+ "		<div style=\"position:absolute;width:600px;right:20px;top:30px;height:480px;\">"
						+ "          <svg id=\"" + svgContainerId + "\" xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" height=\"480\" width=\"600\"></svg>"
						+ "		</div>"
						+ "	</div>"
						+ "</div>";
		$("#pptSliderMainDivId").append(pptPageHtml);
	}
}

function hiddenTitlePage(){			
	fadeInOut.init({
		containerId: "fadeInOutDivId"
	});
	fadeInOut.fadeIn({
		speed: 100,
		afterFadeInFunc: function(){
			$("#dzxgMainDivId").css({display: "none"});
			showContentPage();
		}
	}); 
}

function showContentPage(){

	//显示背景 
	var backgroundImage = new BackgroundImage();
	backgroundImage.init({
		containerId: "backgroundImageMainDivId"
	});
	
	//展示ppt
	$("#pptSliderMainDivId").css({display: "block"});
	var pptSlider = new PPTSlider();
	pptSlider.init({
		containerId: "pptSliderMainDivId",
		firstPageWaitTime: 8000,
		pageWaitTime:7000,
		pageFadeInStepTime:50,
		pageFadeInStepCount:10,
		afterShowOnePageFunc: function(p){
			var nextPageIndex = p.nextPageIndex;
			if(nextPageIndex >= shengRows.length){
				hiddenContentPage();
			}
			else{
				var shengDm = shengRows[nextPageIndex].dm;
				checkPageLoadComplete({
					key: shengDm,
					showNextPageFunc: function(){
						pptSlider.showAutoSlidePPT(nextPageIndex);
					}	
				});	
			}		
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
		}
	}); 
}	 