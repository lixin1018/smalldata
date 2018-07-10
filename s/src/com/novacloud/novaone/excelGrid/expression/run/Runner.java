package com.novacloud.novaone.excelGrid.expression.run;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
import org.hibernate.Session;
 
import com.novacloud.novaone.dao.sys.ContextUtil;
import com.novacloud.novaone.excelGrid.expression.definition.CellObject;
import com.novacloud.novaone.excelGrid.expression.definition.CellReferanceInfo;
import com.novacloud.novaone.excelGrid.expression.definition.CellReferanceSourceType;
import com.novacloud.novaone.excelGrid.expression.definition.Columns;
import com.novacloud.novaone.excelGrid.expression.definition.ExpCommonValueType;
import com.novacloud.novaone.excelGrid.expression.definition.ExpTreePart;
import com.novacloud.novaone.excelGrid.expression.definition.Function;
import com.novacloud.novaone.excelGrid.expression.definition.FunctionSetting;
import com.novacloud.novaone.excelGrid.expression.definition.IEnvironment;
import com.novacloud.novaone.excelGrid.expression.definition.Parameter;
import com.novacloud.novaone.excelGrid.expression.definition.PartType;
import com.novacloud.novaone.excelGrid.expression.definition.RangeArray;
import com.novacloud.novaone.excelGrid.expression.definition.Rows;
import com.novacloud.novaone.excelGrid.expression.definition.Sheets; 

//运行
public class Runner {
	
	private IEnvironment expEnvironment;
	public void setExpEnvironment(IEnvironment expEnvironment){
		this.expEnvironment = expEnvironment;
	}
	
	private Session dBSession = null;
	private void setDBSession(Session dBSession){
		this.dBSession = dBSession;
	}
	
	public RunResult runExp(ExpTreePart rootExpPart, Map<String, Object> cellValues, List<RuntimeUserParameter> parameters, String sheetId, Sheets sheets, Session dbSession){
		this.setDBSession(dbSession); 
		try
		{ 
			Map<String, Object> p2vs = new HashMap<String, Object>();
			if(parameters != null && parameters.size() != 0){
				for(int i=0;i<parameters.size();i++){
					RuntimeUserParameter userP = parameters.get(i);
					p2vs.put(userP.getName().toLowerCase(), userP.getValue());
				}
			}	 
			Object resultValue = getResultValue(rootExpPart, cellValues, p2vs, sheetId, sheets);
			RunResult runResult = new RunResult();
			runResult.setSucceed(true);
			runResult.setValue(resultValue);
			return runResult; 
		}
		catch(Exception ex){
			RunResult runResult = new RunResult();
			runResult.setSucceed(false);
			runResult.setValue(null);
			runResult.setError(ex.getMessage() + (ex.getCause() == null ? "" :( "," + ex.getCause().getMessage())));  
			return runResult;
		} 
	}
	
