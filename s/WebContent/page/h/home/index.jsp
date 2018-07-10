<!DOCTYPE html>
<%@ page contentType="text/html; charset=utf-8" language="java" pageEncoding="UTF-8" %>
<%@ page import="com.novacloud.novaone.common.NcpSession" %>
<%@ include file="../../baseSitePage.jsp" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head> 
	<title>首页-GoOnData.com</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<meta http-equiv="keywords" content="数据共享,数据处理,数据抓取,数据爬虫">
	<meta http-equiv="description" content="homepage"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />	 
</head>
<body>
	<div id="pageHeaderDiv" class="pageHeader">
		<jsp:include  page="../home/headerA.jsp">
			<jsp:param value="sjjs" name="menuName"/>
		</jsp:include>
	</div> 
	<div class="sectionBlankSpaceTopBorder"></div>	
	<div class="sectionBlankSpace"></div>	
	<div id="pageContentDiv" class="pageContent">
		<div id="contentMainDiv" class="contentMainContainer">	
			<div class="contentMainImgContainer">
				<img class="contentMainImg" src="../images/home/home_main_sjgx.jpg">
			</div> 		
			<div class="contentMainServiceContainer"> 
				<div class="contentMainServiceContainerInner"> 
					<h4 class="mainServiceListHeader">数据共享</h4>
					<ul class="mainServiceList">
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=academia" target="_blank">教育/行政</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=diet" target="_blank">购物/美食</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=living" target="_blank">居住/办公</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=vehicle" target="_blank">汽车销售/维修站</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=geographic" target="_blank">地理信息</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=environment" target="_blank">环境/天气/空气质量</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=bioinformatics" target="_blank">医疗/生物信息</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=construction" target="_blank">建筑</a><span>&gt;</span></li>
						<li class="mainServiceItem"><a href="../sjgx/list.jsp?code=company" target="_blank">股票/上市公司</a><span>&gt;</span></li>
					</ul>
				</div> 		
			</div> 			
		</div>	
		<div class="sectionBlankSpace"></div>	
		<div class="sectionBlankSpace"></div>	
		<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
		<div id="serviceListDiv" class="serviceListContaienr"> 
			<div class="serviceListBlock" >
				<h4 class="serviceListHeader">数据工具</h4>
				<ul class="serviceList">
					<li class="serviceItem serviceItemH"><a href="https://www.tableau.com" target="_blank">Tableau</a></li>
					<li class="serviceItem serviceItemH"><a href="http://www.spss.com" target="_blank">SPSS</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://sites.google.com/site/netdrawsoftware/home" target="_blank">Netdraw</a></li>
					<li class="serviceItem serviceItemH"><a href="https://products.office.com/zh-cn/excel" target="_blank">Excel</a></li>
					<li class="serviceItem serviceItemH"><a href="https://www.smartdraw.com" target="_blank">SmartDraw</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.sas.com" target="_blank">SAS</a></li>
					<li class="serviceItem serviceItemH"><a href="https://www.xlstat.com" target="_blank">XLstat</a></li>
					<li class="serviceItem serviceItemH"><a href="https://www.mindjet.com" target="_blank">Mindmanager</a></li>
					<li class="serviceItem serviceItemH"><a href="http://www.analytictech.com/archive/ucinet.htm" target="_blank">Ucinet</a></li>
					<li class="serviceItem serviceItemH"><a href="http://www.globfx.com/products/swfchart/" target="_blank">Swiff Chart</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.highcharts.com" target="_blank">Highcharts</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://echarts.baidu.com" target="_blank">ECharts</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.navicat.com" target="_blank">Navicat</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.python.org" target="_blank">Python</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.r-project.org" target="_blank">R project</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://hadoop.apache.org" target="_blank">Hadoop</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://www.mongodb.com" target="_blank">MongoDB</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://redis.io" target="_blank">Redis</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://code.google.com/archive/p/google-refine" target="_blank">Google Refine</a></li>
					<li class="serviceItem serviceItemH"><a href="http://vis.stanford.edu/wrangler" target="_blank">DataWrangler</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://www.openheatmap.com" target="_blank">OpenHeatMap</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://openlayers.org" target="_blank">OpenLayers</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://storm.apache.org" target="_blank">Storm</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://community.pentaho.com" target="_blank">Pentaho BI</a></li>
					<li class="serviceItem serviceItemH"><a href="https://www.cloudera.com" target="_blank">Cloudera</a></li> 
					<li class="serviceItem serviceItemH"><a href="http://spark.apache.org" target="_blank">Spark</a></li> 
					<li class="serviceItem serviceItemH"><a href="https://hive.apache.org" target="_blank">Hive</a></li> 
				</ul>
			</div>
			<div class="serviceListBlockBorder"></div>
			<div class="serviceListBlock" >
				<h4 class="serviceListHeader">数据动画</h4>
				<ul class="serviceList">
					<li class="serviceItem"><a href="../../ss/v/main/play.jsp?code=dino_area" target="_blank">小心! 这里有恐龙</a><span class="serviceItemTime">2018-07-03</span></li>
					<li class="serviceItem"><a href="../../ss/v/main/play.jsp?code=dino_count" target="_blank">哪国的恐龙种类多?</a><span class="serviceItemTime">2016-07-03</span></li>
					<li class="serviceItem"><a href="../../ss/v/main/play.jsp?code=dino_size" target="_blank">恐龙有多大?</a><span class="serviceItemTime">2016-07-03</span></li>
				</ul>
			</div>
			<div class="serviceListBlockBorder"></div>
			<div class="serviceListBlock" >
				<h4 class="serviceListHeader">未来发布</h4>
				<div class="serviceList">
					<div class="serviceItem serviceItemNoneListStyle" style="text-align:center;"><br/>
						<img src="../images/home/waiting.png" style="height:50px;width:32px;"></img><br/>
						这是一个神奇的东西<br/>距离发布倒计时: 53 个Nova星球日,&nbsp;值得期待！
					</div>
				</div>
			</div>
		</div>
		<div class="sectionBlankSpace"></div>	
		<div class="sectionBlankSpace"></div>	
		<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
		<div id="linkDiv" class="linkContainer">
			友情链接:  
			<a class="linkItem" href="https://scholar.google.com" target="_blank">谷歌学术</a>
			<a class="linkItem" href="http://xueshu.baidu.com" target="_blank">百度学术</a>	
			<a class="linkItem" href="https://www.wikipedia.org" target="_blank">Wikipedia(维基百科)</a>	
			<a class="linkItem" href="http://www.wanfangdata.com.cn" target="_blank">万方数据</a>
			<a class="linkItem" href="http://www.cnki.net" target="_blank">中国知网</a>		
			<a class="linkItem" href="http://www.oalib.com" target="_blank">Oalib(Open Access Library)</a> 
			<a class="linkItem" href="http://wenku.baidu.com" target="_blank">百度文库</a>
			<a class="linkItem" href="http://www.novacloud.com" target="_blank">易贸创想</a>
			<a class="linkItem" href="http://www.novadata.cn" target="_blank">NovaData</a>
			<a class="linkItem" href="http://www.yiguo.com" target="_blank">易果生鲜</a>	
			<a class="linkItem" href="http://www.celloud.cn" target="_blank">Celloud</a>
		</div>	
	</div>
	<div class="sectionBlankSpace"></div>	
		<div class="sectionBlankSpace"></div>	
	<div class="sectionBlankSpace sectionBlankSpaceTopBorder"></div>	
	<div id="pageFooterDiv" class="pageFooter">
		<%@ include  file="../common/footer.html"%>
	</div>
</body>
</html>