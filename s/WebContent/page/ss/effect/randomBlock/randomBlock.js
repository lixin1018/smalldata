function RandomBlock(){
	var that = this;
	that.containerId;
	that.fadeInTime;
	that.fadeOutTime; 
	this.blockIntervalTime;
	that.blockCount = 0;
	that.showCompletedFunc;
	that.afterShowOneBlockFunc;
	
	that.init = function(p){ 
		that.containerId = p.containerId;
		that.showCompletedFunc = p.showCompletedFunc;
		that.afterShowOneBlockFunc = p.afterShowOneBlockFunc;
		that.fadeInTime = p.fadeInTime;
		that.fadeOutTime = p.fadeOutTime;
		that.blockIntervalTime = p.blockIntervalTime;
		that.blockCount  = $("#" + that.containerId).find(".randomBlock_div").length;
		that.showBlock(0); 	
	}
	
	that.showBlock = function(blockIndex){
		var allBlocks = $("#" + that.containerId).find(".randomBlock_div"); 
		if(blockIndex == that.blockCount){	 
			that.showCompletedFunc();  
		}
		else{ 
			var block = $("#" + that.containerId).find(".randomBlock_div")[blockIndex]; 
			$(block).css({
				"z-index": 100 + blockIndex,
				"left": Math.random() * $("#" + that.containerId).width(),
				"top": Math.random() * $("#" + that.containerId).height(),
			});
			
			$(block).fadeIn(that.fadeInTime, 
				function(){
					var areaCodeStr = $(block).attr("areaCode");
					var areaNameStr = $(block).attr("areaName");
					that.afterShowOneBlockFunc(blockIndex, areaCodeStr, areaNameStr);					
					$(block).fadeOut(that.fadeOutTime);
				}
			);
			setTimeout(function(){
				that.showBlock(blockIndex + 1);
			}, that.blockIntervalTime);		
		}
	}  
}