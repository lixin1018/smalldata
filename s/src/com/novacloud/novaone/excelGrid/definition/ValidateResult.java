package com.novacloud.novaone.excelGrid.definition;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction;
import com.novacloud.novaone.dao.db.ValueType;

import net.sf.json.JSONArray;
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
		jsonObj.put("succeed", this.getSucceed());
		
		return jsonObj;
	}
}
