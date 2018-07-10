package com.novacloud.novaone.excelGrid.expression.definition;
 
import java.io.UnsupportedEncodingException; 
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;

import com.novacloud.novaone.common.ValueConverter;
import com.novacloud.novaone.common.util.CommonFunction; 
import com.novacloud.novaone.dao.db.ValueType;
import com.novacloud.novaone.excelGrid.definition.ExcelGridCell;

//验证表达式
public class Validator implements InitializingBean { 
	
	private IEnvironment expEnvironment;
	public void setExpEnvironment(IEnvironment expEnvironment){
		this.expEnvironment = expEnvironment;
	}  
	
	private ExpTreePart createPart(String text, PartType partType, String resultType){
		ExpTreePart part = new ExpTreePart();
		part.setText(text);
		part.setPartType(partType);
		part.setResultType(resultType);
		return part;
	}
	
	public ValidateResult validateExp(String exp, HashMap<String, ValueType> cellValueTypes, String sheetId, Sheets sheets, HashMap<String, ValueType> fieldTypes, RunAt runAt, ValueType needResultType) throws Exception{
		List<Parameter> parameters = new ArrayList<Parameter>();
		for(String key : fieldTypes.keySet()){
			ValueType  valueType = fieldTypes.get(key);
			Parameter parameter = new Parameter();
			parameter.setName(key);
			parameter.setValueType(ExpCommonValueType.getRuntimeValueType(valueType.toString().toLowerCase()));
			parameters.add(parameter);
		}
		
		
		//！！！！！！！！！！！
		//1. 实现验证表达式，增加了cellValueTypes, columns, rows三个参数；
		//2. 在testExcelExpression.jsp页面实现客户端调用服务器端的OnlineExcelGridService类里的validateExcelExpression方法，来验证表达式。需要在配置文件里声明OnlineExcelGridService服务。

		return this.validateExp(exp, cellValueTypes, sheetId, sheets, parameters, runAt, needResultType == null ? "": needResultType.toString().toLowerCase());
	}
	
	public List<ExpTreePart> getExpTreeParts(String exp, HashMap<String, ValueType> cellValueTypes, String cellSheetId, Sheets sheets ) throws Exception{

		List<String> errors = new ArrayList<String>();
		try{			
			List<ExpTreePart> allParts = this.splitParts(exp, errors);
			
			if(errors.size() != 0){
				String errorStr = ValueConverter.arrayToString(errors, "\r\n");
				throw new Exception( "表达式验证未通过. Expression:" + exp + ". Errors:" + errorStr);
			}
			
			//识别单元格引用
			this.findCellReference(allParts, cellValueTypes, cellSheetId, sheets);
			
			return allParts;			
		}
  		catch(Exception ex){
  			throw ex;
		}
	}
	
	public void getExpTreePartValueType(List<ExpTreePart> allParts, HashMap<String, ValueType> cellValueTypes, String sheetId, Sheets sheets) throws Exception{
		for(int i = 0; i < allParts.size(); i++){
			ExpTreePart expTreePart = allParts.get(i);
			switch(expTreePart.getPartType()){ 
				case CellReferance:{
					String refSheetId = sheetId;
					if(expTreePart.getCellReferSourceType() == CellReferanceSourceType.RemoteSheet){
						refSheetId = expTreePart.getCellReferSheetId();
					} 
					CellReferanceInfo cellReferInfo = expTreePart.getCellRefInfo();
					String cellId = refSheetId + "_" + cellReferInfo.getColId() + "_" + cellReferInfo.getRowId();
					ValueType cellValueType = cellValueTypes.get(cellId);
					expTreePart.setResultType(ExpCommonValueType.getRuntimeValueType(cellValueType.toString())); 
				}
				break;
				case RangeReferance:
					expTreePart.setResultType(ExpCommonValueType.Array);
				break;
			}
		}
	}
	
	public ValidateResult validateExp(String exp, HashMap<String, ValueType> cellValueTypes, String sheetId, Sheets sheets, List<Parameter> userParameters, RunAt runAt, String needResultType) throws Exception{
		try{
			List<ExpTreePart> allParts = this.getExpTreeParts(exp, cellValueTypes, sheetId, sheets);
			ExpTreePart rootPart = this.getRootPart(allParts, cellValueTypes, userParameters, runAt, sheetId, sheets);
			String resultType = this.getExpResultValueType(rootPart, needResultType);
			
			ValidateResult result = new ValidateResult(); 
			result.setValueType(resultType);  
			result.setRootPart(rootPart);
			result.setRunAt(runAt); 
			return result;
		}
		catch(Exception ex){
			ValidateResult result = new ValidateResult();
			result.setError(ex.getMessage());  
			result.setRunAt(RunAt.None); 
			return result;
		}
		

	} 
	