	public Object getResultValue(ExpTreePart part, Map<String, Object> cellValues, Map<String, Object> p2vs, String sheetId, Sheets sheets) throws Exception {
		if(part == null){
			return null;
		}
		else{
			PartType partType = part.getPartType();
			if(partType == PartType.Bracket){
			    List<ExpTreePart> childParts = part.getAllChildParts();
				return this.getResultValue(childParts.get(0), cellValues, p2vs, sheetId, sheets);
			}
			else if(partType == PartType.Constant){
				String valueType = part.getResultType(); 
				try {
					Object value = ExpCommonValueType.convertTo(part.getText(), valueType); 
					return value;
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			    	throw new RuntimeException("转换到类型"+valueType.toString()+"失败, 值为\"" + part.getText() + "\"");
				} 
			}
			else if(partType == PartType.UserParameter){
				String pName = part.getText().toLowerCase();
				if(p2vs.containsKey(pName)){
					Object value = p2vs.get(pName);
					return value;
				}
				else{
			    	throw new RuntimeException("无法获取用户自定义参数值, 参数名为\"" + pName + "\"");
				}
			}
			else if(partType == PartType.Function){
				return runFunction(part, cellValues, p2vs, sheetId, sheets);
			}
			else if(partType == PartType.CellReferance){
				if(part.getCellReferSourceType() == CellReferanceSourceType.CurrentSheet){
					CellReferanceInfo cellRefInfo = part.getCellRefInfo();
					String cellId = sheetId + "_" + cellRefInfo.getColId() + "_" +cellRefInfo.getRowId();
					String colName = cellRefInfo.getColName();
					String rowName = cellRefInfo.getRowName();
					Object value = cellValues.get(cellId);
					CellObject cellObj = new CellObject(colName, rowName, value);
					return cellObj;
				}
				else if(part.getCellReferSourceType() == CellReferanceSourceType.RemoteSheet){ 
					String cellRefSheetId = part.getCellReferSheetId();
					CellReferanceInfo cellRefInfo = part.getCellRefInfo();
					String cellId = cellRefSheetId + "_" + cellRefInfo.getColId() + "_" +cellRefInfo.getRowId();
					return cellValues.get(cellId);					
				}
				else{
					throw new RuntimeException("错误的CellReferanceSourceType");
				}
			}
			else if(partType == PartType.RangeReferance){
				if(part.getCellReferSourceType() == CellReferanceSourceType.CurrentSheet){
					CellReferanceInfo fromRefInfo = part.getFromCellRefInfo();
					CellReferanceInfo toRefInfo = part.getToCellRefInfo();
					
					RangeArray rangeArray = new RangeArray(sheetId, sheets, fromRefInfo.getColId(), fromRefInfo.getRowId(), toRefInfo.getColId(), toRefInfo.getRowId(), cellValues);
					
					return rangeArray;
				}
				else if(part.getCellReferSourceType() == CellReferanceSourceType.RemoteSheet){
					String cellRefSheetId = part.getCellReferSheetId(); 
					CellReferanceInfo fromRefInfo = part.getFromCellRefInfo();
					CellReferanceInfo toRefInfo = part.getToCellRefInfo();
					
					RangeArray rangeArray = new RangeArray(cellRefSheetId, sheets, fromRefInfo.getColId(), fromRefInfo.getRowId(), toRefInfo.getColId(), toRefInfo.getRowId(), cellValues);
					
					return rangeArray;
				}
				else{
					throw new RuntimeException("错误的CellReferanceSourceType");
				}
			}
			else{
		    	throw new RuntimeException("无法获取片段返回值, 片段为" + part.getText() + ", 类型为\"" + part.getPartType().toString() + "\"");
			}
		}
	} 
	public long timespan = 0;
	
