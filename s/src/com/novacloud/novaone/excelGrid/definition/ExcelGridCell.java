package com.novacloud.novaone.excelGrid.definition;

import java.util.ArrayList;
import java.util.List;

import com.novacloud.novaone.dao.db.ValueType;

public class ExcelGridCell {	
	
	public ExcelGridCell(){
		this.cssStyle = new ExcelGridCssStyle();
	}
	
	public boolean IsBlankCell(){
		boolean isBlankCell = (this.value == null || this.value.toString().isEmpty())
			&& !this.isExp
			&& this.cellShowType == CellShowType.Text
			&& this.cellValueType == ValueType.String
			&& this.colSpan == 1
			&& this.rowSpan == 1
			&& (this.groupCellId == this.id || this.groupCellId == null || this.groupCellId.isEmpty())
			&& this.cssStyle == null;
		return isBlankCell;
	}
	
	private String id = null;
	public String getId(){
		return this.id;
	}
	public void setId(String id){
		this.id = id;
	} 
	 
	private String sheetId = null;
	public String getSheetId(){
		return this.sheetId;
	}
	public void setSheetId(String sheetId){
		this.sheetId = sheetId;
	} 
	 
	private String columnId = null;
	public String getColumnId(){
		return this.columnId;
	}
	public void setColumnId(String columnId){
		this.columnId = columnId;
	} 
	
	private String rowId = null;
	public String getRowId(){
		return this.rowId;
	}
	public void setRowId(String rowId){
		this.rowId = rowId;
	} 
	
	private Object value = null;
	public Object getValue(){
		return this.value;
	}
	public void setValue(Object value){
		this.value = value;
	} 
	
	private String expression = null;
	public String getExpression(){
		return this.expression;
	}
	public void setExpression(String expression){
		this.expression = expression;
	} 
	
	private boolean isExp = false;
	public boolean getIsExp() {
		return this.isExp;
	}
	public void setIsExp(boolean isExp) {
		this.isExp = isExp;
	}
	
	
	private ValueType cellValueType = ValueType.String;
	public ValueType getCellValueType(){
		return this.cellValueType;
	}
	public void setCellValueType(ValueType cellValueType){
		this.cellValueType = cellValueType;
	} 
	
	private CellShowType cellShowType = CellShowType.Text;
	public CellShowType getCellShowType(){
		return this.cellShowType;
	}
	public void setCellShowType(CellShowType cellShowType){
		this.cellShowType = cellShowType;
	}  
	
	private String formatString = "";
	public String getFormatString(){
		return this.formatString;
	}
	public void setFormatString(String formatString){
		this.formatString = formatString;
	} 
	
	private int colSpan = 1;
	public int getColSpan(){
		return this.colSpan;
	}
	public void setColSpan(int colSpan){
		this.colSpan = colSpan;
	} 
	
	private int rowSpan = 1;
	public int getRowSpan(){
		return this.rowSpan;
	}
	public void setRowSpan(int rowSpan){
		this.rowSpan = rowSpan;
	} 
	
	private String groupCellId = null;
	public String getGroupCellId(){
		return this.groupCellId;
	}
	public void setGroupCellId(String groupCellId){
		this.groupCellId = groupCellId;
	} 
	
	/*
	private List<String> effectCellIds = new ArrayList<String>();
	public List<String> getEffectCellIds(){
		return this.effectCellIds;
	}
	public void setEffectCellIds(List<String> effectCellIds){
		this.effectCellIds = effectCellIds;
	} 	
	public void addEffectCellId(String cellId){
		if(!this.effectCellIds.contains(cellId)){
			this.effectCellIds.add(cellId);
		}
	}
	public String[] getEffectCellIdArray(){
		if(this.effectCellIds == null || this.effectCellIds.size() == 0){
			return null;
		}
		else{
			String[] idArray = new String[this.effectCellIds.size()];
			for(int i = 0; i < this.effectCellIds.size(); i++){
			  idArray[i] =this.effectCellIds.get(i);
			}
			return idArray;
		}
	}
	*/
	private String jsCode = "";
	public String getJsCode(){
		return this.jsCode;
	}
	public void setJsCode(String jsCode){
		this.jsCode = jsCode;
	} 
	
	private boolean isError = false;
	public boolean getIsError(){
		return this.isError;
	}
	public void setIsError(boolean isError){
		this.isError = isError;
	} 
	
	private String note = "";
	public String getNote(){
		return this.note;
	}
	public void setNote(String note){
		this.note = note;
	} 
	
	private ExcelGridCssStyle cssStyle = null;
	public ExcelGridCssStyle getCssStyle() {
		return cssStyle;
	}
	public void setCssStyle(ExcelGridCssStyle cssStyle) {
		this.cssStyle = cssStyle;
	}
	
	public boolean isHidden(){
		return this.groupCellId != null && this.groupCellId.length() != 0 && this.id != this.groupCellId;
	}

	public static CellShowType toFullShowType(String simpleShowType){	
		switch(simpleShowType){
			case "t":
			case "text":
				return CellShowType.Text;
			case "h":
			case "htmlElement":
				return CellShowType.HtmlElement;
			case "l": 
			case "link":
				return CellShowType.Link;
			default:
				return CellShowType.Text;
		} 
	}
	
	public static String toSimpleShowType(CellShowType fullShowType){	
		switch(fullShowType){
			case Text:
				return "t"; 
			case HtmlElement: 
				return "h"; 
			case Link:  
				return "l"; 
			default:
				return "";
		} 
	}
	
	public static ValueType toFullValueType(String simpleValueType) throws Exception{
		switch (simpleValueType) { 
			case "o":
			case "object":
				return ValueType.Object;
			case "s":
			case "string":
				return ValueType.String;
			case "n":
			case "decimal":
				return ValueType.Decimal;
			case "b":
			case "boolean":
				return ValueType.Boolean;
			case "t":
			case "time":
				return ValueType.Time;
			case "d":
			case "date":
				return ValueType.Date;
			default:
				throw new Exception("toFullValueType, simpleValueType=" + simpleValueType); 
		}
	}
	
	 public static String toSimpleValueType(ValueType fullValueType) throws Exception{
		switch (fullValueType) {  
			case Object:
				return "o"; 
			case String:
				return "s"; 
			case Decimal:
				return "n"; 
			case Boolean:
				return "b"; 
			case Time:
				return "t"; 
			case Date:
				return "d";
			default:
				throw new Exception("toSimpleValueType, fullValueType=" + fullValueType); 
		}
	}	
	
}
