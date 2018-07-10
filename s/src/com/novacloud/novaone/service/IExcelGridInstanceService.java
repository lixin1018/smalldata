package com.novacloud.novaone.service;

public interface IExcelGridInstanceService {

	String getWaitingProcessInstanceStepCount();

	String driveToNext();

	String converge();

	String end();

	String bringBack();

	String sendBack(); 

	String createInstance();

	String deleteInstance();

	String readStep();

	String updateStep();

	String getInstanceStepsAndLinks();

}
