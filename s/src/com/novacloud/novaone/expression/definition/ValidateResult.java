package com.novacloud.novaone.expression.definition;

import java.util.List;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;

//表达式验证结果
public class ValidateResult { 
	public boolean getSucceed(){
		return this.errors.size() == 0;
	} 
	
	private List<String> errors ;
	public String getError(){
		return ValueConverter.arrayToString(this.errors, ". ");
	}
	public List<String> getErrors(){
		return this.errors;
	}
	public void setErrors(List<String> errors){
		this.errors = errors;
	}
	
	private ExpTreePart partTree ;
	public ExpTreePart getPartTree(){
		return this.partTree;
	}
	public void setPartTree(ExpTreePart partTree){
		this.partTree = partTree;
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
