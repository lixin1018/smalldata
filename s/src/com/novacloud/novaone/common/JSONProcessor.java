package com.novacloud.novaone.common; 

import java.util.HashMap;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject; 

public class JSONProcessor {
	//哈希表转字符串
	public static String mapToStr(HashMap<String, Object> map){
    	JSONArray json=JSONArray.fromObject(map);
    	String str=json.toString();
        return str;
	}
	//JSON转字符串
	public static String jsonToStr(JSONObject json){  
    	String str=json.toString();
        return str;
	}
	
	//字符串转json
	public static JSONObject strToJSON(String str) throws Exception{
		try
		{
	    	JSONObject json = JSONObject.fromObject(str); 
	    	return json;
		}
		catch(Exception ex){
        	ex.printStackTrace();
			throw new Exception("can not convert string to json. str = "+ str);
		}
	}	
}
