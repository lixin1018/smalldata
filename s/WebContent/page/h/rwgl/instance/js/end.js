function EndWindow(){
	var that = this;
	this.instanceId = null;
	this.stepId = null; 
	this.afterOkFunction = null; 
	
	this.show = function(p){
		this.afterOkFunction = p.afterOkFunction;
		
    	if(msgBox.confirm({info: "确定要设为完成状态吗?"})){
    		this.afterOkFunction(p.instanceId, p.stepId);
		} 
	}
} 