	public ExpTreePart getRootPart(List<ExpTreePart> allParts, HashMap<String, ValueType> cellValueTypes, List<Parameter> userParameters, RunAt runAt, String sheetId, Sheets sheets) throws Exception{

		List<String> errors = new ArrayList<String>();
		
		this.getExpTreePartValueType(allParts, cellValueTypes, sheetId, sheets);
		
		Map<String, String> userParameterHash = new HashMap<String, String>();
		if(userParameters != null){
			for(int i=0;i<userParameters.size();i++){
				Parameter p = userParameters.get(i);
				String name = p.getName().toLowerCase();
				if(userParameterHash.containsKey(name)){
					errors.add("存在多个名为" + name + "的参数, 不区分大小写");
				}
				else{
					userParameterHash.put(name, p.getValueType());
				}
			}
		}
		String resultType = null;
		
		//词法分析结果
		System.out.println("词法分析结果");
		for(int i=0;i<allParts.size();i++){
			ExpTreePart p = allParts.get(i);
			System.out.println(p.getText()+"|####|"+p.getPartType().toString() +","+(p.getResultType() == null? "null" : p.getResultType().toString()));
		}
				
		if(errors.size() == 0)   {
			if(checkPartType(allParts, userParameterHash, errors)){
				allParts = this.processBracket(allParts, errors); 
				if(errors.size() == 0){
					//构造树
					System.out.println("打印语法树,处理了括号");
					allParts = this.processFunctionBracket(allParts, errors);
					if(errors.size() == 0){						
						allParts = this.processComma(allParts, errors);
						//构造树
						System.out.println("打印语法树，处理了逗号"); 
						if(errors.size() == 0){
							allParts = this.processOperatorLevel2(allParts, errors);
							System.out.println("打印语法树，处理了乘法除法");
							if(errors.size() == 0){
								allParts = this.processOperatorLevel1(allParts, errors);
								System.out.println("打印语法树，处理了加法减法"); 
								
								if(errors.size() == 0){
									return this.getRootPart(allParts); 
								}
							}
						}
					}					
				}
			}
		}		
		throw new Exception(ValueConverter.arrayToString(errors, ";"));
	}
	
	public String getExpResultValueType(ExpTreePart rootPart, String needResultType) throws Exception{
		List<String> errors = new ArrayList<String>();
		String resultType = processFunctionResultType(rootPart, RunAt.Server, errors);
		
		String resultClientType = ExpCommonValueType.getClientValueType(resultType);
		if(needResultType != null && needResultType.length() != 0){
			if(resultClientType != null && !needResultType.equals(resultClientType)) {
				if((resultClientType.equals("time") && needResultType.equals("date"))
					|| (resultClientType.equals("date") && needResultType.equals("time"))){
					//如果两者为时间或日期类型，那么也认为是可以的
				}
				else{
					errors.add("返回值类型错误. 要求返回值类型为" + needResultType.toString() + ", 实际返回值为" + resultClientType.toString());
				}
			}
		}
		

		System.out.println("错误信息, 共" + errors.size() + "条");
		String errorStr = ""; 
		if(resultClientType != null){
			System.out.println("表达式结果类型为" + resultClientType.toString());
		}
		for(int i=0;i<errors.size();i++){
			errorStr += errors.get(i);
			System.out.println(errors.get(i));
		}
		
		if(errors.size() != 0){
			throw new Exception(errorStr);
		}
		else{
			return resultClientType;
		}
	}
	
	private void findCellReference(List<ExpTreePart> allParts, HashMap<String, ValueType> cellValueTypes, String cellSheetId, Sheets sheets) throws Exception{
		for(int i = 0; i < allParts.size(); i++){
			ExpTreePart p = allParts.get(i);
			String sheetId = cellSheetId;
			if(p.getPartType() == PartType.Unknown){
				String[] ps = p.getText().split("!");
				CellReferanceSourceType cellReferanceSourceType = CellReferanceSourceType.CurrentSheet;
				if(ps.length > 1){
					cellReferanceSourceType = CellReferanceSourceType.RemoteSheet;
					String sheetName = ps[0];
					if(sheetName.startsWith("'")){
						sheetName = sheetName.substring(1, sheetName.length());
					}
					if(sheetName.endsWith("'")){
						sheetName = sheetName.substring(0, sheetName.length() - 1);
					}
					sheetName.replace("''", "'");
					sheetId = sheets.getSheetIdByName(sheetName);
					p.setCellReferSheetId(sheetId);
					p.setCellReferSheetName(sheetName);
				}
				String[] names = ps[ps.length - 1].split(":");
				if(names.length == 1){
					String cellName = names[0];
					CellReferanceInfo cellRefInfo = this.getCellReferenceInfo(cellName, sheetId, sheets, false);
					if(cellRefInfo != null){
						if(cellRefInfo.getColName().length() != 0 && cellRefInfo.getRowName().length() != 0){
							p.setCellRefInfo(cellRefInfo);
							p.setPartType(PartType.CellReferance);
							p.setCellReferSourceType(cellReferanceSourceType);
							String rowId = cellRefInfo.getRowId();
							String colId = cellRefInfo.getColId();
							String cellId = sheetId + "_" + colId + "_" + rowId;
							ValueType cellValueType = cellValueTypes.get(cellId);
							p.setResultType(ExpCommonValueType.getRuntimeValueType(cellValueType.toString()));
						}
					}
				}
				else if(names.length == 2){
					String fromCellName = names[0];
					String toCellName = names[1];
					CellReferanceInfo fromCellRefInfo = this.getCellReferenceInfo(fromCellName, sheetId, sheets, true);
					CellReferanceInfo toCellRefInfo = this.getCellReferenceInfo(toCellName, sheetId, sheets, true);
					if(fromCellRefInfo != null && toCellRefInfo != null){
						if(((fromCellRefInfo.getColName().length() == 0 && toCellRefInfo.getColName().length() == 0) || (fromCellRefInfo.getColName().length() != 0 && toCellRefInfo.getColName().length() != 0))
							&& ((fromCellRefInfo.getRowName().length() == 0 && toCellRefInfo.getRowName().length() == 0) || (fromCellRefInfo.getRowName().length() != 0 && toCellRefInfo.getRowName().length() != 0))								
							&& (fromCellRefInfo.isColAbsolute() == toCellRefInfo.isColAbsolute())
							&& (fromCellRefInfo.isRowAbsolute() == toCellRefInfo.isRowAbsolute())){							
							p.setFromCellRefInfo(fromCellRefInfo);
							p.setToCellRefInfo(toCellRefInfo); 
							p.setPartType(PartType.RangeReferance);
							p.setCellReferSourceType(cellReferanceSourceType);
						}
					}
				}
			}
		}
	}

