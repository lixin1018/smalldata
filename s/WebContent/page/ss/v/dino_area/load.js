//背景音乐
$("#backgroundAudioSourceId").attr("src", basePath + "/rs/audios/dino/dino2.mp3");
$("#mapContainerDivId").load("../../../map/worldMap.svg");

//css
LazyLoad.css(["../../effect/fadeInOut/fadeInOut.css",
			"../../effect/thanks/thanks.css",
			"../../effect/dzxg/dzxg.css",
			"../../effect/bar/bar.css",
			"../../effect/imgScroller/imgScroller.css",
			"../dino_area/s.css"], function () {
	
});

//js
LazyLoad.js(["../../effect/fadeInOut/fadeInOut.js",
			"../../effect/dzxg/dzxg.js",
			"../../effect/thanks/thanks.js",
			"../../effect/bar/bar.js",
			"../../effect/imgScroller/imgScroller.js",
             "../dino_area/p.js"], 
	function () { 
		beginPlay();
	}
); 