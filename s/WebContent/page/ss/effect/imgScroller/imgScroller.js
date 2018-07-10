function ImgScroller(){
	var that = this;
	that.containerId;
	that.firstPageWaitTime;
	that.firstPagePosition;
	that.pageWaitTime;
	that.pageFadeInStepTime;
	that.pageFadeInStepCount;
	that.showCompletedFunc;
	that.afterShowOneImageFunc;
	that.imageCount = 0;
	
	that.init = function(p){ 
		that.containerId = p.containerId;
		that.showCompletedFunc = p.showCompletedFunc;
		that.afterShowOneImageFunc = p.afterShowOneImageFunc;
		that.firstPageWaitTime = p.firstPageWaitTime;
		that.firstPagePosition = p.firstPagePosition;
		that.pageWaitTime = p.pageWaitTime;
		that.pageFadeInStepTime = p.pageFadeInStepTime;
		that.pageFadeInStepCount = p.pageFadeInStepCount;
		that.imageCount  = $("#" + that.containerId).find(".imgScroller_page").length; 
		var pageContainer = $("#" + that.containerId).find(".imgScroller_pageContainer");
		var firstPage = $("#" + that.containerId).find(".imgScroller_page")[0];
		$(firstPage).find(".imgScroller_pageInner").addClass("imgScroller_show");	
		$(firstPage).find(".imgScroller_pageContent").addClass("imgScroller_show");	
		$(pageContainer).css({left: this.firstPagePosition});
		
		that.afterShowOneImageFunc(0, firstPage);
			
		setTimeout(function(){
			that.showAutoScrollImage(1);
		}, that.firstPageWaitTime);		
	}
	
	that.showAutoScrollImage = function(inIndex){
		var allPages = $("#" + that.containerId).find(".imgScroller_page"); 
		if(inIndex == that.imageCount){		
			inIndex = 0;
			that.showCompletedFunc(); 
			//不循环播放
		}
		else{
			var outPageIndex = inIndex > 0 ? (inIndex - 1) : (that.imageCount - 1); 
			var inPage = $("#" + that.containerId).find(".imgScroller_page")[inIndex];
			$(inPage).find(".imgScroller_pageInner").addClass("imgScroller_show");
			$(inPage).find(".imgScroller_pageContent").addClass("imgScroller_show");
			that.pptPageScrollStep(outPageIndex, inIndex);
		}
	} 
	
	that.pptPageScrollStep = function(outIndex, inIndex){
		var pageContainer = $("#" + that.containerId).find(".imgScroller_pageContainer")[0];
		var outPage = $("#" + that.containerId).find(".imgScroller_page")[outIndex];
		var inPage = $("#" + that.containerId).find(".imgScroller_page")[inIndex];
		var outPageWidth = $(outPage).width(); 
		var stepWidth = outPageWidth / that.pageFadeInStepCount;
		
		var inLeft = that.getLeft(pageContainer) + that.getLeft(inPage); 
		if(inLeft <= that.firstPagePosition){   
			var newLeft = that.firstPagePosition - that.getLeft(inPage);
			$(pageContainer).css({left: newLeft + "px"}); 
			
			that.afterShowOneImageFunc(inIndex, inPage);
			setTimeout(function(){
				that.showAutoScrollImage(inIndex + 1);
			}, that.pageWaitTime); 
		}
		else{
			$(outPage).find(".imgScroller_pageInner").removeClass("imgScroller_show");
			$(outPage).find(".imgScroller_pageContent").removeClass("imgScroller_show");
			var newLeft = that.getLeft(pageContainer) - stepWidth;
			$(pageContainer).css({left: newLeft + "px"}); 
			setTimeout(function(){
				that.pptPageScrollStep(outIndex, inIndex);
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