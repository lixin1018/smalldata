function autoType(p){
	var elementClass = p.elementClass;
	var typingSpeed = p.typingSpeed;
	var afterTypedFunc = p.afterTypedFunc;
	var thhis = $(elementClass);
	thhis.css({
		"position": "relative",
	    "display": "inline-block"
	}); 
	thhis = thhis.find(".dzxgText-js");
	var text = thhis.text().trim().split('');
	var amntOfChars = text.length;
	var newString = "";
	thhis.text(".");
	setTimeout(function(){
		thhis.css("opacity",1);
		thhis.prev().removeAttr("style");
		thhis.text("");
		for(var i = 0; i < amntOfChars; i++){
			(function(i,char){
				setTimeout(function() {        
					newString += char;
					thhis.text(newString);
					
					if(i == amntOfChars - 1){
						setTimeout(function(){
							afterTypedFunc();
						}, 2000);
					}
		        },
		        i * typingSpeed);
			})(i + 1, text[i]);
		}
	},1500);
}