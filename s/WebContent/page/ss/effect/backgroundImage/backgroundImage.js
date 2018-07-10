function BackgroundImage(){
	var that = this;
	that.containerId; 
    	
	this.init = function(p){
		that.containerId = p.containerId;
		
		$("#" + that.containerId).css({display: "block"});
	}
}