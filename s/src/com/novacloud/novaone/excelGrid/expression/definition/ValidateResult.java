package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.List;

import com.novacloud.novaone.common.ValueConverter; 

//表达式验证结果
public class ValidateResult { 
	public boolean getSucceed(){
		return this.error.length() == 0;
	} 
	
	private String error ;
	public String getError(){
		return this.error;
	}
	public void setError(String error){
		this.error = error;
	}
	
	private ExpTreePart rootPart ;
	public ExpTreePart getRootPart(){
		return this.rootPart;
	}
	public void setRootPart(ExpTreePart rootPart){
		this.rootPart = rootPart;
	}
	
	private String valueType ;
	public String getValueType(){
		return this.valueType;
	}
	public void setValueType(String valueType){
		this.valueType = valueType;
	}

	//运行位置
	private RunAt runAt;
	public RunAt getRunAt(){
		return this.runAt;
	}
	public void setRunAt(RunAt runAt){
		this.runAt = runAt;
	}
}
