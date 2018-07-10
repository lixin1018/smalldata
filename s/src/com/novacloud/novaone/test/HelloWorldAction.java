package com.novacloud.novaone.test;

import com.opensymphony.xwork2.ActionSupport;

public class HelloWorldAction extends ActionSupport {
	public String test1(){
		return "success";
	}
	public String test2(){
		return "error";
	}
}