	private CellReferanceInfo getCellReferenceInfo(String cellName, String sheetId, Sheets sheets, boolean isRangeRef){
		Columns columns = sheets.getColumns(sheetId);
		Rows rows = sheets.getRows(sheetId);
		boolean isCellRef = true; 
		int j = 0;
		List<Integer> letterPos = new ArrayList<Integer>();
		List<Integer> numPos = new ArrayList<Integer>();
		List<Integer> dollarPos = new ArrayList<Integer>();
		while(j < cellName.length()){
			char chr = cellName.charAt(j);
			if(chr == '$'){
				dollarPos.add(j);
			}
			else if(chr >= 'A' && chr <= 'z'){
				letterPos.add(j);
			}
			else if(chr >= '0' && chr <= '9'){
				numPos.add(j);
			}
			else{
				isCellRef = false;
				break;
			}
			j++;
		}
		if(isCellRef){
			if(dollarPos.size() == 0){
				for(int lIndex = 0; lIndex < letterPos.size(); lIndex++){
					int letterIndex = letterPos.get(lIndex);
					for(int nIndex = 0; nIndex < numPos.size(); nIndex++){
						int numIndex = numPos.get(nIndex);
						if(numIndex < letterIndex){
							isCellRef = false;
							break;
						}
					}
				}
			}
			else if(dollarPos.size() == 1){
				int dollarIndex = dollarPos.get(0);
				if(dollarIndex == 0){
					for(int lIndex = 0; lIndex < letterPos.size(); lIndex++){
						int letterIndex = letterPos.get(lIndex);
						for(int nIndex = 0; nIndex < numPos.size(); nIndex++){
							int numIndex = numPos.get(nIndex);
							if(numIndex < letterIndex){
								isCellRef = false;
								break;
							}
						}
					}
				}
				else{
					for(int lIndex = 0; lIndex < letterPos.size(); lIndex++){
						int letterIndex = letterPos.get(lIndex);
						if(letterIndex > dollarIndex){
							isCellRef = false;
							break;
						}
					}	
					for(int nIndex = 0; nIndex < numPos.size(); nIndex++){
						int numIndex = numPos.get(nIndex);
						if(numIndex < dollarIndex){
							isCellRef = false;
							break;
						}
					}							
				}
			}
			else if(dollarPos.size() == 2){
				int dollarAIndex = dollarPos.get(0);
				int dollarBIndex = dollarPos.get(1);
				if(dollarAIndex > 0){
					isCellRef = false;
				}
				else if(dollarBIndex == 1 && dollarBIndex == cellName.length() - 1){
					isCellRef = false;
				} 
				else{
					for(int lIndex = 0; lIndex < letterPos.size(); lIndex++){
						int letterIndex = letterPos.get(lIndex);
						if(letterIndex > dollarBIndex){
							isCellRef = false;
							break;
						}
					}	
					for(int nIndex = 0; nIndex < numPos.size(); nIndex++){
						int numIndex = numPos.get(nIndex);
						if(numIndex < dollarBIndex){
							isCellRef = false;
							break;
						}
					}							
				}
			}
			else{
				isCellRef = false;
			}
			if(isCellRef){
				String colName = "";
				String rowName = "";
				String colId = "";
				String rowId = "";
				boolean colAbsolute = false;
				boolean rowAbsolute = false;
				if(letterPos.size() > 0){
					int firstLetterIndex =  letterPos.get(0);
					if(firstLetterIndex > 0){
						colAbsolute = cellName.charAt(firstLetterIndex - 1) == '$';
					}
				}
				for(int lIndex = 0; lIndex < letterPos.size(); lIndex++){
					int letterIndex = letterPos.get(lIndex);
					colName += String.valueOf(cellName.charAt(letterIndex)).toUpperCase();
				}
				if(numPos.size() > 0){
					int firstNumIndex =  numPos.get(0);
					if(firstNumIndex > 0){
						rowAbsolute = cellName.charAt(firstNumIndex - 1) == '$';
					}
				}
				for(int nIndex = 0; nIndex < numPos.size(); nIndex++){
					int numIndex = numPos.get(nIndex);
					rowName += cellName.charAt(numIndex);
				}		
				if(colName.length() != 0){
					Integer colIndex = 0;
					try{
						colIndex = columns.getColumnIndexByName(colName);
					}
					catch(Exception ex){
						throw ex;
					}
					if(colIndex == null){
						isCellRef = false;
					}
					else{
						colId = columns.getColumnId(colIndex);
					}
				}
				else{
					//如果不是选择的区域，那么系统会解析成数值常量，而不是引用
					if(!isRangeRef){
						isCellRef = false;
					}
				}
				if(isCellRef && rowName.length() != 0){
					int rowIndex = Integer.parseInt(rowName) - 1;
					rowId = rows.getRowId(rowIndex);
					if(rowId == null){
						isCellRef = false;
					} 
				}
				if(isCellRef){
					CellReferanceInfo cellRefInfo = new CellReferanceInfo(colName, colId, colAbsolute, rowName, rowId, rowAbsolute);
					return cellRefInfo;
				}
				else{
					return null;
				}
			}
			else{
				return null;
			}
		}
		else{
			return null;
		}
	}
	
