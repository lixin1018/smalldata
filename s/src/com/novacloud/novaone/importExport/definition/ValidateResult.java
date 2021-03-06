package com.novacloud.novaone.importExport.definition;

import java.io.UnsupportedEncodingException;

import com.novacloud.novaone.common.util.CommonFunction;

import net.sf.json.JSONObject;

//表达式验证结果
public class ValidateResult { 
	public boolean getSucceed(){
		return this.error.length() == 0;
	} 
	
	private String error = "";
	public String getError(){
		return this.error;
	} 
	public void setError(String error){
		this.error = error;
	}
	
	private String alert = "";
	public String getAlert(){
		return this.alert;
	} 
	public void setAlert(String alert){
		this.alert = alert;
	}
	 
	
	public JSONObject toJson() throws UnsupportedEncodingException{
		JSONObject jsonObj = new JSONObject(); 
		jsonObj.put("error", CommonFunction.encode(error)); 
		jsonObj.put("alert", CommonFunction.encode(alert));
		
		return jsonObj;
	}
}
