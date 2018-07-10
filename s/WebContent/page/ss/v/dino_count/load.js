//背景音乐
$("#backgroundAudioSourceId").attr("src", basePath + "/rs/audios/dino/dino2.mp3");

//css
LazyLoad.css(["../../effect/fadeInOut/fadeInOut.css",
				"../../effect/dzxg/dzxg.css",
				"../../effect/bar/bar.css", 
				"../../effect/thanks/thanks.css",
				"../../effect/randomBlock/randomBlock.css", 
				"../dino_count/s.css"], function () {
	
});

//js
LazyLoad.js(["../../effect/fadeInOut/fadeInOut.js",
			"../../effect/dzxg/dzxg.js",
			"../../effect/thanks/thanks.js",
			"../../effect/bar/bar.js",
			"../../effect/randomBlock/randomBlock.js",
             "../dino_count/p.js"], 
	function () { 
		beginPlay();
	}
); 