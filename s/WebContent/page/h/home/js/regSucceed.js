function gotoHomePage(waitingTime){
	if(waitingTime == 0){
		location.href = "index.jsp";
	}
	else{
		waitingTime = waitingTime - 1;
		$("#redirectWaitingTimeId").empty();
		$("#redirectWaitingTimeId").text(waitingTime);
		setTimeout(function(){
			gotoHomePage(waitingTime);
		}, 1000);
	}
}
$(document).ready(function(){ 	
	gotoHomePage(6);	
});