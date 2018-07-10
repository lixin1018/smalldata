package com.novacloud.novaone.dataFile.exe;

import java.util.HashMap;

import com.novacloud.novaone.common.JSONProcessor;

import net.sf.json.JSONObject;

public class ExeConfig {
	private String name = "";
	private String code = "";
	private String version = "";
	private HashMap<String, String> parameterValues = null;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public HashMap<String, String> getParameterValues() {
		return parameterValues;
	}
	public void setParameterValues(HashMap<String, String> parameterValues) {
		this.parameterValues = parameterValues;
	}
	
	public void setParameterValue(String param, String value){
		this.getParameterValues().put(param, value);
	}
	
	public void setParameterValue(String param, HashMap<String, String> valueMap){
		JSONObject partObjs = new JSONObject(); 
		for(String partName : valueMap.keySet()){
			String value = valueMap.get(partName);
			partObjs.put(param, value);
		}
		String str = JSONProcessor.jsonToStr(partObjs);
		this.getParameterValues().put(param, str);
	}
	
	public String getParameterValue(String param){  
		return this.getParameterValues().get(param);
	}
	
	public HashMap<String, String> getParameterValueMap(String param) throws Exception{  
		String str = this.getParameterValues().get(param);
		HashMap<String, String> partValues = new HashMap<String, String>(); 
		JSONObject partValueObjs = JSONProcessor.strToJSON(str);
		for(Object partNameObj : partValueObjs.keySet()){
			String partName = (String)partNameObj;
			String value = partValueObjs.getString(partName);
			partValues.put(partName, value);
		}
		return partValues;
	}
	
	public String toString(){
		JSONObject fileObj = new JSONObject();
		fileObj.put("name", this.getName());
		fileObj.put("code", this.getCode());
		fileObj.put("version", this.getVersion());
		JSONObject parameterValueObjs = new JSONObject();
		HashMap<String, String> parameterValues = this.getParameterValues();
		for(String param : parameterValues.keySet()){
			String value = parameterValues.get(param);
			parameterValueObjs.put(param, value);
		}
		fileObj.put("parameterValues", parameterValueObjs);
		String str = JSONProcessor.jsonToStr(fileObj);
		return str;
	}
	
	public static ExeConfig loadFrom(String configText) throws Exception{
		JSONObject fileObj = JSONProcessor.strToJSON(configText);
		ExeConfig config = new ExeConfig();
		config.setName(fileObj.getString("name"));
		config.setCode(fileObj.getString("code"));
		config.setVersion(fileObj.getString("version"));
		HashMap<String, String> parameterValues = new HashMap<String, String>();
		config.setParameterValues(parameterValues);
		JSONObject parameterValueObjs = fileObj.getJSONObject("parameterValues");
		for(Object paramObj : parameterValueObjs.keySet()){
			String param = (String)paramObj;
			String value = parameterValueObjs.getString(param);
			parameterValues.put(param, value);
		}
		return config;
	}
}