	private void printTree(List<ExpTreePart> treeParts, int level){
		if(treeParts != null) {
			for(int i=0;i<treeParts.size();i++){		
				ExpTreePart p = treeParts.get(i);
				System.out.println( CommonFunction.getRepeatString("    ", level ) + p.getText() + "|####|"+p.getPartType().toString() +","+(p.getResultType() == null? "null" : p.getResultType().toString()));
				List<ExpTreePart> childParts = p.getAllChildParts();
				if(childParts != null){
					printTree(childParts, level+1);
				}
			}
		}
	}
	
	private String processFunctionResultType(ExpTreePart part, String functionName, List<String> parameterValueTypes, List<PartType> parameterPartTypes, RunAt runAt, List<String> errors){
		Function func = this.expEnvironment.getFunction(functionName.toLowerCase());
		if(func.getRunAt() == runAt || func.getRunAt() == RunAt.All){ 
			FunctionSetting funcSetting = func.getFunctionSetting(parameterValueTypes, parameterPartTypes);				
			if(funcSetting == null){
				errors.add("函数\"" + functionName + "\"的参数类型错误");
				return null;
			}
			else {
				part.setFunctionSetting(funcSetting);
				return funcSetting.getResultType();
			}
		}
		else{
			errors.add("函数\"" + functionName + "\"的只允许运行在" + func.getRunAt().toString() + "端");
			return null;
		}
	}
	
	//获取此part实际对应的内容的类型，用于在判断函数的functionsetting时使用
	private PartType getBracketInnerPartType(ExpTreePart part){
		if(part.getPartType() != PartType.Bracket){
			return part.getPartType();
		}
		else{
		   List<ExpTreePart> childParts = part.getAllChildParts();
		   if(childParts.size() == 1){
			   return this.getBracketInnerPartType(childParts.get(0));
		   }
		   else{
			   return PartType.Bracket;
		   }
		}
	}
	 
	//处理函数的返回值类型
	private String processFunctionResultType(ExpTreePart parentPart, RunAt runAt, List<String> errors){
		PartType partType = parentPart.getPartType();
		if(partType == PartType.Function){
			List<ExpTreePart> treeParts = parentPart.getAllChildParts();
			if(treeParts != null){				 
				if( treeParts.size()% 2 == 0){
					errors.add("函数\"" + parentPart.getText() + "\"的参数定义错误");
					return null;
				}
				else{
					boolean canGetParameterValueType = true;
					List<String> parameterValueTypes = new ArrayList<String>();
					List<PartType> parameterPartTypes = new ArrayList<PartType>();
					for(int i=0;i<treeParts.size();i++){
						ExpTreePart p = treeParts.get(i);
						if(i % 2 == 0){
							String vt = processFunctionResultType(p, runAt, errors);
							if(vt != null){
								parameterValueTypes.add(vt);
								parameterPartTypes.add(this.getBracketInnerPartType(p));
							}
							else{
								canGetParameterValueType=false;
								break;
							}
						}
						else{
							if(p.getPartType() != PartType.Comma){
								errors.add("函数\"" + parentPart.getText() + "\"的参数定义错误");
							}
						}						
					}
					if(canGetParameterValueType){
						String resultType = processFunctionResultType(parentPart, parentPart.getText(), parameterValueTypes, parameterPartTypes, runAt, errors);
						parentPart.setResultType(resultType);
						return resultType;
					}
					else{
						return null;
					}
				}
			}
			else{
				String resultType = processFunctionResultType(parentPart,  parentPart.getText(), null, null, runAt, errors);
				parentPart.setResultType(resultType);
				return resultType;
			}
		} 
		else if(partType == PartType.Comma){
			errors.add("无效的表达式, 逗号\",\"出现的位置错误");
			return null;
		}
		else if(partType == PartType.Constant){
			return parentPart.getResultType();
		}
		else if(partType == PartType.Bracket){
			String resultType =  processFunctionResultType(parentPart.getAllChildParts(), runAt, errors);
			//parentPart.setPartType(parentPart.getAllChildParts().get(0).getPartType());
			parentPart.setResultType(resultType);
			return resultType;
		}
		else if(partType == PartType.UserParameter){
			return parentPart.getResultType();
		}
		else if(partType == PartType.CellReferance){
			return parentPart.getResultType();
		}
		else if(partType == PartType.RangeReferance){
			return parentPart.getResultType();
		}
		else{
			errors.add("无效的表达式" + parentPart.getText());
			return null;
		}
	}
	 
