package com.novacloud.novaone.model.sysmodel;

import java.util.List;

public class SheetPart {
	private String id;
	private String name; 
	private String parentId;
	private String labelField;
	private String viewName;
	private String parentPartName;
	private String parentPointerField; 
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}  
	public String getLabelField() {
		return labelField;
	}
	public void setLabelField(String labelField) {
		this.labelField = labelField;
	}
	public String getViewName() {
		return viewName;
	}
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}
	public String getParentPartName() {
		return parentPartName;
	}
	public void setParentPartName(String parentPartName) {
		this.parentPartName = parentPartName;
	}
	public String getParentPointerField() {
		return parentPointerField;
	}
	public void setParentPointerField(String parentPointerField) {
		this.parentPointerField = parentPointerField;
	} 
	
	private List<SheetPart> childParts = null;
	public List<SheetPart> getChildParts(){
		return this.childParts;
	}
	public void setChildParts(List<SheetPart> childParts){
		this.childParts = childParts;
	}
}
