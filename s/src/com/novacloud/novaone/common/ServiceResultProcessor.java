package com.novacloud.novaone.common;

import java.util.HashMap;

import net.sf.json.JSONObject;

public class ServiceResultProcessor {
	//处理webservice的返回值
	public static String createJsonResultStr(String returnInfo) {
		HashMap<String,Object> json = new HashMap<String,Object>();
		json.put("code", "000");
		json.put("message", "");
		json.put("result", returnInfo);
		String resultStr = JSONProcessor.mapToStr(json);
		return resultStr;
	}
	//处理webservice的返回值
	public static String createJsonResultStr(HashMap<String, Object> resultMap) {
		HashMap<String,Object> json = new HashMap<String,Object>();
		json.put("code", "000");
		json.put("message", "");
		json.put("result", resultMap);
		String resultStr = JSONProcessor.mapToStr(json);
		return resultStr;
	}
	//处理webservice的返回值
	public static String createJsonResultStr(JSONObject resultJson) {
		HashMap<String,Object> json = new HashMap<String,Object>();
		json.put("code", "000");
		json.put("message", "");
		json.put("result", resultJson);
		String resultStr = JSONProcessor.mapToStr(json);
		return resultStr;
	}
}
