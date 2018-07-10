package com.novacloud.novaone.common.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;

import net.sf.json.JSONObject;

//一般通用方法
public class CommonFunction {
	//将正则表达式的特殊保留字符转义 added by lixin 20170912
	public static String encodeRegExpString(String s){
		if(s.length() != 0){
			String newStr = "";
			for(int i = 0; i < s.length(); i++){
				switch(s.charAt(i)){
					case '*':
					case '.':
					case '?':
					case '+':
					case '$':
					case '^':
					case '[':
					case ']':
					case '(':
					case ')':
					case '{':
					case '}':
					case '|':
					case '\\':
						newStr += "\\"+s.charAt(i);
						break;
					default:
						newStr += s.charAt(i);
				}
			}
			return newStr;
		}
		else{
			return "";
		}
	}
	
	public static String getRepeatString(String str, int num){
		StringBuilder s = new StringBuilder();
		for(int i=0;i<num;i++){
			s.append(str);
		}
		return s.toString();
	}

	public static String encode(String str) throws UnsupportedEncodingException{
		if(str == null){
			return "";
		}
		else{
			String s = URLEncoder.encode(str, "utf-8");
			s =  s.replaceAll("\\+","%20");
			return s;
		}
	}
	public static String decode(String str) throws UnsupportedEncodingException{
		String s = str == null || str.length() == 0 ? "" : URLDecoder.decode(str, "utf-8"); 
		return s;
	}
	
	public static String generateInnerStr(String sourceStr){
		if(sourceStr == null){
			return null;
		}
		else{
			return sourceStr.replaceAll("\\\\","\\\\\\\\").replaceAll("\"","\\\\\"");
		}
	}
	
	//字符串数组排序
	public static List<String> sort(Set<String> sourceStrs){
		List<String> newStrs = new ArrayList<String>();
		Object[] arr = sourceStrs.toArray();		
		for(int i=0;i<arr.length;i++){
			String ss = (String)arr[i];
			for(int j=0;j<=newStrs.size();j++){
				if(j == newStrs.size()){
					newStrs.add(ss);
					break;
				}
				else{
					String ns = newStrs.get(j);
					if(ns.compareTo(ss) >= 0){ 
						newStrs.add(j, ss);
						break;
					}
				}
			}			
		}
		return newStrs;
	} 
	
	public static ValueType getValueType(String valueTypeName){
		if(valueTypeName == null || valueTypeName.length() == 0){
			return null;
		}
		else{
			String vtn = valueTypeName.toLowerCase();
			if(vtn.equals("string")){
				return ValueType.String;
			}
			else if(vtn.equals("decimal")){
				return ValueType.Decimal;
			}
			else if(vtn.equals("date")){
				return ValueType.Date;
			}
			else if(vtn.equals("time")){
				return ValueType.Time;
			}
			else if(vtn.equals("boolean")){
				return ValueType.Boolean;
			}
			else if(vtn.equals("object")){
				return ValueType.Object;
			}
			else{
				throw new RuntimeException("None value type named " + valueTypeName);
			}
		}
	}
	
	public static Object getValueFromJson(JSONObject jsonObj, String propertyName, ValueType valueType, boolean isEncoded, boolean errorNoneProperty) throws Exception{
		if(jsonObj.containsKey(propertyName)){
			String pValueStr = jsonObj.getString(propertyName);
			if(valueType == ValueType.String){
				if(isEncoded){
					pValueStr = CommonFunction.decode(pValueStr);
				} 
				return pValueStr; 
			}
			else{
				Object pValue = ValueConverter.convertToObject(pValueStr, valueType);
				return pValue;
			}
		}
		else{
			if(errorNoneProperty){
				throw new Exception("None property. PropertyName = " + propertyName);
			}
			else{
				return null;
			}
		}
	}
	
	public static String listToString(List<String> listStrings, String splitString){
		StringBuilder sb = new StringBuilder();
		for(int i = 0;i < listStrings.size();i++){			
			String str = listStrings.get(i);
			sb.append((i == 0 ? "" : splitString) + str);
		}
		return sb.toString();
	}
	
    public static boolean checkIsEmail(String email){
        boolean flag = false;
        try{
                String check = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
                Pattern regex = Pattern.compile(check);
                Matcher matcher = regex.matcher(email);
                flag = matcher.matches();
            }catch(Exception e){
                flag = false;
            }
        return flag;
    }    
    
    public static List<List<String>> splitGroups(List<String> allStrings, int oneGroupCount){
    	List<List<String>> groupStrings = new ArrayList<List<String>>();
    	if(allStrings.size() != 0){ 
	    	List<String> oneGroup = null;
	    	for(int i = 0; i < allStrings.size(); i++){
	    		if( i % oneGroupCount == 0){
	    			if(oneGroup != null){
	    				groupStrings.add(oneGroup);
	    			}
	    			oneGroup = new ArrayList<String>();
	    		}
	    		oneGroup.add(allStrings.get(i));
	    	}
			groupStrings.add(oneGroup);
    	}
    	return groupStrings;
    }
}