	//处理函数的返回值类型
	private String processFunctionResultType(List<ExpTreePart> rootParts, RunAt runAt, List<String> errors){
		if(rootParts != null && rootParts.size() > 1){
			errors.add("请确认是否输入了一个完整的表达式, 有无出现空格使得表达式断开, 或者为空表达式");
			return null;
		}
		else if(rootParts == null || rootParts.size() == 0){
			return null;
		}
		else{
			ExpTreePart rootPart = rootParts.get(0); 
			return this.processFunctionResultType(rootPart, runAt, errors); 
		}
	}
	 
	//处理函数的返回值类型
	private ExpTreePart getRootPart(List<ExpTreePart> rootParts) throws Exception{
		if(rootParts != null && rootParts.size() > 1){
			throw new Exception("请确认是否输入了一个完整的表达式, 有无出现空格使得表达式断开, 或者为空表达式");
		}
		else if(rootParts == null || rootParts.size() == 0){
			return null;
		}
		else{
			ExpTreePart rootPart = rootParts.get(0); 
			return rootPart; 
		}
	}

	//处理加减法法等级别为1的操作符，替换为函数
	private List<ExpTreePart> processOperatorLevel2(List<ExpTreePart> treeParts, List<String> errors){
		List<String> operators = new ArrayList<String>();
		operators.add("*");
		operators.add("/");
		return processOperatorLevel(treeParts, errors, operators);
	}

	//处理加减法法等级别为1的操作符，替换为函数
	private List<ExpTreePart> processOperatorLevel1(List<ExpTreePart> treeParts, List<String> errors){
		List<String> operators = new ArrayList<String>();
		operators.add("+");
		operators.add("-");
		operators.add(">");
		operators.add("=");
		operators.add("<");
		operators.add(">=");
		operators.add("<=");
		operators.add("&");
		//operators.add("||");
		operators.add("&&");
		return processOperatorLevel(treeParts, errors, operators);
	}
	
	//处理乘除法等级别为2的操作符
	private List<ExpTreePart> processOperatorLevel(List<ExpTreePart> treeParts, List<String> errors, List<String> operators){
		if(treeParts!=null){
			List<ExpTreePart> newTreeParts = new ArrayList<ExpTreePart>();
			List<Integer> operatorIndexs = new ArrayList<Integer>(); 
			for(int i=0;i<treeParts.size();i++){
				ExpTreePart p = treeParts.get(i);
				if(p.getPartType() == PartType.Operator){
					if(operators.contains(p.getText())) {
						operatorIndexs.add(i);						
					}
				}
			} 
			if(operatorIndexs.size()>0){ 
				for(int i=1;i<operatorIndexs.size();i++){
					if(operatorIndexs.get(i)-operatorIndexs.get(i-1)==1){
						errors.add("运算符" + treeParts.get(operatorIndexs.get(i-1)).getText() +"和"+ treeParts.get(operatorIndexs.get(i)).getText()+"不允许相邻");
					}
				}
				if(errors.size() == 0){
					int opIndex = 0;
					int i = 0;
					while(i < treeParts.size()) {
						if(opIndex < operatorIndexs.size()){
							if(i == operatorIndexs.get(opIndex)){
								ExpTreePart p = treeParts.get(i);
								String functionName = this.expEnvironment.getOperator(p.getText()).getFunctionName();
								ExpTreePart newPart = new ExpTreePart();
								newPart.setText(functionName);
								newPart.setParentPart(p.getParentPart());
								newPart.setPartType(PartType.Function);
								List<ExpTreePart> operatorChildParts = new ArrayList<ExpTreePart>();
								newPart.setAllChildParts(operatorChildParts);
								if(i>0){
									ExpTreePart previousPart = newTreeParts.get(newTreeParts.size()-1);
									previousPart.setParentPart(newPart);
									operatorChildParts.add(previousPart);
									newTreeParts.remove(newTreeParts.size()-1);
								}
								if(i>0 && i<treeParts.size()-1 ){ 
									ExpTreePart commaPart = new ExpTreePart();
									commaPart.setText(",");
									commaPart.setParentPart(newPart);
									commaPart.setPartType(PartType.Comma);
									operatorChildParts.add(commaPart); 
								} 
								if(i<treeParts.size()-1 ){
									ExpTreePart nextPart = treeParts.get(i+1);
									nextPart.setParentPart(newPart);
									operatorChildParts.add(nextPart);
									nextPart.setAllChildParts(processOperatorLevel(nextPart.getAllChildParts(), errors, operators));
								}
								newTreeParts.add(newPart);
								i=i+2;
								opIndex++; 
							}
							else if(i>=0){
								ExpTreePart p = treeParts.get(i);
								newTreeParts.add(p);
								p.setAllChildParts(processOperatorLevel(p.getAllChildParts(), errors, operators));
								i++;
							}
						}
						else{
							ExpTreePart p = treeParts.get(i);
							newTreeParts.add(p);
							p.setAllChildParts(processOperatorLevel(p.getAllChildParts(), errors, operators));
							i++;
						}
					}
				}
				return newTreeParts;
			}
			else{
				for(int i=0;i<treeParts.size();i++){
					ExpTreePart childPart =treeParts.get(i);
					childPart.setAllChildParts(processOperatorLevel(childPart.getAllChildParts(), errors, operators));					
				}
				return treeParts;
			}
		}
		else{
			return null;
		}
	}
	
