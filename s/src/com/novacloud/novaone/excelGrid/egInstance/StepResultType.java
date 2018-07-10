package com.novacloud.novaone.excelGrid.egInstance;

//目前的状态
public enum StepResultType {
	//正在处理中
	waitingProcess,
	
	//被取回了
	bringBack,
	
	//被退回了
	sendBack,
	
	//正常流转了
	sendNext
}
