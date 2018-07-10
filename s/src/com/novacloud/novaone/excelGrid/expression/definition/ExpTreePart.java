package com.novacloud.novaone.excelGrid.expression.definition;

import java.util.List;

import com.novacloud.novaone.dao.db.ValueType;

//表达式片段
public class ExpTreePart {

	//子片段
	private List<ExpTreePart> allChildParts= null;
	
	private ExpTreePart parentPart;
	//此片段内容
	private String text = null;
	//此部分类型
	private PartType partType = null;
	//返回值类型
	private String resultType = null;
	//返回值类型
	private FunctionSetting functionSetting = null;

	private CellReferanceInfo cellRefInfo = null;
	
	private CellReferanceInfo fromCellRefInfo = null;
	
	private CellReferanceInfo toCellRefInfo = null;
	
	private CellReferanceSourceType cellReferSourceType = CellReferanceSourceType.CurrentSheet;

	private String cellReferSheetId = null;
	
	private String cellReferSheetName = null;
	
	public List<ExpTreePart> getAllChildParts(){
		return this.allChildParts;
	}
	public void setAllChildParts(List<ExpTreePart> allChildParts){
		this.allChildParts = allChildParts;
	}
	
	public ExpTreePart getParentPart(){
		return this.parentPart;
	}
	public void setParentPart(ExpTreePart parentPart){
		this.parentPart = parentPart;
	}
	
	public String getText(){
		return this.text;
	}
	public void setText(String text){
		this.text = text;
	}
	
	public PartType getPartType(){
		return this.partType;
	}
	public void setPartType(PartType partType){
		this.partType = partType;
	}
		
	public String getResultType(){
		return this.resultType;
	}
	public void setResultType(String resultType){
		this.resultType = resultType;
	}

	public FunctionSetting getFunctionSetting(){
		return this.functionSetting;
	}
	public void setFunctionSetting(FunctionSetting functionSetting){
		this.functionSetting = functionSetting;
	}

	public CellReferanceInfo getCellRefInfo() {
		return cellRefInfo;
	}
	public void setCellRefInfo(CellReferanceInfo cellRefInfo) {
		this.cellRefInfo = cellRefInfo;
	}

	public CellReferanceInfo getFromCellRefInfo() {
		return fromCellRefInfo;
	}
	public void setFromCellRefInfo(CellReferanceInfo fromCellRefInfo) {
		this.fromCellRefInfo = fromCellRefInfo;
	}

	public CellReferanceInfo getToCellRefInfo() {
		return toCellRefInfo;
	}
	public void setToCellRefInfo(CellReferanceInfo toCellRefInfo) {
		this.toCellRefInfo = toCellRefInfo;
	}
	public CellReferanceSourceType getCellReferSourceType() {
		return cellReferSourceType;
	}
	public void setCellReferSourceType(CellReferanceSourceType cellReferSourceType) {
		this.cellReferSourceType = cellReferSourceType;
	}
	public String getCellReferSheetId() {
		return cellReferSheetId;
	}
	public void setCellReferSheetId(String cellReferSheetId) {
		this.cellReferSheetId = cellReferSheetId;
	}
	public String getCellReferSheetName() {
		return cellReferSheetName;
	}
	public void setCellReferSheetName(String cellReferSheetName) {
		this.cellReferSheetName = cellReferSheetName;
	}
	
	
	
	
}
