function Thanks(){ 
	var that = this;
	that.containerId = null;
	
	this.init = function(p){
		that.containerId = p.containerId;
	}
	
	
	this.show = function(p){
		$("#" + that.containerId).fadeIn(p.speed, p.afterShownFunc);
	} 
}