	//处理逗号
	private List<ExpTreePart> processComma(List<ExpTreePart> treeParts, List<String> errors){
		if(treeParts != null && treeParts.size() > 0){
			List<Integer> commaIndexs = new ArrayList<Integer>();
			for(int i=0;i<treeParts.size();i++){
			   ExpTreePart p = treeParts.get(i);
			   if(p.getPartType() == PartType.Comma){
				   commaIndexs.add(i);
			   }
			   p.setAllChildParts(processComma(p.getAllChildParts(), errors));
			}
			if(commaIndexs.size() == 0){
				return treeParts;
			}
			else{
				List<ExpTreePart> newTreeParts = new ArrayList<ExpTreePart>();
				for(int j=0;j<=commaIndexs.size();j++){
					int beginIndex = (j==0 ? 0 : commaIndexs.get(j-1)+1);
					int endIndex = (j==commaIndexs.size()? treeParts.size()-1: commaIndexs.get(j)-1);
					if(beginIndex<=endIndex){
						ExpTreePart newPart = new ExpTreePart();
						newPart.setParentPart(treeParts.get(beginIndex).getParentPart());
						newPart.setPartType(PartType.Bracket);
						newPart.setText("()");
						newTreeParts.add(newPart);
						List<ExpTreePart> childParts = new ArrayList<ExpTreePart>();
						for(int k=beginIndex;k<=endIndex;k++){
							ExpTreePart tempPart = treeParts.get(k);
							childParts.add(tempPart);
							newPart.setAllChildParts(childParts);
						}
					}
					if(j<commaIndexs.size()){
						newTreeParts.add(treeParts.get(commaIndexs.get(j)));
					}
				}
				return newTreeParts;
			}
		}
		else{
			return null;
		}
	}
	
	//处理函数的括号
	private List<ExpTreePart> processFunctionBracket(List<ExpTreePart> treeParts, List<String> errors){
		if(treeParts != null && treeParts.size() > 0){
			List<ExpTreePart> newTreeParts = new ArrayList<ExpTreePart>();
			int i=0;
			while(i<treeParts.size()){
				ExpTreePart p = treeParts.get(i);
				if(p.getPartType() == PartType.Function){
					if(i+1 < treeParts.size()){
						ExpTreePart nextPart = treeParts.get(i+1);
						if(nextPart.getPartType() == PartType.Bracket){
							newTreeParts.add(p);
							List<ExpTreePart> childParts = nextPart.getAllChildParts();
							if(childParts != null){
								for(int j=0;j<childParts.size();j++){
									childParts.get(j).setParentPart(p);
								}
								p.setAllChildParts(processFunctionBracket(childParts, errors));
							}
						}
						else{
							errors.add("函数 " + p.getText() + " 后应为括号及参数");
						}
						i=i+2;
					}
					else{ 
						errors.add("函数 " + p.getText() + " 后应为括号及参数");
						break;
					} 
				}
				else{
					newTreeParts.add(p);
					List<ExpTreePart> childParts = p.getAllChildParts();
					p.setAllChildParts(processFunctionBracket(childParts, errors));
					i++;
				}
			}
			return newTreeParts;
		}
		else{
			return null;
		}
	}
	
