package com.novacloud.novaone.excelGrid.definition;

import net.sf.json.JSONObject;

public class ExcelGridBorderStyle {
	private String color = null;
	private Integer width = 0;
	private String style = "";
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public Integer getWidth() {
		return width;
	}
	public void setWidth(Integer width) {
		this.width = width;
	}
	public String getStyle() {
		return style;
	}
	public void setStyle(String style) {
		this.style = style;
	}

	public ExcelGridBorderStyle clone(){
		ExcelGridBorderStyle borderStyle = new ExcelGridBorderStyle();
		borderStyle.width = this.width;
		borderStyle.color = this.color;
		borderStyle.style = this.style;
		return borderStyle;
	}
	
	public static ExcelGridBorderStyle fromJson(JSONObject json){
		if(json == null){
			return null;
		}
		else{
			ExcelGridBorderStyle borderStyle = new ExcelGridBorderStyle();

			if(json.containsKey("c")){
				borderStyle.setColor(json.getString("c"));
			}
			if(json.containsKey("w")){
				borderStyle.setWidth(json.getInt("w"));
			}
			if(json.containsKey("s")){
				borderStyle.setStyle(json.getString("s"));
			}
			return borderStyle;
		}
	}
	public JSONObject toJson(){
		JSONObject json = new JSONObject(); 
		if(this.color != null && this.color != ""){
			json.put("c", this.getColor());
		}
		if(this.width != null && this.width != 0 && this.width != 1){ 
			json.put("w", this.getWidth());
		}
		if(this.style != null && this.style != "" && this.style != "none"){
			json.put("s", this.getStyle()); 
		}	
		return json;	
	} 
}
