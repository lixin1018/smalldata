function gotoLoginPage(waitingTime){
	if(waitingTime == 0){
		location.href = "../home/login.jsp";
	}
	else{
		waitingTime = waitingTime - 1;
		$("#redirectWaitingTimeId").empty();
		$("#redirectWaitingTimeId").text(waitingTime);
		setTimeout(function(){
			gotoLoginPage(waitingTime);
		}, 1000);
	}
}
$(document).ready(function(){ 	
	gotoLoginPage(6);	
});