	//处理括号
	private List<ExpTreePart> processBracket(List<ExpTreePart> allParts, List<String> errors){
		Map<ExpTreePart,ExpTreePart> bracketPairs= new HashMap<ExpTreePart, ExpTreePart>();
		List<ExpTreePart> stockParts = new ArrayList<ExpTreePart>();
		for(int i=0;i<allParts.size();i++){
			ExpTreePart p = allParts.get(i);
			if(p.getPartType() == PartType.Bracket){
				if(p.getText().equals("(")){
					stockParts.add(p);
				}
				else{ //为")"
					if(stockParts.size() == 0){
						errors.add("括号没有成对出现");
						break;
					}
					else{
						ExpTreePart beginPart = stockParts.get(stockParts.size()-1);
						stockParts.remove(stockParts.size()-1);
						bracketPairs.put(beginPart, p);
					}
				}
			}
		}
		if(stockParts.size() != 0){
			errors.add("括号没有成对出现");
			return null;
		}
		else{
			for(int i=0;i<allParts.size();i++){
				ExpTreePart p = allParts.get(i);
				if(p.getPartType() == PartType.Bracket){
					if(p.getText().equals("(")){					
						ExpTreePart endPart = bracketPairs.get(p);
						int endIndex = allParts.indexOf(endPart);
						for(int j=i+1;j<endIndex;j++){
							ExpTreePart innerPart = allParts.get(j);
							innerPart.setParentPart(p);
						}
					}
				}				
			}
			
			List<ExpTreePart> treeParts = new ArrayList<ExpTreePart>();
			for(int i=0;i<allParts.size();i++){
				ExpTreePart p = allParts.get(i);
				if(p.getParentPart() == null){
					if(p.getPartType() == PartType.Bracket){
						if(p.getText().equals("(")){
							p.setText("()");
							p.setAllChildParts(new ArrayList<ExpTreePart>());
							treeParts.add(p);
						}
						else{ //为")",放弃之
							//
						}
					}
					else{
						treeParts.add(p);
					}
				}
				else{
					if(p.getPartType() == PartType.Bracket){
						if(p.getText().equals("(")){
							p.setText("()");
							p.setAllChildParts(new ArrayList<ExpTreePart>());
							List<ExpTreePart> childParts = p.getParentPart().getAllChildParts();
							childParts.add(p);
						}
						else{ //为")",放弃之
							//
						}
					}
					else{
						List<ExpTreePart> childParts = p.getParentPart().getAllChildParts();
						childParts.add(p);
					}
				}
			}
			return treeParts;
		} 
	}
	
	//词法分析
	private List<ExpTreePart> splitParts(String exp, List<String> errors) {
		int i=0;
		int expLength = exp == null ? 0 : exp.length();
		String tempStr = ""; 
		boolean inStr = false; 
		List<ExpTreePart> allParts = new ArrayList<ExpTreePart>();
		while(i < expLength){
			String chr = exp.substring(i, i+1);
			if(inStr){ //如果现在正在字符串中	
				if(chr.equals("\\")){
					if(expLength > i+1){
						String nextChr = exp.substring(i+1, i+2);
						if(nextChr.equals("\\")){
							tempStr +=chr;
							i = i+2;
							continue;							
						}
						else if(nextChr.equals("\"")){
							tempStr +="\"";
							i = i+2;
							continue;	
						}
						else {
							errors.add("无法识别特殊字符\\" + nextChr);
							break;
						}
					}
					else{
						errors.add("出现未结束的字符串:" + tempStr);
						break;
					}
				}
				else if(chr.equals("\"")){ //如果遇到了"，之前的判断已经确保引号之前不是\，那么表示字符串结束了
					ExpTreePart p = createPart(tempStr, PartType.Constant, ExpCommonValueType.String);
					allParts.add(p);
					tempStr = "";
					inStr = false;
					i++;
					continue; 
				}
				else{ //正在字符串内，且未接收到"，那么继续拼接字符串
					tempStr += chr;
					i++;
					continue;
				}
			}
			else { //没有在字符串内
				if(chr.equals(",")){ //如果遇到了双引号，那么字符串开始
					if(tempStr.length() != 0){
						ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
						allParts.add(p);
						tempStr = "";
					}
					ExpTreePart p = createPart(chr, PartType.Comma, null);
					allParts.add(p); 
					i++; 
					continue;
				}
				else if(chr.equals("\"")){ //如果遇到了双引号，那么字符串开始
						if(tempStr.length() != 0){
							ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
							allParts.add(p);
							tempStr = "";
						}
						inStr = true;
						i++;
						continue;
					}
					else if(chr.equals(" ")){ //如果遇到了空格，那么前面的词结束
					if(tempStr.length() != 0){
						ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
						allParts.add(p);
						tempStr = "";
					} 
					i++;
					continue;
				}	
				else if(chr.equals("(") || chr.equals(")")){
					if(tempStr.length() != 0){
						ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
						allParts.add(p);
						tempStr = "";
					} 
					ExpTreePart p = createPart(chr, PartType.Bracket, null);
					allParts.add(p); 
					i++;
					continue;
				}		
				else if(chr.equals("=")){
					if(tempStr.length() != 0){
						ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
						allParts.add(p);
						tempStr = "";
					} 
					ExpTreePart p = createPart(chr, PartType.Operator, null);
					allParts.add(p); 
					i++;
					continue;
				}	
				else if(chr.equals(">") || chr.equals("<")){
					if(expLength > i+1){
						String nextChr = exp.substring(i+1, i+2);
						if(nextChr.equals("=")){		
							if(tempStr.length() != 0){
								ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
								allParts.add(p);
								tempStr = "";
							} 
							ExpTreePart p = createPart(chr + nextChr, PartType.Operator, null);
							allParts.add(p); 
							i=i+2;
							continue;
						}
						else{						
							if(tempStr.length() != 0){
								ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
								allParts.add(p);
								tempStr = "";
							} 
							ExpTreePart p = createPart(chr, PartType.Operator, null);
							allParts.add(p); 
							i++;
							continue;
						}
					}
					else{
						errors.add("出现未结束的操作符:" + tempStr);
						break;
					}
				}
				else{ 
					
					Operator op = expEnvironment.getOperator(chr);
					if(op == null){ //如果不是关键字，那么继续				
						tempStr += chr;
						i++;
						continue;
					}
					else {
						if(tempStr.length() != 0){
							ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
							allParts.add(p);
							tempStr = "";
						} 
						ExpTreePart p = createPart(chr, PartType.Operator, null);
						allParts.add(p); 
						i++;
						continue;
					}
				}
			}
		}
		 
		if(inStr){ 
			errors.add("出现未结束的字符串:" + tempStr);
		}
		else if(tempStr.length() != 0){
			ExpTreePart p = createPart(tempStr, PartType.Unknown, null);
			allParts.add(p); 
		} 
		return allParts;
	}

