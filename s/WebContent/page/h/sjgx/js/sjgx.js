$(document).ready(function(){
	cPage = new commonPage();
	
	cPage.initNav(navList);
	
	$("#maxContentCenterButton").click(function(){
		var isMax = $(this).attr("isMax") == "1"; 
		cPage.maxContentCenter(!isMax); 
		$(this).attr("isMax", isMax ? "0" : "1"); 
		return false;
	});
	
	$(".leftItemContainer").each(function(){
		var name = $(this).attr("name");
		if(itemName == name){
			$(this).addClass("leftItemContainerFocus");
		}
	});
	
});