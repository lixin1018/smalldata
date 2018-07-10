<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" %>
<%@ include file="../basePage.jsp" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>测试列表编辑</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">  
	<style type="text/css">
		.propertyEditorDiv{
			text-align:left;
		}
		.propertyNameDiv{
			font-size:12px;
			color:#000000;
			line-height:30px;
			text-align:right;
			paddding-right:5px;
			width:70px;
			display:-moz-inline-box; 
			display:inline-block; 
		}
		.listPropertyBox{
			font-size:12px;
			color:#000000; 
			margin-right:5px;
			margin-left:5px;
			width:214px;
			display:-moz-inline-box; 
			display:inline-block; 
			height:21px;
			line-height:21px;  
		}
		.inputPropertyBox{
			font-size:12px;
			color:#000000; 
			margin-right:5px;
			margin-left:5px;
			width:150px;
			display:-moz-inline-box; 
			display:inline-block; 
			height:18px;
			line-height:18px;  
		}
		.commonPropertyBox{
			font-size:12px;
			color:#000000; 
			border-style:solid;
			border-width:1px;
			border-color:#A9A9A9;
			margin-right:5px;
			margin-left:5px;
			width:100px;
			display:-moz-inline-box; 
			display:inline-block; 
			height:21px;
			line-height:21px;
			text-align:center;
			cursor:pointer;
		}
		.commonPropertyBoxSelected{
			color:#E36B0C;
			font-weight:800;
			border-color:#E36B0C;
			background-color:#FFFFD8;
		}
	</style>
	<script type="text/javascript" src="propertyEditor.js"></script>
	<script> 
		$(document).ready(function(){	
			var p ={
				containerId:"testDiv",
				typeProperties:[
					{	"propertyName":"telNumA",
					 	"fieldName":"",
					 	"showName":"号码A",
					 	"valueType":"inputTypePropertyEditor",
					 	"description":"请录入号码A"
					},		
					{	"propertyName":"telNumB",
					 	"fieldName":"",
					 	"showName":"号码B",
					 	"valueType":"inputTypePropertyEditor",
					 	"description":"请录入号码B"
					},		
					{	"propertyName":"color",
					 	"fieldName":"color",
					 	"showName":"颜色",
					 	"description":"请选择颜色",
					 	"values":[ {"value":"红色", "description":""},{"value":"粉色", "description":""},{"value":"蓝色", "description":""},{"value":"灰色", "description":""},{"value":"白色", "description":""},{"value":"黑色", "description":""},{"value":"金色", "description":""}]
					},		
					{ 	"propertyName":"romSize",
					 	"fieldName":"romSize",
					 	"showName":"ROM容量",
					 	"description":"请选择ROM容量",
					 	"values":[ {"value":"4G", "description":""}, {"value":"8G", "description":""}, {"value":"16G", "description":""}, {"value":"32G", "description":""}, {"value":"64G", "description":""} ]
					},					
					{	"propertyName":"simType",
					 	"fieldName":"",
					 	"showName":"套餐类型",
					 	"description":"请选择套餐类型",
					 	"valueType":"listTypePropertyEditor",
					 	"values":[ 
					 				{"value":"76元A套餐", "description":""}, {"value":"76元B套餐", "description":""}, {"value":"76元C套餐", "description":""},
					 				{"value":"96元A套餐", "description":""}, {"value":"96元B套餐", "description":""}, {"value":"96元C套餐", "description":""},
					 				{"value":"106元A套餐", "description":""}, {"value":"106元B套餐", "description":""}, {"value":"106元C套餐", "description":""},
					 			]
					},					
					{
					 	"propertyName":"telNum",
					 	"fieldName":"",
					 	"showName":"手机号码",
					 	"description":"请选择新的手机号码",
					 	"valueType":"telNumTypePropertyEditor"
					}
				],
				productProperty:{
					"productId":"112321j3k21j321i3i21ji3",
					"productName":"苹果5C iPhone 5C 最新上市特惠活动",
					"properties":["color", "romSize", "simType", "telNum", "telNumA", "telNumB"],
					"values":[
								{"id":"111111111","color":"粉色","romSize":"16G", "inventory":100,"originalPrice":4999, "actualPrice":4599},
								{"id":"222222222","color":"蓝色","romSize":"16G", "inventory":100,"originalPrice":4999, "actualPrice":4599},
								{"id":"333333333","color":"红色","romSize":"16G", "inventory":100,"originalPrice":4999, "actualPrice":4599},
								{"id":"444444444","color":"灰色","romSize":"16G", "inventory":100,"originalPrice":4999, "actualPrice":4599},
								{"id":"555555555","color":"黑色","romSize":"32G", "inventory":200,"originalPrice":6566, "actualPrice":6500},
								{"id":"666666666","color":"白色","romSize":"16G", "inventory":200,"originalPrice":5099, "actualPrice":4699},
								{"id":"777777777","color":"白色","romSize":"32G", "inventory":200,"originalPrice":6666, "actualPrice":6600},
								{"id":"888888888","color":"金色","romSize":"16G", "inventory":200,"originalPrice":4999, "actualPrice":4599},
							] 
				},
				onSubProductChange:function(p){
					var selectedSubProductCount = p.selectedSubProducts.length;
					var str =  selectedSubProductCount == 0?"无":"";
					var allInventory = 0;
					var maxOriginalPrice = selectedSubProductCount == 0 ? "-" : 0;
					var maxActualPrice = selectedSubProductCount == 0 ? "-" : 0;
					var minOriginalPrice = selectedSubProductCount == 0 ? "-" : 999999999;
					var minActualPrice = selectedSubProductCount == 0 ? "-" : 999999999;
					for(var i=0;i<selectedSubProductCount;i++){
						var subProd = p.selectedSubProducts[i];
						str += (subProd.id + " ");
						allInventory +=subProd.inventory;
						if(maxOriginalPrice < subProd.originalPrice){
							maxOriginalPrice = subProd.originalPrice;
						}
						if(maxActualPrice < subProd.actualPrice){
							maxActualPrice = subProd.actualPrice;
						}
						if(minOriginalPrice > subProd.originalPrice){
							minOriginalPrice = subProd.originalPrice;
						}
						if(minActualPrice > subProd.actualPrice){
							minActualPrice = subProd.actualPrice;
						}
					} 
					$("#productSpanId").html(str);
					$("#inventorySpanId").html(allInventory);
					$("#actualPriceSpanId").html((minActualPrice == maxActualPrice)? ("￥" + minActualPrice):("￥" + minActualPrice +" - ￥" + maxActualPrice));
					$("#originalPriceSpanId").html((minOriginalPrice == maxOriginalPrice)? ("￥" + minOriginalPrice):("￥" + minOriginalPrice +" - ￥" + maxOriginalPrice));
				}
			}
			
		 	var editor = new propertyEditor(p);
			editor.init();
		});
	</script> 
</head>
<body style="width:100%;height:100%;" > 
	<br/>选购商品时，属性编辑：
	<br/>符合条件的子商品ID：<span id="productSpanId"></span>
	<br/>库存：<span id="inventorySpanId"></span>
	<br/>现价：<span id="actualPriceSpanId"></span>
	<br/>原价：<span id="originalPriceSpanId"></span>
	<div id="testDiv" class="propertyEditorDiv" style="border:solid 1px gray;width:600px;"></div>
</body>	 
</html>