	//检验片段的类型
	private boolean checkPartType(List<ExpTreePart> allParts, Map<String, String> userParameterHash, List<String> errors){
		for(int i=0;i<allParts.size();i++){
			ExpTreePart p = allParts.get(i);
			checkPartType(p, userParameterHash);
			if(p.getPartType() ==PartType.Unknown){
				errors.add("无法识别的内容:" + p.getText());
			}
		}
		return errors.size() == 0;
	}
	
	//检验某个片段的类型
	private void checkPartType(ExpTreePart p, Map<String, String> userParameterHash){
		if(p.getPartType() == PartType.Unknown){ 
			if(expEnvironment.getFunction(p.getText().toLowerCase()) != null){ 
				p.setPartType(PartType.Function);
			}
			else if(userParameterHash !=null && userParameterHash.containsKey(p.getText().toLowerCase())){ 
				String valueType = userParameterHash.get(p.getText());
				p.setPartType(PartType.UserParameter);
				p.setResultType(valueType);
			}
			else if(ValueConverter.CheckDecimal(p.getText())){
				p.setPartType(PartType.Constant); 
				p.setResultType(ExpCommonValueType.Decimal);
			}
			else if(ValueConverter.CheckBoolean(p.getText())){
				p.setPartType(PartType.Constant); 
				p.setResultType(ExpCommonValueType.Boolean);
				p.setText(p.getText().toLowerCase());
			}
		}
	}
	
	public String toJsCode(ValidateResult validateResult) throws UnsupportedEncodingException{
		if(validateResult.getRunAt() == RunAt.Js || validateResult.getRunAt() == RunAt.All){
			return toJsCode(validateResult.getRootPart());
		}
		else{
			//不能运行在客户端
			throw new RuntimeException("无法将表达式转化为JS代码, 此表达式只允许运行在" + validateResult.getRunAt().toString());
		}
	}
	
	public String toJsCode(ExpTreePart part) throws UnsupportedEncodingException{
		PartType partType = part.getPartType();
		switch(partType){
			case Operator:
			case Function:{
				Function func = this.expEnvironment.getFunction(part.getText().toLowerCase());
				String name = func.getBeanName()+"."+func.getMethodName();
				return name + "(" + toJsCode(part.getAllChildParts()) +")";
			}
			case Bracket:{
				return "(" + toJsCode(part.getAllChildParts()) +")";
			}
			case Comma:{
				return ",";
			}
			case Constant:{
				String valueType = part.getResultType();
				String text = part.getText();
				if(valueType.equals(ExpCommonValueType.String)){
					text = CommonFunction.encode(CommonFunction.encode(text));
					return "decodeURIComponent(decodeURIComponent(\"" + text + "\"))";
				}
				return part.getText();			
			}
			case UserParameter:{
				return part.getText();
			} 

			case CellReferance:{
				CellReferanceInfo cellReferInfo = part.getCellRefInfo(); 
				return "runningEG.getCellValue(\"" + cellReferInfo.getColId() + "\", \"" + cellReferInfo.getRowId() + "\")";
			}
			 
			case RangeReferance:{
				CellReferanceInfo fromCellReferInfo = part.getFromCellRefInfo(); 
				CellReferanceInfo toCellReferInfo = part.getToCellRefInfo();  
				return "runningEG.getRangeValue(\"" + fromCellReferInfo.getColId() + "\", \"" + fromCellReferInfo.getRowId() + "\", \"" + toCellReferInfo.getColId() + "\", \"" + toCellReferInfo.getRowId() + "\")";
			}
			default:{
				throw new RuntimeException("获取片段js代码失败" + part.getText());
			}
		}
	}
	
	private String toJsCode(List<ExpTreePart> allParts) throws UnsupportedEncodingException{
		if(allParts == null){
			return "";
		}
		else{
			StringBuilder ss = new StringBuilder();
			for(int i=0;i<allParts.size();i++){
				ExpTreePart p = allParts.get(i);
				String s = this.toJsCode(p);
				ss.append(s);
			}
			return ss.toString();
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		
	}
}
