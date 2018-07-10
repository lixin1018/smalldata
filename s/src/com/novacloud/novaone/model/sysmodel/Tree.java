package com.novacloud.novaone.model.sysmodel;

public class Tree {
	private String id;
	private String name; 
	private String labelField;
	private String parentPointerField;
	private String isLeafField;
	private String sortField;
	private String viewName;
	
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
	public String getLabelField() {
		return labelField;
	}
	public void setLabelField(String labelField) {
		this.labelField = labelField;
	}
	public String getParentPointerField() {
		return parentPointerField;
	}
	public void setParentPointerField(String parentPointerField) {
		this.parentPointerField = parentPointerField;
	}
	public String getViewName() {
		return viewName;
	}
	public void setViewName(String viewName) {
		this.viewName = viewName;
	}
	public String getIsLeafField() {
		return isLeafField;
	}
	public void setIsLeafField(String isLeafField) {
		this.isLeafField = isLeafField;
	}
	public String getSortField() {
		return sortField;
	}
	public void setSortField(String sortField) {
		this.sortField = sortField;
	} 	  
}