	public Object runFunction(ExpTreePart part, Map<String, Object> cellValues, Map<String, Object> p2vs, String sheetId, Sheets sheets) throws Exception {
		String functionName = part.getText();
		Function func = expEnvironment.getFunction(functionName);
	    String beanName = func.getBeanName();
	    String methodName = func.getMethodName();
	    Object bean = ContextUtil.getBean(beanName);
	    if(bean == null){ 
	    	throw new RuntimeException("未找到对应的Bean, 名为\"" + beanName + "\"");
	    }
	    
	    if(bean instanceof ExternalBase){
	    	IDatabaseAccess databaseAccess = ((ExternalBase)bean).getDatabaseAccess();
	    	if(databaseAccess != null){
	    		databaseAccess.setSession(this.dBSession);
	    	}
	    }
	    
	    
	    FunctionSetting funcSetting = part.getFunctionSetting();
	    List<Parameter> allParameters = funcSetting.getAllParameters();
	    Object[] parameterValues = new Object[allParameters.size()];
	    Class[] parameterClassArray = new Class[allParameters.size()];
	    List<ExpTreePart> childParts = part.getAllChildParts();
	    if(allParameters != null){
	    	int funcSettingParamCount = allParameters.size();
	    	int childPartCount = childParts.size();
	    	int repeatableParamCount = 0;
	    	List<List<Object>> repeatParameterValues = new ArrayList<List<Object>>(); 
		    List<Class> repeatableParameterClassArray = new ArrayList<Class>();
	    	for(int i = 0; i < funcSettingParamCount; i++){ 
	    		ExpTreePart childP = childParts.get(i*2);
    			Parameter parameter = allParameters.get(i);
    			String valueType = parameter.getValueType();
    			boolean repeatable = parameter.getRepeatable();
    			Class cl = null;    			
    			String runValueType = ""; 
    			try {
    				if(!repeatable){
    					runValueType = valueType;
    					cl = Class.forName(valueType);
    				}
    				else{
    					//runValueType = "java.util.List<" + valueType + ">";
    					runValueType = "java.util.List";
    					cl = Class.forName(runValueType);
    				}
        			parameterClassArray[i] = cl;
				} 
    			catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
    				throw new Exception("无法找到对应方法，无效的参数类型: " + runValueType, e);
				}
    			
				if(!repeatable){
					Object pValue = getResultValue(childP, cellValues, p2vs, sheetId, sheets);
					pValue = this.convertTo(cl, pValue);
					parameterValues[i] = pValue;
				}
				else {
					List<Object> paramObjects = new ArrayList<Object>();
					Object pValue = getResultValue(childP, cellValues, p2vs, sheetId, sheets);
					pValue = this.convertTo(cl, pValue);
					paramObjects.add(pValue);
					parameterValues[i] = paramObjects;
					repeatParameterValues.add(paramObjects);
					repeatableParamCount++;
					repeatableParameterClassArray.add(cl);
				}
	    	}
	    	if(repeatableParamCount > 0){
	    		//可重复的参数(从大于funcSettingParamCount的那个参数开始循环）
		    	for(int i = funcSettingParamCount * 2; i < childPartCount; i = (i + 2 * repeatableParamCount)){
		    		for(int j = 0; j < repeatableParamCount; j++){
		    			List<Object> paramObjects = repeatParameterValues.get(j);
			    		ExpTreePart childP = childParts.get(i + j * 2);			    		
			    		Object pValue = getResultValue(childP, cellValues, p2vs, sheetId, sheets);
			    		
			    		Class cl = repeatableParameterClassArray.get(j);
			    		pValue = this.convertTo(cl, pValue);
						paramObjects.add(pValue);
		    		}
		    	}
	    	}
	    }  
	    
	    Method method;
		try {
			method = bean.getClass().getMethod(methodName, parameterClassArray);
			if(method == null){ 
		    	StringBuilder s = new StringBuilder();
		    	for(int i=0;i<allParameters.size();i++){
		    		s.append( (i==0?"":", ") + allParameters.get(i).getValueType().toString());
		    	}
		    	throw new Exception("未找到对应的函数. methodName = " + methodName + ",参数为" + s.toString()); 
			}
			else{
		    	try {
					return method.invoke(bean, parameterValues);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();  
			    	throw new Exception("运行函数出错, methodName = " + methodName, (e instanceof InvocationTargetException) ? ((InvocationTargetException)e).getTargetException() : e);
				}
			}
		} 
		catch (Exception e) { 
			throw e;
		}    
	}
	private Object convertTo(Class destClass, Object sourceValue) throws Exception{
		//如果是sourceValue为CellObject类型，而函数要求的不是此类型，那么获取Cell.Object.value继续处理
		if(sourceValue == null){
			return null;
		}
		else if(CellObject.class.isInstance(sourceValue)){
			if(destClass == CellObject.class){
				return sourceValue;
			}
			else{
				return ((CellObject)sourceValue).getValue();
			}
		}
		else if(destClass.isInstance(sourceValue)){
			return sourceValue;						
		}
		else{
						
			//需要判断，pValue是否能自动转换成需要的类型
			try{
				if(destClass == BigDecimal.class){
					return BigDecimal.valueOf(Double.parseDouble(sourceValue.toString()));
				}
				else if(destClass == String.class){
					return sourceValue.toString();
				}
				else{
					return destClass.cast(sourceValue);
				}
			}
			catch(Exception ex){
				throw new Exception("无法将" + sourceValue.toString() + "转换成" + destClass.getName() + "类型");
			}
		}
	}
}
