package com.novacloud.dataHelper.memory;

import java.util.Date;
import java.util.HashMap;

public class GlobalVariables {
	private static HashMap<GlobalVariableType, Object> variables = new HashMap<GlobalVariableType, Object>();

	private static HashMap<GlobalVariableType, Date> expiredTimes = new HashMap<GlobalVariableType, Date>();

	public static void setValue(GlobalVariableType variableType, Object value, Date expiredTime){
		GlobalVariables.variables.put(variableType, value);
		if(expiredTime != null){
			GlobalVariables.expiredTimes.put(variableType, expiredTime);
		}
	}
	
	public static void clean(GlobalVariableType variableType){
		GlobalVariables.variables.remove(variableType);
		GlobalVariables.expiredTimes.remove(variableType); 
	}
	
	public static Object getValue(GlobalVariableType variableType){
		if(GlobalVariables.variables.containsKey(variableType)){
			Date expiredTime = GlobalVariables.expiredTimes.get(variableType);
			if(expiredTime == null || expiredTime.after(new Date())){ 
				return GlobalVariables.variables.get(variableType); 
			}
			else{
				GlobalVariables.variables.remove(variableType);
				GlobalVariables.expiredTimes.remove(variableType);
				return null;
			}
		}
		else{
			return null;
		}
	}
}
