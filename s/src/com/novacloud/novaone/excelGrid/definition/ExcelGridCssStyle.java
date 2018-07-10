package com.novacloud.novaone.excelGrid.definition;

import net.sf.json.JSONObject;

public class ExcelGridCssStyle {
	private String color = null;
	private String backgroundColor = null;
	private String fontFamily = null;
	private Integer fontSize = null;
	private String fontStyle = null;
	private String textHAlign = null;
	private String textVAlign = null;
	private ExcelGridBorderStyle borderTop = null;
	private ExcelGridBorderStyle borderLeft = null;
	private ExcelGridBorderStyle borderBottom = null;
	private ExcelGridBorderStyle borderRight = null;
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getBackgroundColor() {
		return backgroundColor;
	}
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}
	public String getFontFamily() {
		return fontFamily;
	}
	public void setFontFamily(String fontFamily) {
		this.fontFamily = fontFamily;
	}
	public Integer getFontSize() {
		return fontSize;
	}
	public void setFontSize(Integer fontSize) {
		this.fontSize = fontSize;
	}
	public String getFontStyle() {
		return fontStyle;
	}
	public void setFontStyle(String fontStyle) {
		this.fontStyle = fontStyle;
	}
	public ExcelGridBorderStyle getBorderTop() {
		return borderTop;
	}
	public void setBorderTop(ExcelGridBorderStyle borderTop) {
		this.borderTop = borderTop;
	}
	public ExcelGridBorderStyle getBorderLeft() {
		return borderLeft;
	}
	public void setBorderLeft(ExcelGridBorderStyle borderLeft) {
		this.borderLeft = borderLeft;
	}
	public ExcelGridBorderStyle getBorderBottom() {
		return borderBottom;
	}
	public void setBorderBottom(ExcelGridBorderStyle borderBottom) {
		this.borderBottom = borderBottom;
	}
	public ExcelGridBorderStyle getBorderRight() {
		return borderRight;
	}
	public void setBorderRight(ExcelGridBorderStyle borderRight) {
		this.borderRight = borderRight;
	} 
	public String getTextHAlign() {
		return textHAlign;
	}
	public void setTextHAlign(String textHAlign) {
		this.textHAlign = textHAlign;
	}
	public String getTextVAlign() {
		return textVAlign;
	}
	public void setTextVAlign(String textVAlign) {
		this.textVAlign = textVAlign;
	}
	public static ExcelGridCssStyle fromJson(JSONObject json){
		if(json == null){
			return null;
		}
		else{
			ExcelGridCssStyle cssStyle = new ExcelGridCssStyle();
			if(json.containsKey("c")){
				cssStyle.setColor(json.getString("c"));
			}
			if(json.containsKey("bc")){
				cssStyle.setBackgroundColor(json.getString("bc"));
			}
			if(json.containsKey("ff")){
				cssStyle.setFontFamily(json.getString("ff"));
			}
			if(json.containsKey("fs")){
				cssStyle.setFontSize(json.getInt("fs"));
			}
			if(json.containsKey("st")){
				cssStyle.setFontStyle(json.getString("st"));
			}
			if(json.containsKey("ha")){
				cssStyle.setTextHAlign(json.getString("ha"));
			}
			if(json.containsKey("va")){
				cssStyle.setTextVAlign(json.getString("va"));
			}
			if(json.containsKey("bl")){				
				cssStyle.setBorderLeft(ExcelGridBorderStyle.fromJson(json.getJSONObject("bl")));
			}
			if(json.containsKey("bt")){				
				cssStyle.setBorderTop(ExcelGridBorderStyle.fromJson(json.getJSONObject("bt")));
			}
			if(json.containsKey("br")){				
				cssStyle.setBorderRight(ExcelGridBorderStyle.fromJson(json.getJSONObject("br")));
			}
			if(json.containsKey("bb")){				
				cssStyle.setBorderBottom(ExcelGridBorderStyle.fromJson(json.getJSONObject("bb")));
			}
			return cssStyle;
		}
	}
	public JSONObject toJson(){
		JSONObject json = new JSONObject(); 
		if(this.color != null && this.color != ""){
			json.put("c", this.color);
		} 
		if(this.backgroundColor != null && this.backgroundColor != ""){
			json.put("bc", this.backgroundColor);
		} 
		if(this.fontFamily != null && this.fontFamily != ""){
			json.put("ff", this.fontFamily);
		} 
		if(this.fontSize != null && this.fontSize != 11){
			json.put("fs", this.fontSize);
		}   
		if(this.fontStyle != null && this.fontStyle != "" && this.fontStyle != "normal"){
			json.put("st", this.fontStyle);
		}   
		if(this.textHAlign != null && this.textHAlign != "" && this.textHAlign != "g"){
			json.put("ha", this.textHAlign);
		}   
		if(this.textVAlign != null && this.textVAlign != "" && this.textVAlign != "m"){
			json.put("va", this.textVAlign);
		}   
		if(this.borderLeft != null){				
			json.put("bl", this.borderLeft.toJson());
		}
		if(this.borderTop != null){				
			json.put("bt", this.borderTop.toJson());
		}
		if(this.borderRight != null){				
			json.put("br", this.borderRight.toJson());
		}
		if(this.borderBottom != null){				
			json.put("bb", this.borderBottom.toJson());
		}
		return json;	
	}
}
