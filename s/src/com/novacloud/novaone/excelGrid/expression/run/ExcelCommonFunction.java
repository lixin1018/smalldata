package com.novacloud.novaone.excelGrid.expression.run;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.Date;

import org.hibernate.Session;

import com.novacloud.novaone.dao.db.IDBParserAccess;
import com.novacloud.novaone.excelGrid.expression.definition.CellObject;
import com.novacloud.novaone.excelGrid.expression.definition.RangeArray; 

/*
 * excel常用公式函数
 */
public class ExcelCommonFunction extends ExternalBase{

	//求和
	public BigDecimal sum(RangeArray array){
		BigDecimal resultValue = new BigDecimal(0);
		Object[][] values = array.getValues();
		for(int i = 0; i < values.length; i++){
			Object[] rowValues = values[i];
			for(int j = 0; j < rowValues.length; j++){
				Object value = rowValues[j];
				if(value != null && !value.toString().isEmpty()){
					BigDecimal cellValue = new BigDecimal(value.toString());
					resultValue = resultValue.add(cellValue);
				}
			}
		}
		return resultValue;
	}
	
	//求平均
	public BigDecimal average(RangeArray array){
		BigDecimal resultValue = new BigDecimal(0);
		Object[][] values = array.getValues();
		int count = 0;
		for(int i = 0; i < values.length; i++){
			Object[] rowValues = values[i];
			for(int j = 0; j < rowValues.length; j++){
				Object value = rowValues[j];
				if(value != null){
					BigDecimal cellValue = (value instanceof BigDecimal) ? (BigDecimal)value :  new BigDecimal(value.toString());
					resultValue = resultValue.add(cellValue);
					count++;
				}
			}
		}
		resultValue = count == 0 ? null : resultValue.divide(new BigDecimal(count), 20, RoundingMode.HALF_DOWN);
		return resultValue;
	}
	
	//搜索获得区域内符合条件的值, 目前只支持精准匹配
	public Object vlookup(Object lookupValue, RangeArray array, BigDecimal colIndex, Object matchType){
		
		//目前只支持精准匹配
		
		if(lookupValue == null){
			return null;
		}
		else{ 
			Object[][] values = array.getValues(); 
			for(int i = 0; i < values.length; i++){
				Object[] row = values[i];
				Object toValue = row[0];
				if(lookupValue.equals(toValue)){
					Object destValue = row[colIndex.intValue() - 1];
					return destValue;
				}
			} 
			return null;
		}
	}
	
	//根据条件判断返回值
	public Object iff(Boolean checkValue, Object trueValue, Object falseValue){
		if(checkValue){
			return trueValue;
		}
		else{
			return falseValue;
		}
	}
	
	//运行sql获取字符串值
	public String getStringValueBySql(String sqlText) throws Exception{
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		Object resultValue = dbParserAccess.selectOne(dbSession, sqlText);
		if(resultValue == null || resultValue.getClass() == String.class ){
			return (String)resultValue;
		}
		else{
			throw new Exception("getStringValueBySql返回值不是字符串类型. SQLText = " + sqlText);
		}
	}

	//运行sql获取数值
	public BigDecimal getNumberValueBySql(String sqlText) throws SQLException{
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		Object resultValue = dbParserAccess.selectOne(dbSession, sqlText);
		BigDecimal ret = null;
    	if( resultValue != null ) {
    		if( resultValue instanceof BigDecimal ) {
                ret = (BigDecimal) resultValue;
            } 
    		else if( resultValue instanceof String ) {
                ret = new BigDecimal( (String) resultValue );
            } 
    		else if( resultValue instanceof BigInteger ) {
                ret = new BigDecimal( (BigInteger) resultValue );
            } 
    		else if( resultValue instanceof Number ) {
                ret = new BigDecimal( ((Number)resultValue).doubleValue() );
            } 
    		else {
                throw new ClassCastException("getNumberValueBySql返回值不是数值类型. SQLText = " + sqlText + ". Not possible to coerce [" + resultValue + "] from class " + resultValue.getClass() + " into a BigDecimal.");
            }
        }
        return ret;
	}

	//运行sql获取布尔类型值
	public Boolean getBooleanValueBySql(String sqlText) throws Exception{
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		Object resultValue = dbParserAccess.selectOne(dbSession, sqlText);
		if(resultValue == null || resultValue.getClass() == String.class ){
			return "Y".equals(resultValue);
		}
		else{
			throw new Exception("getBooleanValueBySql返回值不是布尔(字符串)类型. SQLText = " + sqlText);
		}
	}

	//运行sql获取日期值
	public Date getDateValueBySql(String sqlText) throws Exception{
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		Object resultValue = dbParserAccess.selectOne(dbSession, sqlText);
		if(resultValue == null || resultValue.getClass() == Date.class ){
			return (Date)resultValue;
		}
		else{
			throw new Exception("getBooleanValueBySql返回值不是布尔(字符串)类型. SQLText = " + sqlText);
		}
	}

	//运行sql获取时间值
	public Date getTimeValueBySql(String sqlText) throws Exception{
		Session dbSession = this.getDatabaseAccess().getSession();
		IDBParserAccess dbParserAccess = this.getDatabaseAccess().getDBParserAccess();
		Object resultValue = dbParserAccess.selectOne(dbSession, sqlText);
		if(resultValue == null || resultValue.getClass() == Date.class ){
			return (Date)resultValue;
		}
		else{
			throw new Exception("getBooleanValueBySql返回值不是布尔(字符串)类型. SQLText = " + sqlText);
		}
	}
}
