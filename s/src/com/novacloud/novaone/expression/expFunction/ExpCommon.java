package com.novacloud.novaone.expression.expFunction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

import com.novacloud.novaone.common.JSONProcessor;

import net.sf.json.JSONObject;

//通用方法集合
public class ExpCommon { 
	//连接
	public String andString(Object param1, Object param2){
		String p1 = param1 == null ? "" : param1.toString();
		String p2 = param1 == null ? "" : param2.toString(); 
		return p1 + p2;
	}
	//加法
	public BigDecimal add(BigDecimal param1, BigDecimal param2){
		if(param1 == null){
			return param2;
		}
		else if(param2 == null){
			return param1;
		}
		else{
			return param1.add(param2);
		}
	}
	//加法
	public String add(String param1, String param2){
		String p1 = param1 == null ? "" : param1.toString();
		String p2 = param1 == null ? "" : param2.toString(); 
		return p1 + p2;
	}
	
	//正数
	public BigDecimal add(BigDecimal param1){
		return param1;
	}

	//负数
	public BigDecimal subtract(BigDecimal param1){
		if(param1 == null){
			return null;
		} 
		else{
			return BigDecimal.ZERO.subtract(param1);
		}
	}

	//减法
	public BigDecimal subtract(BigDecimal param1, BigDecimal param2){
		if(param2 == null){
			return param1;
		}
		else if(param1 == null){
			return BigDecimal.ZERO.subtract(param1);
		}
		else{
			return param1.subtract(param2);
		}
	}
	
	//减法
	public BigDecimal multiply(BigDecimal param1, BigDecimal param2){
		if(param1 == null || param2 ==null){
			return null;
		}
		else{
			return param1.multiply(param2);
		}
	}
	
	//除法
	public BigDecimal divide(BigDecimal param1, BigDecimal param2) throws Exception{
		if(param2 == null){
			throw new Exception("除数不能为空");
		}
		else if(param1 == null){
			return null;
		}
		else{
			return param1.divide(param2, 20, RoundingMode.HALF_DOWN);
		}
	}
	
	//相等
	public boolean equal(BigDecimal param1, BigDecimal param2){
		if(param1 == null){
			return param2 == null;
		}
		else{
			return param1.equals(param2);
		}
	} 
	
	//相等
	public boolean equal(String param1, String param2){
		if(param1 == null){
			return param2 == null;
		}
		else{
			return param1.equals(param2);
		}
	} 
	
	//相等
	public boolean equal(Date param1, Date param2){
		if(param1 == null){
			return param2 == null;
		}
		else{
			return param1.equals(param2);
		}
	} 
	
	//相等
	public boolean equal(Object param1, Object param2){ 
		if(param1 == null){
			return param2 == null;
		}
		else{
			return param1.equals(param2);
		}
	} 
	
	//大于
	public boolean moreThan(BigDecimal param1, BigDecimal param2){
		if(param1 == null || param2 == null){
			throw new RuntimeException("值为空，无法比较大小");
		}
		else{
			return param1.compareTo(param2) == 1;
		}
	}   
	
	//小于
	public boolean lessThan(BigDecimal param1, BigDecimal param2){
		if(param1 == null || param2 == null){
			throw new RuntimeException("值为空，无法比较大小");
		}
		else{
			return param1.compareTo(param2) == -1;
		}
	}  
	
	//大于等于
	public boolean moreThanOrEqual(BigDecimal param1, BigDecimal param2){
		if(param1 == null || param2 == null){
			throw new RuntimeException("值为空，无法比较大小");
		}
		else{
			return param1.compareTo(param2) >= 0;
		}
	}  
	
	//小于等于
	public boolean lessThanOrEqual(BigDecimal param1, BigDecimal param2){
		if(param1 == null || param2 == null){
			throw new RuntimeException("值为空，无法比较大小");
		}
		else{
			return param1.compareTo(param2) <= 0;
		}
	}  

	//Json转字符串
	public String jsonToString(JSONObject json){
		String s = JSONProcessor.jsonToStr(json);
		return s;
	}
	
	//字符串转Json
	public JSONObject stringToJson(String str) throws Exception{
		JSONObject obj = JSONProcessor.strToJSON(str);
		return obj;
	}

	//IIF判断
	public String iif(boolean check, String returnValue1, String returnValue2){
		 return check ? returnValue1 : returnValue2;
	}
	//IIF判断
	public Date iif(boolean check, Date returnValue1, Date returnValue2){
		 return check ? returnValue1 : returnValue2;
	}
	//IIF判断
	public BigDecimal iif(boolean check, BigDecimal returnValue1, BigDecimal returnValue2){
		 return check ? returnValue1 : returnValue2;
	}
	//IIF判断
	public JSONObject iif(boolean check, JSONObject returnValue1, JSONObject returnValue2){
		 return check ? returnValue1 : returnValue2;
	}
	
	//and
	public boolean and(boolean param1, boolean param2){
		 return param1 && param2;
	}
	//or
	public boolean or(boolean param1, boolean param2){
		 return param1 || param2;
	}
}
