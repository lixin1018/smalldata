//背景音乐
$("#backgroundAudioSourceId").attr("src", basePath + "/rs/audios/dino/dino1.mp3");

//css
LazyLoad.css(["../../effect/fog/fog.css", 
              "../../effect/pptSlider/pptSlider.css", 
              "../../effect/fadeInOut/fadeInOut.css",
              "../../effect/dzxg/dzxg.css",
              "../../effect/thanks/thanks.css",
              "../dino_size/s.css"], function () {
	
});

//js
LazyLoad.js(["../../effect/fog/fog.js", 
             "../../effect/pptSlider/pptSlider.js",
             "../../effect/fadeInOut/fadeInOut.js",
             "../../effect/dzxg/dzxg.js",
             "../../effect/thanks/thanks.js",
             "../dino_size/p.js"], 
	function () { 
		beginPlay();
	}
); 