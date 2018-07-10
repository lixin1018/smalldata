/**
 * 获取百度地图中的对象
 */
function NcpBaiduMap(){
	var that = this;
	this.map = null;

	this.doesContinue = false;
		
	//停止抓取数据
	this.stop = function(){
		this.doesContinue = true;
	}	 
	
	//参数containerId,posX,posY
	this.init = function(p){
		//创建Map实例
		this.map = new BMap.Map(p.containerId);
		
		//默认位置
		var posX = p.posX == null? 116.274625 : p.posX;
		var posY = p.posY == null? 39.961627 : p.posY;
		this.map.centerAndZoom(new BMap.Point(posX, posY), 11);         
		
		//启用滚轮放大缩小
		this.map.enableScrollWheelZoom();     
		
		//初始化结果Grid展示区域
		this.initInfoGrid(p.infoGridContainerId);
	}

	//初始化结果Grid展示区域
	this.initInfoGrid = function(infoGridContainerId){
		
	}
	
	//参数keywords,posAX,posAY,posBX,posBY
	this.searchInBounds = function(p){
		this.doesContinue = true;
		var allResults = new Array();
		var pageNum = 1;
		var local = new BMap.LocalSearch(this.map, {
			renderOptions:{map: this.map, panel: p.renderContainerId},
			pageCapacity:10,
			onSearchComplete:function(results){
				if(results!=null){					
					var locs = results.Vq;
					if(locs != null && locs.length != 0){
						for(var i=0;i<locs.length;i++){
							var loc = locs[i];
							var hasIt = false;
							for(var j=0; j<allResults.length; j++){
								var r = allResults[j];
								if(r.uid == loc.uid){
									hasIt = true;
									break;
								}
							}
							if(!hasIt){
								allResults.push(loc);
							}
						}
						pageNum++;
						if(that.doesContinue){
							local.gotoPage(pageNum);
						}
					}
				}
				else{
					if(p.afterGetResults != null){
						p.afterGetResults({
							results: allResults
						});
					}
				}
			}
		});
		
		local.disableFirstResultSelection();
		local.disableAutoViewport();
		var pStart = new BMap.Point(p.posAX, p.posAY);
		var pEnd = new BMap.Point(p.posBX, p.posBY);
		var bs = new BMap.Bounds(pStart,pEnd);   //自己规定范围
		local.searchInBounds(p.keywords, bs);

		var polygon = new BMap.Polygon([
			new BMap.Point(pStart.lng,pStart.lat),
			new BMap.Point(pEnd.lng,pStart.lat),
			new BMap.Point(pEnd.lng,pEnd.lat),
			new BMap.Point(pStart.lng,pEnd.lat)
			], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
		this.map.addOverlay(polygon); 
		
	}
} 