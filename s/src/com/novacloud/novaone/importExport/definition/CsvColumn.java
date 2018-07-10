package com.novacloud.novaone.importExport.definition;

//输入输出csv文件列定义
public class CsvColumn implements FileColumn {

	//对应的csv列
	private String csvColumnName = null;
	public String getCsvColumnName(){
		return this.csvColumnName;
	}
	public void setCsvColumnName(String csvColumnName){
		this.csvColumnName = csvColumnName;
	}
	
	//数据项名称
	private String itemName = null;
	public String getItemName(){
		return this.itemName;
	}
	public void setItemName(String itemName){
		this.itemName = itemName;
	}
	
	//数据类型
	private DataType dataType = null;
	public DataType getDataType(){
		return this.dataType;
	}
	public void setDataType(DataType dataType){
		this.dataType = dataType;
	}
	
	//格式
	private String formatPattern = null;
	public String getFormatPattern(){
		return this.formatPattern;
	}
	public void setFormatPattern(String formatPattern){
		this.formatPattern = formatPattern;
	}
		
}
