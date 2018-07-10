function BarGraphMovie(){
	var that = this;
	that.containerId = null;
	that.displayCount = 10;
	that.itemHeight = 30;
	that.itemSpaceBlankHeight = 5;
	that.itemTitleWidth = 50;
	that.itemValueWidth = 100;
	that.itemMaxValue = 1000;	
	that.itemBlockMaxWidth = 1000;	
	that.moveStepCount = 5;
	that.widthStepCount = 5;
	
	this.refreshGraph = function(p){
		that.addNewItems(p.items);
		that.refreshItemValues(p.items); 
	} 
	
	this.refreshItemValues = function(newItems){
		for(var i = 0; i < newItems.length; i++){
			var newItem = newItems[i];
			var newItemElement = $("#" + that.containerId).find(".barItemDiv[itemName='" + newItem.code + "']");
			if(newItemElement.length != 0){
				$(newItemElement).find(".barItemTitle").text(newItem.title);
				$(newItemElement).find(".barItemValue").text(" " + newItem.text);				
				$(newItemElement).attr("itemValue", newItem.value);				
				var newWidth = newItem.value * that.itemBlockMaxWidth / that.itemMaxValue;
				newWidth = newWidth < 1 ? 1 : newWidth;
				var oldWidth = $(newItemElement).find(".barItemBlock").width();
				
				if(oldWidth != newWidth){
					var oneStepWidth = (newWidth - oldWidth) / that.widthStepCount;
					$(newItemElement).attr("oneStepWidth", oneStepWidth);
					$(newItemElement).attr("newWidth", newWidth);				
				}
				else{
					$(newItemElement).removeAttr("oneStepWidth");
					$(newItemElement).removeAttr("newWidth");		
				} 	
			}
		}				
		setTimeout(function(){
			that.changeItemWidth(1);
		}, 50);
	}
	
	this.changeItemWidth = function(stepNum){
		var itemElements = $("#" + that.containerId).find(".barItemDiv");
		if(stepNum == that.widthStepCount){
			for(var i = 0; i < itemElements.length; i++){
				var itemElement = itemElements[i];
				var newWidthStr = $(itemElement).attr("newWidth");
				var newWidth = newWidthStr == null ? null : parseFloat(newWidthStr);
				if(newWidth != null){
					$(itemElement).find(".barItemBlock").width(newWidth);				
				}
			}
			this.refreshRank();
		}
		else{
			for(var i = 0; i < itemElements.length; i++){
				var itemElement = itemElements[i];
				var oneStepWidthStr =  $(itemElement).attr("oneStepWidth");
				var oneStepWidth = oneStepWidthStr == null ? null : parseFloat(oneStepWidthStr);
				if(oneStepWidth != null){
					var lastWidth = $(itemElement).find(".barItemBlock").width();
					var nextWidth = lastWidth + oneStepWidth;
					$(itemElement).find(".barItemBlock").width(nextWidth);					
				}
			}
			setTimeout(function(){
				that.changeItemWidth(stepNum + 1);
			}, 50);
		}
	}	
	
	this.refreshRank = function(){
		var itemElements = $("#" + that.containerId).find(".barItemDiv");
		var itemHash = {};
		var rankedItems = new Array();
		for(var i = 0; i < itemElements.length; i++){
			var itemElement = itemElements[i];
			var itemName = $(itemElement).attr("itemName");
			var itemValue = parseFloat( $(itemElement).attr("itemValue"));
			itemHash[itemName] = {code: itemName, value: itemValue};
		}
		for(var i = 0; i < itemElements.length; i++){
			var maxValueItem = null;
			for(var code in itemHash) {
				var item = itemHash[code]; 
				if(maxValueItem == null || item.value > maxValueItem.value){
					maxValueItem = item;
				}
			}
			rankedItems.push(maxValueItem); 
			delete itemHash[maxValueItem.code];
		}
		for(var i = 0; i < rankedItems.length; i++){
			var item = rankedItems[i];
			var itemElement = $("#" + that.containerId).find(".barItemDiv[itemName='" + item.code + "']")[0]; 
			$(itemElement).attr("rank", i);
			var newTop = i * (that.itemSpaceBlankHeight * 2 + that.itemHeight) + that.itemSpaceBlankHeight;
			var oldTop = this.getTop(itemElement);
			if(newTop != oldTop){
				var oneStepDistance = (newTop - oldTop) / that.moveStepCount;
				$(itemElement).attr("oneStepDistance", oneStepDistance);
				$(itemElement).attr("newTop", newTop);				
			}
			else{
				$(itemElement).removeAttr("oneStepDistance");
				$(itemElement).removeAttr("newTop");		
			}
		}
		
		setTimeout(function(){
			that.moveItem(1);
		},1000);
	}
	
	this.moveItem = function(stepNum){
		var itemElements = $("#" + that.containerId).find(".barItemDiv");
		if(stepNum == that.moveStepCount){
			for(var i = 0; i < itemElements.length; i++){
				var itemElement = itemElements[i];
				var newTopStr = $(itemElement).attr("newTop");
				var newTop = newTopStr == null ? null : parseFloat(newTopStr);
				if(newTop != null){
					$(itemElement).css({top: newTop});				
				}
			}
		}
		else{
			for(var i = 0; i < itemElements.length; i++){
				var itemElement = itemElements[i];
				var oneStepDistanceStr =  $(itemElement).attr("oneStepDistance");
				var oneStepDistance = oneStepDistanceStr == null ? null : parseFloat(oneStepDistanceStr);
				if(oneStepDistance != null){
					var lastTop = this.getTop(itemElement);
					var nextTop = lastTop + oneStepDistance;
					$(itemElement).css({top: nextTop});				
				}
			}
			setTimeout(function(){
				that.moveItem(stepNum + 1);
			},50);
		}
	}
	
	this.addNewItems = function(newItems){ 
		for(var i = 0; i < newItems.length; i++){
			var newItem = newItems[i];
			var newItemElement = $("#" + that.containerId).find(".barItemDiv[itemName='" + newItem.code + "']");
			if(newItemElement.length == 0){
				var itemIndex =  $("#" + that.containerId).find(".barItemDiv").length; 
				var top = itemIndex * (that.itemSpaceBlankHeight * 2 + that.itemHeight) + that.itemSpaceBlankHeight;
				var itemHtml = "<div class=\"barItemDiv\" itemName=\"" + newItem.code + "\" itemValue=\"" + newItem.value + "\" style=\"top:" + top + "px;\">" 
					+ "<div class=\"barItemTitle\"></div>"
					+ "<div class=\"barItemSpace\"></div>"
					+ "<div class=\"barItemBlock\" style=\"width:1px;\"></div>"
					+ "<div class=\"barItemSpace\"></div>"
					+ "<div class=\"barItemValue\"></div>"
					+ "<div class=\"barItemBlank\"></div></div>";
				$("#" + that.containerId).append(itemHtml);
			}
		}
	}
		
	this.init = function(p){
		that.containerId = p.containerId;
		that.displayCount = p.displayCount;
		that.itemHeight = p.itemHeight;
		that.itemSpaceBlankHeight = p.itemSpaceBlankHeight;
		that.itemTitleWidth = p.itemTitleWidth;
		that.itemValueWidth = p.itemValueWidth;
		that.itemMaxValue = p.itemMaxValue;
		that.itemBlockMaxWidth = p.itemBlockMaxWidth;	
	}
	
	this.getLeft = function(element){
		var left = element.offsetLeft;
		return left;
	}
	
	this.getTop = function(element){
		var top = element.offsetTop;
		return top;
	}
}