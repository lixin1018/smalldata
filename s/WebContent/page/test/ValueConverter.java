package com.novacloud.novaone.common;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.novacloud.novaone.dao.db.ValueType;

public class ValueConverter {

	//系统配置
	private static SysConfig sysConfig; 
	public void setSysConfig(SysConfig sysConfig) {
		ValueConverter.sysConfig = sysConfig;
	} 
	 	
	//转为字符串
	public static String convertToString(Object obj, String valueTypeStr) throws Exception{
		ValueType valueType = ValueType.String;
		try
		{
			valueType = ValueType.valueOf(valueTypeStr);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			throw new Exception("can not get value type = "+valueTypeStr+"."+ex.getMessage());
		}
		return ValueConverter.convertToString(obj, valueType);
	}
	
	//转为字符串
	public static String convertToString(Object obj, ValueType valueType) throws Exception{
		if(obj == null) {
			return null;
		}
		else {
			try
			{
				switch(valueType) {
					case Decimal:
						return obj.toString(); 
					case String:
						return (String)obj;
					case Boolean:
						return (Boolean)obj ? "Y" : "N";
					case Time:
						SimpleDateFormat sdf =   new SimpleDateFormat(ValueConverter.sysConfig.getTimeFormat());
						return sdf.format((Date)obj);
					case Date:
						SimpleDateFormat stf =   new SimpleDateFormat(ValueConverter.sysConfig.getDateFormat());
						return stf.format((Date)obj);
					default:
						throw new Exception("unkown type = " + valueType.toString());
				}
			}
			catch(Exception ex){
            	ex.printStackTrace();
				throw new Exception("convertToString error."+ex.getMessage());
			}
		}
	}
	
	//字符串转为值
	public static Object convertToObject(String str, String valueTypeStr) throws Exception{
		ValueType valueType = ValueType.String;
		try
		{
			valueType = ValueType.valueOf(valueTypeStr);
		}
		catch(Exception ex) {
        	ex.printStackTrace();
			throw new Exception("can not get value type = "+valueTypeStr+"."+ex.getMessage());
		}
		return ValueConverter.convertToObject(str, valueType);
	}
	
	//字符串转为值
	public static Object convertToObject(String str, ValueType valueType) throws Exception{
		if(str == null || str.isEmpty()) {
			return null;
		}
		else {
			try
			{
				switch(valueType) {
					case String:
						return str;  
					case Decimal:
						return Double.parseDouble(str);  
					case Boolean:
						if( "Y".equals(str) || "y".equals(str)) {
							return true;
						}
						else if("N".equals(str) || "n".equals(str)){
							return false;
						}
						else{
							return null;
						} 
					case Time:
						SimpleDateFormat sdf =   new SimpleDateFormat(ValueConverter.sysConfig.getTimeFormat());
						return sdf.parse(str);
					case Date:
						SimpleDateFormat stf =   new SimpleDateFormat(ValueConverter.sysConfig.getDateFormat());
						return stf.parse(str);
					default:
						throw new Exception("unkown type = " + valueType.toString());
				}
			}
			catch(Exception ex){
            	ex.printStackTrace();
				throw new Exception("convertToObject error. str = "+ str +", valueType = "+valueType.toString() + ". "+ ex.getMessage());
			}
		}
	}
	
	public static Object convertToDBObject(String str, ValueType valueType) throws Exception{
		if(str == null || str.isEmpty()){
			return null;
		}
		else {
			try
			{
				switch(valueType) {
					case String:
						return str;  
					case Decimal:
						return Double.parseDouble(str);  
					case Boolean:
						if( "Y".equals(str) || "y".equals(str) || "true".equals(str)) {
							return "Y";
						}
						else if("N".equals(str) || "n".equals(str) || "false".equals(str)){
							return "N";
						}
						else{
							return "";
						} 
					case Time:
						SimpleDateFormat sdf =   new SimpleDateFormat(ValueConverter.sysConfig.getTimeFormat());
						return sdf.parse(str);
					case Date:
						SimpleDateFormat stf =   new SimpleDateFormat(ValueConverter.sysConfig.getDateFormat());
						return stf.parse(str);
					default:
						throw new Exception("unkown type = " + valueType.toString());
				}
			}
			catch(Exception ex){
            	ex.printStackTrace();
				throw new Exception("convertToObject error. str = "+ str +", valueType = "+valueType.toString() + ". "+ ex.getMessage());
			}
		}
	}

	public static String arrayToString(String[] strs, String joinStr){
		StringBuilder ss = new StringBuilder();
		for(int i=0;i<strs.length;i++){
			ss.append((i == 0 ? "" : joinStr) + strs[i]);
		}
		return ss.toString();
	} 
	public static String arrayToString(List<String> strs, String joinStr){
		StringBuilder ss = new StringBuilder();
		for(int i=0;i<strs.size();i++){
			ss.append((i == 0 ? "" : joinStr) +strs.get(i));
		}
		return ss.toString();
	} 
	
	public static Integer DBBigDecimalToInteger(Object value){
		return  value == null ? null : ((BigDecimal)value).intValue();
	}
}
