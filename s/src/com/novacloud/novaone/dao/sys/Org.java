package com.novacloud.novaone.dao.sys;

import java.io.Serializable;

public class Org implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -8339003873278068359L;
	private String id;
	private String code;
	private String name;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}	
}
