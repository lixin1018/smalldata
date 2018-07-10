function FadeInOut(){ 
	var that = this;
	that.containerId = null;
	
	this.init = function(p){
		that.containerId = p.containerId;
	}
	
	
	this.fadeIn = function(p){
		$("#" + that.containerId).fadeIn(p.speed, p.afterFadeInFunc);
	}
	
	this.fadeOut= function(p){
		$("#" + that.containerId).fadeOut(p.speed, p.afterFadeOutFunc);
	}	
}