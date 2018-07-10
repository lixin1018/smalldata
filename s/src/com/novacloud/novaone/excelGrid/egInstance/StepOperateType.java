package com.novacloud.novaone.excelGrid.egInstance;

//因为什么原因，创建的对应节点
public enum StepOperateType {
	//处理通过后，新生成的此节点
	driveToNext,
	
	//instance被取回后，新生成的此节点
	bringBack,
	
	//instance被退回后，新生成的此节点
	sendBack,
	
	//instance被结束掉后，新生成的此节点
	end,
	
	//instance被汇聚，聚合，汇总后，新生成的此节点
	converge,
	
	//创建，开始节点
	create
}
