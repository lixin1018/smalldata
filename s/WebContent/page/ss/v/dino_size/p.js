var fadeInOut;
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
		code:"dino_size",
		afterGetDataFunc: function(rows){ 
			initContentPPTPages(rows);
			hiddenTitlePage();
		}
	})
}

function initContentPPTPages(rows){
	for(var i = 0; i < rows.length; i++){
		var row = rows[i];
		var pptPageId = cmnPcr.getRandomValue();
		var pptPageHtml = "<div id=\"" + pptPageId + "\" class=\"pptSlider_page\">"
						+ " <div class=\"pptSlider_pageInner\"></div>"
						+ " <div class=\"pptSlider_pageContent\" style=\"color:#ffffff;font-size:15px;font-family: 'Verdana','Microsoft YaHei','黑体','宋体',sans-serif;\">"
						+ "		<div name=\"name_cn\" style=\"position:absolute;left:60px;top:260px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">包头龙</div>"
						+ "		<div name=\"length_cn\" style=\"position:absolute;left:60px;top:290px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">体长: 7.0米</div>"
						+ "		<div name=\"diet_cn\" style=\"position:absolute;left:60px;top:320px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">食性: 植食</div>"
						+ "		<div name=\"area_cn\" style=\"position:absolute;left:60px;top:350px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">国家/地区: 加拿大, 美国</div>"
						+ "		<div name=\"period_cn\" style=\"position:absolute;left:60px;top:380px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">时期: 白垩纪晚期, 76-70万年前</div>"
						+ "		<div name=\"name_en\" style=\"position:absolute;left:460px;top:260px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">Euoplocephalus</div>"
						+ "		<div name=\"length_en\" style=\"position:absolute;left:460px;top:290px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">Body: 7.0m</div>"
						+ "		<div name=\"diet_en\" style=\"position:absolute;left:460px;top:320px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">Diet: Herbivorous</div>"
						+ "		<div name=\"area_en\" style=\"position:absolute;left:460px;top:350px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">Countries or regions: Canada, USA</div>"
						+ "		<div name=\"period_en\" style=\"position:absolute;left:460px;top:380px;width:400px;height:30px;font-size:20px;text-align:left;line-height:30px;\">Period: Late Cretaceous, 76-70 million years ago</div>"
						+ "		<div style=\"position:absolute;left:20px;right:20px;top:20px;height:200px;background-color:#ffffff;border-radius: 15px;\">"
						+ "			<div name=\"vs_left\" style=\"position:absolute;left:300px;top:20px;width:300px;height:180px;background-size:contain; background-repeat:no-repeat;background-position:center;\" ></div>"
						+ "			<div name=\"vs_name\" style=\"position:absolute;left:300px;top:10px;width:300px;height:30px;text-align:left;color:#000000;font-size:22px;\"></div>"
						+ "			<div style=\"position:absolute;left:75px;top:0px;width:100px;height:80px;background-image:url(" + basePath + "/rs/images/compare/car.jpg);background-size:contain;background-repeat:no-repeat; background-position:bottom;\" ></div>"
						+ "			<div style=\"position:absolute;left:50px;top:80px;width:200px;height:80px;background-image:url(" + basePath + "/rs/images/compare/bus.jpg);background-size:contain;background-repeat:no-repeat; background-position:bottom;\" ></div>"
						+ "			<div style=\"position:absolute;left:200px;top:00px;width:22px;height:80px;background-image:url(" + basePath + "/rs/images/compare/man.jpg);background-size:contain;background-repeat:no-repeat; background-position:bottom;\" ></div>"
						+ "			<div name=\"vs_description\" style=\"display:none;position:absolute;right:20px;top:10px;width:300px;height:30px;text-align:right;color:red;font-size:20px;\"></div>"
						+ "		</div>"
						+ "	</div>"
						+ "</div>";
		$("#pptSliderMainDivId").append(pptPageHtml);
		$("#" + pptPageId).find("div[name='name_cn']").text("名称: " + row.name_cn);
		$("#" + pptPageId).find("div[name='length_cn']").text("体长: " + row.body_length + "米");
		$("#" + pptPageId).find("div[name='diet_cn']").text("食性: " + row.diet_cn);
		$("#" + pptPageId).find("div[name='area_cn']").text("国家/地区: " + row.area_cn);
		$("#" + pptPageId).find("div[name='period_cn']").text("时期: " + row.full_period_cn);
		$("#" + pptPageId).find("div[name='name_en']").text("Name: " + row.name);
		$("#" + pptPageId).find("div[name='length_en']").text("Body: " + row.body_length + "m");
		$("#" + pptPageId).find("div[name='diet_en']").text("Diet: " + row.diet);
		$("#" + pptPageId).find("div[name='area_en']").text("Countries: " + row.area);
		$("#" + pptPageId).find("div[name='period_en']").text("Period: " + row.full_period);

		var compareImageUrl = "";
		var bodyLength = parseFloat(row.body_length);
		var dinoDivWidth = bodyLength * 20; 
		var vs_text = row.name_cn + " 身长" + row.body_length + "米";	 
		var dinoImageUrl = basePath + "/rs/images/dino/" + row.name + ".jpg";
		$("#" + pptPageId).find("div[name='vs_left']").css({"background-image":"url(" + dinoImageUrl + ")"}); 
		$("#" + pptPageId).find("div[name='vs_name']").text(vs_text);
		$("#" + pptPageId).find("div[name='vs_left']").width(dinoDivWidth); 
		
		if(bodyLength < 1){
			$("#" + pptPageId).find("div[name='vs_description']").text("~~~太小, 看不见啊");
			$("#" + pptPageId).find("div[name='vs_description']").css({display: "block"});
		}
		else if(bodyLength > 15){
			$("#" + pptPageId).find("div[name='vs_description']").text("哇, 好大!!!!!!");
			$("#" + pptPageId).find("div[name='vs_description']").css({display: "block"});
		}
	}
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

	//显示背景雾层
	$("#fogMainDivId").css({display: "block"});
	var fog = new Fog();
	fog.init({
		containerId: "fogMainDivId"
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
		showCompletedFunc: function(){
			hiddenContentPage()
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