package com.novacloud.novaone.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

//系统配置
public class SysConfig {
	private static String timeFormat = "yyyy-MM-dd HH:mm:ss";
	public static String getTimeFormat() {
		return timeFormat;
	} 
	
	private static String dateFormat = "yyyy-MM-dd";
	public static String getDateFormat() {
		return dateFormat;
	} 
	
	private static String paramPrefix = ":";
	public static String getParamPrefix() {
		return paramPrefix;
	} 

	public static String getPropertyFileValue(String propertyFile,String propertyName) throws Exception{
        try {  
            InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream(propertyFile);
            Properties p = new Properties();
            p.load(is);
            String value = p.getProperty(propertyName); 
            is.close();
            return value;
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
	}
}
