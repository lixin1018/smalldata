function Loading(){
	var that = this;
	that.containerId; 
    	
	this.init = function(p){
		that.containerId = p.containerId;		
	}
	
	this.show = function(){
		$("#" + that.containerId).css({display: "block"});
	}
	
	this.hidden = function(){
		$("#" + that.containerId).css({display: "none"});
	}
}