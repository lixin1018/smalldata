function PPTSlider(){
	var that = this;
	that.containerId;
	that.firstPageWaitTime;
	that.pageWaitTime;
	that.pageFadeInStepTime;
	that.pageFadeInStepCount; 
	that.afterShowOnePageFunc;
	
	that.init = function(p){ 
		that.containerId = p.containerId;
		that.showCompletedFunc = p.showCompletedFunc;
		that.firstPageWaitTime = p.firstPageWaitTime;
		that.pageWaitTime = p.pageWaitTime;
		that.pageFadeInStepTime = p.pageFadeInStepTime;
		that.pageFadeInStepCount = p.pageFadeInStepCount;
		that.afterShowOnePageFunc = p.afterShowOnePageFunc;
		
		totalPPTPageCount = $("#" + that.containerId).find(".pptSlider_page").length;
		var firstPage = $("#" + that.containerId).find(".pptSlider_page")[0];
		$(firstPage).addClass("pptSlider_show");
		$(firstPage).css({left: "0px"});
		setTimeout(function(){
			that.afterShowOnePageFunc({
				nextPageIndex: 1
			});
		}, that.firstPageWaitTime);
		
	}
	
	that.showAutoSlidePPT = function(inIndex){
		var allPages = $("#" + that.containerId).find(".pptSlider_page");
		var totalPPTPageCount = $("#" + that.containerId).find(".pptSlider_page").length;
		if(inIndex >= totalPPTPageCount){		
			throw "page index error.";
		}
		else{
			var outPageIndex = inIndex > 0 ? (inIndex - 1) : (totalPPTPageCount - 1); 
			var inPage = $("#" + that.containerId).find(".pptSlider_page")[inIndex];
			$(inPage).addClass("pptSlider_show");	
			$(inPage).css({left: $(inPage).width() + "px"});
			that.pptPageSlideStep(outPageIndex, inIndex);
		}
	} 
	
	that.pptPageSlideStep = function(outIndex, inIndex){
		var outPage = $("#" + that.containerId).find(".pptSlider_page")[outIndex];
		var inPage = $("#" + that.containerId).find(".pptSlider_page")[inIndex];
		var outPageLeft = this.getLeft(outPage);
		var inPageLeft = this.getLeft(inPage);
		var stepWidth = (inPageLeft - outPageLeft) / that.pageFadeInStepCount;
		var nextInPageLeft = inPageLeft - stepWidth;
		var nextOutPageLeft= outPageLeft - stepWidth;
		if(nextInPageLeft <= 0){   
			$(outPage).removeClass("pptSlider_show");
			$(inPage).css({left: "0px"});
			setTimeout(function(){
				that.afterShowOnePageFunc({
					nextPageIndex: inIndex + 1
				});
			}, that.pageWaitTime); 
		}
		else{
			$(inPage).css({left: nextInPageLeft + "px"});
			$(outPage).css({left: nextOutPageLeft + "px"});
			setTimeout(function(){
				that.pptPageSlideStep(outIndex, inIndex);
			}, that.pageFadeInStepTime);
		}
	}
	
	this.getLeft = function(element){
		var left = element.offsetLeft;
		return left;
	}
	
	this.getTop = function(element){
		var top = element.offsetTop;
		return top;
	}
}