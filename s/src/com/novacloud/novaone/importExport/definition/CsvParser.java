package com.novacloud.novaone.importExport.definition;

import java.util.List;

public class CsvParser implements FileParser {
	//第一行为标题
	private boolean hasHeaderRow = true;
	public boolean getHasHeaderRow(){
		return this.hasHeaderRow;
	}
	public void setHasHeaderRow(boolean hasHeaderRow){
		 this.hasHeaderRow = hasHeaderRow;
	}
	
	//所有列
	private List<CsvColumn> columns= null;
	public List<CsvColumn> getColumns(){
		return this.columns;
	}
	public void setColumns(List<CsvColumn> columns){
		this.columns = columns;
	}
}
