package com.novacloud.novaone.excelGrid.expression.definition;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;

import com.novacloud.novaone.common.SysConfig;
import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.dao.db.ValueType;

public class ExpCommonValueType { 
	/*
	<ValueTypeDes Name="java.lang.String" Description="字符串"></ValueTypeDes>
	<ValueTypeDes Name="java.lang.Boolean" Description="布尔类型"></ValueTypeDes>
	<ValueTypeDes Name="java.util.Date" Description="日期时间"></ValueTypeDes>
	<ValueTypeDes Name="java.math.BigDecimal" Description="数值(BigDecimal)"></ValueTypeDes>
	<ValueTypeDes Name="void" Description="无类型"></ValueTypeDes>
	<ValueTypeDes Name="net.sf.json.JSONObject" Description="Json对象"></ValueTypeDes>
	<ValueTypeDes Name="net.sf.json.JSONArray" Description="Json数组"></ValueTypeDes>
	<ValueTypeDes Name="HashMap&lt;String, Object&gt;" Description="字符串对对象的键值对"></ValueTypeDes>
	<ValueTypeDes Name="INcpSession" Description="应用服务器会话"></ValueTypeDes>
	<ValueTypeDes Name="js.DataTable" Description="DataTable(js)"></ValueTypeDes>
	<ValueTypeDes Name="org.hibernate.Session" Description="数据库会话"></ValueTypeDes>		
	<ValueTypeDes Name="js.NcpView" Description="前端View窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.NcpSheet" Description="前端Sheet窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.NcpTree" Description="前端Tree窗口"></ValueTypeDes>			
	<ValueTypeDes Name="js.Array" Description="数组(js)"></ValueTypeDes>		
	*/
	public static final String Object = "java.lang.Object";
	public static final String String = "java.lang.String";
	public static final String Decimal = "java.math.BigDecimal";
	public static final String Boolean = "java.lang.Boolean";
	public static final String DateTime = "java.util.Date";
	public static final String Array = "com.novacloud.novaone.excelGrid.expression.defination.RangeArray";	
	
	public static Object convertTo(String str, String valueType) throws Exception{
		if(ExpCommonValueType.Object.equals(valueType)){
			return ExpCommonValueType.convertToObject(str, ValueType.Object);
		}
		else if(ExpCommonValueType.String.equals(valueType)){
			return ExpCommonValueType.convertToObject(str, ValueType.String);
		}
		else if(ExpCommonValueType.Decimal.equals(valueType)){
			return ExpCommonValueType.convertToObject(str, ValueType.Decimal);
		}
		else if(ExpCommonValueType.Boolean.equals(valueType)){
			return ExpCommonValueType.convertToObject(str, ValueType.Boolean);
		}
		else if(ExpCommonValueType.DateTime.equals(valueType)){
			return ExpCommonValueType.convertToObject(str, ValueType.Time);
		} 
		else{
			return ExpCommonValueType.convertToObject(str, valueType);
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
					case Object:
						return str;  
					case String:
						return str;  
					case Decimal:
						return new BigDecimal(str);
						//return new BigDecimal(Double.parseDouble(str));  
					case Boolean:
						if(str == null || str.length() == 0){
							return null;
						}
						else{
							str = str.toLowerCase();
							if( "y".equals(str) || "Y".equals(str) || "true".equals(str)) {
								return true;
							}
							else if("n".equals(str) || "N".equals(str) || "false".equals(str)){
								return false;
							}
							else {
								return null;
							}
						} 
					case Time:
						SimpleDateFormat sdf =   new SimpleDateFormat(SysConfig.getTimeFormat());
						return sdf.parse(str);
					case Date:
						SimpleDateFormat stf =   new SimpleDateFormat(SysConfig.getDateFormat());
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

	public static String getClientValueType(String runtimeValueType) throws Exception{
		if(runtimeValueType == null || runtimeValueType.length() == 0){
			return null;
		}
		else {
			switch(runtimeValueType){ 
				case ExpCommonValueType.String://"java.lang.String":
					return "string";
				case ExpCommonValueType.Decimal://"java.math.BigDecimal":
					return "decimal";
				case ExpCommonValueType.Boolean://"java.lang.Boolean":
					return "boolean";
				case ExpCommonValueType.DateTime://"java.util.Date":
					return "date";
				case ExpCommonValueType.Array:
					return "array";
				case ExpCommonValueType.Object:
					return "object";
				default:
					throw new Exception("Can not convert to client value type : '" + runtimeValueType + "'.");
			}
		}
	}
	
	public static String getRuntimeValueType(String clientValueType) throws Exception{
		if(clientValueType == null || clientValueType.length() == 0){
			return null;
		}
		else {
			clientValueType = clientValueType.toLowerCase();
			switch(clientValueType){
				case "object"://"java.lang.String":
					return ExpCommonValueType.Object;
				case "string"://"java.lang.String":
				return ExpCommonValueType.String;
				case "decimal"://"java.math.BigDecimal":
					return ExpCommonValueType.Decimal;
				case "boolean"://"java.lang.Boolean":
					return ExpCommonValueType.Boolean;
				case "date"://"java.util.Date":
					return ExpCommonValueType.DateTime;
				case "time"://"java.util.Time":
					return ExpCommonValueType.DateTime;
				case "Array":
					return ExpCommonValueType.Array;
				default:
					throw new Exception("Can not convert to runtime value type : '" + clientValueType + "'.");
			}
		}
	}
}
