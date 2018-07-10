package com.novacloud.novaone.excelGrid.expression.definition;

//表达式组成部分类型
public enum PartType {
	//常量
	Constant,
	
	//函数
	Function,
	
	//操作符
	Operator, 

	//括号
	Bracket, 
	
	//逗号
	Comma, 
	
	//用户参数
	UserParameter, 
	
	//未知
	Unknown,
	
	//单元格
	CellReferance,
	
	//区域（单元格集合）
	RangeReferance
}
